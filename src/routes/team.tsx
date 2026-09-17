import { createFileRoute } from "@tanstack/react-router";

import { fetchTeam } from "@/lib/cms";
import { CtaBand, DemoNotice, PageHeader, Section } from "@/components/site/sections";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Quorlex Soft" },
      {
        name: "description",
        content:
          "Leadership, engineering, AI, cloud, design and delivery specialists at Quorlex Soft.",
      },
      { property: "og:title", content: "Team — Quorlex Soft" },
      {
        property: "og:description",
        content:
          "The specialists behind Quorlex Soft, across leadership, engineering, AI, cloud, design and delivery.",
      },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  loader: async () => {
    const { departments, members } = await fetchTeam();
    return { departments, members };
  },
  component: Team,
});

function Team() {
  const { departments, members } = Route.useLoaderData();
  const hasDemo = members.some((m) => m.is_demo);

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="Specialists across engineering, AI, cloud and delivery"
        intro="A cross-disciplinary team, so a single engagement can move from architecture to release without handovers between separate suppliers."
      />

      <Section bordered={false}>
        {hasDemo ? (
          <DemoNotice>
            Every profile below is a fictional demonstration placeholder. None of these people are
            real employees of Quorlex Soft.
          </DemoNotice>
        ) : null}

        <div className="mt-12 space-y-16">
          {departments.map((department) => {
            const inDept = members.filter((m) => m.department?.id === department.id);
            if (inDept.length === 0) return null;
            return (
              <section key={department.id}>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {department.name}
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {inDept.map((member) => (
                    <article
                      key={member.id}
                      className="rounded-xl border border-border bg-card p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-mono text-sm text-primary">
                          {initials(member.name)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{member.name}</h3>
                          <p className="text-xs text-muted-foreground">{member.title}</p>
                        </div>
                      </div>
                      {member.location ? (
                        <p className="mt-4 text-xs text-muted-foreground">{member.location}</p>
                      ) : null}
                      {member.bio ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {member.bio}
                        </p>
                      ) : null}
                      {member.expertise.length ? (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {member.expertise.map((skill) => (
                            <li
                              key={skill}
                              className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {member.experience ? (
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {member.experience} experience
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
