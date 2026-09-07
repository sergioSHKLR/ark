const STORE = "noah-journal-v2";
const LANG_KEY = "noah-lang";
const THEME_KEY = "noah-theme";
const DRIVE_CLIENT_KEY = "noah-drive-client-id";
const DRIVE_FILE_KEY = "noah-drive-file-id";
const DRIVE_SYNC_KEY = "noah-drive-synced";
const DRIVE_FILE_NAME = "ark-journal.json";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILM_EPOCH = "2026-09-06";
const APP_BUILD = 54;
const DAY_TZ = "America/Sao_Paulo";
const DRIVE_CONSENT_KEY = "noah-drive-consented";

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

function t(key) {
  const pack = {
    en: {
      subtitle: "The Noah Protocol",
      filmHead: "Today's film",
      filmFoot: "Watch first. Then pray and read.",
      filmCaption: "English picture. Turn on captions.",
      namePray: "Pray",
      nameRead: "Read",
      passMat6: "Matthew 6:6–13 · the inner room",
      passMat26: "Matthew 26:38–39 · Gethsemane",
      passProv4: "Proverbs 4:23",
      passAmos: "Amos 5:13",
      passRom18: "Romans 12:17–18",
      passEcc4: "Ecclesiastes 4:9–12",
      passProv17: "Proverbs 17:1",
      passTh4: "1 Thessalonians 4:11–12",
      desk: "Desk",
      deskLead: "Latin chant while you work. No English, no Portuguese, no drums. Local files replace YouTube when you add them.",
      chantRest: "Chant at rest",
      chantLocal: "Playing local files from audio/",
      chantYt: "YouTube (temporary). Add audio/playlist.json to go offline.",
      prev: "Prev",
      play: "Play",
      pause: "Pause",
      next: "Next",
      nameForum: "Stay out of the Forum",
      nameTongue: "Hold the tongue",
      nameWife: "Keep the marriage off the campaign",
      nameTable: "Keep the election off the table",
      nameWork: "Work with your hands",
      closing: "Closing notes",
      noiseWhite: "White noise",
      noiseRain: "Rain",
      noiseOcean: "Ocean",
      noiseCrickets: "Crickets",
      logTitle: "The log",
      logEmpty: "The log fills as you write. Come back tomorrow.",
      statDays: "Days",
      statStreak: "In a row",
      statChars: "Characters",
      navMorning: "Morning",
      navDay: "Day",
      navNight: "Night",
      navLog: "Log",
      navAria: "The day",
      slotPray: "Prayer",
      slotReading: "Reading",
      slotForum: "The Forum",
      slotTongue: "The tongue",
      slotWife: "The marriage",
      slotTable: "The table",
      slotWork: "The hands",
      slotNight: "Closing",
      slotPassage: "Passage",
      remindHead: "Bells",
      remindNote: "Set a time for morning, day, and night. While this app is open it can ring. Add the calendar file so the phone still rings when the app is closed.",
      remindEnable: "Enable",
      remindIcs: "Add to phone calendar",
      "remindTitle-morning": "Ark · Morning",
      "remindBody-morning": "Pray, read, write. Then go out.",
      "remindTitle-day": "Ark · Day",
      "remindBody-day": "Stay out of the Forum. Keep the house.",
      "remindTitle-night": "Ark · Night",
      "remindBody-night": "Close the day. A few true sentences, then quiet.",
      settingsTitle: "Settings",
      settingsBtn: "Settings",
      settingsLang: "Language",
      settingsTheme: "Theme",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      settingsDrive: "Google Drive",
      driveHint:
        "Private journal in Drive app data — it will not appear in My Drive. Connect once on each device. Notes upload when you tap Sync now, or when you leave the page. After a sync, the line below shows a time and how many days came through.",
      driveEmpty:
        "Synced, but no notes came through. On the phone, reload this update and tap Sync now first. Then sync here.",
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
      buildLabel: "Build",
      buildCurrent: "This copy is up to date.",
      buildUpdate: "A newer build is on the server.",
      buildReload: "Reload to update",
      buildUnknown: "Could not check for a newer build.",
      buildOffline: "Offline. Could not check.",
    },
    pt: {
      subtitle: "O Protocolo de Noé",
      filmHead: "O filme de hoje",
      filmFoot: "Assista primeiro. Depois ore e leia.",
      filmCaption: "Vídeo em inglês. Ligue as legendas.",
      namePray: "Orar",
      nameRead: "Ler",
      passMat6: "Mateus 6:6–13 · o quarto interior",
      passMat26: "Mateus 26:38–39 · Getsêmani",
      passProv4: "Provérbios 4:23",
      passAmos: "Amós 5:13",
      passRom18: "Romanos 12:17–18",
      passEcc4: "Eclesiastes 4:9–12",
      passProv17: "Provérbios 17:1",
      passTh4: "1 Tessalonicenses 4:11–12",
      desk: "Mesa",
      deskLead: "Canto em latim enquanto você trabalha. Sem inglês, sem português, sem tambores. Arquivos locais substituem o YouTube quando você os adiciona.",
      chantRest: "Canto em pausa",
      chantLocal: "Reproduzindo arquivos locais em audio/",
      chantYt: "YouTube (provisório). Coloque audio/playlist.json para ficar offline.",
      prev: "Anterior",
      play: "Tocar",
      pause: "Pausar",
      next: "Próximo",
      nameForum: "Fique fora do Fórum",
      nameTongue: "Guarde a língua",
      nameWife: "O casamento fora da campanha",
      nameTable: "A eleição fora da mesa",
      nameWork: "Trabalhe com as mãos",
      closing: "Notas de encerramento",
      noiseWhite: "Ruído branco",
      noiseRain: "Chuva",
      noiseOcean: "Oceano",
      noiseCrickets: "Grilos",
      logTitle: "O diário",
      logEmpty: "O diário enche quando você escreve. Volte amanhã.",
      statDays: "Dias",
      statStreak: "Seguidos",
      statChars: "Caracteres",
      navMorning: "Manhã",
      navDay: "Dia",
      navNight: "Noite",
      navLog: "Diário",
      navAria: "O dia",
      slotPray: "Oração",
      slotReading: "Leitura",
      slotForum: "O Fórum",
      slotTongue: "A língua",
      slotWife: "O casamento",
      slotTable: "A mesa",
      slotWork: "As mãos",
      slotNight: "Encerramento",
      slotPassage: "Passagem",
      remindHead: "Sinos",
      remindNote: "Marque um horário para manhã, dia e noite. Com o aplicativo aberto, ele pode tocar. Adicione o arquivo de calendário para o telefone tocar mesmo com o aplicativo fechado.",
      remindEnable: "Ativar",
      remindIcs: "Adicionar ao calendário do telefone",
      "remindTitle-morning": "Arca · Manhã",
      "remindBody-morning": "Ore, leia, escreva. Depois saia.",
      "remindTitle-day": "Arca · Dia",
      "remindBody-day": "Fora do Fórum. Guarde a casa.",
      "remindTitle-night": "Arca · Noite",
      "remindBody-night": "Feche o dia. Algumas frases verdadeiras, depois silêncio.",
      settingsTitle: "Configurações",
      settingsBtn: "Configurações",
      settingsLang: "Idioma",
      settingsTheme: "Tema",
      themeSystem: "Sistema",
      themeLight: "Claro",
      themeDark: "Escuro",
      settingsDrive: "Google Drive",
      driveHint:
        "Diário privado nos dados do app no Drive — não aparece em Meu Drive. Conecte uma vez em cada aparelho. As notas sobem quando você toca em Sincronizar agora, ou quando sai da página. Depois de sincronizar, a linha abaixo mostra o horário e quantos dias chegaram.",
      driveEmpty:
        "Sincronizado, mas nenhuma nota chegou. No celular, recarregue esta atualização e toque em Sincronizar agora. Depois sincronize aqui.",
      driveClient: "Client ID OAuth",
      driveConnect: "Conectar Drive",
      driveSync: "Sincronizar agora",
      driveSignOut: "Sair",
      driveOff: "Não conectado.",
      driveOn: "Conectado. Sincronize depois de escrever, ou toque em Sincronizar agora.",
      driveNeedId: "Cole primeiro um client ID OAuth da Web.",
      driveNeedGis: "Não foi possível carregar o login Google.",
      driveOk: "Sincronizado.",
      driveErr: "A sincronização falhou.",
      buildLabel: "Versão",
      buildCurrent: "Esta cópia está atualizada.",
      buildUpdate: "Há uma versão mais nova no servidor.",
      buildReload: "Recarregar para atualizar",
      buildUnknown: "Não foi possível verificar se há versão nova.",
      buildOffline: "Sem rede. Não foi possível verificar.",
    },
  };
  return (pack[lang] && pack[lang][key]) || pack.en[key] || key;
}

