/**
 * MatematicasAgente - Fase III
 * Agente especializado en operaciones matemáticas básicas
 * Comandos: /suma, /resta, /multiplicacion, /division
 */

const MatematicasAgente = {
    nombre: "MatematicasAgente",
    version: "Fase III",

    // Comandos disponibles
    comandos: ['suma', 'resta', 'multiplicacion', 'division'],

    // Verificar si es un comando matemático
    esComandoMatematico: function(texto) {
        const textoLimpio = texto.trim().toLowerCase();
        return this.comandos.some(cmd => textoLimpio.startsWith('/' + cmd));
    },

    // Parsear comando y parámetros
    parsearComando: function(texto) {
        const textoLimpio = texto.trim();
        const partes = textoLimpio.split(/\s+/);

        if (partes.length < 3) {
            return { error: true, mensaje: "Faltan parámetros. Uso correcto: /comando numero1 numero2" };
        }

        const comando = partes[0].substring(1).toLowerCase(); // Quitar el /
        const num1 = parseFloat(partes[1]);
        const num2 = parseFloat(partes[2]);

        if (isNaN(num1) || isNaN(num2)) {
            return { error: true, mensaje: "Los parámetros deben ser números válidos." };
        }

        return { error: false, comando, num1, num2 };
    },

    // Ejecutar operación
    ejecutar: function(texto) {
        const parsed = this.parsearComando(texto);

        if (parsed.error) {
            return `⚠️ <strong>Error:</strong> ${parsed.mensaje}`;
        }

        const { comando, num1, num2 } = parsed;
        let resultado;
        let operador;

        switch (comando) {
            case 'suma':
                resultado = num1 + num2;
                operador = '+';
                break;
            case 'resta':
                resultado = num1 - num2;
                operador = '-';
                break;
            case 'multiplicacion':
                resultado = num1 * num2;
                operador = '×';
                break;
            case 'division':
                if (num2 === 0) {
                    return "⚠️ <strong>Error:</strong> No se puede dividir entre cero.";
                }
                resultado = num1 / num2;
                operador = '÷';
                break;
            default:
                return `⚠️ <strong>Error:</strong> Comando '${comando}' no reconocido.`;
        }

        // Formatear resultado (máximo 4 decimales si es necesario)
        const resultadoFormateado = Number.isInteger(resultado) ? resultado : resultado.toFixed(4).replace(/\.?0+$/, '');

        return `🧮 <strong>${num1} ${operador} ${num2} = ${resultadoFormateado}</strong>

<span style="font-size: 0.85rem; color: #666;">Calculado por MatematicasAgente</span>`;
    },

    // Obtener ayuda de comandos
    getAyuda: function() {
        return `<strong>Comandos matemáticos disponibles:</strong>

• <code>/suma 5 3</code> → Suma dos números
• <code>/resta 10 4</code> → Resta dos números
• <code>/multiplicacion 6 7</code> → Multiplica dos números
• <code>/division 20 4</code> → Divide dos números`;
    }
};
