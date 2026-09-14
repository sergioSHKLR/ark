const STORE = "noah-journal-v2";
const THEME_KEY = "noah-theme";
const DRIVE_CLIENT_KEY = "noah-drive-client-id";
const DRIVE_FILE_KEY = "noah-drive-file-id";
const DRIVE_SYNC_KEY = "noah-drive-synced";
const DRIVE_FILE_NAME = "ark-journal.json";
let DRIVE_SCOPE = typeof SCOPE_FILE !== "undefined" ? SCOPE_FILE : "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata";
const APP_BUILD = 61;
const DRIVE_CONSENT_KEY = "noah-drive-consented";

let driveToken = "";
let driveEscalated = false;
let driveAuthBusy = false;
let drivePromptConsent = false;
let theme = localStorage.getItem(THEME_KEY) || "system";
if (theme !== "light" && theme !== "dark") theme = "system";
let filmList = [];

function applyTheme() {
  if (theme === "light" || theme === "dark")
    document.documentElement.setAttribute("data-theme", theme);
  else document.documentElement.removeAttribute("data-theme");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  meta.setAttribute("content", dark ? "#1a1612" : "#000000");
  const bar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]'
  );
  if (bar) bar.setAttribute("content", dark ? "black-translucent" : "black");
}
applyTheme();

function applyAppName() {
  const name = lang === "pt" ? "Arca" : "Ark";
  document.title = name;
  const word = document.querySelector(".wordmark");
  if (word) word.textContent = name;
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) settingsBtn.setAttribute("aria-label", t("settingsBtn"));
  applyLang();
  applyBuildLabels();
  renderDateLine();
  const apple = document.querySelector(
    'meta[name="apple-mobile-web-app-title"]',
  );
  document.documentElement.setAttribute("dir", "ltr");
  if (apple) apple.setAttribute("content", name);
  const man = document.querySelector('link[rel="manifest"]');
  if (man)
    man.setAttribute(
      "href",
      lang === "pt" ? "manifest-pt.json" : "manifest.json",
    );
}
applyAppName();

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function renderLesson() {
  const signed = !!driveToken;
  const lesson = signed ? pickLesson() : null;
  const loc = lessonLoc(lesson);
  const wit = quoteLoc(lessonWitness(lesson));
  const morningOk = signed && officeAccess("morning") !== "future";
  const dayOk = signed && officeAccess("day") !== "future";
  const nightOk = signed && officeAccess("night") !== "future";
  const morning = document.getElementById("lessonMorning");
  if (morning) morning.hidden = !loc || !morningOk;
  setText("lessonTitle", morningOk && loc ? loc.title : "");
  setText("lessonTeach", morningOk && loc ? loc.teach : "");
  setText("lessonSrc", morningOk && wit ? wit.src : "");
  setText("lessonText", morningOk && wit ? wit.text : "");
  setText("middayTitle", dayOk && loc ? loc.title : "");
  setText("middayBody", dayOk && loc ? loc.teach : "");
  setText("lessonKeep", dayOk && loc ? loc.keep : "");
  setText("nightTitle", nightOk && loc ? loc.title : "");
  setText("lessonClose", nightOk && loc ? loc.close : "");
  const box = document.getElementById("lessonWitness");
  if (box) box.hidden = !wit || !morningOk;
  const film = document.getElementById("morningFilm");
  if (film) film.hidden = !morningOk;
  const father = document.getElementById("ourFather");
  if (father) father.hidden = !morningOk;
  const reflect = document.getElementById("middayReflect");
  if (reflect) reflect.hidden = !dayOk;
  const desk = document.querySelector("#pane-day .desk");
  if (desk) desk.hidden = !dayOk;
  const keep = document.querySelector("#pane-day .lesson-keep");
  if (keep) keep.hidden = !dayOk;
  const close = document.querySelector("#pane-night .lesson-close");
  if (close) close.hidden = !nightOk;
  const sleep = document.querySelector("#pane-night .sleep-row");
  if (sleep) sleep.hidden = !nightOk;
  renderMarks();
}

function renderOurFather() {
  const pack =
    typeof OUR_FATHER !== "undefined" && OUR_FATHER[lang]
      ? OUR_FATHER[lang]
      : typeof OUR_FATHER !== "undefined"
        ? OUR_FATHER.en
        : null;
  if (!pack) return;
  const head = document.getElementById("ourFatherHead");
  const src = document.getElementById("ourFatherSrc");
  const text = document.getElementById("ourFatherText");
  if (head) head.textContent = pack.head;
  if (src) src.textContent = pack.src;
  if (text)
    text.innerHTML = pack.lines
      .map(function (line) {
        return "<p>" + line + "</p>";
      })
      .join("");
}

function syncMediaLabels() {
  const chantBtn = document.getElementById("chantPlay");
  if (chantBtn) chantBtn.textContent = t(chantPlaying ? "pause" : "play");
  const noiseBtn = document.getElementById("audioActionBtn");
  if (noiseBtn) noiseBtn.textContent = t(noisePlaying ? "pause" : "play");
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickReading() {
  const list = typeof READINGS !== "undefined" ? READINGS : [];
  if (!list.length) return null;
  return list[hashStr(todayKey()) % list.length];
}

function dailyLoc() {
  const r = pickReading();
  if (!r) return null;
  const extra =
    lang === "pt" && typeof READING_PT !== "undefined" ? READING_PT[r.id] : null;
  return extra || { src: r.src, text: r.text };
}

function renderReading() {
  const btn = document.getElementById("dailyReadingBtn");
  if (!btn) return;
  const loc = dailyLoc();
  if (!loc) {
    btn.hidden = true;
    btn.textContent = "";
    return;
  }
  btn.hidden = false;
  btn.textContent = loc.src;
}

function daysSinceEpoch() {
  const a = new Date(FILM_EPOCH + "T00:00:00");
  const b = new Date();
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((b - a) / 86400000));
}

function todaysFilm() {
  if (!filmList.length) return null;
  return filmList[daysSinceEpoch() % filmList.length];
}

function renderFilm() {
  const film = todaysFilm();
  const titleEl = document.getElementById("filmTitle");
  const refEl = document.getElementById("filmRef");
  const footEl = document.getElementById("filmFoot");
  const mount = document.getElementById("filmMount");
  if (!titleEl || !mount) return;
  if (!driveToken || officeAccess("morning") === "future") {
    titleEl.textContent = "";
    if (refEl) refEl.textContent = "";
    if (footEl) footEl.textContent = "";
    mount.innerHTML = "";
    return;
  }
  if (!film) {
    titleEl.textContent = "";
    if (refEl) refEl.textContent = "";
    if (footEl) footEl.textContent = "";
    mount.innerHTML = "";
    return;
  }
  const pack = film.title || {};
  const yt = film.yt || {};
  const usePt = lang === "pt" && yt.pt;
  const id = usePt ? yt.pt : yt.en;
  titleEl.textContent = lang === "pt" && pack.pt ? pack.pt : pack.en || "";
  if (refEl) refEl.textContent = film.scripture || "";
  if (footEl)
    footEl.textContent = usePt ? t("filmFoot") : lang === "pt" ? t("filmCaption") : t("filmFoot");
  mount.innerHTML = "";
  if (!id) return;
  const iframe = document.createElement("iframe");
  const start = Number(film.start) || 0;
  const end = Number(film.end) || 0;
  iframe.src =
    "https://www.youtube-nocookie.com/embed/" +
    id +
    "?rel=0&modestbranding=1&playsinline=1&fs=1&iv_load_policy=3" +
    (start > 0 ? "&start=" + start : "") +
    (end > start ? "&end=" + end : "") +
    (usePt ? "" : "&cc_load_policy=1&cc_lang_pref=en");
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";
  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("webkitallowfullscreen", "");
  iframe.setAttribute("mozallowfullscreen", "");
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.title = titleEl.textContent;
  mount.appendChild(iframe);
}

async function initFilm() {
  try {
    const res = await fetch("films.json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      filmList = Array.isArray(data.films) ? data.films : [];
    }
  } catch (e) {}
  renderFilm();
}

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "{}");
  } catch (e) {
    return {};
  }
}

function saveJournal(data) {
  localStorage.setItem(STORE, JSON.stringify(data));
  renderLog();
}

