(function () {
  const old = document.getElementById("wide-viewport-css");
  if (old) old.remove();
  const s = document.createElement("style");
  s.id = "wide-viewport-css";
  s.textContent =
    "@media (min-width: 48rem){" +
    ":root{--max:40rem;--pad:1.6rem}" +
    ".page,.nav-bar{width:min(var(--max),100%)}" +
    ".date-line{max-width:none}" +
    "}" +
    "@media (min-width: 64rem){" +
    ":root{--max:56rem;--pad:2rem}" +
    ".page,.nav-bar{width:min(var(--max),100%)}" +
    ".office-body{display:grid;grid-template-columns:1.15fr .85fr;gap:1rem 1.4rem;align-items:start}" +
    ".office-body > *{grid-column:1}" +
    ".office-body > .entry-block,[data-entry]{grid-column:2;grid-row:1 / span 8}" +
    ".office-body > .entry-block textarea.note{min-height:12rem}" +
    "}" +
    "@media (min-width: 80rem){:root{--max:62rem}}";
  document.head.appendChild(s);
})();
