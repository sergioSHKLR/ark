const DRAFT_STORE = "noah-drafts-v1";

function loadDrafts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DRAFT_STORE) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveDrafts(map) {
  localStorage.setItem(DRAFT_STORE, JSON.stringify(map));
}

function draftKey(date, period, useLang) {
  return date + "|" + period + "|" + (useLang || lang);
}

function getDraft(date, period, useLang) {
  const map = loadDrafts();
  const row = map[draftKey(date, period, useLang)];
  return row && typeof row.text === "string" ? row : null;
}

function setDraft(date, period, text, useLang) {
  const map = loadDrafts();
  const key = draftKey(date, period, useLang);
  if (!String(text || "").trim()) {
    delete map[key];
  } else {
    map[key] = {
      text: String(text),
      updatedAt: new Date().toISOString(),
    };
  }
  saveDrafts(map);
}

function clearDraft(date, period, useLang) {
  const map = loadDrafts();
  delete map[draftKey(date, period, useLang)];
  saveDrafts(map);
}

function dropClosedDrafts(now) {
  now = now || TIMENOW();
  const map = loadDrafts();
  let dropped = false;
  Object.keys(map).forEach(function (key) {
    const parts = key.split("|");
    const date = parts[0];
    const period = parts[1];
    if (!date || !period) return;
    if (now.open && now.date === date && now.period === period) return;
    if (date > now.date) return;
    if (date === now.date && !periodHasEnded(date, period, now)) return;
    delete map[key];
    dropped = true;
  });
  if (dropped) saveDrafts(map);
  return dropped;
}
