(function () {
  if (document.getElementById("wide-viewport-css")) return;
  const s = document.createElement("style");
  s.id = "wide-viewport-css";
  s.textContent =
    "@media (min-width: 48rem){" +
    ":root{--max:40rem;--pad:1.6rem}" +
    ".page,.nav-bar{width:min(var(--max),100%)}" +
    ".date-line{max-width:none}" +
    ".wordmark{font-size:3.4rem}" +
    "#settingsModal .modal-box,.modal-box{max-width:min(40rem,calc(100% - 2rem))}" +
    ".film-frame,#listenPlayer{max-height:min(28rem,56vw)}" +
    "}" +
    "@media (min-width: 64rem){" +
    ":root{--max:52rem;--pad:2rem}" +
    ".page{width:min(var(--max),100%);padding-top:1rem}" +
    ".nav-bar{width:min(var(--max),100%)}" +
    ".office-body{display:grid;grid-template-columns:1.15fr .85fr;gap:1.1rem 1.4rem;align-items:start}" +
    ".office-body > .film,.office-body > #listenPlayer,.office-body > .desk{grid-column:1}" +
    ".office-body > .our-father,.office-body > .reading-card,.office-body > .entry-block{grid-column:2}" +
    ".office-body > .film{grid-row:1 / span 2}" +
    "#settingsModal .modal-box{max-width:min(36rem,calc(100% - 3rem))}" +
    "textarea.note{min-height:8rem}" +
    "}" +
    "@media (min-width: 80rem){" +
    ":root{--max:58rem}" +
    "}";
  document.head.appendChild(s);
})();
