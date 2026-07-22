# BONVERA STUDIO V3 — Ürün Yol Haritası (Master Plan)

> Source of truth for product scope and sprint order.  
> Decision filter: **“Bu özellik Bonvera'yı daha iyi hale getiriyor mu?”**  
> Hayır ise geliştirilmez.

---

## 1. Vizyon

Bonvera Studio, Bonvera'nın tüm dijital operasyonlarını yönettiği profesyonel bir yönetim panelidir.

Bu proje:

- SaaS değildir
- Çok markalı (multi-brand) değildir
- Marketplace değildir
- CMS satışı için geliştirilen bir ürün değildir

Yalnızca **Bonvera** için geliştirilir.

---

## 2. Teknoloji

| Katman | Stack |
|--------|--------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui |
| Backend | Next.js Server Actions, Supabase, Drizzle ORM |
| Deploy | Vercel |
| AI | OpenAI |

---

## 3. Domain Yapısı

| Host | Yüzey |
|------|--------|
| https://bonvera.food | Public website (müşteri) |
| https://admin.bonvera.food | Bonvera Studio (admin) |

Teknik: tek GitHub repo · tek Next.js app · tek Supabase · tek Vercel projesi.

**Canonical SEO:** `bonvera.food` (apex). `www` → apex redirect hedeflenir.

---

## 4. Dil Yapısı

| Alan | Dil |
|------|-----|
| Admin paneli | Türkçe |
| İçerik kaynağı | Türkçe (önce TR) |
| Çeviri (ilk) | Fransızca |
| Sonra | EN, DE, IT |

Tek tıkla AI destekli çeviri.

---

## 5. Public Website

Ana hedef: ürün satmak değil, **marka oluşturmak**.

İlk his:

> **Authentic Turkish Cuisine, Crafted in France.**

Premium · minimal · modern · güven veren · kurumsal.

### Sayfalar

**Ana sayfa:** Hero, marka hikayesi, ürün kategorileri, koleksiyonlar, üretim yaklaşımı, iş ortakları, tarifler, blog, iletişim, Ask Bonvera.

**Ürünler:** SEO URL — örn. `bonvera.food/icli-kofte` (her ürünün kendi sayfası).

**Tarifler** · **Blog** · **Koleksiyonlar** (Premium Seri, Geleneksel Lezzetler, Sezonluk, Limited Edition).

---

## 6. Bonvera Studio

### Dashboard

Son ürünler, SEO durumu, son mesajlar, çeviri durumu, PDF sayısı, son aktiviteler, hızlı işlemler.

### Modüller

| Modül | Özet |
|-------|------|
| **Ürünler** | En kritik modül — TR içerik, canlı önizleme, SEO, görseller, PDF, çeviri, yayın durumu |
| **Koleksiyonlar** | Ürün grupları |
| **Tarifler** | Tarif + ürün ilişkisi |
| **Blog** | Yazılar + AI taslak |
| **Medya** | Görsel, video, belge, logo |
| **SEO** | Meta, OG, Schema, canonical + AI önerileri |
| **PDF** | Tek ürün + toplu katalog, tek tık |
| **Ask Bonvera** | Site AI asistanı (~1 dk nazik açılış) → Mesajlar |
| **Mesajlar** | İletişim + Ask konuşmaları (Yeni / Okundu / Cevaplandı / Arşiv) |
| **Marka Ayarları** | Logo, slogan, hikaye, iletişim, sosyal, saatler, SEO varsayılanları |

---

## 7. AI Özellikleri

- SEO önerileri
- Tek tık çeviri (“Fransızca çeviriyi oluştur”)
- Blog taslak
- Tarif önerileri
- PDF / ürün açıklama üretimi

---

## 8. İçerik Akışı

Türkçe içerik → AI çeviri → Fransızca → Yayın.

---

## 9. Tasarım Dili

İlham: Apple, Shopify, Linear, Notion, Vercel — kopya değil; Bonvera'ya özgü premium dil.

**Palet:** Zeytin · Taş · Krem · Toprak · Beyaz. Abartılı renk yok.

---

## 10. Sprint Planı

| Sprint | Konu | Durum |
|--------|------|--------|
| 1 | Foundation | ✅ |
| 2 | Design System | ✅ |
| 3 | Studio Setup | ✅ |
| 4 | Studio Shell | ✅ |
| 5 | Public Website Shell (Ana, Ürünler, Blog, Tarifler, İletişim — veri yok, tasarım var) | ✅ |
| 6 | Product Studio | ✅ Auth + CRUD + live preview |
| 7 | Media Studio | ⬜ |
| 8 | SEO Studio | ⬜ |
| 9 | Translation Engine | ⬜ |
| 10 | PDF Studio | ⬜ |
| 11 | Public Website entegrasyonu (gerçek ürünler) | ⬜ |
| 12 | Ask Bonvera | ⬜ |
| 13 | Dashboard (gerçek veri) | ⬜ |
| 14 | Test (responsive, perf, SEO, a11y) | ⬜ |
| 15 | Production (canlı yayın olgunluğu) | ⬜ |

---

## 11. V1 Dışı (yapılmayacak)

Çok marka · SaaS · tenant · üyelik paketleri · marketplace · bayi · faturalandırma.

Kod temiz tutulur; bu senaryolar için gereksiz karmaşıklık eklenmez.

---

## 12. Analitik (yayın sonrası)

En çok görüntülenen ürünler · SEO · PDF indirme · Ask kullanımı · iletişim talepleri · blog · tarif · dönüşüm.

---

## Sonuç

Amaç yalnızca içerik yönetmek değil; Bonvera'nın ürün, hikaye, SEO, katalog, tarif, medya ve müşteri iletişimini tek panelden yönetmesini sağlamaktır.
