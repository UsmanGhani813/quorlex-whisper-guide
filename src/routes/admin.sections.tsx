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
  component: SectionsIndex,
  ssr: false,
});

type Identity = Awaited<ReturnType<typeof fetchAdminIdentity>>;

function SectionsIndex() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState<Identity>(null);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await fetchAdminIdentity();
        if (cancelled) return;
        if (!id) {
          navigate({ to: "/admin/login" });
          return;
        }
        setIdentity(id);

        const [{ data: pagesData, error: pagesErr }, { data: sectionsData }] = await Promise.all([
          supabase
            .from("pages")
            .select("id, slug, title, kind, published_at, archived_at")
            .eq("kind", "landing")
            .order("slug"),
          // @ts-expect-error not yet in generated types
          supabase.from("page_sections").select("page_id"),
        ]);
        if (cancelled) return;
        if (pagesErr) throw pagesErr;

        const c: Record<string, number> = {};
        for (const s of (sectionsData ?? []) as { page_id: string }[]) {
          c[s.page_id] = (c[s.page_id] ?? 0) + 1;
        }
        setPages((pagesData ?? []) as PageRow[]);
        setCounts(c);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!identity) {
    return <div className="p-8 text-sm text-muted-foreground">Loading admin session…</div>;
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Page sections"
        intro="Pick a landing page, then add, reorder, enable or disable its section blocks."
      />

      <div className="mb-6 rounded-lg border border-border bg-card p-4 text-sm">
        <p className="font-medium">Which pages appear here?</p>
        <p className="mt-1 text-muted-foreground">
          Only <span className="font-mono">landing</span> pages (currently{" "}
          <span className="font-mono">/</span>, <span className="font-mono">/founder</span> and{" "}
          <span className="font-mono">/insights</span>). Marketing and legal pages like{" "}
          <span className="font-mono">/about</span>, <span className="font-mono">/faq</span>,{" "}
          <span className="font-mono">/privacy</span>, <span className="font-mono">/terms</span>{" "}
          have their own body-text editor —{" "}
          <Link to="/admin/pages" className="text-primary underline underline-offset-4">
            edit them in Admin → Pages
          </Link>
          .
        </p>
      </div>
      {loadError ? (
        <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : pages.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
          No landing pages yet.
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
