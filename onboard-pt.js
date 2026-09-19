(function () {
  const KEY = "noah-onboard-pt";
  const STEPS = [
    {
      kicker: "O of\u00edcio",
      title: "Tr\u00eas horas. Uma casa.",
      body: "De manh\u00e3 o Evangelho (v\u00eddeos da Igreja). Ao meio-dia o mapa (Bible Project). \u00c0 noite um verso \u2014 salmo ou profeta."
    },
    {
      kicker: "A janela",
      title: "S\u00f3 vale na hora.",
      body: "Manh\u00e3 05:00\u201309:00. Meio-dia 12:00\u201315:00. Noite 21:00\u201300:00. Passou, fechou. N\u00e3o tem atraso. O caderno vive no seu Google Drive, n\u00e3o num servidor nosso."
    },
    {
      kicker: "Os tr\u00eas bot\u00f5es",
      title: "Escrever \u00b7 Ouvir \u00b7 Registro",
      body: "Escrever \u00e9 o of\u00edcio do momento. Ouvir \u00e9 canto gregoriano. Registro \u00e9 o que j\u00e1 foi guardado \u2014 s\u00f3 leitura. A vela troca claro e escuro."
    }
  ];

  function wantOnboard() {
    try {
      if (new URLSearchParams(location.search).get("onboard") === "1") return true;
    } catch (e) {}
    return localStorage.getItem(KEY) !== "1";
  }

  function inject() {
    if (document.getElementById("onboard-pt-css")) return;
    const s = document.createElement("style");
    s.id = "onboard-pt-css";
    s.textContent =
      "#onboardPt{position:fixed;inset:0;z-index:80;background:rgba(12,10,8,.72);display:flex;align-items:flex-end;justify-content:center;padding:1.2rem 1.2rem 5.2rem}" +
      "#onboardPt .sheet{width:min(26rem,100%);background:var(--paper,#f3ead6);color:var(--ink,#2a2118);border:1px solid var(--rule,#c9b896);padding:1.15rem 1.2rem 1.25rem}" +
      "#onboardPt .kicker{font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--rubric,#7a2418);margin:0 0 .35rem}" +
      "#onboardPt h2{font-family:'Grenze Gotisch',serif;font-weight:400;font-size:1.7rem;margin:0 0 .45rem}" +
      "#onboardPt p{font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.45;margin:0 0 1rem}" +
      "#onboardPt .row{display:flex;gap:.5rem}" +
      "#onboardPt .key{flex:1}";
    document.head.appendChild(s);
  }

  function closeOnboard() {
    localStorage.setItem(KEY, "1");
    const el = document.getElementById("onboardPt");
    if (el) el.remove();
  }

  function show(i) {
    inject();
    let wrap = document.getElementById("onboardPt");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "onboardPt";
      document.body.appendChild(wrap);
    }
    const step = STEPS[i];
    const last = i === STEPS.length - 1;
    wrap.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true">' +
      '<p class="kicker">' + step.kicker + "</p><h2>" + step.title + "</h2><p>" + step.body +
      '</p><div class="row">' +
      (i > 0 ? '<button type="button" class="key ghost" data-onb="prev">Voltar</button>' : "") +
      '<button type="button" class="key" data-onb="next">' + (last ? "Entrar" : "Continuar") +
      "</button></div></div>";
    wrap.querySelector("[data-onb='next']").addEventListener("click", function () {
      if (last) closeOnboard();
      else show(i + 1);
    });
    const prev = wrap.querySelector("[data-onb='prev']");
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
  }

  function boot() {
    if (!wantOnboard()) return;
    try { localStorage.setItem("noah-lang", "pt"); } catch (e) {}
    show(0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 200);
})();