function applyLang() {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.documentElement.setAttribute("dir", "ltr");
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    if (el.id === "chantPlay" || el.id === "audioActionBtn") return;
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });
  renderOurFather();
  renderQuote();
}

function pickQuote() {
  const list = typeof QUOTES !== "undefined" ? QUOTES : [];
  if (!list.length) return null;
  return list[hashStr(todayKey() + ":q") % list.length];
}

function renderQuote() {
  const q = pickQuote();
  document.querySelectorAll("[data-quote]").forEach(function (el) {
    if (!q) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const loc = lang === "pt" && q.pt ? q.pt : q;
    const src = el.querySelector(".daily-quote-src");
    const text = el.querySelector(".daily-quote-text");
    if (src) src.textContent = loc.src || "";
    if (text) text.textContent = loc.text || "";
  });
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

function todayKey(d) {
  const dt = d || new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: DAY_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(dt);
    const get = (type) => {
      const p = parts.find((x) => x.type === type);
      return p ? p.value : "";
    };
    return get("year") + "-" + get("month") + "-" + get("day");
  } catch (e) {
    return (
      dt.getFullYear() +
      "-" +
      String(dt.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(dt.getDate()).padStart(2, "0")
    );
  }
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
  renderLog();
}

let driveToken = "";
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
  if (driveToken) {
    const when = formatSyncAt();
    setDriveStatus(when ? t("driveOn") + " " + t("driveOk") + " " + when : t("driveOn"));
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

function scheduleDriveSync() {
  if (!driveToken) return;
  clearTimeout(driveSyncTimer);
  driveSyncTimer = setTimeout(() => {
    syncDrive()
      .then(() => markDriveOk())
      .catch(() => setDriveStatus(t("driveErr")));
  }, 1200);
}

function flushDriveSync() {
  if (!driveToken) return;
  clearTimeout(driveSyncTimer);
  syncDrive()
    .then(() => markDriveOk())
    .catch(() => setDriveStatus(t("driveErr")));
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
  renderLog();
}

function onDriveToken(resp, fromSilent) {
  if (resp && resp.access_token) {
    driveToken = resp.access_token;
    localStorage.setItem(DRIVE_CONSENT_KEY, "1");
    setDriveStatus(t("driveOn"));
    syncDrive()
      .then(() => markDriveOk())
      .catch(() => setDriveStatus(t("driveErr")));
    return;
  }
  if (!fromSilent) setDriveStatus(t("driveErr"));
}

async function ensureTokenClient() {
  const id = driveClientId();
  if (!id) throw new Error("id");
  localStorage.setItem(DRIVE_CLIENT_KEY, id);
  await loadGis();
  if (tokenClient && tokenClient._arkId === id) return tokenClient;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: id,
    scope: DRIVE_SCOPE,
    callback: (resp) => onDriveToken(resp, false),
    error_callback: function () {},
  });
  tokenClient._arkId = id;
  return tokenClient;
}

