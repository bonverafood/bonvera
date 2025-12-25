// Products data and loading
const productsData = {
    mezeler: [
        {
            id: 'cacik',
            name: { tr: 'Cacık', fr: 'Cacık' },
            description: {
                tr: 'Yoğurt ve rendelenmiş salatalıkla hazırlanan, sarımsak ve nane eklenerek lezzetlendirilmiş serinletici bir meze. Yaz aylarında mükemmel bir başlangıç.',
                fr: 'Un mezzé rafraîchissant préparé avec du yaourt et du concombre râpé, parfumé à l\'ail et à la menthe. Entrée parfaite pour les mois d\'été.'
            },
            image: 'pic/Mezes/cacik.jpg'
        },
        {
            id: 'ezme',
            name: { tr: 'Ezme', fr: 'Ezme' },
            description: {
                tr: 'Domates, biber, soğan ve baharatlarla hazırlanan, acı sevenler için mükemmel bir meze. Zeytinyağı ile harmanlanmış geleneksel lezzet.',
                fr: 'Un mezzé parfait pour les amateurs d\'épices, préparé avec des tomates, des poivrons, des oignons et des épices. Saveur traditionnelle mélangée à l\'huile d\'olive.'
            },
            image: 'pic/Mezes/ezme.png'
        },
        {
            id: 'acili-humus',
            name: { tr: 'Acılı Humus', fr: 'Hummus Épicé' },
            description: {
                tr: 'Nohut, tahin, limon suyu ve zeytinyağı ile hazırlanan, Orta Doğu mutfağının sevilen mezelerinden. Acılı versiyonu ile damaklarda iz bırakan lezzet.',
                fr: 'L\'un des mezzés préférés de la cuisine moyen-orientale, préparé avec des pois chiches, du tahini, du jus de citron et de l\'huile d\'olive. Une saveur qui marque le palais avec sa version épicée.'
            },
            image: 'pic/Mezes/acili-humus.jpg'
        },
        {
            id: 'amerikan-salatasi',
            name: { tr: 'Amerikan Salatası', fr: 'Salade Américaine' },
            description: {
                tr: 'Patates, havuç, bezelye ve mayonez ile hazırlanan, çocukların da sevdiği klasik salata. Renkli ve besleyici bir başlangıç.',
                fr: 'Une salade classique préparée avec des pommes de terre, des carottes, des pois et de la mayonnaise, également appréciée des enfants. Une entrée colorée et nutritive.'
            },
            image: 'pic/Mezes/amerikan-salatasi.jpg'
        },
        {
            id: 'barbunya-salatasi',
            name: { tr: 'Barbunya Salatası', fr: 'Salade de Haricots Borlotti' },
            description: {
                tr: 'Barbunya fasulyesi, soğan, maydanoz ve zeytinyağı ile hazırlanan protein bakımından zengin, doyurucu bir meze. Sağlıklı ve lezzetli.',
                fr: 'Un mezzé riche en protéines et satisfaisant, préparé avec des haricots borlotti, des oignons, du persil et de l\'huile d\'olive. Sain et délicieux.'
            },
            image: 'pic/Mezes/barbunya-salatasi.jpg'
        },
        {
            id: 'domates-kurusu',
            name: { tr: 'Domates Kurusu', fr: 'Tomates Séchées' },
            description: {
                tr: 'Kurutulmuş domates, zeytinyağı ve taze otlarla hazırlanan, yoğun lezzetli ve aromatik bir meze. Akdeniz mutfağının vazgeçilmezi.',
                fr: 'Un mezzé intense et aromatique préparé avec des tomates séchées, de l\'huile d\'olive et des herbes fraîches. Un incontournable de la cuisine méditerranéenne.'
            },
            image: 'pic/Mezes/domates-kurusu.jpg'
        },
        {
            id: 'fava',
            name: { tr: 'Fava', fr: 'Fava' },
            description: {
                tr: 'Ege ve Yunan mutfağıyla özdeşleşen, kuru bakla ile hazırlanan protein bakımından zengin bir meze. Zeytinyağı, limon ve taze otlarla lezzetlendirilmiş.',
                fr: 'Un mezzé riche en protéines identifié à la cuisine égéenne et grecque, préparé avec des fèves séchées. Parfumé à l\'huile d\'olive, au citron et aux herbes fraîches.'
            },
            image: 'pic/Mezes/fava.jpg'
        },
        {
            id: 'grek-salatasi',
            name: { tr: 'Grek Salatası', fr: 'Salade Grecque' },
            description: {
                tr: 'Domates, salatalık, zeytin, soğan ve beyaz peynir ile hazırlanan, Akdeniz mutfağının en sevilen salatalarından. Taze ve sağlıklı.',
                fr: 'L\'une des salades les plus appréciées de la cuisine méditerranéenne, préparée avec des tomates, des concombres, des olives, des oignons et du fromage blanc. Fraîche et saine.'
            },
            image: 'pic/Mezes/grek-salatasi.jpg'
        },
        {
            id: 'mantar-salatasi',
            name: { tr: 'Mantar Salatası', fr: 'Salade de Champignons' },
            description: {
                tr: 'Taze mantar, soğan, maydanoz ve zeytinyağı ile hazırlanan, doğal ve aromatik bir meze. Mantar severlerin favorisi.',
                fr: 'Un mezzé naturel et aromatique préparé avec des champignons frais, des oignons, du persil et de l\'huile d\'olive. Favori des amateurs de champignons.'
            },
            image: 'pic/Mezes/mantar-salatasi.jpg'
        },
        {
            id: 'mor-lahana',
            name: { tr: 'Mor Lahana', fr: 'Chou Rouge' },
            description: {
                tr: 'Mor lahana, havuç, maydanoz ve limon suyu ile hazırlanan, renkli ve vitamin bakımından zengin bir meze. Sağlıklı ve ferah.',
                fr: 'Un mezzé coloré et riche en vitamines, préparé avec du chou rouge, des carottes, du persil et du jus de citron. Sain et rafraîchissant.'
            },
            image: 'pic/Mezes/mor-lahana.jpg'
        },
        {
            id: 'muammara',
            name: { tr: 'Muammara', fr: 'Muammara' },
            description: {
                tr: 'Ceviz, kırmızı biber, ekmek ve zeytinyağı ile hazırlanan, Suriye mutfağından gelen aromatik bir meze. Zengin ve doyurucu lezzet.',
                fr: 'Un mezzé aromatique de la cuisine syrienne, préparé avec des noix, des poivrons rouges, du pain et de l\'huile d\'olive. Saveur riche et satisfaisante.'
            },
            image: 'pic/Mezes/muammara.jpg'
        },
        {
            id: 'muhteber',
            name: { tr: 'Muhteber', fr: 'Muhteber' },
            description: {
                tr: 'Patlıcan, domates, soğan ve baharatlarla hazırlanan, Hatay mutfağından gelen geleneksel bir meze. Zengin aromalı ve doyurucu.',
                fr: 'Un mezzé traditionnel de la cuisine de Hatay, préparé avec des aubergines, des tomates, des oignons et des épices. Aromatique et satisfaisant.'
            },
            image: 'pic/Mezes/muhteber.jpg'
        },
        {
            id: 'pancar-salatasi',
            name: { tr: 'Pancar Salatası', fr: 'Salade de Betterave' },
            description: {
                tr: 'Haşlanmış pancar, ceviz, maydanoz ve zeytinyağı ile hazırlanan, renkli ve besleyici bir meze. Doğal tatlılığı ile öne çıkan lezzet.',
                fr: 'Un mezzé coloré et nutritif préparé avec des betteraves bouillies, des noix, du persil et de l\'huile d\'olive. Une saveur qui se distingue par sa douceur naturelle.'
            },
            image: 'pic/Mezes/pancar-salatasi.jpg'
        },
        {
            id: 'patlicanli-humus',
            name: { tr: 'Patlıcanlı Humus', fr: 'Hummus aux Aubergines' },
            description: {
                tr: 'Klasik humusa köz patlıcan eklenerek hazırlanan, dumanlı aroması ile öne çıkan özel bir meze. Farklı ve lezzetli.',
                fr: 'Un mezzé spécial préparé en ajoutant des aubergines grillées au hummus classique, se distinguant par son arôme fumé. Différent et délicieux.'
            },
            image: 'pic/Mezes/patlicanli-humus.jpg'
        },
        {
            id: 'saksuka',
            name: { tr: 'Şakşuka', fr: 'Şakşuka' },
            description: {
                tr: 'Patlıcan, domates, biber, soğan ve yumurta ile hazırlanan, Türk mutfağının sevilen mezelerinden. Renkli ve doyurucu.',
                fr: 'L\'un des mezzés préférés de la cuisine turque, préparé avec des aubergines, des tomates, des poivrons, des oignons et des œufs. Coloré et satisfaisant.'
            },
            image: 'pic/Mezes/saksuka.jpg'
        },
        {
            id: 'tarator',
            name: { tr: 'Tarator', fr: 'Tarator' },
            description: {
                tr: 'Ceviz, ekmek, sarımsak, zeytinyağı ve limon ile hazırlanan, Balkan mutfağından gelen serinletici bir meze. Yoğun aromalı ve besleyici.',
                fr: 'Un mezzé rafraîchissant de la cuisine balkanique, préparé avec des noix, du pain, de l\'ail, de l\'huile d\'olive et du citron. Intensément aromatique et nutritif.'
            },
            image: 'pic/Mezes/tarator.jpg'
        }
    ],
    sarmalar: [
        {
            id: 'yaprak-sarmasi',
            name: { tr: 'Yaprak Sarma', fr: 'Sarma aux Feuilles de Vigne' },
            description: {
                tr: 'Asma yaprağı, pirinç, soğan ve baharatlarla hazırlanan geleneksel sarma. Türk mutfağının en sevilen lezzetlerinden biri.',
                fr: 'Sarma traditionnel préparé avec des feuilles de vigne, du riz, des oignons et des épices. L\'une des saveurs les plus appréciées de la cuisine turque.'
            },
            image: 'pic/Sarmas/yaprak-sarmasi.jpg'
        },
        {
            id: 'kabak-sarmasi',
            name: { tr: 'Kabak Sarma', fr: 'Sarma aux Courgettes' },
            description: {
                tr: 'Kabak yaprağı, pirinç, soğan ve baharatlarla hazırlanan lezzetli sarma. Hafif ve sağlıklı, yaz aylarında tercih edilen özel lezzet.',
                fr: 'Délicieux sarma préparé avec des feuilles de courgettes, du riz, des oignons et des épices. Léger et sain, une saveur spéciale préférée pendant les mois d\'été.'
            },
            image: 'pic/Sarmas/kabak-sarmasi.jpg'
        },
        {
            id: 'patlican-sarmasi',
            name: { tr: 'Patlıcan Sarma', fr: 'Sarma aux Aubergines' },
            description: {
                tr: 'Patlıcan yaprağı, pirinç, soğan ve baharatlarla hazırlanan özel sarma. Patlıcan severlerin favorisi, aromatik ve lezzetli.',
                fr: 'Sarma spécial préparé avec des feuilles d\'aubergines, du riz, des oignons et des épices. Favori des amateurs d\'aubergines, aromatique et délicieux.'
            },
            image: 'pic/Sarmas/patlican-sarmasi.jpg'
        }
    ],
    'icli-kofte': [
        {
            id: 'kizarmis-icli-kofte',
            name: { tr: 'Kızarmış İçli Köfte', fr: 'İçli Köfte Frit' },
            description: {
                tr: 'Geleneksel tarifle hazırlanan, kızartılarak servis edilen içli köfte. Çıtır dış yapısı ve lezzetli iç harcı ile öne çıkan özel lezzet.',
                fr: 'İçli köfte préparé selon une recette traditionnelle, servi frit. Une saveur spéciale qui se distingue par sa structure extérieure croustillante et sa garniture délicieuse.'
            },
            image: 'pic/Icli-Kofte/kizarmis-icli-kofte.jpg'
        },
        {
            id: 'cig-icli-kofte',
            name: { tr: 'Çiğ İçli Köfte', fr: 'İçli Köfte Cru' },
            description: {
                tr: 'Çiğ olarak servis edilen, geleneksel tarifle hazırlanan içli köfte. Taze ve doğal malzemelerle yapılan, sağlıklı ve lezzetli seçenek.',
                fr: 'İçli köfte préparé selon une recette traditionnelle, servi cru. Une option saine et délicieuse faite avec des ingrédients frais et naturels.'
            },
            image: 'pic/Icli-Kofte/cig-icli-kofte.jpg'
        }
    ]
};

