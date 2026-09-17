import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/projects")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    return { identity, projects: data ?? [] };
  },
  component: AdminProjects,
});

function AdminProjects() {
  const { identity, projects } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);
  const demoCount = projects.filter((p) => p.is_demo).length;

  async function togglePublish(id: string, live: boolean) {
    await supabase
      .from("projects")
      .update({ published_at: live ? null : new Date().toISOString() })
      .eq("id", id);
    toast.success(live ? "Unpublished" : "Published");
    router.invalidate();
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await supabase.from("projects").update({ is_featured: !featured }).eq("id", id);
    toast.success(featured ? "Unfeatured" : "Featured");
    router.invalidate();
  }

  async function del(id: string) {
    if (!confirm("Delete this project permanently?")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast.success("Deleted");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Portfolio"
        intro={`${projects.length} projects${demoCount ? ` · ${demoCount} demo` : ""}`}
        actions={
          writable ? (
            <Link
              to="/admin/projects/$id"
              params={{ id: "new" }}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New project
            </Link>
          ) : null
        }
      />

      {demoCount > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm">
            <strong>{demoCount} demo projects</strong> are illustrative placeholders. Replace them
            with real client engagements before public launch, or unpublish the placeholder ones.
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        {projects.map((p) => {
          const live = !!(p.published_at && !p.archived_at);
          return (
            <article key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/admin/projects/$id"
                      params={{ id: p.id }}
                      className="font-medium hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                    {p.is_demo ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                        DEMO
                      </span>
                    ) : null}
                    {p.is_featured ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        FEATURED
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        live
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {live ? "live" : "draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.client} · {p.market} · {p.kind.replace("_", " ")}
                  </p>
                  {p.summary ? (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                  ) : null}
                </div>
                {writable ? (
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/admin/projects/$id"
                      params={{ id: p.id }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                    <button
                      onClick={() => toggleFeatured(p.id, p.is_featured)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                    >
                      {p.is_featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => togglePublish(p.id, live)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                    >
                      {live ? "Unpublish" : "Publish"}
                    </button>
                    {isSuperAdmin(identity.role) ? (
                      <button
                        onClick={() => del(p.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-destructive/60 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Click a project's name to open the full case-study editor: narrative, bullet points,
        obstacles, metrics, and links to services and technologies.
      </p>
    </AdminShell>
  );
}
