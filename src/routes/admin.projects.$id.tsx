import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

const BULLET_KINDS = [
  { key: "challenge", label: "Challenges" },
  { key: "goal", label: "Goals" },
  { key: "solution", label: "Solution steps" },
  { key: "outcome", label: "Outcomes" },
] as const;
type BulletKind = (typeof BULLET_KINDS)[number]["key"];

export const Route = createFileRoute("/admin/projects/$id")({
  loader: async ({ params }) => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");

    const [
      industries,
      services,
      technologies,
      project,
      bullets,
      obstacles,
      metrics,
      projectServices,
      projectTechs,
    ] = await Promise.all([
      supabase.from("industries").select("id,name,slug").order("sort_order"),
      supabase.from("services").select("id,name,slug").order("sort_order"),
      supabase.from("technologies").select("id,name,group_id").order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: null })
        : supabase.from("projects").select("*").eq("id", params.id).maybeSingle(),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("project_bullets").select("*").eq("project_id", params.id).order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("project_obstacles").select("*").eq("project_id", params.id).order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("project_metrics").select("*").eq("project_id", params.id).order("sort_order"),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("project_services").select("*").eq("project_id", params.id),
      params.id === "new"
        ? Promise.resolve({ data: [] })
        : supabase.from("project_technologies").select("*").eq("project_id", params.id),
    ]);

    return {
      identity,
      industries: industries.data ?? [],
      services: services.data ?? [],
      technologies: technologies.data ?? [],
      project: project.data,
      bullets: bullets.data ?? [],
      obstacles: obstacles.data ?? [],
      metrics: metrics.data ?? [],
      linkedServiceIds: new Set((projectServices.data ?? []).map((r) => r.service_id)),
      linkedTechIds: new Set((projectTechs.data ?? []).map((r) => r.technology_id)),
    };
  },
  component: AdminProjectEdit,
});

type ProjectForm = {
  slug: string;
  name: string;
  client: string;
  kind: "demo_case_study" | "concept" | "live";
  industry_id: string | null;
  market: string;
  year: string;
  summary: string;
  context: string;
  testimonial_quote: string;
  testimonial_author: string;
  testimonial_role: string;
  is_featured: boolean;
  is_demo: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  archived_at: string | null;
};

