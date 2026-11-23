(function(root) {
  "use strict";

  const escapeHtml = value => value.replace(/[&<>"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);

  root.GameText = Object.freeze({ escapeHtml });
})(typeof window !== "undefined" ? window : globalThis);