let driveSyncTimer = 0;
let tokenClient = null;
let driveBusy = false;
let driveAgain = false;

function driveClientId() {
  const input = document.getElementById("driveClientId");
  const typed = input && input.value.trim();
  return (
    typed ||
    localStorage.getItem(DRIVE_CLIENT_KEY) ||
    window.NOAH_DRIVE_CLIENT_ID ||
    ""
  );
}

function setDriveStatus(msg) {
  const el = document.getElementById("driveStatus");
  if (el) el.textContent = msg || "";
  const gate = document.getElementById("connectStatus");
  if (gate) gate.textContent = msg || "";
}

function formatSyncAt() {
  const at = localStorage.getItem(DRIVE_SYNC_KEY);
  if (!at) return "";
  const d = new Date(at);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString(lang === "pt" ? "pt-BR" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function journalStats(data) {
  const days = Object.keys(data || {})
    .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))
    .map((date) => ({
      date: date,
      checks: (data[date] && data[date].checks) || {},
      notes: (data[date] && data[date].notes) || {},
    }));
  const used = days.filter(dayUsed);
  const chars = days.reduce((n, d) => n + noteChars(d), 0);
  return { days: used.length, chars: chars };
}

function markDriveOk() {
  const when = formatSyncAt();
  const stats = journalStats(loadJournal());
  if (!stats.days && !stats.chars) {
    setDriveStatus(t("driveEmpty"));
    return;
  }
  const loc = lang === "pt" ? "pt-BR" : "en-GB";
  const bit =
    stats.days +
    " " +
    t("statDays").toLowerCase() +
    " · " +
    stats.chars.toLocaleString(loc) +
    " " +
    t("statChars").toLowerCase();
  setDriveStatus(
    (when ? t("driveOk") + " " + when : t("driveOk")) + " · " + bit,
  );
}

function applyDriveLabels() {
  const map = [
    ["driveHint", "driveHintFolder"],
    ["driveConnect", "driveConnect"],
    ["driveSync", "driveSync"],
    ["driveSignOut", "driveSignOut"],
  ];
  map.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && el.tagName !== "INPUT") el.textContent = t(key);
  });
  const lab = document.querySelector('label[for="driveClientId"], .drive-block .note-block span');
  if (lab) lab.textContent = t("driveClient");
  const head = document.querySelector(".drive-block > span");
  if (head) head.textContent = t("settingsDrive");
  if (driveToken) {
    const when = formatSyncAt();
    setDriveStatus(when ? t("driveOnSave") + " " + t("driveOk") + " " + when : t("driveOnSave"));
  } else setDriveStatus(t("driveOff"));
}

function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google && google.accounts && google.accounts.oauth2)
      return resolve();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function driveHeaders() {
  return { Authorization: "Bearer " + driveToken };
}

async function driveListJournals() {
  const q = encodeURIComponent("name='" + DRIVE_FILE_NAME + "'");
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=" +
      q +
      "&fields=files(id,name,modifiedTime,size)&pageSize=50",
    { headers: driveHeaders() },
  );
  if (!res.ok) throw new Error("list");
  const data = await res.json();
  return (data.files || []).filter((f) => f && f.id);
}

async function driveDownload(id) {
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files/" + id + "?alt=media",
    { headers: driveHeaders() },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("get");
  const text = await res.text();
  if (!String(text).trim()) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error("parse");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error("shape");
  return parsed;
}

async function driveUpload(payload, fileId) {
  const body = JSON.stringify(payload);
  if (fileId) {
    const res = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files/" +
        fileId +
        "?uploadType=media",
      {
        method: "PATCH",
        headers: Object.assign(
          { "Content-Type": "application/json" },
          driveHeaders(),
        ),
        body: body,
      },
    );
    if (res.status === 404) {
      localStorage.removeItem(DRIVE_FILE_KEY);
      return driveUpload(payload, "");
    }
    if (!res.ok) throw new Error("patch");
    return fileId;
  }
  const meta = {
    name: DRIVE_FILE_NAME,
    parents: ["appDataFolder"],
    mimeType: "application/json",
  };
  const boundary = "ark" + Date.now();
  const mixed =
    "--" +
    boundary +
    "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(meta) +
    "\r\n--" +
    boundary +
    "\r\nContent-Type: application/json\r\n\r\n" +
    body +
    "\r\n--" +
    boundary +
    "--";
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: Object.assign(
        { "Content-Type": "multipart/related; boundary=" + boundary },
        driveHeaders(),
      ),
      body: mixed,
    },
  );
  if (!res.ok) throw new Error("create");
  const created = await res.json();
  if (created.id) localStorage.setItem(DRIVE_FILE_KEY, created.id);
  return created.id;
}

function noteText(v) {
  return v == null ? "" : String(v);
}

function mergeNotes(older, newer) {
  const out = {};
  const keys = new Set(
    Object.keys(older || {}).concat(Object.keys(newer || {})),
  );
  keys.forEach((slot) => {
    const a = noteText(older && older[slot]);
    const b = noteText(newer && newer[slot]);
    if (a.trim() && b.trim()) out[slot] = b;
    else out[slot] = a.trim() ? a : b;
  });
  return out;
}

function mergeJournals(local, remote) {
  const out = {};
  const keys = new Set(
    Object.keys(local || {})
      .concat(Object.keys(remote || {}))
      .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k)),
  );
  keys.forEach((day) => {
    const L = local[day] || { checks: {}, notes: {}, updatedAt: "" };
    const R = remote[day] || { checks: {}, notes: {}, updatedAt: "" };
    const preferLocal = (L.updatedAt || "") >= (R.updatedAt || "");
    const newer = preferLocal ? L : R;
    const older = preferLocal ? R : L;
    out[day] = {
      checks: Object.assign({}, older.checks || {}, newer.checks || {}),
      notes: mergeNotes(older.notes, newer.notes),
      updatedAt: newer.updatedAt || older.updatedAt || "",
    };
  });
  return out;
}

async function syncDriveOnce() {
  const local = loadJournal();
  const files = await driveListJournals();
  let remote = {};
  const live = [];
  for (let i = 0; i < files.length; i++) {
    const part = await driveDownload(files[i].id);
    if (part === null) continue;
    live.push(files[i]);
    remote = mergeJournals(remote, part);
  }
  const merged = mergeJournals(local, remote);
  let canonical = "";
  const cached = localStorage.getItem(DRIVE_FILE_KEY);
  if (cached && live.some((f) => f.id === cached)) canonical = cached;
  else if (live.length) canonical = live[0].id;
  canonical = await driveUpload(merged, canonical);
  for (let i = 0; i < live.length; i++) {
    if (live[i].id !== canonical) {
      try {
        await driveUpload(merged, live[i].id);
      } catch (e) {}
    }
  }
  saveJournalSilent(merged);
  localStorage.setItem(DRIVE_SYNC_KEY, new Date().toISOString());
  localStorage.setItem(DRIVE_CONSENT_KEY, "1");
  bindJournalRefresh();
}

async function syncDrive() {
  if (!driveToken) throw new Error("auth");
  if (driveBusy) {
    driveAgain = true;
    return;
  }
  driveBusy = true;
  try {
    do {
      driveAgain = false;
      await syncDriveOnce();
    } while (driveAgain);
  } finally {
    driveBusy = false;
  }
}

function saveJournalSilent(data) {
  localStorage.setItem(STORE, JSON.stringify(data));
}

function scheduleDriveSync() {}

function flushDriveSync() {
  dropClosedDrafts();
}

function bindJournalRefresh() {
  ["morning", "day", "night"].forEach(function (pane) {
    const area = document.querySelector(
      "#pane-" + pane + " textarea.note[data-slot]",
    );
    if (area && document.activeElement === area) return;
    fillEntryFromStore(pane);
  });
  renderLog();
}

function handleDriveSetupError(err) {
  driveAuthBusy = false;
  if (typeof driveNeedsWiderScope === "function" && driveNeedsWiderScope(err)) {
    drivePromptConsent = true;
    if (driveEscalated) {
      DRIVE_SCOPE = SCOPE_FULL;
      tokenClient = null;
    } else driveEscalated = true;
    driveToken = "";
    setDriveStatus(t("driveNeedConsent"));
    showConnectGate();
    return;
  }
  setDriveStatus(t("driveErr"));
  if (!driveToken) showConnectGate();
}

