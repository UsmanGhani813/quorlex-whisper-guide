/**
 * PROPOSED delivery process. This is a recommended working model and is
 * presented on the site as our approach — confirm or amend it before launch.
 */
export const processSteps = [
  {
    step: "01",
    name: "Discovery",
    body: "We start with the business problem, not the technology. Stakeholders, current process, constraints, success criteria and risks are documented before anything is estimated.",
    outputs: ["Requirements document", "Risk and constraint list", "Success criteria"],
  },
  {
    step: "02",
    name: "Planning & Architecture",
    body: "Scope is split into phases with a written architecture, data model and integration plan. You get a realistic timeline and a clear statement of what is in and out of scope.",
    outputs: ["Architecture and data model", "Phased plan and timeline", "Fixed scope definition"],
  },
  {
    step: "03",
    name: "Design",
    body: "User flows, wireframes and interface design are produced and reviewed before build starts, so changes happen while they are still cheap.",
    outputs: ["User flows", "Interface designs", "Design system"],
  },
  {
    step: "04",
    name: "Development",
    body: "Work runs in short iterations with a shared board, code review on every change, and a working environment you can open at any time.",
    outputs: ["Working increments", "Staging environment", "Weekly progress report"],
  },
  {
    step: "05",
    name: "Testing & QA",
    body: "Automated tests, manual QA, cross-device checks, performance review and a security pass before anything reaches production.",
    outputs: ["Test coverage", "QA report", "Performance baseline"],
  },
  {
    step: "06",
    name: "Deployment",
    body: "Automated deployment pipelines, monitoring and rollback. Launch is a routine operation, not an event.",
    outputs: ["Production deployment", "Monitoring and alerts", "Runbooks"],
  },
  {
    step: "07",
    name: "Support & Iteration",
    body: "After launch we stay available for fixes, improvements and the next phase, under an agreed support model.",
    outputs: ["Support agreement", "Improvement backlog", "Roadmap for next phase"],
  },
];

export const engagementNotes = [
  {
    title: "Communication",
    body: "A named point of contact, a shared board, and a written weekly update. No silent stretches.",
  },
  {
    title: "Ownership",
    body: "You own the source code, the data and the infrastructure accounts on completion of the agreed terms.",
  },
  {
    title: "Security",
    body: "Least-privilege access, secrets kept out of source control, dependency scanning, and code review on every change.",
  },
  {
    title: "Support model",
    body: "Post-launch support is agreed before launch: response times, scope of fixes and what counts as new work.",
  },
];
