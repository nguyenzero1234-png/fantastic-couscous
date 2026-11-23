(function (root) {
  "use strict";

  const isUniqueTalent = (index, npcs) =>
    index === 9 || !!(npcs[index] && npcs[index].tk);

  root.GameNpcData = Object.freeze({ isUniqueTalent });
})(typeof window !== "undefined" ? window : globalThis);