function onJournalReady() {
  hideConnectGate();
  applyDriveLabels();
  markDriveOk();
  showPane(landingPane());
}

function onDriveToken(resp, fromSilent) {
  driveAuthBusy = false;
  if (resp && resp.access_token) {
    driveToken = resp.access_token;
    drivePromptConsent = false;
    localStorage.setItem(DRIVE_CONSENT_KEY, "1");
    setDriveStatus(t("driveOnSave"));
    ensureDriveJournal()
      .then(function () {
        return migrateAppDataOnce();
      })
      .then(function () {
        return migrateLocalOnce();
      })
      .then(function () {
        return restoreEntries();
      })
      .then(onJournalReady)
      .catch(handleDriveSetupError);
    return;
  }
  if (!fromSilent) setDriveStatus(t("driveErr"));
  if (!driveToken) showConnectGate();
}

async function ensureTokenClient() {
  const id = driveClientId();
  if (!id) throw new Error("id");
  localStorage.setItem(DRIVE_CLIENT_KEY, id);
  await loadGis();
  if (tokenClient && tokenClient._arkId === id && tokenClient._arkScope === DRIVE_SCOPE)
    return tokenClient;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: id,
    scope: DRIVE_SCOPE,
    callback: (resp) => onDriveToken(resp, false),
    error_callback: function () {
      driveAuthBusy = false;
      if (!driveToken) showConnectGate();
    },
  });
  tokenClient._arkId = id;
  tokenClient._arkScope = DRIVE_SCOPE;
  return tokenClient;
}

async function connectDrive(silent) {
  const id = driveClientId();
  if (!id) {
    if (!silent) setDriveStatus(t("driveNeedId"));
    return;
  }
  if (driveAuthBusy) return;
  try {
    await ensureTokenClient();
  } catch (e) {
    if (!silent) setDriveStatus(t("driveNeedGis"));
    return;
  }
  tokenClient.callback = (resp) => onDriveToken(resp, !!silent);
  const prompt = !silent && drivePromptConsent ? "consent" : "";
  driveAuthBusy = true;
  try {
    tokenClient.requestAccessToken({ prompt: prompt });
  } catch (e) {
    driveAuthBusy = false;
    if (!silent) setDriveStatus(t("driveNeedGis"));
  }
}

function signOutDrive() {
  const done = () => {
    driveToken = "";
    localStorage.removeItem(DRIVE_CONSENT_KEY);
    setDriveStatus(t("driveOff"));
    showConnectGate();
  };
  if (driveToken && window.google && google.accounts && google.accounts.oauth2) {
    google.accounts.oauth2.revoke(driveToken, done);
  } else done();
}

function bindDrive() {
  const input = document.getElementById("driveClientId");
  if (input) {
    input.value =
      localStorage.getItem(DRIVE_CLIENT_KEY) ||
      window.NOAH_DRIVE_CLIENT_ID ||
      "";
    input.addEventListener("change", () => {
      localStorage.setItem(DRIVE_CLIENT_KEY, input.value.trim());
    });
  }
  const conn = document.getElementById("driveConnect");
  const sync = document.getElementById("driveSync");
  const out = document.getElementById("driveSignOut");
  if (conn) conn.addEventListener("click", () => connectDrive(false));
  if (sync)
    sync.addEventListener("click", () => {
      if (!driveToken) return connectDrive(false);
      restoreEntries()
        .then(() => markDriveOk())
        .catch(() => setDriveStatus(t("driveErr")));
    });
  if (out) out.addEventListener("click", signOutDrive);
  const main = document.getElementById("connectDriveMain");
  if (main) main.addEventListener("click", () => connectDrive(false));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushDriveSync();
    else tickOffice();
  });
  window.addEventListener("pagehide", flushDriveSync);
  applyDriveLabels();
  if (
    localStorage.getItem(DRIVE_CONSENT_KEY) === "1" ||
    localStorage.getItem(DRIVE_FILE_KEY) ||
    localStorage.getItem(DRIVE_FOLDER_KEY)
  )
    connectDrive(true);
}

const YT_CHANT = [
  { title: "Santo Domingo de Silos · Canto Gregoriano", yt: "GCuDBo4F-Ac" },
  { title: "Silos · Chant (1994 album)", yt: "qFUFF-YK5v8" },
  { title: "Monks of Norcia · Benedicta", yt: "bTKfstuIUKM" },
  { title: "Norcia · Salve Regina", yt: "e9BBWZKnTvQ" },
  { title: "Schola Gregoriana Mediolanensis · Holy Mass", yt: "nsrKNcjzcSU" },
  { title: "Schola Gregoriana Mediolanensis · Missae", yt: "c79SszUBZUE" },
];

let chantList = YT_CHANT.slice();
let chantMode = "yt";
let chantIndex = 0;
let chantLoaded = false;
let chantPlaying = false;
let chantAnalyser = null;
let chantAudioCtx = null;
let chantWaveRaf = 0;

function chantYoutubeSrc(id, autoplay) {
  return (
    "https://www.youtube-nocookie.com/embed/" +
    id +
    "?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&enablejsapi=1" +
    (autoplay ? "&autoplay=1" : "")
  );
}

function sizeChantWave() {
  const c = document.getElementById("chantWave");
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  const w = Math.max(2, Math.floor(rect.width * dpr));
  const h = Math.max(2, Math.floor(rect.height * dpr));
  if (c.width !== w) c.width = w;
  if (c.height !== h) c.height = h;
}

function chantBarCount(width) {
  return Math.max(28, Math.min(52, Math.floor(width / 12)));
}

function chantBarLevels(n) {
  const levels = new Float32Array(n);
  if (!chantPlaying) return levels;
  if (chantAnalyser && chantLoaded && chantMode === "local") {
    const buf = new Uint8Array(chantAnalyser.frequencyBinCount);
    chantAnalyser.getByteFrequencyData(buf);
    const usable = Math.max(n, Math.floor(buf.length * 0.42));
    for (let i = 0; i < n; i++) {
      const a = Math.floor((i / n) * usable);
      const b = Math.max(a + 1, Math.floor(((i + 1) / n) * usable));
      let sum = 0;
      for (let k = a; k < b; k++) sum += buf[k];
      levels[i] = sum / (b - a) / 255;
    }
    return levels;
  }
  const t = Date.now() / 1000;
  for (let i = 0; i < n; i++) {
    const pos = i / Math.max(1, n - 1);
    const band = Math.exp(-Math.pow((pos - 0.16) / 0.4, 2));
    const slow = 0.5 + 0.5 * Math.sin(t * 0.58 + i * 0.29);
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.41 + i * 0.87);
    levels[i] = Math.max(0.04, band * (0.22 + 0.52 * slow + 0.26 * pulse));
  }
  return levels;
}

function drawChantWave() {
  const c = document.getElementById("chantWave");
  if (!c) return;
  sizeChantWave();
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const w = c.width;
  const h = c.height;
  const mid = h / 2;
  const style = getComputedStyle(document.body);
  const ink = (style.getPropertyValue("--ink") || "#2a2118").trim();
  const gold = (style.getPropertyValue("--gold-deep") || "#6a5228").trim();
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = chantPlaying ? 0.55 : 0.7;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, w / 640);
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(w, mid);
  ctx.stroke();
  if (chantPlaying) {
    const n = chantBarCount(w);
    const levels = chantBarLevels(n);
    const gap = Math.max(1, w / 320);
    const slot = w / n;
    const barW = Math.max(1, slot - gap);
    ctx.fillStyle = gold;
    ctx.globalAlpha = 0.92;
    for (let i = 0; i < n; i++) {
      const amp = Math.max(0, levels[i]) * (h * 0.42);
      const x = i * slot + (slot - barW) / 2;
      ctx.fillRect(x, mid - amp, barW, Math.max(ctx.lineWidth, amp * 2));
    }
    ctx.globalAlpha = 1;
    chantWaveRaf = requestAnimationFrame(drawChantWave);
    return;
  }
  ctx.globalAlpha = 1;
  chantWaveRaf = 0;
}

function startChantWave() {
  if (chantWaveRaf) return;
  drawChantWave();
}

function haltChantWave() {
  if (chantWaveRaf) {
    cancelAnimationFrame(chantWaveRaf);
    chantWaveRaf = 0;
  }
  drawChantWave();
}

