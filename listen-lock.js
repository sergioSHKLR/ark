(function () {
  function onListen() {
    const btn = document.querySelector('.nav-bar button.active');
    return btn && btn.getAttribute("data-pane") === "listen";
  }
  const prev = window.showPane;
  window.showPane = function (name) {
    if (name === "listen") document.documentElement.setAttribute("data-listen", "1");
    else document.documentElement.removeAttribute("data-listen");
    if (typeof prev === "function") return prev(name);
  };
  const id = setInterval(function () {
    if (!onListen()) return;
    const listen = document.getElementById("pane-listen");
    const closed = document.getElementById("officeClosed");
    if (listen) listen.hidden = false;
    if (closed) closed.hidden = true;
    document.querySelectorAll(".pane").forEach(function (p) {
      if (p.id !== "pane-listen") p.hidden = true;
    });
  }, 400);
  window.addEventListener("pagehide", function () { clearInterval(id); });
})();
