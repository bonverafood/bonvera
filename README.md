# Bonvera Studio

Premium internal operating system for **Bonvera**.

| Surface | URL |
|---------|-----|
| Public website | https://bonvera.food |
| Admin | https://admin.bonvera.food |

One Next.js app · one database · one brand.  
Not a multi-tenant SaaS. Every decision: *Does this make Bonvera better?*

## Prerequisites

- Node.js 22+
- pnpm 9+
- Supabase project (when wiring data/auth)

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Local hosts:

- Marketing: http://localhost:3000  
- Admin: http://admin.localhost:3000  

Fill `.env.local` from `.env.example`. Env is validated in `src/config/env.ts`.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Development (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm typecheck` | TypeScript |

## Architecture & roadmap

See [ARCHITECTURE.md](./ARCHITECTURE.md), [docs/roadmap.md](./docs/roadmap.md), and [docs/deployment.md](./docs/deployment.md).

## Languages

- **Admin UI:** Turkish  
- **Content source:** Turkish  
- **Public translations:** French first (Translation Engine)  

Routing defaults: `src/config/i18n.ts` (`NEXT_PUBLIC_DEFAULT_LOCALE=tr`).

## Legacy

Previous static site archived under `legacy/`.
