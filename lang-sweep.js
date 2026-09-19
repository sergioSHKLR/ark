(function () {
  const FATHER = {
    en: {
      head: "Our Father", src: "Matthew 6:9\u201313",
      lines: [
        "Our Father which art in heaven, Hallowed be thy name.",
        "Thy kingdom come. Thy will be done in earth, as it is in heaven.",
        "Give us this day our daily bread.",
        "And forgive us our debts, as we forgive our debtors.",
        "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen."
      ]
    },
    pt: {
      head: "Pai Nosso", src: "Mateus 6:9\u201313",
      lines: [
        "Pai nosso que est\u00e1s nos c\u00e9us, santificado seja o teu nome.",
        "Venha o teu reino. Seja feita a tua vontade, assim na terra como no c\u00e9u.",
        "O p\u00e3o nosso de cada dia nos d\u00e1 hoje.",
        "Perdoa-nos as nossas d\u00edvidas, assim como n\u00f3s perdoamos aos nossos devedores.",
        "E n\u00e3o nos deixes cair em tenta\u00e7\u00e3o, mas livra-nos do mal; porque teu \u00e9 o reino, e o poder, e a gl\u00f3ria, para sempre. Am\u00e9m."
      ]
    }
  };
  const PASS = {
    en: {
      morningTitle: "Matthew 3:16\u201317",
      morningBody: "And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him: and lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.",
      middayTitle: "Luke 24:27",
      middayBody: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself."
    },
    pt: {
      morningTitle: "Mateus 3:16\u201317",
      morningBody: "Batizado Jesus, saiu logo da \u00e1gua, e eis que se lhe abriram os c\u00e9us, e viu o Esp\u00edrito de Deus descendo como pomba e vindo sobre ele. E eis que uma voz dos c\u00e9us dizia: Este \u00e9 o meu Filho amado, em quem me comprazo.",
      middayTitle: "Lucas 24:27",
      middayBody: "E, come\u00e7ando por Mois\u00e9s, e por todos os profetas, explicava-lhes o que dele se achava em todas as Escrituras."
    }
  };
  const UI = {
    en: {
      demo: "Demo \u00b7 mock log \u00b7 office open",
      demoLabel: "Demo",
      tickM: "Morning", tickD: "Day", tickN: "Night",
      bpFoot: "Noon reading. Animation, then the keep."
    },
    pt: {
      demo: "Demo \u00b7 di\u00e1rio fict\u00edcio \u00b7 of\u00edcio aberto",
      demoLabel: "Demo",
      tickM: "Manh\u00e3", tickD: "Dia", tickN: "Noite",
      bpFoot: "Leitura do meio-dia. A anima\u00e7\u00e3o, depois o que guardar."
    }
  };

  function L() {
    try {
      const s = localStorage.getItem("noah-lang");
      if (s === "pt" || s === "en") return s;
    } catch (e) {}
    if (typeof lang === "string") return lang;
    return (navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  }

  function sweep() {
    const loc = L();
    if (typeof lang !== "undefined") try { lang = loc; } catch (e) {}
    if (typeof applyLang === "function") applyLang();
    const packF = FATHER[loc] || FATHER.en;
    const h = document.getElementById("ourFatherHead");
    const src = document.getElementById("ourFatherSrc");
    const box = document.getElementById("ourFatherText");
    if (h) h.textContent = packF.head;
    if (src) src.textContent = packF.src;
    if (box) box.innerHTML = packF.lines.map(function (line) { return "<p>" + line + "</p>"; }).join("");
    const packP = PASS[loc] || PASS.en;
    const t1 = document.getElementById("lessonTitle");
    const b1 = document.getElementById("lessonTeach");
    const t2 = document.getElementById("middayTitle");
    const b2 = document.getElementById("middayBody");
    if (t1) t1.textContent = packP.morningTitle;
    if (b1) b1.textContent = packP.morningBody;
    if (t2) t2.textContent = packP.middayTitle;
    if (b2) b2.textContent = packP.middayBody;
    const u = UI[loc] || UI.en;
    const banner = document.getElementById("demoBanner");
    if (banner) banner.textContent = u.demo;
    const demoLab = document.querySelector("label[for='demoToggle']");
    if (demoLab) demoLab.textContent = u.demoLabel;
    const tm = document.querySelector('[data-tick="morning"]');
    const td = document.querySelector('[data-tick="day"]');
    const tn = document.querySelector('[data-tick="night"]');
    if (tm) tm.textContent = u.tickM;
    if (td) td.textContent = u.tickD;
    if (tn) tn.textContent = u.tickN;
    const bpFoot = document.querySelector("#bpFilm .film-foot");
    if (bpFoot) bpFoot.textContent = u.bpFoot;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (key && typeof t === "function") el.textContent = t(key);
    });
  }

  function boot() {
    sweep();
    setTimeout(sweep, 300);
    setTimeout(sweep, 1400);
    setInterval(sweep, 4000);
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        const next = b.getAttribute("data-lang");
        try { localStorage.setItem("noah-lang", next); } catch (e) {}
        if (typeof lang !== "undefined") lang = next;
        setTimeout(sweep, 20);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 180);
})();
