export type Service = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  problem: string;
  solution: string;
  includes: string[];
  excludes: string[];
  deliverables: string[];
  technologies: string[];
  timeline: string;
  benefits: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software-development",
    name: "Custom Software Development",
    short: "Business systems, platforms and internal tools built around how you actually operate.",
    summary:
      "Advanced custom software built to specific business requirements — complex platforms, internal business systems, management systems, dashboards and scalable digital products.",
    problem:
      "Off-the-shelf tools force teams to work around software instead of with it. Data ends up scattered across spreadsheets, and manual steps multiply as the business grows.",
    solution:
      "We model your real process, design the data and permission structure around it, and build a system your team can operate daily — with room to extend as requirements change.",
    includes: [
      "Requirements analysis and solution architecture",
      "Data modelling and permission design",
      "Backend, API and frontend implementation",
      "Reporting, dashboards and admin tooling",
      "Testing, deployment and documentation",
    ],
    excludes: [
      "Ongoing content production or marketing operations",
      "Hardware procurement",
      "Licences and third-party subscription costs (billed to the client)",
    ],
    deliverables: [
      "Working system in your environment",
      "Technical documentation",
      "Source code ownership on completion",
      "Handover and team walkthrough",
    ],
    technologies: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "Docker"],
    timeline: "Typically 6–20 weeks depending on scope",
    benefits: [
      "One system of record instead of scattered tools",
      "Manual work removed from daily operations",
      "Architecture that survives the next three years of growth",
    ],
  },
  {
    slug: "saas-platforms",
    name: "SaaS Platform Engineering",
    short: "Multi-tenant products with subscriptions, roles and scalable architecture.",
    summary:
      "Sophisticated SaaS platforms including multi-user systems, subscription products, dashboards, role-based access, integrations and scalable architectures.",
    problem:
      "Turning a product idea into a commercial SaaS means solving tenancy, billing, roles, onboarding and reliability — long before the first customer pays.",
    solution:
      "We build the platform foundations properly: tenant isolation, role-based access, subscription handling, admin control and observability, then layer your product features on top.",
    includes: [
      "Multi-tenant architecture and tenant isolation",
      "Authentication, roles and permissions",
      "Subscription, plan and billing integration",
      "Admin and customer-facing dashboards",
      "Third-party integrations and public APIs",
    ],
    excludes: [
      "Go-to-market and paid acquisition",
      "Payment processor account approval",
      "Regulatory certification of your product",
    ],
    deliverables: [
      "Production SaaS platform",
      "Admin console",
      "API documentation",
      "Deployment pipeline",
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Stripe", "Redis", "AWS"],
    timeline: "Typically 10–28 weeks depending on scope",
    benefits: [
      "Foundations that support paying customers from day one",
      "Roles and tenancy handled correctly instead of retrofitted",
      "Clear path from MVP to scaled product",
    ],
  },
  {
    slug: "ai-systems",
    name: "AI Systems & AI Agents",
    short: "AI applications, agents and intelligent automation grounded in your own data.",
    summary:
      "Advanced AI-powered solutions including AI agents, intelligent automation, AI-powered applications, custom workflows, assistants and business-focused AI systems.",
    problem:
      "Generic AI tools do not know your business. Without grounding, access control and evaluation, AI output is impressive in a demo and unreliable in production.",
    solution:
      "We build AI features on top of your own data and processes, with retrieval, guardrails, human review where needed, and measurement of accuracy before rollout.",
    includes: [
      "Use-case assessment and feasibility review",
      "Retrieval and data grounding pipelines",
      "AI agents and tool-calling workflows",
      "Assistants embedded in your product or operations",
      "Evaluation, monitoring and cost control",
    ],
    excludes: [
      "Guarantees of model output accuracy",
      "Training foundation models from scratch",
      "Data collection your organisation is not permitted to use",
    ],
    deliverables: [
      "Working AI feature or agent in production",
      "Evaluation results",
      "Prompt and pipeline documentation",
      "Cost and usage monitoring",
    ],
    technologies: ["Python", "TypeScript", "LLM APIs", "Vector databases", "LangGraph", "PyTorch"],
    timeline: "Typically 4–16 weeks depending on scope",
    benefits: [
      "AI grounded in your data rather than generic output",
      "Measurable accuracy before you rely on it",
      "Predictable operating cost",
    ],
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    short: "Android, iOS and cross-platform applications built for real usage.",
    summary:
      "Mobile applications for Android and iOS, including cross-platform and fully custom mobile solutions depending on project requirements.",
    problem:
      "Mobile projects fail on the details: offline behaviour, push notifications, store review, device fragmentation and release management.",
    solution:
      "We choose native or cross-platform based on your actual requirements, then handle the full lifecycle from architecture through store release and updates.",
    includes: [
      "Platform strategy (native vs cross-platform)",
      "UI implementation and interaction design",
      "Offline handling, sync and push notifications",
      "Store submission and release management",
      "Analytics and crash reporting",
    ],
    excludes: [
      "Developer account fees",
      "Guaranteed store approval timelines",
      "App store optimisation campaigns",
    ],
    deliverables: [
      "Published Android and/or iOS application",
      "Backend and API integration",
      "Release pipeline",
      "Source code ownership on completion",
    ],
    technologies: ["React Native", "Swift", "Kotlin", "Expo", "Firebase"],
    timeline: "Typically 8–20 weeks depending on scope",
    benefits: [
      "One codebase where it makes sense, native where it matters",
      "Predictable release process",
      "Real-world handling of offline and low-connectivity use",
    ],
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    short: "Architecture, deployment and scaling for systems that need to stay up.",
    summary:
      "Cloud-based application architecture, deployment, infrastructure planning, integrations and scalability work based on project requirements.",
    problem:
      "Systems that were fine at ten users fall over at ten thousand. Deployments are manual, environments drift, and nobody is sure what is running where.",
    solution:
      "We design the infrastructure, automate deployment, add monitoring and make scaling behaviour explicit — so releases are routine rather than risky.",
    includes: [
      "Infrastructure architecture and cost planning",
      "Infrastructure as code and environment parity",
      "CI/CD pipelines and release automation",
      "Monitoring, logging and alerting",
      "Backup, recovery and scaling strategy",
    ],
    excludes: [
      "Cloud provider subscription costs",
      "24/7 on-call unless contracted separately",
      "Compliance certification audits",
    ],
    deliverables: [
      "Documented infrastructure setup",
      "Automated deployment pipeline",
      "Monitoring dashboards and alerts",
      "Runbooks for common operations",
    ],
    technologies: ["AWS", "Cloudflare", "Docker", "Terraform", "Kubernetes", "GitHub Actions"],
    timeline: "Typically 3–12 weeks depending on scope",
    benefits: [
      "Releases that do not require heroics",
      "Visibility into what is running and what it costs",
      "Capacity to handle growth without redesign",
    ],
  },
  {
    slug: "automation",
    name: "Business & Workflow Automation",
    short: "Removing manual steps between the systems your team already uses.",
    summary:
      "Business process automation, workflow automation, AI automation, API integrations and operational automation across the tools you already run.",
    problem:
      "Teams copy data between systems, chase approvals by email and rebuild the same report every week. The cost is invisible but constant.",
    solution:
      "We map the process, identify the highest-cost manual steps, then connect systems and automate the handoffs — with logging so failures are visible.",
    includes: [
      "Process mapping and automation opportunity analysis",
      "API integrations between existing systems",
      "Scheduled jobs and event-driven workflows",
      "AI-assisted document and data handling",
      "Error handling, logging and alerting",
    ],
    excludes: [
      "Changes to third-party systems that do not expose an API",
      "Staff process training beyond handover",
      "Third-party automation platform licences",
    ],
    deliverables: [
      "Live automated workflows",
      "Process documentation before and after",
      "Monitoring and failure alerts",
    ],
    technologies: ["TypeScript", "Python", "REST & GraphQL APIs", "Webhooks", "Queues"],
    timeline: "Typically 2–10 weeks depending on scope",
    benefits: [
      "Hours returned to the team every week",
      "Fewer errors from manual data entry",
      "Visibility when something breaks",
    ],
  },
  {
    slug: "web-development",
    name: "Web Development & E-commerce",
    short: "Corporate sites, web applications, portals and online stores.",
    summary:
      "Business and corporate websites, landing pages, web portals, custom web applications, online stores, marketplaces and e-commerce integrations.",
    problem:
      "A slow, dated or hard-to-edit website undermines credibility and loses sales that were already paid for through marketing.",
    solution:
      "We build fast, accessible, well-structured web platforms with clear content architecture and commerce flows that convert — and that your team can maintain.",
    includes: [
      "Information architecture and content structure",
      "Responsive frontend implementation",
      "E-commerce, checkout and payment integration",
      "SEO fundamentals and performance optimisation",
      "Analytics and conversion tracking",
    ],
    excludes: [
      "Copywriting beyond structural guidance unless agreed",
      "Ongoing paid advertising management",
      "Stock photography licences",
    ],
    deliverables: [
      "Live website or store",
      "Content editing capability where in scope",
      "Performance and SEO baseline report",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Shopify", "Stripe"],
    timeline: "Typically 3–12 weeks depending on scope",
    benefits: [
      "Fast, credible presence that holds up on mobile",
      "Commerce flows built to convert",
      "Structure search engines can actually read",
    ],
  },
  {
    slug: "product-design",
    name: "UI/UX & Product Design",
    short: "Interface and product design for systems people use every day.",
    summary:
      "User interface design, user experience design, product design, design systems and digital brand experiences.",
    problem:
      "Complex products get complex interfaces. Users work around the software, adoption stalls, and support load rises.",
    solution:
      "We design around the real tasks users perform, build a reusable design system, and validate flows before engineering time is spent on them.",
    includes: [
      "Discovery, user flows and information architecture",
      "Wireframes and interactive prototypes",
      "High-fidelity interface design",
      "Design system and component library",
      "Accessibility review",
    ],
    excludes: [
      "Full brand identity creation unless scoped separately",
      "Illustration or video production unless scoped",
      "Large-scale user research panels",
    ],
    deliverables: [
      "Design files and prototypes",
      "Design system documentation",
      "Handover specification for engineering",
    ],
    technologies: ["Figma", "Design tokens", "Accessibility standards (WCAG)"],
    timeline: "Typically 3–10 weeks depending on scope",
    benefits: [
      "Fewer support requests caused by confusing interfaces",
      "Consistent product surface as the team grows",
      "Engineering builds the right thing the first time",
    ],
  },
  {
    slug: "mvp-development",
    name: "MVP & Digital Product Development",
    short: "From idea to a working product you can put in front of real users.",
    summary:
      "Turning ideas into MVPs, prototypes, SaaS products and scalable digital businesses, with scope shaped around learning fastest.",
    problem:
      "Founders either build too much before validating, or build something so thin it cannot be tested honestly.",
    solution:
      "We define the smallest product that tests the core assumption, build it properly, and keep the architecture ready for what comes after validation.",
    includes: [
      "Scope definition and assumption mapping",
      "Rapid architecture and build",
      "Core analytics and feedback capture",
      "Deployment and launch support",
      "Post-launch iteration planning",
    ],
    excludes: [
      "Guaranteed market outcomes",
      "Fundraising support",
      "Full enterprise hardening at MVP stage",
    ],
    deliverables: [
      "Live MVP with real users able to sign up",
      "Analytics instrumentation",
      "Prioritised roadmap for the next phase",
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Vercel/Cloudflare"],
    timeline: "Typically 4–12 weeks depending on scope",
    benefits: [
      "Real market feedback in weeks, not quarters",
      "Budget spent on what is actually tested",
      "Foundation that survives success",
    ],
  },
  {
    slug: "technology-consulting",
    name: "Technology Consulting & Architecture",
    short: "Independent review, architecture and technology decisions you can defend.",
    summary:
      "Technology consulting, solution architecture, technical due diligence and delivery advisory for teams making significant technology decisions.",
    problem:
      "Large technology decisions get made with incomplete information, and the cost of the wrong one shows up eighteen months later.",
    solution:
      "We assess the current system, define target architecture and give a written, prioritised recommendation with trade-offs and cost implications stated plainly.",
    includes: [
      "Codebase and architecture assessment",
      "Target architecture definition",
      "Build vs buy analysis",
      "Delivery process and team structure advice",
      "Security and scalability review",
    ],
    excludes: [
      "Legal, tax or regulatory advice",
      "Formal compliance certification",
      "Vendor negotiation on your behalf unless agreed",
    ],
    deliverables: [
      "Written assessment and recommendations",
      "Target architecture diagrams",
      "Prioritised implementation roadmap",
    ],
    technologies: ["Architecture review", "Threat modelling", "Cost modelling"],
    timeline: "Typically 1–6 weeks depending on scope",
    benefits: [
      "Decisions backed by an independent assessment",
      "Clear view of risk before you commit budget",
      "A roadmap your team can execute",
    ],
  },
];

export const coreServiceSlugs = [
  "custom-software-development",
  "saas-platforms",
  "ai-systems",
  "mobile-app-development",
  "cloud-infrastructure",
  "automation",
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
