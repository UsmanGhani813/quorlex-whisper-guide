import { useState, type ReactNode } from "react";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import {
  Boxes,
  Building2,
  Cpu,
  FileText,
  Gauge,
  Image,
  Inbox,
  LayoutDashboard,
  Layout,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { signOut, type AdminIdentity } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV: { label: string; to: string; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Enquiries", to: "/admin/enquiries", icon: Inbox },
  { label: "Page sections", to: "/admin/sections", icon: Layout },
  { label: "Services", to: "/admin/services", icon: Wrench },
  { label: "Industries", to: "/admin/industries", icon: Building2 },
  { label: "Portfolio", to: "/admin/projects", icon: Boxes },
  { label: "Team", to: "/admin/team", icon: Users },
  { label: "Technologies", to: "/admin/technologies", icon: Cpu },
  { label: "Process", to: "/admin/process", icon: Gauge },
  { label: "FAQ", to: "/admin/faq", icon: MessageSquare },
  { label: "Pages", to: "/admin/pages", icon: Newspaper },
  { label: "Insights", to: "/admin/insights", icon: FileText },
  { label: "Jobs", to: "/admin/jobs", icon: FileText },
  { label: "Media", to: "/admin/media", icon: Image },
  { label: "Nav & footer", to: "/admin/chrome", icon: Layout },
  { label: "Settings", to: "/admin/settings", icon: Settings },
  { label: "Admins", to: "/admin/admins", icon: ShieldCheck },
];

export function AdminShell({
  identity,
  children,
}: {
  identity: AdminIdentity;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="border-b border-border p-5">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
              Q
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Quorlex Admin</p>
              <p className="text-[11px] text-muted-foreground">{identity.role.replace("_", " ")}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active =
              item.to === "/admin"
                ? !!matchRoute({ to: item.to, fuzzy: false })
                : !!matchRoute({ to: item.to, fuzzy: true });
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-3 px-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{identity.fullName ?? "Admin"}</p>
            <p className="truncate">{identity.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
          <Link
            to="/"
            className="mt-2 block px-3 text-[11px] text-muted-foreground hover:text-foreground"
          >
            View public site →
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-72 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-display text-sm font-semibold">Quorlex Admin</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground"
                  activeProps={{ className: "bg-primary text-primary-foreground" }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border p-3">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface p-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="font-display text-sm font-semibold">Quorlex Admin</span>
          <button
            onClick={handleSignOut}
            className="grid h-9 w-9 place-items-center rounded-md border border-border"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  intro,
  actions,
}: {
  title: string;
  intro?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {intro ? <p className="mt-1 text-sm text-muted-foreground">{intro}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  );
}
