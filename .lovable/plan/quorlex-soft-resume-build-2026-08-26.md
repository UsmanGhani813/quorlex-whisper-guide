# Quorlex Soft — Resume Build

Design system, content modules, and the backend enquiries table are already in place. What remains is the entire UI: layout shell plus every page.

## What exists now
- `src/styles.css` — dark navy enterprise token system, Space Grotesk / DM Sans
- Content modules: company, services, industries, technologies, process, projects (DEMO), team (DEMO), faq
- Backend `enquiries` table with public insert
- Routes: only the blank placeholder at `/`

## Build sequence

**1. Layout shell**
Header with primary nav and mobile drawer, footer with contact details, sitemap links and placeholder legal notice, theme toggle (dark default), cookie consent banner. Wired into `__root.tsx` around `<Outlet />`, plus Organization JSON-LD and sonner toaster.

**2. Core pages**
- `/` Home — hero, positioning, service grid, capability proof, featured DEMO case studies, process strip, CTA
- `/about` — founder story, why, vision, values, delivery model
- `/services` — all service areas
- `/services/$slug` — per-service problem / solution / deliverables / technologies / CTA

**3. Supporting pages**
- `/industries`, `/process`, `/technologies`

**4. Demo-content pages**
- `/portfolio` — filterable grid by service and industry, with a visible demo-content notice
- `/portfolio/$slug` — full case study
- `/team` — profiles with demo-content notice

**5. Conversion and info pages**
- `/contact` — validated project-enquiry form writing to the enquiries table, plus direct contact details and a consultation-request option
- `/faq`, `/careers`

**6. Legal**
- `/legal/privacy`, `/legal/cookies`, `/legal/terms`, `/legal/imprint` — drafts marked "requires legal review", placeholders flagged for the company number and address

**7. QA pass**
Responsive check at mobile and desktop, every nav link resolves, form submit and error states, no fabricated claims presented as real, and a placeholder inventory listing everything you still need to supply.

## Technical notes
One route file per page, `createFileRoute` paths matching filenames, `$slug` detail routes driven by the content modules. Per-route `head()` with unique title, description, og and twitter tags. Contact form uses a server function writing via the Supabase client with Zod validation. No hardcoded colors — semantic tokens only.

## Still outstanding from you
Logo file, brand colors and fonts if you want them changed, tagline, company registration number and year, registered address, domain.
