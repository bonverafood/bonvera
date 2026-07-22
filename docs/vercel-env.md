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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase → Settings → API → anon public)* |
| `DATABASE_URL` | *(Supabase → Database → URI / pooler)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Supabase → API → service_role — Media uploads)* |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `tr` |
| `NEXT_PUBLIC_FALLBACK_LOCALE` | `tr` |

Prefer the **connection pooler** (transaction mode) for `DATABASE_URL` on Vercel.

Optional later: `OPENAI_API_KEY`.

## Auth + Media

1. Supabase user: `bonvera@admin.com`  
2. Login: `https://admin.bonvera.food/studio/login`  
3. Storage bucket **`media`** (Public) — see [`modules/media-studio.md`](./modules/media-studio.md)  
4. Product Studio: [`modules/product-studio.md`](./modules/product-studio.md)

## Domains

Same Vercel project (Production):

- `bonvera.food` → marketing (canonical)  
- `www.bonvera.food` → **redirect to** `bonvera.food`  
- `admin.bonvera.food` → studio  

Platform `NOT_FOUND`: [`go-live-p0.md`](./go-live-p0.md).

## Note

Do **not** commit secrets. `.env.local` is gitignored.
