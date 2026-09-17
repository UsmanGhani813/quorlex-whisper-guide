import { createFileRoute } from "@tanstack/react-router";

import { LegalBlock, LegalPage } from "@/components/site/legal";
import { useSiteChrome } from "./__root";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — Quorlex Soft" },
      {
        name: "description",
        content:
          "Which cookies and local storage entries this website uses, what they do, and how to change your choice.",
      },
      { property: "og:title", content: "Cookie policy — Quorlex Soft" },
      { property: "og:description", content: "The cookies and storage this website uses." },
      { property: "og:url", content: "/legal/cookies" },
    ],
    links: [{ rel: "canonical", href: "/legal/cookies" }],
  }),
  component: Cookies,
});

function Cookies() {
  const { settings } = useSiteChrome();
  const email = settings?.email ?? "";

  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie policy"
      intro="This site keeps its use of cookies and browser storage to a minimum."
    >
      <LegalBlock heading="What we store">
        <p>
          We store two entries in your browser: your cookie choice, and your light or dark theme
          preference. Both are stored locally in your browser and are not used to track you across
          other websites.
        </p>
      </LegalBlock>

      <LegalBlock heading="Essential storage">
        <p>
          Essential entries are required for the site to function and to remember that you have
          answered the cookie banner. These are set when you make a choice on the banner.
        </p>
      </LegalBlock>

      <LegalBlock heading="Analytics and marketing">
        <p>
          We currently run no advertising or third-party marketing cookies. If analytics is added in
          future, this policy will be updated and consent will be requested before any analytics
          cookie is set.
        </p>
      </LegalBlock>

      <LegalBlock heading="Third-party requests">
        <p>
          Web fonts are loaded from Google Fonts, which means your browser makes a request to that
          service. No cookie is set by us for that request.
        </p>
      </LegalBlock>

      <LegalBlock heading="Changing your choice">
        <p>
          You can clear this site's data in your browser settings at any time; the cookie banner
          will then appear again.
          {email ? ` Questions: ${email}.` : ""}
        </p>
      </LegalBlock>
    </LegalPage>
  );
}
