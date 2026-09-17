import { createFileRoute } from "@tanstack/react-router";

import { LegalBlock, LegalPage } from "@/components/site/legal";
import { useSiteChrome } from "./__root";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Quorlex Soft" },
      {
        name: "description",
        content:
          "The terms covering use of this website, how enquiries and proposals work, intellectual property, and limits of liability.",
      },
      { property: "og:title", content: "Terms of service — Quorlex Soft" },
      {
        property: "og:description",
        content: "Terms covering use of this website and our engagements.",
      },
      { property: "og:url", content: "/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: Terms,
});

function Terms() {
  const { settings } = useSiteChrome();
  const name = settings?.company_name ?? "Quorlex Soft";

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of service"
      intro={`Terms covering use of this website and enquiries made to ${name}.`}
    >
      <LegalBlock heading="Use of this website">
        <p>
          This website is provided for information about our services. Content may be updated or
          changed at any time. You may not use this site unlawfully or attempt to disrupt it.
        </p>
      </LegalBlock>

      <LegalBlock heading="No offer or contract">
        <p>
          Information on this site, including service descriptions, timelines and budget ranges, is
          indicative and does not constitute a binding offer. Work is only agreed through a written
          proposal or contract signed by both parties.
        </p>
      </LegalBlock>

      <LegalBlock heading="Demonstration content">
        <p>
          Case studies and team profiles currently shown on this site are clearly labelled
          demonstration placeholders. They do not represent real clients, engagements, results or
          employees, and should not be relied on.
        </p>
      </LegalBlock>

      <LegalBlock heading="Intellectual property">
        <p>
          Site content, branding and design are owned by {name} unless stated otherwise. Ownership
          of deliverables produced in client engagements is governed by the relevant contract; our
          standard position is that source code, data and infrastructure accounts transfer to the
          client on completion of agreed commercial terms.
        </p>
      </LegalBlock>

      <LegalBlock heading="Confidentiality">
        <p>
          Information you share in an enquiry is treated as confidential and used only to assess and
          respond to your request. A mutual non-disclosure agreement can be signed on request.
        </p>
      </LegalBlock>

      <LegalBlock heading="Limitation of liability">
        <p>
          To the extent permitted by law, we accept no liability for loss arising from reliance on
          website content. Liability in client engagements is set out in the applicable contract.
        </p>
      </LegalBlock>

      <LegalBlock heading="Governing law">
        <p>
          These terms are governed by the law of England and Wales, subject to confirmation during
          legal review.
        </p>
      </LegalBlock>
    </LegalPage>
  );
}
