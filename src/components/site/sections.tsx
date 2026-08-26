import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      className={cn("py-16 sm:py-24", bordered && "border-t border-border", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance-tight text-3xl font-semibold sm:text-4xl">{title}</h2>
      {intro ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" />
      <Container className="relative py-16 sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-balance-tight max-w-4xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
      </Container>
    </header>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
      <span className="font-semibold">Placeholder content. </span>
      {children}
    </div>
  );
}

export function CtaBand({
  title = "Have a system that needs building?",
  body = "Tell us the business problem. We will tell you honestly whether we are the right team, what it would take, and roughly what it costs.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section className="bg-surface">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{body}</p>
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start a conversation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  );
}
