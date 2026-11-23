(function(root) {
  "use strict";

  // Deterministic integer hash mapped to [-1, 1], shared by NPC simulation.
  const hash = (a, b, c) => {
    let h = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295 * 2 - 1;
  };

  // Smooth value noise: interpolate neighboring integer samples with smoothstep.
  const value = (seed, channel, x) => {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(seed, channel, i) * (1 - u) + hash(seed, channel, i + 1) * u;
  };

  root.GameNoise = Object.freeze({ hash, value });
})(typeof window !== "undefined" ? window : globalThis);
