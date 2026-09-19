(function () {
  function css() {
    if (document.getElementById("scroll-btn-css")) return;
    const s = document.createElement("style");
    s.id = "scroll-btn-css";
    s.textContent =
      ".settings-btn,#settingsBtn{width:3.2rem;height:3.2rem;font-size:1.55rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;padding:0}" +
      ".masthead{position:relative}" +
      "#candleBtn{position:absolute;right:.35rem;top:.2rem}" +
      "#settingsBtn{position:absolute;left:.35rem;top:.2rem}";
    document.head.appendChild(s);
  }
  function paint() {
    css();
    const btn = document.getElementById("settingsBtn");
    if (btn) {
      btn.textContent = "\uD83D\uDCDC";
      btn.setAttribute("aria-label", "Settings");
    }
  }
  function boot() {
    paint();
    setTimeout(paint, 400);
    setTimeout(paint, 1400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
