import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { company } from "@/content/company";
import { services, coreServiceSlugs, getService } from "@/content/services";
import { projects } from "@/content/projects";
import { processSteps } from "@/content/process";
import { industries } from "@/content/industries";
import { Container, CtaBand, Section, SectionHeading, Eyebrow } from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quorlex Soft — Custom Software, SaaS, AI and Cloud Engineering" },
      {
        name: "description",
        content:
          "Quorlex Soft is a UK-registered technology company building custom software, SaaS platforms, AI systems, mobile apps and cloud infrastructure for organisations worldwide.",
      },
      { property: "og:title", content: "Quorlex Soft — Engineering the systems businesses run on" },
      {
        property: "og:description",
        content:
          "Custom software, SaaS platforms, AI systems and cloud infrastructure, engineered for organisations that need a durable technology partner.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <Container className="relative py-24 sm:py-32">
          <Eyebrow>Technology & software solutions · {company.registeredIn}</Eyebrow>
          <h1 className="text-balance-tight max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Engineering the systems businesses run on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {company.positioning}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Explore capabilities
            </Link>
          </div>

          <dl className="mt-16 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
            {[
              { k: "Delivery model", v: "Project teams assembled per requirement" },
              { k: "Engagement", v: "Written scope, architecture and phased plan" },
              { k: "Ownership", v: "Code, data and infrastructure transfer to you" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.k}
                </dt>
                <dd className="mt-2 text-sm text-foreground">{item.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section bordered={false}>
        <SectionHeading
          eyebrow="Capabilities"
          title="One partner across the full technology stack"
          intro="Software engineering, artificial intelligence, automation, cloud and product design under one roof — so you are not assembling a solution from a dozen suppliers."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {coreServiceSlugs.map((slug) => {
            const service = getService(slug);
            if (!service) return null;
            return (
              <Link
                key={slug}
                to="/services/$slug"
                params={{ slug }}
                className="group bg-card p-7 transition-colors hover:bg-secondary"
              >
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Plus{" "}
          {services
            .filter((s) => !coreServiceSlugs.includes(s.slug))
            .map((s) => s.name)
            .join(", ")}
          .{" "}
          <Link to="/services" className="text-primary underline underline-offset-4">
            See all services
          </Link>
        </p>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Why teams work with us"
            title="Structured engineering, not improvisation"
            intro="Every engagement starts with the business problem and a written plan. Nothing is built before the scope, architecture and success criteria are agreed."
          />
          <ul className="space-y-4">
            {[
              "Requirements, architecture and phased timeline in writing before development",
              "Code review, automated tests and a security pass on every release",
              "A named point of contact and a written weekly update",
              "Source code, data and infrastructure ownership transfer to you",
              "Support model agreed before launch, not after",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Selected work"
          title="Case studies"
          intro="Illustrative demonstration case studies showing how we structure and deliver systems. These are placeholder projects, not real client engagements."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              to="/portfolio/$slug"
              params={{ slug: project.slug }}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                {project.industry}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{project.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                View case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow="How we work"
          title="From business problem to supported system"
          intro="A seven-stage delivery process, so you always know what is happening and what comes next."
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.step} className="bg-card p-6">
              <span className="font-mono text-xs text-primary">{step.step}</span>
              <h3 className="mt-2 text-base font-semibold">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
          <li className="flex items-center bg-card p-6">
            <Link
              to="/process"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Full process
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </li>
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="Industries" title="Sectors we build for" />
        <div className="mt-8 flex flex-wrap gap-2">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              to="/industries"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {industry.name}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
