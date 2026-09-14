const FILM_EPOCH = "2026-09-06";

function pickLesson(dateKey) {
  const list = typeof LESSONS !== "undefined" ? LESSONS : [];
  if (!list.length) return null;
  const key = dateKey || todayKey();
  const a = Date.parse(FILM_EPOCH + "T00:00:00Z");
  const b = Date.parse(key + "T00:00:00Z");
  if (isNaN(a) || isNaN(b)) return list[0];
  const days = Math.max(0, Math.round((b - a) / 86400000));
  return list[days % list.length];
}

function lessonLoc(lesson) {
  if (!lesson) return null;
  if (lang === "pt" && lesson.pt)
    return {
      title: lesson.pt.title || lesson.title,
      teach: lesson.pt.teach || lesson.teach,
      keep: lesson.pt.keep || lesson.keep,
      close: lesson.pt.close || lesson.close,
    };
  return lesson;
}

function lessonWitness(lesson) {
  if (!lesson || !lesson.witness) return null;
  const list = typeof QUOTES !== "undefined" ? QUOTES : [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === lesson.witness) return list[i];
  }
  return null;
}

function quoteLoc(q) {
  if (!q) return null;
  return lang === "pt" && q.pt ? q.pt : q;
}

function curriculumShareText(period, dateKey) {
  const loc = lessonLoc(pickLesson(dateKey || todayKey()));
  const wit = quoteLoc(lessonWitness(pickLesson(dateKey || todayKey())));
  if (!loc) return "";
  const lines = [];
  const name = lang === "pt" ? "Arca" : "Ark";
  const when = t(periodLabelKey(period));
  lines.push(name + " · " + when);
  if (period === "morning") {
    if (loc.title) lines.push(loc.title);
    if (loc.teach) lines.push(loc.teach);
    if (wit && wit.text) lines.push((wit.src ? wit.src + " — " : "") + wit.text);
  } else if (period === "midday") {
    if (loc.keep) lines.push(loc.keep);
  } else if (period === "night") {
    if (loc.close) lines.push(loc.close);
  }
  return lines.filter(Boolean).join("\n\n");
}
