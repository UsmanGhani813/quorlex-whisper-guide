/**
 * SectionRenderer — renders any page_sections row by its `kind`.
 *
 * Adding a new section kind is one file:
 *   1. Add a new case below.
 *   2. Optionally teach the admin editor about its config schema
 *      (src/routes/admin.sections.$pageSlug.tsx).
 */

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Cpu,
  Layers,
  Quote,
} from "lucide-react";

import type {
  PageSectionRow,
  ProcessStepWithOutputs,
  ServiceWithBullets,
  TeamMemberWithExpertise,
} from "@/lib/cms";
import type { IndustryWithExamples, ProjectFull } from "@/lib/cms";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/site/sections";
import { Reveal } from "@/components/site/reveal";

// ---------- helpers ----------

type CtaCfg = { label?: string; href?: string };

function readCta(v: unknown): CtaCfg | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  return {
    label: typeof o.label === "string" ? o.label : undefined,
    href: typeof o.href === "string" ? o.href : undefined,
  };
}

function CtaLink({ cta, variant = "primary" }: { cta: CtaCfg | null; variant?: "primary" | "ghost" }) {
  if (!cta?.href || !cta.label) return null;
  const base =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      : "inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-foreground";
  return (
    <Link to={cta.href} className={base}>
      {cta.label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

// ---------- shared data the renderer needs from the loader ----------

export type SectionData = {
  services: ServiceWithBullets[];
  industries: IndustryWithExamples[];
  projects: ProjectFull[];
  processSteps: ProcessStepWithOutputs[];
  featuredMember: TeamMemberWithExpertise | null;
  members: TeamMemberWithExpertise[];
  insightsCount: number;
};

// ---------- section renderers ----------

function HeroBlock({ s }: { s: PageSectionRow }) {
  const cfg = s.config as Record<string, unknown>;
  const primary = readCta(cfg.primary_cta);
  const secondary = readCta(cfg.secondary_cta);
  const badges = Array.isArray(cfg.badges) ? (cfg.badges as string[]) : [];
  return (
    <header className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <Container className="relative py-20 sm:py-28">
        {s.eyebrow ? <Eyebrow>{s.eyebrow}</Eyebrow> : null}
        {s.title ? (
          <h1 className="text-balance-tight max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {s.title}
          </h1>
        ) : null}
        {s.subtitle ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {s.subtitle}
          </p>
        ) : null}
        {(primary || secondary) && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaLink cta={primary} />
            <CtaLink cta={secondary} variant="ghost" />
          </div>
        )}
        {badges.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border/70 bg-background/80 px-3 py-1 font-mono uppercase tracking-[0.16em] text-muted-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        ) : null}
      </Container>
    </header>
  );
}

