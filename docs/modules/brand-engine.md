# Brand Engine — Product & Architecture Plan

> Status: **Awaiting approval** — no implementation until signed off.  
> Product: **Bonvera Studio** (single brand — Bonvera only).  
> Studio Admin UI language: **Turkish (fixed)**.  
> Brand content source language: **Turkish**.  
> Public customer languages: multi-locale later via **Translation Engine** (French first).

### Product direction

Not a multi-tenant CMS. Not a SaaS brand platform. Brand Engine is Bonvera’s single source of truth for public brand context.  
Another customer later = clone the repo. Do not design multi-brand switchers now.

### Brand Engine focus (v1)

Brand Engine is the single source of truth for **public-facing brand context**, not legal/compliance filing:

- Brand identity  
- Public business information  
- Website content inputs  
- AI context (Ask Bonvera, etc.)  
- SEO context  

**Out of core v1:** tax IDs, vergi dairesi, invoices, and other compliance data. If needed later → optional **Business Compliance** module (separate feature), not Brand Engine columns.

---

## 0. Language model (non-negotiable)

Three languages must never be conflated:

| Layer | Language | Owner | Example |
|-------|----------|-------|---------|
| **A. Studio Admin UI** | Turkish only | `BrandEngine` / Studio chrome message catalogs | Menü: “Marka”, buton: “Kaydet” |
| **B. Brand content (source)** | Turkish first | Brand Engine fields | Marka adı, slogan, hikâye |
| **C. Public website locales** | Multi (Bonvera: FR primary) | Translation Engine → Website | `fr` pages from translated brand copy |

**Rules**

1. Admin labels, menus, buttons, toasts, validation copy, empty states → **always Turkish**. Do not drive Studio chrome from brand content locale or from the public site locale.
2. Editable brand text in Brand Engine is authored in **Turkish (source)**. Other locales are not edited here in v1.
3. French (and other public locales) are **outputs** of Translation Engine, not parallel edit fields in Brand Engine v1.
4. URL/`[locale]` for Studio may still exist technically (next-intl). **App default locale is `tr`** (`NEXT_PUBLIC_DEFAULT_LOCALE=tr`), so unprefixed `/studio/...` is Turkish. Do not offer an admin language switcher in MVP.

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ Studio Admin UI │     │ Brand Engine (SoT)   │     │ Public Website      │
│ labels: TR      │────▶│ content source: TR   │────▶│ locales: FR (+…)    │
│ (chrome only)   │     │ + assets, SEO base   │     │ via Translation Eng.│
└─────────────────┘     └──────────────────────┘     └─────────────────────┘
```

---

## 1. UX flow — how a user manages their brand

### 1.1 Personas (MVP)

- **Brand owner / operator** — creates and maintains Bonvera’s canonical identity inside Studio.
- **Future modules** (Website, Products, SEO, …) — read Brand Engine; they do not own brand fields.

### 1.2 Entry paths

```
First-time user
  → Studio Setup (onboarding wizard)   [existing / evolving]
  → Creates initial brand draft
  → Persist into Brand Engine (when auth + DB land)
  → Land on Studio home
  → Open “Marka” (Brand Engine) anytime to edit

Returning user
  → /studio (auth-gated, later)
  → Sidebar: Marka
  → Brand Engine hub → section → edit → save
```

**Setup vs Brand Engine**

| Concern | Studio Setup | Brand Engine |
|---------|--------------|--------------|
| Job | One-time guided creation | Ongoing single source of truth |
| Depth | Subset of fields | Full public identity sections (SEO, assets, ton, …) |
| Persistence (target) | Writes **into** Brand Engine on complete | CRUD + assets |
| UI language | Turkish admin chrome | Turkish admin chrome |

Setup becomes a **thin onboarding writer** into Brand Engine; Brand Engine is the durable home. Until auth/DB ship, Setup may remain mock; Brand Engine implementation should still define the **canonical schema** Setup will target.

### 1.3 Core management loop

```
1. Open Marka
2. See hub: completeness + section list
3. Enter a section (e.g. İletişim)
4. Edit Turkish source fields / upload assets
5. Validate → Kaydet (server mutation)
6. See “Kaydedildi” + updated completeness
7. Downstream modules eventually read the same brandId snapshot
```

### 1.4 Autosave vs explicit save

| Pattern | Use when |
|---------|----------|
| **Explicit Kaydet** (recommended MVP) | Identity, company, SEO — high trust, clear undo |
| **Debounced autosave** (optional later) | Long text (hikâye) if product wants Setup-like feel |

MVP recommendation: **explicit save per section** with dirty-state guard on navigate (“Kaydedilmemiş değişiklikler var”). Reduces silent overwrite risk once multiple operators exist.

### 1.5 Assets flow

```
Upload (logo / favicon / belge / görsel)
  → Client validates type/size
  → Server Action → Supabase Storage (brand-scoped path)
  → Insert brand_assets row (url, kind, mime, size)
  → Optional: set brands.logo_asset_id / favicon_asset_id
