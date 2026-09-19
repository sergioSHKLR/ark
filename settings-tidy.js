(function () {
  const BUILD = 65;
  function connected() {
    if (typeof driveToken === "string" && driveToken && driveToken !== "demo") return true;
    try {
      if (localStorage.getItem("noah-drive-consented") === "1") return true;
      if (localStorage.getItem("noah-drive-file-id")) return true;
      if (localStorage.getItem("noah-drive-synced")) return true;
    } catch (e) {}
    const st = document.getElementById("driveStatus");
    const txt = st ? (st.textContent || "").toLowerCase() : "";
    return /conectad|connected|sincroniz/.test(txt);
  }
  function driveButtons() {
    const on = connected();
    const conn = document.getElementById("driveConnect");
    if (conn) conn.style.display = on ? "none" : "";
    const main = document.getElementById("connectDriveMain");
    if (main && on) {
      const gate = document.getElementById("connectCard");
      if (gate) gate.hidden = true;
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
  window.checkBuild = function () { buildLine(); return Promise.resolve(); };
  function boot() {
    paint();
    setInterval(paint, 1500);
    const settings = document.getElementById("settingsBtn");
    if (settings) settings.addEventListener("click", function () { setTimeout(paint, 30); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 200);
})();
