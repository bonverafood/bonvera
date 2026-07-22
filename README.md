# Studio OS

Digital Operating System for brands.

**First brand:** Bonvera  
**Surfaces:** `/` (marketing) · `/studio` (admin)

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

Fill `.env.local` using `.env.example`. Environment keys are validated in `src/config/env.ts`.

## Scripts

| Script            | Purpose                          |
|-------------------|----------------------------------|
| `pnpm dev`        | Development server (Turbopack)   |
| `pnpm build`      | Production build                 |
| `pnpm start`      | Start production server          |
| `pnpm lint`       | ESLint                           |
| `pnpm format`     | Prettier                         |
| `pnpm typecheck`  | TypeScript                       |
| `pnpm db:generate`| Generate Drizzle migrations      |
| `pnpm db:studio`  | Drizzle Studio                   |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Locales

Configured in `src/config/i18n.ts` (not hardcoded in features).

- Primary: French (`fr`) → `/`, `/studio`
- Secondary: Turkish (`tr`) → `/tr`, `/tr/studio`

## Legacy

The previous static Bonvera site is archived under `legacy/`.
