# Cipher-Ops-Simulator

Step into a fictional security team and balance analysis, defense, secure engineering, and authorized red team exercises across a tense seven-day sprint.

Ahora es **jugable**: un juego web de mini-retos de cifrado. Cada día atiendes
incidentes cuyo mensaje está cifrado (César, Atbash, Base64, Hex, Binario,
Morse, Vigenère, XOR y capas combinadas). Descífralos para ganar puntos,
reputación y tu rango final. Las pistas y los errores gastan energía.

El diseño es **responsive**: se adapta a móvil, tablet y escritorio (HUD fijo,
botones grandes para el dedo, sin zoom involuntario).

## Jugar online (GitHub Pages)

Activación única (un clic, solo el dueño del repo puede hacerlo):

1. Ve a **Settings → Pages** del repositorio.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. Selecciona la rama `claude/cipher-ops-simulador-playable-1ihqcl` y la carpeta
   `/ (root)`. Pulsa **Save**.
4. Espera ~1 min. El juego quedará publicado en:
   **https://juanjose910.github.io/Cipher-Ops-Simulator/**

## Jugar sin publicar (local)

No necesita instalación ni dependencias:

1. **Abrir directamente:** descarga el repo y abre `index.html` en tu navegador.
2. **Servidor local** (recomendado):

   ```bash
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
