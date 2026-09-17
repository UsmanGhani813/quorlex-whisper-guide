import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Check, Circle, Plus } from "lucide-react";
import { toast } from "sonner";

import { fetchAdminIdentity, canWrite } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/services")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order");
    return { identity, services: data ?? [] };
  },
  component: AdminServices,
});

function AdminServices() {
  const { identity, services } = Route.useLoaderData();
  const router = useRouter();
  const writable = canWrite(identity.role);

  async function togglePublish(id: string, currentlyPublished: boolean) {
    const { error } = await supabase
      .from("services")
      .update({ published_at: currentlyPublished ? null : new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(currentlyPublished ? "Unpublished" : "Published");
    router.invalidate();
  }

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title="Services"
        intro={`${services.length} services · ${
          services.filter((s) => s.published_at && !s.archived_at).length
        } live`}
        actions={
          writable ? (
            <Link
              to="/admin/services/$id"
              params={{ id: "new" }}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New service
            </Link>
          ) : null
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Core</th>
              <th className="p-3">Status</th>
              <th className="p-3">Order</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const live = !!(s.published_at && !s.archived_at);
              return (
                <tr key={s.id} className="border-b border-border">
                  <td className="p-3">
                    <Link
                      to="/admin/services/$id"
                      params={{ id: s.id }}
                      className="font-medium hover:text-primary"
                    >
                      {s.name}
                    </Link>
                    {s.short ? (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {s.short}
                      </p>
                    ) : null}
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{s.slug}</td>
                  <td className="p-3">
                    {s.is_core ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-3 w-3 text-muted-foreground" />
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        s.archived_at
                          ? "bg-muted text-muted-foreground"
                          : live
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {s.archived_at ? "archived" : live ? "published" : "draft"}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{s.sort_order}</td>
                  <td className="p-3">
                    {writable ? (
                      <button
                        onClick={() => togglePublish(s.id, live)}
                        disabled={!!s.archived_at}
                        className="rounded-md border border-border px-3 py-1 text-xs hover:border-primary/40 disabled:opacity-40"
                      >
                        {live ? "Unpublish" : "Publish"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
