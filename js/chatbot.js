/* ============================================
   Barbers Elite - Chatbot
   Interactive barbershop assistant
   ============================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '573001234567';
  const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

  // Conversation tree
  const responses = {
    welcome: {
      text: '¡Hola! 👋 Bienvenido a <strong>BARBERS ELITE</strong>. Soy tu asistente virtual. ¿En qué puedo ayudarte?',
      options: [
        { label: '💈 Ver Servicios', action: 'services' },
        { label: '💰 Precios', action: 'prices' },
        { label: '🕐 Horarios', action: 'schedule' },
        { label: '📍 Ubicación', action: 'location' },
        { label: '📅 Reservar Cita', action: 'booking' }
      ]
    },
    services: {
      text: 'Ofrecemos servicios premium de barbería. ¿Cuál te interesa? ✂️',
      options: [
        { label: '✂️ Cortes', action: 'service_cuts' },
        { label: '🧔 Barba', action: 'service_beard' },
        { label: '🧴 Tratamientos', action: 'service_treatments' },
        { label: '✨ Facial', action: 'service_facial' },
        { label: '🛒 Productos', action: 'service_products' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    service_cuts: {
      text: '✂️ <strong>Nuestros Cortes:</strong><br><br>• Corte Clásico — $25.000<br>• Corte + Diseño — $35.000<br>• Estilos Personalizados — $45.000<br>• Corte Infantil — $18.000<br><br>Todos incluyen lavado y styling final.',
      options: [
        { label: '📅 Reservar Corte', action: 'booking_cut' },
        { label: '⬅️ Ver más servicios', action: 'services' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    },
    service_beard: {
      text: '🧔 <strong>Servicios de Barba:</strong><br><br>• Arreglo de Barba — $20.000<br>• Diseño de Barba Premium — $30.000<br>• Barba + Hidratación — $35.000<br>• Afeitado Clásico con Navaja — $25.000<br><br>Usamos productos premium para el cuidado de tu barba.',
      options: [
        { label: '📅 Reservar', action: 'booking_beard' },
        { label: '⬅️ Ver más servicios', action: 'services' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    },
    service_treatments: {
      text: '🧴 <strong>Tratamientos Capilares:</strong><br><br>• Keratina Premium — $80.000<br>• Hidratación Profunda — $45.000<br>• Coloración — $60.000<br>• Tratamiento Anticaída — $50.000<br><br>Resultados visibles desde la primera sesión.',
      options: [
        { label: '📅 Reservar Tratamiento', action: 'booking_treatment' },
        { label: '⬅️ Ver más servicios', action: 'services' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    },
    service_facial: {
      text: '✨ <strong>Servicios Faciales:</strong><br><br>• Exfoliación Facial — $30.000<br>• Mascarilla Premium — $35.000<br>• Limpieza Profunda — $40.000<br>• Cejas (Diseño) — $12.000<br><br>Tu piel merece el mejor cuidado.',
      options: [
        { label: '📅 Reservar', action: 'booking_facial' },
        { label: '⬅️ Ver más servicios', action: 'services' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    },
    service_products: {
      text: '🛒 <strong>Productos Disponibles:</strong><br><br>• Máquinas de corte profesional<br>• Shampoos premium<br>• Minoxidil (tratamiento capilar)<br>• Ceras y pomadas de styling<br>• Aceites para barba<br>• Accesorios profesionales<br><br>¡Todos disponibles para compra!',
      options: [
        { label: '🛒 Comprar por WhatsApp', action: 'buy_products' },
        { label: '⬅️ Ver más servicios', action: 'services' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    },
    prices: {
      text: '💰 <strong>Lista de Precios:</strong><br><br>✂️ Corte Clásico — $25.000<br>✂️ Corte + Diseño — $35.000<br>🧔 Arreglo de Barba — $20.000<br>🧔 Barba Premium — $30.000<br>✨ Exfoliación — $30.000<br>✨ Mascarilla — $35.000<br>👁️ Cejas — $12.000<br>🧴 Keratina — $80.000<br>⭐ Combo VIP — $55.000<br><br>El Combo VIP incluye corte + barba + lavado + facial.',
      options: [
        { label: '📅 Reservar Cita', action: 'booking' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    schedule: {
      text: '🕐 <strong>Horarios de Atención:</strong><br><br>📅 Lunes a Viernes: 9:00 AM - 8:00 PM<br>📅 Sábados: 8:00 AM - 6:00 PM<br>📅 Domingos: 9:00 AM - 3:00 PM<br><br>Te recomendamos reservar con anticipación para garantizar tu espacio.',
      options: [
        { label: '📅 Reservar Cita', action: 'booking' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    location: {
      text: '📍 <strong>Ubicación:</strong><br><br>📌 Calle 85 #15-30, Bogotá<br>📌 Zona T - Chapinero<br><br>🚗 Parqueadero disponible<br>🚇 Cerca a estación de TransMilenio<br><br>¡Te esperamos!',
      options: [
        { label: '🗺️ Ver en Google Maps', action: 'open_maps' },
        { label: '📅 Reservar Cita', action: 'booking' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    booking: {
      text: '📅 ¡Excelente! Para reservar tu cita, te conectaremos con nuestro equipo por WhatsApp. Podrás elegir:<br><br>• Fecha y hora<br>• Barbero de preferencia<br>• Servicio deseado<br><br>¿Listo para reservar?',
      options: [
        { label: '✅ Reservar por WhatsApp', action: 'open_whatsapp_booking' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    booking_cut: {
      text: '¡Perfecto! Te conectaremos por WhatsApp para agendar tu corte. 💈',
      options: [
        { label: '✅ Ir a WhatsApp', action: 'open_whatsapp_cut' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    booking_beard: {
      text: '¡Genial! Te conectaremos por WhatsApp para agendar tu servicio de barba. 🧔',
      options: [
        { label: '✅ Ir a WhatsApp', action: 'open_whatsapp_beard' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    booking_treatment: {
      text: '¡Excelente elección! Te conectaremos por WhatsApp para tu tratamiento. 🧴',
      options: [
        { label: '✅ Ir a WhatsApp', action: 'open_whatsapp_treatment' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    booking_facial: {
      text: '¡Tu piel te lo agradecerá! Te conectaremos por WhatsApp. ✨',
      options: [
        { label: '✅ Ir a WhatsApp', action: 'open_whatsapp_facial' },
        { label: '⬅️ Menú principal', action: 'welcome' }
      ]
    },
    fallback: {
      text: 'No estoy seguro de entender. ¿Puedo ayudarte con algo de lo siguiente?',
      options: [
        { label: '💈 Servicios', action: 'services' },
        { label: '💰 Precios', action: 'prices' },
        { label: '📅 Reservar', action: 'booking' },
        { label: '🏠 Menú principal', action: 'welcome' }
      ]
    }
  };

  // WhatsApp URLs
  const whatsappActions = {
    open_whatsapp_booking: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Me gustaría reservar una cita en BARBERS ELITE. 💈')}`,
    open_whatsapp_cut: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Quiero agendar un corte de cabello. ✂️')}`,
    open_whatsapp_beard: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Quiero agendar un servicio de barba. 🧔')}`,
    open_whatsapp_treatment: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Quiero información sobre tratamientos capilares. 🧴')}`,
    open_whatsapp_facial: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Quiero agendar un tratamiento facial. ✨')}`,
    buy_products: `${WHATSAPP_BASE}?text=${encodeURIComponent('¡Hola! Me interesan sus productos de barbería. 🛒')}`,
    open_maps: null // handled separately
  };

  // DOM elements
  const container = document.querySelector('.chatbot-container');
  if (!container) return;

  const toggle = container.querySelector('.chatbot-toggle');
  const window_ = container.querySelector('.chatbot-window');
  const closeBtn = container.querySelector('.chatbot-close');
  const messagesEl = container.querySelector('.chatbot-messages');
  const inputEl = container.querySelector('.chatbot-input input');
  const sendBtn = container.querySelector('.chatbot-send');

  let isOpen = false;
  let hasGreeted = false;

  // Toggle chatbot
  function toggleChat() {
    isOpen = !isOpen;
    window_.classList.toggle('open', isOpen);
    toggle.innerHTML = isOpen ? '✕' : '💬';

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      setTimeout(() => showTypingThenRespond('welcome'), 500);
    }
  }

  toggle.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Add message to chat
  function addMessage(content, type = 'bot', options = null) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.innerHTML = content;
    messagesEl.appendChild(msg);

    if (options && options.length > 0) {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'chat-options';

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => handleOption(opt));
        optionsDiv.appendChild(btn);
      });

      messagesEl.appendChild(optionsDiv);
    }

    scrollToBottom();
  }

  // Show typing indicator then respond
  function showTypingThenRespond(responseKey) {
    // Disable previous option buttons
    const prevOptions = messagesEl.querySelectorAll('.chat-options');
    prevOptions.forEach(opts => {
      opts.querySelectorAll('.chat-option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'default';
      });
    });

    const typingEl = document.createElement('div');
    typingEl.className = 'chat-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typingEl);
    scrollToBottom();

    const delay = 800 + Math.random() * 600;

    setTimeout(() => {
      typingEl.remove();
      const resp = responses[responseKey] || responses.fallback;
      addMessage(resp.text, 'bot', resp.options);
    }, delay);
  }

  // Handle option click
  function handleOption(opt) {
    // Show user choice
    addMessage(opt.label, 'user');

    // Check if it's a WhatsApp or Maps action
    if (whatsappActions[opt.action]) {
      setTimeout(() => {
        addMessage('¡Te estamos redirigiendo a WhatsApp! 📲', 'bot');
        setTimeout(() => {
          window.open(whatsappActions[opt.action], '_blank');
        }, 500);
      }, 500);
      return;
    }

    if (opt.action === 'open_maps') {
      setTimeout(() => {
        addMessage('¡Abriendo Google Maps! 🗺️', 'bot');
        setTimeout(() => {
          window.open('https://maps.google.com/?q=4.6682,-74.0543', '_blank');
        }, 500);
      }, 500);
      return;
    }

    // Normal conversation flow
    setTimeout(() => showTypingThenRespond(opt.action), 300);
  }

  // Handle text input
  function handleInput() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputEl.value = '';

    // Simple keyword matching
    const lower = text.toLowerCase();
    let responseKey = 'fallback';

    if (lower.includes('corte') || lower.includes('pelo') || lower.includes('cabello')) {
      responseKey = 'service_cuts';
    } else if (lower.includes('barba') || lower.includes('afeit')) {
      responseKey = 'service_beard';
    } else if (lower.includes('tratamiento') || lower.includes('keratina') || lower.includes('hidrata')) {
      responseKey = 'service_treatments';
    } else if (lower.includes('facial') || lower.includes('exfolia') || lower.includes('mascarilla') || lower.includes('ceja')) {
      responseKey = 'service_facial';
    } else if (lower.includes('precio') || lower.includes('cuesta') || lower.includes('valor') || lower.includes('cost')) {
      responseKey = 'prices';
    } else if (lower.includes('horario') || lower.includes('hora') || lower.includes('abierto') || lower.includes('cerr')) {
      responseKey = 'schedule';
    } else if (lower.includes('donde') || lower.includes('ubicaci') || lower.includes('direcci') || lower.includes('mapa')) {
      responseKey = 'location';
    } else if (lower.includes('cita') || lower.includes('reserv') || lower.includes('agenda')) {
      responseKey = 'booking';
    } else if (lower.includes('servicio')) {
      responseKey = 'services';
    } else if (lower.includes('producto') || lower.includes('maquina') || lower.includes('shampoo') || lower.includes('minoxidil')) {
      responseKey = 'service_products';
    } else if (lower.includes('hola') || lower.includes('buenas') || lower.includes('hey') || lower.includes('buenos')) {
      responseKey = 'welcome';
    }

    setTimeout(() => showTypingThenRespond(responseKey), 300);
  }

  sendBtn.addEventListener('click', handleInput);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleInput();
  });

  // Scroll to bottom of messages
  function scrollToBottom() {
    setTimeout(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  // Auto-open hint after 5 seconds
  setTimeout(() => {
    if (!isOpen) {
      toggle.classList.add('pulse-hint');
    }
  }, 5000);

})();
