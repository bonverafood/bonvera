# Media Studio (Sprint 7)

Content image library — upload, browse, delete, pick into Product Studio.

## Setup (Supabase)

1. **Storage → New bucket** `media` (Public)
2. **`SUPABASE_SERVICE_ROLE_KEY`** in `.env.local` + Vercel
3. Tables: run [`docs/sql/schema.sql`](../sql/schema.sql) if not already applied

## Data layer

Supabase Storage + `media_assets` table via JS client (`src/lib/data/media.ts`).  
No Drizzle / `DATABASE_URL`.

Allowed: JPEG / PNG / WebP, max 5 MB.

## Routes

| Path | Purpose |
|------|---------|
| `/studio/medya` | Library grid, drag-drop upload, copy URL, delete |

Product editor: **Medya'dan seç** → sets `products.image_url`.
