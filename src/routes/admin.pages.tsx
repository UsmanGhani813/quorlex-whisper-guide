import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/pages")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("pages").select("*").order("kind").order("slug");
    return { identity, pages: data ?? [] };
  },
  component: AdminPages,
});

function AdminPages() {
  const { identity, pages } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);
  const [editing, setEditing] = useState<string | null>(null);

  async function save(id: string, title: string, intro: string, body: string) {
    const { error } = await supabase
      .from("pages")
      .update({ title, intro: intro || null, body: body || null })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    router.invalidate();
  }

  const marketing = pages.filter((p) => p.kind === "marketing");
  const legal = pages.filter((p) => p.kind === "legal");

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Pages"
        intro="Marketing intro pages and legal page content."
      />

      <div className="space-y-8">
        <PageGroup
          title="Marketing"
          pages={marketing}
          writable={writable}
          editing={editing}
          setEditing={setEditing}
          save={save}
        />
        <PageGroup
          title="Legal"
          pages={legal}
          writable={writable}
          editing={editing}
          setEditing={setEditing}
          save={save}
        />
      </div>
    </AdminShell>
  );
}

function PageGroup({
  title,
  pages,
  writable,
  editing,
  setEditing,
  save,
}: {
  title: string;
  pages: {
    id: string;
    slug: string;
    title: string;
    intro: string | null;
    body: string | null;
    effective_date: string | null;
  }[];
  writable: boolean;
  editing: string | null;
  setEditing: (id: string | null) => void;
  save: (id: string, title: string, intro: string, body: string) => Promise<void>;
}) {
  return (
    <section>
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-primary">{title}</h2>
      <div className="space-y-3">
        {pages.map((p) =>
          editing === p.id ? (
            <PageEditor
              key={p.id}
              initial={p}
              onCancel={() => setEditing(null)}
              onSave={(t, i, b) => save(p.id, t, i, b)}
            />
          ) : (
            <article key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{p.title}</h3>
                    <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                  </div>
                  {p.intro ? (
                    <p className="mt-1 text-sm text-muted-foreground">{p.intro}</p>
                  ) : null}
                </div>
                {writable ? (
                  <button
                    onClick={() => setEditing(p.id)}
                    className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                  >
                    Edit
                  </button>
                ) : null}
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

function PageEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: { title: string; intro: string | null; body: string | null };
  onCancel: () => void;
  onSave: (title: string, intro: string, body: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial.title);
  const [intro, setIntro] = useState(initial.intro ?? "");
  const [body, setBody] = useState(initial.body ?? "");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    await onSave(title, intro, body);
    setSaving(false);
  }

  return (
    <article className="rounded-xl border border-primary/40 bg-card p-5">
      <div className="grid gap-3">
        <input
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        />
        <textarea
          value={intro}
          onChange={(ev) => setIntro(ev.target.value)}
          placeholder="Intro"
          rows={2}
          className="rounded-md border border-input bg-background p-3 text-sm"
        />
        <textarea
          value={body}
          onChange={(ev) => setBody(ev.target.value)}
          placeholder="Body"
          rows={10}
          className="rounded-md border border-input bg-background p-3 text-sm font-mono"
        />
        <div className="flex justify-end gap-2">
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
    </article>
  );
}
