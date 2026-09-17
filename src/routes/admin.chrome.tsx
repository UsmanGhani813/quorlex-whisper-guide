import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite, isSuperAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/chrome")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const [nav, sections, links, socials] = await Promise.all([
      supabase.from("nav_items").select("*").order("sort_order"),
      supabase.from("footer_sections").select("*").order("sort_order"),
      supabase.from("footer_links").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);
    return {
      identity,
      nav: nav.data ?? [],
      sections: sections.data ?? [],
      links: links.data ?? [],
      socials: socials.data ?? [],
    };
  },
  component: AdminChrome,
});

function AdminChrome() {
  const { identity, nav, sections, links, socials } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Navigation & footer"
        intro="Header links, footer columns, and social links. Changes are live immediately."
      />

      <div className="space-y-10">
        <NavSection nav={nav} writable={writable} onChange={() => router.invalidate()} />
        <FooterSection
          sections={sections}
          links={links}
          writable={writable}
          canDelete={isSuperAdmin(identity.role)}
          onChange={() => router.invalidate()}
        />
        <SocialSection
          socials={socials}
          writable={writable}
          onChange={() => router.invalidate()}
        />
      </div>
    </AdminShell>
  );
}

function NavSection({
  nav,
  writable,
  onChange,
}: {
  nav: {
    id: string;
    label: string;
    href: string;
    sort_order: number;
    is_enabled: boolean;
  }[];
  writable: boolean;
  onChange: () => void;
}) {
  async function addItem() {
    const label = prompt("Menu label:");
    const href = prompt("Menu href (e.g. /services):");
    if (!label || !href) return;
    const { error } = await supabase
      .from("nav_items")
      .insert({ label, href, sort_order: nav.length + 1 });
    if (error) return toast.error(error.message);
    onChange();
  }

  async function updateItem(id: string, patch: Partial<(typeof nav)[0]>) {
    const { error } = await supabase.from("nav_items").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    onChange();
  }

  async function del(id: string) {
    if (!confirm("Remove this navigation item?")) return;
    await supabase.from("nav_items").delete().eq("id", id);
    onChange();
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Header navigation</h2>
        {writable ? (
          <button
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
          >
            <Plus className="h-3 w-3" />
            Add item
          </button>
        ) : null}
      </div>
      <div className="space-y-2">
        {nav.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[100px_1fr_1fr_auto_auto]">
            <input
              type="number"
              defaultValue={item.sort_order}
              disabled={!writable}
              onBlur={(ev) => {
                const v = Number(ev.target.value);
                if (v !== item.sort_order) updateItem(item.id, { sort_order: v });
              }}
              className="h-9 rounded-md border border-input bg-background px-2 text-xs"
            />
            <input
              defaultValue={item.label}
              disabled={!writable}
              onBlur={(ev) => {
                if (ev.target.value !== item.label) updateItem(item.id, { label: ev.target.value });
              }}
              placeholder="Label"
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            />
            <input
              defaultValue={item.href}
              disabled={!writable}
              onBlur={(ev) => {
                if (ev.target.value !== item.href) updateItem(item.id, { href: ev.target.value });
              }}
              placeholder="/href"
              className="h-9 rounded-md border border-input bg-background px-2 text-sm font-mono"
            />
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={item.is_enabled}
                disabled={!writable}
                onChange={(ev) => updateItem(item.id, { is_enabled: ev.target.checked })}
              />
              Enabled
            </label>
            {writable ? (
              <button
                onClick={() => del(item.id)}
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterSection({
  sections,
  links,
  writable,
  canDelete,
  onChange,
}: {
  sections: { id: string; title: string; sort_order: number; is_enabled: boolean }[];
  links: {
    id: string;
    section_id: string;
    label: string;
    href: string;
    sort_order: number;
    is_enabled: boolean;
  }[];
  writable: boolean;
  canDelete: boolean;
  onChange: () => void;
}) {
  async function addSection() {
    const title = prompt("Footer column title:");
    if (!title) return;
    await supabase.from("footer_sections").insert({ title, sort_order: sections.length + 1 });
    onChange();
  }

  async function updateSection(id: string, patch: Record<string, unknown>) {
    await supabase.from("footer_sections").update(patch).eq("id", id);
    onChange();
  }

  async function delSection(id: string) {
    if (!confirm("Delete this footer column and all its links?")) return;
    await supabase.from("footer_sections").delete().eq("id", id);
    onChange();
  }

  async function addLink(section_id: string, orderBase: number) {
    const label = prompt("Link label:");
    const href = prompt("Link href:");
    if (!label || !href) return;
    await supabase
      .from("footer_links")
      .insert({ section_id, label, href, sort_order: orderBase + 1 });
    onChange();
  }

  async function updateLink(id: string, patch: Record<string, unknown>) {
    await supabase.from("footer_links").update(patch).eq("id", id);
    onChange();
  }

  async function delLink(id: string) {
    await supabase.from("footer_links").delete().eq("id", id);
    onChange();
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Footer</h2>
        {writable ? (
          <button
            onClick={addSection}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
          >
            <Plus className="h-3 w-3" />
            Add column
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => {
          const sectionLinks = links
            .filter((l) => l.section_id === s.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          return (
            <div key={s.id} className="rounded-md border border-border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <input
                  defaultValue={s.title}
                  disabled={!writable}
                  onBlur={(ev) => {
                    if (ev.target.value !== s.title)
                      updateSection(s.id, { title: ev.target.value });
                  }}
                  className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm font-semibold"
                />
                {writable && canDelete ? (
                  <button
                    onClick={() => delSection(s.id)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                ) : null}
              </div>

              <div className="space-y-1.5">
                {sectionLinks.map((l) => (
                  <div key={l.id} className="grid grid-cols-[1fr_1fr_auto] gap-1.5">
                    <input
                      defaultValue={l.label}
                      disabled={!writable}
                      onBlur={(ev) => {
                        if (ev.target.value !== l.label)
                          updateLink(l.id, { label: ev.target.value });
                      }}
                      placeholder="Label"
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    />
                    <input
                      defaultValue={l.href}
                      disabled={!writable}
                      onBlur={(ev) => {
                        if (ev.target.value !== l.href)
                          updateLink(l.id, { href: ev.target.value });
                      }}
                      placeholder="/href"
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs font-mono"
                    />
                    {writable ? (
                      <button
                        onClick={() => delLink(l.id)}
                        className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              {writable ? (
                <button
                  onClick={() =>
                    addLink(s.id, Math.max(0, ...sectionLinks.map((l) => l.sort_order)))
                  }
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                  Add link
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SocialSection({
  socials,
  writable,
  onChange,
}: {
  socials: { id: string; platform: string; url: string; sort_order: number; is_enabled: boolean }[];
  writable: boolean;
  onChange: () => void;
}) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  async function add() {
    if (!platform || !url) return;
    await supabase.from("social_links").insert({
      platform,
      url,
      sort_order: socials.length + 1,
    });
    setPlatform("");
    setUrl("");
    onChange();
  }

  async function del(id: string) {
    await supabase.from("social_links").delete().eq("id", id);
    onChange();
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-sm font-semibold text-primary">Social links</h2>
      <div className="space-y-2">
        {socials.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No social links yet. Add LinkedIn, X, GitHub, etc.
          </p>
        ) : (
          socials.map((s) => (
            <div key={s.id} className="grid grid-cols-[120px_1fr_auto] gap-2">
              <input
                defaultValue={s.platform}
                disabled={!writable}
                onBlur={(ev) =>
                  supabase.from("social_links").update({ platform: ev.target.value }).eq("id", s.id)
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              />
              <input
                defaultValue={s.url}
                disabled={!writable}
                onBlur={(ev) =>
                  supabase.from("social_links").update({ url: ev.target.value }).eq("id", s.id)
                }
                className="h-9 rounded-md border border-input bg-background px-2 text-sm font-mono"
              />
              {writable ? (
                <button
                  onClick={() => del(s.id)}
                  className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      {writable ? (
        <div className="mt-4 grid grid-cols-[120px_1fr_auto] gap-2 border-t border-border pt-4">
          <input
            value={platform}
            onChange={(ev) => setPlatform(ev.target.value)}
            placeholder="Platform (e.g. LinkedIn)"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          />
          <input
            value={url}
            onChange={(ev) => setUrl(ev.target.value)}
            placeholder="https://..."
            className="h-9 rounded-md border border-input bg-background px-2 text-sm font-mono"
          />
          <button
            onClick={add}
            className="rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground"
          >
            Add
          </button>
        </div>
      ) : null}
    </section>
  );
}
