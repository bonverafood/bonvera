# Bonvera — Site Map

> Aligns with master plan: [`docs/roadmap.md`](./roadmap.md).  
> Product: **Bonvera Studio** + public website.  
> One Next.js app · one Vercel project · one brand.

---

## 1. Domains

| Host | Surface | Purpose |
|------|---------|---------|
| `https://bonvera.food` | **Marketing** | Public Bonvera website (SEO / customers) |
| `https://www.bonvera.food` | **Marketing** | Should **308 →** `bonvera.food` (apex canonical) |
| `https://admin.bonvera.food` | **Studio** | Bonvera Studio admin (`noindex`) |

**P0 status (2026-07-22):** `www` and `admin…/studio` return **200**. Apex still redirects to `www` — reverse when convenient (canonical = apex).

---

## 2. Public website (`bonvera.food`)

### Sprint 5 shell (design only, no real data)

| Path (hedef) | İçerik |
|--------------|--------|
| `/` | Ana sayfa — hero, hikaye, kategoriler, koleksiyonlar, üretim, ortaklar, tarif/blog teaser, iletişim, Ask |
| Ürün listesi + `/[slug]` | örn. `/icli-kofte` |
| Tarifler | Tarif listesi / detay |
| Blog | SEO içerik listesi / detay |
| Koleksiyonlar | Premium, Geleneksel, Sezonluk, Limited |
| İletişim | Form / B2B |

His: **Authentic Turkish Cuisine, Crafted in France.**

### Şu an

Marketing placeholder + locale (`/`, `/fr`). Studio path’leri marketing’te admin’e yönlenir.

---

## 3. Bonvera Studio (`admin.bonvera.food`)

| Path | Modül | Durum |
|------|--------|--------|
| `/studio` | Dashboard | UI shell ✅ |
| `/studio/urunler` | Ürünler | Product Studio ✅ |
| `/studio/koleksiyonlar` | Koleksiyonlar | Empty UI ✅ |
| `/studio/tarifler` | Tarifler | Empty UI ✅ |
| `/studio/blog` | Blog | Empty UI ✅ |
| `/studio/medya` | Medya | Empty UI ✅ |
| `/studio/seo` | SEO | Empty UI ✅ |
| `/studio/pdf-katalog` | PDF | Empty UI ✅ |
| `/studio/ask-bonvera` | Ask Bonvera | Empty UI ✅ |
| `/studio/mesajlar` | Mesajlar | Empty UI ✅ |
| `/studio/marka` | Marka Ayarları | Empty UI ✅ |
| `/studio/setup` | Setup (shell dışı) | UI ✅ |

---

## 4. Sprint sırası (özet)

| Sprint | Konu | Durum |
|--------|------|--------|
| 1–3 | Foundation · Design System · Setup | ✅ |
| **4** | **Studio Shell** | ✅ |
| **5** | **Public Website Shell** | ✅ |
| **6** | **Product Studio** | ✅ |
| 7 | Media Studio | ⬜ |
| 8 | SEO Studio | ⬜ |
| 9 | Translation Engine | ⬜ |
| 10 | PDF Studio | ⬜ |
| 11 | Public entegrasyon | ⬜ |
| 12 | Ask Bonvera | ⬜ |
| 13 | Dashboard (gerçek veri) | ⬜ |
| 14–15 | Test · Production | ⬜ |

Tam metin: [`roadmap.md`](./roadmap.md).

---

## 5. V1 dışı

SaaS · multi-brand · tenant · marketplace · bayi · faturalandırma — yok.
