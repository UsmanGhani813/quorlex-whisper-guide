import { createFileRoute } from "@tanstack/react-router";

import { fetchPageWithSections, fetchProcessSteps } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Process — Quorlex Soft" },
      {
        name: "description",
        content:
          "How Quorlex Soft runs an engagement, from discovery through planning, design, development, testing, deployment and post-launch support.",
      },
      { property: "og:title", content: "Process — Quorlex Soft" },
      {
        property: "og:description",
        content: "Structured delivery from discovery to post-launch support.",
      },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  loader: async () => {
    const __page = await fetchPageWithSections("process");
    const steps = await fetchProcessSteps();
    return { steps , sections: __page.sections, sectionData: __page.data as SectionData | null };
  },
  component: Process,
});

function Process() {
  const { steps, sections, sectionData } = Route.useLoaderData();

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : (
        <>
      <PageHeader
        eyebrow="Process"
        title="From business problem to supported system"
        intro="A structured delivery process, so you always know what is happening, what has been agreed and what comes next."
      />

      <Section bordered={false}>
        <ol className="space-y-10">
          {steps.map((step) => (
            <li
              key={step.id}
              className="grid gap-6 rounded-xl border border-border bg-card p-7 md:grid-cols-[120px_1fr]"
            >
              <div>
                <span className="font-mono text-xs text-primary">
                  {String(step.step_number).padStart(2, "0")}
                </span>
                <h2 className="mt-2 text-lg font-semibold">{step.name}</h2>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                {step.outputs.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {step.outputs.map((output) => (
                      <li
                        key={output}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {output}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />        </>
      )}
    </>
  );
}
