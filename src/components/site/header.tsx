import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Container } from "./sections";
import { ThemeToggle } from "./theme";
import type { SiteChrome } from "@/lib/cms";

const FALLBACK_NAV = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "Technologies", href: "/technologies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
  { label: "About", href: "/about" },
];

export function Header({ chrome }: { chrome: SiteChrome }) {
  const [open, setOpen] = useState(false);
  const companyName = chrome.settings?.company_name ?? "Quorlex Soft";
  const items =
    chrome.navItems.length > 0
      ? chrome.navItems
          .filter((i) => i.is_enabled && !i.parent_id)
          .map((i) => ({ label: i.label, href: i.href }))
      : FALLBACK_NAV;

  const navItems = items.filter((i) => i.href !== "/contact");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
            Q
          </span>
          <span className="font-display text-base font-semibold tracking-tight">{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col py-3">
            {[...navItems, { label: "Contact", href: "/contact" }].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}
