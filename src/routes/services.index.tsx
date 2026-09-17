import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { fetchPageWithSections, fetchServices } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Quorlex Soft" },
      {
        name: "description",
        content:
          "Custom software, SaaS platforms, AI systems, mobile apps, cloud infrastructure and workflow automation, delivered by a technology partner rather than a one-off supplier.",
      },
      { property: "og:title", content: "Services — Quorlex Soft" },
      {
        property: "og:description",
        content: "The technology and product engineering services Quorlex Soft delivers.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  loader: async () => {
    const [services, page] = await Promise.all([
      fetchServices(),
      fetchPageWithSections("services"),
    ]);
    return {
      services,
      coreServices: services.filter((s) => s.is_core),
      otherServices: services.filter((s) => !s.is_core),
      sections: page.sections,
      sectionData: page.data as SectionData | null,
    };
  },
  component: Services,
});

function Services() {
  const { coreServices, otherServices, sections, sectionData } = Route.useLoaderData();

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : (
        <>
      <PageHeader
        eyebrow="Services"
        title="One partner across the full technology stack"
        intro="Six core areas we lead engagements in, plus supporting services. Every engagement is scoped in writing before development begins, with a phased plan and clear ownership."
      />

      <Section bordered={false}>
        <SectionHeading
          eyebrow="Core capabilities"
          title="Where we take the lead"
          intro="Six areas where we own the architecture, delivery and support model end to end."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {coreServices.map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
            >
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              {service.technologies.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.technologies.slice(0, 6).map((tech) => (
                    <li
                      key={tech.id}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tech.name}
                    </li>
                  ))}
                </ul>
              ) : null}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {otherServices.length > 0 ? (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow="Supporting services"
            title="Design, consulting, MVPs and specialist work"
            intro="Ancillary services we deliver alongside — or independently of — the core engineering practice."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {otherServices.map((service) => (
              <Link
                key={service.slug}
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="group bg-card p-6 transition-colors hover:bg-secondary"
              >
                <h3 className="text-base font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.short}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />        </>
      )}
    </>
  );
}
