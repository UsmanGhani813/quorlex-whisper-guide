import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "quorlex-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function decide(value: "accepted" | "essential") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        We use essential cookies to run this site. With your consent we also store a preference
        cookie for your theme choice. See our{" "}
        <Link to="/legal/cookies" className="text-primary underline underline-offset-4">
          cookie policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => decide("essential")}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
