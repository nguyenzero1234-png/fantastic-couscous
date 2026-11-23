/* UI preferences module — classic-script compatible. */
(function (global) {
  "use strict";

  function apply(state) {
    const root = document.documentElement;
    const ui = state && state.ui ? state.ui : {};
    const skin = ui.skin || "classic";
    const density = ui.density || "normal";
    const fontSize = ui.fs || "md";
    const theme = ui.theme || "auto";

    root.removeAttribute("data-skin");
    if (skin !== "classic") root.setAttribute("data-skin", skin);

    if (density === "normal") root.removeAttribute("data-density");
    else root.setAttribute("data-density", density);

    if (fontSize === "md") root.removeAttribute("data-fs");
    else root.setAttribute("data-fs", fontSize);

    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }

  global.GameUI = Object.freeze({ apply });
})(window);
