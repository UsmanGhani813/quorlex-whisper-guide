export type TechGroup = {
  name: string;
  items: string[];
};

export const technologies: TechGroup[] = [
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "Swift", "Kotlin", "SQL"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "TanStack", "Tailwind CSS", "Vite", "React Native"],
  },
  {
    name: "Backend",
    items: ["Node.js", "FastAPI", "Django", "REST APIs", "GraphQL", "WebSockets"],
  },
  {
    name: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Vector databases", "ClickHouse"],
  },
  {
    name: "AI & ML",
    items: [
      "LLM APIs",
      "Retrieval-augmented generation",
      "Agent frameworks",
      "PyTorch",
      "TensorFlow",
      "Evaluation tooling",
    ],
  },
  {
    name: "Cloud & DevOps",
    items: ["AWS", "Google Cloud", "Cloudflare", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    name: "Commerce & Payments",
    items: ["Stripe", "Shopify", "Paddle", "Subscription billing"],
  },
  {
    name: "Design & Delivery",
    items: ["Figma", "Design systems", "Jira", "Linear", "Playwright", "Vitest"],
  },
];

export const securityPractices = [
  "Role-based access control and least-privilege data access",
  "Encrypted transport and encrypted storage of sensitive data",
  "Secret management outside source control",
  "Dependency and vulnerability scanning in CI",
  "Code review on every change",
  "Audit logging on sensitive operations",
];
