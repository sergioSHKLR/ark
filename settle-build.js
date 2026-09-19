function settleBuildLabel() {
  const line = document.getElementById("buildLine");
  if (line) line.textContent = "Build 65";
  const btn = document.getElementById("buildReload");
  if (btn) {
    btn.hidden = true;
    btn.style.display = "none";
  }
  const st = document.getElementById("buildStatus");
  if (st) st.textContent = "";
}
settleBuildLabel();
setTimeout(settleBuildLabel, 400);
setTimeout(settleBuildLabel, 1600);
setTimeout(settleBuildLabel, 4000);
