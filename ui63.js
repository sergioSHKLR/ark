(function () {
  const DEMO_KEY = "noah-demo";
  const MOODS = ["blessed", "level", "heavy"];
  const GLYPH = { blessed: "\uD83D\uDD4A\uFE0F", level: "\u00B7", heavy: "\uD83E\uDEA8" };

  function isDemo() {
    try {
      const q = new URLSearchParams(location.search).get("demo");
      if (q === "0" || q === "off") {
        localStorage.removeItem(DEMO_KEY);
        return false;
      }
      if (q === "1" || q === "on") {
        localStorage.setItem(DEMO_KEY, "1");
        return true;
      }
    } catch (e) {}
    return localStorage.getItem(DEMO_KEY) === "1";
  }

  function injectStyle() {
    if (document.getElementById("ui63-css")) return;
    const s = document.createElement("style");
    s.id = "ui63-css";
    s.textContent =
      ".candle-btn{position:absolute;top:0;left:0;z-index:2;width:2.6rem;height:2.6rem;border:0;background:transparent;font-size:1.35rem;cursor:pointer}" +
      ".candle-btn .candle-lit{display:none}" +
      "html[data-theme='dark'] .candle-btn .candle-lit{display:inline}" +
      "html[data-theme='dark'] .candle-btn .candle-unlit{display:none}" +
      "@media(prefers-color-scheme:dark){html:not([data-theme='light']) .candle-btn .candle-lit{display:inline}html:not([data-theme='light']) .candle-btn .candle-unlit{display:none}}" +
      ".candle-btn .candle-unlit{filter:grayscale(1);opacity:.72}" +
      ".office-ticks{display:flex;justify-content:center;gap:1.1rem;margin:.15rem 0;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft)}" +
      ".office-ticks .is-now{color:var(--rubric)}" +
      ".office-ticks .is-kept::after{content:' \u2713';color:var(--gold)}" +
      ".office-ticks .is-missed::after{content:' \u00d7';color:var(--rubric)}" +
      ".nav-bar{grid-template-columns:1fr 1fr 1fr}" +
      ".mood-row{display:flex;justify-content:center;gap:.45rem;margin:.55rem 0 .15rem}" +
      ".mood-key{min-width:2.6rem;min-height:2.6rem;border:1px solid var(--rule);background:var(--paper);cursor:pointer}" +
      ".mood-key.active{border-color:var(--rubric);background:var(--paper-2)}" +
      ".settings-btn{right:0;left:auto}" +
      "#pane-listen .chant-hidden{position:static;width:100%;height:auto;margin:0 0 .55rem;clip:auto;overflow:visible}" +
      "#pane-listen #chantMount{position:relative;width:100%;aspect-ratio:16/9;background:#140f0c;border:1px solid var(--rule);overflow:hidden}" +
      "#pane-listen #chantMount iframe{width:100%;height:100%;border:0;display:block}" +
      ".demo-banner{text-align:center;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--rubric);margin:0 0 .7rem}";
    document.head.appendChild(s);
  }

  function signedIn() {
    if (isDemo()) return true;
    return typeof driveToken === "string" && !!driveToken;
  }

  function shiftDate(iso, days) {
    const p = iso.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2]);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function seedDemoJournal() {
    if (typeof loadJournal !== "function" || typeof saveJournalSilent !== "function")
      return;
    const today = typeof todayKey === "function" ? todayKey() : new Date().toISOString().slice(0, 10);
    const data = loadJournal();
    const pack = {};
    pack[shiftDate(today, -3)] = {
      notes: { morning: "Demo morning. The hour held.", day: "Demo midday. One act.", night: "Demo night. Quiet." },
      mood: { morning: "blessed", day: "level", night: "heavy" },
      updatedAt: shiftDate(today, -3) + "T21:40:00",
    };
    pack[shiftDate(today, -2)] = {
      notes: { morning: "Kept the film and the prayer." },
      mood: { morning: "level" },
      updatedAt: shiftDate(today, -2) + "T08:10:00",
    };
    pack[shiftDate(today, -1)] = {
      notes: { morning: "Out the door after the lesson.", day: "Kept one tongue." },
      mood: { morning: "blessed", day: "blessed" },
      updatedAt: shiftDate(today, -1) + "T15:02:00",
    };
    pack[today] = data[today] || { notes: {}, mood: {}, updatedAt: today + "T12:00:00" };
    Object.keys(pack).forEach(function (k) {
      if (!data[k] || !data[k].notes || !Object.keys(data[k].notes).length)
        data[k] = pack[k];
    });
    saveJournalSilent(data);
    if (typeof renderLog === "function") renderLog();
  }

  function openDemoOffice() {
    if (typeof driveToken === "string" && !driveToken) driveToken = "demo";
    const gate = document.getElementById("connectCard");
    if (gate) gate.hidden = true;
    const closed = document.getElementById("officeClosed");
    if (closed) closed.hidden = true;
    document.querySelectorAll(".pane").forEach(function (p) {
      p.hidden = p.id !== "pane-morning";
    });
    document.querySelectorAll("textarea.note[data-slot]").forEach(function (el) {
      el.disabled = false;
    });
    if (typeof gateOfficeForm === "function") gateOfficeForm("morning", "open");
    if (typeof hideConnectGate === "function") hideConnectGate();
    if (typeof renderLesson === "function") renderLesson();
    if (typeof renderFilm === "function") renderFilm();
    if (typeof renderOurFather === "function") renderOurFather();
    if (typeof renderLog === "function") renderLog();
    let banner = document.getElementById("demoBanner");
    if (!banner) {
      banner = document.createElement("p");
      banner.id = "demoBanner";
      banner.className = "demo-banner";
      const page = document.querySelector(".page");
      if (page) page.insertBefore(banner, page.children[1] || null);
    }
    banner.textContent = "Demo · mock log · office open";
  }

  function addDemoToggle() {
    const box = document.querySelector("#settingsModal .build-block");
    if (!box || document.getElementById("demoToggle")) return;
    const row = document.createElement("div");
    row.className = "remind-row";
    row.innerHTML =
      '<label for="demoToggle">Demo</label><input type="checkbox" id="demoToggle" />';
    box.parentNode.insertBefore(row, box);
    const input = row.querySelector("#demoToggle");
    input.checked = isDemo();
    input.addEventListener("change", function () {
      if (input.checked) {
        localStorage.setItem(DEMO_KEY, "1");
        seedDemoJournal();
        openDemoOffice();
      } else {
        localStorage.removeItem(DEMO_KEY);
        if (typeof driveToken === "string" && driveToken === "demo") driveToken = "";
        location.reload();
      }
    });
  }

  function isDark() {
    const theme = localStorage.getItem("noah-theme") || "system";
    return (
      theme === "dark" ||
      (theme !== "light" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }

  function applyCandle() {
    const btn = document.getElementById("candleBtn");
    if (!btn) return;
    btn.classList.toggle("is-lit", isDark());
  }

  function toggleCandle() {
    const next = isDark() ? "light" : "dark";
    localStorage.setItem("noah-theme", next);
    if (next === "light" || next === "dark")
      document.documentElement.setAttribute("data-theme", next);
    document.querySelectorAll("[data-theme-choice]").forEach(function (x) {
      x.classList.toggle("active", x.getAttribute("data-theme-choice") === next);
    });
    if (typeof applyTheme === "function") applyTheme();
    applyCandle();
  }

  function ensureChrome() {
    const head = document.querySelector(".masthead");
    if (head && !document.getElementById("candleBtn")) {
      const c = document.createElement("button");
      c.type = "button";
      c.id = "candleBtn";
      c.className = "candle-btn";
      c.setAttribute("aria-label", "Theme");
      c.innerHTML =
        '<span class="candle-unlit" aria-hidden="true">\uD83D\uDD6F\uFE0F</span><span class="candle-lit" aria-hidden="true">\uD83D\uDD6F\uFE0F</span>';
      c.addEventListener("click", toggleCandle);
      head.insertBefore(c, head.firstChild);
    }
    if (head && !document.getElementById("officeTicks")) {
      const ticks = document.createElement("div");
      ticks.id = "officeTicks";
      ticks.className = "office-ticks";
      ticks.innerHTML =
        '<span data-tick="morning">Morning</span><span data-tick="day">Day</span><span data-tick="night">Night</span>';
      const rule = head.querySelector(".rule");
      head.insertBefore(ticks, rule || null);
    }
    const gear = document.getElementById("settingsBtn");
    if (gear) gear.textContent = "\u2699";
    const line = document.getElementById("buildLine");
    if (line) line.textContent = (typeof t === "function" ? t("buildLabel") : "Build") + " 63";
  }

  function revealChant() {
    const mount = document.getElementById("chantMount");
    if (mount) {
      mount.classList.remove("chant-hidden");
      mount.removeAttribute("hidden");
    }
    if (typeof chantMode !== "undefined") chantMode = "yt";
    if (typeof chantLoaded !== "undefined") chantLoaded = true;
    if (typeof renderChant === "function") renderChant(false);
  }

  function ensureListenPane() {
    if (document.getElementById("pane-listen")) {
      revealChant();
      return;
    }
    const listen = document.createElement("section");
    listen.className = "pane";
    listen.id = "pane-listen";
    listen.hidden = true;
    const body = document.createElement("div");
    body.className = "office-body";
    listen.appendChild(body);
    const desk = document.querySelector("#pane-day .desk");
    const sleep = document.querySelector("#pane-night .sleep-row");
    if (desk) body.appendChild(desk);
    if (sleep) body.appendChild(sleep);
    const log = document.getElementById("pane-log");
    if (log && log.parentNode) log.parentNode.insertBefore(listen, log);
    revealChant();
  }

  function ensureMood() {
    document.querySelectorAll("[data-entry]").forEach(function (block) {
      if (block.querySelector("[data-mood-row]")) return;
      const area = block.querySelector("textarea.note");
      if (!area) return;
      const row = document.createElement("div");
      row.className = "mood-row";
      row.setAttribute("data-mood-row", "");
      MOODS.forEach(function (m) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mood-key" + (m === "level" ? " is-level" : "");
        b.setAttribute("data-mood", m);
        b.textContent = GLYPH[m];
        row.appendChild(b);
      });
      row.addEventListener("click", function (e) {
        const key = e.target.closest("[data-mood]");
        if (!key) return;
        row.querySelectorAll("[data-mood]").forEach(function (b) {
          b.classList.toggle("active", b === key);
        });
      });
      area.insertAdjacentElement("afterend", row);
    });
  }

  function retargetNav() {
    const bar = document.querySelector(".nav-bar");
    if (!bar) return;
    bar.innerHTML = "";
    [["write", "Write"], ["listen", "Listen"], ["log", "Log"]].forEach(function (pair, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-pane", pair[0]);
      b.textContent = pair[1];
      if (i === 0) b.className = "active";
      b.addEventListener("click", function () {
        if (typeof showPane === "function") showPane(pair[0]);
      });
      bar.appendChild(b);
    });
  }

  const prevShow = typeof showPane === "function" ? showPane : null;
  window.showPane = function (name) {
    const mode = name === "listen" || name === "log" || name === "write" ? name : "write";
    document.querySelectorAll(".nav-bar button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-pane") === mode);
    });
    if (mode === "listen") {
      if (!signedIn()) {
        if (typeof showConnectGate === "function") showConnectGate();
        return;
      }
      document.querySelectorAll(".pane").forEach(function (p) {
        p.hidden = p.id !== "pane-listen";
      });
      const closed = document.getElementById("officeClosed");
      if (closed) closed.hidden = true;
      revealChant();
      return;
    }
    if (isDemo() && mode === "write") {
      openDemoOffice();
      return;
    }
    if (mode === "write" && typeof landingPane === "function" && prevShow) {
      prevShow(landingPane());
      return;
    }
    if (prevShow) prevShow(name);
  };

  const prevSave = typeof saveOffice === "function" ? saveOffice : null;
  if (prevSave) {
    window.saveOffice = function (pane) {
      if (!isDemo()) return prevSave(pane);
      const area = document.querySelector("#pane-" + pane + " textarea.note[data-slot]");
      const text = area ? area.value : "";
      const now = typeof TIMENOW === "function" ? TIMENOW() : { date: new Date().toISOString().slice(0, 10) };
      const j = loadJournal();
      const k = now.date;
      j[k] = j[k] || { checks: {}, notes: {}, media: {}, mood: {} };
      j[k].notes[pane] = text;
      j[k].updatedAt = new Date().toISOString();
      saveJournalSilent(j);
      const meta = document.querySelector('[data-window-meta="' + pane + '"]');
      if (meta) meta.textContent = typeof t === "function" ? t("savedOk") : "Saved.";
      if (typeof renderLog === "function") renderLog();
    };
  }

  function boot() {
    injectStyle();
    ensureChrome();
    ensureListenPane();
    ensureMood();
    retargetNav();
    applyCandle();
    addDemoToggle();
    if (isDemo()) {
      seedDemoJournal();
      openDemoOffice();
      return;
    }
    if (signedIn() && typeof showPane === "function") showPane("write");
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
})();
