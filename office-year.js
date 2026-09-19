const OFFICE_EPOCH = "2026-09-21";

const OFFICE_BP_NT = [
  { id: "Q0BrP8bqj0c", title: { en: "New Testament overview", pt: "Vis\u00e3o do Novo Testamento" }, ref: "NT" },
  { id: "3Dv4-n6OYGI", title: { en: "Matthew 1\u201313", pt: "Mateus 1\u201313" }, ref: "Matthew 1\u201313" },
  { id: "GGCF3OPWN14", title: { en: "Matthew 14\u201328", pt: "Mateus 14\u201328" }, ref: "Matthew 14\u201328" },
  { id: "HGHqu9-DtXk", title: { en: "Mark", pt: "Marcos" }, ref: "Mark" },
  { id: "XIb_dCIxzr0", title: { en: "Luke 1\u20139", pt: "Lucas 1\u20139" }, ref: "Luke 1\u20139" },
  { id: "26z_KhwNdD8", title: { en: "Luke 10\u201324", pt: "Lucas 10\u201324" }, ref: "Luke 10\u201324" },
  { id: "G-2e9mMf7E8", title: { en: "John 1\u201312", pt: "Jo\u00e3o 1\u201312" }, ref: "John 1\u201312" },
  { id: "RUfh_wOsauk", title: { en: "John 13\u201321", pt: "Jo\u00e3o 13\u201321" }, ref: "John 13\u201321" }
];

