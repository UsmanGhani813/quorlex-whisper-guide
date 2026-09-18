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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quorlex Soft — AI-first software engineering studio" },
      {
        name: "description",
        content:
          "A small AI-first software studio out of Pakistan building custom AI systems, web platforms and data pipelines for teams that need real engineering.",
      },
      { property: "og:title", content: "Quorlex Soft — AI-first software engineering studio" },
      {
        property: "og:description",
        content:
          "Research-backed AI engineering, delivery-first product work, and marketplace operations — from one senior team.",
      },
    ],
  }),
  loader: async () => {
    const [sections, services, projects, processSteps, industries, team, founder, insights] =
      await Promise.all([
        fetchPageSections("home"),
        fetchServices(),
        fetchProjects(),
        fetchProcessSteps(),
        fetchIndustries(),
        fetchTeam(),
        fetchTeamMemberByName("Aftab Hussain"),
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
  component: Home,
});

function Home() {
  const { sections, data } = Route.useLoaderData();
  return <SectionList sections={sections} data={data} />;
}
