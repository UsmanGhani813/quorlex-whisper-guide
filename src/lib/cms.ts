/**
 * CMS data layer. All reads from the new Supabase project.
 * Everything here uses the anon (publishable) key + RLS policies:
 * only rows visible to the public (published_at IS NOT NULL AND
 * archived_at IS NULL) come back for anonymous callers.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type ServiceRow = Tables["services"]["Row"];
export type ServiceBulletRow = Tables["service_bullets"]["Row"];
export type IndustryRow = Tables["industries"]["Row"];
export type IndustryExampleRow = Tables["industry_examples"]["Row"];
export type TechnologyGroupRow = Tables["technology_groups"]["Row"];
export type TechnologyRow = Tables["technologies"]["Row"];
export type TeamDepartmentRow = Tables["team_departments"]["Row"];
export type TeamMemberRow = Tables["team_members"]["Row"];
export type TeamMemberExpertiseRow = Tables["team_member_expertise"]["Row"];
export type ProjectRow = Tables["projects"]["Row"];
export type ProjectBulletRow = Tables["project_bullets"]["Row"];
export type ProjectObstacleRow = Tables["project_obstacles"]["Row"];
export type ProjectMetricRow = Tables["project_metrics"]["Row"];
export type ProcessStepRow = Tables["process_steps"]["Row"];
export type ProcessStepOutputRow = Tables["process_step_outputs"]["Row"];
export type FaqRow = Tables["faqs"]["Row"];
export type FaqCategoryRow = Tables["faq_categories"]["Row"];
export type JobRow = Tables["jobs"]["Row"];
export type PageRow = Tables["pages"]["Row"];
export type SiteSettingsRow = Tables["site_settings"]["Row"];
export type NavItemRow = Tables["nav_items"]["Row"];
export type FooterSectionRow = Tables["footer_sections"]["Row"];
export type FooterLinkRow = Tables["footer_links"]["Row"];
export type CompanyValueRow = Tables["company_values"]["Row"];
export type StorySectionRow = Tables["story_sections"]["Row"];
export type IdealClientCriterionRow = Tables["ideal_client_criteria"]["Row"];
export type MarketRow = Tables["markets"]["Row"];
export type SocialLinkRow = Tables["social_links"]["Row"];

// Aggregate types used by pages

export type ServiceWithBullets = ServiceRow & {
  bullets: ServiceBulletRow[];
  includes: string[];
  excludes: string[];
  deliverables: string[];
  benefits: string[];
  technologies: TechnologyRow[];
};

export type IndustryWithExamples = IndustryRow & {
  examples: string[];
};

export type TechnologyGroupWithItems = TechnologyGroupRow & {
  items: TechnologyRow[];
};

export type TeamMemberWithExpertise = TeamMemberRow & {
  department: TeamDepartmentRow | null;
  expertise: string[];
};

export type ProjectFull = ProjectRow & {
  industry: IndustryRow | null;
  bullets: ProjectBulletRow[];
  challenges: string[];
  goals: string[];
  solutions: string[];
  outcomes: string[];
  obstacles: ProjectObstacleRow[];
  metrics: ProjectMetricRow[];
  services: ServiceRow[];
  technologies: TechnologyRow[];
};

export type ProcessStepWithOutputs = ProcessStepRow & {
  outputs: string[];
};

export type FooterSectionWithLinks = FooterSectionRow & {
  links: FooterLinkRow[];
};

export type SiteChrome = {
  settings: SiteSettingsRow | null;
  navItems: NavItemRow[];
  footerSections: FooterSectionWithLinks[];
  socialLinks: SocialLinkRow[];
};

/* ---------- helpers ---------- */

function bulletsBy(bullets: ServiceBulletRow[], kind: string): string[] {
  return bullets
    .filter((b) => b.kind === kind)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((b) => b.body);
}

function projectBulletsBy(bullets: ProjectBulletRow[], kind: string): string[] {
  return bullets
    .filter((b) => b.kind === kind)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((b) => b.body);
}

/* ---------- site chrome ---------- */

