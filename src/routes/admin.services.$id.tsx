import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

const BULLET_KINDS = [
  { key: "include", label: "Includes" },
  { key: "exclude", label: "Excludes" },
  { key: "deliverable", label: "Deliverables" },
  { key: "benefit", label: "Benefits" },
] as const;

type BulletKind = (typeof BULLET_KINDS)[number]["key"];

export const Route = createFileRoute("/admin/services/$id")({
  loader: async ({ params }) => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");

    if (params.id === "new") {
      return { identity, service: null, bullets: [] };
    }

    const [{ data: service }, { data: bullets }] = await Promise.all([
      supabase.from("services").select("*").eq("id", params.id).maybeSingle(),
      supabase
        .from("service_bullets")
        .select("*")
        .eq("service_id", params.id)
        .order("sort_order"),
    ]);
    return { identity, service, bullets: bullets ?? [] };
  },
  component: AdminServiceEdit,
});

type ServiceForm = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  problem: string;
  solution: string;
  timeline: string;
  is_core: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  archived_at: string | null;
};

function AdminServiceEdit() {
  const { identity, service, bullets: initialBullets } = Route.useLoaderData();
  const params = Route.useParams();
  const isNew = params.id === "new";
  const navigate = useNavigate();
  const router = useRouter();
  const writable = canWrite(identity.role);

  const [form, setForm] = useState<ServiceForm>({
    slug: service?.slug ?? "",
    name: service?.name ?? "",
    short: service?.short ?? "",
    summary: service?.summary ?? "",
    problem: service?.problem ?? "",
    solution: service?.solution ?? "",
    timeline: service?.timeline ?? "",
    is_core: service?.is_core ?? false,
    sort_order: service?.sort_order ?? 0,
    seo_title: service?.seo_title ?? "",
    seo_description: service?.seo_description ?? "",
    published_at: service?.published_at ?? null,
    archived_at: service?.archived_at ?? null,
  });
  const [bullets, setBullets] = useState(initialBullets);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      slug: form.slug,
      name: form.name,
      short: form.short || null,
      summary: form.summary || null,
      problem: form.problem || null,
      solution: form.solution || null,
      timeline: form.timeline || null,
      is_core: form.is_core,
      sort_order: form.sort_order,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.published_at,
      archived_at: form.archived_at,
    };

    if (isNew) {
      const { data, error } = await supabase.from("services").insert(payload).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Service created");
      navigate({ to: "/admin/services/$id", params: { id: data.id } });
      return;
    }

    const { error } = await supabase.from("services").update(payload).eq("id", service!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.invalidate();
  }

  async function togglePublish() {
    if (isNew) {
      toast.error("Save the service first");
      return;
    }
    const next = form.published_at ? null : new Date().toISOString();
    setForm({ ...form, published_at: next });
    const { error } = await supabase
      .from("services")
      .update({ published_at: next })
      .eq("id", service!.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Published" : "Unpublished");
    router.invalidate();
  }

  async function toggleArchive() {
    if (isNew) return;
    const next = form.archived_at ? null : new Date().toISOString();
    setForm({ ...form, archived_at: next });
    const { error } = await supabase
      .from("services")
      .update({ archived_at: next })
      .eq("id", service!.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Archived" : "Restored");
    router.invalidate();
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this service? This cannot be undone.")) return;
    const { error } = await supabase.from("services").delete().eq("id", service!.id);
    if (error) return toast.error(error.message);
    toast.success("Service deleted");
    navigate({ to: "/admin/services" });
  }

  async function addBullet(kind: BulletKind) {
    if (isNew) return;
    const nextOrder =
      Math.max(0, ...bullets.filter((b) => b.kind === kind).map((b) => b.sort_order)) + 1;
    const { data, error } = await supabase
      .from("service_bullets")
      .insert({ service_id: service!.id, kind, body: "New item", sort_order: nextOrder })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setBullets([...bullets, data]);
  }

  async function updateBullet(id: string, body: string) {
    const { error } = await supabase.from("service_bullets").update({ body }).eq("id", id);
    if (error) return toast.error(error.message);
    setBullets(bullets.map((b) => (b.id === id ? { ...b, body } : b)));
  }

  async function deleteBullet(id: string) {
    const { error } = await supabase.from("service_bullets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setBullets(bullets.filter((b) => b.id !== id));
  }

  const status = form.archived_at
    ? "archived"
    : form.published_at
      ? "published"
      : "draft";

  return (
    <AdminShell identity={identity}>
      <Link
        to="/admin/services"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All services
      </Link>

      <AdminPageHeader
        title={isNew ? "New service" : form.name || "Untitled"}
        intro={
          isNew
            ? "Save first, then add bullets and technologies."
            : `Status: ${status}${service && !isNew ? ` · ${service.slug}` : ""}`
        }
        actions={
          writable ? (
            <>
              {!isNew ? (
                <>
                  <button
                    onClick={togglePublish}
                    className="rounded-md border border-border px-3 py-2 text-xs font-medium hover:border-primary/40"
                  >
                    {form.published_at ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={toggleArchive}
                    className="rounded-md border border-border px-3 py-2 text-xs font-medium hover:border-primary/40"
                  >
                    {form.archived_at ? "Restore" : "Archive"}
                  </button>
                  {isSuperAdmin(identity.role) ? (
                    <button
                      onClick={handleDelete}
                      className="rounded-md border border-destructive/60 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </button>
                  ) : null}
                </>
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
        <Group title="Basics">
          <TextField label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
          <TextField label="Name" value={form.name} onChange={(v) => update("name", v)} />
          <TextArea
            label="Short (grid card)"
            value={form.short}
            onChange={(v) => update("short", v)}
            rows={2}
          />
          <TextArea
            label="Summary (detail hero)"
            value={form.summary}
            onChange={(v) => update("summary", v)}
            rows={3}
          />
          <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={form.is_core}
              onChange={(ev) => update("is_core", ev.target.checked)}
            />
            <span>Core service (shown on home page grid)</span>
          </label>
          <label className="block">
            <span className="text-xs font-medium">Sort order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(ev) => update("sort_order", Number(ev.target.value))}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
        </Group>

        <Group title="Narrative">
          <TextArea label="Problem" value={form.problem} onChange={(v) => update("problem", v)} rows={4} />
          <TextArea label="Solution" value={form.solution} onChange={(v) => update("solution", v)} rows={4} />
          <TextField label="Timeline" value={form.timeline} onChange={(v) => update("timeline", v)} />
        </Group>

        <Group title="SEO">
          <TextField label="SEO title" value={form.seo_title} onChange={(v) => update("seo_title", v)} />
          <TextArea
            label="SEO description"
            value={form.seo_description}
            onChange={(v) => update("seo_description", v)}
            rows={2}
          />
        </Group>

        {!isNew ? (
          <Group title="Bullet points">
            {BULLET_KINDS.map((k) => {
              const items = bullets
                .filter((b) => b.kind === k.key)
                .sort((a, b) => a.sort_order - b.sort_order);
              return (
                <div key={k.key} className="rounded-lg border border-border bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{k.label}</h3>
                    {writable ? (
                      <button
                        onClick={() => addBullet(k.key)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs hover:border-primary/40"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    ) : null}
                  </div>
                  <ul className="space-y-2">
                    {items.length === 0 ? (
                      <li className="text-xs text-muted-foreground">Nothing yet.</li>
                    ) : (
                      items.map((b) => (
                        <li key={b.id} className="flex items-start gap-2">
                          <input
                            defaultValue={b.body}
                            onBlur={(ev) => {
                              if (ev.target.value !== b.body) updateBullet(b.id, ev.target.value);
                            }}
                            className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                          />
                          {writable ? (
                            <button
                              onClick={() => deleteBullet(b.id)}
                              className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          ) : null}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              );
            })}
          </Group>
        ) : null}
      </fieldset>
    </AdminShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-sm font-semibold text-primary">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function TextField({
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
