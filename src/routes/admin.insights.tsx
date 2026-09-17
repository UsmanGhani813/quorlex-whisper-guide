import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/shell";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  read_minutes: number | null;
  tags: string[];
  published_at: string | null;
  archived_at: string | null;
};

export const Route = createFileRoute("/admin/insights")({
  component: InsightsAdmin,
});

function InsightsAdmin() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");

  async function reload() {
    const { data } = await supabase
      // @ts-expect-error not typed yet
      .from("insights_posts")
      .select("id, slug, title, excerpt, read_minutes, tags, published_at, archived_at")
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as PostRow[]);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function create() {
    if (!newSlug || !newTitle) return toast.error("Slug and title required");
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("insights_posts")
      .insert({ slug: newSlug, title: newTitle });
    if (error) return toast.error(error.message);
    toast.success("Draft created");
    setNewSlug("");
    setNewTitle("");
    reload();
  }

  async function togglePublish(p: PostRow) {
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("insights_posts")
      .update({ published_at: p.published_at ? null : new Date().toISOString() })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    reload();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase
      // @ts-expect-error not typed
      .from("insights_posts")
      .delete()
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    reload();
  }

  return (
    <>
      <AdminPageHeader
        title="Insights"
        intro="Blog posts. Empty is fine — this exists so the site has a place to publish when you're ready."
      />

      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">New draft</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="slug (kebab-case)"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          />
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          />
          <button
            onClick={create}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Create
          </button>
        </div>
      </section>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
          No posts yet.
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <FileText className="mb-1.5 h-4 w-4 text-primary" />
                <div className="text-base font-semibold">{p.title}</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">/{p.slug}</div>
                {p.excerpt ? (
                  <div className="mt-1 max-w-lg text-sm text-muted-foreground line-clamp-2">{p.excerpt}</div>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => togglePublish(p)}
                  className="rounded-md border border-border px-2.5 py-1 text-xs"
                >
                  {p.published_at ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-md border border-destructive/60 p-1.5 text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Full body editor coming in a follow-up. For now, drafts hold the slug + title +
        excerpt so the site can list them. Public detail pages get built once at least one
        post has body content.
      </p>
    </>
  );
}
