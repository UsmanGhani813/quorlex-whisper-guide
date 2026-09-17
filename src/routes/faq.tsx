import { createFileRoute } from "@tanstack/react-router";

import { fetchFaqs } from "@/lib/cms";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Quorlex Soft" },
      {
        name: "description",
        content:
          "Common questions about how Quorlex Soft engages, scopes, delivers and supports projects.",
      },
      { property: "og:title", content: "FAQ — Quorlex Soft" },
      {
        property: "og:description",
        content: "How we work, what to expect, and how projects run.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  loader: async () => {
    const faqs = await fetchFaqs();
    return { faqs };
  },
  component: Faq,
});

function Faq() {
  const { faqs } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="How we work, what to expect, and how projects run."
      />

      <Section bordered={false}>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {faqs.map((item) => (
            <details key={item.id} className="group p-6">
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-foreground">
                {item.question}
                <span className="mt-1 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