const OFFICE_NIGHT = [
  { ref: "Psalm 4:8", en: "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.", pt: "Em paz me deito e durmo, porque s\u00f3 tu, SENHOR, me fazes habitar em seguran\u00e7a." },
  { ref: "Psalm 16:8", en: "I have set the LORD always before me: because he is at my right hand, I shall not be moved.", pt: "Tenho posto o SENHOR continuamente diante de mim; porque est\u00e1 \u00e0 minha m\u00e3o direita, n\u00e3o vacilarei." },
  { ref: "Psalm 23:1\u20132", en: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures.", pt: "O SENHOR \u00e9 o meu pastor; nada me faltar\u00e1. Deitar-me faz em verdes pastos." },
  { ref: "Psalm 27:1", en: "The LORD is my light and my salvation; whom shall I fear?", pt: "O SENHOR \u00e9 a minha luz e a minha salva\u00e7\u00e3o; a quem temerei?" },
  { ref: "Psalm 31:5", en: "Into thine hand I commit my spirit: thou hast redeemed me, O LORD God of truth.", pt: "Nas tuas m\u00e3os encomendo o meu esp\u00edrito; tu me remiste, SENHOR, Deus da verdade." },
  { ref: "Psalm 34:8", en: "O taste and see that the LORD is good: blessed is the man that trusteth in him.", pt: "Provai e vede que o SENHOR \u00e9 bom; bem-aventurado o homem que nele confia." },
  { ref: "Psalm 37:7", en: "Rest in the LORD, and wait patiently for him.", pt: "Descansa no SENHOR, e espera nele." },
  { ref: "Psalm 42:1", en: "As the hart panteth after the water brooks, so panteth my soul after thee, O God.", pt: "Como o cervo brama pelas correntes das \u00e1guas, assim a minha alma brama por ti, \u00f3 Deus." },
  { ref: "Psalm 46:10", en: "Be still, and know that I am God.", pt: "Aquietai-vos, e sabei que eu sou Deus." },
  { ref: "Psalm 51:10", en: "Create in me a clean heart, O God; and renew a right spirit within me.", pt: "Cria em mim, \u00f3 Deus, um cora\u00e7\u00e3o puro, e renova em mim um esp\u00edrito reto." },
  { ref: "Psalm 62:1", en: "Truly my soul waiteth upon God: from him cometh my salvation.", pt: "A minha alma espera somente em Deus; dele vem a minha salva\u00e7\u00e3o." },
  { ref: "Psalm 63:1", en: "O God, thou art my God; early will I seek thee.", pt: "\u00d3 Deus, tu \u00e9s o meu Deus; de madrugada te buscarei." },
  { ref: "Psalm 90:12", en: "So teach us to number our days, that we may apply our hearts unto wisdom.", pt: "Ensina-nos a contar os nossos dias, para que alcancemos cora\u00e7\u00e3o s\u00e1bio." },
  { ref: "Psalm 91:1", en: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.", pt: "Aquele que habita no esconderijo do Alt\u00edssimo, \u00e0 sombra do Onipotente descansar\u00e1." },
  { ref: "Psalm 103:1", en: "Bless the LORD, O my soul: and all that is within me, bless his holy name.", pt: "Bendize, \u00f3 minha alma, ao SENHOR, e tudo o que h\u00e1 em mim bendiga o seu santo nome." },
  { ref: "Psalm 119:105", en: "Thy word is a lamp unto my feet, and a light unto my path.", pt: "L\u00e2mpada para os meus p\u00e9s \u00e9 a tua palavra, e luz para o meu caminho." },
  { ref: "Psalm 121:1\u20132", en: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD.", pt: "Elevo os meus olhos para os montes, de onde me vir\u00e1 o socorro. O meu socorro vem do SENHOR." },
  { ref: "Psalm 127:1", en: "Except the LORD build the house, they labour in vain that build it.", pt: "Se o SENHOR n\u00e3o edificar a casa, em v\u00e3o trabalham os que a edificam." },
  { ref: "Psalm 130:5", en: "I wait for the LORD, my soul doth wait, and in his word do I hope.", pt: "Aguardo o SENHOR; a minha alma o aguarda, e no seu verbo espero." },
  { ref: "Psalm 139:23\u201324", en: "Search me, O God, and know my heart: try me, and know my thoughts.", pt: "Sonda-me, \u00f3 Deus, e conhece o meu cora\u00e7\u00e3o; prova-me, e conhece os meus pensamentos." },
  { ref: "Proverbs 3:5\u20136", en: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", pt: "Confia no SENHOR de todo o teu cora\u00e7\u00e3o, e n\u00e3o te estribes no teu pr\u00f3prio entendimento." },
  { ref: "Proverbs 15:1", en: "A soft answer turneth away wrath: but grievous words stir up anger.", pt: "A resposta branda desvia o furor, mas a palavra dura suscita a ira." },
  { ref: "Proverbs 16:9", en: "A man's heart deviseth his way: but the LORD directeth his steps.", pt: "O cora\u00e7\u00e3o do homem planeja o seu caminho, mas o SENHOR dirige os seus passos." },
  { ref: "Isaiah 26:3", en: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", pt: "Tu conservar\u00e1s em paz aquele cuja mente est\u00e1 firme em ti; porque ele confia em ti." },
  { ref: "Isaiah 40:31", en: "They that wait upon the LORD shall renew their strength.", pt: "Os que esperam no SENHOR renovar\u00e3o as suas for\u00e7as." },
  { ref: "Isaiah 55:6", en: "Seek ye the LORD while he may be found, call ye upon him while he is near.", pt: "Buscai ao SENHOR enquanto se pode achar, invocai-o enquanto est\u00e1 perto." },
  { ref: "Micah 6:8", en: "What doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?", pt: "Que \u00e9 o que o SENHOR pede de ti, sen\u00e3o que pratiques a justi\u00e7a, e ames a benignidade, e andes humildemente com o teu Deus?" },
  { ref: "Lamentations 3:22\u201323", en: "It is of the LORD's mercies that we are not consumed... they are new every morning.", pt: "As miseric\u00f3rdias do SENHOR s\u00e3o a causa de n\u00e3o sermos consumidos... renovam-se cada manh\u00e3." },
  { ref: "Habakkuk 2:20", en: "The LORD is in his holy temple: let all the earth keep silence before him.", pt: "O SENHOR est\u00e1 no seu santo templo; cale-se diante dele toda a terra." },
  { ref: "Malachi 4:2", en: "Unto you that fear my name shall the Sun of righteousness arise with healing in his wings.", pt: "A v\u00f3s que temeis o meu nome nascer\u00e1 o sol da justi\u00e7a, e cura trar\u00e1 nas suas asas." }
];

function officeDayIndex(dateKey) {
  const key = dateKey || (typeof todayKey === "function" ? todayKey() : "");
  const a = Date.parse(OFFICE_EPOCH + "T00:00:00Z");
  const b = Date.parse(key + "T00:00:00Z");
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}

function pickBibleProjectOffice(dateKey) {
  return OFFICE_BP_NT[officeDayIndex(dateKey) % OFFICE_BP_NT.length];
}

function pickNightOffice(dateKey) {
  return OFFICE_NIGHT[officeDayIndex(dateKey) % OFFICE_NIGHT.length];
}

function nightLoc(row) {
  if (!row) return null;
  const usePt = typeof lang !== "undefined" && lang === "pt";
  return { ref: row.ref, text: usePt ? row.pt : row.en };
}

function applyNightOffice() {
  const loc = nightLoc(pickNightOffice());
  if (!loc) return;
  const title = document.getElementById("nightTitle");
  const close = document.getElementById("lessonClose");
  if (title) title.textContent = loc.ref;
  if (close) close.textContent = loc.text;
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", applyNightOffice);
else setTimeout(applyNightOffice, 80);
