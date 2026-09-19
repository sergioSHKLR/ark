(function () {
  function css() {
    const old = document.getElementById("candle-flicker-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "candle-flicker-css";
    s.textContent =
      ".candle-btn{overflow:visible;z-index:6;width:3.2rem;height:3.2rem;background:transparent;border:0}" +
      ".candle-btn .candle-lit,.candle-btn .candle-unlit{display:none!important}" +
      ".candle-draw{position:absolute;inset:0;pointer-events:none}" +
      ".candle-holder{position:absolute;left:50%;bottom:3px;width:20px;height:5px;margin-left:-10px;background:#6b5340;z-index:1}" +
      ".candle-body{position:absolute;left:50%;bottom:8px;width:10px;height:17px;margin-left:-5px;background:linear-gradient(90deg,#efe3c4,#f7edd4 45%,#d9c49a);z-index:1}" +
      ".candle-drip{position:absolute;left:50%;bottom:11px;width:4px;height:8px;margin-left:3px;background:#efe3c4;z-index:2}" +
      ".candle-wick{position:absolute;left:50%;bottom:25px;width:2px;height:5px;margin-left:-1px;background:#2a2118;z-index:2}" +
      ".candle-flame{position:absolute;left:50%;bottom:27px;width:12px;height:17px;margin-left:-6px;z-index:5;border-radius:50% 50% 45% 45%/62% 62% 38% 38%;background:radial-gradient(circle at 50% 70%,#fffce8 0%,#ffc056 38%,#e25a12 76%,transparent 86%);box-shadow:0 0 12px 7px rgba(255,170,50,.75),0 0 24px 14px rgba(255,120,20,.4);opacity:0}" +
      ".candle-btn.is-lit .candle-flame,html[data-theme='dark'] .candle-flame{opacity:1;animation:flame-flicker 1.15s ease-in-out infinite}" +
      "@keyframes flame-flicker{0%{transform:scale(1)}50%{transform:translateY(-1px) scale(1.06)}100%{transform:scale(1)}}" +
      "@media (prefers-reduced-motion: reduce){.candle-flame{animation:none!important}}";
    document.head.appendChild(s);
  }
  function isDark() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light") return false;
    if (attr === "dark") return true;
    const stored = localStorage.getItem("noah-theme") || "system";
    if (stored === "light") return false;
    if (stored === "dark") return true;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function mount() {
    css();
    const btn = document.getElementById("candleBtn");
    if (!btn) return;
    if (!btn.querySelector(".candle-draw")) {
      const draw = document.createElement("span");
      draw.className = "candle-draw";
      draw.innerHTML =
        '<span class="candle-holder"></span><span class="candle-body"></span><span class="candle-drip"></span><span class="candle-wick"></span><span class="candle-flame"></span>';
      btn.appendChild(draw);
    }
    btn.classList.toggle("is-lit", isDark());
  }
  function boot() {
    mount();
    [120, 400, 1200].forEach(function (ms) { setTimeout(mount, ms); });
    document.addEventListener("click", function () { setTimeout(mount, 40); });
    new MutationObserver(mount).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