```

No data-URL-in-DB. Logos in Setup localStorage are migration input only.

### 1.6 Single brand

Bonvera Studio serves **one** brand. No brand switcher. Data may still use a `brands` table with a single Bonvera row for clarity — that is not multi-tenancy.

### 1.7 Happy path (Bonvera)

1. Operator opens **Marka**.
2. Fills **Marka Bilgileri** (ad, slogan, hikâye, ton) in Turkish.
3. Completes **Şirket**, **İletişim**, **Sosyal**, **Çalışma Saatleri**.
4. Sets **Diller**: source/default content language = `tr`; marks `fr` as an *active target* for future Translation Engine (not editing FR copy here).
5. Sets **SEO Varsayılanları** (Turkish source meta; Translation Engine later produces FR meta).
6. Uploads **Marka Varlıkları**.
7. Website / SEO / PDF modules consume Brand Engine — never duplicate fields.

---

## 2. Screen structure

### 2.1 Information architecture

```
/studio/marka                    → Brand Engine hub
/studio/marka/bilgiler           → Marka Bilgileri
/studio/marka/sirket             → Şirket Bilgileri
/studio/marka/iletisim           → İletişim
/studio/marka/sosyal             → Sosyal Medya
/studio/marka/calisma-saatleri   → Çalışma Saatleri
/studio/marka/diller             → Diller
/studio/marka/seo                → SEO Varsayılanları
/studio/marka/varliklar          → Marka Varlıkları
```

Turkish path segments match admin language. Keep `studio` English as product namespace (already established).

**Host:** all Brand Engine routes live on `https://admin.bonvera.food` (see `docs/deployment.md`). Marketing host redirects `/studio…` to admin.

Alternative (acceptable): query/section tabs under `/studio/marka` only. Prefer **real routes** for deep-linking, metadata, and future permissions.

### 2.2 Studio chrome (shared, not Brand Engine–owned)

```
┌──────────────────────────────────────────────────────────┐
│ Bonvera Studio                    [Bildirim] [Hesap]     │
├────────────┬─────────────────────────────────────────────┤
│ Ana sayfa  │  Page content                               │
│ Marka  ●   │                                             │
│ …future…   │                                             │
└────────────┴─────────────────────────────────────────────┘
```

All chrome strings: Turkish.

### 2.3 Hub — `/studio/marka`

**Purpose:** orientation, completeness, jump into sections.

| Block | Content |
|-------|---------|
| Header | Marka adı + logo thumbnail + “Marka Motoru” |
| Completeness | Progress (e.g. 6/8 bölüm tamam) |
| Section list | Rows: title, one-line status, “Düzenle” |
| Primary CTA | First incomplete section |

No cards-for-decoration; section rows are the interaction surface.

### 2.4 Section screen pattern (all edit routes)

```
┌─────────────────────────────────────────────┐
│ ← Marka     Bölüm başlığı                   │
│             Kısa yardım metni (TR)          │
├─────────────────────────────────────────────┤
│ Form fields (single column, max-w-xl)       │
│ …                                           │
├─────────────────────────────────────────────┤
│ [İptal]                        [Kaydet]     │
└─────────────────────────────────────────────┘
```

- One job per screen (matches design rules).
- Sticky or bottom action bar on long forms.
- Validation inline (Turkish messages).

### 2.5 Section field map

#### Marka Bilgileri

