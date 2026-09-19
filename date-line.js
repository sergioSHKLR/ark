(function () {
  function longDate() {
    if (typeof formatLongDate === "function") {
      try {
        return formatLongDate(new Date());
      } catch (e) {}
    }
    const loc = (localStorage.getItem("noah-lang") === "pt") ? "pt-BR" : "en-GB";
    return new Intl.DateTimeFormat(loc, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }
  function paint() {
    const el = document.getElementById("dateLine");
    if (!el) return;
    el.textContent = longDate();
  }
  window.formatOfficeDate = function () {
    return longDate();
  };
  const prev = window.renderDateLine;
  window.renderDateLine = function () {
    paint();
  };
  function boot() {
    paint();
    setInterval(paint, 30000);
    setTimeout(paint, 400);
    setTimeout(paint, 1600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 120);
})();
