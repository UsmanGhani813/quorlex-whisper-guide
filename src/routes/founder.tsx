import { createFileRoute } from "@tanstack/react-router";

import {
  fetchIndustries,
  fetchInsights,
  fetchPageSections,
  fetchProcessSteps,
  fetchProjects,
  fetchServices,
  fetchTeam,
  fetchTeamMemberByName,
} from "@/lib/cms";
import { SectionList, type SectionData } from "@/components/site/section-renderer";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: "Aftab Hussain — Founder of Quorlex Soft" },
      {
        name: "description",
        content:
          "Founder profile of Quorlex Soft: academic background, ML research, publications and the engineering vision behind the studio.",
      },
    ],
  }),
  loader: async () => {
    const [sections, services, projects, processSteps, industries, team, founder, insights] =
      await Promise.all([
        fetchPageSections("founder"),
        fetchServices(),
        fetchProjects(),
        fetchProcessSteps(),
        fetchIndustries(),
        fetchTeam(),
        fetchTeamMemberByName("Malik Aftab Hussain"),
        fetchInsights(),
      ]);
    const data: SectionData = {
      services,
      industries,
      projects,
      processSteps,
      featuredMember: founder,
      members: team.members.filter((m) => !m.is_demo),
      insightsCount: insights.length,
    };
    return { sections, data };
  },
  component: FounderPage,
});

function FounderPage() {
  const { sections, data } = Route.useLoaderData();
  return <SectionList sections={sections} data={data} />;
}
