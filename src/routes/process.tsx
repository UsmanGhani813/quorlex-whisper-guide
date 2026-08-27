import { createFileRoute } from "@tanstack/react-router";

import { processSteps, engagementNotes } from "@/content/process";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our delivery process — Quorlex Soft" },
      {
        name: "description",
        content:
          "Discovery, planning and architecture, design, development, testing, deployment and support — how a Quorlex Soft engagement runs from first call to live system.",
      },
      { property: "og:title", content: "Delivery process — Quorlex Soft" },
      {
        property: "og:description",
        content: "A seven-stage delivery process with written scope, phased plans and an agreed support model.",
      },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: Process,
});

function Process() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="Predictable delivery, from first call to live system"
        intro="Nothing is built before the problem, the scope and the architecture are written down and agreed."
      />

      <Section bordered={false}>
        <ol className="space-y-px overflow-hidden rounded-xl border border-border bg-border">
          {processSteps.map((step) => (
            <li key={step.step} className="grid gap-6 bg-card p-7 md:grid-cols-[80px_1fr_260px]">
              <span className="font-mono text-sm text-primary">{step.step}</span>
              <div>
                <h2 className="text-lg font-semibold">{step.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {step.outputs.map((output) => (
                  <li key={output} className="border-l-2 border-primary/60 pl-3">
                    {output}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Working with us" title="How an engagement runs day to day" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {engagementNotes.map((note) => (
            <div key={note.title} className="bg-card p-7">
              <h3 className="text-base font-semibold">{note.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
