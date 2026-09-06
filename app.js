const STORE = "noah-journal-v2";
const LANG_KEY = "noah-lang";
const THEME_KEY = "noah-theme";
const DRIVE_CLIENT_KEY = "noah-drive-client-id";
const DRIVE_FILE_KEY = "noah-drive-file-id";
const DRIVE_SYNC_KEY = "noah-drive-synced";
const DRIVE_FILE_NAME = "ark-journal.json";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILM_EPOCH = "2026-09-06";

let lang = localStorage.getItem(LANG_KEY) === "pt" ? "pt" : "en";
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
  const apple = document.querySelector(
    'meta[name="apple-mobile-web-app-title"]',
  );
  if (apple) apple.setAttribute("content", name);
  const man = document.querySelector('link[rel="manifest"]');
  if (man)
    man.setAttribute(
      "href",
      lang === "pt" ? "manifest-pt.json" : "manifest.json",
    );
}
applyAppName();

function t(key) {
  const pack = {
    en: {
      filmFoot: "Watch first. Then pray and read.",
      filmCaption: "English picture. Captions on.",
      settingsDrive: "Google Drive",
      driveHint:
        "Backs the journal into a private Drive app-data file. Each Google account is its own ark. Needs a Google Cloud OAuth client ID (Web application) whose origins include this site.",
      driveClient: "OAuth client ID",
      driveConnect: "Connect Drive",
      driveSync: "Sync now",
      driveSignOut: "Sign out",
      driveOff: "Not connected.",
      driveOn: "Connected. Sync after you write, or tap Sync now.",
      driveNeedId: "Paste a Web OAuth client ID first.",
      driveNeedGis: "Could not load Google sign-in.",
      driveOk: "Synced.",
      driveErr: "Sync failed.",
    },
    pt: {
      filmFoot: "Assista primeiro. Depois ore e leia.",
      filmCaption: "Imagem em ingl\u00eas. Legendas ligadas.",
      settingsDrive: "Google Drive",
      driveHint:
        "Copia o diário para um arquivo privado no Drive (dados do app). Cada conta Google é a sua arca. Precisa de um client ID OAuth (aplicativo da Web) com a origem deste site.",
      driveClient: "Client ID OAuth",
      driveConnect: "Conectar Drive",
      driveSync: "Sincronizar agora",
      driveSignOut: "Sair",
      driveOff: "Não conectado.",
      driveOn: "Conectado. Sincroniza depois de escrever, ou toque em Sincronizar agora.",
      driveNeedId: "Cole primeiro um client ID OAuth da Web.",
      driveNeedGis: "Não deu para carregar o login Google.",
      driveOk: "Sincronizado.",
      driveErr: "A sincronização falhou.",
    },
  };
  return (pack[lang] && pack[lang][key]) || pack.en[key] || key;
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
  iframe.src =
    "https://www.youtube-nocookie.com/embed/" +
    id +
    "?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3" +
    (usePt ? "" : "&cc_load_policy=1&cc_lang_pref=en");
  iframe.allow = "accelerometer; encrypted-media; picture-in-picture";
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

function todayKey() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
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
  scheduleDriveSync();
}

let driveToken = "";
let driveSyncTimer = 0;
let tokenClient = null;

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
}

