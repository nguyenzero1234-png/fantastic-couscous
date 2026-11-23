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
  const remaining = (timestamp, now) => {
    const minutes = Math.max(0, Math.ceil((timestamp - now) / 60000));
    return minutes >= 60 ? Math.floor(minutes / 60) + " giờ " + minutes % 60 + " phút" : minutes + " phút";
  };
  const eventTimestamp = timestamp => new Date(timestamp).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const currentClock = () => {
    const date = new Date();
    return pad(date.getHours()) + ":" + pad(date.getMinutes());
  };

  root.GameTimeFormat = Object.freeze({ pad, formatDuration, toMinutes, toClock, currentClock, remaining, eventTimestamp });
})(typeof window !== "undefined" ? window : globalThis);
