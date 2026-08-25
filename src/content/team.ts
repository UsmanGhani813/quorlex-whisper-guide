/**
 * DEMO CONTENT — every profile below is a fictional placeholder created to
 * evaluate the layout of the team section. None of these people are real
 * employees of Quorlex Soft. Replace with verified, approved profiles
 * (and set DEMO_CONTENT to false in company.ts) before public launch.
 */

export type TeamMember = {
  name: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
};

export const departments = [
  "Leadership",
  "Engineering",
  "AI & Data",
  "Cloud & Security",
  "Design",
  "Delivery",
] as const;

export const team: TeamMember[] = [
  {
    name: "Adrian Vale",
    title: "Founder & Chief Executive Officer",
    department: "Leadership",
    location: "London, UK",
    bio: "Leads company strategy and client partnerships, with a background in software engineering and applied machine learning research.",
    expertise: ["Technology strategy", "Solution architecture", "Client partnership"],
    experience: "12 years",
  },
  {
    name: "Mira Sandoval",
    title: "Chief Technology Officer",
    department: "Leadership",
    location: "Vienna, Austria",
    bio: "Owns technical direction across engagements, from architecture standards to delivery quality and engineering hiring.",
    expertise: ["Distributed systems", "Architecture governance", "Engineering leadership"],
    experience: "15 years",
  },
  {
    name: "Tobias Rennhardt",
    title: "Director of Engineering",
    department: "Leadership",
    location: "Berlin, Germany",
    bio: "Runs delivery across engineering teams, focused on predictable releases and sustainable codebases.",
    expertise: ["Delivery management", "Code quality", "Team structure"],
    experience: "13 years",
  },
  {
    name: "Elena Marchetti",
    title: "Principal Solution Architect",
    department: "Engineering",
    location: "Milan, Italy",
    bio: "Designs system architecture for complex platforms, with a focus on data modelling and integration boundaries.",
    expertise: ["Solution architecture", "Data modelling", "Systems integration"],
    experience: "14 years",
  },
  {
    name: "Daniel Okoro",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Manchester, UK",
    bio: "Builds end-to-end product features across TypeScript stacks, with particular strength in API design.",
    expertise: ["TypeScript", "React", "Node.js", "API design"],
    experience: "9 years",
  },
  {
    name: "Sofia Lindqvist",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Stockholm, Sweden",
    bio: "Specialises in complex interface implementation, accessibility and frontend performance.",
    expertise: ["React", "Accessibility", "Performance", "Design systems"],
    experience: "10 years",
  },
  {
    name: "Rafael Duarte",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Lisbon, Portugal",
    bio: "Works on high-throughput services, database performance and reliable background processing.",
    expertise: ["Node.js", "PostgreSQL", "Queues", "Performance tuning"],
    experience: "11 years",
  },
  {
    name: "Hana Yildiz",
    title: "Mobile Engineering Lead",
    department: "Engineering",
    location: "Istanbul, Türkiye",
    bio: "Leads mobile delivery across native and cross-platform projects, including offline-first applications.",
    expertise: ["React Native", "Swift", "Kotlin", "Offline sync"],
    experience: "10 years",
  },
  {
    name: "Jonas Bergmann",
    title: "Software Engineer",
    department: "Engineering",
    location: "Hamburg, Germany",
    bio: "Works across product features and internal tooling, with a focus on test coverage and maintainability.",
    expertise: ["TypeScript", "Testing", "Tooling"],
    experience: "6 years",
  },
  {
    name: "Priya Raghunathan",
    title: "Head of Artificial Intelligence",
    department: "AI & Data",
    location: "London, UK",
    bio: "Leads AI engagements from feasibility assessment through evaluation and production rollout.",
    expertise: ["Applied AI", "Retrieval systems", "Evaluation design"],
    experience: "12 years",
  },
  {
    name: "Lukas Freiberg",
    title: "Senior AI Engineer",
    department: "AI & Data",
    location: "Vienna, Austria",
    bio: "Builds retrieval pipelines, agent workflows and the evaluation harnesses that keep them honest.",
    expertise: ["LLM systems", "RAG", "Agent workflows", "Python"],
    experience: "8 years",
  },
  {
    name: "Nadia Cherif",
    title: "Machine Learning Specialist",
    department: "AI & Data",
    location: "Paris, France",
    bio: "Works on model selection, fine-tuning and measurement for production machine learning features.",
    expertise: ["PyTorch", "Model evaluation", "Feature engineering"],
    experience: "9 years",
  },
  {
    name: "Marcus Feldt",
    title: "Data Engineer",
    department: "AI & Data",
    location: "Copenhagen, Denmark",
    bio: "Designs data pipelines and warehouse models that make reporting and AI grounding reliable.",
    expertise: ["ETL", "Warehousing", "SQL", "Python"],
    experience: "8 years",
  },
  {
    name: "Ivana Petrović",
    title: "Automation Specialist",
    department: "AI & Data",
    location: "Belgrade, Serbia",
    bio: "Maps operational processes and implements the integrations and workflows that remove manual steps.",
    expertise: ["Process automation", "API integration", "Workflow design"],
    experience: "7 years",
  },
  {
    name: "Callum Reyes",
    title: "Cloud Architect",
    department: "Cloud & Security",
    location: "Dublin, Ireland",
    bio: "Designs cloud architecture with attention to cost, resilience and operational simplicity.",
    expertise: ["AWS", "Terraform", "Cost optimisation", "Resilience"],
    experience: "13 years",
  },
  {
    name: "Amara Nwosu",
    title: "Senior DevOps Engineer",
    department: "Cloud & Security",
    location: "Toronto, Canada",
    bio: "Builds deployment pipelines, monitoring and the automation that makes releases uneventful.",
    expertise: ["CI/CD", "Kubernetes", "Observability", "Docker"],
    experience: "10 years",
  },
  {
    name: "Viktor Halden",
    title: "Cybersecurity Specialist",
    department: "Cloud & Security",
    location: "Oslo, Norway",
    bio: "Runs security review, threat modelling and hardening across platforms before and after launch.",
    expertise: ["Threat modelling", "Application security", "Access control"],
    experience: "12 years",
  },
  {
    name: "Yuki Tanabe",
    title: "Head of Design",
    department: "Design",
    location: "Amsterdam, Netherlands",
    bio: "Leads product and interface design, with a focus on complex systems that people use daily.",
    expertise: ["Product design", "Design systems", "Interaction design"],
    experience: "14 years",
  },
  {
    name: "Leo Ferrante",
    title: "Senior UI/UX Designer",
    department: "Design",
    location: "Barcelona, Spain",
    bio: "Designs interfaces and prototypes, working closely with engineering through implementation.",
    expertise: ["UI design", "Prototyping", "Usability"],
    experience: "9 years",
  },
  {
    name: "Freya Lindholm",
    title: "Product Designer",
    department: "Design",
    location: "Helsinki, Finland",
    bio: "Turns discovery findings into user flows, wireframes and validated product decisions.",
    expertise: ["User research", "Information architecture", "Flows"],
    experience: "7 years",
  },
  {
    name: "Samuel Ortega",
    title: "Delivery Manager",
    department: "Delivery",
    location: "Madrid, Spain",
    bio: "Keeps engagements on scope and on schedule, and is the client's named point of contact.",
    expertise: ["Project delivery", "Scope management", "Client communication"],
    experience: "11 years",
  },
  {
    name: "Aisha Karim",
    title: "Senior Business Analyst",
    department: "Delivery",
    location: "Dubai, UAE",
    bio: "Translates business problems into documented requirements engineering teams can build against.",
    expertise: ["Requirements engineering", "Process analysis", "Stakeholder workshops"],
    experience: "10 years",
  },
  {
    name: "Peter Novák",
    title: "QA Lead",
    department: "Delivery",
    location: "Prague, Czechia",
    bio: "Owns test strategy, automation coverage and release quality gates across projects.",
    expertise: ["Test automation", "Playwright", "Release QA"],
    experience: "12 years",
  },
  {
    name: "Grace Whitfield",
    title: "Technology Consultant",
    department: "Delivery",
    location: "London, UK",
    bio: "Advises on architecture decisions, build-versus-buy questions and delivery structure.",
    expertise: ["Technical due diligence", "Architecture review", "Advisory"],
    experience: "13 years",
  },
];

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
