import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { team, departments, initials } from "@/content/team";
import { CtaBand, DemoNotice, PageHeader, Section } from "@/components/site/sections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Quorlex Soft" },
      {
        name: "description",
        content:
          "The disciplines that make up a Quorlex Soft project team: engineering, AI and data, cloud and security, design and delivery.",
      },
      { property: "og:title", content: "Team — Quorlex Soft" },
      {
        property: "og:description",
        content: "Project teams assembled per engagement across engineering, AI, cloud, design and delivery.",
      },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: Team,
});

function Team() {
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? team : team.filter((m) => m.department === filter);

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The disciplines behind a project team"
        intro="Teams are assembled per engagement from a network of engineers, AI specialists, cloud architects, designers and delivery leads."
      />

      <Section bordered={false}>
        <DemoNotice>
          The profiles below are fictional placeholders used to show the structure of this page.
          They will be replaced with verified profiles of the people working on your project.
        </DemoNotice>

        <div className="mt-10 flex flex-wrap gap-2">
          {["All", ...departments].map((department) => (
            <button
              key={department}
              type="button"
              onClick={() => setFilter(department)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                filter === department
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {department}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <article key={member.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary font-display text-sm font-semibold">
                  {initials(member.name)}
                </span>
                <div>
                  <h2 className="text-base font-semibold">{member.name}</h2>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {member.location} · {member.experience}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