function chantMedia() {
  return document.querySelector("#chantMount audio");
}

function chantFrame() {
  return document.querySelector("#chantMount iframe");
}

function chantYtCommand(func) {
  const iframe = chantFrame();
  if (!iframe || !iframe.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func: func, args: [] }),
    "*",
  );
}

function updateChantButton() {
  const playBtn = document.getElementById("chantPlay");
  if (playBtn) playBtn.textContent = chantPlaying ? t("pause") : t("play");
}

function pauseChant() {
  const audio = chantMedia();
  if (audio) audio.pause();
  else chantYtCommand("pauseVideo");
  chantPlaying = false;
  updateChantButton();
  haltChantWave();
}

function playChant() {
  const item = chantList[chantIndex];
  if (!item) return;
  chantLoaded = true;
  const audio = chantMedia();
  const iframe = chantFrame();
  if (audio) {
    if (chantAudioCtx && chantAudioCtx.state === "suspended")
      chantAudioCtx.resume();
    audio.play().catch(function () {});
    chantPlaying = true;
    updateChantButton();
    startChantWave();
    return;
  }
  if (iframe && iframe.src) {
    chantYtCommand("playVideo");
    chantPlaying = true;
    updateChantButton();
    startChantWave();
    return;
  }
  renderChant(true);
}

function hookChantAnalyser(audio) {
  chantAnalyser = null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || !audio) return;
  try {
    if (!chantAudioCtx) chantAudioCtx = new AC();
    if (chantAudioCtx.state === "suspended") chantAudioCtx.resume();
    const src = chantAudioCtx.createMediaElementSource(audio);
    chantAnalyser = chantAudioCtx.createAnalyser();
    chantAnalyser.fftSize = 512;
    chantAnalyser.smoothingTimeConstant = 0.78;
    src.connect(chantAnalyser);
    chantAnalyser.connect(chantAudioCtx.destination);
  } catch (e) {
    chantAnalyser = null;
  }
}

function renderChant(autoplay) {
  const item = chantList[chantIndex];
  const titleEl = document.getElementById("chantTitle");
  const footEl = document.getElementById("chantFoot");
  const mount = document.getElementById("chantMount");
  const playBtn = document.getElementById("chantPlay");
  if (!item || !titleEl || !mount) return;
  titleEl.textContent =
    !chantLoaded && !autoplay ? t("chantRest") : item.title;
  if (footEl)
    footEl.textContent =
      !chantLoaded && !autoplay
        ? ""
        : chantMode === "local"
          ? t("chantLocal")
          : t("chantYt");
  updateChantButton();
  chantAnalyser = null;
  if (!chantLoaded && !autoplay) {
    chantPlaying = false;
    mount.innerHTML = "";
    updateChantButton();
    startChantWave();
    return;
  }
  chantLoaded = true;
  chantPlaying = !!autoplay;
  mount.innerHTML = "";
  if (chantMode === "local") {
    const audio = document.createElement("audio");
    audio.src = item.src;
    audio.setAttribute("playsinline", "");
    audio.crossOrigin = "anonymous";
    audio.addEventListener("ended", () => stepChant(1, true));
    mount.appendChild(audio);
    hookChantAnalyser(audio);
    if (autoplay) audio.play().catch(function () {});
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = chantYoutubeSrc(item.yt, !!autoplay);
    iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.title = item.title;
    iframe.setAttribute("tabindex", "-1");
    mount.appendChild(iframe);
  }
  updateChantButton();
  startChantWave();
}

function stepChant(delta, autoplay) {
  if (!chantList.length) return;
  chantIndex = (chantIndex + delta + chantList.length) % chantList.length;
  chantLoaded = true;
  renderChant(autoplay);
}

async function initChant() {
  try {
    const res = await fetch("audio/playlist.json", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const local = (Array.isArray(data) ? data : data.tracks || [])
        .map(function (track) {
          if (!track || !track.src) return null;
          return { title: track.title || track.src, src: track.src };
        })
        .filter(Boolean);
      if (local.length) {
        chantList = local;
        chantMode = "local";
        chantIndex = 0;
      }
    }
  } catch (e) {}
  const prev = document.getElementById("chantPrev");
  const next = document.getElementById("chantNext");
  const play = document.getElementById("chantPlay");
  if (prev) prev.addEventListener("click", () => stepChant(-1, chantPlaying));
  if (next) next.addEventListener("click", () => stepChant(1, chantPlaying));
  if (play)
    play.addEventListener("click", () => {
      if (chantPlaying) pauseChant();
      else playChant();
    });
  window.addEventListener("resize", function () {
    if (!chantWaveRaf) drawChantWave();
  });
  renderChant(false);
}

function showConnectGate() {
  const card = document.getElementById("connectCard");
  const closed = document.getElementById("officeClosed");
  if (card) card.hidden = false;
  if (closed) closed.hidden = true;
  document.querySelectorAll(".pane").forEach(function (p) {
    p.hidden = true;
  });
  renderDateLine();
  renderLesson();
}

function hideConnectGate() {
  const card = document.getElementById("connectCard");
  if (card) card.hidden = true;
}

function fillClosedCard(now) {
  const body = document.getElementById("officeClosedBody");
  if (!body) return;
  const ended =
    now.prevPeriod && now.prevEnd
      ? t("windowEnded", {
          period: t(periodLabelKey(now.prevPeriod)),
          time: now.prevEnd,
        })
      : t("officeClosed");
  const opens = t("officeOpens", {
    period: t(periodLabelKey(now.nextPeriod)),
    time: now.nextAt,
  });
  body.innerHTML = "<p>" + esc(ended) + "</p><p>" + esc(opens) + "</p>";
  const foot = document.querySelector("#officeClosed .closed-foot");
  if (foot) foot.hidden = false;
  const share = document.getElementById("shareClosed");
  if (share) {
    const can =
      now.prevPeriod && periodHasEnded(now.date, now.prevPeriod, now);
    share.hidden = !can;
  }
}

function renderMarks() {
  const line = t("marksLine", { pray: 0, heart: 0, up: 0 });
  document.querySelectorAll("[data-marks]").forEach(function (el) {
    el.textContent = line;
  });
}

function gateOfficeForm(pane, access) {
  const block = document.querySelector('.entry-block[data-entry="' + pane + '"]');
  const area = document.querySelector(
    "#pane-" + pane + " textarea.note[data-slot]",
  );
  const share = document.querySelector("#pane-" + pane + " [data-share]");
  if (block) {
    if (access === "open") block.removeAttribute("data-locked");
    else block.setAttribute("data-locked", "1");
  }
  if (area) {
    area.disabled = access !== "open";
    area.readOnly = access !== "open";
  }
  const meta = document.querySelector('[data-window-meta="' + pane + '"]');
  if (meta) {
    if (access === "open") {
      const now = TIMENOW();
      meta.textContent = t("windowCloses", { time: now.closesAt || "" });
    } else meta.textContent = "";
  }
  if (share) {
    share.hidden = !(access === "open" || access === "past");
    share.textContent = t("shareTitle");
  }
}

function maybeAutofocus(pane, access) {
  if (access !== "open") return;
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches)
    return;
  const area = document.querySelector(
    "#pane-" + pane + " textarea.note[data-slot]",
  );
  if (area && !area.disabled) area.focus();
}

function showPane(name) {
  document.querySelectorAll(".nav-bar button").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-pane") === name);
  });
  if (!driveToken) {
    showConnectGate();
    return;
  }
  hideConnectGate();
  renderDateLine();
  const closed = document.getElementById("officeClosed");
  if (name === "log") {
    if (closed) closed.hidden = true;
    document.querySelectorAll(".pane").forEach((p) => {
      p.hidden = p.id !== "pane-log";
    });
    renderLog();
    return;
  }
  const access = officeAccess(name);
  const now = TIMENOW();
  if (access === "future") {
    document.querySelectorAll(".pane").forEach(function (p) {
      p.hidden = true;
    });
    if (closed) {
      closed.hidden = false;
      fillClosedCard(now);
    }
    renderLesson();
    return;
  }
  if (closed) closed.hidden = true;
  document.querySelectorAll(".pane").forEach((p) => {
    p.hidden = p.id !== "pane-" + name;
  });
  gateOfficeForm(name, access);
  renderLesson();
  if (name === "morning") {
    renderOurFather();
    renderFilm();
  }
  fillEntryFromStore(name);
  maybeAutofocus(name, access);
}

