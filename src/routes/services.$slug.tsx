import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { fetchServiceBySlug } from "@/lib/cms";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const service = await fetchServiceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    if (!service) {
      return { meta: [{ title: "Service not found — Quorlex Soft" }] };
    }
    return {
      meta: [
        { title: `${service.name} — Quorlex Soft` },
        { name: "description", content: service.seo_description ?? service.short ?? undefined },
        { property: "og:title", content: `${service.name} — Quorlex Soft` },
        {
          property: "og:description",
          content: service.seo_description ?? service.summary ?? undefined,
        },
        { property: "og:url", content: `/services/${service.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${service.slug}` }],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={service.name}
        intro={service.summary ?? ""}
      />

      <Section bordered={false}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-primary">The problem</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.problem}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">How we approach it</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.solution}</p>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <BulletList title="What is included" items={service.includes} />
          <BulletList title="What is not included" items={service.excludes} muted />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Deliverables</h2>
            <ul className="mt-6 space-y-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Business outcomes</h2>
            <ul className="mt-6 space-y-3">
              {service.benefits.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-lg font-semibold">Indicative timeline</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.timeline}</p>
          </div>
          {service.technologies.length ? (
            <div>
              <h2 className="text-lg font-semibold">Typical technologies</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.technologies.map((tech) => (
                  <li
                    key={tech.id}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      <Section>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm text-primary"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          All services
        </Link>
      </Section>

      <CtaBand />
    </>
  );
}

function BulletList({
  title,
  items,
  muted,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed">
            <span
              className={
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " +
                (muted ? "bg-muted-foreground" : "bg-primary")
              }
            />
            <span className={muted ? "text-muted-foreground" : undefined}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
