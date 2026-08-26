import { Link } from "@tanstack/react-router";

import { Container } from "./sections";
import { company } from "@/content/company";
import { coreServiceSlugs, getService } from "@/content/services";

const companyLinks = [
  { to: "/about", label: "About" },
  { to: "/process", label: "Process" },
  { to: "/technologies", label: "Technologies" },
  { to: "/portfolio", label: "Work" },
  { to: "/team", label: "Team" },
  { to: "/careers", label: "Careers" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const legalLinks = [
  { to: "/legal/privacy", label: "Privacy policy" },
  { to: "/legal/cookies", label: "Cookie policy" },
  { to: "/legal/terms", label: "Terms of service" },
  { to: "/legal/imprint", label: "Imprint" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="font-display text-lg font-semibold">{company.name}</span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.tagline}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a className="hover:text-foreground" href={`mailto:${company.email}`}>
                {company.email}
              </a>
              <br />
              <a className="hover:text-foreground" href={`tel:${company.phoneHref}`}>
                {company.phone}
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {coreServiceSlugs.map((slug) => {
                const service = getService(slug);
                if (!service) return null;
                return (
                  <li key={slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug }}
                      className="transition-colors hover:text-foreground"
                    >
                      {service.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {company.name}. Registered in {company.registeredIn}.
            Company number {company.companyNumber} (placeholder — to be replaced with the
            registered company number).
          </p>
          <p className="mt-2">{company.registeredAddress}</p>
        </div>
      </Container>
    </footer>
  );
}
