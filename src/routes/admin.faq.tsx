import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/faq")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    return { identity, faqs: data ?? [] };
  },
  component: AdminFaqs,
});

function AdminFaqs() {
  const { identity, faqs } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);
  const [editing, setEditing] = useState<string | null>(null);

  async function togglePublish(id: string, live: boolean) {
    await supabase
      .from("faqs")
      .update({ published_at: live ? null : new Date().toISOString() })
      .eq("id", id);
    toast.success(live ? "Unpublished" : "Published");
    router.invalidate();
  }

  async function save(id: string, question: string, answer: string, sort_order: number) {
    const { error } = await supabase
      .from("faqs")
      .update({ question, answer, sort_order })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    router.invalidate();
  }

  async function createOne() {
    const { error } = await supabase
      .from("faqs")
      .insert({
        question: "New question?",
        answer: "Answer here.",
        sort_order: faqs.length + 1,
        published_at: new Date().toISOString(),
      });
    if (error) return toast.error(error.message);
    toast.success("Created");
    router.invalidate();
  }

  async function del(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    toast.success("Deleted");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="FAQ"
        intro={`${faqs.length} entries`}
        actions={
          writable ? (
            <button
              onClick={createOne}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New FAQ
            </button>
          ) : null
        }
      />

      <div className="space-y-3">
        {faqs.map((f) => {
          const live = !!(f.published_at && !f.archived_at);
          return editing === f.id ? (
            <FaqEditor
              key={f.id}
              initial={f}
              onCancel={() => setEditing(null)}
              onSave={(q, a, ord) => save(f.id, q, a, ord)}
            />
          ) : (
            <article
              key={f.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{f.question}</h3>
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
                  <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                </div>
                {writable ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublish(f.id, live)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                    >
                      {live ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => setEditing(f.id)}
                      className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                    >
                      Edit
                    </button>
                    {isSuperAdmin(identity.role) ? (
                      <button
                        onClick={() => del(f.id)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}

function FaqEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: { question: string; answer: string; sort_order: number };
  onCancel: () => void;
  onSave: (q: string, a: string, ord: number) => Promise<void>;
}) {
  const [q, setQ] = useState(initial.question);
  const [a, setA] = useState(initial.answer);
  const [ord, setOrd] = useState(initial.sort_order);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    await onSave(q, a, ord);
    setSaving(false);
  }

  return (
    <article className="rounded-xl border border-primary/40 bg-card p-5">
      <div className="grid gap-3">
        <input
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Question"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        />
        <textarea
          value={a}
          onChange={(ev) => setA(ev.target.value)}
          placeholder="Answer"
          rows={4}
          className="rounded-md border border-input bg-background p-3 text-sm"
        />
        <input
          type="number"
          value={ord}
          onChange={(ev) => setOrd(Number(ev.target.value))}
          placeholder="Sort order"
          className="h-10 w-32 rounded-md border border-input bg-background px-3 text-sm"
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
