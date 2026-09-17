import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/jobs")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("jobs").select("*").order("sort_order");
    return { identity, jobs: data ?? [] };
  },
  component: AdminJobs,
});

function AdminJobs() {
  const { identity, jobs } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  async function togglePublish(id: string, live: boolean) {
    await supabase
      .from("jobs")
      .update({ published_at: live ? null : new Date().toISOString() })
      .eq("id", id);
    toast.success(live ? "Unpublished" : "Published");
    router.invalidate();
  }


  async function del(id: string) {
    if (!confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    toast.success("Deleted");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Jobs"
        intro={`${jobs.length} openings`}
        actions={
          writable ? (
            <Link
              to="/admin/jobs/$id"
              params={{ id: "new" }}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New job
            </Link>
          ) : null
        }
      />

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No open roles yet. Create one and publish it when it is ready.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => {
            const live = !!(j.published_at && !j.archived_at);
            return (
              <article key={j.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/admin/jobs/$id"
                        params={{ id: j.id }}
                        className="font-medium hover:text-primary"
                      >
                        {j.title}
                      </Link>
                      <span className="font-mono text-xs text-muted-foreground">/{j.slug}</span>
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
                      {j.employment_type.replace("_", " ")}
                      {j.location ? ` · ${j.location}` : ""}
                    </p>
                  </div>
                  {writable ? (
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/admin/jobs/$id"
                        params={{ id: j.id }}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      <button
                        onClick={() => togglePublish(j.id, live)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs"
                      >
                        {live ? "Unpublish" : "Publish"}
                      </button>
                      {isSuperAdmin(identity.role) ? (
                        <button
                          onClick={() => del(j.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-destructive/60 px-3 py-1.5 text-xs text-destructive"
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
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Click a job title to edit its full description, responsibilities, requirements and benefits.
      </p>
    </AdminShell>
  );
}
