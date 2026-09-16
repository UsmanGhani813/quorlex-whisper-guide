import { createFileRoute } from "@tanstack/react-router";

import { company } from "@/content/company";
import { LegalBlock, LegalPage } from "@/components/site/legal";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — Quorlex Soft" },
      {
        name: "description",
        content:
          "How Quorlex Soft collects, uses, stores and protects personal data submitted through this website, and the rights you have over that data.",
      },
      { property: "og:title", content: "Privacy policy — Quorlex Soft" },
      { property: "og:description", content: "How we handle personal data submitted through this website." },
      { property: "og:url", content: "/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      intro={`How ${company.name} handles personal data submitted through this website.`}
    >
      <LegalBlock heading="Who we are">
        <p>
          {company.name}, registered in {company.registeredIn}, company number{" "}
          {company.companyNumber} (placeholder), is the data controller for personal data submitted
          through this website. Contact: {company.email}.
        </p>
      </LegalBlock>

      <LegalBlock heading="What we collect">
        <p>
          When you submit the enquiry form we collect the name, email address, and optionally the
          company name, phone number, service interest, budget range and project description you
          provide. We do not collect special category data and we do not ask for payment details
          through this site.
        </p>
      </LegalBlock>

      <LegalBlock heading="Why we use it">
        <p>
          To respond to your enquiry, assess whether we can help, and — if we proceed — to
          communicate about the engagement. The lawful basis is our legitimate interest in
          responding to business enquiries, and the performance of a contract where one follows.
        </p>
      </LegalBlock>

      <LegalBlock heading="How long we keep it">
        <p>
          Enquiry records are retained for as long as needed to answer the enquiry and for a
          reasonable period afterwards for business records. Retention period to be confirmed during
          legal review.
        </p>
      </LegalBlock>

      <LegalBlock heading="Who we share it with">
        <p>
          Your data is stored with our hosting and database provider acting as a processor on our
          behalf. We do not sell personal data and we do not share it for advertising purposes.
        </p>
      </LegalBlock>

      <LegalBlock heading="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal data, object to
          processing, or request a copy of the data you provided. Email {company.email} and we will
          respond within the period required by applicable law. You may also complain to your
          national data protection authority.
        </p>
      </LegalBlock>

      <LegalBlock heading="Security">
        <p>
          Data is transmitted over encrypted connections and access is restricted to those who need
          it to answer your enquiry.
        </p>
      </LegalBlock>
    </LegalPage>
  );
}
