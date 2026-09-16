import { createFileRoute } from "@tanstack/react-router";

import { faqs } from "@/content/faq";
import { CtaBand, PageHeader, Section } from "@/components/site/sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — working model, budgets, ownership | Quorlex Soft" },
      {
        name: "description",
        content:
          "How engagements start, fixed scope versus ongoing work, who owns the code, how changes are handled, support after launch and what we need to estimate.",
      },
      { property: "og:title", content: "Frequently asked questions — Quorlex Soft" },
      {
        property: "og:description",
        content: "Straight answers on scope, budgets, ownership, communication and support.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions we are asked before a project starts"
        intro="If your question is not here, ask it directly — we will answer plainly."
      />

      <Section bordered={false}>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqs.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <CtaBand />
    </>
  );
}
