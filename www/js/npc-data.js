(function (root) {
  "use strict";

  const isUniqueTalent = (index, npcs) =>
    index === 9 || !!(npcs[index] && npcs[index].tk);

  const isImmuneTaiHu = (index, npcs) => index >= 0 && !!npcs[index] && npcs[index].n === "Cố Thái Hư";

  root.GameNpcData = Object.freeze({ isUniqueTalent, isImmuneTaiHu });
})(typeof window !== "undefined" ? window : globalThis);