const SLOT_KEY = {
  morning: "slotMorning",
  day: "slotDay",
  night: "slotNight",
  pray: "slotPray",
  reading: "slotReading",
  forum: "slotForum",
  tongue: "slotTongue",
  wife: "slotWife",
  table: "slotTable",
  work: "slotWork",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function allDays() {
  const data = loadJournal();
  return Object.keys(data)
    .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))
    .sort()
    .reverse()
    .map((date) => {
      const d = data[date] || {};
      return {
        date: date,
        checks: d.checks || {},
        notes: d.notes || {},
      };
    });
}

function noteChars(d) {
  return Object.values(d.notes || {}).reduce(
    (n, text) => n + String(text || "").length,
    0,
  );
}

function dayUsed(d) {
  if (noteChars(d) > 0) return true;
  return Object.values(d.checks || {}).some(Boolean);
}

function shiftDate(key, delta) {
  const p = key.split("-").map(Number);
  const dt = new Date(p[0], p[1] - 1, p[2]);
  dt.setDate(dt.getDate() + delta);
  return (
    dt.getFullYear() +
    "-" +
    String(dt.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(dt.getDate()).padStart(2, "0")
  );
}

function countStreak(used) {
  const set = {};
  used.forEach((k) => {
    set[k] = true;
  });
  let start = todayKey();
  if (!set[start]) start = shiftDate(start, -1);
  let n = 0;
  let k = start;
  while (set[k]) {
    n++;
    k = shiftDate(k, -1);
  }
  return n;
}

function formatDay(key) {
  const p = key.split("-").map(Number);
  return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-GB",
    { day: "numeric", month: "short" },
  );
}

function shiftStatus(date, slot, notes, now) {
  const period = paneToPeriod(slot);
  const has = notes && notes[slot] && String(notes[slot]).trim();
  if (has) return { key: "kept", label: t("kept") };
  if (!periodHasEnded(date, period, now)) return { key: "closed", label: t("closed") };
  return { key: "missed", label: t("missed") };
}

function renderLog() {
  const stats = document.getElementById("logStats");
  const list = document.getElementById("logList");
  if (!stats || !list) return;
  const now = TIMENOW();
  const days = allDays();
  const byDate = {};
  days.forEach(function (d) {
    byDate[d.date] = d;
  });
  if (!byDate[now.date])
    byDate[now.date] = { date: now.date, checks: {}, notes: {} };
  const dates = Object.keys(byDate).sort().reverse();
  const used = dates
    .map(function (date) {
      return byDate[date];
    })
    .filter(dayUsed);
  let kept = 0;
  let missed = 0;
  dates.forEach(function (date) {
    ["morning", "day", "night"].forEach(function (shift) {
      const st = shiftStatus(date, shift, byDate[date].notes, now);
      if (st.key === "kept") kept++;
      if (st.key === "missed") missed++;
    });
  });
  const streak = countStreak(used.map((d) => d.date));
  stats.innerHTML =
    '<div class="stat"><b>' +
    kept +
    "</b><span>" +
    t("statKept") +
    "</span></div>" +
    '<div class="stat"><b>' +
    missed +
    "</b><span>" +
    t("statMissed") +
    "</span></div>" +
    '<div class="stat"><b>' +
    streak +
    "</b><span>" +
    t("statStreak") +
    "</span></div>";
  list.innerHTML = dates
    .map(function (date) {
      const d = byDate[date];
      const shifts = ["morning", "day", "night"]
        .map(function (shift) {
          const st = shiftStatus(date, shift, d.notes, now);
          const cls = st.key === "missed" ? "log-miss" : "";
          const name = t(periodLabelKey(paneToPeriod(shift))).toLowerCase();
          return (
            '<span class="' +
            cls +
            '">' +
            name +
            " " +
            st.label +
            "</span>"
          );
        })
        .join(" · ");
      const note = ["morning", "day", "night"]
        .map(function (shift) {
          return ((d.notes && d.notes[shift]) || "").trim();
        })
        .filter(Boolean)
        .join(" ");
      return (
        '<div class="log-day"><div class="log-day-head">' +
        formatDay(d.date) +
        "</div>" +
        '<p class="log-shifts">' +
        shifts +
        "</p>" +
        (note ? '<p class="log-note">' + esc(note) + "</p>" : "") +
        "</div>"
      );
    })
    .join("");
}

const REMIND_KEY = "noah-reminders-v1";
const REMIND_PANES = ["morning", "day", "night"];

function defaultRemind() {
  return {
    enabled: false,
    morning: "05:00",
    day: "12:00",
    night: "21:00",
    lastTick: Date.now(),
    fired: {},
  };
}

function loadRemind() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REMIND_KEY) || "{}");
    if (parsed.morning === "06:30") parsed.morning = "06:00";
    if (parsed.night === "21:30") parsed.night = "21:00";
    return Object.assign(defaultRemind(), parsed);
  } catch (e) {
    return defaultRemind();
  }
}

function saveRemind(r) {
  localStorage.setItem(REMIND_KEY, JSON.stringify(r));
}

function todaysStamp(hhmm) {
  const p = String(hhmm || "00:00").split(":");
  const d = new Date();
  d.setHours(Number(p[0]) || 0, Number(p[1]) || 0, 0, 0);
  return d.getTime();
}

function notifyPane(pane) {
  const title = t("remindTitle-" + pane);
  const body = t("remindBody-" + pane);
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "notify",
      pane: pane,
      title: title,
      body: body,
    });
  } else if (
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  ) {
    new Notification(title, {
      body: body,
      tag: "ark-" + pane,
      icon: "icons/icon-192.png",
    });
  }
}

