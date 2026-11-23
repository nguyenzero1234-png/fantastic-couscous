/* Timer module — isolates play-session and focus countdown state. */
(function (global) {
  "use strict";
  let playing = false, lastPlayTick = 0, focusTask = null, focusEndAt = 0;
  function togglePlay(secondsRemaining) {
    if (!playing && secondsRemaining <= 0) return false;
    playing = !playing; lastPlayTick = Date.now(); return playing;
  }
  function isPlaying() { return playing; }
  function tickPlay(secondsRemaining) {
    if (!playing) return { elapsed: 0, remaining: secondsRemaining, ended: false };
    const now = Date.now(), elapsed = Math.floor((now - lastPlayTick) / 1000);
    if (elapsed < 1) return { elapsed: 0, remaining: secondsRemaining, ended: false };
    lastPlayTick += elapsed * 1000;
    const remaining = Math.max(0, secondsRemaining - elapsed), ended = remaining === 0;
    if (ended) playing = false;
    return { elapsed, remaining, ended };
  }
  function startFocus(task, durationMs) {
    if (focusTask) return false;
    focusTask = task; focusEndAt = Date.now() + durationMs; return true;
  }
  function activeFocus() { return focusTask; }
  function focusRemaining() { return focusTask ? Math.ceil((focusEndAt - Date.now()) / 1000) : 0; }
  function cancelFocus() { focusTask = null; focusEndAt = 0; }
  global.GameTimer = Object.freeze({ togglePlay, isPlaying, tickPlay, startFocus, activeFocus, focusRemaining, cancelFocus });
})(window);