export async function fetchSiteChrome(): Promise<SiteChrome> {
  const [{ data: settings }, { data: navItems }, { data: sections }, { data: links }, { data: socials }] =
    await Promise.all([
      supabase.from("site_settings").select("*").maybeSingle(),
      supabase.from("nav_items").select("*").order("sort_order"),
      supabase.from("footer_sections").select("*").order("sort_order"),
      supabase.from("footer_links").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);

  const footerSections: FooterSectionWithLinks[] = (sections ?? []).map((s) => ({
    ...s,
    links: (links ?? []).filter((l) => l.section_id === s.id),
  }));

  return {
    settings: settings ?? null,
    navItems: navItems ?? [],
    footerSections,
    socialLinks: socials ?? [],
  };
}

/* ---------- services ---------- */

export async function fetchServices(): Promise<ServiceWithBullets[]> {
  const [{ data: services }, { data: bullets }, { data: st }, { data: techs }] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("service_bullets").select("*").order("sort_order"),
    supabase.from("service_technologies").select("*"),
    supabase.from("technologies").select("*"),
  ]);
  const byId = new Map<string, TechnologyRow>((techs ?? []).map((t) => [t.id, t]));
  return (services ?? []).map((s) => {
    const sb = (bullets ?? []).filter((b) => b.service_id === s.id);
    const linkedIds = new Set((st ?? []).filter((r) => r.service_id === s.id).map((r) => r.technology_id));
    return {
      ...s,
      bullets: sb,
      includes: bulletsBy(sb, "include"),
      excludes: bulletsBy(sb, "exclude"),
      deliverables: bulletsBy(sb, "deliverable"),
      benefits: bulletsBy(sb, "benefit"),
      technologies: (techs ?? []).filter((t) => linkedIds.has(t.id)),
    };
  });
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceWithBullets | null> {
  const { data: service } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  if (!service) return null;
  const [{ data: bullets }, { data: st }, { data: techs }] = await Promise.all([
    supabase.from("service_bullets").select("*").eq("service_id", service.id).order("sort_order"),
    supabase.from("service_technologies").select("*").eq("service_id", service.id),
    supabase.from("technologies").select("*"),
  ]);
  const linkedIds = new Set((st ?? []).map((r) => r.technology_id));
  const sb = bullets ?? [];
  return {
    ...service,
    bullets: sb,
    includes: bulletsBy(sb, "include"),
    excludes: bulletsBy(sb, "exclude"),
    deliverables: bulletsBy(sb, "deliverable"),
    benefits: bulletsBy(sb, "benefit"),
    technologies: (techs ?? []).filter((t) => linkedIds.has(t.id)),
  };
}

/* ---------- industries ---------- */

export async function fetchIndustries(): Promise<IndustryWithExamples[]> {
  const [{ data: industries }, { data: examples }] = await Promise.all([
    supabase.from("industries").select("*").order("sort_order"),
    supabase.from("industry_examples").select("*").order("sort_order"),
  ]);
  return (industries ?? []).map((i) => ({
    ...i,
    examples: (examples ?? [])
      .filter((e) => e.industry_id === i.id)
      .map((e) => e.body),
  }));
}

/* ---------- technologies ---------- */

export async function fetchTechnologyGroups(): Promise<TechnologyGroupWithItems[]> {
  const [{ data: groups }, { data: items }] = await Promise.all([
    supabase.from("technology_groups").select("*").order("sort_order"),
    supabase.from("technologies").select("*").order("sort_order"),
  ]);
  return (groups ?? []).map((g) => ({
    ...g,
    items: (items ?? []).filter((t) => t.group_id === g.id),
  }));
}

/* ---------- team ---------- */

export async function fetchTeam(): Promise<{
  departments: TeamDepartmentRow[];
  members: TeamMemberWithExpertise[];
}> {
  const [{ data: departments }, { data: members }, { data: expertise }] = await Promise.all([
    supabase.from("team_departments").select("*").order("sort_order"),
    supabase.from("team_members").select("*").order("sort_order"),
    supabase.from("team_member_expertise").select("*").order("sort_order"),
  ]);
  const deptById = new Map((departments ?? []).map((d) => [d.id, d]));
  const mapped: TeamMemberWithExpertise[] = (members ?? []).map((m) => ({
    ...m,
    department: m.department_id ? deptById.get(m.department_id) ?? null : null,
    expertise: (expertise ?? [])
      .filter((e) => e.member_id === m.id)
      .map((e) => e.body),
  }));
  return { departments: departments ?? [], members: mapped };
}

/* ---------- projects ---------- */

