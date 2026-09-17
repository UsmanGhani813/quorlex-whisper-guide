import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/process")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const [{ data: steps }, { data: outputs }] = await Promise.all([
      supabase.from("process_steps").select("*").order("step_number"),
      supabase.from("process_step_outputs").select("*").order("sort_order"),
    ]);
    return { identity, steps: steps ?? [], outputs: outputs ?? [] };
  },
  component: AdminProcess,
});

function AdminProcess() {
  const { identity, steps, outputs } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  async function updateStep(id: string, name: string, body: string) {
    const { error } = await supabase.from("process_steps").update({ name, body }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Process"
        intro={`${steps.length} steps in the delivery process`}
      />

      <div className="space-y-4">
        {steps.map((s) => {
          const stepOutputs = outputs
            .filter((o) => o.step_id === s.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          return (
            <section key={s.id} className="rounded-xl border border-border bg-card p-5">
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-semibold text-primary">
                    {String(s.step_number).padStart(2, "0")}
                  </span>
                  <input
                    defaultValue={s.name}
                    disabled={!writable}
                    onBlur={(ev) => {
                      if (ev.target.value !== s.name) updateStep(s.id, ev.target.value, s.body);
                    }}
                    className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm font-medium"
                  />
                </div>
                <textarea
                  defaultValue={s.body}
                  disabled={!writable}
                  onBlur={(ev) => {
                    if (ev.target.value !== s.body) updateStep(s.id, s.name, ev.target.value);
                  }}
                  rows={3}
                  className="rounded-md border border-input bg-background p-3 text-sm"
                />
                {stepOutputs.length ? (
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {stepOutputs.map((o) => (
                      <li
                        key={o.id}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {o.body}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Step outputs, reordering and adding new steps land in a follow-up session.
      </p>
    </AdminShell>
  );
}
