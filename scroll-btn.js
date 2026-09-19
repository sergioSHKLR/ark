(function () {
  function css() {
    const old = document.getElementById("scroll-btn-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "scroll-btn-css";
    s.textContent =
      ".masthead{position:relative;padding-left:3.4rem;padding-right:3.4rem}" +
      "#candleBtn{position:absolute;left:.2rem;top:.15rem;right:auto;width:3.2rem;height:3.2rem;z-index:6}" +
      "#settingsBtn.settings-btn,.settings-btn#settingsBtn{" +
      "position:absolute;right:.2rem;top:.15rem;left:auto;width:3.2rem;height:3.2rem;" +
      "font-size:1.55rem;line-height:1;z-index:6;background:transparent;border:0;padding:0;" +
      "display:inline-flex;align-items:center;justify-content:center}";
    document.head.appendChild(s);
  }
  function place() {
    css();
    const head = document.querySelector(".masthead");
    const scroll = document.getElementById("settingsBtn");
    const candle = document.getElementById("candleBtn");
    if (scroll) {
      scroll.textContent = "\uD83D\uDCDC";
      scroll.style.left = "auto";
      scroll.style.right = ".2rem";
      if (head && scroll.parentNode !== head) head.appendChild(scroll);
    }
    if (candle) {
      candle.style.left = ".2rem";
      candle.style.right = "auto";
      if (head && candle.parentNode !== head) head.appendChild(candle);
    }
  }
  function boot() {
    place();
    setTimeout(place, 300);
    setTimeout(place, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
