(function () {
  const LIST = [
    { title: "Santo Domingo de Silos \u00b7 Canto Gregoriano", yt: "GCuDBo4F-Ac" },
    { title: "Silos \u00b7 Chant (1994)", yt: "qFUFF-YK5v8" },
    { title: "Monks of Norcia \u00b7 Benedicta", yt: "bTKfstuIUKM" },
    { title: "Norcia \u00b7 Salve Regina", yt: "e9BBWZKnTvQ" },
    { title: "Schola Gregoriana Mediolanensis", yt: "nsrKNcjzcSU" }
  ];
  let idx = 0;
  let playing = false;

  function css() {
    if (document.getElementById("listen-desk-css")) return;
    const s = document.createElement("style");
    s.id = "listen-desk-css";
    s.textContent =
      "#pane-listen .desk{display:block}" +
      "#listenPlayer,.listen-player-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);border:0;white-space:nowrap}" +
      "#pane-listen #chantMount,#pane-listen .chant-wave,#pane-listen .chant-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%)}" +
      "#pane-listen .desk-keys{margin-top:.35rem}";
    document.head.appendChild(s);
  }

  function pane() {
    let p = document.getElementById("pane-listen");
    if (p) return p;
    p = document.createElement("section");
    p.className = "pane";
    p.id = "pane-listen";
    p.hidden = true;
    const log = document.getElementById("pane-log");
    if (log && log.parentNode) log.parentNode.insertBefore(p, log);
    else document.querySelector(".page").appendChild(p);
    return p;
  }

  function src(id, autoplay) {
    return (
      "https://www.youtube-nocookie.com/embed/" +
      id +
      "?rel=0&modestbranding=1&playsinline=1&enablejsapi=1" +
      (autoplay ? "&autoplay=1" : "")
    );
  }

  function command(func) {
    const iframe = document.querySelector("#listenPlayer iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: func, args: [] }),
        "*"
      );
    }
  }

  function paint(autoplay) {
    const item = LIST[idx];
    const title = document.getElementById("listenTitle");
    const frame = document.getElementById("listenPlayer");
    if (title) title.textContent = item.title;
    if (!frame) return;
    const iframe = frame.querySelector("iframe");
    if (iframe && iframe.getAttribute("data-yt") === item.yt && !autoplay) return;
    frame.innerHTML =
      '<iframe data-yt="' +
      item.yt +
      '" src="' +
      src(item.yt, !!autoplay) +
      '" allow="autoplay; encrypted-media" title="Canto" tabindex="-1"></iframe>';
  }

  function setPlayLabel() {
    const btn = document.getElementById("listenPlay");
    if (!btn) return;
    const pt = typeof lang === "string" && lang === "pt";
    btn.textContent = playing ? (pt ? "Pausar" : "Pause") : pt ? "Tocar" : "Play";
  }

  function mount() {
    css();
    const p = pane();
    if (!p.querySelector("#listenPlayer")) {
      p.innerHTML =
        '<div class="office-body"><div class="desk">' +
        "<h3>Mesa</h3>" +
        '<p class="desk-now" id="listenTitle"></p>' +
        '<div id="listenPlayer" class="listen-player-sr" aria-hidden="true"></div>' +
        '<div class="desk-keys">' +
        '<button class="key" type="button" id="listenPrev">Anterior</button>' +
        '<button class="key" type="button" id="listenPlay">Tocar</button>' +
        '<button class="key" type="button" id="listenNext">Pr\u00f3ximo</button>' +
        "</div>" +
        '<p class="desk-foot" id="listenFoot">Canto</p>' +
        "</div></div>";
      document.getElementById("listenPrev").addEventListener("click", function () {
        idx = (idx + LIST.length - 1) % LIST.length;
        playing = false;
        paint(false);
        setPlayLabel();
      });
      document.getElementById("listenNext").addEventListener("click", function () {
        idx = (idx + 1) % LIST.length;
        playing = false;
        paint(false);
        setPlayLabel();
      });
      document.getElementById("listenPlay").addEventListener("click", function () {
        if (playing) {
          command("pauseVideo");
          playing = false;
          setPlayLabel();
          return;
        }
        paint(true);
        command("playVideo");
        playing = true;
        setPlayLabel();
      });
    }
    paint(false);
    setPlayLabel();
  }

  const prev = window.showPane;
  window.showPane = function (name) {
    if (name === "listen") {
      mount();
      document.querySelectorAll(".pane").forEach(function (el) {
        el.hidden = el.id !== "pane-listen";
      });
      const closed = document.getElementById("officeClosed");
      if (closed) closed.hidden = true;
      document.querySelectorAll(".nav-bar button").forEach(function (b) {
        b.classList.toggle("active", b.getAttribute("data-pane") === "listen");
      });
      return;
    }
    if (typeof prev === "function") return prev(name);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else setTimeout(mount, 120);
})();
