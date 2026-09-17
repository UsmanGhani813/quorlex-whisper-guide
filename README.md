# Quorlex Soft — Portfolio & Admin

The official website and admin dashboard for **Quorlex Soft**.

## Stack

- React 19 + TypeScript
- TanStack Router / TanStack Start (SSR via Nitro)
- Tailwind CSS + shadcn/ui + Radix
- Supabase (PostgreSQL, Auth, Storage) with row-level security
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app fetches all its content from Supabase.

### Environment variables

Copy `.env.example` to `.env` and set:

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_PROJECT_ID=<your-project>
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_PROJECT_ID=<your-project>
```

## Content

Everything on the public site is CMS-driven from Supabase. Sign in at `/admin` to edit.

- `/admin/sections` — flexible page-section builder for `/`, `/founder`, and any new landing page.
- `/admin/services` — services catalog + bullets.
- `/admin/industries` — industries.
- `/admin/projects` — portfolio case studies.
- `/admin/team` — team members with photos, pull quotes and expertise.
- `/admin/technologies` — technology stack groups.
- `/admin/process` — delivery process steps.
- `/admin/faq` — FAQ items.
- `/admin/pages` — legal & marketing pages.
- `/admin/insights` — blog drafts.
- `/admin/jobs` — job openings.
- `/admin/media` — media library (Supabase Storage `public-media`).
- `/admin/chrome` — nav, footer, socials.
- `/admin/settings` — site settings + logo.
- `/admin/enquiries` — inbound contact-form messages.
- `/admin/admins` — admin user management (super_admin only).

## Deployment

`vercel.json` sets `NITRO_PRESET=vercel`, so Nitro builds a Vercel-compatible bundle. Import the repo on Vercel, set the environment variables above (server-side ones too), then deploy.

## License

Proprietary — © Quorlex Soft.
