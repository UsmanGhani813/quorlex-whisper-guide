import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchAdminIdentity } from "@/lib/auth";

/**
 * Admin parent route. Guards all /admin/* pages EXCEPT /admin/login.
 * If the visitor is not authenticated (or not in admin_users), they are
 * redirected to /admin/login.
 */
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Quorlex Soft" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    // The login page must be reachable without auth
    if (location.pathname === "/admin/login") {
      return {};
    }
    const identity = await fetchAdminIdentity();
    if (!identity) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
    return { identity };
  },
  component: AdminOutlet,
});

function AdminOutlet() {
  return <Outlet />;
}
