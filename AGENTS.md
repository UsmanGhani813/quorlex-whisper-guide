# AGENTS

Internal notes for anyone (human or agent) working on this repo.

- Frontend: React 19 + TypeScript + TanStack Router / Start (SSR via Nitro) + Tailwind + shadcn/ui.
- Backend: Supabase (project ID `mzcaohizokkqisotslsi`) with RLS. Public reads use the `sb_publishable_...` key; admin writes go through Supabase Auth.
- Content model: everything on the public site is CMS-driven. Landing pages are composed from `page_sections` rows and rendered by `src/components/site/section-renderer.tsx`.
- Deployment: Vercel. `vercel.json` sets `NITRO_PRESET=vercel` so Nitro builds a Vercel-compatible bundle.

Do not commit `.env`. Use `.env.example` as the template.