function maybeFireReminders() {
  const r = loadRemind();
  const now = Date.now();
  if (!r.enabled) {
    r.lastTick = now;
    saveRemind(r);
    return;
  }
  const last = r.lastTick || now;
  const day = todayKey();
  REMIND_PANES.forEach(function (pane) {
    const at = todaysStamp(r[pane]);
    if (last < at && now >= at && r.fired[pane] !== day) {
      r.fired[pane] = day;
      notifyPane(pane);
    }
  });
  r.lastTick = now;
  saveRemind(r);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function icsLocal(d) {
  return (
    d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    "T" +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    "00"
  );
}

function downloadIcs() {
  const r = loadRemind();
  const now = new Date();
  const events = REMIND_PANES.map(function (pane) {
    const start = new Date();
    const hm = String(r[pane] || "00:00").split(":");
    start.setHours(Number(hm[0]) || 0, Number(hm[1]) || 0, 0, 0);
    if (start.getTime() < now.getTime()) start.setDate(start.getDate() + 1);
    return [
      "BEGIN:VEVENT",
      "UID:ark-" + pane + "@ark.local",
      "DTSTAMP:" + icsLocal(now),
      "DTSTART:" + icsLocal(start),
      "RRULE:FREQ=DAILY",
      "SUMMARY:" + t("remindTitle-" + pane),
      "DESCRIPTION:" + t("remindBody-" + pane),
      "BEGIN:VALARM",
      "TRIGGER:PT0S",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + t("remindTitle-" + pane),
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });
  const ics =
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Ark//EN\r\nCALSCALE:GREGORIAN\r\n" +
    events.join("\r\n") +
    "\r\nEND:VCALENDAR\r\n";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  a.download = "ark-reminders.ics";
  a.click();
}

function bindReminders() {
  const on = document.getElementById("remindOn");
  if (!on) return;
  const r = loadRemind();
  on.checked = !!r.enabled;
  REMIND_PANES.forEach(function (p) {
    const el = document.getElementById("remind-" + p);
    if (el) el.value = r[p];
  });
  on.addEventListener("change", function () {
    const cur = loadRemind();
    cur.enabled = on.checked;
    cur.lastTick = Date.now();
    saveRemind(cur);
    if (
      cur.enabled &&
      typeof Notification !== "undefined" &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  });
  REMIND_PANES.forEach(function (p) {
    const el = document.getElementById("remind-" + p);
    if (!el) return;
    el.addEventListener("change", function (e) {
      const cur = loadRemind();
      cur[p] = e.target.value;
      saveRemind(cur);
    });
  });
  const icsBtn = document.getElementById("remindIcs");
  if (icsBtn) icsBtn.addEventListener("click", downloadIcs);
  setInterval(maybeFireReminders, 20000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) maybeFireReminders();
  });
  maybeFireReminders();
}

function officeNoteText(pane) {
  const now = TIMENOW();
  const data = loadJournal();
  const day = data[now.date] || { notes: {} };
  const saved = (day.notes && day.notes[pane]) || "";
  if (String(saved).trim()) return saved;
  const area = document.querySelector(
    "#pane-" + pane + " textarea.note[data-slot]",
  );
  return area ? area.value : "";
}

function fillEntryFromStore(pane) {
  const period = paneToPeriod(pane);
  const now = TIMENOW();
  const area = document.querySelector(
    "#pane-" + pane + " textarea.note[data-slot]",
  );
  if (!area) return;
  const data = loadJournal();
  const day = data[now.date] || { notes: {} };
  const saved = (day.notes && day.notes[pane]) || "";
  const access = officeAccess(pane, now);
  if (access === "open") {
    const draft = getDraft(now.date, period);
    area.value = draft ? draft.text : saved;
  } else area.value = saved;
}

function bindJournal() {
  document.querySelectorAll("textarea.note[data-slot]").forEach((area) => {
    const slot = area.getAttribute("data-slot");
    area.addEventListener("input", () => {
      const now = TIMENOW();
      const period = paneToPeriod(slot);
      if (!now.open || now.period !== period) return;
      setDraft(now.date, period, area.value);
    });
  });
  ["morning", "day", "night"].forEach(fillEntryFromStore);
}

const pendingFiles = { morning: null, day: null, night: null };
let voiceRec = null;

function attachKind(file) {
  const type = (file && file.type) || "";
  if (type.indexOf("image/") === 0) return "photo";
  if (type.indexOf("video/") === 0) return "video";
  if (type.indexOf("audio/") === 0) return "voice";
  return "file";
}

function setPendingFile(pane, file) {
  pendingFiles[pane] = file || null;
  const label = document.getElementById("attachName-" + pane);
  if (!label) return;
  if (!file) {
    label.textContent = "";
    return;
  }
  const kind = attachKind(file);
  const key =
    kind === "photo"
      ? "attachPhoto"
      : kind === "video"
        ? "attachVideo"
        : kind === "voice"
          ? "attachVoice"
          : "attachNamed";
  label.textContent = t(key, { name: file.name || "" });
}

function voiceMime() {
  if (!window.MediaRecorder) return "";
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) return types[i];
  }
  return "";
}

function voiceExt(mime) {
  if (mime.indexOf("mp4") >= 0) return "m4a";
  if (mime.indexOf("ogg") >= 0) return "ogg";
  return "webm";
}

function voiceButton(pane) {
  return document.querySelector('[data-voice="' + pane + '"]');
}

function stopVoice(keep) {
  if (!voiceRec) return;
  voiceRec.keep = !!keep;
  try {
    if (voiceRec.rec && voiceRec.rec.state !== "inactive") voiceRec.rec.stop();
  } catch (e) {}
}

function startVoice(pane) {
  const mime = voiceMime();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !mime) {
    const input = document.getElementById("attach-audio-" + pane);
    if (input) input.click();
    return;
  }
  stopVoice(false);
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      const rec = new MediaRecorder(stream, { mimeType: mime });
      const chunks = [];
      voiceRec = { pane: pane, rec: rec, stream: stream, chunks: chunks, keep: true };
      rec.ondataavailable = function (evt) {
        if (evt.data && evt.data.size) chunks.push(evt.data);
      };
      rec.onstop = function () {
        const keep = !voiceRec || voiceRec.keep;
        voiceRec = null;
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        const btn = voiceButton(pane);
        if (btn) {
          btn.classList.remove("is-recording");
          btn.textContent = t("voice");
        }
        if (!keep || !chunks.length) return;
        const blob = new Blob(chunks, { type: mime });
        const name =
          "voice-" +
          todayKey() +
          "-" +
          pane +
          "." +
          voiceExt(mime);
        const file =
          typeof File === "function"
            ? new File([blob], name, { type: mime })
            : blob;
        if (!file.name) file.name = name;
        setPendingFile(pane, file);
      };
      rec.start();
      const btn = voiceButton(pane);
      if (btn) {
        btn.classList.add("is-recording");
        btn.textContent = t("voiceStop");
      }
    })
    .catch(function () {
      const input = document.getElementById("attach-audio-" + pane);
      if (input) input.click();
    });
}

function toggleVoice(pane) {
  if (voiceRec && voiceRec.pane === pane) {
    stopVoice(true);
    return;
  }
  startVoice(pane);
}

function saveOffice(pane) {
  const now = TIMENOW();
  const period = paneToPeriod(pane);
  const meta = document.querySelector('[data-window-meta="' + pane + '"]');
  if (!now.open || now.period !== period) {
    if (meta) meta.textContent = t("thisOfficeClosed");
    return;
  }
  if (!driveToken) {
    showConnectGate();
    return;
  }
  const area = document.querySelector(
    "#pane-" + pane + " textarea.note[data-slot]",
  );
  const text = area ? area.value : "";
  const file = pendingFiles[pane];
  const folderId = localStorage.getItem(DRIVE_FOLDER_KEY);
  const btn = document.querySelector('[data-save="' + pane + '"]');
  if (btn) btn.disabled = true;
  const finish = function (mediaUrl) {
    return appendEntry([
      new Date().toISOString(),
      period,
      text,
      mediaUrl || "",
      lang === "pt" ? "pt" : "en",
    ]).then(function () {
      const j = loadJournal();
      const k = now.date;
      j[k] = j[k] || { checks: {}, notes: {}, media: {} };
      j[k].notes[pane] = text;
      if (mediaUrl) {
        j[k].media = j[k].media || {};
        j[k].media[pane] = mediaUrl;
      }
      j[k].updatedAt = new Date().toISOString();
      saveJournalSilent(j);
      clearDraft(k, period);
      stopVoice(false);
      pendingFiles[pane] = null;
      const label = document.getElementById("attachName-" + pane);
      if (label) label.textContent = "";
      if (meta) meta.textContent = t("savedOk");
      renderLog();
      gateOfficeForm(pane, "open");
    });
  };
  const chain =
    file && folderId
      ? uploadMultipart(file, folderId).then(function (up) {
          const url =
            up.webViewLink ||
            (up.id ? "https://drive.google.com/file/d/" + up.id + "/view" : "");
          return finish(url);
        })
      : finish("");
  Promise.resolve(chain)
    .catch(function (err) {
      if (
        !driveEscalated &&
        typeof driveNeedsWiderScope === "function" &&
        driveNeedsWiderScope(err)
      ) {
        driveEscalated = true;
        drivePromptConsent = true;
        DRIVE_SCOPE = SCOPE_FULL;
        tokenClient = null;
        if (meta) meta.textContent = t("driveNeedConsent");
        setDriveStatus(t("driveNeedConsent"));
        return;
      }
      if (meta) meta.textContent = t("driveErr");
      setDriveStatus(t("driveErr"));
    })
    .then(function () {
      if (btn) btn.disabled = false;
    });
}

function bindOfficeActions() {
  document.querySelectorAll("[data-save]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      saveOffice(btn.getAttribute("data-save"));
    });
  });
  document.querySelectorAll("[data-photo]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const pane = btn.getAttribute("data-photo");
      const input = document.getElementById("attach-photo-" + pane);
      if (input) input.click();
    });
  });
  document.querySelectorAll("[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const pane = btn.getAttribute("data-video");
      const input = document.getElementById("attach-video-" + pane);
      if (input) input.click();
    });
  });
  document.querySelectorAll("[data-voice]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      toggleVoice(btn.getAttribute("data-voice"));
    });
  });
  ["morning", "day", "night"].forEach(function (pane) {
    ["photo", "video", "audio"].forEach(function (kind) {
      const input = document.getElementById("attach-" + kind + "-" + pane);
      if (!input) return;
      input.addEventListener("change", function () {
        const file = input.files && input.files[0] ? input.files[0] : null;
        setPendingFile(pane, file);
      });
    });
  });
}

