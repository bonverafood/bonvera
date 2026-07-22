# Studio Setup

First business module of Studio OS. Guided onboarding so a new Studio user creates a brand instead of landing on an empty dashboard.

## Purpose

When someone opens Studio for the first time, they complete an 8-step wizard that captures brand identity, company details, contact channels, social profiles, languages, and business hours. The experience is intentionally calm and premium (Shopify / Vercel / Linear / Apple–inspired restraint, Studio OS identity).

## Non-goals (this version)

- No database persistence
- No authentication / session ownership
- No file upload to storage (logo is a local data URL in the draft)
- No multi-brand management UI (data model is multi-brand-ready)

## Route

| Path | Role |
|------|------|
| `/studio/setup` | Wizard |
| `/studio` | Studio home; **mock gate** redirects to setup until `setupCompleted` |

Locale prefixes follow next-intl (`localePrefix: 'as-needed'`). Default locale `tr`: `/studio/setup`. French: `/fr/studio/setup`.

## Feature layout

```
src/features/studio-setup/
  index.ts                 # public API
  types.ts
  schema.ts                # Zod factories per step + full draft
  constants.ts             # steps, catalogs (languages, countries)
  store.ts                 # Zustand + localStorage persist
  lib/draft.ts
  lib/logo.ts              # logo type/size + data URL reader
  hooks/
    use-setup-hydration.ts
    use-autosave-draft.ts  # debounce + flush/commit
    use-setup-step-form.ts # shared RHF + autosave wiring
  components/
    setup-wizard.tsx
    studio-home-gate.tsx
    studio-surface.tsx     # shared background shell
    setup-progress.tsx
    setup-nav.tsx
    field.tsx
    steps/*
```

Shared UI primitives used by the wizard:

- `src/components/ui/{button,label,input,textarea,select,checkbox,badge}.tsx`

App routes only compose the feature:

- `src/app/[locale]/(studio)/studio/setup/page.tsx` → `<SetupWizard />`
- `src/app/[locale]/(studio)/studio/page.tsx` → `<StudioHomeGate />`

## Steps

1. **Welcome** — Studio OS introduction, primary CTA
2. **Brand** — name (required), logo (optional), description (optional)
3. **Company** — name, type, country, city, address
4. **Contact** — email (required), phone, WhatsApp, website
5. **Social** — Instagram, Facebook, LinkedIn, YouTube, TikTok (all optional)
6. **Languages** — default + unbounded additional locales
7. **Business hours** — opening, closing, working days
8. **Finish** — summary + “Your brand is ready.” / “Go to Studio”

## Data model (multi-brand ready)

Each draft is keyed by `brandId` (UUID). The store keeps:

```ts
activeBrandId: string | null
draftsByBrandId: Record<string, BrandDraft>
currentStepIndex: number
saveStatus: "idle" | "saving" | "saved"  // not persisted
```

MVP UI edits the active draft only. Future multi-brand can add brand switching without reshaping the draft.

Brand languages (`languages.defaultLocale` + `additionalLocales[]`) are **independent** from app UI locales (`src/config/i18n.ts`). The language catalog in `constants.ts` is large and additive; architecture allows unlimited `additionalLocales`.

## Autosave (mock)

- Storage key: `studio-os:setup-draft` (localStorage via Zustand `persist`)
- Form field changes use RHF `watch().subscribe` → debounced (~350ms) `patchDraft`
- Step submit / unmount **flushes** pending patches immediately so the next step never reads a stale draft
- UI shows Saving / Saved
- `skipHydration: true` + `useSetupHydration` client rehydrate avoids SSR mismatches
- `partialize` excludes `saveStatus`

Replace with TanStack Query + Server Actions / Drizzle when persistence lands. Keep the same `BrandDraft` shape as the migration target.

## Validation

Zod schemas live in `schema.ts` (Zod 4). Forms use `standardSchemaResolver` from `@hookform/resolvers/standard-schema`. Each form step validates on submit before advancing. Social fields are optional. Hours require closing > opening and at least one working day.

## Accessibility & UX

- Labeled fields, `role="alert"` for errors, progressbar semantics
- Keyboard: native form submit on Next (`form` attribute + `SETUP_FORM_ID`); Back does not skip validation
- Responsive single-column layout (`max-w-lg`)
- Framer Motion step transitions; respects `prefers-reduced-motion` via `useReducedMotion`
- Empty state copy on social / additional languages
- Subtle radial gradient background; calm, centered composition

## Public API

```ts
import {
  SetupWizard,
  StudioHomeGate,
  useSetupStore,
  selectIsSetupCompleted,
} from "@/features/studio-setup";
```

## i18n

Message namespace: `StudioSetup` in `src/messages/fr.json` and `src/messages/tr.json`. Studio home also uses `Studio.welcomeBrand` and `Studio.replaySetup`.

## Future persistence map

| Draft field | Likely tables / storage |
|-------------|-------------------------|
| `brand.*` | `brands` + storage object for logo |
| `company.*` | `brand_companies` or columns on `brands` |
| `contact.*` / `social.*` | `brand_contacts` / `brand_social_links` |
| `languages.*` | `brand_locales` (rows, not a fixed enum) |
| `hours.*` | `brand_hours` |

Completion gate moves from localStorage `setupCompleted` to “user has ≥ 1 brand” (server).

## Replay (dev)

Studio home exposes **Replay setup** only when `NODE_ENV === "development"`. It resets the mock draft and returns to `/studio/setup`. Remove entirely when auth ships.

## Production readiness (this version)

| Ready | Not ready (by design / next phase) |
|-------|-------------------------------------|
| 8-step UX, i18n (fr/tr), Zod validation, a11y basics | Auth / ownership |
| localStorage autosave with flush-on-advance | Server persistence (Drizzle) |
| Logo type/size guards for quota safety | Object storage uploads |
| Finish validates full draft before complete | Multi-device sync |

Treat as a **client prototype module** inside Studio OS — shippable for UX review, not as the durable brand store of record.
