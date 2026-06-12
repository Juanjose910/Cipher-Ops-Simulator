/* ============================================================
   Cipher Ops Simulator — bucle de juego e interfaz
   ============================================================ */
(() => {
  const screen = document.getElementById("screen");
  const hud = document.getElementById("hud");
  const elDay = document.getElementById("hud-day");
  const elRep = document.getElementById("hud-rep");
  const elScore = document.getElementById("hud-score");
  const elEnergy = document.getElementById("hud-energy-fill");

  const CAT_LABEL = {
    analysis: "ANÁLISIS",
    defense: "DEFENSA",
    engineering: "INGENIERÍA",
    redteam: "RED TEAM",
  };

  const state = {
    dayIndex: 0,
    chalIndex: 0,
    score: 0,
    rep: 0,
    energy: 100,
    log: [], // {day, title, points, solved}
    attempts: 0,
    hintsUsed: 0,
  };

  /* ---------- HUD ---------- */
  function updateHud() {
    elDay.textContent = state.dayIndex + 1;
    elRep.textContent = state.rep;
    elScore.textContent = state.score;
    elEnergy.style.width = state.energy + "%";
    elEnergy.style.background =
      state.energy > 50
        ? "linear-gradient(90deg,#1f8f67,#34e0a1)"
        : state.energy > 20
        ? "linear-gradient(90deg,#6b5a2b,#ffce6b)"
        : "linear-gradient(90deg,#6b2b33,#ff5c6c)";
  }
  function flashHud() {
    hud.classList.add("hud-flash");
    setTimeout(() => hud.classList.remove("hud-flash"), 500);
  }

  /* ---------- Pantallas ---------- */
  function renderTitle() {
    hud.classList.add("hidden");
    screen.innerHTML = `
      <div class="panel center">
        <h1 class="title">CIPHER OPS</h1>
        <p class="subtitle">SIMULATOR · sprint de 7 días</p>
        <p>Te unes a un equipo de seguridad ficticio. Durante una semana intensa
        equilibrarás <span style="color:var(--blue)">análisis</span>,
        <span style="color:var(--accent)">defensa</span>,
        <span style="color:var(--warn)">ingeniería</span> y
        <span style="color:var(--danger)">red team autorizado</span>.</p>
        <p class="muted">Cada incidente esconde un mensaje cifrado. Descífralo para
        ganar puntos y reputación. Las pistas y los errores gastan energía.
        Sobrevive los 7 días y gánate tu rango.</p>
        <div class="briefing" style="text-align:left">
          <strong>Cómo se juega</strong><br/>
          · Lee el informe y observa el texto cifrado.<br/>
          · Escribe el mensaje descifrado (sin tildes; mayúsculas/minúsculas dan igual).<br/>
          · Pulsa <kbd>Enter</kbd> para enviar. Pide pistas si te atascas.
        </div>
        <div class="btn-row" style="justify-content:center">
          <button id="start-btn">▶ EMPEZAR TURNO</button>
        </div>
      </div>`;
    document.getElementById("start-btn").onclick = () => {
      hud.classList.remove("hidden");
      renderDayIntro();
    };
  }

  function renderDayIntro() {
    const day = CAMPAIGN[state.dayIndex];
    state.chalIndex = 0;
    updateHud();
    screen.innerHTML = `
      <div class="panel">
        <span class="tag">DÍA ${day.day} DE 7</span>
        <h2>Parte del día</h2>
        <p>${day.intro}</p>
        <p class="muted">Incidentes en cola: ${day.challenges.length}</p>
        <div class="btn-row">
          <button id="begin-day">ATENDER INCIDENTES →</button>
        </div>
      </div>`;
    document.getElementById("begin-day").onclick = renderChallenge;
  }

  function renderChallenge() {
    const day = CAMPAIGN[state.dayIndex];
    const ch = day.challenges[state.chalIndex];
    const cipherText = ch.build(ch.answer);
    state.attempts = 0;
    state.hintsUsed = 0;

    screen.innerHTML = `
      <div class="panel">
        <div class="toolbar">
          <span class="tag ${ch.cat}">${CAT_LABEL[ch.cat]}</span>
          <span class="attempts">Incidente ${state.chalIndex + 1}/${day.challenges.length} · Día ${day.day}</span>
        </div>
        <h2>${ch.title}</h2>
        <p class="muted">Esquema detectado: <strong style="color:var(--text)">${ch.type}</strong></p>
        <div class="briefing">${ch.brief}</div>
        <div class="cipher-box">
          <span class="cipher-label">MENSAJE INTERCEPTADO</span>${cipherText}
        </div>
        <div class="field">
          <label for="answer">TU DESCIFRADO</label>
          <input type="text" id="answer" autocomplete="off" spellcheck="false" placeholder="escribe el mensaje claro..." />
        </div>
        <div class="btn-row">
          <button id="submit">ENVIAR</button>
          <button id="hint" class="ghost">PEDIR PISTA (−15 pts)</button>
          <button id="skip" class="ghost">RENDIRSE EN ESTE</button>
        </div>
        <div class="feedback" id="fb"></div>
      </div>`;

    const input = document.getElementById("answer");
    const fb = document.getElementById("fb");
    input.focus();

    function showFb(cls, msg) {
      fb.className = "feedback show " + cls;
      fb.innerHTML = msg;
    }

    function solve() {
      const guess = Ciphers.normalize(input.value);
      if (!guess) return;
      state.attempts++;
      if (guess === Ciphers.normalize(ch.answer)) {
        // puntuación: base 100, menos intentos fallidos y pistas
        const penalty = (state.attempts - 1) * 20 + state.hintsUsed * 15;
        const gained = Math.max(20, 100 - penalty);
        state.score += gained;
        state.rep += 5;
        state.energy = Math.min(100, state.energy + 4);
        state.log.push({ day: day.day, title: ch.title, points: gained, solved: true });
        updateHud();
        flashHud();
        showFb(
          "ok",
          `✔ <strong>Correcto.</strong> Mensaje: «${ch.answer}». +${gained} pts · +5 reputación.`
        );
        document.getElementById("submit").disabled = true;
        document.getElementById("hint").disabled = true;
        document.getElementById("skip").disabled = true;
        input.disabled = true;
        const nb = document.createElement("button");
        nb.textContent = "CONTINUAR →";
        nb.onclick = nextChallenge;
        document.querySelector(".btn-row").appendChild(nb);
        nb.focus();
      } else {
        state.energy = Math.max(0, state.energy - 8);
        updateHud();
        if (state.energy <= 0) {
          showFb("bad", "✖ Incorrecto y sin energía. Día agotado...");
          setTimeout(() => endByExhaustion(), 1200);
          return;
        }
        showFb("bad", `✖ Incorrecto. Intento ${state.attempts}. (−8 energía) Sigue probando o pide una pista.`);
        input.select();
      }
    }

    document.getElementById("submit").onclick = solve;
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") solve(); });

    document.getElementById("hint").onclick = () => {
      if (state.hintsUsed >= ch.hints.length) {
        showFb("hint", "No quedan más pistas para este incidente.");
        return;
      }
      const hint = ch.hints[state.hintsUsed];
      state.hintsUsed++;
      state.score = Math.max(0, state.score - 15);
      state.energy = Math.max(0, state.energy - 3);
      updateHud();
      showFb("hint", `💡 Pista ${state.hintsUsed}: ${hint}`);
    };

    document.getElementById("skip").onclick = () => {
      state.rep = Math.max(0, state.rep - 3);
      state.energy = Math.max(0, state.energy - 5);
      state.log.push({ day: day.day, title: ch.title, points: 0, solved: false });
      updateHud();
      showFb("bad", `Te rendiste. La solución era: «${ch.answer}». −3 reputación.`);
      document.getElementById("submit").disabled = true;
      document.getElementById("hint").disabled = true;
      document.getElementById("skip").disabled = true;
      input.disabled = true;
      const nb = document.createElement("button");
      nb.textContent = "CONTINUAR →";
      nb.onclick = nextChallenge;
      document.querySelector(".btn-row").appendChild(nb);
      nb.focus();
    };
  }

  function nextChallenge() {
    const day = CAMPAIGN[state.dayIndex];
    state.chalIndex++;
    if (state.chalIndex < day.challenges.length) {
      renderChallenge();
    } else {
      renderDaySummary();
    }
  }

  function renderDaySummary() {
    const day = CAMPAIGN[state.dayIndex];
    const todays = state.log.filter((l) => l.day === day.day);
    const solved = todays.filter((l) => l.solved).length;
    const pts = todays.reduce((a, l) => a + l.points, 0);
    const last = state.dayIndex === CAMPAIGN.length - 1;
    screen.innerHTML = `
      <div class="panel">
        <span class="tag">RESUMEN · DÍA ${day.day}</span>
        <h2>Cierre de jornada</h2>
        <ul class="day-list">
          ${todays.map((l) => `<li><span>${l.solved ? "✔" : "✖"} ${l.title}</span><span class="${l.points ? "score-pos" : "muted"}">${l.points} pts</span></li>`).join("")}
        </ul>
        <p>Incidentes resueltos: <strong>${solved}/${todays.length}</strong> · Puntos del día: <strong class="score-pos">${pts}</strong></p>
        <p class="muted">Energía restante: ${state.energy}% (descansas y recuperas algo para mañana)</p>
        <div class="btn-row">
          <button id="next-day">${last ? "VER RESULTADO FINAL →" : "DORMIR Y CONTINUAR →"}</button>
        </div>
      </div>`;
    document.getElementById("next-day").onclick = () => {
      if (last) return renderEnding();
      state.dayIndex++;
      state.energy = Math.min(100, state.energy + 25); // descanso nocturno
      renderDayIntro();
    };
  }

  function endByExhaustion() {
    screen.innerHTML = `
      <div class="panel center">
        <h1 class="title" style="color:var(--danger)">TURNO INTERRUMPIDO</h1>
        <p>Te quedaste sin energía a mitad del sprint. El equipo cubre tu puesto,
        pero la operación queda incompleta.</p>
        <p class="muted">Puntuación alcanzada: <strong class="score-pos">${state.score}</strong> · Reputación: ${state.rep}</p>
        <div class="btn-row" style="justify-content:center">
          <button id="retry">REINTENTAR SPRINT</button>
        </div>
      </div>`;
    document.getElementById("retry").onclick = resetGame;
  }

  function renderEnding() {
    const solved = state.log.filter((l) => l.solved).length;
    const total = state.log.length;
    let rank, msg, color;
    if (state.score >= 1000) { rank = "MAESTRO CRIPTÓGRAFO"; color = "var(--accent)"; msg = "Desmantelaste la operación adversaria con precisión quirúrgica. Leyenda del equipo."; }
    else if (state.score >= 750) { rank = "OPERADOR SENIOR"; color = "var(--blue)"; msg = "Sprint sólido. El equipo confía en ti para los incidentes críticos."; }
    else if (state.score >= 450) { rank = "ANALISTA COMPETENTE"; color = "var(--warn)"; msg = "Cumpliste. Con más práctica con cifrados compuestos llegarás lejos."; }
    else { rank = "RECLUTA EN PRÁCTICAS"; color = "var(--danger)"; msg = "Sobreviviste la semana. Repasa los cifrados clásicos y vuelve más fuerte."; }

    hud.classList.add("hidden");
    screen.innerHTML = `
      <div class="panel center">
        <span class="tag">FIN DEL SPRINT · 7 DÍAS</span>
        <h1 class="title">OPERACIÓN CERRADA</h1>
        <div class="rank" style="color:${color}">${rank}</div>
        <p>${msg}</p>
        <ul class="day-list" style="text-align:left">
          <li><span>Puntuación total</span><span class="score-pos">${state.score}</span></li>
          <li><span>Reputación final</span><span style="color:var(--blue)">${state.rep}</span></li>
          <li><span>Incidentes resueltos</span><span>${solved}/${total}</span></li>
          <li><span>Energía restante</span><span>${state.energy}%</span></li>
        </ul>
        <div class="btn-row" style="justify-content:center">
          <button id="again">JUGAR DE NUEVO</button>
        </div>
      </div>`;
    document.getElementById("again").onclick = resetGame;
  }

  function resetGame() {
    state.dayIndex = 0; state.chalIndex = 0; state.score = 0;
    state.rep = 0; state.energy = 100; state.log = [];
    state.attempts = 0; state.hintsUsed = 0;
    renderTitle();
  }

  // arranque
  renderTitle();
})();