| Field | Notes |
|-------|--------|
| Marka adı | Required |
| Logo | Shortcut to primary logo asset or upload |
| Slogan | Short |
| Marka hikâyesi | Long text |
| Marka açıklaması | Medium text |
| Marka tonu | Enum or short controlled vocabulary (e.g. samimi, premium, …) + optional free note |

#### Şirket Bilgileri

Public business / identity context only — **not** legal compliance.

| Field | Required | Notes |
|-------|----------|--------|
| Şirket adı | Yes | Public / trading company name |
| Şirket tipi | Yes | e.g. sole_prop, llc, corporation, nonprofit, other (aligned with Setup) |
| Ülke | Yes | Country code |
| Şehir | Yes | City |
| Adres | No | Optional street / full address for public display |
| İletişim | — | Owned by the **İletişim** section (phone, email, WhatsApp, website); hub may deep-link, but fields are not duplicated here |

**Excluded from Brand Engine v1:** vergi numarası, vergi dairesi, and any tax/compliance attributes. Future home: optional **Business Compliance** module.

#### İletişim

Public contact channels (required for a usable brand presence):

| Field | Required | Notes |
|-------|----------|--------|
| Email | Yes | |
| Telefon | No | |
| WhatsApp | No | |
| Website | No | Valid URL when present |

#### Sosyal Medya

Instagram, Facebook, LinkedIn, YouTube, TikTok (optional handles/URLs)

#### Çalışma Saatleri

Opening, closing, working days (reuse Setup semantics; allow later per-day ranges in v2)

#### Diller

| Field | Notes |
|-------|--------|
| Varsayılan dil | Source locale for brand content — **MVP fixed `tr`** (display locked or selectable only among source-capable locales) |
| Aktif diller | Locales the brand intends to publish (e.g. `tr`, `fr`) — flags for Translation Engine / Website, **not** inline translations |

#### SEO Varsayılanları

| Field | Notes |
|-------|--------|
| Meta başlığı | Source (TR) |
| Meta açıklaması | Source (TR) |
| Varsayılan görsel | Asset ref (OG image) |

#### Marka Varlıkları

Library grid/list: Logo, Favicon, Belgeler, Görseller — upload, replace, delete; mark primary logo/favicon.

### 2.6 Empty / error / loading

- Loading: skeleton or “Yükleniyor…”
- Empty hub (no brand): redirect to Setup or “Marka oluştur”
- Save error: toast + keep dirty state
- Unauthorized (later): Studio auth gate

### 2.7 Visual direction

Align with Bonvera Studio restraint (Setup language): calm surface, clear hierarchy, brand name as primary signal on hub — not a marketing landing page inside admin.

---

## 3. Database proposal

### 3.1 Principles

- Brand Engine owns **canonical brand identity** tables.
- Multi-brand ready: every row keyed by `brand_id`.
- Content columns hold **source language (TR)** only in v1.
- Translations live in a future `brand_translations` / Translation Engine schema — **not** duplicated columns like `name_fr`.
- Assets in Supabase Storage; metadata in Postgres via Drizzle.

### 3.2 ER overview

```
organizations (optional later)
    │
    └── brands 1───1 brand_profiles
              1───1 brand_companies
              1───1 brand_contacts
              1───1 brand_social_links
              1───1 brand_hours
              1───1 brand_seo_defaults
              1───* brand_locales
              1───* brand_assets
```

MVP can skip `organizations` and attach brands to `owner_user_id` (Supabase auth user) until org/team lands.

### 3.3 Tables

#### `brands`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `slug` | text unique | Internal / future public |
| `status` | enum | `draft` \| `active` \| `archived` |
| `source_locale` | text | Always `tr` for Bonvera MVP |
| `owner_user_id` | uuid | Supabase user (until orgs) |
| `created_at` / `updated_at` | timestamptz | |

#### `brand_profiles` (Marka Bilgileri)

| Column | Type | Notes |
|--------|------|-------|
| `brand_id` | uuid PK/FK | |
| `name` | text | Marka adı (TR source) |
| `tagline` | text nullable | Slogan |
| `story` | text nullable | Hikâye |
| `description` | text nullable | Açıklama |
| `tone` | text nullable | Ton code or free text |
| `tone_notes` | text nullable | Optional |
| `logo_asset_id` | uuid FK nullable | → brand_assets |
| `updated_at` | timestamptz | |

