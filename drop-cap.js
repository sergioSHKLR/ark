(function () {
  function css() {
    const old = document.getElementById("drop-cap-css");
    if (old) old.remove();
    const s = document.createElement("style");
    s.id = "drop-cap-css";
    s.textContent =
      ".nav-bar button{font-family:var(--font-book);font-variant:small-caps;letter-spacing:.08em}" +
      ".nav-bar button::first-letter{font-family:var(--font-display);font-variant:normal;font-size:1.15em;color:var(--rubric);letter-spacing:0;margin:0;padding:0}" +
      ".our-father-text p:first-child{text-indent:0}" +
      ".our-father-text p:first-child::first-letter{" +
      "font-family:var(--font-display);float:left;font-size:2.55em;line-height:.82;" +
      "margin:0 .02em 0 -.04em;padding:0;color:var(--rubric);font-weight:400}" +
      ".lede p::first-letter,.reading-body::first-letter," +
      ".lesson-keep .reading-body::first-letter,#lessonTeach::first-letter," +
      "#middayBody::first-letter{font-size:inherit;float:none;margin:0;padding:0;color:inherit;font-family:inherit;line-height:inherit}";
    document.head.appendChild(s);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", css);
  else css();
})();
