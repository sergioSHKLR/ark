(function () {
  function listening() {
    const btn = document.querySelector('.nav-bar button[data-pane="listen"]');
    return !!(btn && btn.classList.contains("active"));
  }
  const prevShow = window.showPane;
  window.showPane = function (name) {
    if (name === "listen") document.documentElement.setAttribute("data-listen", "1");
    else document.documentElement.removeAttribute("data-listen");
    if (typeof prevShow === "function") return prevShow(name);
  };
  document.addEventListener(
    "click",
    function (e) {
      const b = e.target.closest && e.target.closest(".nav-bar button");
      if (!b) return;
      if (b.getAttribute("data-pane") === "listen") document.documentElement.setAttribute("data-listen", "1");
      else document.documentElement.removeAttribute("data-listen");
    },
    true
  );
})();
