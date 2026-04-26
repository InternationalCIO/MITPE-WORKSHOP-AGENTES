/**
 * OrquestadorAgent - Fase IV
 * Agente orquestador que maneja smalltalk, delega operaciones matematicas
 * al MatematicasAgente, y preguntas complejas al ModeloAgente (servidor)
 */

const OrquestadorAgent = {
    nombre: "OrquestadorAgent",
    version: "Fase IV",
    idioma: "Espanol",

    // URL del servidor (Railway en produccion, localhost en desarrollo)
    // IMPORTANTE: Actualizar con la URL de Railway despues del despliegue
    serverURL: "https://mitpe-workshop-agentes-server-production.up.railway.app",

    // Patrones de reconocimiento
    patrones: {
        saludos: [
            /^hola$/i,
            /^hola[!.,\s]/i,
            /^buenos\s*d[ii]as/i,
            /^buenas\s*tardes/i,
            /^buenas\s*noches/i,
            /^hey$/i,
            /^saludos/i,
            /^buen\s*d[ii]a/i
        ],
        estadoBienestar: [
            /^[¿?]*\s*c[oo]mo\s*est[aa]s\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*tal\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*tal\s*est[aa]s\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*tal\s*tu\s*d[ii]a\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*tal\s*todo\s*[¿?]*$/i,
            /^[¿?]*\s*c[oo]mo\s*va\s*[¿?]*$/i,
            /^[¿?]*\s*c[oo]mo\s*te\s*va\s*[¿?]*$/i,
            /^[¿?]*\s*c[oo]mo\s*andas\s*[¿?]*$/i,
            /^[¿?]*\s*c[oo]mo\s*vas\s*[¿?]*$/i,
            /^[¿?]*\s*todo\s*bien\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*hay\s*[¿?]*$/i,
            /^[¿?]*\s*qu[ee]\s*onda\s*[¿?]*$/i,
            /^[¿?]*\s*c[oo]mo\s*lo\s*llevas\s*[¿?]*$/i
        ],
        despedidas: [
            /^adi[oo]s/i,
            /^hasta\s*luego/i,
            /^hasta\s*pronto/i,
            /^hasta\s*ma[nn]ana/i,
            /^chao/i,
            /^chau/i,
            /^nos\s*vemos/i,
            /^bye/i,
            /^cu[ii]date/i,
            /^buenas\s*noches.*descansar/i,
            /^me\s*voy/i,
            /^hasta\s*la\s*pr[oo]xima/i
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
            /incre[ii]ble/i,
            /fant[aa]stico/i,
            /buen\s*trabajo/i,
            /bien\s*hecho/i
        ]
    },

    // Respuestas variadas
    respuestas: {
        saludos: [
            "Hola! En que puedo ayudarte hoy?",
            "Buenos dias! Es un placer saludarte.",
            "Hola! Bienvenido al programa de IA Agentica del MIT.",
            "Saludos! Como puedo asistirte?"
        ],
        estadoBienestar: [
            "Muy bien, gracias por preguntar! Aqui, listo para ayudarte. Y tu que tal?",
            "Excelente! Funcionando al 100%. En que puedo ayudarte?",
            "Todo genial! Como buen agente de IA, siempre de buen humor. Como estas tu?",
            "Perfectamente! Preparado para asistirte en lo que necesites.",
            "De maravilla! Gracias por interesarte. Como va tu dia?"
        ],
        despedidas: [
            "Hasta pronto! Fue un placer ayudarte.",
            "Adios! Que tengas un excelente dia.",
            "Nos vemos! Recuerda aprovechar el programa al 100%.",
            "Hasta luego! Aqui estare cuando me necesites."
        ],
        agradecimientos: [
            "De nada! Es un placer poder ayudar.",
            "No hay de que! Para eso estamos.",
            "Me alegra haber sido de ayuda!",
            "Gracias a ti por participar en este programa!"
        ],
        basura: [
            "He detectado un mensaje que no tiene sentido. Podrias reformular tu pregunta?",
            "Parece que el mensaje contiene texto sin sentido. Puedes escribirlo de otra forma?",
            "No he podido entender ese mensaje. Podrias intentarlo de nuevo?"
        ],
        cargando: [
            "Consultando con el modelo de IA...",
            "Procesando tu pregunta...",
            "Un momento, estoy buscando la informacion..."
        ],
        errorServidor: [
            "Lo siento, no pude conectar con el servidor. Intenta de nuevo en unos segundos.",
            "El servidor no esta disponible en este momento. Por favor, intenta mas tarde.",
            "Hubo un problema de conexion. Puedes intentarlo de nuevo?"
        ]
    },

    // Mensaje de bienvenida
    getMensajeBienvenida: function() {
        return `Hola! Soy <strong>${this.nombre}</strong>, tu asistente virtual.

<strong>Version:</strong> ${this.version}
<strong>Idioma:</strong> ${this.idioma}

<strong>Que puedo hacer?</strong>
En esta fase puedo:
- Responder a saludos y despedidas
- Contestar preguntas como "Como estas?" o "Que tal?"
- Aceptar agradecimientos
- <strong>Operaciones matematicas</strong> (MatematicasAgente):
  <code>/suma 5 3</code>
  <code>/resta 10 4</code>
  <code>/multiplicacion 6 7</code>
  <code>/division 20 4</code>
- <strong>Preguntas sobre participantes</strong> (ModeloAgente + IA):
  Preguntame sobre los participantes del programa!
  Ejemplo: "Quien es de Mexico?" o "Cuentame sobre Fabian"

Escribe algo para comenzar...`;
    },

    // Detectar si es basura (texto sin sentido)
    esBasura: function(texto) {
        const textoLimpio = texto.trim();

        if (textoLimpio.length < 2) return true;

        const soloConsonantes = /^[bcdfghjklmnpqrstvwxyz]+$/i;
        if (soloConsonantes.test(textoLimpio) && textoLimpio.length > 3) return true;

        const repetidos = /(.)\1{4,}/;
        if (repetidos.test(textoLimpio)) return true;

        const sinVocales = textoLimpio.replace(/[aeiouaeiou\s]/gi, '');
        if (sinVocales.length > 5 && sinVocales.length / textoLimpio.length > 0.8) return true;

        const patronesBasura = /^[asdfghjkl]+$|^[qwertyuiop]+$|^[zxcvbnm]+$/i;
        if (patronesBasura.test(textoLimpio) && textoLimpio.length > 4) return true;

        return false;
    },

    getRespuestaAleatoria: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    coincideConPatron: function(texto, patrones) {
        return patrones.some(patron => patron.test(texto.trim()));
    },

    // Verificar si es smalltalk (saludos, despedidas, etc.)
    esSmalltalk: function(texto) {
        const textoLimpio = texto.trim();

        if (this.coincideConPatron(textoLimpio, this.patrones.estadoBienestar)) return true;
        if (this.coincideConPatron(textoLimpio, this.patrones.saludos)) return true;
        if (this.coincideConPatron(textoLimpio, this.patrones.despedidas)) return true;
        if (this.coincideConPatron(textoLimpio, this.patrones.agradecimientos)) return true;

        return false;
    },

    // Procesar mensaje (sincrono para smalltalk y matematicas)
    procesarMensaje: function(mensaje) {
        const textoLimpio = mensaje.trim();

        // Comando matematico -> MatematicasAgente
        if (typeof MatematicasAgente !== 'undefined' && MatematicasAgente.esComandoMatematico(textoLimpio)) {
            return MatematicasAgente.ejecutar(textoLimpio);
        }

        // Basura
        if (!textoLimpio.startsWith('/') && this.esBasura(textoLimpio)) {
            return this.getRespuestaAleatoria(this.respuestas.basura);
        }

        // Estado/bienestar
        if (this.coincideConPatron(textoLimpio, this.patrones.estadoBienestar)) {
            return this.getRespuestaAleatoria(this.respuestas.estadoBienestar);
        }

        // Saludos
        if (this.coincideConPatron(textoLimpio, this.patrones.saludos)) {
            return this.getRespuestaAleatoria(this.respuestas.saludos);
        }

        // Despedidas
        if (this.coincideConPatron(textoLimpio, this.patrones.despedidas)) {
            return this.getRespuestaAleatoria(this.respuestas.despedidas);
        }

        // Agradecimientos
        if (this.coincideConPatron(textoLimpio, this.patrones.agradecimientos)) {
            return this.getRespuestaAleatoria(this.respuestas.agradecimientos);
        }

        // Si no es smalltalk ni matematicas, retornar null para indicar que necesita consulta al servidor
        return null;
    },

    // Consultar al servidor (ModeloAgente) - Asincrono
    consultarServidor: async function(pregunta) {
        try {
            const response = await fetch(`${this.serverURL}/api/pregunta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pregunta: pregunta })
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();

            if (data.exito) {
                let respuestaHTML = `<strong>ModeloAgente:</strong> ${data.respuesta}

<span style="font-size: 0.8rem; color: #888;">Respondido por ${data.agente} usando ${data.modelo}</span>`;

                // Agregar informacion de coste si esta disponible
                if (data.uso) {
                    let cacheInfo = '';
                    if (data.uso.cache && data.uso.cache.activo) {
                        cacheInfo = ` | Cache: Si`;
                        if (data.uso.ahorro) {
                            cacheInfo += ` (ahorro: ${data.uso.ahorro})`;
                        }
                    }
                    respuestaHTML += `
<span style="font-size: 0.75rem; color: #aaa; display: block; margin-top: 0.5rem;">
Tokens: ${data.uso.tokensTotal} | Coste: ${data.uso.costeEstimado}${cacheInfo}
</span>`;
                }

                return respuestaHTML;
            } else {
                return data.respuesta || this.getRespuestaAleatoria(this.respuestas.errorServidor);
            }

        } catch (error) {
            console.error('[OrquestadorAgent] Error consultando servidor:', error);
            return this.getRespuestaAleatoria(this.respuestas.errorServidor);
        }
    }
};

// ============================================
// INTERFAZ DEL CHAT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
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
                        <div class="chat-subtitle">Fase IV - Multiagente + IA</div>
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

    const chatWrapper = document.createElement('div');
    chatWrapper.innerHTML = chatHTML;
    document.body.appendChild(chatWrapper);

    const chatButton = document.getElementById('chat-button');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    let chatAbierto = false;
    let primerApertura = true;
    let procesando = false;

    function agregarMensaje(texto, esUsuario = false, esCargando = false) {
        const mensaje = document.createElement('div');
        mensaje.className = `chat-message ${esUsuario ? 'chat-message-user' : 'chat-message-agent'}`;
        if (esCargando) {
            mensaje.id = 'mensaje-cargando';
            mensaje.innerHTML = `<span class="loading-dots">${texto}</span>`;
        } else {
            mensaje.innerHTML = texto;
        }
        chatMessages.appendChild(mensaje);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return mensaje;
    }

    function eliminarMensajeCargando() {
        const cargando = document.getElementById('mensaje-cargando');
        if (cargando) {
            cargando.remove();
        }
    }

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

    async function enviarMensaje() {
        if (procesando) return;

        const texto = chatInput.value.trim();
        if (texto === '') return;

        agregarMensaje(texto, true);
        chatInput.value = '';

        // Intentar procesar localmente primero
        const respuestaLocal = OrquestadorAgent.procesarMensaje(texto);

        if (respuestaLocal !== null) {
            // Respuesta local (smalltalk o matematicas)
            setTimeout(() => {
                agregarMensaje(respuestaLocal);
            }, 300);
        } else {
            // Necesita consulta al servidor
            procesando = true;
            chatInput.disabled = true;
            chatSend.disabled = true;

            agregarMensaje(OrquestadorAgent.getRespuestaAleatoria(OrquestadorAgent.respuestas.cargando), false, true);

            try {
                const respuestaServidor = await OrquestadorAgent.consultarServidor(texto);
                eliminarMensajeCargando();
                agregarMensaje(respuestaServidor);
            } catch (error) {
                eliminarMensajeCargando();
                agregarMensaje(OrquestadorAgent.getRespuestaAleatoria(OrquestadorAgent.respuestas.errorServidor));
            } finally {
                procesando = false;
                chatInput.disabled = false;
                chatSend.disabled = false;
                chatInput.focus();
            }
        }
    }

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSend.addEventListener('click', enviarMensaje);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });
});