async function connectDrive(silent) {
  const id = driveClientId();
  if (!id) {
    if (!silent) setDriveStatus(t("driveNeedId"));
    return;
  }
  try {
    await ensureTokenClient();
  } catch (e) {
    if (!silent) setDriveStatus(t("driveNeedGis"));
    return;
  }
  tokenClient.callback = (resp) => onDriveToken(resp, !!silent);
  tokenClient.requestAccessToken({
    prompt: silent || driveToken ? "" : "consent",
  });
}

function signOutDrive() {
  const done = () => {
    driveToken = "";
    localStorage.removeItem(DRIVE_FILE_KEY);
    localStorage.removeItem(DRIVE_CONSENT_KEY);
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
  if (conn) conn.addEventListener("click", () => connectDrive(false));
  if (sync)
    sync.addEventListener("click", () => {
      if (!driveToken) return connectDrive(false);
      syncDrive()
        .then(() => markDriveOk())
        .catch(() => setDriveStatus(t("driveErr")));
    });
  if (out) out.addEventListener("click", signOutDrive);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushDriveSync();
  });
  window.addEventListener("pagehide", flushDriveSync);
  applyDriveLabels();
  if (
    localStorage.getItem(DRIVE_CONSENT_KEY) === "1" ||
    localStorage.getItem(DRIVE_FILE_KEY)
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

function drawChantWave() {
  const c = document.getElementById("chantWave");
  if (!c) return;
  sizeChantWave();
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const w = c.width;
  const h = c.height;
  ctx.clearRect(0, 0, w, h);
  const style = getComputedStyle(document.body);
  ctx.strokeStyle = (style.getPropertyValue("--ink") || "#2a2118").trim();
  ctx.globalAlpha = chantPlaying ? 0.85 : 0.35;
  ctx.lineWidth = Math.max(1, w / 420);
  ctx.beginPath();
  if (chantAnalyser && chantLoaded && chantMode === "local") {
    const buf = new Uint8Array(chantAnalyser.fftSize);
    chantAnalyser.getByteTimeDomainData(buf);
    for (let i = 0; i < buf.length; i++) {
      const x = (i / (buf.length - 1)) * w;
      const y = (buf[i] / 255) * h;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
  } else {
    const t = Date.now() / 900;
    const amp = chantPlaying ? 0.2 : 0.045;
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * w;
      const y =
        h / 2 +
        Math.sin(t + i * 0.28) * h * amp +
        Math.sin(t * 0.37 + i * 0.11) * h * amp * 0.55;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
  chantWaveRaf = requestAnimationFrame(drawChantWave);
}

function startChantWave() {
  if (chantWaveRaf) return;
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
    return;
  }
  if (iframe && iframe.src) {
    chantYtCommand("playVideo");
    chantPlaying = true;
    updateChantButton();
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
    chantAnalyser.fftSize = 256;
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
  renderChant(false);
}

function showPane(name) {
  document.querySelectorAll(".pane").forEach((p) => {
    p.hidden = p.id !== "pane-" + name;
  });
  document.querySelectorAll(".nav-bar button").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-pane") === name);
  });
  if (name === "log") renderLog();
}

const SLOT_KEY = {
  pray: "slotPray",
  reading: "slotReading",
  forum: "slotForum",
  tongue: "slotTongue",
  wife: "slotWife",
  table: "slotTable",
  work: "slotWork",
  night: "slotNight",
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
    { weekday: "short", day: "numeric", month: "short", year: "numeric" },
  );
}

