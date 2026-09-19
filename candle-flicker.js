(function () {
  function css() {
    if (document.getElementById("candle-flicker-css")) return;
    const s = document.createElement("style");
    s.id = "candle-flicker-css";
    s.textContent =
      ".candle-btn{overflow:visible;z-index:4}" +
      ".candle-flame{position:absolute;left:50%;top:6px;width:10px;height:16px;margin-left:-5px;pointer-events:none;opacity:0;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%, #fff6d0 0%, #ffb347 35%, #e25a12 70%, transparent 80%);box-shadow:0 0 10px 6px rgba(255,160,40,.55),0 0 22px 12px rgba(255,120,20,.28)}" +
      ".candle-btn.is-lit .candle-flame,html[data-theme='dark'] .candle-flame{opacity:1;animation:flame-flicker .18s infinite}" +
      "@media (prefers-color-scheme: dark){html:not([data-theme='light']) .candle-flame{opacity:1;animation:flame-flicker .18s infinite}}" +
      "@keyframes flame-flicker{0%{transform:scaleY(1) scaleX(1) translateY(0);filter:brightness(1)}30%{transform:scaleY(1.18) scaleX(.86) translateY(-1px);filter:brightness(1.25)}55%{transform:scaleY(.88) scaleX(1.08) translateY(1px);filter:brightness(.85)}100%{transform:scaleY(1.05) scaleX(.95) translateY(0);filter:brightness(1.1)}}" +
      "@media (prefers-reduced-motion: reduce){.candle-flame{animation:none!important}}";
    document.head.appendChild(s);
  }
  function isDark() {
    const theme = localStorage.getItem("noah-theme") || "system";
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function mount() {
    css();
    const btn = document.getElementById("candleBtn");
    if (!btn) return;
    if (!btn.querySelector(".candle-flame")) {
      const flame = document.createElement("span");
      flame.className = "candle-flame";
      flame.setAttribute("aria-hidden", "true");
      btn.appendChild(flame);
    }
    btn.classList.toggle("is-lit", isDark());
  }
  function boot() {
    mount();
    setTimeout(mount, 400);
    setTimeout(mount, 1600);
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#candleBtn")) setTimeout(mount, 30);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
