(function () {
  const WINDOWS = [
    { id: "morning", start: 5, end: 9 },
    { id: "midday", start: 12, end: 15 },
    { id: "night", start: 21, end: 24 }
  ];
  const STOPS = [330, 600, 780, 1080, 1320];
  const FILMS = {
    morning: { id: "9_dr9njVzKM", title: "The Baptism of Jesus", ref: "Matthew 3" },
    midday: { id: "Q0BrP8bqj0c", title: "New Testament overview", ref: "Bible Project" },
    night: null
  };
  let demoOn = false;
  let walking = false;
  let walkTimer = 0;
  let stopAt = 0;
  let demoMin = null;
  const realTIME = typeof TIMENOW === "function" ? TIMENOW : null;

  function clockNow() {
    if (demoMin != null) {
      const h = Math.floor(demoMin / 60);
      const m = demoMin % 60;
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
  function pct(min) { return (min / 1440) * 100; }

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
      ".day-rail-needle{position:absolute;top:-6px;bottom:-6px;width:5px;background:#0a0a0a;border:1px solid rgba(243,234,214,.35);transform:translateX(-2px);z-index:3;box-shadow:0 0 0 1px rgba(0,0,0,.4)}" +
      ".day-rail-ticks{position:relative;height:1.05rem;margin-top:.28rem;font-size:.58rem;letter-spacing:.08em;color:var(--ink-soft)}" +
      ".day-rail-ticks span{position:absolute;transform:translateX(-50%)}" +
      ".day-rail-actions{display:flex;gap:.4rem;margin:.45rem 0 0;justify-content:center}" +
      ".day-rail-actions .key{flex:none;padding:.28rem .7rem;font-size:.72rem}" +
      "#demoStage{margin:0 1.1rem .8rem}" +
      "#demoStage .film-frame{position:relative;width:100%;aspect-ratio:16/9;background:#140f0c;border:1px solid var(--rule);overflow:hidden}" +
      "#demoStage iframe{position:absolute;inset:0;width:100%;height:100%;border:0}";
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
      state.textContent = n.open ? (n.period === "midday" ? "Day open" : n.period === "morning" ? "Morning open" : "Night open") : "Closed";
    }
    document.querySelectorAll(".day-rail-win").forEach(function (el) {
      const id = el.getAttribute("data-win");
      const w = WINDOWS.filter(function (x) { return x.id === id; })[0];
      const h = hoursNow();
      el.classList.toggle("is-open", !!(w && h >= w.start && h < w.end));
    });
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
      '<button type="button" class="key ghost" id="railStep">Next hour</button>' +
      '<button type="button" class="key" id="railWalk">Walk the day</button></div>';
    const head = document.querySelector(".masthead");
    if (head && head.parentNode) head.parentNode.insertBefore(box, head.nextSibling);
    else document.querySelector(".page").insertBefore(box, document.querySelector(".page").firstChild);
    const track = document.getElementById("dayRailTrack");
    track.addEventListener("click", function (e) {
      if (!demoOn) return;
      const r = track.getBoundingClientRect();
      setDemoMin(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 1440));
    });
    document.getElementById("railStep").addEventListener("click", stepDemo);
    document.getElementById("railWalk").addEventListener("click", toggleWalk);
    paintRail();
  }
  function ensureStage() {
    let el = document.getElementById("demoStage");
    if (el) return el;
    el = document.createElement("div");
    el.id = "demoStage";
    el.hidden = true;
    const rail = document.getElementById("dayRail");
    if (rail && rail.parentNode) rail.parentNode.insertBefore(el, rail.nextSibling);
    return el;
  }
  function showFilm(kind) {
    const stage = ensureStage();
    const pack = FILMS[kind];
    if (!pack) { stage.hidden = true; stage.innerHTML = ""; return; }
    stage.hidden = false;
    stage.innerHTML = "<h3>" + (kind === "morning" ? "Morning film" : "Noon film") + "</h3><p class=\"film-title\">" + pack.title + "</p><p class=\"film-ref\">" + pack.ref + "</p><div class=\"film-frame\"><iframe src=\"https://www.youtube-nocookie.com/embed/" + pack.id + "?rel=0&modestbranding=1&playsinline=1\" allow=\"accelerometer; autoplay; encrypted-media; picture-in-picture\" allowfullscreen></iframe></div>";
  }
  function applyOffice() {
    const n = clockNow();
    const closed = document.getElementById("officeClosed");
    document.querySelectorAll(".pane").forEach(function (p) { p.hidden = true; });
    if (n.period === "morning") {
      const p = document.getElementById("pane-morning"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("morning", "open");
      showFilm("morning");
    } else if (n.period === "midday") {
      const p = document.getElementById("pane-day"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("day", "open");
      showFilm("midday");
    } else if (n.period === "night") {
      const p = document.getElementById("pane-night"); if (p) p.hidden = false;
      if (closed) closed.hidden = true;
      if (typeof gateOfficeForm === "function") gateOfficeForm("night", "open");
      if (typeof applyNightOffice === "function") applyNightOffice();
      showFilm("night");
    } else {
      if (closed) {
        closed.hidden = false;
        const body = document.getElementById("officeClosedBody");
        if (body) body.textContent = "Next office " + (n.nextAt || "") + " · " + (n.nextPeriod || "");
      }
      showFilm(null);
    }
    if (typeof renderDateLine === "function") renderDateLine();
    paintRail();
  }
  function setDemoMin(min) { demoMin = Math.max(0, Math.min(1439, min)); applyOffice(); }
  function stepDemo() { stopAt = (stopAt + 1) % STOPS.length; setDemoMin(STOPS[stopAt]); }
  function toggleWalk() {
    walking = !walking;
    const btn = document.getElementById("railWalk");
    if (btn) btn.textContent = walking ? "Pause walk" : "Walk the day";
    if (walking) {
      if (demoMin == null) setDemoMin(STOPS[0]);
      walkTimer = setInterval(stepDemo, 7000);
    } else if (walkTimer) { clearInterval(walkTimer); walkTimer = 0; }
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
    if (demoOn) { setDemoMin(STOPS[0]); if (!walking) toggleWalk(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 180);
})();
