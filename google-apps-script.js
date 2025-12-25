/**
 * Bonvera Muhasebe - Google Apps Script
 * 
 * Bu script, muhasebe kayıtlarını Google Sheets'e kaydetmek ve çekmek için kullanılır.
 * Her tarih için ayrı bir sheet oluşturur.
 * Fransa saat dilimi (Europe/Paris) kullanılır.
 */

// Ana Sheet ID - Buraya kendi Sheet ID'nizi yazın
const SHEET_ID = '10OOUTbNzDAlYRdiPhoOLibh0yScbeQbtOvsMbxX6ajU';

// Fransa saat dilimi
const TIMEZONE = 'Europe/Paris';

/**
 * Yeni bir kayıt ekler
 * @param {Object} recordData - Kayıt verisi
 * @return {Object} Sonuç objesi
 */
function addRecord(recordData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Fransa tarihine göre bugünün tarihini al
    const today = Utilities.formatDate(
      new Date(),
      TIMEZONE,
      'yyyy-MM-dd'
    );
    
    // Sheet adı: tarih formatı (örn: "2024-01-15")
    const sheetName = today;
    
    // Sheet var mı kontrol et, yoksa oluştur
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = createDailySheet(spreadsheet, sheetName, today);
    }
    
    // Başlık satırı var mı kontrol et
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      // Başlık satırını ekle
      sheet.appendRow([
        'Saat',
        'İşlem Türü',
        'Tutar (€)',
        'Kategori',
        'Açıklama',
        'Kayıt Tarihi'
      ]);
      
      // Başlık satırını formatla
      const headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#FFB366');
      headerRange.setFontColor('#FFFFFF');
    }
    
    // Fransa saatine göre şu anki saat
    const now = Utilities.formatDate(
      new Date(),
      TIMEZONE,
      'HH:mm:ss'
    );
    
    const recordDate = Utilities.formatDate(
      new Date(recordData.date),
      TIMEZONE,
      'yyyy-MM-dd'
    );
    
    // Kaydı ekle
    sheet.appendRow([
      now, // Saat
      recordData.type === 'gelir' ? 'Gelir' : 'Gider', // İşlem Türü
      recordData.amount, // Tutar
      recordData.category || '', // Kategori
      recordData.description || '', // Açıklama
      recordDate // Kayıt Tarihi
    ]);
    
    // Son eklenen satırı formatla
    const newRow = sheet.getLastRow();
    const typeCell = sheet.getRange(newRow, 2);
    
    if (recordData.type === 'gelir') {
      typeCell.setBackground('#25D366');
      typeCell.setFontColor('#FFFFFF');
    } else {
      typeCell.setBackground('#FF4444');
      typeCell.setFontColor('#FFFFFF');
    }
    
    // Tutar sütununu sayı formatına çevir
    sheet.getRange(newRow, 3).setNumberFormat('#,##0.00" €"');
    
    // Otomatik genişlik ayarla
    sheet.autoResizeColumns(1, 6);
    
    return {
      success: true,
      message: 'Kayıt başarıyla eklendi',
      sheetName: sheetName,
      row: newRow
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Hata: ' + error.toString()
    };
  }
}

/**
 * Günlük sheet oluşturur
 * @param {Spreadsheet} spreadsheet - Spreadsheet objesi
 * @param {String} sheetName - Sheet adı
 * @param {String} date - Tarih
 * @return {Sheet} Oluşturulan sheet
 */
function createDailySheet(spreadsheet, sheetName, date) {
  const sheet = spreadsheet.insertSheet(sheetName);
  
  // Sheet'i formatla
  sheet.setTabColor('#FFB366');
  
  // Tarih bilgisini sheet'in üst kısmına ekle
  sheet.getRange('A1').setValue('Tarih: ' + formatTurkishDate(date));
  sheet.getRange('A1').setFontSize(14);
  sheet.getRange('A1').setFontWeight('bold');
  sheet.getRange('A1').setFontColor('#2C1810');
  
  // İlk satırı boş bırak (başlık için)
  sheet.insertRowAfter(1);
  
  return sheet;
}

/**
 * Tarihi Türkçe formatına çevirir
 * @param {String} dateString - Tarih string'i (yyyy-MM-dd)
 * @return {String} Formatlanmış tarih
 */
function formatTurkishDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const day = days[date.getDay()];
  const dayNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayNum} ${month} ${year} (${day})`;
}

/**
 * Belirli bir tarihteki kayıtları getirir
 * @param {String} date - Tarih (yyyy-MM-dd formatında)
 * @return {Array} Kayıtlar array'i
 */
function getRecordsByDate(date) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(date);
    
    if (!sheet) {
      return {
        success: false,
        message: 'Bu tarih için kayıt bulunamadı',
        records: []
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Başlık satırını atla (ilk 3 satır: tarih, boş satır, başlık)
    const records = [];
    for (let i = 3; i < data.length; i++) {
      if (data[i][0]) { // Saat sütunu boş değilse
        records.push({
          saat: data[i][0],
          type: data[i][1],
          amount: data[i][2],
          category: data[i][3],
          description: data[i][4],
          date: data[i][5]
        });
      }
    }
    
    return {
      success: true,
      records: records,
      count: records.length
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Hata: ' + error.toString(),
      records: []
    };
  }
}

/**
 * Bugünkü kayıtları getirir
 * @return {Array} Bugünkü kayıtlar
 */
function getTodayRecords() {
  const today = Utilities.formatDate(
    new Date(),
    TIMEZONE,
    'yyyy-MM-dd'
  );
  return getRecordsByDate(today);
}

/**
 * Tüm sheet'leri listeler
 * @return {Array} Sheet isimleri array'i
 */
function getAllSheets() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    
    return {
      success: true,
      sheets: sheetNames,
      count: sheetNames.length
    };
  } catch (error) {
    return {
      success: false,
      message: 'Hata: ' + error.toString(),
      sheets: []
    };
  }
}

/**
 * Belirli bir tarih aralığındaki kayıtları getirir
 * @param {String} startDate - Başlangıç tarihi (yyyy-MM-dd)
 * @param {String} endDate - Bitiş tarihi (yyyy-MM-dd)
 * @return {Array} Kayıtlar array'i
 */
function getRecordsByDateRange(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allRecords = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = Utilities.formatDate(
        currentDate,
        TIMEZONE,
        'yyyy-MM-dd'
      );
      
      const result = getRecordsByDate(dateString);
      if (result.success && result.records.length > 0) {
        allRecords.push({
          date: dateString,
          records: result.records
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      success: true,
      records: allRecords,
      totalDays: allRecords.length
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Hata: ' + error.toString(),
      records: []
    };
  }
}

/**
 * Toplam gelir ve gideri hesaplar
 * @param {String} date - Tarih (yyyy-MM-dd), boşsa bugün
 * @return {Object} Toplam değerler
 */
function getTotals(date) {
  try {
    const targetDate = date || Utilities.formatDate(
      new Date(),
      TIMEZONE,
      'yyyy-MM-dd'
    );
    
    const result = getRecordsByDate(targetDate);
    
    if (!result.success) {
      return {
        success: false,
        message: result.message,
        totalGelir: 0,
        totalGider: 0,
        net: 0
      };
    }
    
    let totalGelir = 0;
    let totalGider = 0;
    
    result.records.forEach(record => {
      const amount = parseFloat(record.amount) || 0;
      if (record.type === 'Gelir') {
        totalGelir += amount;
      } else if (record.type === 'Gider') {
        totalGider += amount;
      }
    });
    
    return {
      success: true,
      date: targetDate,
      totalGelir: totalGelir,
      totalGider: totalGider,
      net: totalGelir - totalGider,
      recordCount: result.records.length
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Hata: ' + error.toString(),
      totalGelir: 0,
      totalGider: 0,
      net: 0
    };
  }
}

/**
 * Web App olarak kullanım için doGet fonksiyonu
 */
function doGet(e) {
  const action = e.parameter.action;
  
  switch (action) {
    case 'add':
      const recordData = {
        type: e.parameter.type,
        amount: parseFloat(e.parameter.amount),
        date: e.parameter.date,
        category: e.parameter.category || '',
        description: e.parameter.description || ''
      };
      const result = addRecord(recordData);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
      
    case 'getToday':
      const todayRecords = getTodayRecords();
      return ContentService.createTextOutput(JSON.stringify(todayRecords))
        .setMimeType(ContentService.MimeType.JSON);
      
    case 'getByDate':
      const dateRecords = getRecordsByDate(e.parameter.date);
      return ContentService.createTextOutput(JSON.stringify(dateRecords))
        .setMimeType(ContentService.MimeType.JSON);
      
    case 'getTotals':
      const totals = getTotals(e.parameter.date);
      return ContentService.createTextOutput(JSON.stringify(totals))
        .setMimeType(ContentService.MimeType.JSON);
      
    case 'getAllSheets':
      const sheets = getAllSheets();
      return ContentService.createTextOutput(JSON.stringify(sheets))
        .setMimeType(ContentService.MimeType.JSON);
      
    default:
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Geçersiz action parametresi'
      })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Web App olarak kullanım için doPost fonksiyonu
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'add':
        const result = addRecord(data.record);
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
        
      case 'getByDate':
        const dateRecords = getRecordsByDate(data.date);
        return ContentService.createTextOutput(JSON.stringify(dateRecords))
          .setMimeType(ContentService.MimeType.JSON);
        
      case 'getTotals':
        const totals = getTotals(data.date);
        return ContentService.createTextOutput(JSON.stringify(totals))
          .setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Geçersiz action parametresi'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Hata: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

