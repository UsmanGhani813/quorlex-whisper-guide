import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { fetchAdminIdentity, signInWithPassword } from "@/lib/auth";
import { Container, Section } from "@/components/site/sections";

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setError(null);
    setSubmitting(true);
    try {
      const { error: signInError } = await signInWithPassword(data.email, data.password);
      if (signInError) throw signInError;
      const identity = await fetchAdminIdentity();
      if (!identity) {
        setError(
          "Your account is signed in but is not registered as an admin. Ask a super admin to add you.",
        );
        setSubmitting(false);
        return;
      }
      toast.success("Signed in");
      navigate({ to: redirectTo });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed. Check your email and password.";
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
          <h1 className="text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your admin email and password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />

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

            <p className="text-center text-xs text-muted-foreground">
              No account? Contact the super admin to be invited.
            </p>
          </form>
        </div>
      </Container>
    </Section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
