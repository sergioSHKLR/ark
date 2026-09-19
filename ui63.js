(function () {
  const MOODS = ["blessed", "level", "heavy"];
  const GLYPH = { blessed: "\uD83D\uDD4A\uFE0F", level: "\u00B7", heavy: "\uD83E\uDEA8" };

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
      "#pane-listen #chantMount iframe{width:100%;height:100%;border:0;display:block}";
    document.head.appendChild(s);
  }

  function signedIn() {
    return typeof driveToken === "string" && !!driveToken;
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
    if (mode === "write" && typeof landingPane === "function" && prevShow) {
      prevShow(landingPane());
      return;
    }
    if (prevShow) prevShow(name);
  };

  function boot() {
    injectStyle();
    ensureChrome();
    ensureListenPane();
    ensureMood();
    retargetNav();
    applyCandle();
    if (signedIn() && typeof showPane === "function") showPane("write");
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
})();
