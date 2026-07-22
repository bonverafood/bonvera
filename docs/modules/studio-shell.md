# Bonvera Studio Shell (Sprint 4)

UI-only admin experience for UX review on Vercel. **No** business logic, database, CRUD, API, auth, or Supabase.

## Surface

| Host | Path |
|------|------|
| `admin.bonvera.food` / `admin.localhost:3000` | `/studio` and module routes |
| Setup wizard (no shell) | `/studio/setup` |

## Navigation

Dashboard · Ürünler · Koleksiyonlar · Tarifler · Blog · Medya · SEO · PDF Katalog · Ask Bonvera · Mesajlar · Marka Ayarları

## Feature

```
src/features/studio-shell/
```

Shell: sidebar, header, breadcrumb, search (⌘K), notifications, user menu.  
Dashboard: realistic Bonvera placeholder cards.  
Modules: title, description, empty state, primary CTA.

## Local review

```bash
pnpm dev
# open http://admin.localhost:3000/studio
```
