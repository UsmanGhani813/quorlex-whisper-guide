import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

const CHILD_TABLES = [
  { table: "job_responsibilities", label: "Responsibilities" },
  { table: "job_requirements", label: "Requirements" },
  { table: "job_benefits", label: "Benefits" },
] as const;

type ChildTable = (typeof CHILD_TABLES)[number]["table"];

const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "internship", "freelance"] as const;

export const Route = createFileRoute("/admin/jobs/$id")({
  loader: async ({ params }) => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");

    const [departments, job, responsibilities, requirements, benefits] = await Promise.all([
      supabase.from("job_departments").select("id,name").order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: null })
        : supabase.from("jobs").select("*").eq("id", params.id).maybeSingle(),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase
            .from("job_responsibilities")
            .select("*")
            .eq("job_id", params.id)
            .order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase
            .from("job_requirements")
            .select("*")
            .eq("job_id", params.id)
            .order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("job_benefits").select("*").eq("job_id", params.id).order("sort_order"),
    ]);

    return {
      identity,
      departments: departments.data ?? [],
      job: job.data,
      children: {
        job_responsibilities: responsibilities.data ?? [],
        job_requirements: requirements.data ?? [],
        job_benefits: benefits.data ?? [],
      },
    };
  },
  component: AdminJobEdit,
});

type JobForm = {
  slug: string;
  title: string;
  department_id: string | null;
  location: string;
  employment_type: (typeof EMPLOYMENT_TYPES)[number];
  description: string;
  apply_email: string;
  apply_url: string;
  application_deadline: string;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  archived_at: string | null;
};