function bindKeys() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      closeSettings();
      if (typeof closeShare === "function") closeShare();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      const now = TIMENOW();
      if (!now.open || !driveToken) return;
      e.preventDefault();
      saveOffice(periodToPane(now.period));
    }
  });
}

let lastOfficeStamp = "";
function tickOffice() {
  if (typeof dropClosedDrafts === "function") dropClosedDrafts();
  renderDateLine();
  const now = TIMENOW();
  const stamp = now.date + "|" + (now.period || "gap");
  if (stamp === lastOfficeStamp) return;
  stopVoice(false);
  const prev = lastOfficeStamp;
  lastOfficeStamp = stamp;
  if (prev && typeof dropClosedDrafts === "function") dropClosedDrafts(now);
  if (!driveToken) {
    showConnectGate();
    return;
  }
  const active = document.querySelector(".nav-bar button.active");
  showPane(active ? active.getAttribute("data-pane") : landingPane(now));
}

function bindNav() {
  document.querySelectorAll(".nav-bar button").forEach((b) => {
    b.addEventListener("click", () => showPane(b.getAttribute("data-pane")));
  });
}

function applyBuildLabels() {
  const line = document.getElementById("buildLine");
  if (line) line.textContent = t("buildLabel") + " " + APP_BUILD;
  const btn = document.getElementById("buildReload");
  if (btn) btn.textContent = t("buildReload");
}

async function checkBuild() {
  const status = document.getElementById("buildStatus");
  const btn = document.getElementById("buildReload");
  if (btn) btn.hidden = true;
  applyBuildLabels();
  try {
    const res = await fetch("version.json?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("http");
    const data = await res.json();
    const remote = Number(data.build);
    if (!remote) throw new Error("bad");
    if (remote > APP_BUILD) {
      if (status) status.textContent = t("buildUpdate") + " " + remote;
      if (btn) btn.hidden = false;
    } else if (status) status.textContent = t("buildCurrent");
  } catch (e) {
    if (status)
      status.textContent = navigator.onLine ? t("buildUnknown") : t("buildOffline");
  }
}

async function reloadToUpdate() {
  try {
    if (navigator.serviceWorker) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.update()));
    }
    if (window.caches) {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
    }
  } catch (e) {}
  location.reload();
}

function bindSettings() {
  const btn = document.getElementById("settingsBtn");
  const modal = document.getElementById("settingsModal");
  if (btn && modal) {
    btn.addEventListener("click", () => {
      modal.style.display = "flex";
      checkBuild();
    });
  }
  const reload = document.getElementById("buildReload");
  if (reload) reload.addEventListener("click", reloadToUpdate);
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    b.addEventListener("click", () => {
      lang = b.getAttribute("data-lang");
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
      document.documentElement.setAttribute("dir", "ltr");
      applyAppName();
      document.querySelectorAll("[data-lang]").forEach((x) => {
        x.classList.toggle("active", x.getAttribute("data-lang") === lang);
      });
      renderFilm();
      if (openPassageKey) openScripture(openPassageKey, openPassageSlot);
      renderChant(chantPlaying);
      syncMediaLabels();
      applyDriveLabels();
      applyBuildLabels();
      checkBuild();
      renderLog();
      if (driveToken) {
        const active = document.querySelector(".nav-bar button.active");
        showPane(active ? active.getAttribute("data-pane") : landingPane());
      }
    });
  });
  document.querySelectorAll("[data-theme-choice]").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-theme-choice") === theme);
    b.addEventListener("click", () => {
      theme = b.getAttribute("data-theme-choice");
      localStorage.setItem(THEME_KEY, theme);
      document.querySelectorAll("[data-theme-choice]").forEach((x) => {
        x.classList.toggle("active", x.getAttribute("data-theme-choice") === theme);
      });
      applyTheme();
      if (!chantWaveRaf) drawChantWave();
    });
  });
}

function closeSettings() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.classList.remove("open");
    modal.style.display = "none";
  }
}
function closeModal() {
  const modal = document.getElementById("scriptureModal");
  if (modal) {
    modal.classList.remove("open");
    modal.style.display = "none";
  }
}

let openPassageKey = "";
let openPassageSlot = "";

function fillScriptureModal(title, html, slot) {
  const titleEl = document.getElementById("mTitle");
  const bodyEl = document.getElementById("mBody");
  const modalTa = document.getElementById("modalNote");
  const modal = document.getElementById("scriptureModal");
  if (!titleEl || !bodyEl || !modal) return;
  titleEl.textContent = title;
  bodyEl.innerHTML = html;
  openPassageSlot = slot || "";
  if (modalTa) {
    modalTa.dataset.slot = openPassageSlot;
    const now = TIMENOW();
    const period = paneToPeriod(openPassageSlot);
    const open = now.open && now.period === period;
    modalTa.disabled = !open;
    modalTa.readOnly = !open;
    if (openPassageSlot) {
      const day = loadJournal()[now.date] || { notes: {} };
      modalTa.value = day.notes[openPassageSlot] || "";
    } else modalTa.value = "";
  }
  modal.classList.add("open");
  modal.style.display = "flex";
}

function openScripture(key, slot) {
  openPassageKey = key || "";
  if (key === "daily") {
    const loc = dailyLoc();
    if (!loc) return;
    const paras = String(loc.text || "")
      .split(/\n\n/)
      .map((chunk) => "<p>" + chunk + "</p>")
      .join("");
    fillScriptureModal(loc.src, paras, slot || "reading");
    return;
  }
  const pack = typeof SCRIPTURE !== "undefined" ? SCRIPTURE[key] : null;
  if (!pack) return;
  const loc = lang === "pt" && pack.pt ? pack.pt : pack;
  fillScriptureModal(loc.title, loc.text, slot);
}
window.openScripture = openScripture;

document.addEventListener(
  "click",
  function (evt) {
    const btn =
      evt.target && evt.target.closest
        ? evt.target.closest("button.passage")
        : null;
    if (!btn) return;
    const key = btn.getAttribute("data-passage");
    if (!key) return;
    openScripture(key, btn.getAttribute("data-slot") || "");
  },
  true,
);

function bindPassages() {}

function bindModalNote() {
  const modalTa = document.getElementById("modalNote");
  if (!modalTa) return;
  modalTa.addEventListener("input", () => {
    const slot = modalTa.dataset.slot;
    if (!slot) return;
    const now = TIMENOW();
    const period = paneToPeriod(slot);
    if (!now.open || now.period !== period) return;
    setDraft(now.date, period, modalTa.value);
    document.querySelectorAll('textarea.note[data-slot="' + slot + '"]').forEach(
      (el) => {
        if (document.activeElement !== el) el.value = modalTa.value;
      },
    );
  });
}

let noiseCtx = null;
let noiseNode = null;
let noiseFilter = null;
let noiseLfo = null;
let noiseGain = null;
let noiseSynth = [];
let noisePlaying = false;

function stopNoise() {
  if (noiseNode) {
    try {
      noiseNode.stop();
      noiseNode.disconnect();
    } catch (e) {}
    noiseNode = null;
  }
  if (noiseLfo) {
    try {
      noiseLfo.stop();
      noiseLfo.disconnect();
    } catch (e) {}
    noiseLfo = null;
  }
  if (noiseFilter) {
    try {
      noiseFilter.disconnect();
    } catch (e) {}
    noiseFilter = null;
  }
  noiseSynth.forEach((n) => {
    try {
      n.stop();
      n.disconnect();
    } catch (e) {}
  });
  noiseSynth = [];
  if (noiseGain) {
    try {
      noiseGain.disconnect();
    } catch (e) {}
    noiseGain = null;
  }
  noisePlaying = false;
  const btn = document.getElementById("audioActionBtn");
  if (btn) btn.textContent = t("play");
}

