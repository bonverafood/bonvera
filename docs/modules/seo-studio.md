# SEO Studio (Sprint 8)

Site-wide SEO control for `bonvera.food` — defaults, fixed marketing pages, product SEO health.

## Ownership

| Module | Owns |
|--------|------|
| **SEO Studio** | `site_seo_defaults`, `site_seo_pages`, public metadata plumbing, product audit |
| **Product Studio** | Per-product `slug` / `seo_title_tr` / `seo_description_tr` / `og_image_url` |
| **Brand Engine (later)** | Brand identity; may absorb defaults later |

No AI önerileri. No FR SEO editor (Sprint 9). No arbitrary URL CMS.

## Setup

1. Run [`docs/sql/schema.sql`](../sql/schema.sql) in Supabase SQL Editor (creates `site_seo_*` + seeds).
2. `SUPABASE_SERVICE_ROLE_KEY` already required for Studio.

## Data

Supabase JS only (`src/lib/data/site-seo.ts`). Tables:

- `site_seo_defaults` — title suffix, default description/OG, organization (JSON-LD)
- `site_seo_pages` — fixed keys: `home`, `urunler`, `tarifler`, `blog`, `iletisim`

## Routes

| Path | Purpose |
|------|---------|
| `/studio/seo` | Defaults form, page SEO forms, product SEO audit |

Public: `generateMetadata` via `src/lib/seo/metadata.ts`; Organization JSON-LD in marketing layout; published product URLs in sitemap.

## Product audit

Lists non-archived products missing SEO fields; deep-links to `/studio/urunler/[id]`. Does not re-edit product SEO here.
