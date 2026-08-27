import { createFileRoute } from "@tanstack/react-router";

import { company, story, values, idealClient } from "@/content/company";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Quorlex Soft — Our story, vision and values" },
      {
        name: "description",
        content:
          "Why Quorlex Soft exists, the founder's background in software engineering and applied AI, our long-term vision, values and delivery model.",
      },
      { property: "og:title", content: "About Quorlex Soft" },
      {
        property: "og:description",
        content:
          "A technology partner built to take organisations from a business problem to a complete, working digital system.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A technology partner, not a one-off vendor"
        intro={company.positioning}
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Why we exist" title="From business problem to working system" />
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {story.why.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Founder story" title="Research, engineering and applied AI" />
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {story.founder.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Vision & mission" title="Where we are heading" />
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {story.vision.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Values" title="What we hold to" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {values.map((value) => (
            <div key={value.title} className="bg-card p-7">
              <h3 className="text-lg font-semibold">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Delivery model"
          title="Teams assembled around the requirement"
          intro="Rather than forcing every project through one fixed team, we assemble project teams from a network of developers, engineers, AI specialists and designers based on what the system actually needs."
        />
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Fit" title="Who we work best with" />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-7">
            <h3 className="text-base font-semibold">A good fit</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {idealClient.fit.map((item) => (
                <li key={item} className="border-l-2 border-primary/60 pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-7">
            <h3 className="text-base font-semibold">Not a fit</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {idealClient.notFit.map((item) => (
                <li key={item} className="border-l-2 border-border pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
