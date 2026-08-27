import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus } from "lucide-react";

import { getService, services } from "@/content/services";
import { Container, CtaBand, Section } from "@/components/site/sections";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — Quorlex Soft" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.name} — Quorlex Soft` },
        { name: "description", content: service.short },
        { property: "og:title", content: `${service.name} — Quorlex Soft` },
        { property: "og:description", content: service.summary },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <Section bordered={false}>
      <h1 className="text-3xl font-semibold">Service not found</h1>
      <p className="mt-3 text-muted-foreground">
        That service does not exist.{" "}
        <Link to="/services" className="text-primary underline underline-offset-4">
          See all services
        </Link>
        .
      </p>
    </Section>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 4);

  return (
    <>
      <header className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <Container className="relative py-16 sm:py-24">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services
          </Link>
          <h1 className="text-balance-tight mt-6 max-w-4xl text-4xl font-semibold sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {service.summary}
          </p>
        </Container>
      </header>

      <Section bordered={false}>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-7">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              The problem
            </h2>
            <p className="mt-4 leading-relaxed">{service.problem}</p>
          </div>
          <div className="rounded-xl border border-primary/40 bg-card p-7">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Our approach
            </h2>
            <p className="mt-4 leading-relaxed">{service.solution}</p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">What is included</h2>
            <ul className="mt-5 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">What is not included</h2>
            <ul className="mt-5 space-y-3">
              {service.excludes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">Deliverables</h2>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {service.deliverables.map((item) => (
                <li key={item} className="border-l-2 border-primary/60 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Business benefits</h2>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {service.benefits.map((item) => (
                <li key={item} className="border-l-2 border-border pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Technologies</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Typical timeline
            </p>
            <p className="mt-2 text-sm">{service.timeline}</p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <h2 className="text-xl font-semibold">Related services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((item) => (
            <Link
              key={item.slug}
              to="/services/$slug"
              params={{ slug: item.slug }}
              className="rounded-lg border border-border bg-card p-5 text-sm font-medium transition-colors hover:border-primary/50"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand title={`Need ${service.name.toLowerCase()}?`} />
    </>
  );
}
