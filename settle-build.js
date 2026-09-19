function settleBuildLabel() {
  const line = document.getElementById("buildLine");
  if (line) line.textContent = (typeof lang === "string" && lang === "pt" ? "Vers\u00e3o 65" : "Build 65");
  const btn = document.getElementById("buildReload");
  if (btn) {
    btn.hidden = true;
    btn.style.display = "none";
  }
  const st = document.getElementById("buildStatus");
  if (st) st.textContent = "";
  const row = document.getElementById("demoToggle");
  if (row) {
    const box = row.closest(".remind-row") || row.parentNode;
    if (box && box.style) box.style.display = "none";
  }
}
settleBuildLabel();
setTimeout(settleBuildLabel, 400);
setTimeout(settleBuildLabel, 1600);
setTimeout(settleBuildLabel, 4000);
