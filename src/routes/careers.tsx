import { createFileRoute } from "@tanstack/react-router";

import { company } from "@/content/company";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — work with Quorlex Soft" },
      {
        name: "description",
        content:
          "We work with engineers, AI specialists, cloud architects, designers and delivery leads on a per-project basis. Send a general application any time.",
      },
      { property: "og:title", content: "Careers — Quorlex Soft" },
      {
        property: "og:description",
        content: "Open disciplines and how to send a general application.",
      },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: Careers,
});

const disciplines = [
  {
    name: "Full-stack engineers",
    body: "TypeScript, React and Node.js, comfortable owning a feature from data model to interface.",
  },
  {
    name: "AI engineers",
    body: "Retrieval systems, agent workflows and honest evaluation of model behaviour in production.",
  },
  {
    name: "Cloud and DevOps engineers",
    body: "Infrastructure as code, deployment pipelines, observability and cost-aware architecture.",
  },
  {
    name: "Mobile engineers",
    body: "React Native, Swift or Kotlin, including offline-first and integration-heavy applications.",
  },
  {
    name: "Product and UI/UX designers",
    body: "Complex systems people use daily — flows, interface design and design systems.",
  },
  {
    name: "Business analysts and delivery leads",
    body: "Turning business problems into documented requirements and keeping delivery on scope.",
  },
];

function Careers() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Work on systems that matter"
        intro="We assemble project teams from a network of experienced specialists. Applications are open continuously rather than tied to fixed vacancies."
      />

      <Section bordered={false}>
        <SectionHeading
          eyebrow="Disciplines"
          title="Who we want to hear from"
          intro="Collaboration is remote and project-based, with clear scope and written communication."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((discipline) => (
            <article key={discipline.name} className="bg-card p-7">
              <h3 className="text-base font-semibold">{discipline.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{discipline.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          eyebrow="Apply"
          title="General application"
          intro="Email us your CV or portfolio, the discipline you work in, and a short note on a system you are proud of. We reply to applications we can place on current or upcoming work."
        />
        <a
          href={`mailto:${company.email}?subject=General application`}
          className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Email {company.email}
        </a>
      </Section>

      <CtaBand
        title="Looking for a partner instead of a role?"
        body="If you have a system that needs building, start a conversation with us instead."
      />
    </>
  );
}
