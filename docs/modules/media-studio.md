# Media Studio (Sprint 7)

Content image library for Bonvera Studio — upload, browse, delete, and pick into Product Studio.

## Setup (Supabase)

1. **Storage → New bucket**
   - Name: `media`
   - Public: **Yes**
2. Add **`SUPABASE_SERVICE_ROLE_KEY`** to `.env.local` and Vercel (Settings → API → `service_role`).
3. Run migration:
   ```bash
   pnpm db:migrate
   ```

## Schema

Table `media_assets`: storage path, public URL, file name, mime, size, kind (`image`), optional `alt_tr`, `created_by`.

Bucket: `media`. Allowed: JPEG / PNG / WebP, max 5 MB.

## Routes / UI

| Path | Purpose |
|------|---------|
| `/studio/medya` | Library grid, drag-drop upload, copy URL, delete |

Product editor: **Medya'dan seç** → sets `products.image_url` (manual URL still allowed).

## Code

- `src/features/media-studio/`
- Service role client: `src/lib/supabase/admin.ts`
- Schema: `src/lib/db/schema/media-assets.ts`

## Out of scope

Video · documents UI · tagging · Brand Engine logo SoT · OG picker (SEO Sprint 8)
