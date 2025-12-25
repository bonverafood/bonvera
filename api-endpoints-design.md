# BONVERA.FOOD API ENDPOINTS TASARIMI

## Genel Bilgiler
- **Base URL**: `https://api.bonvera.food` (veya VPS üzerinde kurulacak)
- **Authentication**: Bearer Token
- **Content-Type**: `application/json`
- **Response Format**: JSON

## 1. FORM GÖNDERME ENDPOINT'LERİ

### 1.1 Sipariş Formu Gönderme
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "companyName": "Firma Adı",
  "location": "Lokasyon bilgisi",
  "notes": "Notlar",
  "cartData": {
    "mezeler": [
      {
        "id": "cacik",
        "name": "Cacık",
        "quantity": 2,
        "price": 15.00
      }
    ],
    "icliKofte": [
      {
        "id": "kizarmis",
        "name": "Kızarmış İçli Köfte",
        "quantity": 1,
        "price": 25.00
      }
    ],
    "sarma": [
      {
        "id": "yaprak",
        "name": "Yaprak Sarma",
        "quantity": 1,
        "price": 20.00
      }
    ],
    "total": 60.00
  },
  "orderTotal": 60.00,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-2024-001",
  "message": "Sipariş başarıyla alındı",
  "estimatedDelivery": "2024-01-15T12:00:00Z"
}
```

### 1.2 İletişim Formu
```http
POST /api/contact
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "İsim Soyisim",
  "email": "email@example.com",
  "phone": "+33123456789",
  "subject": "Konu",
  "message": "Mesaj içeriği",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "MSG-2024-001",
  "message": "Mesajınız başarıyla gönderildi"
}
```

### 1.3 Newsletter Aboneliği
```http
POST /api/newsletter
Content-Type: application/json
Authorization: Bearer {token}

{
  "email": "email@example.com",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Newsletter aboneliği başarıyla oluşturuldu"
}
```

## 2. ÜRÜN YÖNETİMİ ENDPOINT'LERİ

### 2.1 Tüm Ürünleri Listele
```http
GET /api/products
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "products": {
    "mezeler": [
      {
        "id": "cacik",
        "name": "Cacık",
        "description": "Yoğurt ve rendelenmiş salatalıkla hazırlanan...",
        "price": 15.00,
        "image": "assets/mezeler/cacik.jpg",
        "category": "mezeler",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "icliKofte": [...],
    "sarma": [...]
  }
}
```

### 2.2 Ürün Ekleme
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Yeni Meze",
  "description": "Açıklama",
  "price": 18.00,
  "category": "mezeler",
  "image": "assets/mezeler/yeni-meze.jpg",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "productId": "PROD-2024-001",
  "message": "Ürün başarıyla eklendi"
}
```

### 2.3 Ürün Güncelleme
```http
PUT /api/products/{productId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Güncellenmiş Meze",
  "description": "Yeni açıklama",
  "price": 20.00,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ürün başarıyla güncellendi"
}
```

### 2.4 Ürün Silme
```http
DELETE /api/products/{productId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Ürün başarıyla silindi"
}
```

### 2.5 Ürün Resmi Yükleme
```http
POST /api/products/{productId}/image
Content-Type: multipart/form-data
Authorization: Bearer {token}

File: image.jpg
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "assets/mezeler/yeni-resim.jpg",
  "message": "Resim başarıyla yüklendi"
}
```

## 3. SİPARİŞ YÖNETİMİ ENDPOINT'LERİ

### 3.1 Tüm Siparişleri Listele
```http
GET /api/orders
Authorization: Bearer {token}
Query Parameters:
- page: 1 (optional)
- limit: 20 (optional)
- status: pending|confirmed|delivered|cancelled (optional)
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "orderId": "ORD-2024-001",
      "companyName": "Firma Adı",
      "location": "Lokasyon",
      "status": "pending",
      "total": 60.00,
      "cartData": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "estimatedDelivery": "2024-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 3.2 Sipariş Detayı
```http
GET /api/orders/{orderId}
Authorization: Bearer {token}
```

### 3.3 Sipariş Durumu Güncelleme
```http
PUT /api/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "confirmed",
  "notes": "Sipariş onaylandı"
}
```

## 4. İSTATİSTİK ENDPOINT'LERİ

### 4.1 Dashboard İstatistikleri
```http
GET /api/stats/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 4500.00,
    "pendingOrders": 5,
    "totalProducts": 25,
    "activeProducts": 22,
    "monthlyOrders": 45,
    "monthlyRevenue": 1350.00,
    "topProducts": [
      {
        "productId": "cacik",
        "name": "Cacık",
        "orderCount": 25,
        "revenue": 375.00
      }
    ]
  }
}
```

### 4.2 Sipariş Grafikleri
```http
GET /api/stats/orders-chart
Authorization: Bearer {token}
Query Parameters:
- period: 7d|30d|90d|1y
```

## 5. KATEGORİ YÖNETİMİ

### 5.1 Kategorileri Listele
```http
GET /api/categories
Authorization: Bearer {token}
```

### 5.2 Kategori Ekleme
```http
POST /api/categories
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Yeni Kategori",
  "description": "Kategori açıklaması",
  "isActive": true
}
```

## 6. AUTHENTICATION

### 6.1 Admin Girişi
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "admin",
    "username": "admin",
    "role": "admin"
  }
}
```

### 6.2 Token Yenileme
```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

## 7. HATA YÖNETİMİ

Tüm endpoint'ler için standart hata formatı:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Geçersiz veri formatı",
    "details": [
      {
        "field": "email",
        "message": "Geçerli bir e-posta adresi giriniz"
      }
    ]
  }
}
```

## 8. n8n ENTEGRASYON NOTLARI

### Webhook URL'leri:
- Sipariş Webhook: `https://api.bonvera.food/webhooks/orders`
- İletişim Webhook: `https://api.bonvera.food/webhooks/contact`
- Newsletter Webhook: `https://api.bonvera.food/webhooks/newsletter`

### n8n Workflow Örnekleri:

1. **Sipariş İşleme Workflow'u:**
   - Sipariş geldiğinde e-posta bildirimi
   - WhatsApp/SMS bildirimi
   - Google Sheets'e kayıt
   - Slack bildirimi

2. **Ürün Güncelleme Workflow'u:**
   - Admin panelinden ürün güncellendiğinde
   - Site otomatik güncellenir
   - SEO meta veriler güncellenir
   - Sosyal medya paylaşımı

## 9. GÜVENLİK

- Tüm admin endpoint'leri Bearer Token ile korunmalı
- Rate limiting uygulanmalı
- CORS ayarları yapılmalı
- Input validation zorunlu
- SQL injection koruması
- XSS koruması

## 10. PERFORMANS

- Redis cache kullanımı
- Database indexing
- CDN entegrasyonu
- Image optimization
- API response compression

