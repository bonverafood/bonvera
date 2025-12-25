# Google Apps Script Kurulum Rehberi

## Adım 1: Google Apps Script'e Kod Ekleme

1. Google Sheets sayfanızı açın: https://docs.google.com/spreadsheets/d/10OOUTbNzDAlYRdiPhoOLibh0yScbeQbtOvsMbxX6ajU/edit

2. Üst menüden **Extensions** > **Apps Script** seçeneğine tıklayın

3. Açılan script editöründe, varsayılan `myFunction` kodunu silin

4. `google-apps-script.js` dosyasındaki tüm kodu kopyalayıp yapıştırın

5. **SHEET_ID** değişkenini kontrol edin (zaten doğru görünüyor)

6. Dosyayı kaydedin (Ctrl+S veya Cmd+S)

## Adım 2: Web App Olarak Yayınlama

1. Script editöründe üst menüden **Deploy** > **New deployment** seçeneğine tıklayın

2. **Select type** kısmında **Web app** seçeneğini seçin

3. Aşağıdaki ayarları yapın:
   - **Description**: "Bonvera Muhasebe API" (veya istediğiniz bir açıklama)
   - **Execute as**: "Me" (Ben)
   - **Who has access**: "Anyone" (Herkes) - Bu önemli!

4. **Deploy** butonuna tıklayın

5. İlk kez deploy ediyorsanız, Google'dan izin isteyecek:
   - **Authorize access** butonuna tıklayın
   - Google hesabınızı seçin
   - **Advanced** > **Go to [Project Name] (unsafe)** tıklayın
   - **Allow** butonuna tıklayın

6. Deployment tamamlandıktan sonra bir **Web App URL** alacaksınız. Bu URL'yi kopyalayın.

   Örnek format: `https://script.google.com/macros/s/AKfycby.../exec`

## Adım 3: Muhasebe.html'i Güncelleme

1. `muhasebe.html` dosyasını açın

2. JavaScript kısmında `GOOGLE_SHEETS_WEB_APP_URL` değişkenini bulun

3. Bu değişkene, Adım 2'de aldığınız Web App URL'yi yapıştırın

4. Dosyayı kaydedin

## Kullanım

Artık muhasebe.html sayfasından kayıt yaptığınızda:
- Kayıtlar hem LocalStorage'da hem de Google Sheets'te saklanacak
- Her tarih için otomatik olarak yeni bir sheet oluşturulacak
- Fransa saat dilimi (Europe/Paris) kullanılacak
- Kayıtlar gerçek zamanlı olarak Google Sheets'e eklenecek

## Fonksiyonlar

### addRecord(recordData)
Yeni bir kayıt ekler.

**Parametreler:**
```javascript
{
  type: 'gelir' veya 'gider',
  amount: 100.50,
  date: '2024-01-15',
  category: 'malzeme',
  description: 'Açıklama'
}
```

### getTodayRecords()
Bugünkü kayıtları getirir.

### getRecordsByDate(date)
Belirli bir tarihteki kayıtları getirir.

**Parametre:** `date` - 'yyyy-MM-dd' formatında tarih

### getTotals(date)
Belirli bir tarih için toplam gelir, gider ve net tutarı hesaplar.

**Parametre:** `date` - 'yyyy-MM-dd' formatında tarih (opsiyonel, boşsa bugün)

### getAllSheets()
Tüm sheet'leri listeler.

## API Kullanımı (Web App URL ile)

### Kayıt Ekleme (GET)
```
https://your-web-app-url/exec?action=add&type=gelir&amount=100&date=2024-01-15&category=malzeme&description=Test
```

### Bugünkü Kayıtları Getirme (GET)
```
https://your-web-app-url/exec?action=getToday
```

### Tarihe Göre Kayıt Getirme (GET)
```
https://your-web-app-url/exec?action=getByDate&date=2024-01-15
```

### Toplamları Getirme (GET)
```
https://your-web-app-url/exec?action=getTotals&date=2024-01-15
```

### Tüm Sheet'leri Listeleme (GET)
```
https://your-web-app-url/exec?action=getAllSheets
```

### Kayıt Ekleme (POST - JSON)
```javascript
fetch('https://your-web-app-url/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'add',
    record: {
      type: 'gelir',
      amount: 100,
      date: '2024-01-15',
      category: 'malzeme',
      description: 'Test açıklama'
    }
  })
})
```

## Notlar

- Fransa saat dilimi (Europe/Paris) otomatik olarak kullanılır
- Her tarih için yeni bir sheet oluşturulur (format: yyyy-MM-dd)
- Sheet'ler otomatik olarak formatlanır (renkler, genişlikler)
- Başlık satırı otomatik olarak eklenir
- Gelir kayıtları yeşil, gider kayıtları kırmızı renkte gösterilir

