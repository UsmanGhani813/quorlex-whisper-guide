export type Industry = {
  slug: string;
  name: string;
  body: string;
  examples: string[];
};

export const industries: Industry[] = [
  {
    slug: "technology-saas",
    name: "Technology & SaaS",
    body: "Product engineering support for software companies: platform foundations, multi-tenancy, integrations and scaling work alongside an existing team.",
    examples: ["Multi-tenant platforms", "Public APIs", "Admin tooling"],
  },
  {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    body: "Storefronts, marketplaces and the operational systems behind them — inventory, fulfilment integration and reporting.",
    examples: ["Custom storefronts", "Marketplace platforms", "Order automation"],
  },
  {
    slug: "fintech",
    name: "FinTech & Financial Services",
    body: "Data-sensitive systems where auditability, permissions and reconciliation matter as much as the interface.",
    examples: ["Client portals", "Reconciliation tooling", "Reporting dashboards"],
  },
  {
    slug: "proptech",
    name: "Real Estate & PropTech",
    body: "Listing platforms, portfolio management systems and workflow tools connecting agents, owners and tenants.",
    examples: ["Listing platforms", "Tenant portals", "Portfolio dashboards"],
  },
  {
    slug: "healthtech",
    name: "Healthcare Technology",
    body: "Scheduling, records and workflow systems designed around access control and careful data handling.",
    examples: ["Scheduling systems", "Patient portals", "Clinical workflow tools"],
  },
  {
    slug: "edtech",
    name: "Education & EdTech",
    body: "Learning platforms, assessment systems and administration tools for institutions and education businesses.",
    examples: ["Learning platforms", "Assessment engines", "Admin systems"],
  },
  {
    slug: "logistics",
    name: "Logistics & Transportation",
    body: "Tracking, dispatch and route systems that connect field operations with back-office visibility.",
    examples: ["Dispatch systems", "Tracking dashboards", "Driver apps"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    body: "Production visibility, quality tracking and integration between machines, ERP and reporting.",
    examples: ["Production dashboards", "Quality tracking", "ERP integration"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    body: "Practice management, client portals and automation for firms billing time and managing casework.",
    examples: ["Client portals", "Practice management", "Document automation"],
  },
  {
    slug: "hospitality-travel",
    name: "Hospitality & Travel",
    body: "Booking engines, property systems and guest-facing applications with real-time availability.",
    examples: ["Booking engines", "Guest apps", "Channel integrations"],
  },
  {
    slug: "media",
    name: "Media & Digital Business",
    body: "Content platforms, subscription products and audience data systems for digital-first businesses.",
    examples: ["Content platforms", "Subscription products", "Audience analytics"],
  },
  {
    slug: "startups",
    name: "Startups & Innovation",
    body: "MVPs, prototypes and first production platforms for founders validating a new product.",
    examples: ["MVPs", "Prototypes", "First production platform"],
  },
];
