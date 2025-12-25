// Chatbot functionality
const chatbotResponses = {
    tr: {
        greeting: "Merhaba! Nasıl yardımcı olabilirim?",
        menu: "Ürünlerimiz 3 kategoriye ayrılmıştır:\n1. Mezeler\n2. Sarmalar\n3. İçli Köfte\n\nHangi kategori hakkında bilgi almak istersiniz?",
        mezeler: "Mezelerimiz arasında cacık, ezme, humus, fava, tarator ve daha fazlası bulunmaktadır. Tüm mezelerimiz günlük taze üretimdir.",
        sarmalar: "Sarmalarımız: Yaprak sarma, kabak sarma ve patlıcan sarma. Geleneksel tariflerle hazırlanmaktadır.",
        icli_kofte: "İçli köfte çeşitlerimiz: Kızarmış içli köfte ve çiğ içli köfte. Her ikisi de geleneksel tariflerle hazırlanır.",
        contact: "Bizimle iletişime geçmek için WhatsApp kullanabilirsiniz. Sayfanın üst kısmındaki WhatsApp ikonuna tıklayın.",
        location: "Strasbourg, Fransa'da bulunuyoruz. Günlük taze üretim yapıyoruz.",
        price: "Fiyat bilgisi için lütfen WhatsApp üzerinden bizimle iletişime geçin.",
        order: "Sipariş vermek için WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
        default: "Anladım. Daha fazla bilgi için WhatsApp üzerinden bizimle iletişime geçebilirsiniz."
    },
    fr: {
        greeting: "Bonjour ! Comment puis-je vous aider ?",
        menu: "Nos produits sont divisés en 3 catégories :\n1. Mezzés\n2. Sarmalar\n3. İçli Köfte\n\nQuelle catégorie souhaitez-vous connaître ?",
        mezeler: "Parmi nos mezzés, vous trouverez cacık, ezme, hummus, fava, tarator et bien plus encore. Tous nos mezzés sont préparés frais quotidiennement.",
        sarmalar: "Nos sarmalar : Sarma aux feuilles de vigne, sarma aux courgettes et sarma aux aubergines. Tous préparés selon des recettes traditionnelles.",
        icli_kofte: "Nos variétés d'İçli Köfte : İçli köfte frit et içli köfte cru. Les deux sont préparés selon des recettes traditionnelles.",
        contact: "Vous pouvez nous contacter via WhatsApp. Cliquez sur l'icône WhatsApp en haut de la page.",
        location: "Nous sommes situés à Strasbourg, France. Nous produisons frais quotidiennement.",
        price: "Pour les informations sur les prix, veuillez nous contacter via WhatsApp.",
        order: "Vous pouvez nous contacter via WhatsApp pour passer une commande.",
        default: "Je comprends. Vous pouvez nous contacter via WhatsApp pour plus d'informations."
    }
};

let chatHistory = [];
let isChatbotOpen = false;
let notificationTimer = null;
let hasShownNotification = false;

document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotBadge = document.getElementById('chatbot-badge');
    
    // Auto-open chatbot after 20 seconds
    setTimeout(() => {
        if (!isChatbotOpen) {
            openChatbot();
        }
    }, 20000);
    
    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        if (isChatbotOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        closeChatbot();
    });
    
    // Send message on button click
    chatbotSend.addEventListener('click', () => {
        sendMessage();
    });
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function openChatbot() {
        chatbot.classList.add('active');
        chatbotToggle.classList.add('hidden');
        isChatbotOpen = true;
        chatbotInput.focus();
        hideBadge();
        
        // Clear any pending notification timer
        if (notificationTimer) {
            clearTimeout(notificationTimer);
            notificationTimer = null;
        }
    }
    
    function closeChatbot() {
        chatbot.classList.remove('active');
        chatbotToggle.classList.remove('hidden');
        isChatbotOpen = false;
        
        // Show badge after 30 seconds
        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }
        
        notificationTimer = setTimeout(() => {
            if (!isChatbotOpen) {
                showBadge();
            }
        }, 30000); // 30 seconds
    }
    
    function showBadge() {
        if (chatbotBadge) {
            chatbotBadge.classList.add('active');
        }
    }
    
    function hideBadge() {
        if (chatbotBadge) {
            chatbotBadge.classList.remove('active');
        }
    }
    
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Get response
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response, 'bot');
            
            // Add to chat history
            chatHistory.push({ user: message, bot: response });
            
            // After 3+ messages, suggest WhatsApp redirect
            if (chatHistory.length >= 3) {
                setTimeout(() => {
                    const lang = window.getCurrentLang ? window.getCurrentLang() : 'tr';
                    const redirectMessage = lang === 'fr' 
                        ? "Pour plus d'informations ou pour passer une commande, contactez-nous sur WhatsApp !"
                        : "Daha fazla bilgi veya sipariş vermek için WhatsApp üzerinden bizimle iletişime geçin!";
                    addMessage(redirectMessage, 'bot');
                    
                    setTimeout(() => {
                        redirectToWhatsApp();
                    }, 2000);
                }, 1000);
            }
        }, 500);
    }
    
    function addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function getResponse(message) {
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'tr';
        const responses = chatbotResponses[lang] || chatbotResponses.tr;
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords
        if (lowerMessage.includes('menü') || lowerMessage.includes('menu') || lowerMessage.includes('ürün') || lowerMessage.includes('produit')) {
            return responses.menu;
        }
        if (lowerMessage.includes('meze') || lowerMessage.includes('mezze')) {
            return responses.mezeler;
        }
        if (lowerMessage.includes('sarma')) {
            return responses.sarmalar;
        }
        if (lowerMessage.includes('içli') || lowerMessage.includes('icli') || lowerMessage.includes('köfte') || lowerMessage.includes('kofte')) {
            return responses.icli_kofte;
        }
        if (lowerMessage.includes('iletişim') || lowerMessage.includes('contact') || lowerMessage.includes('whatsapp')) {
            return responses.contact;
        }
        if (lowerMessage.includes('konum') || lowerMessage.includes('location') || lowerMessage.includes('strasbourg')) {
            return responses.location;
        }
        if (lowerMessage.includes('fiyat') || lowerMessage.includes('prix') || lowerMessage.includes('price')) {
            return responses.price;
        }
        if (lowerMessage.includes('sipariş') || lowerMessage.includes('commande') || lowerMessage.includes('order')) {
            return responses.order;
        }
        
        return responses.default;
    }
    
    // Redirect to WhatsApp after conversation
    window.redirectToWhatsApp = function() {
        const lang = window.getCurrentLang ? window.getCurrentLang() : 'tr';
        let message = lang === 'fr' 
            ? "Bonjour, j'aimerais passer une commande.\n\n" 
            : "Merhaba, sipariş vermek istiyorum.\n\n";
        
        // Add chat history to message
        chatHistory.forEach((chat, index) => {
            message += `${index + 1}. ${chat.user}\n`;
        });
        
        const whatsappNumber = "33749114548";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Close chatbot after redirect
        setTimeout(() => {
            closeChatbot();
        }, 500);
    };
});

