const STORE = "noah-journal-v2";
const LANG_KEY = "noah-lang";
const THEME_KEY = "noah-theme";
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

function t(key) {
  const pack = {
    en: {
      filmFoot: "Watch first. Then pray and read.",
      filmCaption: "English picture. Captions on.",
    },
    pt: {
      filmFoot: "Assista primeiro. Depois ore e leia.",
      filmCaption: "Imagem em ingl\u00eas. Legendas ligadas.",
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
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-lang]").forEach((x) => {
        x.classList.toggle("active", x.getAttribute("data-lang") === lang);
      });
      renderFilm();
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
initFilm();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