#### `brand_companies` (Şirket — public business info)

| Column | Type | Notes |
|--------|------|-------|
| `brand_id` | uuid PK/FK | |
| `name` | text | Company / trading name (public) |
| `type` | text / enum | Company type (sole_prop, llc, …) |
| `country_code` | text | Required |
| `city` | text | Required |
| `address_line` | text nullable | Optional public address |
| `updated_at` | timestamptz | |

No `tax_id` / `tax_office` (or similar) in Brand Engine. Compliance data, if ever needed, lives in a separate **Business Compliance** feature and schema.

#### `brand_contacts` (İletişim)

| Column | Type |
|--------|------|
| `brand_id` | uuid PK/FK |
| `email` | text |
| `phone` | text nullable |
| `whatsapp` | text nullable |
| `website` | text nullable |
| `updated_at` | timestamptz |

#### `brand_social_links` (Sosyal)

| Column | Type |
|--------|------|
| `brand_id` | uuid PK/FK |
| `instagram` / `facebook` / `linkedin` / `youtube` / `tiktok` | text nullable |
| `updated_at` | timestamptz |

#### `brand_hours` (Çalışma Saatleri)

| Column | Type |
|--------|------|
| `brand_id` | uuid PK/FK |
| `opening` | time / text `HH:MM` |
| `closing` | time / text |
| `working_days` | text[] or jsonb | e.g. `{mon,tue,…}` |
| `updated_at` | timestamptz |

*v2:* `brand_hour_exceptions` or per-day open/close rows.

#### `brand_locales` (Diller)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `brand_id` | uuid FK | |
| `locale` | text | `tr`, `fr`, … |
| `is_default` | boolean | Exactly one default per brand (source) |
| `is_active` | boolean | Publish intent |
| `unique(brand_id, locale)` | | |

Constraint: default locale should match `brands.source_locale` (`tr`).

#### `brand_seo_defaults` (SEO Varsayılanları)

| Column | Type |
|--------|------|
| `brand_id` | uuid PK/FK |
| `meta_title` | text nullable | TR source |
| `meta_description` | text nullable | TR source |
| `og_image_asset_id` | uuid FK nullable |
| `updated_at` | timestamptz |

#### `brand_assets` (Marka Varlıkları)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `brand_id` | uuid FK | |
| `kind` | enum | `logo` \| `favicon` \| `document` \| `image` \| `other` |
| `storage_path` | text | Supabase path |
| `public_url` | text | Or derive |
| `file_name` | text | |
| `mime_type` | text | |
| `byte_size` | int | |
| `created_at` | timestamptz | |

Storage path convention: `brands/{brand_id}/{kind}/{asset_id}-{filename}`

### 3.4 Relationships summary

- 1 brand → 1 profile, company, contact, social, hours, seo (1:1 extension tables keep migrations additive).
- 1 brand → many locales, many assets.
- Profile/SEO point at assets by FK (not duplicated URLs as source of truth).

### 3.5 Future Translation Engine (out of scope, reserved)

```
brand_translations
  brand_id, locale, entity_type, entity_id, field, value, status, updated_at
```

Website reads: source TR from Brand Engine + translated FR rows. Brand Engine UI does not edit FR in v1.

### 3.6 Future Business Compliance (out of scope, reserved)

Optional later module for tax and regulatory data (e.g. vergi no, vergi dairesi, registration documents). **Must not** extend `brand_companies` in a way that blurs public brand SoT with filing data. Prefer `business_compliance` (1:1 or 1:many per brand) owned by that feature.

### 3.7 Mapping from Studio Setup draft

| Setup draft | Brand Engine |
|-------------|--------------|
| `brand.*` | `brand_profiles` (+ logo asset) |
| `company.*` | `brand_companies` (name, type, country, city, address — **no tax**) |
| `contact.*` / `social.*` | contacts / social |
| `hours.*` | `brand_hours` |
| `languages.*` | `brand_locales` (default → `tr`) |
| — | `brand_seo_defaults`, assets library (new) |

---

## 4. State management approach

### 4.1 Boundaries (aligned with ARCHITECTURE.md)