export async function fetchProjects(): Promise<ProjectFull[]> {
  const [
    { data: projects },
    { data: bullets },
    { data: obstacles },
    { data: metrics },
    { data: ps },
    { data: pt },
    { data: industries },
    { data: services },
    { data: technologies },
  ] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("project_bullets").select("*").order("sort_order"),
    supabase.from("project_obstacles").select("*").order("sort_order"),
    supabase.from("project_metrics").select("*").order("sort_order"),
    supabase.from("project_services").select("*"),
    supabase.from("project_technologies").select("*"),
    supabase.from("industries").select("*"),
    supabase.from("services").select("*"),
    supabase.from("technologies").select("*"),
  ]);

  const industryById = new Map((industries ?? []).map((i) => [i.id, i]));
  const serviceById = new Map((services ?? []).map((s) => [s.id, s]));
  const techById = new Map((technologies ?? []).map((t) => [t.id, t]));

  return (projects ?? []).map((p) => {
    const pb = (bullets ?? []).filter((b) => b.project_id === p.id);
    const linkedServiceIds = new Set((ps ?? []).filter((r) => r.project_id === p.id).map((r) => r.service_id));
    const linkedTechIds = new Set((pt ?? []).filter((r) => r.project_id === p.id).map((r) => r.technology_id));
    return {
      ...p,
      industry: p.industry_id ? industryById.get(p.industry_id) ?? null : null,
      bullets: pb,
      challenges: projectBulletsBy(pb, "challenge"),
      goals: projectBulletsBy(pb, "goal"),
      solutions: projectBulletsBy(pb, "solution"),
      outcomes: projectBulletsBy(pb, "outcome"),
      obstacles: (obstacles ?? []).filter((o) => o.project_id === p.id),
      metrics: (metrics ?? []).filter((m) => m.project_id === p.id),
      services: Array.from(linkedServiceIds).map((id) => serviceById.get(id)!).filter(Boolean),
      technologies: Array.from(linkedTechIds).map((id) => techById.get(id)!).filter(Boolean),
    };
  });
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectFull | null> {
  const { data: project } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
  if (!project) return null;
  const [
    { data: bullets },
    { data: obstacles },
    { data: metrics },
    { data: ps },
    { data: pt },
    { data: industry },
    { data: services },
    { data: technologies },
  ] = await Promise.all([
    supabase.from("project_bullets").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_obstacles").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_metrics").select("*").eq("project_id", project.id).order("sort_order"),
    supabase.from("project_services").select("*").eq("project_id", project.id),
    supabase.from("project_technologies").select("*").eq("project_id", project.id),
    project.industry_id
      ? supabase.from("industries").select("*").eq("id", project.industry_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("services").select("*"),
    supabase.from("technologies").select("*"),
  ]);

  const linkedServiceIds = new Set((ps ?? []).map((r) => r.service_id));
  const linkedTechIds = new Set((pt ?? []).map((r) => r.technology_id));
  const pb = bullets ?? [];

  return {
    ...project,
    industry: industry ?? null,
    bullets: pb,
    challenges: projectBulletsBy(pb, "challenge"),
    goals: projectBulletsBy(pb, "goal"),
    solutions: projectBulletsBy(pb, "solution"),
    outcomes: projectBulletsBy(pb, "outcome"),
    obstacles: obstacles ?? [],
    metrics: metrics ?? [],
    services: (services ?? []).filter((s) => linkedServiceIds.has(s.id)),
    technologies: (technologies ?? []).filter((t) => linkedTechIds.has(t.id)),
  };
}

/* ---------- process ---------- */

export async function fetchProcessSteps(): Promise<ProcessStepWithOutputs[]> {
  const [{ data: steps }, { data: outputs }] = await Promise.all([
    supabase.from("process_steps").select("*").order("step_number"),
    supabase.from("process_step_outputs").select("*").order("sort_order"),
  ]);
  return (steps ?? []).map((s) => ({
    ...s,
    outputs: (outputs ?? []).filter((o) => o.step_id === s.id).map((o) => o.body),
  }));
}

/* ---------- faq ---------- */

export async function fetchFaqs(): Promise<FaqRow[]> {
  const { data } = await supabase.from("faqs").select("*").order("sort_order");
  return data ?? [];
}

/* ---------- jobs ---------- */

export async function fetchJobs(): Promise<JobRow[]> {
  const { data } = await supabase.from("jobs").select("*").order("sort_order");
  return data ?? [];
}

/* ---------- pages ---------- */

export async function fetchPageBySlug(slug: string): Promise<PageRow | null> {
  const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  return data;
}

/* ---------- about page bundle (about + values + story + ideal client + markets) ---------- */

export async function fetchAboutBundle() {
  const [
    { data: page },
    { data: values },
    { data: story },
    { data: idealClient },
    { data: markets },
    { data: settings },
  ] = await Promise.all([
    supabase.from("pages").select("*").eq("slug", "about").maybeSingle(),
    supabase.from("company_values").select("*").order("sort_order"),
    supabase.from("story_sections").select("*").order("sort_order"),
    supabase.from("ideal_client_criteria").select("*").order("sort_order"),
    supabase.from("markets").select("*").order("sort_order"),
    supabase.from("site_settings").select("*").maybeSingle(),
  ]);
  return {
    page,
    values: values ?? [],
    story: story ?? [],
    idealClient: idealClient ?? [],
    markets: markets ?? [],
    settings: settings ?? null,
  };
}
