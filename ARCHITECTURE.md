# Bonvera Studio — Architecture

> Premium internal operating system for **Bonvera**.  
> This document is the source of truth for structural decisions. Update it when architecture changes.

---

## 0. Product direction (non-negotiable)

**We are not building a generic SaaS platform.**  
**We are not building a multi-tenant CMS.**  
**We are not optimizing for multiple customers.**

The only goal is the best possible platform for Bonvera.

| Name | Bonvera Studio |
|------|----------------|
| Public website | `https://bonvera.food` |
| Admin panel | `https://admin.bonvera.food` |
| Stack | Next.js · Supabase · Vercel |
| Shape | **One** project · **One** database · **One** brand |

**Decision filter:** every change must answer *“Does this make Bonvera better?”*  
If the answer is no, do not implement it.

**Future customers:** clone and adapt this repo later. Do **not** design multi-brand / SaaS abstractions today.

Code should stay clean and modular. Avoid pointless hardcoding. Prefer speed, quality, and simplicity over speculative generality.

---

## 1. What Bonvera Studio manages

Internal OS scope (nothing more for now):

- Products  
- Collections  
- Recipes  
- Blog  
- SEO  
- Media  
- PDF Catalogs  
- AI Assistant (Ask Bonvera)  
- Messages  
- Brand Settings  

Public site + admin share one Next.js app. Middleware selects the surface by hostname.  
Canonical SEO URLs always use `bonvera.food`. Admin is never indexed.

---

## 2. Core principles

1. **Bonvera first** — ship an exceptional product for one brand.
2. **Simplicity over platform ambition** — no multi-tenant, no brand switcher, no SaaS billing.
3. **Single deployable** — one Next.js app on Vercel; one Supabase/Postgres database.
4. **Feature-first folders** — business logic in `src/features/*`, not scattered in `app/`.
5. **Server-first** — React Server Components by default; `"use client"` only when needed.
6. **Configurable where it helps** — locales, hosts, env secrets; not abstract “tenant” frameworks.
7. **Legacy preserved** — previous static site under `legacy/`; not part of the runtime app.
8. **No placeholder architecture** — scaffold only what we will use.

---

## 3. Application topology

### 3.1 One Next.js application

Marketing + Bonvera Studio admin in one App Router deploy.

**Why:** shared types, UI, i18n, one pipeline, faster iteration.

### 3.2 Dual-domain (same deployable)

| Hostname | Surface | Notes |
|----------|---------|-------|
| `bonvera.food` | Marketing | Public site; sole **canonical** SEO origin |
| `admin.bonvera.food` | Studio | Admin; `noindex`; never in sitemap |

**Config / helpers**

- `src/config/hosts.ts` — surface names, production defaults, `x-app-surface`
- `src/lib/hosts/` — hostname detection, URL builders, path mapping
- `src/lib/hosts/server.ts` — `getRequestAppSurface()` for RSC
- `docs/deployment.md` — Vercel DNS + env checklist

**Middleware** (`src/middleware.ts`)

1. Detect surface from `Host`
2. Redirect `bonvera.food/studio…` → `admin.bonvera.food/studio…`
3. Normalize admin short paths (`/` → `/studio`, `/setup` → `/studio/setup`)
4. Stamp `x-app-surface` and admin `X-Robots-Tag: noindex, nofollow`
5. Admin `robots.txt` → `Disallow: /`
6. next-intl locale negotiation

Local: `localhost:3000` (marketing) · `admin.localhost:3000` (studio).

### 3.3 Route groups

```
src/app/
  [locale]/
    (marketing)/     # Public Bonvera site
    (studio)/        # Bonvera Studio admin
```

Internal Studio paths keep a `studio` segment so admin is never confused with the marketing home.

| Surface   | Marketing host      | Admin host                      |
|-----------|---------------------|---------------------------------|
| Marketing | `bonvera.food/`     | —                               |
| Studio    | → redirect to admin | `admin.bonvera.food/studio`     |

### 3.4 Single brand

There is only Bonvera. Identity and settings live in Brand Engine / brand config — **not** a multi-brand registry or tenant table design.

If a second business ever needs this system: **clone the project**.

---

## 4. Directory architecture

```
.
├── ARCHITECTURE.md
├── docs/
│   ├── deployment.md
│   ├── sql/                     # Supabase SQL schema (manual apply)
│   └── modules/
├── legacy/                      # Archived static Bonvera site
├── public/
├── src/
│   ├── app/                     # Routing + layouts only
│   ├── components/              # ui / marketing / studio / shared
│   ├── features/                # Business modules
│   ├── config/                  # locales, bonvera, site, hosts, env
│   ├── messages/                # next-intl (`tr.json`, `fr.json`, …)
│   ├── middleware.ts
│   ├── lib/                     # data, supabase, i18n, hosts, …
│   ├── providers/
│   ├── stores/
│   └── types/
├── .env.example
└── …
```

### 4.1 `app/` vs `features/`

| Layer         | Responsibility                         | Must not contain                    |
|---------------|----------------------------------------|-------------------------------------|
| `app/`        | Routing, layouts, composition, metadata | Business rules, heavy UI            |
| `features/`   | Domain logic + feature UI              | Global host routing                 |
| `components/` | Presentational UI                      | Domain mutations                    |
| `lib/`        | Infra adapters                         | Product workflows                   |

**Rule:** `app/` imports `features/` / `components/`. Features never import from `app/`.