| State | Tool | Brand Engine use |
|-------|------|------------------|
| Server data | **Drizzle** + Server Components / Server Actions | Load & mutate brand sections |
| Client server-cache | **TanStack Query** | Section forms that need refetch, optimistic UI, asset lists |
| Form draft | **React Hook Form** + Zod | Per-section edit forms |
| Ephemeral UI | **Zustand** (minimal) | Sidebar, dirty flags if needed |
| Validation | **Zod** | Shared client/server schemas in feature |

**Do not** put Brand Engine SoT in Zustand/localStorage (Setup mock was temporary).

### 4.2 Data flow

```
RSC page (/studio/marka/iletisim)
  → requireAuth() + resolveActiveBrandId()
  → drizzle: select brand_contacts
  → pass initialData to client SectionForm

SectionForm (client)
  → RHF defaultValues from props
  → user edits
  → Kaydet → server action updateBrandContact(brandId, values)
       → zod parse
       → authorize brand ownership
       → drizzle update
       → revalidatePath / invalidate query
  → toast “Kaydedildi”
```

Assets:

```
Client upload
  → server action (multipart or signed upload URL)
  → Storage + insert brand_assets
  → TanStack Query invalidate ["brand-assets", brandId]
```

### 4.3 Read API for other modules (contract)

Export a stable server-side reader from the feature public API:

```ts
// Conceptual — not implementing yet
getBrandBundle(brandId): BrandBundle
getBrandProfile(brandId)
getBrandContact(brandId)
// …
```

`BrandBundle` = assembled DTO for Website / SEO / PDF / Ask Bonvera. Downstream modules **import from `@/features/brand-engine`**, never query tables ad hoc.

### 4.4 Auth & tenancy (dependency)

Brand Engine **requires** authenticated owner (or org member) for mutations. Plan assumes Auth lands with or immediately before Brand Engine persistence. If Auth is deferred, Brand Engine UI may be built against Drizzle with a temporary single-tenant seed — call that out in implementation PR; do not silently keep localStorage as SoT.

### 4.5 Caching

- RSC + `revalidatePath` for section pages.
- TanStack Query for asset library and any client-heavy views.
- No edge cache of PII/contact until CDN strategy exists.

---

## 5. Folder structure

Feature-first; `app/` only composes.

```
src/features/brand-engine/
  index.ts                 # Public API (components + getBrandBundle, types)
  types.ts
  schema.ts                # Zod per section + bundle
  constants.ts             # Section nav, tone options, asset kinds
  messages/                # Optional: feature-local keys doc; actual copy in src/messages/tr.json
  components/
    brand-engine-hub.tsx
    brand-section-nav.tsx
    brand-completeness.tsx
    sections/
      profile-form.tsx
      company-form.tsx
      contact-form.tsx
      social-form.tsx
      hours-form.tsx
      locales-form.tsx
      seo-form.tsx
      assets-panel.tsx
    assets/
      asset-uploader.tsx
      asset-grid.tsx
  hooks/
    use-brand-section-form.ts
    use-brand-assets.ts
  actions/                 # Server Actions
    update-profile.ts
    update-company.ts
    update-contact.ts
    update-social.ts
    update-hours.ts
    update-locales.ts
    update-seo.ts
    upload-asset.ts
    delete-asset.ts
  api/                     # Query options / readers for consumers
    get-brand-bundle.ts
    get-brand-section.ts
    keys.ts
  lib/
    completeness.ts
    storage-paths.ts
    map-setup-draft.ts     # Migration helper from Setup → Engine

src/lib/db/schema/
  brands.ts
  brand-profiles.ts
  …                        # or single brands.ts barrel

src/app/[locale]/(studio)/studio/marka/
  layout.tsx               # Section subnav shell
  page.tsx                 # Hub
  bilgiler/page.tsx
  sirket/page.tsx
  iletisim/page.tsx
  sosyal/page.tsx
  calisma-saatleri/page.tsx
  diller/page.tsx
  seo/page.tsx
  varliklar/page.tsx

src/messages/tr.json       # BrandEngine.* admin UI strings (Turkish)
# Do not put brand content strings in message catalogs.
```

**Studio UI locale policy (implementation note for approval):**  
Introduce a clear split:

