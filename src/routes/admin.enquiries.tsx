import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

export const Route = createFileRoute("/admin/enquiries")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    return { identity, enquiries: data ?? [] };
  },
  component: EnquiriesList,
});

function EnquiriesList() {
  const { identity, enquiries } = Route.useLoaderData();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${e.name} ${e.email} ${e.company ?? ""} ${e.message}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const current = selected ? enquiries.find((e) => e.id === selected) : null;
  const writable = canWrite(identity.role);

  async function updateStatus(id: string, next: Status) {
    const { error } = await supabase.from("enquiries").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    router.invalidate();
  }

  async function updateNotes(id: string, notes: string) {
    const { error } = await supabase.from("enquiries").update({ admin_notes: notes }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Notes saved");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Enquiries"
        intro={`${enquiries.length} total · ${
          enquiries.filter((e) => e.status === "new").length
        } new`}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search name, email, company or message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 flex-1 min-w-[220px] rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Received</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Company</th>
              <th className="p-3">Service</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No enquiries yet. When the contact form is used, they land here.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e.id)}
                  className={`cursor-pointer border-b border-border transition-colors hover:bg-surface ${
                    e.status === "new" ? "font-medium" : ""
                  }`}
                >
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.company ?? "—"}</td>
                  <td className="p-3">{e.service_name_snapshot ?? "—"}</td>
                  <td className="p-3">{e.budget ?? "—"}</td>
                  <td className="p-3">
                    <StatusBadge status={e.status as Status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-8 shadow-lg"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{current.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {current.email}
                  {current.company ? ` · ${current.company}` : ""}
                  {current.phone ? ` · ${current.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Received {new Date(current.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md border border-border px-3 py-1.5 text-xs"
              >
                Close
              </button>
            </div>

            <div className="grid gap-2 rounded-md border border-border bg-surface p-3 text-xs sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Service</p>
                <p className="font-medium">{current.service_name_snapshot ?? "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget</p>
                <p className="font-medium">{current.budget ?? "—"}</p>
              </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold">Message</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-sm leading-relaxed">
              {current.message}
            </p>

            {writable ? (
              <>
                <h3 className="mt-6 text-sm font-semibold">Status</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(current.id, s)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        current.status === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <NotesEditor
                  initial={current.admin_notes ?? ""}
                  onSave={(notes) => updateNotes(current.id, notes)}
                />
              </>
            ) : (
              <>
                <h3 className="mt-6 text-sm font-semibold">Status</h3>
                <p className="mt-2 text-sm">
                  <StatusBadge status={current.status as Status} />
                </p>
                {current.admin_notes ? (
                  <>
                    <h3 className="mt-6 text-sm font-semibold">Notes</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {current.admin_notes}
                    </p>
                  </>
                ) : null}
              </>
            )}

            <p className="mt-6 text-xs text-muted-foreground">
              <a href={`mailto:${current.email}`} className="text-primary underline">
                Reply by email
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const color: Record<Status, string> = {
    new: "bg-primary/15 text-primary",
    contacted: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    qualified: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    proposal: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    won: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    lost: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${color[status]}`}>
      {status}
    </span>
  );
}

function NotesEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (notes: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handle() {
    setSaving(true);
    await onSave(value);
    setSaving(false);
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold">Internal notes</h3>
      <textarea
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        rows={4}
        placeholder="Not visible to the client. Only admins see this."
        className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={handle}
        disabled={saving || value === initial}
        className="mt-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save notes"}
      </button>
    </div>
  );
}
