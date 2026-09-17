import { createFileRoute } from "@tanstack/react-router";

import { fetchAboutBundle, fetchPageWithSections } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
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
  loader: async () => {
    const __page = await fetchPageWithSections("about");
    const bundle = await fetchAboutBundle();
    return bundle;
  },
  component: About,
});

function About() {
  const { settings, values, story, idealClient, sections, sectionData } = Route.useLoaderData();
  const why = story.filter((s) => s.kind === "why");
  const founder = story.filter((s) => s.kind === "founder");
  const vision = story.filter((s) => s.kind === "vision");
  const fit = idealClient.filter((i) => i.kind === "fit");
  const notFit = idealClient.filter((i) => i.kind === "not_fit");

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : (
        <>
      <PageHeader
        eyebrow="About"
        title="A technology partner, not a one-off vendor"
        intro={settings?.positioning ?? ""}
      />

      {why.length > 0 ? (
        <Section bordered={false}>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow="Why we exist" title="From business problem to working system" />
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              {why.map((paragraph) => (
                <p key={paragraph.id}>{paragraph.body}</p>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {founder.length > 0 ? (
        <Section className="bg-surface">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow="Founder story" title="Research, engineering and applied AI" />
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              {founder.map((paragraph) => (
                <p key={paragraph.id}>{paragraph.body}</p>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {vision.length > 0 ? (
        <Section>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow="Vision & mission" title="Where we are heading" />
            <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
              {vision.map((paragraph) => (
                <p key={paragraph.id}>{paragraph.body}</p>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {values.length > 0 ? (
        <Section className="bg-surface">
          <SectionHeading eyebrow="Values" title="What we hold to" />
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.id} className="bg-card p-7">
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section>
        <SectionHeading
          eyebrow="Delivery model"
          title="Teams assembled around the requirement"
          intro="Rather than forcing every project through one fixed team, we assemble project teams from a network of developers, engineers, AI specialists and designers based on what the system actually needs."
        />
      </Section>

      {(fit.length + notFit.length) > 0 ? (
        <Section className="bg-surface">
          <SectionHeading eyebrow="Fit" title="Who we work best with" />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {fit.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-7">
                <h3 className="text-base font-semibold">A good fit</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {fit.map((item) => (
                    <li key={item.id} className="border-l-2 border-primary/60 pl-3">
                      {item.body}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {notFit.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-7">
                <h3 className="text-base font-semibold">Not a fit</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {notFit.map((item) => (
                    <li key={item.id} className="border-l-2 border-border pl-3">
                      {item.body}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <CtaBand />        </>
      )}
    </>
  );
}
