(function () {
  function css() {
    const old = document.getElementById("drop-cap-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "drop-cap-css";
    s.textContent =
      ".nav-bar button{font-family:var(--font-book);font-variant:small-caps;letter-spacing:.06em;font-size:.7rem}" +
      ".nav-bar button::first-letter{" +
      "font-family:var(--font-display);font-variant:normal;font-size:1.35em;" +
      "color:var(--rubric);letter-spacing:0;margin:0 -.05em 0 0;padding:0;line-height:1}" +
      ".our-father-text p:first-child::first-letter," +
      ".lede p::first-letter,.reading-body::first-letter," +
      "#lessonTeach::first-letter,#middayBody::first-letter{" +
      "float:none;font-size:inherit;margin:0;padding:0;color:inherit;font-family:inherit;line-height:inherit}";
    document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", css);
  else css();
})();
