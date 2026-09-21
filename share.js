const FORM_URL_KEY = "noah-form-url";

function formUrlValue() {
  const input = document.getElementById("formUrl");
  const typed = input && input.value.trim();
  return typed || localStorage.getItem(FORM_URL_KEY) || "";
}

function bindFormUrl() {
  const input = document.getElementById("formUrl");
  if (!input) return;
  input.value = localStorage.getItem(FORM_URL_KEY) || "";
  input.addEventListener("change", function () {
    localStorage.setItem(FORM_URL_KEY, input.value.trim());
  });
}

function closeShare() {
  const modal = document.getElementById("shareModal");
  if (modal) { modal.classList.remove("open"); modal.style.display = "none"; }
}

function porchShareUrl(includeNote) {
  const pane = sharePayload.pane || "morning";
  const period = typeof paneToPeriod === "function" ? paneToPeriod(pane) : pane;
  const now = typeof TIMENOW === "function" ? TIMENOW() : { date: "" };
  const office = period === "midday" || period === "day" ? "day" : period === "night" ? "night" : "morning";
  let hash = (now.date || "") + "/" + office;
  if (includeNote && typeof officeNoteText === "function") {
    const note = officeNoteText(pane);
    if (note && String(note).trim()) {
      hash += "&n=" + encodeURIComponent(String(note).trim().slice(0, 400));
    }
  }
  const here = new URL(location.href);
  const base = here.origin + here.pathname.replace(/[^/]+$/, "") + "porch.html";
  return base + "#" + hash;
}

function sharePayload(includeNote) {
  const pane = sharePayload.pane || "morning";
  const period = typeof paneToPeriod === "function" ? paneToPeriod(pane) : pane;
  const title = (typeof lang === "string" && lang === "pt" ? "Arca" : "Ark") +
    " \u00b7 " + (typeof t === "function" ? t(periodLabelKey(period)) : period);
  const url = porchShareUrl(includeNote);
  return { title: title, text: title, url: url };
}

function doSystemShare(includeNote) {
  const payload = sharePayload(includeNote);
  const data = { title: payload.title, text: payload.text, url: payload.url };
  const line = payload.title + "\n" + payload.url;
  const canShare = navigator.share && (!navigator.canShare || navigator.canShare({ title: payload.title, text: payload.text, url: payload.url }));
  const send = canShare
    ? navigator.share(data)
    : navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(line)
      : Promise.reject(new Error("share"));
  return Promise.resolve(send).then(function () {
    if (!canShare) setShareStatus(t("copied"));
    else setShareStatus("");
    closeShare();
  }).catch(function (err) {
    if (err && err.name === "AbortError") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(line).then(function () { setShareStatus(t("copied")); });
    }
    setShareStatus(t("driveErr"));
  });
}

function setShareStatus(msg) {
  const el = document.getElementById("shareStatus");
  if (el) el.textContent = msg || "";
}

function openShareModal(pane) {
  sharePayload.pane = pane;
  const modal = document.getElementById("shareModal");
  if (!modal) return;
  const box = document.getElementById("shareInclude");
  if (box) { box.checked = false; box.disabled = false; }
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
    if (include && typeof officeNoteText === "function" && !officeNoteText(sharePayload.pane || "")) {
      setShareStatus(t("shareNeedNote"));
      return;
    }
    doSystemShare(include);
  });
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openShareModal(btn.getAttribute("data-share"));
    });
  });
}

window.addEventListener("load", function () {});
