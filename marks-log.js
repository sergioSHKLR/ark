(function () {
  function css() {
    if (document.getElementById("marks-log-css")) return;
    const s = document.createElement("style");
    s.id = "marks-log-css";
    s.textContent =
      "#pane-morning .marks-line,#pane-day .marks-line,#pane-night .marks-line," +
      "#pane-morning [data-marks],#pane-day [data-marks],#pane-night [data-marks]," +
      ".share-responses{display:none!important}";
    document.head.appendChild(s);
  }
  function paintLog() {
    document.querySelectorAll("#pane-log .log-day").forEach(function (day) {
      if (day.querySelector("[data-marks]")) return;
      const line = document.createElement("p");
      line.className = "marks-line";
      line.setAttribute("data-marks", "");
      line.textContent = typeof t === "function" ? t("marksLine", { pray: 0, heart: 0, up: 0 }) : "\uD83D\uDE4F 0 \u00b7 \u2764\uFE0F 0 \u00b7 \uD83D\uDC4D 0";
      day.appendChild(line);
    });
  }
  function boot() {
    css();
    paintLog();
    setTimeout(paintLog, 800);
    setInterval(paintLog, 4000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 200);
})();
