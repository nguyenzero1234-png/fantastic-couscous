(function (root) {
  "use strict";

  const pad = n => String(n).padStart(2, "0");
  const formatDuration = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const x = seconds % 60;
    return (h ? h + ":" : "") + pad(m) + ":" + pad(x);
  };
  const toMinutes = value => +value.slice(0, 2) * 60 + +value.slice(3);
  const toClock = minutes => pad(Math.floor(minutes / 60)) + ":" + pad(minutes % 60);
  const currentClock = () => {
    const date = new Date();
    return pad(date.getHours()) + ":" + pad(date.getMinutes());
  };

  root.GameTimeFormat = Object.freeze({ pad, formatDuration, toMinutes, toClock, currentClock });
})(typeof window !== "undefined" ? window : globalThis);
