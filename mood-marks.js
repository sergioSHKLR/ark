(function () {
  const MAP = { blessed: "\uD83D\uDD4A\uFE0F", level: "\u26AB", heavy: "\uD83E\uDEA8" };
  function css() {
    const old = document.getElementById("mood-marks-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "mood-marks-css";
    s.textContent =
      ".mood-row{display:flex;justify-content:center;gap:.55rem;margin:.55rem 0 .2rem}" +
      ".mood-key{min-width:3.1rem;min-height:3.1rem;font-size:1.6rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;border:1px solid #3d3228;background:#2a2118;color:#f3ead6;padding:0;border-radius:2px}" +
      "html[data-theme='dark'] .mood-key{background:#0f0c0a;border-color:#c4a056}" +
      ".mood-key.active{outline:2px solid var(--rubric,#7a2418);outline-offset:2px;background:#3d2a1c}" +
      ".mood-key[data-mood='blessed']{background:#1a2a22}" +
      ".mood-key[data-mood='blessed'].active{background:#1e3a2c}" +
      ".mood-key[data-mood='level']{font-size:1.4rem;background:#1c1c1c}" +
      ".mood-key[data-mood='heavy']{background:#2a2218}";
    document.head.appendChild(s);
  }
  function paint() {
    css();
    document.querySelectorAll(".mood-key[data-mood]").forEach(function (b) {
      const k = b.getAttribute("data-mood");
      if (MAP[k]) b.textContent = MAP[k];
    });
  }
  function boot() {
    paint();
    setTimeout(paint, 400);
    setTimeout(paint, 1600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 120);
})();
