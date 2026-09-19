(function () {
  if (document.getElementById("candle-flicker-css")) return;
  const s = document.createElement("style");
  s.id = "candle-flicker-css";
  s.textContent =
    ".candle-btn{overflow:visible}" +
    ".candle-btn::after{content:\"\";position:absolute;left:50%;top:42%;width:2.8rem;height:2.8rem;transform:translate(-50%,-55%);border-radius:50%;pointer-events:none;opacity:0;background:radial-gradient(circle,rgba(255,186,80,.55) 0%,rgba(255,140,40,.18) 42%,transparent 70%)}" +
    "html[data-theme='dark'] .candle-btn::after," +
    "html[data-theme='dark'] .candle-btn .candle-lit," +
    "@media (prefers-color-scheme: dark){html:not([data-theme='light']) .candle-btn::after{opacity:.9}}" +
    "html[data-theme='dark'] .candle-btn::after{opacity:.95;animation:candle-glow 1.8s ease-in-out infinite}" +
    "html[data-theme='dark'] .candle-btn .candle-lit{display:inline;animation:candle-flicker .28s steps(2,end) infinite;filter:drop-shadow(0 0 6px rgba(255,170,60,.85)) drop-shadow(0 0 14px rgba(255,120,20,.35))}" +
    "@media (prefers-color-scheme: dark){html:not([data-theme='light']) .candle-btn .candle-lit{display:inline;animation:candle-flicker .28s steps(2,end) infinite;filter:drop-shadow(0 0 6px rgba(255,170,60,.85)) drop-shadow(0 0 14px rgba(255,120,20,.35))}html:not([data-theme='light']) .candle-btn::after{opacity:.95;animation:candle-glow 1.8s ease-in-out infinite}}" +
    "@keyframes candle-flicker{0%{transform:translateY(0) scale(1);opacity:.92}40%{transform:translateY(-.04rem) scale(1.06);opacity:1}70%{transform:translateY(.02rem) scale(.96);opacity:.82}100%{transform:translateY(0) scale(1);opacity:.94}}" +
    "@keyframes candle-glow{0%{opacity:.55;transform:translate(-50%,-55%) scale(.92)}50%{opacity:1;transform:translate(-50%,-58%) scale(1.08)}100%{opacity:.6;transform:translate(-50%,-55%) scale(.95)}}" +
    "@media (prefers-reduced-motion: reduce){.candle-btn::after,.candle-btn .candle-lit{animation:none!important}}";
  document.head.appendChild(s);
})();
