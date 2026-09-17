import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { fetchPageWithSections, fetchProjects } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
import { CtaBand, DemoNotice, PageHeader, Section } from "@/components/site/sections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Work — demonstration case studies | Quorlex Soft" },
      {
        name: "description",
        content:
          "Illustrative case studies showing how Quorlex Soft structures and delivers software, SaaS, AI and mobile systems. Placeholder content, not real client engagements.",
      },
      { property: "og:title", content: "Work — Quorlex Soft" },
      {
        property: "og:description",
        content:
          "How we scope, architect and deliver systems, shown through demonstration case studies.",
      },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  loader: async () => {
    const [projects, page] = await Promise.all([
      fetchProjects(),
      fetchPageWithSections("portfolio"),
    ]);
    return {
      projects,
      sections: page.sections,
      sectionData: page.data as SectionData | null,
    };
  },
  component: Portfolio,
});

function Portfolio() {
  const { projects, sections, sectionData } = Route.useLoaderData();
  const [service, setService] = useState("All");
  const [industry, setIndustry] = useState("All");

  const serviceOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.flatMap((p) => p.services.map((s) => s.name)))),
    ],
    [projects],
  );
  const industryOptions = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((p) => p.industry?.name).filter(Boolean) as string[])),
    ],
    [projects],
  );

  const filtered = projects.filter(
    (project) =>
      (service === "All" || project.services.some((s) => s.name === service)) &&
      (industry === "All" || project.industry?.name === industry),
  );

  const hasDemo = filtered.some((p) => p.is_demo);

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : null}
      <PageHeader
        eyebrow="Work"
        title="Demonstration case studies"
        intro="These case studies show how we scope, architect and deliver systems. They are illustrative examples, not real client engagements."
      />

      <Section bordered={false}>
        {hasDemo ? (
          <DemoNotice>
            Every project on this page is fictional demonstration material created to show the
            structure of our case studies. No real client, engagement, metric or testimonial is
            represented.
          </DemoNotice>
        ) : null}

        <div className="mt-10 space-y-4">
          <FilterRow
            label="Service"
            options={serviceOptions}
            value={service}
            onChange={setService}
          />
          <FilterRow
            label="Industry"
            options={industryOptions}
            value={industry}
            onChange={setIndustry}
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <Link
              key={project.slug}
              to="/portfolio/$slug"
              params={{ slug: project.slug }}
              className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/50"
            >
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {project.industry ? (
                  <>
                    <span className="text-primary">{project.industry.name}</span>
                    <span>·</span>
                  </>
                ) : null}
                {project.market ? (
                  <>
                    <span>{project.market}</span>
                    <span>·</span>
                  </>
                ) : null}
                <span>{project.kind.replace("_", " ")}</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{project.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.services.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Read case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No case studies match that combination of filters.
          </p>
        ) : null}
      </Section>

      <CtaBand />
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
