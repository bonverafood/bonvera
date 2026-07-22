# Product Studio (Sprint 6)

Admin module for Bonvera products — Turkish source content, SEO fields, publish status, live preview.

## Auth

- Studio routes require Supabase Auth (`bonvera@admin.com`).
- Login: `/studio/login` (outside app shell).
- Middleware refreshes session and redirects unauthenticated users to login.
- Sign-out from the Studio user menu.

### Create the admin user (Supabase Dashboard)

1. Authentication → Users → Add user  
2. Email: `bonvera@admin.com`  
3. Set password; confirm email if required  

## Database

Table: `products` (Drizzle → Supabase Postgres).

| Column | Notes |
|--------|--------|
| `slug` | unique SEO slug |
| `status` | `draft` \| `published` \| `archived` |
| `name_tr`, `summary_tr`, `body_tr` | Turkish content |
| `image_url` | URL until Media Studio |
| `seo_title_tr`, `seo_description_tr`, `og_image_url` | SEO |
| `sort_order`, `published_at`, timestamps | |

### Migrate & seed

```bash
# Requires DATABASE_URL in .env.local
pnpm db:migrate
pnpm db:seed
```

Migration SQL: `drizzle/0000_*.sql`.

## Routes

| Path | Purpose |
|------|---------|
| `/studio/urunler` | List |
| `/studio/urunler/yeni` | Create |
| `/studio/urunler/[id]` | Edit + live preview |

## Code

- Feature: `src/features/product-studio/`
- Auth helpers: `src/lib/supabase/auth.ts`
- Schema: `src/lib/db/schema/products.ts`

## Out of scope (later sprints)

FR/AI translation · Storage upload · PDF · public site DB read · RLS hardening
