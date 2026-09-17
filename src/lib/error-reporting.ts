/**
 * Neutral client-side error reporting for the Quorlex Soft site.
 * Logs to the console. Add a real sink (Sentry, PostHog, …) here later.
 */

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // TanStack loaders and server functions sometimes throw a raw Response.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  const payload = {
    message,
    route: window.location.pathname,
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };

  // Keep it visible in the browser devtools for now.
  // eslint-disable-next-line no-console
  console.error("[quorlex] client error:", payload);
}