function AdminProjectEdit() {
  const {
    identity,
    industries,
    services,
    technologies,
    project,
    bullets: initialBullets,
    obstacles: initialObstacles,
    metrics: initialMetrics,
    linkedServiceIds: initialServiceIds,
    linkedTechIds: initialTechIds,
  } = Route.useLoaderData();
  const params = Route.useParams();
  const isNew = params.id === "new";
  const navigate = useNavigate();
  const router = useRouter();
  const writable = canWrite(identity.role);

  const [form, setForm] = useState<ProjectForm>({
    slug: project?.slug ?? "",
    name: project?.name ?? "",
    client: project?.client ?? "",
    kind: (project?.kind as ProjectForm["kind"]) ?? "demo_case_study",
    industry_id: project?.industry_id ?? null,
    market: project?.market ?? "",
    year: project?.year ?? "",
    summary: project?.summary ?? "",
    context: project?.context ?? "",
    testimonial_quote: project?.testimonial_quote ?? "",
    testimonial_author: project?.testimonial_author ?? "",
    testimonial_role: project?.testimonial_role ?? "",
    is_featured: project?.is_featured ?? false,
    is_demo: project?.is_demo ?? false,
    sort_order: project?.sort_order ?? 0,
    seo_title: project?.seo_title ?? "",
    seo_description: project?.seo_description ?? "",
    published_at: project?.published_at ?? null,
    archived_at: project?.archived_at ?? null,
  });
  const [bullets, setBullets] = useState(initialBullets);
  const [obstacles, setObstacles] = useState(initialObstacles);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [linkedServiceIds, setLinkedServiceIds] = useState(initialServiceIds);
  const [linkedTechIds, setLinkedTechIds] = useState(initialTechIds);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm({ ...form, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      slug: form.slug,
      name: form.name,
      client: form.client || null,
      kind: form.kind,
      industry_id: form.industry_id || null,
      market: form.market || null,
      year: form.year || null,
      summary: form.summary || null,
      context: form.context || null,
      testimonial_quote: form.testimonial_quote || null,
      testimonial_author: form.testimonial_author || null,
      testimonial_role: form.testimonial_role || null,
      is_featured: form.is_featured,
      is_demo: form.is_demo,
      sort_order: form.sort_order,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.published_at,
      archived_at: form.archived_at,
    };

    if (isNew) {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Project created");
      navigate({ to: "/admin/projects/$id", params: { id: data.id } });
      return;
    }

    const { error } = await supabase.from("projects").update(payload).eq("id", project!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    router.invalidate();
  }

  async function togglePublish() {
    if (isNew) return toast.error("Save the project first");
    const next = form.published_at ? null : new Date().toISOString();
    setForm({ ...form, published_at: next });
    await supabase.from("projects").update({ published_at: next }).eq("id", project!.id);
    toast.success(next ? "Published" : "Unpublished");
    router.invalidate();
  }

  async function toggleArchive() {
    if (isNew) return;
    const next = form.archived_at ? null : new Date().toISOString();
    setForm({ ...form, archived_at: next });
    await supabase.from("projects").update({ archived_at: next }).eq("id", project!.id);
    toast.success(next ? "Archived" : "Restored");
    router.invalidate();
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this project? Case study bullets, obstacles and metrics are all removed.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", project!.id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    navigate({ to: "/admin/projects" });
  }

  // Bullets
  async function addBullet(kind: BulletKind) {
    if (isNew) return;
    const next =
      Math.max(0, ...bullets.filter((b) => b.kind === kind).map((b) => b.sort_order)) + 1;
    const { data, error } = await supabase
      .from("project_bullets")
      .insert({ project_id: project!.id, kind, body: "New point", sort_order: next })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setBullets([...bullets, data]);
  }
  async function updateBullet(id: string, body: string) {
    await supabase.from("project_bullets").update({ body }).eq("id", id);
    setBullets(bullets.map((b) => (b.id === id ? { ...b, body } : b)));
  }
  async function delBullet(id: string) {
    await supabase.from("project_bullets").delete().eq("id", id);
    setBullets(bullets.filter((b) => b.id !== id));
  }

  // Obstacles
  async function addObstacle() {
    if (isNew) return;
    const next = Math.max(0, ...obstacles.map((o) => o.sort_order)) + 1;
    const { data, error } = await supabase
      .from("project_obstacles")
      .insert({
        project_id: project!.id,
        problem: "Problem",
        response: "Response",
        sort_order: next,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setObstacles([...obstacles, data]);
  }
  async function updateObstacle(id: string, patch: { problem?: string; response?: string }) {
    await supabase.from("project_obstacles").update(patch).eq("id", id);
    setObstacles(obstacles.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  async function delObstacle(id: string) {
    await supabase.from("project_obstacles").delete().eq("id", id);
    setObstacles(obstacles.filter((o) => o.id !== id));
  }

  // Metrics
  async function addMetric() {
    if (isNew) return;
    const next = Math.max(0, ...metrics.map((m) => m.sort_order)) + 1;
    const { data, error } = await supabase
      .from("project_metrics")
      .insert({ project_id: project!.id, label: "Label", value: "Value", sort_order: next })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setMetrics([...metrics, data]);
  }
  async function updateMetric(id: string, patch: { label?: string; value?: string }) {
    await supabase.from("project_metrics").update(patch).eq("id", id);
    setMetrics(metrics.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }
  async function delMetric(id: string) {
    await supabase.from("project_metrics").delete().eq("id", id);
    setMetrics(metrics.filter((m) => m.id !== id));
  }

  // Services / technologies junction toggles
  async function toggleService(serviceId: string) {
    if (isNew) return;
    const has = linkedServiceIds.has(serviceId);
    if (has) {
      await supabase
        .from("project_services")
        .delete()
        .eq("project_id", project!.id)
        .eq("service_id", serviceId);
      const next = new Set(linkedServiceIds);
      next.delete(serviceId);
      setLinkedServiceIds(next);
    } else {
      await supabase
        .from("project_services")
        .insert({ project_id: project!.id, service_id: serviceId });
      setLinkedServiceIds(new Set([...linkedServiceIds, serviceId]));
    }
  }
  async function toggleTech(techId: string) {
    if (isNew) return;
    const has = linkedTechIds.has(techId);
    if (has) {
      await supabase
        .from("project_technologies")
        .delete()
        .eq("project_id", project!.id)
        .eq("technology_id", techId);
      const next = new Set(linkedTechIds);
      next.delete(techId);
      setLinkedTechIds(next);
    } else {
      await supabase
        .from("project_technologies")
        .insert({ project_id: project!.id, technology_id: techId });
      setLinkedTechIds(new Set([...linkedTechIds, techId]));
    }
  }

  const status = form.archived_at
    ? "archived"
    : form.published_at
      ? "published"
      : "draft";

  return (
    <AdminShell identity={identity}>
      <Link
        to="/admin/projects"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All projects
      </Link>

      <AdminPageHeader
        title={isNew ? "New project" : form.name || "Untitled"}
        intro={isNew ? "Save first, then add bullets and links." : `Status: ${status}${project ? ` · ${project.slug}` : ""}`}
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
          <Text label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
          <Text label="Name" value={form.name} onChange={(v) => update("name", v)} />
          <Text label="Client" value={form.client} onChange={(v) => update("client", v)} />
          <label className="block">
            <span className="text-xs font-medium">Kind</span>
            <select
              value={form.kind}
              onChange={(ev) => update("kind", ev.target.value as ProjectForm["kind"])}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="demo_case_study">demo_case_study</option>
              <option value="concept">concept</option>
              <option value="live">live</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium">Industry</span>
            <select
              value={form.industry_id ?? ""}
              onChange={(ev) => update("industry_id", ev.target.value || null)}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">(none)</option>
              {industries.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
          <Text label="Market" value={form.market} onChange={(v) => update("market", v)} />
          <Text label="Year" value={form.year} onChange={(v) => update("year", v)} />
          <label className="block">
            <span className="text-xs font-medium">Sort order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={(ev) => update("sort_order", Number(ev.target.value))}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </label>
          <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(ev) => update("is_featured", ev.target.checked)}
              />
              <span>Featured on home page</span>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_demo}
                onChange={(ev) => update("is_demo", ev.target.checked)}
              />
              <span>Demo placeholder case study</span>
            </label>
          </div>
        </Group>

        <Group title="Narrative">
          <TextArea label="Summary (grid card)" value={form.summary} onChange={(v) => update("summary", v)} rows={2} />
          <TextArea label="Context (opening paragraph)" value={form.context} onChange={(v) => update("context", v)} rows={4} />
        </Group>

        <Group title="Testimonial">
          <TextArea label="Quote" value={form.testimonial_quote} onChange={(v) => update("testimonial_quote", v)} rows={3} />
          <Text label="Author" value={form.testimonial_author} onChange={(v) => update("testimonial_author", v)} />
          <Text label="Role" value={form.testimonial_role} onChange={(v) => update("testimonial_role", v)} />
        </Group>

        <Group title="SEO">
          <Text label="SEO title" value={form.seo_title} onChange={(v) => update("seo_title", v)} />
          <TextArea label="SEO description" value={form.seo_description} onChange={(v) => update("seo_description", v)} rows={2} />
        </Group>

        {!isNew ? (
          <>
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
                                onClick={() => delBullet(b.id)}
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

            <Group title="Obstacles and responses">
              <div className="space-y-3 sm:col-span-2">
                {obstacles.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No obstacles recorded yet.</p>
                ) : (
                  obstacles.map((o) => (
                    <div
                      key={o.id}
                      className="grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-2"
                    >
                      <textarea
                        defaultValue={o.problem}
                        onBlur={(ev) => {
                          if (ev.target.value !== o.problem)
                            updateObstacle(o.id, { problem: ev.target.value });
                        }}
                        placeholder="Problem"
                        rows={3}
                        className="rounded-md border border-input bg-background p-2 text-xs"
                      />
                      <div className="flex gap-2">
                        <textarea
                          defaultValue={o.response}
                          onBlur={(ev) => {
                            if (ev.target.value !== o.response)
                              updateObstacle(o.id, { response: ev.target.value });
                          }}
                          placeholder="Response"
                          rows={3}
                          className="flex-1 rounded-md border border-input bg-background p-2 text-xs"
                        />
                        {writable ? (
                          <button
                            onClick={() => delObstacle(o.id)}
                            className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
                {writable ? (
                  <button
                    onClick={addObstacle}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/40"
                  >
                    <Plus className="h-3 w-3" />
                    Add obstacle
                  </button>
                ) : null}
              </div>
            </Group>

            <Group title="Metrics">
              <div className="space-y-2 sm:col-span-2">
                {metrics.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No metrics yet.</p>
                ) : (
                  metrics.map((m) => (
                    <div key={m.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input
                        defaultValue={m.label}
                        onBlur={(ev) => {
                          if (ev.target.value !== m.label)
                            updateMetric(m.id, { label: ev.target.value });
                        }}
                        placeholder="Label"
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      />
                      <input
                        defaultValue={m.value}
                        onBlur={(ev) => {
                          if (ev.target.value !== m.value)
                            updateMetric(m.id, { value: ev.target.value });
                        }}
                        placeholder="Value"
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      />
                      {writable ? (
                        <button
                          onClick={() => delMetric(m.id)}
                          className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
                {writable ? (
                  <button
                    onClick={addMetric}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/40"
                  >
                    <Plus className="h-3 w-3" />
                    Add metric
                  </button>
                ) : null}
              </div>
            </Group>

            <Group title="Linked services">
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {services.map((s) => {
                  const active = linkedServiceIds.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </Group>

            <Group title="Linked technologies">
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {technologies.map((t) => {
                  const active = linkedTechIds.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTech(t.id)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </Group>
          </>
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
