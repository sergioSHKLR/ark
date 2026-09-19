(function () {
  const LIST = [
    { title: "Santo Domingo de Silos \u00b7 Canto Gregoriano", yt: "GCuDBo4F-Ac" },
    { title: "Silos \u00b7 Chant (1994)", yt: "qFUFF-YK5v8" },
    { title: "Monks of Norcia \u00b7 Benedicta", yt: "bTKfstuIUKM" },
    { title: "Norcia \u00b7 Salve Regina", yt: "e9BBWZKnTvQ" },
    { title: "Schola Gregoriana Mediolanensis", yt: "nsrKNcjzcSU" }
  ];
  let idx = 0;

  function css() {
    if (document.getElementById("listen-desk-css")) return;
    const s = document.createElement("style");
    s.id = "listen-desk-css";
    s.textContent =
      "#pane-listen .desk{display:block}" +
      "#listenPlayer{position:relative;width:100%;aspect-ratio:16/9;background:#140f0c;border:1px solid var(--rule);margin:0 0 .6rem;overflow:hidden}" +
      "#listenPlayer iframe{position:absolute;inset:0;width:100%;height:100%;border:0}";
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

  function src(id) {
    return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1&playsinline=1&enablejsapi=1";
  }

  function paint() {
    const item = LIST[idx];
    const title = document.getElementById("listenTitle");
    const frame = document.getElementById("listenPlayer");
    if (title) title.textContent = item.title;
    if (frame)
      frame.innerHTML =
        '<iframe src="' + src(item.yt) + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Canto"></iframe>';
  }

  function mount() {
    css();
    const p = pane();
    if (!p.querySelector("#listenPlayer")) {
      p.innerHTML =
        '<div class="office-body"><div class="desk">' +
        "<h3>Mesa</h3>" +
        '<p class="desk-now" id="listenTitle"></p>' +
        '<div id="listenPlayer"></div>' +
        '<div class="desk-keys">' +
        '<button class="key" type="button" id="listenPrev">Anterior</button>' +
        '<button class="key" type="button" id="listenPlay">Tocar</button>' +
        '<button class="key" type="button" id="listenNext">Pr\u00f3ximo</button>' +
        "</div>" +
        '<p class="desk-foot">Canto gregoriano. YouTube, enquanto n\u00e3o houver arquivos locais.</p>' +
        "</div></div>";
      document.getElementById("listenPrev").addEventListener("click", function () {
        idx = (idx + LIST.length - 1) % LIST.length;
        paint();
      });
      document.getElementById("listenNext").addEventListener("click", function () {
        idx = (idx + 1) % LIST.length;
        paint();
      });
      document.getElementById("listenPlay").addEventListener("click", function () {
        paint();
        const iframe = document.querySelector("#listenPlayer iframe");
        if (iframe && iframe.contentWindow)
          iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
      });
    }
    paint();
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
