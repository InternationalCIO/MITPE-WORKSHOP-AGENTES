/**
 * OrquestadorAgent - Fase II
 * Agente que maneja smalltalk: saludos, despedidas, agradecimientos
 * y detecta mensajes sin sentido (basura)
 */

const OrquestadorAgent = {
    nombre: "OrquestadorAgent",
    version: "Fase II",
    idioma: "Español",

    // Patrones de reconocimiento
    patrones: {
        saludos: [
            /^hola$/i,
            /^hola[!.,\s]/i,
            /^buenos\s*d[ií]as/i,
            /^buenas\s*tardes/i,
            /^buenas\s*noches/i,
            /^hey$/i,
            /^saludos/i,
            /^qu[eé]\s*tal/i,
            /^c[oó]mo\s*est[aá]s/i,
            /^c[oó]mo\s*va/i,
            /^buen\s*d[ií]a/i
        ],
        despedidas: [
            /^adi[oó]s/i,
            /^hasta\s*luego/i,
            /^hasta\s*pronto/i,
            /^hasta\s*ma[nñ]ana/i,
            /^chao/i,
            /^chau/i,
            /^nos\s*vemos/i,
            /^bye/i,
            /^cu[ií]date/i,
            /^buenas\s*noches.*descansar/i,
            /^me\s*voy/i,
            /^hasta\s*la\s*pr[oó]xima/i
        ],
        agradecimientos: [
            /gracias/i,
            /muchas\s*gracias/i,
            /te\s*lo\s*agradezco/i,
            /agradecido/i,
            /agradecida/i,
            /muy\s*amable/i,
            /eres\s*(un\s*)?crack/i,
            /genial/i,
            /excelente/i,
            /perfecto/i,
            /incre[ií]ble/i,
            /fant[aá]stico/i,
            /buen\s*trabajo/i,
            /bien\s*hecho/i
        ]
    },

    // Respuestas variadas
    respuestas: {
        saludos: [
            "¡Hola! ¿En qué puedo ayudarte hoy?",
            "¡Buenos días! Es un placer saludarte.",
            "¡Hola! Bienvenido al programa de IA Agéntica del MIT.",
            "¡Saludos! ¿Cómo puedo asistirte?"
        ],
        despedidas: [
            "¡Hasta pronto! Fue un placer ayudarte.",
            "¡Adiós! Que tengas un excelente día.",
            "¡Nos vemos! Recuerda aprovechar el programa al 100%.",
            "¡Hasta luego! Aquí estaré cuando me necesites."
        ],
        agradecimientos: [
            "¡De nada! Es un placer poder ayudar.",
            "¡No hay de qué! Para eso estamos.",
            "¡Me alegra haber sido de ayuda!",
            "¡Gracias a ti por participar en este programa!"
        ],
        basura: [
            "He detectado un mensaje que no tiene sentido. ¿Podrías reformular tu pregunta?",
            "Parece que el mensaje contiene texto sin sentido. ¿Puedes escribirlo de otra forma?",
            "No he podido entender ese mensaje. ¿Podrías intentarlo de nuevo?"
        ],
        noImplementado: [
            "En esta Fase II solo estoy programado para responder a saludos, despedidas y agradecimientos. ¡Espera a la Fase III para más funcionalidades!",
            "Esa pregunta aún no puedo responderla. En la Fase III tendré más capacidades. ¡Paciencia!",
            "Interesante pregunta, pero en esta fase solo manejo smalltalk. ¡En la Fase III podré ayudarte con eso!"
        ]
    },

    // Mensaje de bienvenida
    getMensajeBienvenida: function() {
        return `¡Hola! Soy <strong>${this.nombre}</strong>, tu asistente virtual.

<strong>Versión:</strong> ${this.version}
<strong>Idioma:</strong> ${this.idioma}

<strong>¿Qué puedo hacer?</strong>
En esta fase puedo:
• Responder a saludos y despedidas
• Aceptar agradecimientos y reconocimientos
• Detectar mensajes sin sentido

Escribe algo para comenzar...`;
    },

    // Detectar si es basura (texto sin sentido)
    esBasura: function(texto) {
        const textoLimpio = texto.trim();

        // Muy corto (menos de 2 caracteres)
        if (textoLimpio.length < 2) return true;

        // Solo consonantes repetidas o patrones sin sentido
        const soloConsonantes = /^[bcdfghjklmnpqrstvwxyz]+$/i;
        if (soloConsonantes.test(textoLimpio) && textoLimpio.length > 3) return true;

        // Caracteres repetidos excesivamente
        const repetidos = /(.)\1{4,}/;
        if (repetidos.test(textoLimpio)) return true;

        // Mezcla aleatoria sin vocales (más de 5 caracteres)
        const sinVocales = textoLimpio.replace(/[aeiouáéíóú\s]/gi, '');
        if (sinVocales.length > 5 && sinVocales.length / textoLimpio.length > 0.8) return true;

        // Patrones típicos de teclado aleatorio
        const patronesBasura = /^[asdfghjkl]+$|^[qwertyuiop]+$|^[zxcvbnm]+$/i;
        if (patronesBasura.test(textoLimpio) && textoLimpio.length > 4) return true;

        return false;
    },

    // Obtener respuesta aleatoria de un array
    getRespuestaAleatoria: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Verificar si coincide con algún patrón
    coincideConPatron: function(texto, patrones) {
        return patrones.some(patron => patron.test(texto.trim()));
    },

    // Procesar mensaje del usuario
    procesarMensaje: function(mensaje) {
        const textoLimpio = mensaje.trim();

        // Verificar si es basura
        if (this.esBasura(textoLimpio)) {
            return this.getRespuestaAleatoria(this.respuestas.basura);
        }

        // Verificar saludos
        if (this.coincideConPatron(textoLimpio, this.patrones.saludos)) {
            return this.getRespuestaAleatoria(this.respuestas.saludos);
        }

        // Verificar despedidas
        if (this.coincideConPatron(textoLimpio, this.patrones.despedidas)) {
            return this.getRespuestaAleatoria(this.respuestas.despedidas);
        }

        // Verificar agradecimientos
        if (this.coincideConPatron(textoLimpio, this.patrones.agradecimientos)) {
            return this.getRespuestaAleatoria(this.respuestas.agradecimientos);
        }

        // No implementado
        return this.getRespuestaAleatoria(this.respuestas.noImplementado);
    }
};

