(function () {
  function css() {
    const old = document.getElementById("candle-flicker-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "candle-flicker-css";
    s.textContent =
      ".candle-btn{overflow:visible;z-index:4;width:3.2rem;height:3.2rem;background:transparent;border:0}" +
      ".candle-btn .candle-lit,.candle-btn .candle-unlit{display:none!important;visibility:hidden!important}" +
      ".candle-draw{position:absolute;inset:0;pointer-events:none}" +
      ".candle-holder{position:absolute;left:50%;bottom:3px;width:20px;height:5px;margin-left:-10px;border-radius:1px 1px 2px 2px;background:#6b5340;box-shadow:0 1px 0 #3d2e22}" +
      ".candle-holder::after{content:\"\";position:absolute;left:50%;bottom:4px;width:7px;height:3px;margin-left:-3.5px;background:#8a6d3b}" +
      ".candle-body{position:absolute;left:50%;bottom:8px;width:10px;height:17px;margin-left:-5px;background:linear-gradient(90deg,#efe3c4 0%,#f7edd4 42%,#d9c49a 100%);border-radius:1px 1px 0 0}" +
      ".candle-drip{position:absolute;left:50%;bottom:11px;width:4px;height:8px;margin-left:3px;background:#efe3c4;border-radius:0 0 3px 2px}" +
      ".candle-wick{position:absolute;left:50%;bottom:25px;width:2px;height:5px;margin-left:-1px;background:#2a2118;border-radius:1px}" +
      ".candle-flame{position:absolute;left:50%;bottom:28px;width:9px;height:13px;margin-left:-4.5px;border-radius:50% 50% 45% 45% / 62% 62% 38% 38%;background:radial-gradient(circle at 50% 72%, #fff8d8 0%, #ffc056 38%, #e06718 72%, transparent 82%);box-shadow:0 -2px 8px 4px rgba(255,176,64,.42),0 -5px 16px 8px rgba(255,140,30,.2);opacity:0}" +
      ".candle-btn.is-lit .candle-flame{opacity:1;animation:flame-flicker 1.15s ease-in-out infinite}" +
      ".candle-btn:not(.is-lit) .candle-wick{background:#4a3b2e;height:4px}" +
      "@keyframes flame-flicker{0%{transform:translateY(0) scaleY(1) scaleX(1);filter:brightness(1)}50%{transform:translateY(-1px) scaleY(1.06) scaleX(.97);filter:brightness(1.08)}100%{transform:translateY(0) scaleY(1) scaleX(1);filter:brightness(1)}}" +
      "@media (prefers-reduced-motion: reduce){.candle-flame{animation:none!important}}";
    document.head.appendChild(s);
  }
  function isDark() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark") return true;
    if (attr === "light") return false;
    const stored = localStorage.getItem("noah-theme") || "system";
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function mount() {
    css();
    const btn = document.getElementById("candleBtn");
    if (!btn) return;
    if (!btn.querySelector(".candle-draw")) {
      const draw = document.createElement("span");
      draw.className = "candle-draw";
      draw.setAttribute("aria-hidden", "true");
      draw.innerHTML =
        '<span class="candle-flame"></span><span class="candle-wick"></span><span class="candle-drip"></span><span class="candle-body"></span><span class="candle-holder"></span>';
      btn.appendChild(draw);
    }
    const lit = isDark();
    btn.classList.toggle("is-lit", lit);
    document.documentElement.setAttribute("data-candle", lit ? "lit" : "unlit");
  }
  function boot() {
    mount();
    [200, 600, 1400].forEach(function (ms) { setTimeout(mount, ms); });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("#candleBtn, #themeChoice")) setTimeout(mount, 40);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
