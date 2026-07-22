# Product Studio (Sprint 6)

Admin module for Bonvera products — Turkish source content, SEO fields, publish status, live preview.

## Auth

- Studio routes require Supabase Auth (`bonvera@admin.com`).
- Login: `/studio/login`
- Sign-out from the Studio user menu.

## Data layer

**Supabase JS only** (service role after `requireStudioUser`). No Drizzle / `DATABASE_URL`.

Table: `products` — create via [`docs/sql/schema.sql`](../sql/schema.sql) in Supabase SQL Editor.

| Column | Notes |
|--------|--------|
| `slug` | unique SEO slug |
| `status` | `draft` \| `published` \| `archived` |
| `name_tr`, `summary_tr`, `body_tr` | Turkish content |
| `image_url` | URL (Media Studio picker or manual) |
| SEO + sort + timestamps | |

Code: `src/lib/data/products.ts` · `src/features/product-studio/`

## Routes

| Path | Purpose |
|------|---------|
| `/studio/urunler` | List |
| `/studio/urunler/yeni` | Create |
| `/studio/urunler/[id]` | Edit + live preview |
