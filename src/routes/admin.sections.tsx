import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Layout } from "lucide-react";

import { fetchAdminIdentity } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  published_at: string | null;
  archived_at: string | null;
};

export const Route = createFileRoute("/admin/sections")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    return { identity };
  },
  component: SectionsIndex,
});

function SectionsIndex() {
  const { identity } = Route.useLoaderData();
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: pagesData }, { data: sectionsData }] = await Promise.all([
        supabase
          .from("pages")
          .select("id, slug, title, kind, published_at, archived_at")
          .order("slug"),
        // @ts-expect-error not yet in generated types
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
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Page sections"
        intro="Pick a page, then add, reorder, enable or disable its section blocks."
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : pages.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
          No pages yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <Layout className="mb-3 h-4 w-4 text-primary" />
              <div className="text-base font-semibold">{p.title}</div>
              <div className="mt-0.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                /{p.slug} · {p.kind}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {counts[p.id] ?? 0} section(s) ·{" "}
                {p.published_at ? "published" : "draft"}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/admin/sections/$pageSlug",
                      params: { pageSlug: p.slug },
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Edit sections <ArrowRight className="h-3 w-3" />
                </button>
                <Link
                  to="/admin/sections/$pageSlug"
                  params={{ pageSlug: p.slug }}
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
