import { createFileRoute } from "@tanstack/react-router";

import { industries } from "@/content/industries";
import { company } from "@/content/company";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries we build for — Quorlex Soft" },
      {
        name: "description",
        content:
          "Technology, e-commerce, fintech, proptech, healthtech, edtech, logistics, manufacturing, professional services, hospitality, media and startups.",
      },
      { property: "og:title", content: "Industries — Quorlex Soft" },
      {
        property: "og:description",
        content: "Sectors we build software, AI and cloud systems for, and the systems each typically needs.",
      },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  component: Industries,
});

function Industries() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Industry-flexible, problem-specific"
        intro="We are not tied to a single sector. What matters is a clearly defined business problem and a system worth building properly."
      />

      <Section bordered={false}>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article key={industry.slug} className="bg-card p-7">
              <h2 className="text-lg font-semibold">{industry.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{industry.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {industry.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Markets" title="Where we work" />
        <div className="mt-8 flex flex-wrap gap-2">
          {company.markets.map((market) => (
            <span
              key={market}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
            >
              {market}
            </span>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