function AdminJobEdit() {
  const { identity, departments, job, children } = Route.useLoaderData();
  const params = Route.useParams();
  const isNew = params.id === "new";
  const navigate = useNavigate();
  const router = useRouter();
  const writable = canWrite(identity.role);

  const [form, setForm] = useState<JobForm>({
    slug: job?.slug ?? "",
    title: job?.title ?? "",
    department_id: job?.department_id ?? null,
    location: job?.location ?? "",
    employment_type: (job?.employment_type as JobForm["employment_type"]) ?? "full_time",
    description: job?.description ?? "",
    apply_email: job?.apply_email ?? "",
    apply_url: job?.apply_url ?? "",
    application_deadline: job?.application_deadline ?? "",
    sort_order: job?.sort_order ?? 0,
    seo_title: job?.seo_title ?? "",
    seo_description: job?.seo_description ?? "",
    published_at: job?.published_at ?? null,
    archived_at: job?.archived_at ?? null,
  });
  const [items, setItems] = useState(children);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof JobForm>(key: K, value: JobForm[K]) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      department_id: form.department_id || null,
      location: form.location || null,
      employment_type: form.employment_type,
      description: form.description || null,
      apply_email: form.apply_email || null,
      apply_url: form.apply_url || null,
      application_deadline: form.application_deadline || null,
      sort_order: form.sort_order,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.published_at,
      archived_at: form.archived_at,
    };
    if (isNew) {
      const { data, error } = await supabase.from("jobs").insert(payload).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Job created");
      navigate({ to: "/admin/jobs/$id", params: { id: data.id } });
      return;
    }
    const { error } = await supabase.from("jobs").update(payload).eq("id", job!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.invalidate();
  }

  async function togglePublish() {
    if (isNew) return toast.error("Save the job first");
    const next = form.published_at ? null : new Date().toISOString();
    setForm({ ...form, published_at: next });
    await supabase.from("jobs").update({ published_at: next }).eq("id", job!.id);
    toast.success(next ? "Published" : "Unpublished");
    router.invalidate();
  }

  async function toggleArchive() {
    if (isNew) return;
    const next = form.archived_at ? null : new Date().toISOString();
    setForm({ ...form, archived_at: next });
    await supabase.from("jobs").update({ archived_at: next }).eq("id", job!.id);
    toast.success(next ? "Archived" : "Restored");
    router.invalidate();
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this job? Responsibilities, requirements and benefits are all removed."))
      return;
    await supabase.from("jobs").delete().eq("id", job!.id);
    toast.success("Deleted");
    navigate({ to: "/admin/jobs" });
  }

  async function addItem(table: ChildTable) {
    if (isNew) return;
    const currentItems = items[table] as { sort_order: number }[];
    const next = Math.max(0, ...currentItems.map((i) => i.sort_order)) + 1;
    const { data, error } = await supabase
      .from(table)
      .insert({ job_id: job!.id, body: "New point", sort_order: next })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setItems({ ...items, [table]: [...currentItems, data] });
  }

  async function updateItem(table: ChildTable, id: string, body: string) {
    await supabase.from(table).update({ body }).eq("id", id);
    setItems({
      ...items,
      [table]: (items[table] as { id: string; body: string }[]).map((i) =>
        i.id === id ? { ...i, body } : i,
      ),
    });
  }

  async function delItem(table: ChildTable, id: string) {
    await supabase.from(table).delete().eq("id", id);
    setItems({
      ...items,
      [table]: (items[table] as { id: string }[]).filter((i) => i.id !== id),
    });
  }

  const status = form.archived_at
    ? "archived"
    : form.published_at
      ? "published"
      : "draft";

  return (
    <AdminShell identity={identity}>
      <Link
        to="/admin/jobs"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All jobs
      </Link>

      <AdminPageHeader
        title={isNew ? "New job" : form.title || "Untitled"}
        intro={isNew ? "Save first, then add responsibilities/requirements/benefits." : `Status: ${status}${job ? ` · ${job.slug}` : ""}`}
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
                      className="rounded-md border border-destructive/60 px-3 py-2 text-xs font-medium text-destructive"
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
          <Text label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
          <Text label="Title" value={form.title} onChange={(v) => update("title", v)} />
          <label className="block">
            <span className="text-xs font-medium">Department</span>
            <select
              value={form.department_id ?? ""}
              onChange={(ev) => update("department_id", ev.target.value || null)}
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
          <label className="block">
            <span className="text-xs font-medium">Employment type</span>
            <select
              value={form.employment_type}
              onChange={(ev) => update("employment_type", ev.target.value as JobForm["employment_type"])}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <Text label="Location" value={form.location} onChange={(v) => update("location", v)} />
          <label className="block">
            <span className="text-xs font-medium">Application deadline</span>
            <input
              type="date"
              value={form.application_deadline}
              onChange={(ev) => update("application_deadline", ev.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
          <Text
            label="Apply email"
            value={form.apply_email}
            onChange={(v) => update("apply_email", v)}
          />
          <Text label="Apply URL" value={form.apply_url} onChange={(v) => update("apply_url", v)} />
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

        <Group title="Description">
          <TextArea
            label="Description"
            value={form.description}
            onChange={(v) => update("description", v)}
            rows={6}
          />
        </Group>

        <Group title="SEO">
          <Text label="SEO title" value={form.seo_title} onChange={(v) => update("seo_title", v)} />
          <TextArea
            label="SEO description"
            value={form.seo_description}
            onChange={(v) => update("seo_description", v)}
            rows={2}
          />
        </Group>

        {!isNew ? (
          <Group title="Details">
            {CHILD_TABLES.map(({ table, label }) => {
              const list = items[table] as { id: string; body: string; sort_order: number }[];
              return (
                <div key={table} className="rounded-lg border border-border bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{label}</h3>
                    {writable ? (
                      <button
                        onClick={() => addItem(table)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs hover:border-primary/40"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    ) : null}
                  </div>
                  <ul className="space-y-2">
                    {list.length === 0 ? (
                      <li className="text-xs text-muted-foreground">Nothing yet.</li>
                    ) : (
                      list
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((it) => (
                          <li key={it.id} className="flex items-start gap-2">
                            <input
                              defaultValue={it.body}
                              onBlur={(ev) => {
                                if (ev.target.value !== it.body)
                                  updateItem(table, it.id, ev.target.value);
                              }}
                              className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
                            />
                            {writable ? (
                              <button
                                onClick={() => delItem(table, it.id)}
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