function readingForDay(dateKey) {
  const list = typeof READINGS !== "undefined" ? READINGS : [];
  if (!list.length) return null;
  return list[hashStr(dateKey) % list.length];
}

function renderLog() {
  const stats = document.getElementById("logStats");
  const list = document.getElementById("logList");
  if (!stats || !list) return;
  const days = allDays();
  const used = days.filter(dayUsed);
  const chars = days.reduce((n, d) => n + noteChars(d), 0);
  const streak = countStreak(used.map((d) => d.date));
  const loc = lang === "pt" ? "pt-BR" : "en-GB";
  stats.innerHTML =
    '<div class="stat"><b>' +
    used.length +
    "</b><span>" +
    t("statDays") +
    "</span></div>" +
    '<div class="stat"><b>' +
    streak +
    "</b><span>" +
    t("statStreak") +
    "</span></div>" +
    '<div class="stat"><b>' +
    chars.toLocaleString(loc) +
    "</b><span>" +
    t("statChars") +
    "</span></div>";
  if (!used.length) {
    list.innerHTML = '<p class="log-empty">' + t("logEmpty") + "</p>";
    return;
  }
  list.innerHTML = used
    .map((d) => {
      const reading = readingForDay(d.date);
      const body = Object.keys(SLOT_KEY)
        .map((slot) => {
          const note = (d.notes && d.notes[slot]) || "";
          if (!note.trim()) return "";
          return (
            '<div class="log-entry"><div class="k">' +
            t(SLOT_KEY[slot]) +
            "</div><p>" +
            esc(note) +
            "</p></div>"
          );
        })
        .join("");
      const extra =
        lang === "pt" && reading && typeof READING_PT !== "undefined"
          ? READING_PT[reading.id]
          : null;
      const src = reading
        ? '<div class="log-entry"><div class="k">' +
          t("slotPassage") +
          "</div><p>" +
          esc(extra && extra.src ? extra.src : reading.src) +
          "</p></div>"
        : "";
      return (
        '<details class="log-day"><summary>' +
        formatDay(d.date) +
        ' <span class="meta">· ' +
        noteChars(d).toLocaleString(loc) +
        " " +
        t("statChars").toLowerCase() +
        "</span></summary>" +
        src +
        body +
        "</details>"
      );
    })
    .join("");
}

const REMIND_KEY = "noah-reminders-v1";
const REMIND_PANES = ["morning", "day", "night"];

function defaultRemind() {
  return {
    enabled: false,
    morning: "06:00",
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
      renderReading();
      if (openPassageKey) openScripture(openPassageKey, openPassageSlot);
      renderChant(chantPlaying);
      syncMediaLabels();
      applyDriveLabels();
      applyBuildLabels();
      checkBuild();
      renderLog();
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
    if (openPassageSlot) {
      const day = loadJournal()[todayKey()] || { notes: {} };
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
    const j = loadJournal();
    const k = todayKey();
    j[k] = j[k] || { checks: {}, notes: {} };
    j[k].notes[slot] = modalTa.value;
    j[k].updatedAt = new Date().toISOString();
    saveJournal(j);
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

function renderDateLine() {
  const dateLine = document.getElementById("dateLine");
  if (dateLine) dateLine.textContent = formatLongDate(new Date());
}

bindNav();
bindJournal();
bindSettings();
bindDrive();
bindReminders();
bindModalNote();
bindPassages();
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
renderReading();
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
    const q = new URLSearchParams(location.search);
    const pane = q.get("pane");
    const play = q.get("play");
    if (play === "chant") {
      showPane("day");
      playChant();
      setTimeout(function () {
        if (!chantPlaying) playChant();
      }, 500);
    } else if (pane) showPane(pane);
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