### 4.2 Feature module shape

```
src/features/<feature-name>/
  components/
  hooks/
  actions/
  api/
  schema.ts
  types.ts
  index.ts
```

Export through `index.ts`.

---

## 5. Technology stack

| Concern        | Choice        | Role                                      |
|----------------|---------------|-------------------------------------------|
| Framework      | Next.js 15    | App Router, RSC, Route Handlers           |
| UI             | React 19      | Components                                |
| Language       | TypeScript    | Strict contracts                          |
| Styling        | Tailwind v4   | Tokens in CSS                             |
| Components     | shadcn/ui     | Accessible primitives                     |
| Auth / BaaS    | Supabase      | Auth, Storage, Postgres (JS client)       |
| Validation     | Zod           | Shared client/server                      |
| Forms          | React Hook Form | Form state                              |
| Server cache   | TanStack Query | Client server-state                     |
| Client UI state| Zustand       | Ephemeral UI only                         |
| Motion         | Framer Motion | Intentional motion                        |
| i18n           | next-intl     | Messages + routing                        |
| Deploy         | Vercel        | Dual domain, one project                  |

### 5.1 Supabase (only data layer)

- **Auth** — Studio login (`@supabase/ssr`)
- **Storage** — Media uploads (`media` bucket)
- **Postgres** — tables queried via Supabase JS (`src/lib/data/*`), after `requireStudioUser` + service role

Schema is applied in the Supabase SQL Editor (`docs/sql/schema.sql`). No Drizzle / `DATABASE_URL`.

### 5.2 State boundaries

| State            | Tool              |
|------------------|-------------------|
| Form draft       | React Hook Form   |
| Remote/server    | TanStack Query    |
| Ephemeral UI     | Zustand           |
| Validated shapes | Zod               |

Do not put server cache in Zustand. Do not put form fields in TanStack Query.

---

## 6. Language rules

| Layer | Language | Notes |
|-------|----------|--------|
| **Admin UI** | Turkish | Labels, menus, buttons, system messages |
| **Content source** | Turkish | Brand copy, products, blog authored in TR |
| **Public translations** | French first | Translation Engine; more locales later |

Do not mix admin chrome language with content language.

**App routing default:** `tr` (`NEXT_PUBLIC_DEFAULT_LOCALE`).  
French public pages are a publish/translation concern, not a reason to build multi-tenant i18n platforms.

Locales stay in `src/config/i18n.ts` + message files — extensible without hardcoding in features.

---

## 7. Environment & configuration

| File           | Purpose                       | Committed |
|----------------|-------------------------------|-----------|
| `.env.example` | Documented keys               | Yes       |
| `.env.local`   | Local secrets                 | No        |

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MARKETING_URL` | Public + canonical (`https://bonvera.food`) |
| `NEXT_PUBLIC_ADMIN_URL` | Studio (`https://admin.bonvera.food`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` / `FALLBACK` | App routing locales |
| Supabase URL / anon / `SUPABASE_SERVICE_ROLE_KEY` / `OPENAI_API_KEY` | Infra |

Validated in `src/config/env.ts`.

---

## 8. Data layer

```
src/lib/data/        # Products + media queries (Supabase JS)
src/lib/supabase/    # Browser / server / middleware / service-role clients
docs/sql/            # Schema SQL for Supabase SQL Editor
```

One database for Bonvera. No tenant_id architecture. No ORM.

---

## 9. UI system

- Tailwind v4 + shadcn/ui  
- Accessibility is mandatory in Studio  
- Motion only for hierarchy/presence  
- Premium internal OS feel — calm, clear, Bonvera-branded  

---

## 10. Tooling

pnpm · ESLint · Prettier · Husky · Commitlint · `@/*` aliases  

---

## 11. Security (intent)

- Studio will require auth (when auth lands)  
- Marketing stays public  
- Service role + DB URL never on the client  
- Privileged writes via Server Actions / Route Handlers  

---

## 12. Intentionally out of scope

- Multi-brand / multi-tenant / SaaS packaging  
- Generic CMS for arbitrary customers  
- Premature monorepo split  
- Tax/compliance as core Brand Engine (optional later module if Bonvera needs it)  

---

## 13. Legacy

`legacy/` — historical static Bonvera site. Not imported by the Next.js app.

---

## 14. Change policy

1. Update this file in the same change as structural shifts  
2. Prefer additive, simple changes  
3. Reject work that fails *“Does this make Bonvera better?”*  

---

## 15. Decision log

| Decision              | Choice                                      |
|-----------------------|---------------------------------------------|
| Product               | **Bonvera Studio** (single brand)           |
| Not building          | Generic SaaS / multi-tenant CMS             |
| App count             | One Next.js app                             |
| Database              | One Supabase Postgres                       |
| Public site           | `https://bonvera.food`                      |
| Admin                 | `https://admin.bonvera.food`                |
| Domain split          | Hostname middleware                         |
| Canonical SEO         | Marketing only                              |
| Admin indexing        | Never                                       |
| Admin UI language     | Turkish                                     |
| Content source        | Turkish                                     |
| Translation priority  | French first                                |
| Domain organization   | Feature-first under `src/features/`         |
| Package manager       | pnpm                                        |
| Auth / hosting / data | Supabase (JS client only)                   |
| Deploy                | Vercel                                      |
| Another customer later| Clone repo — do not abstract now            |
