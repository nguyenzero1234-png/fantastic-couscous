(function (root) {
  "use strict";

  function rank(pet, level) {
    const ranks = pet.ranks;
    return ranks ? ranks[Math.min(ranks.length, Math.max(1, level | 0)) - 1] : pet.n;
  }

  function buff(pets, active) {
    const pet = pets && active && pets[active];
    if (!pet) return {};
    const level = pet.lv;
    const out = {};
    const key = active;
    if (key === "hq") out.fq = level;
    if (key === "kl") out.fl = 2 + 2 * level;
    if (key === "ct") out.kp = 2 + 2 * level;
    if (key === "hg") out.dc = 2 + 2 * level;
    if (key === "bh") { out.fr = 2 * level; out.ft = 2 * level; }
    if (key === "tt") out.dr = .02 * level;
    if (key === "tn") out.f1 = 4 + 2 * level;
    if (key === "pg") out.fs = level;
    if (key === "ko") out.fm = 2 * level;
    if (key === "dm") out.fn = 2 * level;
    if (key === "ty") out.rf = 2 * level;
    if (key === "mm") out.mn = level;
    return out;
  }

  root.GamePetData = Object.freeze({ rank, buff });
})(typeof window !== "undefined" ? window : globalThis);
