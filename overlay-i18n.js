(function () {
  const S = {
    en: {
      walk: "Walk the day", pause: "Pause walk", hour: "+1 hour",
      morningOpen: "Morning open", dayOpen: "Day open", nightOpen: "Night open",
      closed: "Closed", next: "Next office", camera: "Camera", library: "Library",
      desk: "Desk", prev: "Prev", play: "Play", pauseChant: "Pause", nextChant: "Next",
      chantFoot: "Gregorian chant. Sound only.",
      write: "Write", listen: "Listen", log: "Log",
      morning: "Morning", day: "Day", night: "Night"
    },
    pt: {
      walk: "Percorrer o dia", pause: "Pausar", hour: "+1 hora",
      morningOpen: "Manh\u00e3 aberta", dayOpen: "Dia aberto", nightOpen: "Noite aberta",
      closed: "Fechado", next: "Pr\u00f3ximo of\u00edcio", camera: "C\u00e2mera", library: "Galeria",
      desk: "Mesa", prev: "Anterior", play: "Tocar", pauseChant: "Pausar", nextChant: "Pr\u00f3ximo",
      chantFoot: "Canto gregoriano. S\u00f3 o som.",
      write: "Escrever", listen: "Ouvir", log: "Registro",
      morning: "Manh\u00e3", day: "Dia", night: "Noite"
    }
  };

  function langNow() {
    try {
      const stored = localStorage.getItem("noah-lang");
      if (stored === "pt" || stored === "en") return stored;
    } catch (e) {}
    if (typeof lang === "string" && (lang === "pt" || lang === "en")) return lang;
    return (navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  }
  function t(k) {
    const pack = S[langNow()] || S.en;
    return pack[k] || S.en[k] || k;
  }

  function css() {
    let s = document.getElementById("settings-scroll-css");
    if (!s) {
      s = document.createElement("style");
      s.id = "settings-scroll-css";
      document.head.appendChild(s);
    }
    s.textContent =
      "#settingsModal.modal-overlay,#settingsModal.open{align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch}" +
      "#settingsModal .modal-box{max-height:min(92vh,40rem);overflow-y:auto;margin:1.2rem auto 5.5rem;width:min(26rem,calc(100% - 1.6rem))}" +
      ".sleep-row,#noiseSelect,#noisePlay{display:none!important}" +
      "#officeClosed:not([hidden]) #shareClosed{display:none!important}";
  }

  function hushNoise() {
    if (typeof stopNoise === "function") {
      try { stopNoise(); } catch (e) {}
    }
    document.querySelectorAll(".sleep-row").forEach(function (el) {
      el.hidden = true;
    });
  }

  function gateShare() {
    const closed = document.getElementById("officeClosed");
    const shut = !!(closed && !closed.hidden);
    const now = typeof TIMENOW === "function" ? TIMENOW() : null;
    const openPane =
      now && now.open && now.period
        ? now.period === "midday" || now.period === "day"
          ? "day"
          : now.period
        : "";
    const shareClosed = document.getElementById("shareClosed");
    if (shareClosed) shareClosed.hidden = true;
    document.querySelectorAll("[data-share]").forEach(function (b) {
      const pane = b.getAttribute("data-share");
      b.hidden = shut || pane !== openPane;
    });
  }

  function paintNav() {
    const hasListen = !!document.querySelector('.nav-bar button[data-pane="listen"]');
    document.querySelectorAll(".nav-bar button[data-pane]").forEach(function (b) {
      const pane = b.getAttribute("data-pane");
      if (pane === "listen" || pane === "write") {
        b.textContent = t(pane === "write" ? "write" : "listen");
        return;
      }
      if (pane === "log") {
        b.textContent = t("log");
        return;
      }
      if (hasListen && pane === "morning") {
        b.textContent = t("write");
        return;
      }
      if (pane === "morning") b.textContent = t("morning");
      else if (pane === "day") b.textContent = t("day");
      else if (pane === "night") b.textContent = t("night");
    });
  }

  function paint() {
    css();
    hushNoise();
    gateShare();
    paintNav();
    const walk = document.getElementById("railWalk");
    if (walk) walk.textContent = /pause|pausar/i.test(walk.textContent || "") ? t("pause") : t("walk");
    const hour = document.getElementById("railStep");
    if (hour) hour.textContent = t("hour");
    const state = document.getElementById("dayRailState");
    if (state) {
      const raw = (state.textContent || "").toLowerCase();
      if (/morning|manh/.test(raw)) state.textContent = t("morningOpen");
      else if (/day open|dia aberto/.test(raw)) state.textContent = t("dayOpen");
      else if (/night|noite/.test(raw)) state.textContent = t("nightOpen");
      else if (raw) state.textContent = t("closed");
    }
    document.querySelectorAll(".attach-sheet [data-src='camera']").forEach(function (b) { b.textContent = t("camera"); });
    document.querySelectorAll(".attach-sheet [data-src='library']").forEach(function (b) { b.textContent = t("library"); });
    const desk = document.querySelector("#pane-listen .desk h3");
    if (desk) desk.textContent = t("desk");
    const prev = document.getElementById("listenPrev"); if (prev) prev.textContent = t("prev");
    const play = document.getElementById("listenPlay");
    if (play) play.textContent = play.getAttribute("data-playing") === "1" ? t("pauseChant") : t("play");
    const next = document.getElementById("listenNext"); if (next) next.textContent = t("nextChant");
    const foot = document.querySelector("#pane-listen .desk-foot"); if (foot) foot.textContent = t("chantFoot");
    if (typeof applyI18n === "function") applyI18n();
  }

  function boot() {
    paint();
    setInterval(paint, 1500);
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setTimeout(paint, 20); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 160);
})();
