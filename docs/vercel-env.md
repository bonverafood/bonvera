# Vercel production environment (Bonvera Studio)

Set these in **Vercel → Project → Settings → Environment Variables**  
(Environment: **Production** — optionally also Preview). Then **Redeploy**.

## Copy-paste (Name / Value)

Her satırda **Name** ve **Value** ayrı kutulara yapıştır:

```
NEXT_PUBLIC_APP_URL
https://bonvera.food

NEXT_PUBLIC_MARKETING_URL
https://bonvera.food

NEXT_PUBLIC_ADMIN_URL
https://admin.bonvera.food

NEXT_PUBLIC_SUPABASE_URL
https://mazmtuzfiefomruqlkia.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
(paste anon key from Supabase → Settings → API)

NEXT_PUBLIC_DEFAULT_LOCALE
tr

NEXT_PUBLIC_FALLBACK_LOCALE
tr
```

### One-line values (for quick paste)

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_MARKETING_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.bonvera.food` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mazmtuzfiefomruqlkia.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase anon public key)* |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `tr` |
| `NEXT_PUBLIC_FALLBACK_LOCALE` | `tr` |

Optional later: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.


## Domains

Attach all of these to the **same** Vercel project (Production):

- `bonvera.food` → marketing (canonical)  
- `www.bonvera.food` → **redirect to** `bonvera.food` (not the reverse)  
- `admin.bonvera.food` → studio  

If you see Vercel `404 NOT_FOUND` / `X-Vercel-Error: NOT_FOUND`, follow **[go-live-p0.md](./go-live-p0.md)** first.


## Note

Do **not** commit secrets to git. `.env.local` is gitignored (local only).
