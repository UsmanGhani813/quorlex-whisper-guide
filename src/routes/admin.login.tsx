import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { fetchAdminIdentity, signInWithPassword } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Container, Section } from "@/components/site/sections";

/**
 * The single admin account allowed to sign in here. This is enforced on the
 * client for UX, on the database via public.admin_users, and via RLS.
 * Only this email can sign in.
 */
const ADMIN_EMAIL = "usmanghanidev15@gmail.com";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin login — Quorlex Soft" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin/login" });
  const redirectTo = search.redirect ?? "/admin";

  const [checking, setChecking] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const identity = await fetchAdminIdentity();
      if (cancelled) return;
      if (identity) {
        navigate({ to: redirectTo });
        return;
      }
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, redirectTo]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        // @ts-expect-error logo_url not yet in generated types
        .select("logo_url")
        .maybeSingle();
      setLogoUrl((data as { logo_url?: string | null } | null)?.logo_url ?? null);
    })();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setError(null);

    // Ignore whatever the (readonly) email field carries — always sign in
    // with the single permitted account. This makes the panel one-account only.
    const email = ADMIN_EMAIL;
    const password = data.password;

    if (!password) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await signInWithPassword(email, password);
      if (signInError) throw signInError;
      const identity = await fetchAdminIdentity();
      if (!identity) {
        setError(
          "This account is not registered as an admin. Contact the system owner.",
        );
        setSubmitting(false);
        return;
      }
      toast.success("Signed in");
      navigate({ to: redirectTo });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed. Check your password.";
      setError(message);
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <Section bordered={false}>
        <Container>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section bordered={false}>
      <Container className="max-w-md px-0">
        <div className="rounded-xl border border-border bg-card p-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Quorlex Soft"
              className="mb-4 h-12 w-12 rounded-md object-cover"
            />
          ) : null}
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Lock className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-[0.18em]">Restricted access</span>
          </div>
          <h1 className="text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the site owner can sign in here. Enter the password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                value={ADMIN_EMAIL}
                readOnly
                className="mt-1.5 h-11 w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </label>

            {error ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
