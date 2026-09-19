const FORM_URL_KEY = "noah-form-url";
const DEMO_FORM = "https://sergioshklr.github.io/ark/porch.html";

function formUrlValue() {
  const input = document.getElementById("formUrl");
  const typed = input && input.value.trim();
  return typed || localStorage.getItem(FORM_URL_KEY) || (localStorage.getItem("noah-demo") === "1" ? DEMO_FORM : "");
}

function bindFormUrl() {
  const input = document.getElementById("formUrl");
  if (!input) return;
  if (localStorage.getItem("noah-demo") === "1" && !localStorage.getItem(FORM_URL_KEY)) {
    localStorage.setItem(FORM_URL_KEY, DEMO_FORM);
  }
  input.value = localStorage.getItem(FORM_URL_KEY) || "";
  input.addEventListener("change", function () {
    localStorage.setItem(FORM_URL_KEY, input.value.trim());
  });
}

function closeShare() {
  const modal = document.getElementById("shareModal");
  if (modal) { modal.classList.remove("open"); modal.style.display = "none"; }
}

function sharePayload(includeNote) {
  const pane = sharePayload.pane || "morning";
  const period = paneToPeriod(pane);
  const now = TIMENOW();
  const bits = [curriculumShareText(period, now.date)];
  if (includeNote) {
    const note = officeNoteText(pane);
    if (note) bits.push(note);
  }
  bits.push(t(periodLabelKey(period)) + " \u00b7 " + now.date);
  const url = formUrlValue();
  return {
    title: (lang === "pt" ? "Arca" : "Ark") + " \u00b7 " + t(periodLabelKey(period)),
    text: bits.filter(Boolean).join("\n\n"),
    url: url || undefined,
  };
}

function doSystemShare(includeNote) {
  const payload = sharePayload(includeNote);
  const data = { title: payload.title, text: payload.text };
  if (payload.url) data.url = payload.url;
  const pane = sharePayload.pane;
  const file = pane && pendingFiles[pane];
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];
  const canShare = navigator.share && (!navigator.canShare || navigator.canShare(data));
  const send = canShare ? navigator.share(data) : navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(payload.title + "\n\n" + payload.text) : Promise.reject(new Error("share"));
  return Promise.resolve(send).then(function () {
    if (!canShare) setShareStatus(t("copied"));
    else setShareStatus("");
  }).catch(function (err) {
    if (err && err.name === "AbortError") return;
    const fallback = payload.title + "\n\n" + payload.text;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(fallback).then(function () { setShareStatus(t("copied")); });
    }
    setShareStatus(t("driveErr"));
  });
}

function setShareStatus(msg) {
  const el = document.getElementById("shareStatus");
  if (el) el.textContent = msg || "";
}

function openShareModal(pane, reflectionOnly) {
  sharePayload.pane = pane;
  const modal = document.getElementById("shareModal");
  if (!modal) return;
  const box = document.getElementById("shareInclude");
  if (box) { box.checked = !!reflectionOnly; box.disabled = false; }
  setShareStatus("");
  modal.classList.add("open");
  modal.style.display = "flex";
}

function bindShare() {
  bindFormUrl();
  const go = document.getElementById("shareGo");
  if (go) go.addEventListener("click", function () {
    const box = document.getElementById("shareInclude");
    const include = !!(box && box.checked);
    if (include && !officeNoteText(sharePayload.pane || "")) { setShareStatus(t("shareNeedNote")); return; }
    doSystemShare(include);
  });
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openShareModal(btn.getAttribute("data-share"), officeAccess(btn.getAttribute("data-share")) === "past");
    });
  });
}

window.addEventListener("load", function () {
  ["office-year.js", "ui63.js", "settle-build.js", "onboard-pt.js", "listen-desk.js", "listen-lock.js", "day-rail.js", "candle-flicker.js", "office-tidy.js", "mood-marks.js", "scroll-btn.js", "overlay-i18n.js", "wide-viewport.js", "lang-sweep.js", "date-line.js"].forEach(function (src) {
    const id = src.replace(".", "-");
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = src + "?v=78";
    document.body.appendChild(s);
  });
});
