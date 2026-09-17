import { createFileRoute } from "@tanstack/react-router";

import { fetchIndustries } from "@/lib/cms";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — Quorlex Soft" },
      {
        name: "description",
        content:
          "Sectors Quorlex Soft builds technology for, including SaaS, e-commerce, fintech, proptech, healthtech, edtech, logistics, manufacturing and professional services.",
      },
      { property: "og:title", content: "Industries — Quorlex Soft" },
      {
        property: "og:description",
        content: "Where we deliver technology, and typical systems in each sector.",
      },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
  loader: async () => {
    const industries = await fetchIndustries();
    return { industries };
  },
  component: Industries,
});

function Industries() {
  const { industries } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Sectors we build technology for"
        intro="We work across most information-driven sectors. The common thread is systems where data, permissions and integration matter as much as the interface."
      />

      <Section bordered={false}>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article key={industry.slug} className="bg-card p-7">
              <h2 className="text-lg font-semibold">{industry.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{industry.body}</p>
              {industry.examples.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {industry.examples.map((ex) => (
                    <li
                      key={ex}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
