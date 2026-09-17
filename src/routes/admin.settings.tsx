import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/settings")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data: settings } = await supabase.from("site_settings").select("*").maybeSingle();
    return { identity, settings };
  },
  component: AdminSettings,
});

function AdminSettings() {
  const { identity, settings } = Route.useLoaderData();
  const router = useRouter();
  const [form, setForm] = useState(settings ?? undefined);
  const [saving, setSaving] = useState(false);
  const writable = canWrite(identity.role);

  if (!form) {
    return (
      <AdminShell identity={identity}>
        <AdminPageHeader title="Site settings" />
        <p className="text-sm text-muted-foreground">No site_settings row found.</p>
      </AdminShell>
    );
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm({ ...form!, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        company_name: form!.company_name,
        tagline: form!.tagline,
        positioning: form!.positioning,
        email: form!.email,
        phone: form!.phone,
        phone_href: form!.phone_href,
        registered_in: form!.registered_in,
        company_number: form!.company_number,
        registered_address: form!.registered_address,
        legal_structure: form!.legal_structure,
        default_seo_title: form!.default_seo_title,
        default_seo_description: form!.default_seo_description,
        copyright_text: form!.copyright_text,
        demo_content: form!.demo_content,
      })
      .eq("id", form!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Site settings"
        intro="Company info, contact details and SEO defaults. Shown on the public site header, footer and meta tags."
        actions={
          writable ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          ) : null
        }
      />

      <fieldset disabled={!writable} className="space-y-8">
        <Group title="Company">
          <TextField label="Company name" value={form.company_name} onChange={(v) => update("company_name", v)} />
          <TextField label="Tagline" value={form.tagline ?? ""} onChange={(v) => update("tagline", v)} />
          <TextArea label="Positioning" value={form.positioning ?? ""} onChange={(v) => update("positioning", v)} rows={3} />
        </Group>

        <Group title="Contact">
          <TextField label="Email" type="email" value={form.email ?? ""} onChange={(v) => update("email", v)} />
          <TextField label="Phone (display)" value={form.phone ?? ""} onChange={(v) => update("phone", v)} />
          <TextField label="Phone (tel: link)" value={form.phone_href ?? ""} onChange={(v) => update("phone_href", v)} />
          <TextField label="Registered in" value={form.registered_in ?? ""} onChange={(v) => update("registered_in", v)} />
          <TextField label="Company number" value={form.company_number ?? ""} onChange={(v) => update("company_number", v)} />
          <TextField label="Registered address" value={form.registered_address ?? ""} onChange={(v) => update("registered_address", v)} />
          <TextField label="Legal structure" value={form.legal_structure ?? ""} onChange={(v) => update("legal_structure", v)} />
        </Group>

        <Group title="SEO defaults">
          <TextField label="Default SEO title" value={form.default_seo_title ?? ""} onChange={(v) => update("default_seo_title", v)} />
          <TextArea label="Default SEO description" value={form.default_seo_description ?? ""} onChange={(v) => update("default_seo_description", v)} rows={2} />
          <TextField label="Copyright text" value={form.copyright_text ?? ""} onChange={(v) => update("copyright_text", v)} />
        </Group>

        <Group title="Demo mode">
          <label className="flex items-center gap-3 rounded-md border border-border bg-card p-4">
            <input
              type="checkbox"
              checked={form.demo_content}
              onChange={(ev) => update("demo_content", ev.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">
              <span className="font-medium">Site is running with demo content.</span>{" "}
              <span className="text-muted-foreground">
                Uncheck once every team member and project has been replaced with verified,
                approved information.
              </span>
            </span>
          </label>
        </Group>
      </fieldset>

      {writable ? (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Your role does not allow editing site settings.
        </p>
      )}
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">{label}</span>
      <input
        type={type}
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
