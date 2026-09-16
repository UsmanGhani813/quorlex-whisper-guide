import type { ReactNode } from "react";

import { Container, PageHeader, Section } from "./sections";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <Section bordered={false}>
        <Container className="px-0">
          <div className="rounded-lg border border-destructive/40 bg-card px-4 py-3 text-sm">
            <span className="font-semibold">Draft — requires legal review. </span>
            This document is a working draft prepared for the website build. It must be reviewed and
            approved by a qualified legal adviser, and the placeholder company details completed,
            before launch.
          </div>
          <div className="mt-10 max-w-3xl space-y-8">{children}</div>
        </Container>
      </Section>
    </>
  );
}

export function LegalBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