function startNoise() {
  const sel = document.getElementById("noiseSelect");
  const trackType = sel ? sel.value : "white";
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!noiseCtx) noiseCtx = new AC();
  if (noiseCtx.state === "suspended") noiseCtx.resume();
  const bufferSize = 4 * noiseCtx.sampleRate;
  const noiseBuffer = noiseCtx.createBuffer(1, bufferSize, noiseCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    output[i] = pink * 0.11;
  }
  noiseNode = noiseCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;
  noiseFilter = noiseCtx.createBiquadFilter();
  noiseGain = noiseCtx.createGain();
  if (trackType === "white") {
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(4500, noiseCtx.currentTime);
    noiseGain.gain.setValueAtTime(0.2, noiseCtx.currentTime);
    noiseNode.connect(noiseFilter);
  } else if (trackType === "rain") {
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(1100, noiseCtx.currentTime);
    noiseLfo = noiseCtx.createOscillator();
    noiseLfo.type = "sine";
    noiseLfo.frequency.setValueAtTime(0.05, noiseCtx.currentTime);
    const lfoGain = noiseCtx.createGain();
    lfoGain.gain.setValueAtTime(0.015, noiseCtx.currentTime);
    noiseLfo.connect(lfoGain);
    lfoGain.connect(noiseGain.gain);
    noiseGain.gain.setValueAtTime(0.25, noiseCtx.currentTime);
    noiseNode.connect(noiseFilter);
    noiseLfo.start();
  } else if (trackType === "ocean") {
    noiseFilter.type = "lowpass";
    noiseLfo = noiseCtx.createOscillator();
    noiseLfo.type = "sine";
    noiseLfo.frequency.setValueAtTime(0.08, noiseCtx.currentTime);
    const lfoGain = noiseCtx.createGain();
    lfoGain.gain.setValueAtTime(350, noiseCtx.currentTime);
    noiseLfo.connect(lfoGain);
    lfoGain.connect(noiseFilter.frequency);
    noiseFilter.frequency.setValueAtTime(450, noiseCtx.currentTime);
    noiseGain.gain.setValueAtTime(0.35, noiseCtx.currentTime);
    noiseNode.connect(noiseFilter);
    noiseLfo.start();
  } else if (trackType === "crickets") {
    noiseGain.gain.setValueAtTime(0.08, noiseCtx.currentTime);
    const osc1 = noiseCtx.createOscillator();
    const chirpLfo1 = noiseCtx.createOscillator();
    const shimmer1 = noiseCtx.createOscillator();
    const gChirp1 = noiseCtx.createGain();
    const gShim1 = noiseCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(2200, noiseCtx.currentTime);
    chirpLfo1.type = "sine";
    chirpLfo1.frequency.setValueAtTime(0.8, noiseCtx.currentTime);
    shimmer1.type = "sine";
    shimmer1.frequency.setValueAtTime(28, noiseCtx.currentTime);
    chirpLfo1.connect(gChirp1.gain);
    shimmer1.connect(gShim1.gain);
    osc1.connect(gChirp1);
    gChirp1.connect(gShim1);
    const osc2 = noiseCtx.createOscillator();
    const chirpLfo2 = noiseCtx.createOscillator();
    const gChirp2 = noiseCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(3400, noiseCtx.currentTime);
    chirpLfo2.type = "sine";
    chirpLfo2.frequency.setValueAtTime(0.5, noiseCtx.currentTime);
    chirpLfo2.connect(gChirp2.gain);
    osc2.connect(gChirp2);
    noiseLfo = noiseCtx.createOscillator();
    noiseLfo.type = "triangle";
    noiseLfo.frequency.setValueAtTime(0.07, noiseCtx.currentTime);
    const gateGain = noiseCtx.createGain();
    gateGain.gain.setValueAtTime(0.3, noiseCtx.currentTime);
    noiseLfo.connect(gateGain.gain);
    gShim1.connect(gateGain);
    gChirp2.connect(gateGain);
    gateGain.connect(noiseGain);
    osc1.start();
    chirpLfo1.start();
    shimmer1.start();
    osc2.start();
    chirpLfo2.start();
    noiseLfo.start();
    noiseSynth.push(osc1, chirpLfo1, shimmer1, osc2, chirpLfo2, noiseLfo);
  }
  if (trackType !== "crickets") noiseFilter.connect(noiseGain);
  noiseGain.connect(noiseCtx.destination);
  if (trackType !== "crickets") noiseNode.start();
  noisePlaying = true;
  const btn = document.getElementById("audioActionBtn");
  if (btn) btn.textContent = t("pause");
}

function toggleNativeAudio() {
  if (noisePlaying) stopNoise();
  else startNoise();
}
window.toggleNativeAudio = toggleNativeAudio;

function dayOrdinalEn(n) {
  const j = n % 10;
  const k = n % 100;
  if (k >= 11 && k <= 13) return n + "th";
  if (j === 1) return n + "st";
  if (j === 2) return n + "nd";
  if (j === 3) return n + "rd";
  return n + "th";
}

function formatLongDate(d) {
  let day = d.getDate();
  let month = d.getMonth();
  let year = d.getFullYear();
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: DAY_TZ,
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(d);
    const get = (type) => {
      const p = parts.find((x) => x.type === type);
      return p ? Number(p.value) : NaN;
    };
    const tzDay = get("day");
    const tzMonth = get("month");
    const tzYear = get("year");
    if (tzDay && tzMonth && tzYear) {
      day = tzDay;
      month = tzMonth - 1;
      year = tzYear;
    }
  } catch (e) {}
  const monthsEn = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
  ];
  const monthsPt = [
    "primeiro",
    "segundo",
    "terceiro",
    "quarto",
    "quinto",
    "sexto",
    "sétimo",
    "oitavo",
    "nono",
    "décimo",
    "décimo primeiro",
    "décimo segundo",
  ];
  if (lang === "pt")
    return (
      "O " +
      day +
      ".º dia do " +
      monthsPt[month] +
      " mês do ano de Nosso Senhor, " +
      year
    );
  return (
    "The " +
    dayOrdinalEn(day) +
    " day of the " +
    monthsEn[month] +
    " month of the year of our Lord, " +
    year
  );
}

function formatOfficeDate(now) {
  now = now || TIMENOW();
  if (!driveToken) return formatLongDate(new Date());
  const loc = lang === "pt" ? "pt-BR" : "en-GB";
  let weekday = "";
  let day = "";
  let month = "";
  try {
    const parts = new Intl.DateTimeFormat(loc, {
      timeZone: DAY_TZ,
      weekday: "long",
      day: "numeric",
      month: "short",
    }).formatToParts(new Date());
    const get = function (type) {
      const p = parts.find(function (x) {
        return x.type === type;
      });
      return p ? p.value : "";
    };
    weekday = get("weekday");
    day = get("day");
    month = get("month");
  } catch (e) {}
  if (weekday) weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const head = [weekday, (day + " " + month).trim()].filter(Boolean).join(" · ");
  if (now.open) {
    const hh = String(now.hour).padStart(2, "0");
    const mm = String(now.minute).padStart(2, "0");
    return head + " · " + t(periodLabelKey(now.period)) + " " + hh + ":" + mm;
  }
  return head + " · " + t("dateClosed");
}

function renderDateLine() {
  const dateLine = document.getElementById("dateLine");
  if (dateLine) dateLine.textContent = formatOfficeDate(TIMENOW());
}

bindNav();
bindJournal();
bindSettings();
bindDrive();
bindReminders();
bindModalNote();
bindPassages();
bindOfficeActions();
bindKeys();
bindShare();
lastOfficeStamp = TIMENOW().date + "|" + (TIMENOW().period || "gap");
setInterval(tickOffice, 20000);
(function bindNoise() {
  const sel = document.getElementById("noiseSelect");
  if (sel)
    sel.addEventListener("change", () => {
      if (noisePlaying) {
        stopNoise();
        startNoise();
      }
    });
})();
syncMediaLabels();
initFilm();
renderLog();
checkBuild();

function lockPortrait() {
  try {
    if (screen.orientation && screen.orientation.lock)
      screen.orientation.lock("portrait").catch(function () {});
  } catch (e) {}
}
lockPortrait();

function applyLaunchQuery() {
  try {
    if (!driveToken) {
      showConnectGate();
      return;
    }
    const q = new URLSearchParams(location.search);
    const pane = q.get("pane");
    const play = q.get("play");
    if (play === "chant") {
      showPane("day");
      if (officeAccess("day") !== "future") {
        playChant();
        setTimeout(function () {
          if (!chantPlaying) playChant();
        }, 500);
      }
    } else if (pane) showPane(pane);
    else showPane(landingPane());
  } catch (e) {}
}

initChant().then(applyLaunchQuery).catch(applyLaunchQuery);

if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener("message", function (e) {
    if (e.data && e.data.type === "open-pane" && e.data.pane)
      showPane(e.data.pane);
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
