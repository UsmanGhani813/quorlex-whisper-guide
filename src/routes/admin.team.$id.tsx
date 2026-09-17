import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/team/$id")({
  loader: async ({ params }) => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const [{ data: departments }, memberRes] = await Promise.all([
      supabase.from("team_departments").select("*").order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: null })
        : supabase.from("team_members").select("*").eq("id", params.id).maybeSingle(),
    ]);
    return { identity, departments: departments ?? [], member: memberRes.data };
  },
  component: AdminTeamEdit,
});

function AdminTeamEdit() {
  const { identity, departments, member } = Route.useLoaderData();
  const params = Route.useParams();
  const isNew = params.id === "new";
  const navigate = useNavigate();
  const router = useRouter();
  const writable = canWrite(identity.role);

  const [form, setForm] = useState({
    name: member?.name ?? "",
    title: member?.title ?? "",
    department_id: member?.department_id ?? (departments[0]?.id ?? ""),
    location: member?.location ?? "",
    bio: member?.bio ?? "",
    experience: member?.experience ?? "",
    sort_order: member?.sort_order ?? 0,
    is_demo: member?.is_demo ?? false,
    published_at: member?.published_at ?? null,
    archived_at: member?.archived_at ?? null,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const payload = {
      name: form.name,
      title: form.title,
      department_id: form.department_id || null,
      location: form.location || null,
      bio: form.bio || null,
      experience: form.experience || null,
      sort_order: form.sort_order,
      is_demo: form.is_demo,
      published_at: form.published_at,
      archived_at: form.archived_at,
    };
    if (isNew) {
      const { data, error } = await supabase.from("team_members").insert(payload).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Member created");
      navigate({ to: "/admin/team/$id", params: { id: data.id } });
      return;
    }
    const { error } = await supabase.from("team_members").update(payload).eq("id", member!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.invalidate();
  }

  async function togglePublish() {
    if (isNew) return;
    const next = form.published_at ? null : new Date().toISOString();
    setForm({ ...form, published_at: next });
    await supabase.from("team_members").update({ published_at: next }).eq("id", member!.id);
    toast.success(next ? "Published" : "Unpublished");
    router.invalidate();
  }

  async function handleDelete() {
    if (!confirm("Delete this team member permanently?")) return;
    await supabase.from("team_members").delete().eq("id", member!.id);
    toast.success("Deleted");
    navigate({ to: "/admin/team" });
  }

  return (
    <AdminShell identity={identity}>
      <Link
        to="/admin/team"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All members
      </Link>

      <AdminPageHeader
        title={isNew ? "New team member" : form.name || "Untitled"}
        intro={isNew ? undefined : form.published_at ? "Live" : "Draft"}
        actions={
          writable ? (
            <>
              {!isNew ? (
                <button
                  onClick={togglePublish}
                  className="rounded-md border border-border px-3 py-2 text-xs font-medium hover:border-primary/40"
                >
                  {form.published_at ? "Unpublish" : "Publish"}
                </button>
              ) : null}
              {!isNew && isSuperAdmin(identity.role) ? (
                <button
                  onClick={handleDelete}
                  className="rounded-md border border-destructive/60 px-3 py-2 text-xs font-medium text-destructive"
                >
                  Delete
                </button>
              ) : null}
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </>
          ) : null
        }
      />

      <fieldset disabled={!writable} className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-primary">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Text label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <label className="block">
              <span className="text-xs font-medium">Department</span>
              <select
                value={form.department_id ?? ""}
                onChange={(ev) => setForm({ ...form, department_id: ev.target.value })}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">(none)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <Text
              label="Location"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            <Text
              label="Experience"
              value={form.experience}
              onChange={(v) => setForm({ ...form, experience: v })}
            />
            <label className="block">
              <span className="text-xs font-medium">Sort order</span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(ev) =>
                  setForm({ ...form, sort_order: Number(ev.target.value) })
                }
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <TextArea
              label="Bio"
              value={form.bio}
              onChange={(v) => setForm({ ...form, bio: v })}
              rows={4}
            />
            <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_demo}
                onChange={(ev) => setForm({ ...form, is_demo: ev.target.checked })}
              />
              <span>Demo placeholder profile (shows DEMO badge in list)</span>
            </label>
          </div>
        </section>
      </fieldset>
    </AdminShell>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      <input
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className="text-xs font-medium">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(ev) => onChange(ev.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
