import { createFileRoute } from "@tanstack/react-router";

import { LegalBlock, LegalPage } from "@/components/site/legal";
import { useSiteChrome } from "./__root";

export const Route = createFileRoute("/legal/imprint")({
  head: () => ({
    meta: [
      { title: "Imprint — Quorlex Soft" },
      {
        name: "description",
        content:
          "Legal disclosure for Quorlex Soft: company details, registration, contact information and responsibility for content.",
      },
      { property: "og:title", content: "Imprint — Quorlex Soft" },
      { property: "og:description", content: "Company and contact disclosure for Quorlex Soft." },
      { property: "og:url", content: "/legal/imprint" },
    ],
    links: [{ rel: "canonical", href: "/legal/imprint" }],
  }),
  component: Imprint,
});

function Imprint() {
  const { settings } = useSiteChrome();
  const s = settings ?? ({} as Record<string, string | null>);

  return (
    <LegalPage
      eyebrow="Legal"
      title="Imprint"
      intro="Legal disclosure and company information."
    >
      <LegalBlock heading="Company details">
        <p>
          {s.company_name ?? "Quorlex Soft"}
          <br />
          {s.registered_in ? <>Registered in {s.registered_in}<br /></> : null}
          {s.company_number ? <>Company number: {s.company_number}<br /></> : null}
          {s.registered_address ? <>{s.registered_address}<br /></> : null}
          {s.legal_structure}
        </p>
      </LegalBlock>

      <LegalBlock heading="Contact">
        <p>
          {s.email ? <>Email: {s.email}<br /></> : null}
          {s.phone ? <>Phone: {s.phone}</> : null}
        </p>
      </LegalBlock>

      <LegalBlock heading="Responsibility for content">
        <p>
          Responsibility for the content of this website rests with the company management of{" "}
          {s.company_name ?? "Quorlex Soft"} at the address above. Name of the responsible person to
          be added during legal review.
        </p>
      </LegalBlock>

      <LegalBlock heading="VAT and registration numbers">
        <p>
          VAT identification number and any additional registration details to be added once
          confirmed.
        </p>
      </LegalBlock>

      <LegalBlock heading="External links">
        <p>
          We are not responsible for the content of external websites linked from this site.
          Responsibility for linked content rests with its respective operator.
        </p>
      </LegalBlock>
    </LegalPage>
  );
}
