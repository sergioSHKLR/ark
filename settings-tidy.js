(function () {
  const BUILD = 70;
  function liveToken() {
    return typeof driveToken === "string" && !!driveToken && driveToken !== "demo";
  }
  function driveButtons() {
    const on = liveToken();
    const conn = document.getElementById("driveConnect");
    if (conn) conn.style.display = on ? "none" : "";
    const gate = document.getElementById("connectCard");
    const main = document.getElementById("connectDriveMain");
    if (on) {
      if (gate) gate.hidden = true;
      return;
    }
    if (gate) {
      gate.hidden = false;
      gate.removeAttribute("hidden");
      if (gate.style) gate.style.display = "";
    }
    if (main) {
      main.hidden = false;
      if (main.style) main.style.display = "";
    }
  }
  function buildLine() {
    const line = document.getElementById("buildLine");
    if (line) line.textContent = (typeof lang === "string" && lang === "pt" ? "Vers\u00e3o " : "Build ") + BUILD;
    const st = document.getElementById("buildStatus");
    if (st) st.textContent = "";
    const btn = document.getElementById("buildReload");
    if (btn) {
      btn.hidden = true;
      btn.style.display = "none";
    }
  }
  function paint() {
    driveButtons();
    buildLine();
  }
  window.applyBuildLabels = buildLine;
  window.checkBuild = function () {
    buildLine();
    return Promise.resolve();
  };
  function boot() {
    paint();
    setInterval(paint, 1500);
    const settings = document.getElementById("settingsBtn");
    if (settings) settings.addEventListener("click", function () { setTimeout(paint, 30); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 200);
})();
