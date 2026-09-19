(function () {
  const S = {
    en: {
      walk: "Walk the day",
      pause: "Pause walk",
      hour: "+1 hour",
      morningOpen: "Morning open",
      dayOpen: "Day open",
      nightOpen: "Night open",
      closed: "Closed",
      next: "Next office",
      camera: "Camera",
      library: "Library",
      desk: "Desk",
      prev: "Prev",
      play: "Play",
      nextChant: "Next",
      chantFoot: "Gregorian chant. YouTube until local files exist.",
      write: "Write",
      listen: "Listen",
      log: "Log",
      morning: "Morning",
      day: "Day",
      night: "Night"
    },
    pt: {
      walk: "Percorrer o dia",
      pause: "Pausar",
      hour: "+1 hora",
      morningOpen: "Manh\u00e3 aberta",
      dayOpen: "Dia aberto",
      nightOpen: "Noite aberta",
      closed: "Fechado",
      next: "Pr\u00f3ximo of\u00edcio",
      camera: "C\u00e2mera",
      library: "Galeria",
      desk: "Mesa",
      prev: "Anterior",
      play: "Tocar",
      nextChant: "Pr\u00f3ximo",
      chantFoot: "Canto gregoriano. YouTube, enquanto n\u00e3o houver arquivos locais.",
      write: "Escrever",
      listen: "Ouvir",
      log: "Registro",
      morning: "Manh\u00e3",
      day: "Dia",
      night: "Noite"
    }
  };

  function langNow() {
    try {
      const stored = localStorage.getItem("noah-lang");
      if (stored === "pt" || stored === "en") return stored;
    } catch (e) {}
    if (typeof lang === "string" && (lang === "pt" || lang === "en")) return lang;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("pt") === 0 ? "pt" : "en";
  }

  function t(k) {
    const pack = S[langNow()] || S.en;
    return pack[k] || S.en[k] || k;
  }

  function css() {
    if (document.getElementById("settings-scroll-css")) return;
    const s = document.createElement("style");
    s.id = "settings-scroll-css";
    s.textContent =
      "#settingsModal.modal-overlay,#settingsModal.open{" +
      "align-items:flex-start;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}" +
      "#settingsModal .modal-box{max-height:min(92vh,40rem);overflow-y:auto;-webkit-overflow-scrolling:touch;margin:1.2rem auto 5.5rem;width:min(26rem,calc(100% - 1.6rem))}";
    document.head.appendChild(s);
  }

  function paintNav() {
    document.querySelectorAll(".nav-bar button[data-pane]").forEach(function (b) {
      const pane = b.getAttribute("data-pane");
      if (pane === "listen") b.textContent = t("listen");
      else if (pane === "log") b.textContent = t("log");
      else if (pane === "morning") b.textContent = t("write");
      else if (pane === "day") b.textContent = t("write");
      else if (pane === "night") b.textContent = t("write");
      else if (pane === "write") b.textContent = t("write");
    });
  }

  function paint() {
    css();
    paintNav();
    const walk = document.getElementById("railWalk");
    if (walk) {
      const pausing = /pause|pausar/i.test(walk.textContent || "");
      walk.textContent = pausing ? t("pause") : t("walk");
    }
    const hour = document.getElementById("railStep");
    if (hour) hour.textContent = t("hour");
    const state = document.getElementById("dayRailState");
    if (state) {
      const raw = (state.textContent || "").toLowerCase();
      if (raw.indexOf("morning") >= 0 || raw.indexOf("manh") >= 0) state.textContent = t("morningOpen");
      else if (raw.indexOf("day open") >= 0 || raw.indexOf("dia aberto") >= 0) state.textContent = t("dayOpen");
      else if (raw.indexOf("night") >= 0 || raw.indexOf("noite") >= 0) state.textContent = t("nightOpen");
      else if (raw) state.textContent = t("closed");
    }
    document.querySelectorAll(".attach-sheet [data-src='camera']").forEach(function (b) {
      b.textContent = t("camera");
    });
    document.querySelectorAll(".attach-sheet [data-src='library']").forEach(function (b) {
      b.textContent = t("library");
    });
    const desk = document.querySelector("#pane-listen .desk h3");
    if (desk) desk.textContent = t("desk");
    const prev = document.getElementById("listenPrev");
    if (prev) prev.textContent = t("prev");
    const play = document.getElementById("listenPlay");
    if (play) play.textContent = t("play");
    const next = document.getElementById("listenNext");
    if (next) next.textContent = t("nextChant");
    const foot = document.querySelector("#pane-listen .desk-foot");
    if (foot) foot.textContent = t("chantFoot");
    if (typeof applyI18n === "function") applyI18n();
  }

  function boot() {
    paint();
    setInterval(paint, 2000);
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        setTimeout(paint, 30);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 200);
})();
