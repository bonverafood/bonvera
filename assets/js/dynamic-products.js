// Dynamic Product Loading System
// JSON tabanlı dinamik ürün yükleme sistemi

class DynamicProductLoader {
    constructor() {
        this.currentLanguage = this.detectCurrentLanguage();
        this.productTranslations = {};
        this.productCatalog = [];
        this.init();
    }

    // Detect current language from URL
    detectCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en/')) return 'en';
        if (path.startsWith('/fr/')) return 'fr';
        if (path.startsWith('/de/')) return 'de';
        return 'tr'; // Default to Turkish
    }

    // Initialize the system
    async init() {
        await this.loadProductTranslations();
        await this.loadProductCatalog();
        this.renderProducts();
    }

    // Load product translations from JSON
    async loadProductTranslations() {
        try {
            const response = await fetch('assets/translations/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.productTranslations = data.products;
        } catch (error) {
            console.warn('Failed to load product translations, using fallback:', error);
            // Fallback: create empty translations object
            this.productTranslations = {};
        }
    }

    // Load product catalog (base product data)
    async loadProductCatalog() {
        // Base product catalog with common data
        this.productCatalog = [
            // Mezze
            {
                id: "cacik",
                cat: "meze",
                img: "Mezeler/cacik.jpg"
            },
            {
                id: "ezme",
                cat: "meze",
                img: "Mezeler/ezme.png"
            },
            {
                id: "acili-humus",
                cat: "meze",
                img: "Mezeler/acili-humus.jpg"
            },
            {
                id: "amerikan-salatasi",
                cat: "meze",
                img: "Mezeler/amerikan-salatasi.jpg"
            },
            {
                id: "barbunya-salatasi",
                cat: "meze",
                img: "Mezeler/barbunya-salatasi.jpg"
            },
            {
                id: "domates-kurusu",
                cat: "meze",
                img: "Mezeler/domates-kurusu.jpg"
            },
            {
                id: "fava",
                cat: "meze",
                img: "Mezeler/fava.jpg"
            },
            {
                id: "grek-salatasi",
                cat: "meze",
                img: "Mezeler/grek-salatasi.jpg"
            },
            {
                id: "mantar-salatasi",
                cat: "meze",
                img: "Mezeler/mantar-salatasi.jpg"
            },
            {
                id: "mor-lahana",
                cat: "meze",
                img: "Mezeler/mor-lahana.jpg"
            },
            {
                id: "muammara",
                cat: "meze",
                img: "Mezeler/muammara.jpg"
            },
            {
                id: "muhteber",
                cat: "meze",
                img: "Mezeler/muhteber.jpg"
            },
            {
                id: "pancar-salatasi",
                cat: "meze",
                img: "Mezeler/pancar-salatasi.jpg"
            },
            {
                id: "patlicanli-humus",
                cat: "meze",
                img: "Mezeler/patlicanli-humus.jpg"
            },
            {
                id: "saksuka",
                cat: "meze",
                img: "Mezeler/saksuka.jpg"
            },
            {
                id: "tarator",
                cat: "meze",
                img: "Mezeler/tarator.jpg"
            },
            
            // İçli Köfte
            {
                id: "kizarmis-icli-kofte",
                cat: "icli",
                img: "Icli-Kofte/kizarmis-icli-kofte.jpg"
            },
            {
                id: "cig-icli-kofte",
                cat: "icli",
                img: "Icli-Kofte/cig-icli-kofte.jpg"
            },
            
            // Sarmalar
            {
                id: "yaprak-sarmasi",
                cat: "sarma",
                img: "Sarmalar/yaprak-sarmasi.jpg"
            },
            {
                id: "kabak-sarmasi",
                cat: "sarma",
                img: "Sarmalar/kabak-sarmasi.jpg"
            },
            {
                id: "patlican-sarmasi",
                cat: "sarma",
                img: "Sarmalar/patlican-sarmasi.jpg"
            }
        ];
    }

    // Get translated product data
    getTranslatedProduct(product) {
        const translations = this.productTranslations[product.id];
        if (!translations || !translations[this.currentLanguage]) {
            // Fallback to Turkish if translation not found
            const fallback = translations ? translations['tr'] : null;
            return {
                ...product,
                name: fallback ? fallback.name : product.id,
                desc: fallback ? fallback.description : 'Description not available'
            };
        }

        const translation = translations[this.currentLanguage];
        return {
            ...product,
            name: translation.name,
            desc: translation.description
        };
    }

    // Create product card with translated content
    createProductCard(product) {
        const translatedProduct = this.getTranslatedProduct(product);
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${translatedProduct.img}" alt="${translatedProduct.name}" class="product-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyw7xubGVyIGVrbGVuZWNlazwvdGV4dD48L3N2Zz4='">
            <h3 class="product-name">${translatedProduct.name}</h3>
            <p class="product-desc">${translatedProduct.desc}</p>
            <div class="product-controls">
                <button class="quantity-btn" onclick="dec('${translatedProduct.id}')" aria-label="Miktarı azalt">−</button>
                <span class="quantity-display" id="qty-${translatedProduct.id}">0</span>
                <button class="quantity-btn" onclick="inc('${translatedProduct.id}')" aria-label="Miktarı artır">+</button>
            </div>
        `;
        
        return card;
    }

    // Render products to their respective grids
    renderProducts() {
        const mezelerGrid = document.getElementById('mezelerGrid');
        const icliKofteGrid = document.getElementById('icliKofteGrid');
        const sarmaGrid = document.getElementById('sarmaGrid');

        // Clear existing content
        if (mezelerGrid) mezelerGrid.innerHTML = '';
        if (icliKofteGrid) icliKofteGrid.innerHTML = '';
        if (sarmaGrid) sarmaGrid.innerHTML = '';

        // Render products by category
        this.productCatalog.forEach(product => {
            const productCard = this.createProductCard(product);
            
            if (product.cat === 'meze' && mezelerGrid) {
                mezelerGrid.appendChild(productCard);
            } else if (product.cat === 'icli' && icliKofteGrid) {
                icliKofteGrid.appendChild(productCard);
            } else if (product.cat === 'sarma' && sarmaGrid) {
                sarmaGrid.appendChild(productCard);
            }
        });
    }

    // Change language and re-render
    changeLanguage(newLanguage) {
        this.currentLanguage = newLanguage;
        this.renderProducts();
        
        // Update all quantity displays
        this.productCatalog.forEach(product => {
            const qtyDisplay = document.getElementById(`qty-${product.id}`);
            if (qtyDisplay) {
                const currentQty = window.cart?.get(product.id) || 0;
                qtyDisplay.textContent = currentQty;
            }
        });
    }

    // Get all products for cart functionality
    getAllProducts() {
        return this.productCatalog.map(product => this.getTranslatedProduct(product));
    }

    // Get product by ID
    getProductById(id) {
        const product = this.productCatalog.find(p => p.id === id);
        return product ? this.getTranslatedProduct(product) : null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicProductLoader = new DynamicProductLoader();
});

// Export for global access
window.DynamicProductLoader = DynamicProductLoader;
