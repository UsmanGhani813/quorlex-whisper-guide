/**
 * Section editor for one page.
 * Lets admins add, reorder, enable, duplicate, delete and publish/unpublish sections.
 * Config is edited as JSON for now — the render-side supports the schema per kind.
 */
import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowDown, ArrowUp, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/shell";

type PageRow = { id: string; slug: string; title: string };

type SectionRow = {
  id: string;
  page_id: string;
  kind: string;
  position: number;
  is_enabled: boolean;
  title: string | null;
  eyebrow: string | null;
  subtitle: string | null;
  config: Record<string, unknown>;
  published_at: string | null;
  archived_at: string | null;
};

const KINDS: { value: string; label: string; hint: string; defaults: Partial<SectionRow> }[] = [
  {
    value: "hero",
    label: "Hero",
    hint: "Big top banner: eyebrow, headline, subtitle, CTAs, optional badges.",
    defaults: {
      eyebrow: "Eyebrow",
      title: "Your headline goes here",
      subtitle: "One sentence explaining what you do.",
      config: {
        primary_cta: { label: "Start a project", href: "/contact" },
        secondary_cta: { label: "See services", href: "/services" },
        badges: [] as string[],
      },
    },
  },
  {
    value: "feature_cards",
    label: "Feature cards",
    hint: "3 short cards. config = { cards: [{title, body}] }",
    defaults: {
      eyebrow: "Approach",
      title: "How we work",
      config: {
        cards: [
          { title: "Card one", body: "A short line." },
          { title: "Card two", body: "A short line." },
          { title: "Card three", body: "A short line." },
        ],
      },
    },
  },
  {
    value: "services_grid",
    label: "Services grid",
    hint: "Cards from the services table. config = { limit, show_core_only, link_to_detail }",
    defaults: {
      eyebrow: "Services",
      title: "What we build",
      config: { limit: 9, show_core_only: false, link_to_detail: true },
    },
  },
  {
    value: "industries_grid",
    label: "Industries grid",
    hint: "Cards from the industries table. config = { limit }",
    defaults: {
      eyebrow: "Industries",
      title: "Where we work",
      config: { limit: 8 },
    },
  },
  {
    value: "founder_spotlight",
    label: "Founder spotlight",
    hint: "One team member as a highlighted profile. config = { member_slug, layout, show_publications, show_experience, show_degrees, cta }",
    defaults: {
      eyebrow: "Founder",
      title: "Meet the founder",
      config: {
        member_slug: "aftab-hussain",
        layout: "detailed",
        show_publications: true,
        show_experience: true,
        show_degrees: true,
      },
    },
  },
  {
    value: "process_timeline",
    label: "Process timeline",
    hint: "Numbered steps from the process_steps table.",
    defaults: {
      eyebrow: "How we ship",
      title: "Our delivery process",
      config: { limit: 7 },
    },
  },
  {
    value: "quote",
    label: "Quote",
    hint: "A single centered quote. config = { quote, attribution }",
    defaults: {
      config: { quote: "A quote.", attribution: "Someone" },
    },
  },
  {
    value: "rich_text",
    label: "Rich text",
    hint: "Free prose. config = { body }",
    defaults: { title: "Section title", config: { body: "Your paragraph." } },
  },
  {
    value: "cta",
    label: "CTA band",
    hint: "Wide call-to-action band. config = { primary_cta, secondary_cta }",
    defaults: {
      title: "Have a concrete problem?",
      subtitle: "Tell us what you want to build.",
      config: { primary_cta: { label: "Start a project", href: "/contact" } },
    },
  },
  {
    value: "portfolio_grid",
    label: "Portfolio grid",
    hint: "Cards from the projects table. config = { limit }",
    defaults: {
      eyebrow: "Selected work",
      title: "Case studies",
      config: { limit: 6 },
    },
  },
  {
    value: "metrics",
    label: "Metrics band",
    hint: "config = { metrics: [{ label, value, hint }] } — only use real numbers.",
    defaults: {
      title: "By the numbers",
      config: { metrics: [] as unknown[] },
    },
  },
  {
    value: "team_grid",
    label: "Team grid",
    hint: "config = { limit, leadership_only }",
    defaults: {
      eyebrow: "Team",
      title: "The people you'll work with",
      config: { limit: 8, leadership_only: false },
    },
  },
];

export const Route = createFileRoute("/admin/sections/$pageSlug")({
  component: SectionsEditor,
});

