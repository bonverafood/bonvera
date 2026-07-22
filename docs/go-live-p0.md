# P0 — Canlıya alma: adım adım (Vercel 404)

> Hedef: `https://bonvera.food` ve `https://admin.bonvera.food/studio` herkese açık çalışsın.  
> **P0 büyük ölçüde tamam (2026-07-22):** `www` + `admin…/studio` → **200**. Framework = **Next.js** (Other değil).  
> İsteğe bağlı: apex→www yönünü tersine çevir (`bonvera.food` canonical).  
> Master plan: [`roadmap.md`](./roadmap.md).

## Neden 404 görüyorsun? (kısa)

Uygulama Vercel’de **kurulmuş** (deploy var). Ama:

1. `*.vercel.app` linkleri **Vercel Login** istiyor → **Deployment Protection** açık.
2. `bonvera.food` / `www` / `admin` → **Production deploy’a bağlı değil** → platform `NOT_FOUND`.

Kod değiştirmen gerekmiyor. Sadece Vercel paneli.

---

## Hazırlık

1. Tarayıcıda [https://vercel.com/dashboard](https://vercel.com/dashboard) aç.
2. Doğru hesaba / team’e giriş yaptığından emin ol (Bonvera’nın bağlı olduğu hesap).
3. Projeyi aç: adı büyük ihtimalle **`bonvera-studio`**.

Sol menüden bu üç yere gideceksin: **Deployments**, **Settings → Deployment Protection**, **Settings → Domains**.

---

## ADIM 1 — Deploy gerçekten “Ready” mi?

1. Projede üstte **Deployments** sekmesine tıkla.
2. En üstteki (en yeni) deploy’a bak.
3. Durum şöyle olmalı: yeşil / **Ready**.
4. Environment: mümkünse **Production** olanı seç (veya `main` branch’ten gelen).

**Eğer Failed / Error görürsen:**  
Önce o deploy’un log’unu aç, hatayı düzelt, yeniden deploy et. Domain’leri boşuna bağlama.

**Eğer Ready ise:**  
O satıra tıkla → **Visit** / domain listesinde `…vercel.app` linkini kopyala.  
Şimdilik Login ekranı görmen normal (Adım 2’de düzelecek).

---

## ADIM 2 — Deployment Protection’ı kapat (çok önemli)

Şu an deploy URL’leri seni Vercel’e login ettiriyor. Site herkese açık olmayacak.

1. Sol menü / üst: **Settings**.
2. Sol alt menüde **Deployment Protection** (bazen **Security** altında).
3. **Production** için korumayı kapat:
   - **Disabled** / **Only Preview Deployments** gibi bir seçenek ara.
   - Production’ı korumalı bırakma.
4. **Save** / kaydet.

### Kontrol

1. Gizli / Incognito pencere aç (Vercel’e giriş yapmadan).
2. Daha önce kopyaladığın adresi aç, örnek:
   - `https://bonvera-ffk4bf4is-bonvera-studio.vercel.app/`
3. **Beklenen:** Bonvera sayfası (marketing veya redirect).  
4. **Hâlâ “Log in to Vercel” görüyorsan:** Protection kaydedilmemiş veya Preview’e bakıyorsun; Production ayarını tekrar kontrol et.

Bu adım geçmeden custom domain’ler de karışık görünebilir; önce bunu bitir.

---

## ADIM 3 — Domain’leri Production’a bağla

1. **Settings → Domains**.
2. Şu an ne gördüğünü oku (her satırın yanında Valid / Redirect / Invalid yazabilir).

### 3a — `bonvera.food` (ana site)

1. **Add** / **Add Domain** → yaz: `bonvera.food`
2. Onayla.
3. Bu domain **Production**’a bağlı olsun (uygulamayı servis eden host).
4. Durum **Valid** olmalı.

DNS zaten Vercel’e gidiyor; çoğu zaman ekstra DNS değiştirmen gerekmez.  
**Invalid** derse Vercel’in gösterdiği A / CNAME kayıtlarını domain panelinde uygula.

### 3b — `www.bonvera.food` (yönlendirme)

Şu an ters çalışıyor: `bonvera.food` → `www` → 404.

İstediğimiz:

- Asıl site: **`bonvera.food`**
- `www` → **`bonvera.food`’a redirect**

1. Domains’te `www.bonvera.food` varsa düzenle; yoksa ekle.
2. Seçenek: **Redirect to** → `bonvera.food`  
   (Edit / Configure / Redirect gibi bir buton olabilir.)
3. Apex’i (`bonvera.food`) www’ye yönlendirme; tam tersini yap.

### 3c — `admin.bonvera.food` (Studio)

1. **Add Domain** → `admin.bonvera.food`
2. **Production**’a bağla.
3. Redirect yapma (doğrudan uygulamayı servis etsin).
4. **Valid** olsun.

### “Bu domain başka projede” uyarısı

Başka Vercel proje/hesapta tanımlıysa:

1. O projeden domain’i **Remove** et,  
   **veya** Vercel’in transfer / claim akışını tamamla.
2. Sonra `bonvera-studio` projesine tekrar ekle.

Üç domain **aynı** projede (`bonvera-studio`) olmalı.

---

## ADIM 4 — Production env değişkenleri

1. **Settings → Environment Variables**.
2. Environment olarak **Production** seçili olduğundan emin ol.
3. Şunlar dolu olsun (yoksa ekle / düzelt):

| İsim | Değer |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_MARKETING_URL` | `https://bonvera.food` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.bonvera.food` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL’in |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `fr` |
| `NEXT_PUBLIC_FALLBACK_LOCALE` | `fr` |

4. Değiştirdiysen kaydet → **mutlaka Redeploy** (Adım 5).  
   Env değişince eski deploy eski değerlerle kalır.

Detay: [`vercel-env.md`](./vercel-env.md).

---

## ADIM 5 — Yeniden deploy et

1. **Deployments** sekmesine dön.
2. En son **Production / Ready** (veya `main`) deploy’un sağındaki **⋯** menü.
3. **Redeploy** seç.
4. “Use existing Build Cache” varsa ilk denemede kapatabilirsin (isteğe bağlı).
5. Bitiş: tekrar **Ready**.

Redeploy bitmeden domain’leri test etme.

---

## ADIM 6 — Kontrol listesi (başarı)

Incognito / gizli pencerede sırayla dene:

| # | Adres | Beklenen |
|---|--------|----------|
| 1 | Deploy `*.vercel.app` | Bonvera UI — **Vercel Login yok** |
| 2 | https://bonvera.food | Marketing / ana sayfa — **200**, `NOT_FOUND` yok |
| 3 | https://www.bonvera.food | Adres çubuğu **bonvera.food**’a yönlensin |
| 4 | https://admin.bonvera.food/studio | Studio dashboard açılsın |

Hepsi tamamsa P0 bitti.

---

## Hâlâ `NOT_FOUND` ise

Sırayla bak:

1. Domain satırı gerçekten **bu** projede mi (`bonvera-studio`)?
2. Domain **Valid** mi?
3. En son Production deploy **Ready** mi?
4. Protection Production’da kapalı mı?
5. Domain’i **Remove → tekrar Add → Production** dene.
6. Vercel’de domain başka team’de kalmış olabilir — doğru hesapta olduğundan emin ol.

---

## Takılırsan bana şunları gönder

1. Ekran görüntüsü: **Settings → Domains** (tüm satırlar görünür)
2. Ekran görüntüsü: **Settings → Deployment Protection**
3. Ekran görüntüsü: **Deployments** (en üst Ready/Failed satırı)
4. Private pencerede `*.vercel.app` açınca ne gördüğün (Login mi, Bonvera mı, 404 mü)
