import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/team")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const [{ data: departments }, { data: members }] = await Promise.all([
      supabase.from("team_departments").select("*").order("sort_order"),
      supabase.from("team_members").select("*").order("sort_order"),
    ]);
    return { identity, departments: departments ?? [], members: members ?? [] };
  },
  component: AdminTeam,
});

function AdminTeam() {
  const { identity, departments, members } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  async function togglePublish(id: string, currentlyPublished: boolean) {
    const { error } = await supabase
      .from("team_members")
      .update({ published_at: currentlyPublished ? null : new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(currentlyPublished ? "Unpublished" : "Published");
    router.invalidate();
  }

  async function deleteMember(id: string, name: string) {
    if (!confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    router.invalidate();
  }

  const demoCount = members.filter((m) => m.is_demo).length;

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Team"
        intro={`${members.length} members${demoCount ? ` · ${demoCount} demo` : ""}`}
        actions={
          writable ? (
            <Link
              to="/admin/team/$id"
              params={{ id: "new" }}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New member
            </Link>
          ) : null
        }
      />

      {demoCount > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm">
            <strong>{demoCount} demo team members</strong> are seeded from the original site.
            Replace them with real Quorlex Soft staff before public launch, or unpublish the ones
            you cannot verify.
          </p>
        </div>
      ) : null}

      <div className="space-y-8">
        {departments.map((d) => {
          const inDept = members.filter((m) => m.department_id === d.id);
          if (inDept.length === 0) return null;
          return (
            <section key={d.id}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-primary">
                {d.name}
              </h2>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {inDept.map((m) => {
                      const live = !!(m.published_at && !m.archived_at);
                      return (
                        <tr key={m.id} className="border-b border-border last:border-0">
                          <td className="p-3">
                            <Link
                              to="/admin/team/$id"
                              params={{ id: m.id }}
                              className="font-medium hover:text-primary"
                            >
                              {m.name}
                            </Link>
                            {m.is_demo ? (
                              <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                                DEMO
                              </span>
                            ) : null}
                          </td>
                          <td className="p-3 text-muted-foreground">{m.title}</td>
                          <td className="p-3 text-muted-foreground">{m.location ?? "—"}</td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                live
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {live ? "live" : "draft"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              {writable ? (
                                <>
                                  <Link
                                    to="/admin/team/$id"
                                    params={{ id: m.id }}
                                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary/40"
                                  >
                                    <Pencil className="h-3 w-3" /> Edit
                                  </Link>
                                  <button
                                    onClick={() => togglePublish(m.id, live)}
                                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary/40"
                                  >
                                    {live ? "Unpublish" : "Publish"}
                                  </button>
                                </>
                              ) : null}
                              {isSuperAdmin(identity.role) ? (
                                <button
                                  onClick={() => deleteMember(m.id, m.name)}
                                  className="inline-flex items-center gap-1 rounded-md border border-destructive/50 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
