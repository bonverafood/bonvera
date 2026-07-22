# Vercel production environment (Bonvera Studio)

Set these in **Vercel → Project → Settings → Environment Variables**  
(Environment: **Production** — optionally also Preview). Then **Redeploy**.

## Required

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_MARKETING_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.bonvera.food` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mazmtuzfiefomruqlkia.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase → API → anon public)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Supabase → API → service_role — Studio DB + Storage)* |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `fr` |
| `NEXT_PUBLIC_FALLBACK_LOCALE` | `fr` |

**No `DATABASE_URL`.** App talks to Postgres only through the Supabase JS client.

Optional later: `OPENAI_API_KEY`.

## Schema

Run SQL once in Supabase → SQL Editor: [`docs/sql/schema.sql`](./sql/schema.sql)  
(includes products, media, SEO, **conversations/messages**).  

If the project already has the earlier schema, also run [`docs/sql/migrate-messages.sql`](./sql/migrate-messages.sql).

## Auth + Media

1. User: `bonvera@admin.com`  
2. Login: `https://admin.bonvera.food/studio/login`  
3. Storage bucket **`media`** (Public) — [`modules/media-studio.md`](./modules/media-studio.md)

## Domains

- `bonvera.food` → marketing  
- `www.bonvera.food` → redirect to apex  
- `admin.bonvera.food` → studio  

## Note

Do **not** commit secrets. `.env.local` is gitignored.