- `src/messages/tr.json` → Studio admin (required for Brand Engine).
- Marketing / public continues to use locale routing; Studio layout forces Turkish message loading for admin namespaces.

---

## 6. Future scalability considerations

1. **Translation Engine** — active locales become jobs; never add `name_fr` columns to profile.
2. **Website / CMS** — pages reference Bonvera brand content + translations; Brand Engine stays identity SoT.
3. **Products / Catalog / PDF / Email / Ask Bonvera** — consume `getBrandBundle()`; use `updated_at` for cache bust.
4. **SEO module** — may override per-page meta; falls back to `brand_seo_defaults`.
5. **Assets CDN** — Storage → CDN; image transforms without changing FK model.
6. **Hours v2** — per-day intervals, holidays, timezone if Bonvera needs them.
7. **Audit log** — when multiple operators edit the same brand.
8. **RLS** — Supabase RLS alongside Drizzle auth checks.
9. **Setup retirement** — Setup writes Brand Engine once; editing only in Marka.
10. **Public FR** — TR source → Translation Engine → FR publish. Admin stays TR.
11. **Business Compliance** — tax / regulatory data as a separate optional module if Bonvera needs it.
12. **Another company later** — clone this repository; do not add multi-tenant abstractions now.

---

## 7. MVP scope & non-goals

### In scope (Brand Engine v1)

- Hub + 8 section screens (Turkish admin UI)
- Drizzle schema as above
- Server Actions + Zod validation (Turkish errors)
- Asset upload for logo/favicon/images/documents
- Completeness indicator
- Public read API (`getBrandBundle`) for future modules
- Wire Studio nav item **Marka**

### Non-goals (v1)

- Inline editing of French (or other) brand copy
- Translation Engine UI/jobs
- Multi-brand switcher UI / multi-tenant SaaS packaging
- Organization/team permissions matrix (until Bonvera needs multiple roles)
- Per-page SEO overrides
- Full auth product (may be parallel dependency)
- Replacing public marketing site content automatically
- **Tax / vergi / compliance fields** (reserved for optional Business Compliance module)

### Dependencies to sequence

```
1. Auth (session + brand ownership)     ─┐
2. Drizzle brand schema + Storage         ├─▶ Brand Engine UI
3. Pin Studio admin UI to Turkish        ─┘
4. Migrate/bridge Studio Setup → Brand Engine
5. Translation Engine (later)
6. Website consumes bundle (later)
```

---

## 8. Success criteria

- Operator can maintain all listed sections in Turkish admin UI.
- One `brand_id` is the SoT; no duplicate brand fields in other features.
- Source content is Turkish; no mixed admin/content language in UI.
- Another feature can call `getBrandBundle(brandId)` without touching Brand Engine tables directly.
- Schema supports adding locales and translations without rewriting Brand Engine forms.

---

## 9. Open questions (for approval)

1. **Auth timing** — Ship Brand Engine UI + schema only with seed brand, or block on Auth first?
2. **Marka tonu** — Closed enum vs free text vs both?
3. **Default active locales for Bonvera** — Seed `tr` (default source) + `fr` (active target) on create?
4. **Setup** — Keep mock Setup until Brand Engine persists, or implement Brand Engine persistence first and rewire Setup immediately?

*(Resolved: no tax fields in Brand Engine v1; compliance is a separate future module.)*  
*(Resolved: app default/fallback locale = `tr` via env; unprefixed `/studio` is Turkish admin. Public FR remains a Translation Engine / Website target, not the app routing default.)*

---

## 10. Approval checkpoint

Please confirm or adjust:

- [ ] Language model (Admin TR / Content source TR / Public via Translation Engine)
- [ ] Bonvera Studio single-brand scope (no SaaS / multi-tenant design)
- [ ] Brand Engine focus: identity + public info + website / AI / SEO context (no tax in v1)
- [ ] UX flow & section routes under `/studio/marka/...`
- [ ] Database entities & 1:1 extension tables (`brand_companies` without tax)
- [ ] Server-first + TanStack Query + RHF (no Zustand SoT)
- [ ] Folder structure under `src/features/brand-engine`
- [ ] Answers to open questions in §9

**No code until this plan is approved.**
