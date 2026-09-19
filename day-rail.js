(function () {
  const WINDOWS = [
    { id: "morning", start: 5, end: 9 },
    { id: "midday", start: 12, end: 15 },
    { id: "night", start: 21, end: 24 }
  ];
  const COPY = {
    en: {
      walk: "Walk the day", pause: "Pause walk", hour: "+1 hour",
      morningOpen: "Morning open", dayOpen: "Day open", nightOpen: "Night open",
      closed: "Closed", next: "Next office", midday: "midday", morning: "morning", night: "night"
    },
    pt: {
      walk: "Percorrer o dia", pause: "Pausar", hour: "+1 hora",
      morningOpen: "Manh\u00e3 aberta", dayOpen: "Dia aberto", nightOpen: "Noite aberta",
      closed: "Fechado", next: "Pr\u00f3ximo of\u00edcio", midday: "meio-dia", morning: "manh\u00e3", night: "noite"
    }
  };
  const DAY_MS = 48000;
  let demoOn = false;
  let walking = false;
  let walkRaf = 0;
  let walkStarted = 0;
  let walkFrom = 0;
  let demoMin = null;
  let lastKind = "";
  const realTIME = typeof TIMENOW === "function" ? TIMENOW : null;

  function langNow() {
    try {
      const s = localStorage.getItem("noah-lang");
      if (s === "pt" || s === "en") return s;
    } catch (e) {}
    if (typeof lang === "string" && (lang === "pt" || lang === "en")) return lang;
    return (navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  }
  function tx(k) {
    return (COPY[langNow()] || COPY.en)[k] || COPY.en[k] || k;
  }
  function listening() {
    return document.documentElement.getAttribute("data-listen") === "1" ||
      !!(document.querySelector('.nav-bar button[data-pane="listen"].active'));
  }

  function clockNow() {
    if (demoMin != null) {
      const h = Math.floor(demoMin / 60) % 24;
      const m = Math.floor(demoMin % 60);
      const date = realTIME ? realTIME().date : new Date().toISOString().slice(0, 10);
      let period = null;
      for (let i = 0; i < WINDOWS.length; i++) {
        const w = WINDOWS[i];
        if (h >= w.start && h < w.end) period = w.id === "midday" ? "midday" : w.id;
      }
      return {
        date: date, period: period, open: !!period, hour: h, minute: m,
        nextAt: h < 5 ? "05:00" : h < 12 ? "12:00" : h < 21 ? "21:00" : "05:00",
        nextPeriod: h < 5 ? "morning" : h < 12 ? "midday" : h < 21 ? "night" : "morning"
      };
    }
    return realTIME ? realTIME() : { date: "", period: null, open: false, hour: 0, minute: 0 };
  }
  window.TIMENOW = function (d) {
    if (demoMin != null) return clockNow();
    return realTIME ? realTIME(d) : clockNow();
  };
  function pct(min) { return ((min % 1440) / 1440) * 100; }

  function inject() {
    if (document.getElementById("day-rail-css")) return;
    const s = document.createElement("style");
    s.id = "day-rail-css";
    s.textContent =
      ".day-rail{margin:.15rem 1.1rem .7rem;user-select:none}" +
      ".day-rail-meta{display:flex;justify-content:space-between;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);margin:0 0 .28rem}" +
      ".day-rail-track{position:relative;height:16px;background:rgba(42,33,24,.12);border:1px solid var(--rule);overflow:visible}" +
      "html[data-theme='dark'] .day-rail-track{background:rgba(243,234,214,.1)}" +
      ".day-rail-win{position:absolute;top:0;bottom:0;background:var(--gold,#8a6d3b);opacity:.55}" +
      ".day-rail-win.is-open{opacity:.95;background:var(--rubric,#7a2418)}" +
      ".day-rail-fill{position:absolute;top:0;bottom:0;left:0;background:#111;opacity:.55;pointer-events:none}" +
      ".day-rail-needle{position:absolute;top:-6px;bottom:-6px;width:5px;background:#0a0a0a;border:1px solid rgba(243,234,214,.35);transform:translateX(-2px);z-index:3}" +
      ".day-rail-ticks{position:relative;height:1.05rem;margin-top:.28rem;font-size:.58rem;letter-spacing:.08em;color:var(--ink-soft)}" +
      ".day-rail-ticks span{position:absolute;transform:translateX(-50%)}" +
      ".day-rail-actions{display:flex;gap:.4rem;margin:.45rem 0 0;justify-content:center}" +
      ".day-rail-actions .key{flex:none;padding:.28rem .7rem;font-size:.72rem}" +
      "#demoStage{display:none!important}";
    document.head.appendChild(s);
  }

  function hoursNow() {
    const n = clockNow();
    return n.hour + n.minute / 60;
  }
  function paintRail() {
    const fill = document.getElementById("dayRailFill");
    const needle = document.getElementById("dayRailNeedle");
    const clock = document.getElementById("dayRailClock");
    const state = document.getElementById("dayRailState");
    const n = clockNow();
    const min = n.hour * 60 + n.minute;
    const left = pct(min);
    if (fill) fill.style.width = left + "%";
    if (needle) needle.style.left = left + "%";
    if (clock) clock.textContent = String(n.hour).padStart(2, "0") + ":" + String(n.minute).padStart(2, "0");
    if (state) {
      state.textContent = n.open
        ? n.period === "midday" ? tx("dayOpen") : n.period === "morning" ? tx("morningOpen") : tx("nightOpen")
        : tx("closed");
    }
    const walk = document.getElementById("railWalk");
    if (walk) walk.textContent = walking ? tx("pause") : tx("walk");
    const step = document.getElementById("railStep");
    if (step) step.textContent = tx("hour");
    document.querySelectorAll(".day-rail-win").forEach(function (el) {
      const id = el.getAttribute("data-win");
      const w = WINDOWS.filter(function (x) { return x.id === id; })[0];
      el.classList.toggle("is-open", !!(w && hoursNow() >= w.start && hoursNow() < w.end));
    });
  }

  function kindOf(n) {
    if (!n || !n.open) return "closed";
    return n.period;
  }

  function applyOffice(force) {
    const n = clockNow();
    const kind = kindOf(n);
    paintRail();
    if (listening()) return;
    if (!force && kind === lastKind) return;
    lastKind = kind;
    const closed = document.getElementById("officeClosed");
    document.querySelectorAll(".pane").forEach(function (p) {
      if (p.id === "pane-listen") return;
      p.hidden = true;
    });
    if (kind === "morning") {
      const p = document.getElementById("pane-morning"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("morning", "open");
    } else if (kind === "midday") {
      const p = document.getElementById("pane-day"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("day", "open");
    } else if (kind === "night") {
      const p = document.getElementById("pane-night"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("night", "open");
      if (typeof applyNightOffice === "function") applyNightOffice();
    } else if (closed) {
      closed.hidden = false;
      const body = document.getElementById("officeClosedBody");
      if (body) body.textContent = tx("next") + " " + (n.nextAt || "") + " \u00b7 " + tx(n.nextPeriod || "morning");
    }
    if (typeof renderDateLine === "function") renderDateLine();
  }

  function setDemoMin(min, forceOffice) {
    demoMin = ((min % 1440) + 1440) % 1440;
    applyOffice(!!forceOffice);
  }
  function tickWalk(now) {
    if (!walking) return;
    const t = (now - walkStarted) / DAY_MS;
    demoMin = (walkFrom + (t - Math.floor(t)) * 1440) % 1440;
    applyOffice(false);
    walkRaf = requestAnimationFrame(tickWalk);
  }
  function toggleWalk() {
    walking = !walking;
    const btn = document.getElementById("railWalk");
    if (btn) btn.textContent = walking ? tx("pause") : tx("walk");
    if (walking) {
      walkFrom = demoMin == null ? 0 : demoMin;
      walkStarted = performance.now();
      walkRaf = requestAnimationFrame(tickWalk);
    } else if (walkRaf) {
      cancelAnimationFrame(walkRaf);
      walkRaf = 0;
    }
  }
  function stepDemo() {
    if (walking) toggleWalk();
    setDemoMin((demoMin == null ? 0 : demoMin) + 60, true);
  }

  function mountRail() {
    inject();
    if (document.getElementById("dayRail")) { paintRail(); return; }
    const box = document.createElement("div");
    box.className = "day-rail";
    box.id = "dayRail";
    box.innerHTML =
      '<div class="day-rail-meta"><span id="dayRailClock"></span><span id="dayRailState"></span></div>' +
      '<div class="day-rail-track" id="dayRailTrack">' +
      '<span class="day-rail-win" data-win="morning" style="left:20.833%;width:16.666%"></span>' +
      '<span class="day-rail-win" data-win="midday" style="left:50%;width:12.5%"></span>' +
      '<span class="day-rail-win" data-win="night" style="left:87.5%;width:12.5%"></span>' +
      '<span class="day-rail-fill" id="dayRailFill"></span>' +
      '<span class="day-rail-needle" id="dayRailNeedle"></span></div>' +
      '<div class="day-rail-ticks"><span style="left:0">00</span><span style="left:20.833%">05</span><span style="left:37.5%">09</span><span style="left:50%">12</span><span style="left:62.5%">15</span><span style="left:87.5%">21</span><span style="left:100%">24</span></div>' +
      '<div class="day-rail-actions" id="dayRailActions" hidden>' +
      '<button type="button" class="key" id="railWalk"></button>' +
      '<button type="button" class="key ghost" id="railStep"></button></div>';
    const head = document.querySelector(".masthead");
    if (head && head.parentNode) head.parentNode.insertBefore(box, head.nextSibling);
    else document.querySelector(".page").insertBefore(box, document.querySelector(".page").firstChild);
    document.getElementById("dayRailTrack").addEventListener("click", function (e) {
      if (!demoOn) return;
      if (walking) toggleWalk();
      const r = e.currentTarget.getBoundingClientRect();
      setDemoMin(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 1440), true);
    });
    document.getElementById("railStep").addEventListener("click", stepDemo);
    document.getElementById("railWalk").addEventListener("click", toggleWalk);
    paintRail();
  }

  function isDemo() {
    try {
      const q = new URLSearchParams(location.search).get("demo");
      if (q === "1" || q === "on") return true;
    } catch (e) {}
    return localStorage.getItem("noah-demo") === "1";
  }
  function boot() {
    mountRail();
    setInterval(paintRail, 15000);
    demoOn = isDemo();
    const actions = document.getElementById("dayRailActions");
    if (actions) actions.hidden = !demoOn;
    if (demoOn) {
      setDemoMin(0, true);
      if (!walking) toggleWalk();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 180);
})();
