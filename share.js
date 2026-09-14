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
  if (modal) {
    modal.classList.remove("open");
    modal.style.display = "none";
  }
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
  bits.push(t(periodLabelKey(period)) + " · " + now.date);
  const url = formUrlValue();
  return {
    title: (lang === "pt" ? "Arca" : "Ark") + " · " + t(periodLabelKey(period)),
    text: bits.filter(Boolean).join("\n\n"),
    url: url || undefined,
  };
}

function doSystemShare(includeNote) {
  const payload = sharePayload(includeNote);
  const canShare =
    navigator.share &&
    (!navigator.canShare || navigator.canShare({ text: payload.text }));
  const send = canShare
    ? navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      })
    : navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(
          payload.title + "\n\n" + payload.text,
        )
      : Promise.reject(new Error("share"));
  return Promise.resolve(send)
    .then(function () {
      if (!canShare) setShareStatus(t("copied"));
      else setShareStatus("");
    })
    .catch(function (err) {
      if (err && err.name === "AbortError") return;
      const fallback = payload.title + "\n\n" + payload.text;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(fallback).then(function () {
          setShareStatus(t("copied"));
        });
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
  if (box) {
    box.checked = !!reflectionOnly;
    box.disabled = false;
  }
  setShareStatus("");
  modal.classList.add("open");
  modal.style.display = "flex";
}

function bindShare() {
  bindFormUrl();
  const go = document.getElementById("shareGo");
  if (go)
    go.addEventListener("click", function () {
      const box = document.getElementById("shareInclude");
      const include = !!(box && box.checked);
      if (include && !officeNoteText(sharePayload.pane || "")) {
        setShareStatus(t("shareNeedNote"));
        return;
      }
      doSystemShare(include);
    });
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const pane = btn.getAttribute("data-share");
      openShareModal(pane, officeAccess(pane) === "past");
    });
  });
}
