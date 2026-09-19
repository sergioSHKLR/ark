(function () {
  const MAP = { blessed: "\uD83D\uDD4A\uFE0F", level: "\u26AB", heavy: "\uD83E\uDEA8" };
  const LAB = {
    en: { blessed: "Lite", level: "Mid", heavy: "Heavy" },
    pt: { blessed: "Leve", level: "Meio", heavy: "Pesado" }
  };
  function L() {
    try {
      const s = localStorage.getItem("noah-lang");
      if (s === "pt" || s === "en") return s;
    } catch (e) {}
    if (typeof lang === "string") return lang;
    return (navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  }
  function css() {
    const old = document.getElementById("mood-marks-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "mood-marks-css";
    s.textContent =
      ".mood-row{display:flex;justify-content:center;gap:.4rem;margin:.55rem 0 .2rem;flex-wrap:wrap}" +
      ".mood-key{min-height:2.6rem;padding:.2rem .55rem .2rem .45rem;font-size:1.25rem;line-height:1;display:inline-flex;align-items:center;gap:.35rem;border:1px solid var(--rule,#c4b089);background:var(--paper-2,#e9dcc0);color:var(--ink,#2a2118);border-radius:2px}" +
      "html[data-theme='dark'] .mood-key{background:#3d3428;border-color:var(--rule,#5a4c38);color:var(--ink,#eddcc0)}" +
      ".mood-key.active{outline:2px solid var(--rubric,#7a2418);outline-offset:2px}" +
      ".mood-key .mood-lab{font-family:var(--font-book);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;line-height:1}" +
      ".mood-key[data-mood='level']{font-size:1.1rem}";
    document.head.appendChild(s);
  }
  function paint() {
    css();
    const pack = LAB[L()] || LAB.en;
    document.querySelectorAll(".mood-key[data-mood]").forEach(function (b) {
      const k = b.getAttribute("data-mood");
      if (!MAP[k]) return;
      b.innerHTML = MAP[k] + '<span class="mood-lab">' + pack[k] + "</span>";
    });
  }
  function boot() {
    paint();
    setTimeout(paint, 400);
    setTimeout(paint, 1600);
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () { setTimeout(paint, 30); });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 120);
})();