function FeatureCardsBlock({ s }: { s: PageSectionRow }) {
  const cards = (s.config as Record<string, unknown>).cards;
  const list = Array.isArray(cards) ? (cards as { title: string; body: string }[]) : [];
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {list.map((c) => (
          <div
            key={c.title}
            className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ServicesGridBlock({
  s,
  services,
}: {
  s: PageSectionRow;
  services: ServiceWithBullets[];
}) {
  const cfg = s.config as { limit?: number; show_core_only?: boolean; link_to_detail?: boolean };
  const list = (cfg.show_core_only ? services.filter((x) => x.is_core) : services).slice(
    0,
    cfg.limit ?? 12,
  );
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((svc) => (
          <Link
            key={svc.id}
            to="/services/$slug"
            params={{ slug: svc.slug }}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <Layers className="mb-4 h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{svc.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {svc.short ?? svc.summary ?? ""}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function IndustriesGridBlock({
  s,
  industries,
}: {
  s: PageSectionRow;
  industries: IndustryWithExamples[];
}) {
  const cfg = s.config as { limit?: number };
  const list = industries.slice(0, cfg.limit ?? 12);
  return (
    <Section className="bg-surface">
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((ind) => (
          <div key={ind.id} className="rounded-lg border border-border bg-card p-5">
            <Building2 className="mb-3 h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">{ind.name}</h3>
            {ind.body ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {ind.body}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

function FounderSpotlightBlock({
  s,
  featuredMember,
}: {
  s: PageSectionRow;
  featuredMember: TeamMemberWithExpertise | null;
}) {
  const cfg = s.config as {
    layout?: "compact" | "detailed";
    show_publications?: boolean;
    show_experience?: boolean;
    show_degrees?: boolean;
    cta?: unknown;
  };
  const detailed = cfg.layout === "detailed";
  if (!featuredMember) return null;
  const publications = Array.isArray(featuredMember.publications)
    ? (featuredMember.publications as Array<{ title: string; venue: string; year?: number; doi?: string }>)
    : [];
  const cta = readCta(cfg.cta);
  const photoUrl =
    (featuredMember as { photo_url?: string | null }).photo_url ?? null;
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_2fr]">
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={featuredMember.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end p-6 text-white">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary-foreground/90">
                  {featuredMember.title}
                </div>
                <div className="mt-1 text-2xl font-semibold">{featuredMember.name}</div>
                {featuredMember.location ? (
                  <div className="mt-1 text-xs text-white/80">{featuredMember.location}</div>
                ) : null}
              </div>
            </div>
          </div>
          {featuredMember.pull_quote ? (
            <blockquote className="mt-6 rounded-lg border-l-4 border-primary bg-card p-5 text-sm italic text-foreground/90">
              <Quote className="mb-2 h-4 w-4 text-primary" />“{featuredMember.pull_quote}”
            </blockquote>
          ) : null}
        </div>

        <div>
          {featuredMember.bio ? (
            <p className="text-base leading-relaxed text-muted-foreground">{featuredMember.bio}</p>
          ) : null}

          {detailed && cfg.show_degrees !== false && featuredMember.degrees ? (
            <div className="mt-8">
              <h4 className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">
                Education
              </h4>
              <p className="text-sm leading-relaxed">{featuredMember.degrees}</p>
            </div>
          ) : null}

          {detailed && cfg.show_experience !== false && featuredMember.experience ? (
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">
                Experience
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {featuredMember.experience}
              </p>
            </div>
          ) : null}

          {featuredMember.expertise.length ? (
            <div className="mt-6">
              <h4 className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">
                Areas of expertise
              </h4>
              <ul className="flex flex-wrap gap-2">
                {featuredMember.expertise.map((e) => (
                  <li
                    key={e}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {detailed && cfg.show_publications && publications.length ? (
            <div className="mt-8">
              <h4 className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-primary">
                Selected publications
              </h4>
              <ul className="space-y-3">
                {publications.map((p) => (
                  <li key={p.title} className="rounded-lg border border-border bg-card p-4 text-sm">
                    <BookOpen className="mb-1.5 h-4 w-4 text-primary" />
                    <div className="font-medium">{p.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {p.venue}
                      {p.year ? ` · ${p.year}` : ""}
                      {p.doi ? ` · DOI ${p.doi}` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {cta ? <div className="mt-8"><CtaLink cta={cta} /></div> : null}
        </div>
      </div>
    </Section>
  );
}

function ProcessTimelineBlock({
  s,
  processSteps,
}: {
  s: PageSectionRow;
  processSteps: ProcessStepWithOutputs[];
}) {
  const cfg = s.config as { limit?: number };
  const list = processSteps.slice(0, cfg.limit ?? 12);
  return (
    <Section className="bg-surface">
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <ol className="mt-12 space-y-6 border-l border-border pl-6">
        {list.map((step) => (
          <li key={step.id} className="relative">
            <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background font-mono text-xs text-primary">
              {step.step_number}
            </span>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">{step.name}</h3>
              {step.body ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              ) : null}
              {step.outputs.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {step.outputs.map((o) => (
                    <li
                      key={o}
                      className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function QuoteBlock({ s }: { s: PageSectionRow }) {
  const cfg = s.config as { quote?: string; attribution?: string };
  if (!cfg.quote) return null;
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <Quote className="mx-auto mb-4 h-6 w-6 text-primary" />
        <blockquote className="text-balance-tight text-2xl font-medium leading-relaxed sm:text-3xl">
          “{cfg.quote}”
        </blockquote>
        {cfg.attribution ? (
          <div className="mt-4 text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
            {cfg.attribution}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function RichTextBlock({ s }: { s: PageSectionRow }) {
  const body = (s.config as { body?: string }).body ?? "";
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} />
      <div className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted-foreground">
        {body}
      </div>
    </Section>
  );
}

function CtaBlock({ s }: { s: PageSectionRow }) {
  const cfg = s.config as Record<string, unknown>;
  const primary = readCta(cfg.primary_cta);
  const secondary = readCta(cfg.secondary_cta);
  return (
    <Section className="bg-surface">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          {s.eyebrow ? <Eyebrow>{s.eyebrow}</Eyebrow> : null}
          {s.title ? <h2 className="text-2xl font-semibold sm:text-3xl">{s.title}</h2> : null}
          {s.subtitle ? <p className="mt-3 text-muted-foreground">{s.subtitle}</p> : null}
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <CtaLink cta={primary} />
          <CtaLink cta={secondary} variant="ghost" />
        </div>
      </div>
    </Section>
  );
}

function PortfolioGridBlock({
  s,
  projects,
}: {
  s: PageSectionRow;
  projects: ProjectFull[];
}) {
  const cfg = s.config as { limit?: number };
  const list = projects.slice(0, cfg.limit ?? 6);
  if (!list.length) return null;
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {list.map((p) => (
          <Link
            key={p.id}
            to="/portfolio/$slug"
            params={{ slug: p.slug }}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <Award className="mb-4 h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            {p.client ? (
              <p className="mt-1 text-sm text-muted-foreground">{p.client}</p>
            ) : null}
            {p.summary ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {p.summary}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </Section>
  );
}

function MetricsBlock({ s }: { s: PageSectionRow }) {
  const cfg = s.config as { metrics?: { label: string; value: string; hint?: string }[] };
  const list = cfg.metrics ?? [];
  if (!list.length) return null;
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {list.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-6">
            <div className="text-4xl font-semibold text-primary">{m.value}</div>
            <div className="mt-2 text-sm font-semibold">{m.label}</div>
            {m.hint ? <div className="mt-1 text-xs text-muted-foreground">{m.hint}</div> : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

function TeamGridBlock({
  s,
  members,
}: {
  s: PageSectionRow;
  members: TeamMemberWithExpertise[];
}) {
  const cfg = s.config as { limit?: number; leadership_only?: boolean };
  const list = (cfg.leadership_only ? members.filter((m) => m.is_leadership) : members).slice(
    0,
    cfg.limit ?? 12,
  );
  if (!list.length) return null;
  return (
    <Section>
      <SectionHeading eyebrow={s.eyebrow ?? undefined} title={s.title ?? ""} intro={s.subtitle ?? undefined} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-6">
            <Cpu className="mb-3 h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">{m.name}</h3>
            <div className="mt-0.5 text-xs text-muted-foreground">{m.title}</div>
            {m.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-4">{m.bio}</p>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- top-level switch ----------

export function SectionRenderer({
  section,
  data,
}: {
  section: PageSectionRow;
  data: SectionData;
}): ReactNode {
  switch (section.kind) {
    case "hero":
      return <HeroBlock s={section} />;
    case "feature_cards":
      return <FeatureCardsBlock s={section} />;
    case "services_grid":
      return <ServicesGridBlock s={section} services={data.services} />;
    case "industries_grid":
      return <IndustriesGridBlock s={section} industries={data.industries} />;
    case "founder_spotlight":
      return <FounderSpotlightBlock s={section} featuredMember={data.featuredMember} />;
    case "process_timeline":
      return <ProcessTimelineBlock s={section} processSteps={data.processSteps} />;
    case "quote":
      return <QuoteBlock s={section} />;
    case "rich_text":
      return <RichTextBlock s={section} />;
    case "cta":
      return <CtaBlock s={section} />;
    case "portfolio_grid":
      return <PortfolioGridBlock s={section} projects={data.projects} />;
    case "metrics":
      return <MetricsBlock s={section} />;
    case "team_grid":
      return <TeamGridBlock s={section} members={data.members} />;
    default:
      return null;
  }
}

export function SectionList({
  sections,
  data,
}: {
  sections: PageSectionRow[];
  data: SectionData;
}) {
  return (
    <>
      {sections.map((s, i) => (
        <Reveal key={s.id} delayMs={i === 0 ? 0 : 60}>
          <SectionRenderer section={s} data={data} />
        </Reveal>
      ))}
    </>
  );
}
