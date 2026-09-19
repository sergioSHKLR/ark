(function () {
  function longDate() {
    if (typeof formatLongDate === "function") {
      try { return formatLongDate(new Date()); } catch (e) {}
    }
    const loc = localStorage.getItem("noah-lang") === "pt" ? "pt-BR" : "en-GB";
    return new Intl.DateTimeFormat(loc, {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
  }
  function place() {
    const head = document.querySelector(".masthead");
    const el = document.getElementById("dateLine");
    const ticks = document.getElementById("officeTicks");
    if (ticks) ticks.remove();
    if (!head || !el) return;
    const sub = head.querySelector(".subtitle");
    const rule = head.querySelector(".rule");
    el.className = "date-line date-line-under";
    if (sub && sub.nextSibling !== el) {
      if (rule) head.insertBefore(el, rule);
      else sub.insertAdjacentElement("afterend", el);
    }
    el.textContent = longDate();
  }
  function css() {
    if (document.getElementById("date-line-place-css")) return;
    const s = document.createElement("style");
    s.id = "date-line-place-css";
    s.textContent =
      ".date-line-under{display:block;text-align:center;max-width:22rem;margin:.35rem auto .15rem;font-size:.72rem;letter-spacing:.04em;line-height:1.45;color:var(--ink-soft)}" +
      "#officeTicks,.office-ticks{display:none!important}" +
      ".masthead > .date-line:first-child{display:none}";
    document.head.appendChild(s);
  }
  window.formatOfficeDate = function () { return longDate(); };
  window.renderDateLine = function () { place(); };
  function boot() {
    css();
    place();
    setTimeout(place, 300);
    setTimeout(place, 1200);
    setInterval(place, 30000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 120);
})();
