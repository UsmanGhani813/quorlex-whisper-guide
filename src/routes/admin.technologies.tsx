import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/technologies")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const [{ data: groups }, { data: techs }] = await Promise.all([
      supabase.from("technology_groups").select("*").order("sort_order"),
      supabase.from("technologies").select("*").order("sort_order"),
    ]);
    return { identity, groups: groups ?? [], techs: techs ?? [] };
  },
  component: AdminTechnologies,
});

function AdminTechnologies() {
  const { identity, groups, techs } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  async function addTech(groupId: string) {
    const name = prompt("Technology name:");
    if (!name) return;
    const nextOrder =
      Math.max(0, ...techs.filter((t) => t.group_id === groupId).map((t) => t.sort_order)) + 1;
    await supabase.from("technologies").insert({
      group_id: groupId,
      name,
      sort_order: nextOrder,
      published_at: new Date().toISOString(),
    });
    toast.success("Added");
    router.invalidate();
  }

  async function del(id: string) {
    if (!confirm("Delete this technology?")) return;
    await supabase.from("technologies").delete().eq("id", id);
    toast.success("Deleted");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Technologies"
        intro={`${groups.length} groups · ${techs.length} technologies`}
      />

      <div className="space-y-6">
        {groups.map((g) => {
          const items = techs.filter((t) => t.group_id === g.id);
          return (
            <section key={g.id} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-wide text-primary">{g.name}</h2>
                {writable ? (
                  <button
                    onClick={() => addTech(g.id)}
                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:border-primary/40"
                  >
                    + Add
                  </button>
                ) : null}
              </div>
              <ul className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {t.name}
                    {writable ? (
                      <button
                        onClick={() => del(t.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
