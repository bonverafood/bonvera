// Language Switcher
const translations = {
    tr: {
        mezeler: "Mezeler",
        sarmalar: "Sarmalar",
        icli_kofte: "İçli Köfte",
        hakkimizda: "Hakkımızda",
        iletisim: "İletişim",
        hero_title: "Strasbourg'da Taze Türk Mezeleri",
        hero_subtitle: "Günlük taze üretim ile hazırlanan geleneksel lezzetler",
        about_text: "Bonvera, mezeleri ve ev yemeklerini günlük taze üretim anlayışıyla sizlere ulaştıran, sade ve hızlı bir sipariş deneyimi sunmak için kurulmuş kapalı devre bir mutfak-teknoloji girişimidir.",
        feature1_title: "Strasbourg'da Günlük Üretim",
        feature1_desc: "Lezzetlerimizin kalbi, Avrupa'nın çok kültürlü gastronomi merkezlerinden Strasbourg'da atıyor. Her bir ürünümüz günlük ve taze olarak hazırlanır.",
        feature2_title: "Türk Mutfağının Gizli Tarifleri",
        feature2_desc: "Nesilden nesile aktarılan Türk mutfağının gizli tarifleri ile hazırladığımız mezelerimiz, geleneksel lezzetleri modern hijyen standartlarıyla buluşturur.",
        feature3_title: "Taze Sebzeler ve Kaliteli Malzemeler",
        feature3_desc: "Üretimimizde taze sebzeler ve doğal malzemeler kullanırız. Hiçbir koruyucu madde kullanmadan, sadece doğal yöntemlerle hazırlanan ürünlerimiz.",
        location: "Konum: Strasbourg, France",
        email: "E-posta: bonvera.food@gmail.com",
        whatsapp: "WhatsApp ile İletişime Geç",
        copyright: "© 2024 Bonvera - Tüm hakları saklıdır",
        chatbot_title: "Bonvera",
        chatbot_greeting: "Merhaba! Nasıl yardımcı olabilirim?",
        chatbot_placeholder: "Mesajınızı yazın...",
        notification_message: "Yeni mesajınız var!"
    },
    fr: {
        mezeler: "Mezzés",
        sarmalar: "Sarmalar",
        icli_kofte: "İçli Köfte",
        hakkimizda: "À Propos",
        iletisim: "Contact",
        hero_title: "Mezzés Turcs Frais à Strasbourg",
        hero_subtitle: "Saveurs traditionnelles préparées avec une production fraîche quotidienne",
        about_text: "Bonvera est une startup technologique culinaire en circuit fermé établie pour vous fournir des mezzés et des plats maison avec une approche de production fraîche quotidienne, offrant une expérience de commande simple et rapide.",
        feature1_title: "Production Quotidienne à Strasbourg",
        feature1_desc: "Le cœur de nos saveurs bat à Strasbourg, l'un des centres gastronomiques multiculturels de l'Europe. Chacun de nos produits est préparé quotidiennement et frais.",
        feature2_title: "Recettes Secrètes de la Cuisine Turque",
        feature2_desc: "Nos mezzés préparés avec les recettes secrètes de la cuisine turque transmises de génération en génération réunissent les saveurs traditionnelles avec les standards d'hygiène modernes.",
        feature3_title: "Légumes Frais et Ingrédients de Qualité",
        feature3_desc: "Nous utilisons des légumes frais et des ingrédients naturels dans notre production. Nos produits préparés uniquement avec des méthodes naturelles sans utiliser de conservateurs.",
        location: "Localisation : Strasbourg, France",
        email: "Email : bonvera.food@gmail.com",
        whatsapp: "Contacter via WhatsApp",
        copyright: "© 2024 Bonvera - Tous droits réservés",
        chatbot_title: "Bonvera",
        chatbot_greeting: "Bonjour ! Comment puis-je vous aider ?",
        chatbot_placeholder: "Tapez votre message...",
        notification_message: "Vous avez un nouveau message !"
    }
};

let currentLang = 'tr';

// Initialize language
document.addEventListener('DOMContentLoaded', () => {
    // Check if language is stored
    const savedLang = localStorage.getItem('bonvera-lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }
    
    // Update UI
    updateLanguage();
    
    // Language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (translations[lang]) {
                currentLang = lang;
                localStorage.setItem('bonvera-lang', lang);
                updateLanguage();
            }
        });
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
});

function updateLanguage() {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translatePlaceholder;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Reload products if function exists
    if (window.loadProducts) {
        setTimeout(() => {
            window.loadProducts();
        }, 100);
    }
}

// Export for use in other scripts
window.getCurrentLang = () => currentLang;
window.getTranslation = (key) => {
    return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key;
};
