import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/admins")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("admin_users").select("*").order("created_at");
    return { identity, admins: data ?? [] };
  },
  component: AdminAdmins,
});

function AdminAdmins() {
  const { identity, admins } = Route.useLoaderData();
  const router = useRouter();
  const iamSuper = isSuperAdmin(identity.role);

  async function updateRole(id: string, role: string) {
    const { error } = await supabase.from("admin_users").update({ role }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Role updated");
    router.invalidate();
  }

  async function toggleActive(id: string, isActive: boolean) {
    const { error } = await supabase
      .from("admin_users")
      .update({ is_active: !isActive })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(isActive ? "Deactivated" : "Reactivated");
    router.invalidate();
  }

  async function del(id: string) {
    if (id === identity.user.id) {
      toast.error("You cannot delete yourself");
      return;
    }
    if (!confirm("Remove this admin? Their login is preserved but they lose admin access.")) return;
    await supabase.from("admin_users").delete().eq("id", id);
    toast.success("Removed");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Admins"
        intro={`${admins.length} admin account${admins.length === 1 ? "" : "s"}`}
      />

      {!iamSuper ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-muted-foreground">
            Only super admins can add or change admin accounts. You can view this list only.
          </p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Added</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => {
              const isMe = a.id === identity.user.id;
              return (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <span className="font-medium">{a.full_name ?? "—"}</span>
                    {isMe ? (
                      <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                        YOU
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3">
                    {iamSuper && !isMe ? (
                      <select
                        value={a.role}
                        onChange={(ev) => updateRole(a.id, ev.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="super_admin">super_admin</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </select>
                    ) : (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                        {a.role.replace("_", " ")}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        a.is_active
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.is_active ? "active" : "inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {iamSuper && !isMe ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleActive(a.id, a.is_active)}
                          className="rounded-md border border-border px-3 py-1 text-xs hover:border-primary/40"
                        >
                          {a.is_active ? "Deactivate" : "Reactivate"}
                        </button>
                        <button
                          onClick={() => del(a.id)}
                          className="rounded-md border border-destructive/60 px-3 py-1 text-xs text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {iamSuper ? (
        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-primary">Invite a new admin</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Supabase does not allow the client to create auth users directly. To add another admin:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs text-muted-foreground">
            <li>
              Open the Supabase dashboard → Auth → Users → <strong>Add user</strong>. Set email and
              a temporary password.
            </li>
            <li>
              Copy the newly created user's UUID (from the Users list).
            </li>
            <li>
              Come back here and run this SQL in the Supabase SQL editor, replacing the values:
              <pre className="mt-2 whitespace-pre-wrap rounded-md bg-surface p-3 font-mono text-[11px]">
{`INSERT INTO public.admin_users (id, role, full_name)
VALUES ('<UUID>', 'editor', '<Full Name>');`}
              </pre>
            </li>
            <li>Share the login URL and temporary password with them; they change it on first login.</li>
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            A proper invite flow via edge function is a Phase 10 item.
          </p>
        </section>
      ) : null}
    </AdminShell>
  );
}
