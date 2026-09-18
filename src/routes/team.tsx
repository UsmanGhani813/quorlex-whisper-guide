import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Quote } from "lucide-react";

import { fetchPageWithSections, fetchTeam } from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";
import { CtaBand, PageHeader, Section, SectionHeading } from "@/components/site/sections";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function MemberAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null;
}) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }
  return (
    <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-mono text-sm text-primary">
      {initials(name)}
    </div>
  );
}

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Quorlex Soft" },
      {
        name: "description",
        content:
          "The senior team behind Quorlex Soft — a small AI-first studio building custom systems.",
      },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  loader: async () => {
    const [team, page] = await Promise.all([fetchTeam(), fetchPageWithSections("team")]);
    return {
      departments: team.departments,
      members: team.members.filter((m) => !m.is_demo),
      sections: page.sections,
      sectionData: page.data as SectionData | null,
    };
  },
  component: Team,
});

function Team() {
  const { members, sections, sectionData } = Route.useLoaderData();
  const leadership = members.filter((m) => m.is_leadership).sort((a, b) => a.sort_order - b.sort_order);
  const rest = members.filter((m) => !m.is_leadership).sort((a, b) => a.sort_order - b.sort_order);
  const founder = members.find((m) => m.name === "Aftab Hussain");

  return (
    <>
      {sections.length > 0 && sectionData ? (
        <SectionList sections={sections} data={sectionData} />
      ) : (
        <>
      <PageHeader
        eyebrow="Team"
        title="A small, senior team"
        intro="One handful of engineers works with you from the first call to production. Founder-led delivery, no bench, no handoffs."
      />

      {founder ? (
        <Section bordered={false}>
          <SectionHeading eyebrow="Founder" title="Meet the founder" />
          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_2fr]">
            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/25 via-primary/5 to-transparent">
                {(founder as { photo_url?: string | null }).photo_url ? (
                  <img
                    src={(founder as { photo_url?: string }).photo_url}
                    alt={founder.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end p-6 text-white">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground/90">
                      {founder.title}
                    </div>
                    <div className="mt-1 text-2xl font-semibold">{founder.name}</div>
                    {founder.location ? (
                      <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="h-3 w-3" /> {founder.location}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {founder.pull_quote ? (
                <blockquote className="mt-6 rounded-lg border-l-4 border-primary bg-card p-5 text-sm italic text-foreground/90">
                  <Quote className="mb-2 h-4 w-4 text-primary" />“{founder.pull_quote}”
                </blockquote>
              ) : null}
            </div>
            <div>
              {founder.bio ? (
                <p className="text-base leading-relaxed text-muted-foreground">{founder.bio}</p>
              ) : null}
              {founder.expertise.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {founder.expertise.slice(0, 8).map((e) => (
                    <li
                      key={e}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              ) : null}
              <Link
                to="/founder"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Read Aftab's full profile <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Section>
      ) : null}

      {leadership.filter((m) => m.name !== "Aftab Hussain").length ? (
        <Section>
          <SectionHeading eyebrow="Leadership" title="Working alongside the founder" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leadership
              .filter((m) => m.name !== "Aftab Hussain")
              .map((member) => (
                <article key={member.id} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <MemberAvatar
                      name={member.name}
                      photoUrl={(member as { photo_url?: string | null }).photo_url}
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.title}</p>
                    </div>
                  </div>
                  {member.location ? (
                    <p className="mt-3 text-xs text-muted-foreground">{member.location}</p>
                  ) : null}
                  {member.bio ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  ) : null}
                  {member.pull_quote ? (
                    <p className="mt-4 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground/80">
                      “{member.pull_quote}”
                    </p>
                  ) : null}
                </article>
              ))}
          </div>
        </Section>
      ) : null}

      {rest.length ? (
        <Section className="bg-surface">
          <SectionHeading eyebrow="Specialists" title="Delivery & operations" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((member) => (
              <article key={member.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <MemberAvatar
                    name={member.name}
                    photoUrl={(member as { photo_url?: string | null }).photo_url}
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.title}</p>
                  </div>
                </div>
                {member.location ? (
                  <p className="mt-3 text-xs text-muted-foreground">{member.location}</p>
                ) : null}
                {member.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                ) : null}
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />        </>
      )}
    </>
  );
}