function SectionsEditor() {
  const { pageSlug } = Route.useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState<PageRow | null>(null);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKind, setSelectedKind] = useState(KINDS[0].value);

  async function reload(pageId: string) {
    const { data } = await supabase
      // @ts-expect-error not typed yet
      .from("page_sections")
      .select("*")
      .eq("page_id", pageId)
      .order("position");
    setSections((data ?? []) as SectionRow[]);
  }

  useEffect(() => {
    (async () => {
      const { data: pageData } = await supabase
        .from("pages")
        .select("id, slug, title")
        .eq("slug", pageSlug)
        .maybeSingle();
      if (!pageData) {
        toast.error("Page not found");
        navigate({ to: "/admin/sections" });
        return;
      }
      setPage(pageData as PageRow);
      await reload(pageData.id);
      setLoading(false);
    })();
  }, [pageSlug, navigate]);

  async function addSection() {
    if (!page) return;
    const spec = KINDS.find((k) => k.value === selectedKind);
    if (!spec) return;
    const nextPosition = Math.max(0, ...sections.map((s) => s.position)) + 10;
    const row = {
      page_id: page.id,
      kind: selectedKind,
      position: nextPosition,
      is_enabled: true,
      title: spec.defaults.title ?? null,
      eyebrow: spec.defaults.eyebrow ?? null,
      subtitle: spec.defaults.subtitle ?? null,
      config: spec.defaults.config ?? {},
      published_at: new Date().toISOString(),
    };
    const { error } = await supabase
      // @ts-expect-error not typed yet
      .from("page_sections")
      .insert(row);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Added ${spec.label}`);
    await reload(page.id);
  }

  async function duplicate(s: SectionRow) {
    if (!page) return;
    const row = {
      page_id: page.id,
      kind: s.kind,
      position: s.position + 5,
      is_enabled: s.is_enabled,
      title: s.title,
      eyebrow: s.eyebrow,
      subtitle: s.subtitle,
      config: s.config,
      published_at: s.published_at,
    };
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("page_sections")
      .insert(row);
    if (error) return toast.error(error.message);
    toast.success("Duplicated");
    await reload(page.id);
  }

  async function updateSection(id: string, patch: Partial<SectionRow>) {
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("page_sections")
      .update(patch)
      .eq("id", id);
    if (error) return toast.error(error.message);
    if (page) await reload(page.id);
  }

  async function remove(id: string) {
    if (!confirm("Delete this section permanently? Unpublish is usually enough.")) return;
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("page_sections")
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    if (page) await reload(page.id);
  }

  async function move(s: SectionRow, dir: -1 | 1) {
    const idx = sections.findIndex((x) => x.id === s.id);
    const swap = sections[idx + dir];
    if (!swap) return;
    await Promise.all([
      updateSection(s.id, { position: swap.position }),
      updateSection(swap.id, { position: s.position }),
    ]);
  }

  const kindMap = useMemo(() => Object.fromEntries(KINDS.map((k) => [k.value, k.label])), []);

  if (loading || !page) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <AdminPageHeader
        title={`Sections · ${page.title}`}
        intro="Reorder, enable, disable, duplicate or delete blocks. Content changes take effect after Save."
        actions={
          <Link
            to="/admin/sections"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All pages
          </Link>
        }
      />

      <section className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Add a new section</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
          <button
            onClick={addSection}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add section
          </button>
          <p className="text-xs text-muted-foreground">
            {KINDS.find((k) => k.value === selectedKind)?.hint}
          </p>
        </div>
      </section>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
            No sections yet. Add one above.
          </p>
        ) : (
          sections.map((s, i) => (
            <SectionCard
              key={s.id}
              s={s}
              label={kindMap[s.kind] ?? s.kind}
              isFirst={i === 0}
              isLast={i === sections.length - 1}
              onMove={(dir) => move(s, dir)}
              onDuplicate={() => duplicate(s)}
              onDelete={() => remove(s.id)}
              onSave={(patch) => updateSection(s.id, patch)}
            />
          ))
        )}
      </div>
    </>
  );
}

function SectionCard({
  s,
  label,
  isFirst,
  isLast,
  onMove,
  onDuplicate,
  onDelete,
  onSave,
}: {
  s: SectionRow;
  label: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSave: (patch: Partial<SectionRow>) => void;
}) {
  const [title, setTitle] = useState(s.title ?? "");
  const [eyebrow, setEyebrow] = useState(s.eyebrow ?? "");
  const [subtitle, setSubtitle] = useState(s.subtitle ?? "");
  const [configText, setConfigText] = useState(JSON.stringify(s.config ?? {}, null, 2));
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save() {
    try {
      const cfg = JSON.parse(configText || "{}");
      onSave({
        title: title || null,
        eyebrow: eyebrow || null,
        subtitle: subtitle || null,
        config: cfg,
      });
      setDirty(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  return (
    <article
      className={`rounded-xl border ${s.is_enabled ? "border-border" : "border-dashed border-border/50 opacity-70"} bg-card p-5`}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
            {label}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">position {s.position}</span>
          {!s.published_at ? (
            <span className="ml-2 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] text-yellow-600">
              draft
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            disabled={isFirst}
            onClick={() => onMove(-1)}
            className="rounded-md border border-border p-1.5 text-muted-foreground disabled:opacity-40"
            title="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={isLast}
            onClick={() => onMove(1)}
            className="rounded-md border border-border p-1.5 text-muted-foreground disabled:opacity-40"
            title="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSave({ is_enabled: !s.is_enabled })}
            className="rounded-md border border-border p-1.5 text-muted-foreground"
            title={s.is_enabled ? "Disable" : "Enable"}
          >
            {s.is_enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() =>
              onSave({ published_at: s.published_at ? null : new Date().toISOString() })
            }
            className="rounded-md border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {s.published_at ? "Unpublish" : "Publish"}
          </button>
          <button onClick={onDuplicate} className="rounded-md border border-border p-1.5" title="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="rounded-md border border-destructive/60 p-1.5 text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-medium">Eyebrow</span>
          <input
            value={eyebrow}
            onChange={(e) => {
              setEyebrow(e.target.value);
              setDirty(true);
            }}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          />
        </label>
        <label className="block md:col-span-3">
          <span className="text-xs font-medium">Subtitle</span>
          <input
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              setDirty(true);
            }}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          />
        </label>
        <label className="block md:col-span-3">
          <span className="text-xs font-medium">Config (JSON)</span>
          <textarea
            value={configText}
            onChange={(e) => {
              setConfigText(e.target.value);
              setDirty(true);
            }}
            rows={8}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
          />
          {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
        </label>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          disabled={!dirty}
          onClick={save}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </article>
  );
}
