# Dual-domain deployment

**Bonvera Studio** is a **single Next.js application** deployed once on Vercel, on two production hostnames. One brand. One database. Not a multi-tenant SaaS.

| Surface | Domain | Role |
|---------|--------|------|
| Marketing (public website) | `https://bonvera.food` | Public Bonvera site, SEO, sitemap |
| Bonvera Studio (admin) | `https://admin.bonvera.food` | Internal operating panel |

Canonical URLs, `metadataBase`, and `sitemap.xml` **always** use `bonvera.food`.  
Admin is **never** indexed (`X-Robots-Tag`, Studio layout `robots`, admin `robots.txt` Disallow).

---

## Architecture

```
                    ┌─────────────────────────┐
                    │   One Vercel deployment  │
                    │   (Next.js App Router)   │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │ middleware (hostname → surface)   │
              └─────────────────┬─────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                                             ▼
bonvera.food                                    admin.bonvera.food
(marketing)                                     (studio)
/  /fr  …                                       / → /studio
                                                /setup → /studio/setup
```

Source of truth for hosts:

- `src/config/hosts.ts` — constants + header name
- `src/lib/hosts/` — detection, URL builders, path mapping
- `src/lib/hosts/server.ts` — `getRequestAppSurface()` for RSC
- `src/middleware.ts` — host routing + admin noindex headers
- Env: `NEXT_PUBLIC_MARKETING_URL`, `NEXT_PUBLIC_ADMIN_URL`

Internal App Router paths stay under `[locale]/(marketing)` and `[locale]/(studio)/studio/*`.  
Admin short paths (`/`, `/setup`) are normalized to `/studio…` on the admin host.

---

## Local development

Defaults (when env URLs are omitted in `development`):

| Surface | URL |
|---------|-----|
| Marketing | http://localhost:3000 |
| Admin | http://admin.localhost:3000 |

Modern browsers resolve `*.localhost` to loopback. Run one `pnpm dev` and open both hosts.

```env
NEXT_PUBLIC_MARKETING_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://admin.localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=tr
NEXT_PUBLIC_FALLBACK_LOCALE=tr
```

---

## Vercel multi-domain setup

1. Deploy the project as usual (one project, one production deployment).
2. Project → **Settings → Domains**:
   - Add `bonvera.food` (and optionally `www.bonvera.food` → redirect to apex).
   - Add `admin.bonvera.food`.
3. Point DNS (at your registrar / Cloudflare):

   | Type | Name | Value |
   |------|------|--------|
   | A / CNAME | `@` / `bonvera.food` | Vercel target |
   | CNAME | `admin` | `cname.vercel-dns.com` (or Vercel’s shown target) |

4. Production env vars:

```env
NEXT_PUBLIC_MARKETING_URL=https://bonvera.food
NEXT_PUBLIC_ADMIN_URL=https://admin.bonvera.food
NEXT_PUBLIC_DEFAULT_LOCALE=tr
NEXT_PUBLIC_FALLBACK_LOCALE=tr
# …Supabase, DATABASE_URL, etc.
```

5. Redeploy after env changes so `NEXT_PUBLIC_*` are inlined.

Preview deployments use `*.vercel.app`. Hostname detection falls back to **marketing** unless the host starts with `admin.`. Preview admin testing can use a temporary env override or local `admin.localhost`.

---

## SEO rules

| Concern | Behavior |
|---------|----------|
| Canonical / `metadataBase` | `https://bonvera.food` only |
| `sitemap.xml` | Marketing URLs only — never `/studio` or admin host |
| `robots.txt` on marketing | Allow `/`, point sitemap at bonvera.food |
| `robots.txt` on admin | `Disallow: /` (middleware) |
| Admin HTML responses | `X-Robots-Tag: noindex, nofollow, noarchive` |
| Studio layout metadata | `robots: { index: false, follow: false }` |

---

## Cross-domain behavior

| Request | Result |
|---------|--------|
| `bonvera.food/studio` | 308 → `admin.bonvera.food/studio` |
| `admin.bonvera.food/` | 308 → `admin.bonvera.food/studio` |
| `admin.bonvera.food/setup` | 308 → `admin.bonvera.food/studio/setup` |
| `admin.bonvera.food/robots.txt` | Disallow all |

Authentication is **not** configured yet; hostname routing only prepares the surface split.

---

## Checklist

- [ ] DNS for `bonvera.food` and `admin.bonvera.food`
- [ ] Both domains attached to the same Vercel project
- [ ] Production env URLs set
- [ ] Verify marketing homepage indexes with canonical `bonvera.food`
- [ ] Verify admin responses include `X-Robots-Tag: noindex`
- [ ] Verify `bonvera.food/studio` redirects to admin
