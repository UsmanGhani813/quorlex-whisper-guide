import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { fetchProjectBySlug } from "@/lib/cms";
import { Container, CtaBand, DemoNotice, Section } from "@/components/site/sections";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const project = await fetchProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Case study not found — Quorlex Soft" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.name} — case study | Quorlex Soft` },
        { name: "description", content: project.seo_description ?? project.summary ?? undefined },
        { property: "og:title", content: `${project.name} — Quorlex Soft` },
        {
          property: "og:description",
          content: project.seo_description ?? project.summary ?? undefined,
        },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/portfolio/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/portfolio/${params.slug}` }],
    };
  },
  component: CaseStudy,
  notFoundComponent: () => (
    <Section bordered={false}>
      <h1 className="text-3xl font-semibold">Case study not found</h1>
      <p className="mt-3 text-muted-foreground">
        <Link to="/portfolio" className="text-primary underline underline-offset-4">
          Back to all work
        </Link>
      </p>
    </Section>
  ),
});

function CaseStudy() {
  const { project } = Route.useLoaderData();

  return (
    <>
      <header className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <Container className="relative py-16 sm:py-24">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All work
          </Link>
          <h1 className="text-balance-tight mt-6 max-w-4xl text-4xl font-semibold sm:text-5xl">
            {project.name}
          </h1>
          {project.summary ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          ) : null}
          <dl className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-4">
            {[
              { k: "Client", v: project.client },
              { k: "Industry", v: project.industry?.name },
              { k: "Market", v: project.market },
              { k: "Type", v: project.kind.replace("_", " ") },
            ]
              .filter((item) => item.v)
              .map((item) => (
                <div key={item.k}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.k}
                  </dt>
                  <dd className="mt-1.5 text-sm">{item.v}</dd>
                </div>
              ))}
          </dl>
        </Container>
      </header>

      <Section bordered={false}>
        {project.is_demo ? (
          <DemoNotice>
            This is a fictional demonstration case study. The client, figures and outcomes are
            illustrative and do not represent a real engagement.
          </DemoNotice>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {project.context ? (
              <div>
                <h2 className="text-2xl font-semibold">Context</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{project.context}</p>
              </div>
            ) : null}

            {project.challenges.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold">The challenge</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {project.challenges.map((item) => (
                    <li key={item} className="border-l-2 border-border pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.goals.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold">Goals</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {project.goals.map((item) => (
                    <li key={item} className="border-l-2 border-primary/60 pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.solutions.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold">Solution</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                  {project.solutions.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {project.obstacles.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold">Obstacles and responses</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {project.obstacles.map((obstacle) => (
                    <div
                      key={obstacle.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <p className="text-sm font-medium">{obstacle.problem}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {obstacle.response}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {project.outcomes.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold">Outcome</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {project.outcomes.map((item) => (
                    <li key={item} className="border-l-2 border-primary/60 pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.testimonial_quote ? (
              <blockquote className="rounded-xl border border-border bg-card p-6">
                <p className="text-lg leading-relaxed">"{project.testimonial_quote}"</p>
                {project.testimonial_author ? (
                  <footer className="mt-3 text-sm text-muted-foreground">
                    {project.testimonial_author}
                    {project.testimonial_role ? `, ${project.testimonial_role}` : null}
                  </footer>
                ) : null}
              </blockquote>
            ) : null}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {project.metrics.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  {project.is_demo ? "Illustrative metrics" : "Key metrics"}
                </h2>
                <dl className="mt-4 space-y-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.id}>
                      <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                      <dd className="mt-1 text-base font-semibold">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                {project.is_demo ? (
                  <p className="mt-5 text-xs text-muted-foreground">
                    Figures are illustrative placeholders, not measured results.
                  </p>
                ) : null}
              </div>
            ) : null}

            {project.services.length + project.technologies.length > 0 ? (
              <div className="rounded-xl border border-border bg-card p-6">
                {project.services.length > 0 ? (
                  <>
                    <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Services
                    </h2>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {project.services.map((item) => (
                        <li key={item.id}>{item.name}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {project.technologies.length > 0 ? (
                  <>
                    <h2 className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Technologies
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech.id}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
