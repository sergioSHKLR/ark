(function () {
  function off() {
    try {
      const q = new URLSearchParams(location.search).get("demo");
      if (q === "0" || q === "off") {
        localStorage.removeItem("noah-demo");
        return true;
      }
      if (q === "1" || q === "on") return false;
    } catch (e) {}
    return localStorage.getItem("noah-demo") !== "1";
  }
  function hideDemoUi() {
    const input = document.getElementById("demoToggle");
    if (input) {
      const row = input.closest(".remind-row") || input.parentNode;
      if (row) row.style.display = "none";
    }
    document.querySelectorAll("label[for='demoToggle']").forEach(function (el) {
      const row = el.closest(".remind-row") || el.parentNode;
      if (row) row.style.display = "none";
    });
  }
  function apply() {
    hideDemoUi();
    if (!off()) return;
    const actions = document.getElementById("dayRailActions");
    if (actions) actions.hidden = true;
    const banner = document.getElementById("demoBanner");
    if (banner) banner.remove();
    const walk = document.getElementById("railWalk");
    const step = document.getElementById("railStep");
    if (walk) walk.hidden = true;
    if (step) step.hidden = true;
  }
  if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
    const m = document.createElement("meta");
    m.name = "mobile-web-app-capable";
    m.content = "yes";
    document.head.appendChild(m);
  }
  function boot() {
    apply();
    setTimeout(apply, 200);
    setTimeout(apply, 800);
    setTimeout(apply, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 80);
})();
