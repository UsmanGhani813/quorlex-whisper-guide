import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/industries")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("industries").select("*").order("sort_order");
    return { identity, industries: data ?? [] };
  },
  component: AdminIndustries,
});

function AdminIndustries() {
  const { identity, industries } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);
  const [editing, setEditing] = useState<string | null>(null);

  async function togglePublish(id: string, live: boolean) {
    await supabase
      .from("industries")
      .update({ published_at: live ? null : new Date().toISOString() })
      .eq("id", id);
    toast.success(live ? "Unpublished" : "Published");
    router.invalidate();
  }

  async function save(id: string, payload: Record<string, unknown>) {
    const { error } = await supabase.from("industries").update(payload).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    router.invalidate();
  }

  async function createOne() {
    const slug = prompt("Slug (URL segment, lowercase-with-dashes):");
    const name = prompt("Name:");
    if (!slug || !name) return;
    const { error } = await supabase
      .from("industries")
      .insert({ slug, name, sort_order: industries.length + 1 });
    if (error) return toast.error(error.message);
    toast.success("Created");
    router.invalidate();
  }

  async function del(id: string) {
    if (!confirm("Delete this industry permanently?")) return;
    await supabase.from("industries").delete().eq("id", id);
    toast.success("Deleted");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Industries"
        intro={`${industries.length} sectors`}
        actions={
          writable ? (
            <button
              onClick={createOne}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New industry
            </button>
          ) : null
        }
      />

      <div className="space-y-3">
        {industries.map((i) => {
          const live = !!(i.published_at && !i.archived_at);
          const isEdit = editing === i.id;
          return (
            <article key={i.id} className="rounded-xl border border-border bg-card p-5">
              {isEdit ? (
                <IndustryEditor
                  initial={i}
                  onCancel={() => setEditing(null)}
                  onSave={(payload) => save(i.id, payload)}
                />
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{i.name}</h3>
                      <span className="font-mono text-xs text-muted-foreground">/{i.slug}</span>
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
                    {i.body ? (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{i.body}</p>
                    ) : null}
                  </div>
                  {writable ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublish(i.id, live)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                      >
                        {live ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => setEditing(i.id)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                      >
                        Edit
                      </button>
                      {isSuperAdmin(identity.role) ? (
                        <button
                          onClick={() => del(i.id)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}

function IndustryEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: {
    name: string;
    slug: string;
    body: string | null;
    sort_order: number;
    seo_title: string | null;
    seo_description: string | null;
  };
  onCancel: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    slug: initial.slug,
    body: initial.body ?? "",
    sort_order: initial.sort_order,
    seo_title: initial.seo_title ?? "",
    seo_description: initial.seo_description ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    await onSave({
      name: form.name,
      slug: form.slug,
      body: form.body || null,
      sort_order: form.sort_order,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    });
    setSaving(false);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        value={form.slug}
        onChange={(ev) => setForm({ ...form, slug: ev.target.value })}
        placeholder="slug"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm font-mono"
      />
      <input
        value={form.name}
        onChange={(ev) => setForm({ ...form, name: ev.target.value })}
        placeholder="name"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      />
      <textarea
        value={form.body}
        onChange={(ev) => setForm({ ...form, body: ev.target.value })}
        placeholder="Short description"
        rows={3}
        className="rounded-md border border-input bg-background p-3 text-sm sm:col-span-2"
      />
      <input
        type="number"
        value={form.sort_order}
        onChange={(ev) => setForm({ ...form, sort_order: Number(ev.target.value) })}
        placeholder="sort order"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      />
      <input
        value={form.seo_title}
        onChange={(ev) => setForm({ ...form, seo_title: ev.target.value })}
        placeholder="SEO title"
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      />
      <textarea
        value={form.seo_description}
        onChange={(ev) => setForm({ ...form, seo_description: ev.target.value })}
        placeholder="SEO description"
        rows={2}
        className="rounded-md border border-input bg-background p-3 text-sm sm:col-span-2"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button
          onClick={onCancel}
          className="rounded-md border border-border px-3 py-1.5 text-xs"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