// ============================================
// INTERFAZ DEL CHAT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Crear elementos del chat
    const chatHTML = `
        <div id="chat-button" class="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
            </svg>
        </div>
        <div id="chat-container" class="chat-container chat-hidden">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">🤖</div>
                    <div>
                        <div class="chat-title">OrquestadorAgent</div>
                        <div class="chat-subtitle">Fase II - Smalltalk</div>
                    </div>
                </div>
                <button id="chat-close" class="chat-close">&times;</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" class="chat-input" placeholder="Escribe un mensaje..." autocomplete="off">
                <button id="chat-send" class="chat-send">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Insertar chat en el body
    const chatWrapper = document.createElement('div');
    chatWrapper.innerHTML = chatHTML;
    document.body.appendChild(chatWrapper);

    // Referencias a elementos
    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    // Estado del chat
    let chatAbierto = false;
    let primerApertura = true;

    // Función para agregar mensaje
    function agregarMensaje(texto, esUsuario = false) {
        const mensaje = document.createElement('div');
        mensaje.className = `chat-message ${esUsuario ? 'chat-message-user' : 'chat-message-agent'}`;
        mensaje.innerHTML = texto;
        chatMessages.appendChild(mensaje);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Abrir/cerrar chat
    function toggleChat() {
        chatAbierto = !chatAbierto;
        chatContainer.classList.toggle('chat-hidden', !chatAbierto);
        chatButton.classList.toggle('chat-button-hidden', chatAbierto);

        if (chatAbierto && primerApertura) {
            agregarMensaje(OrquestadorAgent.getMensajeBienvenida());
            primerApertura = false;
        }

        if (chatAbierto) {
            chatInput.focus();
        }
    }

    // Enviar mensaje
    function enviarMensaje() {
        const texto = chatInput.value.trim();
        if (texto === '') return;

        agregarMensaje(texto, true);
        chatInput.value = '';

        // Simular pequeña demora para parecer más natural
        setTimeout(() => {
            const respuesta = OrquestadorAgent.procesarMensaje(texto);
            agregarMensaje(respuesta);
        }, 300);
    }

    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', enviarMensaje);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });
});
