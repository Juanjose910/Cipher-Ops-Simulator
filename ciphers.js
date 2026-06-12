/* ============================================================
   Cipher Ops Simulator — motor de cifrados
   Cada función ENCODE toma un texto claro y produce el reto.
   El jugador debe recuperar el texto claro. Como nosotros
   generamos el cifrado, la respuesta correcta siempre se conoce
   y todo reto es resoluble.
   ============================================================ */
const Ciphers = (() => {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // --- César / ROT ---
  function caesar(text, shift) {
    return text.replace(/[a-z]/gi, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    });
  }

  // --- Atbash (A<->Z) ---
  function atbash(text) {
    return text.replace(/[a-z]/gi, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(base + (25 - (c.charCodeAt(0) - base)));
    });
  }

  // --- Base64 (con soporte UTF-8 básico) ---
  function toBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  // --- Hex ---
  function toHex(text) {
    return Array.from(text)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(" ");
  }

  // --- Binario ---
  function toBinary(text) {
    return Array.from(text)
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  }

  // --- Vigenère ---
  function vigenere(text, key, decrypt = false) {
    let ki = 0;
    const k = key.toUpperCase().replace(/[^A-Z]/g, "");
    return text.replace(/[a-z]/gi, (c) => {
      const base = c <= "Z" ? 65 : 97;
      const shift = k.charCodeAt(ki % k.length) - 65;
      ki++;
      const s = decrypt ? -shift : shift;
      return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26 + 26) % 26 + base);
    });
  }

  // --- XOR con clave de 1 byte, salida hex ---
  function xorHex(text, keyByte) {
    return Array.from(text)
      .map((c) => (c.charCodeAt(0) ^ keyByte).toString(16).padStart(2, "0"))
      .join(" ");
  }

  // --- Morse ---
  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
    O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
    V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
    5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  };
  function toMorse(text) {
    return text.toUpperCase().split("").map((c) => {
      if (c === " ") return "/";
      return MORSE[c] || "";
    }).filter(Boolean).join(" ");
  }

  // Normaliza respuestas para comparar (ignora mayúsculas/espacios extra)
  function normalize(s) {
    return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  return {
    caesar, atbash, toBase64, toHex, toBinary, vigenere, xorHex, toMorse, normalize, A, MORSE,
  };
})();
