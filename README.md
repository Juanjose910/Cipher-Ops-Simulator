# Cipher-Ops-Simulator

Step into a fictional security team and balance analysis, defense, secure engineering, and authorized red team exercises across a tense seven-day sprint.

Ahora es **jugable**: un juego web de mini-retos de cifrado. Cada día atiendes
incidentes cuyo mensaje está cifrado (César, Atbash, Base64, Hex, Binario,
Morse, Vigenère, XOR y capas combinadas). Descífralos para ganar puntos,
reputación y tu rango final. Las pistas y los errores gastan energía.

## Cómo jugar

No necesita instalación ni dependencias. Tienes dos opciones:

1. **Abrir directamente:** descarga el repo y abre `index.html` en tu navegador
   (doble clic).
2. **Servidor local** (recomendado, evita restricciones del navegador):

   ```bash
   # con Python instalado:
   python3 -m http.server 8000
   # luego abre http://localhost:8000
   ```

## Contenido

- `index.html` — estructura de la página
- `style.css` — interfaz (tema terminal)
- `ciphers.js` — motor de cifrados (César, Atbash, Base64, Hex, Binario, Morse, Vigenère, XOR)
- `missions.js` — guion de la campaña de 7 días
- `game.js` — bucle de juego, puntuación, energía y rangos

Todo el contenido es ficticio y con fines educativos.
