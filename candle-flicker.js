(function () {
  function css() {
    if (document.getElementById("candle-flicker-css")) {
      document.getElementById("candle-flicker-css").remove();
    }
    const s = document.createElement("style");
    s.id = "candle-flicker-css";
    s.textContent =
      ".candle-btn{overflow:visible;z-index:4}" +
      ".candle-flame{position:absolute;left:50%;top:-2px;width:8px;height:12px;margin-left:-4px;pointer-events:none;opacity:0;border-radius:50% 50% 45% 45% / 62% 62% 38% 38%;background:radial-gradient(circle at 50% 72%, #fff8d8 0%, #ffc056 38%, #e06718 72%, transparent 82%);box-shadow:0 -2px 8px 4px rgba(255,176,64,.42),0 -4px 16px 8px rgba(255,140,30,.18)}" +
      ".candle-btn.is-lit .candle-flame,html[data-theme='dark'] .candle-flame{opacity:1;animation:flame-flicker 1.15s ease-in-out infinite}" +
      "@media (prefers-color-scheme: dark){html:not([data-theme='light']) .candle-flame{opacity:1;animation:flame-flicker 1.15s ease-in-out infinite}}" +
      "@keyframes flame-flicker{0%{transform:translateY(0) scaleY(1) scaleX(1);filter:brightness(1)}50%{transform:translateY(-1px) scaleY(1.06) scaleX(.97);filter:brightness(1.08)}100%{transform:translateY(0) scaleY(1) scaleX(1);filter:brightness(1)}}" +
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
