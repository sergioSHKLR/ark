(function () {
  const PASSAGE = {
    morning: {
      title: "Matthew 3:16–17",
      body: "And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him: and lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased."
    },
    midday: {
      title: "Luke 24:27",
      body: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself."
    }
  };

  function css() {
    if (document.getElementById("office-tidy-css")) return;
    const s = document.createElement("style");
    s.id = "office-tidy-css";
    s.textContent =
      "#demoStage{display:none!important}" +
      "#pane-day .desk,#pane-day #ourFather,#pane-morning #bpFilm{display:none!important}" +
      "#pane-day .lesson-keep{display:none}" +
      ".attach-sheet{display:flex;gap:.4rem;margin:.35rem 0 .15rem}" +
      ".attach-sheet[hidden]{display:none!important}" +
      ".attach-sheet .key{flex:1;font-size:.78rem}";
    document.head.appendChild(s);
  }

  function setPassage(slot) {
    const pack = PASSAGE[slot];
    if (!pack) return;
    if (slot === "morning") {
      const t = document.getElementById("lessonTitle");
      const b = document.getElementById("lessonTeach");
      if (t) t.textContent = pack.title;
      if (b) b.textContent = pack.body;
    }
    if (slot === "midday") {
      const t = document.getElementById("middayTitle");
      const b = document.getElementById("middayBody");
      if (t) t.textContent = pack.title;
      if (b) b.textContent = pack.body;
    }
  }

  function hideDupes() {
    const stage = document.getElementById("demoStage");
    if (stage) {
      stage.hidden = true;
      stage.innerHTML = "";
    }
    const father = document.getElementById("ourFather");
    const morning = document.getElementById("pane-morning");
    if (father && morning && father.closest("#pane-day")) morning.appendChild(father);
    setPassage("morning");
    setPassage("midday");
  }

  function sheetFor(kind, pane) {
    let row = document.querySelector('[data-entry="' + pane + '"] .attach-sheet[data-kind="' + kind + '"]');
    if (row) return row;
    const block = document.querySelector('[data-entry="' + pane + '"] .entry-media');
    if (!block) return null;
    row = document.createElement("div");
    row.className = "attach-sheet";
    row.setAttribute("data-kind", kind);
    row.hidden = true;
    row.innerHTML =
      '<button type="button" class="key ghost" data-src="camera">Camera</button>' +
      '<button type="button" class="key ghost" data-src="library">Library</button>';
    block.insertAdjacentElement("afterend", row);
    row.addEventListener("click", function (e) {
      const src = e.target.getAttribute("data-src");
      if (!src) return;
      const input = document.getElementById("attach-" + kind + "-" + pane);
      if (!input) return;
      if (src === "camera") input.setAttribute("capture", "environment");
      else input.removeAttribute("capture");
      input.click();
      row.hidden = true;
    });
    return row;
  }

  function bindAttach() {
    ["morning", "day", "night"].forEach(function (pane) {
      sheetFor("photo", pane);
      sheetFor("video", pane);
    });
    document.querySelectorAll("[data-photo],[data-video]").forEach(function (btn) {
      if (btn.getAttribute("data-split")) return;
      btn.setAttribute("data-split", "1");
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const pane = btn.getAttribute("data-photo") || btn.getAttribute("data-video");
          const kind = btn.hasAttribute("data-photo") ? "photo" : "video";
          const sheet = sheetFor(kind, pane);
          if (!sheet) return;
          document.querySelectorAll(".attach-sheet").forEach(function (el) {
            if (el !== sheet) el.hidden = true;
          });
          sheet.hidden = !sheet.hidden;
        },
        true
      );
    });
  }

  function boot() {
    css();
    hideDupes();
    bindAttach();
    setTimeout(hideDupes, 600);
    setTimeout(hideDupes, 1800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 220);
})();
