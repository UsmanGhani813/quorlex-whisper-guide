import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layout } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/shell";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  published_at: string | null;
  archived_at: string | null;
};

export const Route = createFileRoute("/admin/sections")({
  component: SectionsIndex,
});

function SectionsIndex() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: pagesData }, { data: sectionsData }] = await Promise.all([
        supabase.from("pages").select("id, slug, title, kind, published_at, archived_at").order("slug"),
        // @ts-expect-error not yet typed
        supabase.from("page_sections").select("page_id"),
      ]);
      const c: Record<string, number> = {};
      for (const s of (sectionsData ?? []) as { page_id: string }[]) {
        c[s.page_id] = (c[s.page_id] ?? 0) + 1;
      }
      setPages((pagesData ?? []) as PageRow[]);
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Page sections"
        intro="Add, reorder, enable or disable the blocks that make up each landing page. Section content lives in the page_sections table."
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Link
              key={p.id}
              to="/admin/sections/$pageSlug"
              params={{ pageSlug: p.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <Layout className="mb-3 h-4 w-4 text-primary" />
              <div className="text-base font-semibold">{p.title}</div>
              <div className="mt-0.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                /{p.slug} · {p.kind}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {counts[p.id] ?? 0} section(s){" "}
                {p.published_at ? "· published" : "· draft"}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Edit sections <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
