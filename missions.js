/* ============================================================
   Cipher Ops Simulator — guion de la campaña (7 días)
   Cada reto define el TEXTO CLARO (answer) y cómo se cifra para
   mostrarlo. El jugador recupera el texto claro.
   cat: analysis | defense | engineering | redteam
   ============================================================ */
const CAMPAIGN = [
  /* ---------------- DÍA 1 ---------------- */
  {
    day: 1,
    intro: "Primer día en el equipo Cipher Ops. El turno de noche te dejó una cola de alertas sin clasificar. Empieza suave: descifra los mensajes y demuestra que sabes leer entre líneas.",
    challenges: [
      {
        cat: "analysis",
        title: "Cabecera sospechosa",
        type: "César",
        brief: "Un correo de phishing trae un asunto cifrado con César (desplazamiento 3). El SOC quiere saber qué intentaban ocultar.",
        answer: "actualiza tu contrasena",
        build: (p) => Ciphers.caesar(p, 3),
        hints: [
          "Cada letra se desplazó 3 posiciones en el alfabeto.",
          "Para descifrar, retrocede 3: D→A, E→B, F→C...",
        ],
      },
      {
        cat: "defense",
        title: "Regla del firewall",
        type: "César",
        brief: "El log del firewall guarda la acción recomendada cifrada con César (desplazamiento 7). Aplícala.",
        answer: "bloquear el puerto",
        build: (p) => Ciphers.caesar(p, 7),
        hints: [
          "Desplazamiento 7 hacia adelante.",
          "Retrocede 7 posiciones por letra.",
        ],
      },
    ],
  },

  /* ---------------- DÍA 2 ---------------- */
  {
    day: 2,
    intro: "Día 2. Aparecen artefactos codificados en muestras de malware. Ya no basta con desplazar letras: hay que reconocer formatos.",
    challenges: [
      {
        cat: "analysis",
        title: "Cadena embebida",
        type: "Base64",
        brief: "Dentro de un script malicioso hay una cadena en Base64. Decodifícala para ver el comando real.",
        answer: "descarga la carga util",
        build: (p) => Ciphers.toBase64(p),
        hints: [
          "Base64 usa A-Z, a-z, 0-9, + y / y suele terminar en '='.",
          "Puedes decodificarlo mentalmente o reconocer el patrón: es texto ASCII codificado.",
        ],
      },
      {
        cat: "redteam",
        title: "Nota del adversario",
        type: "Atbash",
        brief: "En un ejercicio autorizado de red team, el otro equipo dejó una pista en Atbash (A↔Z, B↔Y...). Léela.",
        answer: "acceso conseguido",
        build: (p) => Ciphers.atbash(p),
        hints: [
          "Atbash invierte el alfabeto: A=Z, B=Y, C=X...",
          "Es su propio inverso: vuelve a aplicarlo para descifrar.",
        ],
      },
    ],
  },

  /* ---------------- DÍA 3 ---------------- */
  {
    day: 3,
    intro: "Día 3. La presión sube. Captura de red y radio: lo que llega son bytes y pulsos, no letras.",
    challenges: [
      {
        cat: "analysis",
        title: "Volcado hexadecimal",
        type: "Hex",
        brief: "Un payload viaja en hexadecimal. Conviértelo a ASCII para leer la orden.",
        answer: "reinicia el servidor",
        build: (p) => Ciphers.toHex(p),
        hints: [
          "Cada par de dígitos hex es un carácter ASCII (ej. 41=A, 61=a).",
          "0x20 es un espacio. Traduce par por par.",
        ],
      },
      {
        cat: "defense",
        title: "Baliza de radio",
        type: "Morse",
        brief: "Una baliza no autorizada emite en Morse. Decodifica su mensaje (palabras separadas por '/').",
        answer: "alerta roja",
        build: (p) => Ciphers.toMorse(p),
        hints: [
          ". = punto corto, - = raya larga. '/' separa palabras.",
          "A=.- L=.-.. E=. R=.-. T=- O=--- J=.--- ...",
        ],
      },
    ],
  },

  /* ---------------- DÍA 4 ---------------- */
  {
    day: 4,
    intro: "Día 4. Ecuador del sprint. Firmware volcado en binario y tráfico con César de desplazamiento desconocido. Hay que pensar.",
    challenges: [
      {
        cat: "engineering",
        title: "Cadena en firmware",
        type: "Binario",
        brief: "Extrajiste una cadena del firmware en binario (8 bits por carácter). Conviértela a texto.",
        answer: "modo seguro activo",
        build: (p) => Ciphers.toBinary(p),
        hints: [
          "Cada grupo de 8 bits es un byte = un carácter ASCII.",
          "01000001 = 65 = 'A'. 00100000 = espacio.",
        ],
      },
      {
        cat: "redteam",
        title: "César de clave oculta",
        type: "César",
        brief: "Mensaje interceptado con César, pero NO te dan el desplazamiento. Encuéntralo por análisis de frecuencia o fuerza bruta.",
        answer: "extraccion al amanecer",
        build: (p) => Ciphers.caesar(p, 13),
        hints: [
          "Prueba los 25 desplazamientos posibles hasta que aparezca texto legible.",
          "Pista: este usa ROT13 (desplazamiento 13).",
        ],
      },
    ],
  },

  /* ---------------- DÍA 5 ---------------- */
  {
    day: 5,
    intro: "Día 5. El adversario sube de nivel: cifrado polialfabético. Te filtraron la clave; úsala con cabeza.",
    challenges: [
      {
        cat: "analysis",
        title: "Vigenère interceptado",
        type: "Vigenère",
        brief: "Mensaje cifrado con Vigenère. Clave recuperada de un volcado de memoria: CLAVE.",
        answer: "punto de encuentro seguro",
        build: (p) => Ciphers.vigenere(p, "CLAVE"),
        hints: [
          "Vigenère: cada letra se desplaza según una letra de la clave (CLAVE), que se repite.",
          "C=desplazar 2, L=11, A=0, V=21, E=4. Réstalo para descifrar.",
        ],
      },
      {
        cat: "defense",
        title: "Parche urgente",
        type: "Vigenère",
        brief: "El equipo de ingeniería cifró la instrucción de despliegue con Vigenère y clave SHIELD.",
        answer: "aplica el parche ya",
        build: (p) => Ciphers.vigenere(p, "SHIELD"),
        hints: [
          "Clave: SHIELD, repetida sobre el texto.",
          "Resta el desplazamiento de cada letra de la clave para recuperar el claro.",
        ],
      },
    ],
  },

  /* ---------------- DÍA 6 ---------------- */
  {
    day: 6,
    intro: "Día 6. Penúltima jornada. Aparece ofuscación XOR y capas combinadas. Mantén la calma.",
    challenges: [
      {
        cat: "engineering",
        title: "Ofuscación XOR",
        type: "XOR (hex)",
        brief: "Configuración ofuscada con XOR de un byte. Clave conocida: 0x2A (42). Salida en hex.",
        answer: "clave maestra rotada",
        build: (p) => Ciphers.xorHex(p, 0x2a),
        hints: [
          "Haz XOR de cada byte hex con 0x2A para recuperar el ASCII.",
          "XOR es reversible: byte ^ 0x2A ^ 0x2A = byte.",
        ],
      },
      {
        cat: "redteam",
        title: "Doble capa",
        type: "Base64 → texto",
        brief: "El implante codifica en Base64 el resultado de un César (desplazamiento 5). Primero decodifica Base64, luego revierte el César.",
        answer: "persistencia eliminada",
        build: (p) => Ciphers.toBase64(Ciphers.caesar(p, 5)),
        hints: [
          "Paso 1: decodifica el Base64 → obtendrás texto cifrado con César 5.",
          "Paso 2: retrocede 5 posiciones cada letra.",
        ],
      },
    ],
  },

  /* ---------------- DÍA 7 ---------------- */
  {
    day: 7,
    intro: "Día 7. Cierre del sprint. El adversario lanza su mensaje final en varias capas. Resuélvelo y asegura la operación.",
    challenges: [
      {
        cat: "analysis",
        title: "Transmisión final",
        type: "Vigenère",
        brief: "Mensaje final del adversario en Vigenère con clave OMEGA. Descífralo para anticipar su jugada.",
        answer: "abortamos la operacion",
        build: (p) => Ciphers.vigenere(p, "OMEGA"),
        hints: [
          "Clave OMEGA repetida sobre el texto.",
          "O=14, M=12, E=4, G=6, A=0. Resta para descifrar.",
        ],
      },
      {
        cat: "defense",
        title: "Confirmación cifrada",
        type: "Hex → César",
        brief: "Tu informe de cierre va en hex sobre un César de desplazamiento 4. Decodifica el hex y luego revierte el César para verificar.",
        answer: "sistemas asegurados",
        build: (p) => Ciphers.toHex(Ciphers.caesar(p, 4)),
        hints: [
          "Paso 1: hex → texto (pares de dígitos a ASCII).",
          "Paso 2: retrocede 4 posiciones cada letra.",
        ],
      },
      {
        cat: "redteam",
        title: "Palabra clave de extracción",
        type: "Atbash → Base64",
        brief: "Última pista: Base64 que envuelve un Atbash. Decodifica Base64 y aplica Atbash para obtener la palabra de extracción.",
        answer: "mision cumplida",
        build: (p) => Ciphers.toBase64(Ciphers.atbash(p)),
        hints: [
          "Paso 1: decodifica el Base64.",
          "Paso 2: aplica Atbash (A↔Z) al resultado.",
        ],
      },
    ],
  },
];
