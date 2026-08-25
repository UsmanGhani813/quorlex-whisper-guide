/**
 * DEMO CONTENT — every project below is fictional placeholder material created
 * to evaluate layout and structure. No real client, engagement, revenue figure
 * or testimonial is represented here. Replace before public launch.
 */

export type Project = {
  slug: string;
  name: string;
  client: string;
  kind: "Demo case study" | "Concept project";
  industry: string;
  market: string;
  year: string;
  services: string[];
  summary: string;
  context: string;
  challenge: string[];
  goals: string[];
  solution: string[];
  obstacles: { problem: string; response: string }[];
  outcome: string[];
  metrics: { label: string; value: string }[];
  technologies: string[];
};

export const projects: Project[] = [
  {
    slug: "enterprise-operations-platform",
    name: "Enterprise Operations Platform",
    client: "Fictional manufacturing group",
    kind: "Demo case study",
    industry: "Manufacturing",
    market: "Europe",
    year: "Illustrative",
    services: ["Custom Software Development", "Cloud & Infrastructure"],
    summary:
      "A single operations platform replacing a patchwork of spreadsheets and legacy tools across multiple production sites.",
    context:
      "A multi-site manufacturing group ran production planning, quality records and maintenance scheduling in separate spreadsheets maintained by different teams, with no shared view across sites.",
    challenge: [
      "No single source of truth across five production sites",
      "Quality records reconstructed manually at audit time",
      "Maintenance scheduled reactively rather than planned",
      "Reporting took three days per month to assemble",
    ],
    goals: [
      "One operational system covering planning, quality and maintenance",
      "Audit-ready records available on demand",
      "Site-level and group-level reporting from the same data",
    ],
    solution: [
      "Modelled the shared operational domain across all sites, keeping site-specific variations configurable rather than hard-coded.",
      "Built role-based access so site managers, quality staff and group leadership each see the right slice of data.",
      "Implemented audit logging on every record change, with exportable audit trails.",
      "Delivered scheduled reporting that replaces the manual monthly assembly.",
    ],
    obstacles: [
      {
        problem: "Each site had evolved its own process vocabulary.",
        response:
          "Ran a mapping workshop per site and introduced a shared canonical model with per-site labels layered on top.",
      },
      {
        problem: "Legacy data quality was inconsistent.",
        response:
          "Built a staged import with validation reporting so each site could clean its own data before cutover.",
      },
    ],
    outcome: [
      "A single platform in daily use across all sites",
      "Audit records retrievable in minutes rather than days",
      "Group-level reporting generated automatically",
    ],
    metrics: [
      { label: "Monthly reporting effort", value: "3 days to under 1 hour" },
      { label: "Sites on one system", value: "5" },
      { label: "Manual spreadsheets retired", value: "40+" },
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
  },
  {
    slug: "subscription-saas-platform",
    name: "Multi-Tenant SaaS Platform",
    client: "Fictional B2B software company",
    kind: "Demo case study",
    industry: "Technology & SaaS",
    market: "United Kingdom",
    year: "Illustrative",
    services: ["SaaS Platform Engineering", "UI/UX & Product Design"],
    summary:
      "A single-tenant internal tool rebuilt as a commercial multi-tenant SaaS product with subscriptions and role-based access.",
    context:
      "A services company had built a strong internal tool and wanted to sell it. The existing system assumed one organisation, one set of users and manual account setup.",
    challenge: [
      "No tenant isolation in the existing data model",
      "No self-service signup or billing",
      "Roles were hard-coded to a single organisation structure",
      "Onboarding a customer took a developer half a day",
    ],
    goals: [
      "Commercially sellable multi-tenant platform",
      "Self-service signup, trial and subscription",
      "Customer-configurable roles and permissions",
    ],
    solution: [
      "Reworked the data model for tenant isolation with row-level security enforced at the database layer.",
      "Added a self-service onboarding flow with trial, plan selection and subscription billing.",
      "Built a configurable role and permission system so each customer defines its own structure.",
      "Delivered an internal admin console for support and account operations.",
    ],
    obstacles: [
      {
        problem: "Existing production data belonged to one implicit tenant.",
        response:
          "Wrote a reversible migration that assigned existing records to a primary tenant and ran it against a full staging copy first.",
      },
      {
        problem: "Permission checks were scattered through the codebase.",
        response:
          "Centralised authorisation into a single policy layer with tests covering each role and resource combination.",
      },
    ],
    outcome: [
      "Customers can sign up, trial and subscribe without developer involvement",
      "Support team handles account operations through the admin console",
      "Platform ready to add customers without architectural change",
    ],
    metrics: [
      { label: "Customer onboarding time", value: "Half a day to self-service" },
      { label: "Tenant isolation", value: "Enforced at database layer" },
      { label: "Authorisation test coverage", value: "Every role/resource pair" },
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
  },
  {
    slug: "ai-document-automation",
    name: "AI Document Processing System",
    client: "Fictional professional services firm",
    kind: "Demo case study",
    industry: "Professional Services",
    market: "Europe",
    year: "Illustrative",
    services: ["AI Systems & AI Agents", "Business & Workflow Automation"],
    summary:
      "An AI pipeline that reads incoming documents, extracts structured data and routes exceptions to a human reviewer.",
    context:
      "A professional services firm received high volumes of client documents in inconsistent formats. Staff re-keyed the same fields into a case system by hand.",
    challenge: [
      "Documents arrived in a dozen different formats",
      "Manual data entry consumed hours of billable capacity daily",
      "Errors from re-keying surfaced late in the process",
      "No confidence measure to decide what needed human checking",
    ],
    goals: [
      "Automated extraction of key fields",
      "Human review only where confidence is low",
      "Measurable accuracy before rollout",
    ],
    solution: [
      "Built an ingestion pipeline that normalises document formats before extraction.",
      "Used an LLM-based extraction step grounded in the firm's own field definitions, returning structured output with per-field confidence.",
      "Routed low-confidence fields into a review queue instead of accepting them silently.",
      "Set up an evaluation harness measuring accuracy against a labelled sample before each change.",
    ],
    obstacles: [
      {
        problem: "Early extraction was confident but wrong on edge-case layouts.",
        response:
          "Added layout classification before extraction and expanded the evaluation set with the failing cases.",
      },
      {
        problem: "Model cost rose with document length.",
        response:
          "Introduced page-level relevance filtering so only sections likely to contain target fields are sent to the model.",
      },
    ],
    outcome: [
      "Most documents processed without manual entry",
      "Review queue focused on genuinely ambiguous cases",
      "Accuracy tracked continuously rather than assumed",
    ],
    metrics: [
      { label: "Fields extracted automatically", value: "Majority, with review fallback" },
      { label: "Human review", value: "Low-confidence cases only" },
      { label: "Accuracy tracking", value: "Continuous against labelled set" },
    ],
    technologies: ["Python", "LLM APIs", "Vector database", "TypeScript", "PostgreSQL"],
  },
  {
    slug: "marketplace-platform",
    name: "E-commerce Marketplace",
    client: "Fictional retail group",
    kind: "Demo case study",
    industry: "E-commerce & Retail",
    market: "International",
    year: "Illustrative",
    services: ["Web Development & E-commerce", "Cloud & Infrastructure"],
    summary:
      "A multi-vendor marketplace with vendor onboarding, split payments, and an operations console for the platform team.",
    context:
      "A retail group wanted to open its storefront to third-party vendors, requiring vendor accounts, commission handling and order routing across suppliers.",
    challenge: [
      "Single-vendor commerce platform with no vendor concept",
      "Payments needed splitting between platform and vendors",
      "Orders spanning multiple vendors had to be routed and tracked separately",
      "Traffic peaks during campaigns",
    ],
    goals: [
      "Vendor self-service onboarding and catalogue management",
      "Automated commission and payout handling",
      "Reliable performance during campaign peaks",
    ],
    solution: [
      "Built vendor onboarding with catalogue management, moderation and per-vendor dashboards.",
      "Implemented split payments and automated payout scheduling with reconciliation reporting.",
      "Split multi-vendor orders into per-vendor fulfilment records while keeping one customer-facing order.",
      "Moved the storefront to a cached edge delivery model with load testing before campaigns.",
    ],
    obstacles: [
      {
        problem: "Refunds on multi-vendor orders touched several payout records.",
        response:
          "Modelled refunds as first-class events against individual fulfilment records, with reconciliation reporting.",
      },
      {
        problem: "Campaign traffic overwhelmed catalogue queries.",
        response:
          "Introduced edge caching and precomputed catalogue indexes, verified with load tests at several times expected peak.",
      },
    ],
    outcome: [
      "Vendors onboard and manage their own catalogues",
      "Payouts and commissions handled automatically",
      "Storefront held up under load testing above expected peaks",
    ],
    metrics: [
      { label: "Vendor onboarding", value: "Self-service" },
      { label: "Payout handling", value: "Automated with reconciliation" },
      { label: "Load tested to", value: "Several times expected peak" },
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe Connect", "Cloudflare"],
  },
  {
    slug: "field-operations-mobile-app",
    name: "Field Operations Mobile App",
    client: "Fictional logistics operator",
    kind: "Demo case study",
    industry: "Logistics & Transportation",
    market: "Middle East",
    year: "Illustrative",
    services: ["Mobile App Development", "Custom Software Development"],
    summary:
      "A cross-platform app for field crews that works offline and syncs when connectivity returns, paired with a dispatch dashboard.",
    context:
      "Field crews recorded jobs on paper because the existing web tool was unusable on mobile and required constant connectivity.",
    challenge: [
      "Crews frequently worked without reliable network coverage",
      "Paper records were entered into the system a day later",
      "Dispatch had no live view of job status",
      "Photo evidence was collected inconsistently",
    ],
    goals: [
      "Offline-capable mobile job records",
      "Live dispatch visibility once devices sync",
      "Consistent photo and signature capture",
    ],
    solution: [
      "Built a cross-platform app with a local-first data store and conflict-aware sync.",
      "Added structured job forms with mandatory photo and signature capture.",
      "Delivered a dispatch dashboard showing job status, crew location history and exceptions.",
      "Set up managed releases so field devices update predictably.",
    ],
    obstacles: [
      {
        problem: "Two crews occasionally edited the same job offline.",
        response:
          "Implemented per-field conflict resolution with an explicit review step for genuinely conflicting edits.",
      },
      {
        problem: "Photo uploads failed on weak connections.",
        response:
          "Queued uploads with resumable transfer and background retry rather than blocking job completion.",
      },
    ],
    outcome: [
      "Jobs recorded digitally at the point of work",
      "Dispatch sees status as soon as devices reconnect",
      "Evidence captured consistently on every job",
    ],
    metrics: [
      { label: "Offline capability", value: "Full job capture without network" },
      { label: "Record entry delay", value: "Next day to on-site" },
      { label: "Platforms", value: "Android and iOS" },
    ],
    technologies: ["React Native", "TypeScript", "SQLite", "Node.js", "PostgreSQL"],
  },
  {
    slug: "ai-support-agent",
    name: "AI Support Agent Platform",
    client: "Internal concept project",
    kind: "Concept project",
    industry: "Technology & SaaS",
    market: "International",
    year: "Illustrative",
    services: ["AI Systems & AI Agents", "SaaS Platform Engineering"],
    summary:
      "An internal concept exploring a support agent that answers from a company's own documentation and escalates cleanly to a human.",
    context:
      "An internal exploration into how far a grounded support agent can go before human handover, and how to measure that boundary honestly.",
    challenge: [
      "Generic assistants answer confidently from no source",
      "Escalation usually loses the conversation context",
      "Answer quality is hard to measure over time",
    ],
    goals: [
      "Answers grounded in a specific documentation set with citations",
      "Clean escalation carrying full context to a human",
      "Continuous measurement of answer quality",
    ],
    solution: [
      "Built a retrieval layer over a documentation set with citation of the exact source section.",
      "Added a confidence threshold that triggers escalation with the full conversation and retrieved sources attached.",
      "Created an evaluation set with graded answers so changes can be compared rather than guessed at.",
    ],
    obstacles: [
      {
        problem: "Retrieval returned plausible but outdated sections.",
        response: "Added recency weighting and source versioning to the retrieval step.",
      },
      {
        problem: "Escalations arrived without useful context.",
        response:
          "Attached the retrieved sources and confidence reasoning to every escalation handover.",
      },
    ],
    outcome: [
      "Concept demonstrates grounded, cited answers",
      "Escalation preserves full context",
      "Answer quality tracked against a graded evaluation set",
    ],
    metrics: [
      { label: "Answer grounding", value: "Cited source sections" },
      { label: "Escalation", value: "Full context handover" },
      { label: "Status", value: "Internal concept, not a client engagement" },
    ],
    technologies: ["Python", "TypeScript", "Vector database", "LLM APIs", "React"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