function applyDriveLabels() {
  const map = [
    ["driveHint", "driveHint"],
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
  setDriveStatus(driveToken ? t("driveOn") : t("driveOff"));
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

async function driveFindFile() {
  const cached = localStorage.getItem(DRIVE_FILE_KEY);
  if (cached) return cached;
  const q = encodeURIComponent("name='" + DRIVE_FILE_NAME + "'");
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=" +
      q +
      "&fields=files(id,name)",
    { headers: driveHeaders() },
  );
  if (!res.ok) throw new Error("list");
  const data = await res.json();
  const id = data.files && data.files[0] && data.files[0].id;
  if (id) localStorage.setItem(DRIVE_FILE_KEY, id);
  return id || "";
}

async function driveDownload(id) {
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files/" + id + "?alt=media",
    { headers: driveHeaders() },
  );
  if (res.status === 404) return {};
  if (!res.ok) throw new Error("get");
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
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

function mergeNotes(a, b, preferB) {
  const out = Object.assign({}, a || {});
  Object.keys(b || {}).forEach((slot) => {
    const bv = b[slot] || "";
    const av = out[slot] || "";
    if (!av) out[slot] = bv;
    else if (!bv) return;
    else out[slot] = preferB ? bv : av;
  });
  return out;
}

function mergeJournals(local, remote) {
  const out = {};
  const keys = new Set(
    Object.keys(local || {}).concat(Object.keys(remote || {})),
  );
  keys.forEach((day) => {
    const L = local[day] || { checks: {}, notes: {}, updatedAt: "" };
    const R = remote[day] || { checks: {}, notes: {}, updatedAt: "" };
    const preferLocal = (L.updatedAt || "") >= (R.updatedAt || "");
    const newer = preferLocal ? L : R;
    const older = preferLocal ? R : L;
    out[day] = {
      checks: Object.assign({}, older.checks || {}, newer.checks || {}),
      notes: mergeNotes(older.notes, newer.notes, true),
      updatedAt: newer.updatedAt || older.updatedAt || "",
    };
  });
  return out;
}

async function syncDrive() {
  if (!driveToken) throw new Error("auth");
  const local = loadJournal();
  const fileId = await driveFindFile();
  const remote = fileId ? await driveDownload(fileId) : {};
  const merged = mergeJournals(local, remote);
  await driveUpload(merged, fileId);
  saveJournalSilent(merged);
  localStorage.setItem(DRIVE_SYNC_KEY, new Date().toISOString());
  bindJournalRefresh();
}

function saveJournalSilent(data) {
  localStorage.setItem(STORE, JSON.stringify(data));
}

function scheduleDriveSync() {
  if (!driveToken) return;
  clearTimeout(driveSyncTimer);
  driveSyncTimer = setTimeout(() => {
    syncDrive()
      .then(() => setDriveStatus(t("driveOk")))
      .catch(() => setDriveStatus(t("driveErr")));
  }, 2500);
}

function bindJournalRefresh() {
  const data = loadJournal();
  const day = data[todayKey()] || { checks: {}, notes: {} };
  document.querySelectorAll("[data-check]").forEach((box) => {
    const key = box.getAttribute("data-check");
    box.checked = !!day.checks[key];
  });
  document.querySelectorAll("textarea.note[data-slot]").forEach((area) => {
    const slot = area.getAttribute("data-slot");
    if (document.activeElement !== area) area.value = day.notes[slot] || "";
  });
}

async function connectDrive() {
  const id = driveClientId();
  if (!id) {
    setDriveStatus(t("driveNeedId"));
    return;
  }
  localStorage.setItem(DRIVE_CLIENT_KEY, id);
  try {
    await loadGis();
  } catch (e) {
    setDriveStatus(t("driveNeedGis"));
    return;
  }
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: id,
    scope: DRIVE_SCOPE,
    callback: (resp) => {
      if (resp && resp.access_token) {
        driveToken = resp.access_token;
        setDriveStatus(t("driveOn"));
        syncDrive()
          .then(() => setDriveStatus(t("driveOk")))
          .catch(() => setDriveStatus(t("driveErr")));
      } else setDriveStatus(t("driveErr"));
    },
  });
  tokenClient.requestAccessToken({ prompt: driveToken ? "" : "consent" });
}

function signOutDrive() {
  const done = () => {
    driveToken = "";
    localStorage.removeItem(DRIVE_FILE_KEY);
    setDriveStatus(t("driveOff"));
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
  if (conn) conn.addEventListener("click", connectDrive);
  if (sync)
    sync.addEventListener("click", () => {
      if (!driveToken) return connectDrive();
      syncDrive()
        .then(() => setDriveStatus(t("driveOk")))
        .catch(() => setDriveStatus(t("driveErr")));
    });
  if (out) out.addEventListener("click", signOutDrive);
  applyDriveLabels();
}

function showPane(name) {
  document.querySelectorAll(".pane").forEach((p) => {
    p.hidden = p.id !== "pane-" + name;
  });
  document.querySelectorAll(".nav-bar button").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-pane") === name);
  });
}

function bindJournal() {
  const data = loadJournal();
  const day = data[todayKey()] || { checks: {}, notes: {} };
  document.querySelectorAll("[data-check]").forEach((box) => {
    const key = box.getAttribute("data-check");
    box.checked = !!day.checks[key];
    box.addEventListener("change", () => {
      const j = loadJournal();
      const k = todayKey();
      j[k] = j[k] || { checks: {}, notes: {} };
      j[k].checks[key] = box.checked;
      j[k].updatedAt = new Date().toISOString();
      saveJournal(j);
    });
  });
  document.querySelectorAll("textarea.note[data-slot]").forEach((area) => {
    const slot = area.getAttribute("data-slot");
    area.value = day.notes[slot] || "";
    area.addEventListener("input", () => {
      const j = loadJournal();
      const k = todayKey();
      j[k] = j[k] || { checks: {}, notes: {} };
      j[k].notes[slot] = area.value;
      j[k].updatedAt = new Date().toISOString();
      saveJournal(j);
    });
  });
}

function bindNav() {
  document.querySelectorAll(".nav-bar button").forEach((b) => {
    b.addEventListener("click", () => showPane(b.getAttribute("data-pane")));
  });
}

function bindSettings() {
  const btn = document.getElementById("settingsBtn");
  const modal = document.getElementById("settingsModal");
  if (btn && modal) {
    btn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    b.addEventListener("click", () => {
      lang = b.getAttribute("data-lang");
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
      applyAppName();
      document.querySelectorAll("[data-lang]").forEach((x) => {
        x.classList.toggle("active", x.getAttribute("data-lang") === lang);
      });
      renderFilm();
      applyDriveLabels();
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
    });
  });
}

function closeSettings() {
  const modal = document.getElementById("settingsModal");
  if (modal) modal.style.display = "none";
}
function closeModal() {
  const modal = document.getElementById("scriptureModal");
  if (modal) modal.style.display = "none";
}
function openScripture() {}
function toggleNativeAudio() {}

const dateLine = document.getElementById("dateLine");
if (dateLine) {
  dateLine.textContent = new Date().toLocaleDateString(
    lang === "pt" ? "pt-BR" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );
}

bindNav();
bindJournal();
bindSettings();
bindDrive();
initFilm();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
