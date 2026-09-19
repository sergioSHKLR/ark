(function () {
  function css() {
    if (document.getElementById("office-ticks-hide-css")) return;
    const s = document.createElement("style");
    s.id = "office-ticks-hide-css";
    s.textContent = "#officeTicks,.office-ticks{display:none!important}";
    document.head.appendChild(s);
  }
  function gone() {
    css();
    const el = document.getElementById("officeTicks");
    if (el) el.remove();
  }
  function boot() {
    gone();
    setTimeout(gone, 200);
    setTimeout(gone, 800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 60);
})();
