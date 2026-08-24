# Quorlex Soft — Project Blueprint & Build Plan

Discovery is complete enough to build a preview-stage website. Everything below marked DEMO is clearly-labelled placeholder content, easy to swap for verified data later.

## 1. Confirmed company facts

- Brand name: Quorlex Soft (that exact capitalization)
- Registered: United Kingdom, London
- Email: aftabhussaincui@gmail.com (public)
- Phone: +92 302 4508804 (public, shown as-is)
- Company registration number: placeholder, visibly marked for replacement
- Domain: purchased, to be attached after reviewing the built site
- Legal structure and registration year: not yet provided — placeholder
- Positioning: full-service digital technology and software solutions company
- Lead feeling for visitors: enterprise trust
- Logo: an initial concept exists but was not attached to the chat yet. Build uses a temporary wordmark; the logo is a single swappable asset.

## 2. Open items to resolve later

- Market focus lists Austria first, but the company is registered in London. Legal pages will be written for a UK-registered entity; confirm if an Austrian entity also exists.
- Logo file, brand colors, fonts, tagline, legal number, registration year, business address, domain.
- No real clients, projects, testimonials or team profiles are confirmed. Nothing on the site will claim otherwise.

## 3. Services (all presented as currently deliverable)

Custom software development, complex SaaS platforms, mobile apps (Android/iOS/cross-platform), advanced AI systems and AI agents, cloud infrastructure, enterprise systems, web development, e-commerce, API development and integration, business/workflow/AI automation, UI/UX and product design, MVP and prototype development, technology consulting and solution architecture.

Delivery model: capability-driven — project teams assembled from a network of developers, engineers, AI specialists and designers per project requirements.

## 4. Audience

Startups, SMEs, enterprises, entrepreneurs and organizations with a clear business problem and a real technology budget. Industry-flexible (tech, e-commerce, fintech, proptech, healthtech, edtech, logistics, manufacturing, professional services, hospitality, media, SaaS). Markets: Austria, wider Europe, UK, US, Canada, Middle East, international remote. Not a fit: lowest-price shopping, unrealistic budgets/timelines, IP copying, unethical work, no-collaboration clients.

## 5. Pages to build

| Page | Purpose |
| --- | --- |
| Home | Hero, positioning, service overview, capability proof, featured DEMO case studies, process, CTA |
| About | Founder story, why the company exists, vision, mission, values, delivery model |
| Services | All service areas with problem / solution / deliverables / technologies / CTA |
| Service detail | Per-service deep pages for the six core areas |
| Industries | Sectors served |
| Process | Discovery → planning → design → development → QA → deployment → support (proposed, marked as proposed until approved) |
| Technologies | Stack by category |
| Portfolio | DEMO project grid, filterable by service and industry |
| Case study detail | Full DEMO case studies: context, challenge, goals, solution, tech, obstacles, outcome |
| Team | DEMO profiles across all disciplines, with a visible demo-content notice |
| Contact | Form, direct contact details, project-brief fields |
| FAQ | Working model, budgets, timelines, ownership, communication |
| Careers | Roles and general application (light for v1) |
| Legal | Privacy policy, cookie policy, terms, imprint — drafts marked "requires legal review" |

## 6. Functionality for v1

- Must have: contact / project-enquiry form with validation and stored submissions, responsive layout, dark mode, portfolio and case study filtering, SEO metadata per page, cookie consent banner, legal pages.
- Should have: consultation-request option inside the contact flow, email notification on new enquiry.
- Nice to have: newsletter capture, careers application uploads.
- Future: blog/CMS, client portal, multi-language, admin dashboard, AI assistant.

Form storage and email notifications require enabling Lovable Cloud (built-in database + backend, no external accounts). I will enable it as part of the build.

## 7. Demo content rules

- Every DEMO team profile and DEMO case study is generated as fictional placeholder content, with a clear on-page notice on Team and Portfolio and a code-level `DEMO_CONTENT` flag so all of it can be found and replaced from one place.
- No invented client names, revenue figures, awards, certifications, partnerships or testimonials presented as real. Metrics inside case studies are labelled as illustrative.
- All demo data lives in dedicated content files (`src/content/team.ts`, `src/content/projects.ts`, `src/content/services.ts`) so swapping in real data means editing data, not layout.

## 8. Design direction

Enterprise-trust, modern and premium: deep navy/near-black base with a restrained electric-blue accent (adjustable once brand colors are final), generous whitespace, strong typographic hierarchy, clear hero, subtle purposeful motion only, no clutter, no gradient soup, no stock-photo look. All colors and fonts defined as design tokens in one stylesheet so a future rebrand is a token change. Before implementing, I will present rendered design directions for you to pick from.

## 9. Technical notes

TanStack Start + React with file-based routing, one route per page and per detail slug; Tailwind design tokens in `src/styles.css`; shadcn components; content in typed data modules; per-route SEO metadata (title, description, og, twitter) plus JSON-LD Organization schema; Lovable Cloud for enquiry storage and notification email.

## 10. Build sequence

1. Design system tokens, layout shell, header/footer, navigation.
2. Design direction approval.
3. Home, About, Services + service details.
4. Industries, Process, Technologies.
5. DEMO content modules, Portfolio, case study pages, Team.
6. Contact form + Lovable Cloud storage/notifications, FAQ, Careers.
7. Legal pages, cookie consent, SEO pass.
8. QA: responsive check, navigation, form behaviour, no false claims, placeholder inventory.

## 11. Authorization

Approving this plan authorizes the build as described. I will still pause once during step 2 for you to choose the visual direction.
