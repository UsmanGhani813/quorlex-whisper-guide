import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Boxes,
  Building2,
  Cpu,
  Inbox,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import { fetchAdminIdentity } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, AdminShell } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const identity = await fetchAdminIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Count everything in parallel. Admins see full counts, including drafts.
    const q = (t: string) =>
      supabase.from(t).select("*", { count: "exact", head: true });
    const [
      services,
      industries,
      projects,
      team,
      technologies,
      faqs,
      jobs,
      pages,
      enquiries,
      enquiriesNew,
    ] = await Promise.all([
      q("services"),
      q("industries"),
      q("projects"),
      q("team_members"),
      q("technologies"),
      q("faqs"),
      q("jobs"),
      q("pages"),
      q("enquiries"),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
    ]);
    return {
      identity,
      counts: {
        services: services.count ?? 0,
        industries: industries.count ?? 0,
        projects: projects.count ?? 0,
        team: team.count ?? 0,
        technologies: technologies.count ?? 0,
        faqs: faqs.count ?? 0,
        jobs: jobs.count ?? 0,
        pages: pages.count ?? 0,
        enquiries: enquiries.count ?? 0,
        enquiriesNew: enquiriesNew.count ?? 0,
      },
    };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { identity, counts } = Route.useLoaderData();

  const cards = [
    { label: "New enquiries", value: counts.enquiriesNew, to: "/admin/enquiries", icon: Inbox, highlight: true },
    { label: "Services", value: counts.services, to: "/admin/services", icon: Wrench },
    { label: "Industries", value: counts.industries, to: "/admin/industries", icon: Building2 },
    { label: "Portfolio", value: counts.projects, to: "/admin/projects", icon: Boxes },
    { label: "Team", value: counts.team, to: "/admin/team", icon: Users },
    { label: "Technologies", value: counts.technologies, to: "/admin/technologies", icon: Cpu },
  ];

  return (
    <AdminShell identity={identity}>
      <AdminPageHeader
        title={`Welcome, ${identity.fullName ?? identity.user.email}`}
        intro="Quorlex Soft content management. Everything on the public site comes from here."
      />

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className={`group rounded-xl border p-5 transition-colors ${
                c.highlight
                  ? "border-primary/40 bg-primary/5 hover:border-primary/60"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{c.value}</p>
                </div>
                <c.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Content</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink to="/admin/faq" label="FAQ" count={counts.faqs} />
          <QuickLink to="/admin/pages" label="Pages" count={counts.pages} />
          <QuickLink to="/admin/jobs" label="Open jobs" count={counts.jobs} />
          <QuickLink
            to="/admin/settings"
            label="Site settings"
            iconOverride={<Settings className="h-4 w-4" />}
          />
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold">First-time checklist</h3>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            1. Open <strong>Site settings</strong> and set the real company details.
          </li>
          <li>
            2. Review the seeded demo <strong>Team</strong> and <strong>Portfolio</strong> — replace
            or unpublish placeholder profiles and case studies before public launch.
          </li>
          <li>
            3. Check <strong>Enquiries</strong> daily. New enquiries appear at the top.
          </li>
          <li>
            4. Publish real services and case studies from the corresponding sections.
          </li>
        </ol>
      </section>
    </AdminShell>
  );
}

function QuickLink({
  to,
  label,
  count,
  iconOverride,
}: {
  to: string;
  label: string;
  count?: number;
  iconOverride?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-primary/40"
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-2 text-muted-foreground">
        {count != null ? <span>{count}</span> : null}
        {iconOverride ?? <ArrowUpRight className="h-3.5 w-3.5" />}
      </span>
    </Link>
  );
}