function loadProducts() {
    const lang = window.getCurrentLang ? window.getCurrentLang() : 'tr';
    
    // Load Mezeler
    const mezelerGrid = document.getElementById('mezeler-grid');
    if (mezelerGrid) {
        mezelerGrid.innerHTML = '';
        productsData.mezeler.forEach(product => {
            const card = createProductCard(product, lang);
            mezelerGrid.appendChild(card);
        });
    }
    
    // Load Sarmalar
    const sarmalarGrid = document.getElementById('sarmalar-grid');
    if (sarmalarGrid) {
        sarmalarGrid.innerHTML = '';
        productsData.sarmalar.forEach(product => {
            const card = createProductCard(product, lang);
            sarmalarGrid.appendChild(card);
        });
    }
    
    // Load İçli Köfte
    const icliKofteGrid = document.getElementById('icli-kofte-grid');
    if (icliKofteGrid) {
        icliKofteGrid.innerHTML = '';
        productsData['icli-kofte'].forEach(product => {
            const card = createProductCard(product, lang);
            icliKofteGrid.appendChild(card);
        });
    }
}

function createProductCard(product, lang) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const name = product.name[lang] || product.name.tr;
    const description = product.description[lang] || product.description.tr;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-name">${name}</h3>
            <p class="product-description">${description}</p>
        </div>
    `;
    
    return card;
}

// Reload products when language changes
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Reload when language changes
    const originalUpdateLanguage = window.updateLanguage;
    if (originalUpdateLanguage) {
        window.updateLanguage = function() {
            originalUpdateLanguage();
            loadProducts();
        };
    }
});

// Export for manual reload
window.loadProducts = loadProducts;

