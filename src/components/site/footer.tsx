import { Link } from "@tanstack/react-router";

import { Container } from "./sections";
import type { SiteChrome } from "@/lib/cms";

export function Footer({ chrome }: { chrome: SiteChrome }) {
  const settings = chrome.settings;
  const companyName = settings?.company_name ?? "Quorlex Soft";
  const tagline = settings?.tagline ?? "";
  const email = settings?.email ?? "";
  const phone = settings?.phone ?? "";
  const phoneHref = settings?.phone_href ?? "";
  const registeredIn = settings?.registered_in ?? "";
  const registeredAddress = settings?.registered_address ?? "";
  const companyNumber = settings?.company_number ?? "";
  const copyright =
    settings?.copyright_text ??
    `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="font-display text-lg font-semibold">{companyName}</span>
            {tagline ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
            ) : null}
            <p className="mt-4 text-sm text-muted-foreground">
              {email ? (
                <>
                  <a className="hover:text-foreground" href={`mailto:${email}`}>
                    {email}
                  </a>
                  <br />
                </>
              ) : null}
              {phone ? (
                <a className="hover:text-foreground" href={`tel:${phoneHref}`}>
                  {phone}
                </a>
              ) : null}
            </p>
          </div>

          {chrome.footerSections
            .filter((s) => s.is_enabled)
            .map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links
                    .filter((l) => l.is_enabled)
                    .map((link) => (
                      <li key={link.id}>
                        <Link
                          to={link.href}
                          className="transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            {copyright}
            {registeredIn ? ` Registered in ${registeredIn}.` : ""}
            {companyNumber ? ` Company number ${companyNumber}.` : ""}
          </p>
          {registeredAddress ? <p className="mt-2">{registeredAddress}</p> : null}
        </div>
      </Container>
    </footer>
  );
}
