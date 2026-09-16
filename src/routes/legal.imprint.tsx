import { createFileRoute } from "@tanstack/react-router";

import { company } from "@/content/company";
import { LegalBlock, LegalPage } from "@/components/site/legal";

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
  return (
    <LegalPage
      eyebrow="Legal"
      title="Imprint"
      intro="Legal disclosure and company information."
    >
      <LegalBlock heading="Company details">
        <p>
          {company.name}
          <br />
          Registered in {company.registeredIn}
          <br />
          Company number: {company.companyNumber} (placeholder — to be replaced)
          <br />
          {company.registeredAddress}
          <br />
          {company.legalStructure}
        </p>
      </LegalBlock>

      <LegalBlock heading="Contact">
        <p>
          Email: {company.email}
          <br />
          Phone: {company.phone}
        </p>
      </LegalBlock>

      <LegalBlock heading="Responsibility for content">
        <p>
          Responsibility for the content of this website rests with the company management of{" "}
          {company.name} at the address above. Name of the responsible person to be added during
          legal review.
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
