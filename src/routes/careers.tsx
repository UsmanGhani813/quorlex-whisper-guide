import { createFileRoute } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { fetchJobs, fetchPageWithSections } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
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
  loader: async () => {
    const __page = await fetchPageWithSections("careers");
    const [jobs, { data: settings }] = await Promise.all([
      fetchJobs(),
      supabase.from("site_settings").select("email").maybeSingle(),
    ]);
    return { jobs, email: settings?.email ?? "hello@example.com" , sections: __page.sections, sectionData: __page.data as SectionData | null };
  },
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
  const { jobs, email, sections, sectionData } = Route.useLoaderData();

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : (
        <>
      <PageHeader
        eyebrow="Careers"
        title="Work on systems that matter"
        intro="We assemble project teams from a network of experienced specialists. Applications are open continuously rather than tied to fixed vacancies."
      />

      {jobs.length > 0 ? (
        <Section bordered={false}>
          <SectionHeading eyebrow="Open roles" title="Current openings" />
          <div className="mt-10 space-y-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {job.employment_type.replace("_", " ")}
                    {job.location ? ` · ${job.location}` : ""}
                  </span>
                </div>
                {job.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {job.description}
                  </p>
                ) : null}
                <a
                  href={
                    job.apply_url
                      ? job.apply_url
                      : `mailto:${job.apply_email ?? email}?subject=Application: ${job.title}`
                  }
                  className="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Apply
                </a>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <Section bordered={jobs.length > 0}>
        <SectionHeading
          eyebrow="Disciplines"
          title="Who we want to hear from"
          intro="Collaboration is remote and project-based, with clear scope and written communication."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((discipline) => (
            <article key={discipline.name} className="bg-card p-7">
              <h3 className="text-base font-semibold">{discipline.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {discipline.body}
              </p>
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
          href={`mailto:${email}?subject=General application`}
          className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Email {email}
        </a>
      </Section>

      <CtaBand
        title="Looking for a partner instead of a role?"
        body="If you have a system that needs building, start a conversation with us instead."
      />        </>
      )}
    </>
  );
}
