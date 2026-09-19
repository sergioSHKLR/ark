(function () {
  const MAP = { blessed: "\uD83D\uDD4A\uFE0F", level: "\u26AB", heavy: "\uD83E\uDEA8" };
  function css() {
    if (document.getElementById("mood-marks-css")) return;
    const s = document.createElement("style");
    s.id = "mood-marks-css";
    s.textContent =
      ".mood-row{display:flex;justify-content:center;gap:.55rem;margin:.55rem 0 .2rem}" +
      ".mood-key{min-width:3rem;min-height:3rem;font-size:1.55rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--rule);background:var(--paper);padding:0}" +
      ".mood-key.active{border-color:var(--rubric);background:var(--paper-2)}" +
      ".mood-key[data-mood='level']{font-size:1.35rem}" +
      ".marks-line,.attach-sheet,.entry-media{font-size:1.05rem}";
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
