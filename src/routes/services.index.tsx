import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { services } from "@/content/services";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Software, SaaS, AI, Mobile and Cloud | Quorlex Soft" },
      {
        name: "description",
        content:
          "Custom software, SaaS platforms, AI systems, mobile apps, cloud infrastructure, automation, web, e-commerce, product design, MVPs and technology consulting.",
      },
      { property: "og:title", content: "Services — Quorlex Soft" },
      {
        property: "og:description",
        content:
          "Ten capability areas covering the full path from business problem to supported production system.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Capabilities across the full technology stack"
        intro="Each area below is deliverable today. Project teams are assembled from a network of engineers, AI specialists and designers according to what the work requires."
      />

      <Section bordered={false}>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group bg-card p-7 transition-colors hover:bg-secondary"
            >
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {service.timeline}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
