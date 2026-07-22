# Vercel production environment (Bonvera Studio)

Set these in **Vercel → Project → Settings → Environment Variables**  
(apply to **Production**, and ideally Preview too). Then **Redeploy**.

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_MARKETING_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.bonvera.food` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mazmtuzfiefomruqlkia.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Supabase → Project Settings → API → anon public)* |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `tr` |
| `NEXT_PUBLIC_FALLBACK_LOCALE` | `tr` |

Optional later: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.

## Domains

Attach both to the same Vercel project:

- `bonvera.food` → marketing  
- `admin.bonvera.food` → studio  

See also [deployment.md](./deployment.md).

## Note

Do **not** commit secrets to git. `.env.local` is gitignored (local only).
