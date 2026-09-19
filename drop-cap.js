(function () {
  function css() {
    if (document.getElementById("drop-cap-css")) return;
    const s = document.createElement("style");
    s.id = "drop-cap-css";
    s.textContent =
      ".nav-bar button{font-family:var(--font-book);font-variant:small-caps;letter-spacing:.08em}" +
      ".nav-bar button::first-letter{font-family:var(--font-display);font-variant:normal;font-size:1.15em;color:var(--rubric);letter-spacing:0}" +
      ".our-father-text p:first-child::first-letter," +
      ".reading-body::first-letter," +
      ".lede p:first-of-type::first-letter," +
      ".lesson-keep .reading-body::first-letter," +
      "#lessonTeach::first-letter," +
      "#middayBody::first-letter{" +
      "font-family:var(--font-display);float:left;font-size:3.1em;line-height:.75;padding:.08em .12em 0 0;color:var(--rubric);font-weight:400}" +
      "@media (max-width:22rem){" +
      ".our-father-text p:first-child::first-letter,.reading-body::first-letter,#lessonTeach::first-letter{font-size:2.4em}" +
      "}";
    document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", css);
  else css();
})();
