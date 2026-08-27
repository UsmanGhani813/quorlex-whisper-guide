import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { technologies, securityPractices } from "@/content/technologies";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/technologies")({
  head: () => ({
    meta: [
      { title: "Technology stack — Quorlex Soft" },
      {
        name: "description",
        content:
          "The languages, frameworks, data stores, AI tooling, cloud platforms and delivery tools Quorlex Soft builds with, plus our standard security practices.",
      },
      { property: "og:title", content: "Technology stack — Quorlex Soft" },
      {
        property: "og:description",
        content: "Chosen per project for fit and longevity, not fashion.",
      },
      { property: "og:url", content: "/technologies" },
    ],
    links: [{ rel: "canonical", href: "/technologies" }],
  }),
  component: Technologies,
});

function Technologies() {
  return (
    <>
      <PageHeader
        eyebrow="Technologies"
        title="Tools chosen for fit and longevity"
        intro="We pick the stack that suits the problem, your team's ability to maintain it, and the system's expected lifetime — not whatever is fashionable."
      />

      <Section bordered={false}>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {technologies.map((group) => (
            <div key={group.name} className="bg-card p-7">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {group.name}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Security"
          title="Standard practices on every project"
          intro="These apply by default. Formal compliance certification is out of scope unless separately agreed."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {securityPractices.map((practice) => (
            <li
              key={practice}
              className="flex gap-3 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{practice}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
