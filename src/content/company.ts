/**
 * Confirmed company facts. Values marked PLACEHOLDER must be replaced
 * with verified information before public launch.
 */

export const company = {
  name: "Quorlex Soft",
  tagline: "Engineering the systems businesses run on.",
  positioning:
    "Quorlex Soft is a technology and software solutions company building custom software, SaaS platforms, AI systems and cloud infrastructure for organisations worldwide.",
  email: "aftabhussaincui@gmail.com",
  phone: "+92 302 4508804",
  phoneHref: "+923024508804",
  registeredIn: "London, United Kingdom",
  /** PLACEHOLDER — replace with the real company number. */
  companyNumber: "00000000",
  /** PLACEHOLDER — replace once the registered address is confirmed. */
  registeredAddress: "Registered address to be confirmed — London, United Kingdom",
  /** PLACEHOLDER — replace with the confirmed legal structure and year. */
  legalStructure: "Legal structure and registration year to be confirmed",
  markets: [
    "Austria",
    "Wider Europe",
    "United Kingdom",
    "United States",
    "Canada",
    "Middle East",
    "International remote",
  ],
} as const;

/**
 * Master switch for placeholder content. Team profiles and portfolio
 * case studies are fictional demo content while this is true.
 * Set to false only after every profile and project has been replaced
 * with verified, approved information.
 */
export const DEMO_CONTENT = true;

export const values = [
  {
    title: "Engineering first",
    body: "Architecture, code quality and maintainability come before shortcuts. Systems are built to be extended, not rewritten.",
  },
  {
    title: "Honest scope",
    body: "Clear estimates, clear limitations, clear communication. We say what a project needs and what it does not.",
  },
  {
    title: "Business outcomes",
    body: "Technology only matters when it removes cost, unlocks revenue or makes an operation faster. That is the measure we work to.",
  },
  {
    title: "Long-term partnership",
    body: "We aim to be a durable technology partner rather than a one-off vendor, staying with a system after it ships.",
  },
];

export const story = {
  why: [
    "Quorlex Soft was created to become a technology partner for businesses and innovators who need more than a website or a simple application — companies that need to move from an idea or a business problem to a complete, working digital system.",
    "We combine software engineering, artificial intelligence, automation, cloud technologies, digital product development, e-commerce and business-focused technology strategy in one place, so clients do not have to assemble a solution from a dozen suppliers.",
  ],
  founder: [
    "The journey behind Quorlex Soft is rooted in continuous learning, technology research, problem-solving and a strong interest in artificial intelligence and software development.",
    "Through academic research, programming, software engineering education and work involving machine learning and deep learning, the founder developed a deeper understanding of how technology can be used to address complex real-world challenges.",
    "Over time this led to a larger ambition: to build a technology company capable of bringing together talented developers, engineers, AI specialists and designers to deliver meaningful digital solutions for clients internationally.",
  ],
  vision: [
    "Our long-term vision is to build Quorlex Soft into a globally recognised technology and digital solutions company — with a strong international engineering team, specialised AI capability, proprietary software and SaaS products, and long-term technology partnerships with companies around the world.",
    "Our core belief is that technology should create practical value. We want to be recognised not simply as a software development company, but as a trusted technology partner that helps organisations innovate, automate, transform and scale.",
  ],
};

export const idealClient = {
  fit: [
    "Startups, SMEs, enterprises and organisations with a clear business problem or growth objective",
    "Teams that value quality, structured communication and professional execution",
    "Clients who are serious about investing in technology and understand that good software needs proper planning",
    "Businesses looking for a long-term technology partner, not a one-off supplier",
  ],
  notFit: [
    "Expecting enterprise-grade software at an unrealistically low budget",
    "Demanding unrealistic delivery timelines",
    "Constantly changing requirements without scope management",
    "Wanting to copy another company's proprietary product or intellectual property",
    "Looking only for the cheapest provider regardless of quality",
    "Unethical, illegal, fraudulent or harmful technology requests",
  ],
};
