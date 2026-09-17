/**
 * Auth helpers for the admin dashboard.
 * Backed by Supabase Auth (email + password).
 */

import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "editor" | "viewer";

export type AdminIdentity = {
  user: User;
  session: Session;
  role: AdminRole;
  fullName: string | null;
};

/**
 * Fetch the current logged-in user + role. Returns null if not signed in
 * or not an admin (i.e. has no admin_users row).
 */
export async function fetchAdminIdentity(): Promise<AdminIdentity | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return null;

  const { data: adminRows, error } = await supabase.rpc("current_admin");
  if (error) {
    console.error("[auth] current_admin RPC failed", error);
    return null;
  }
  const row = Array.isArray(adminRows) ? adminRows[0] : adminRows;
  if (!row || !row.is_active) return null;

  return {
    user: session.user,
    session,
    role: row.role as AdminRole,
    fullName: row.full_name,
  };
}

/**
 * Check whether the admin_users table is empty. Used to gate the first-time
 * "sign up as super admin" flow on /admin/login.
 * We infer this by attempting the RPC before it self-restricts.
 */
export async function isBootstrapAvailable(): Promise<boolean> {
  // A no-argument boolean RPC would be nicer, but claim_super_admin already
  // handles the "closed" case by returning NULL. We can also poll admin_users
  // directly: RLS lets any authenticated user see their own row, and returns
  // 0 if empty.
  const { count, error } = await supabase
    .from("admin_users")
    .select("*", { count: "exact", head: true });
  if (error) return false;
  return (count ?? 0) === 0;
}

/**
 * Attempt to claim the very first super-admin slot. Returns "super_admin"
 * on success, null if bootstrap is already closed.
 */
export async function claimSuperAdmin(): Promise<AdminRole | null> {
  const { data, error } = await supabase.rpc("claim_super_admin");
  if (error) throw error;
  return (data as AdminRole | null) ?? null;
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName: string,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function canWrite(role: AdminRole | null | undefined): boolean {
  return role === "super_admin" || role === "editor";
}

export function isSuperAdmin(role: AdminRole | null | undefined): boolean {
  return role === "super_admin";
}
