/* Persistent play and study sessions. All timer state lives in the game save. */
(function (global) {
  "use strict";
  function create(state, clock = Date.now) {
    const sessions = () => state.timers;
    const sessionId = now => now.toString(36)+"-"+Math.random().toString(36).slice(2);
    function isPlaying() { return !!sessions().play; }
    function tickPlay() {
      const play = sessions().play;
      if (!play) return { elapsed: 0, remaining: state.gameSec, ended: false, changed: false };
      const now = clock();
      const rollback = now < play.lastTickAt;
      if (rollback) play.lastTickAt = now;
      const elapsed = Math.min(state.gameSec, Math.floor((now - play.lastTickAt) / 1000));
      state.gameSec = Math.max(0, state.gameSec - elapsed);
      play.lastTickAt += elapsed * 1000;
      const ended = state.gameSec === 0;
      if (ended) sessions().play = null;
      return { elapsed, remaining: state.gameSec, ended, changed: rollback || elapsed > 0 || ended };
    }
    function togglePlay() {
      if (isPlaying()) {
        tickPlay();
        sessions().play = null;
        return false;
      }
      if (state.gameSec <= 0) return false;
      const now = clock();
      sessions().play = { id: sessionId(now), startedAt: now, lastTickAt: now };
      return true;
    }
    function focusSession() { return sessions().focus; }
    function activeFocus() {
      const focus = focusSession();
      return focus ? state.quests.find(q => q.id === focus.questId) || null : null;
    }
    function startFocus(task, durationMs) {
      if (focusSession() || !state.quests.includes(task) || !Number.isFinite(durationMs) || durationMs <= 0) return false;
      const now = clock();
      sessions().focus = { id: sessionId(now), questId: task.id, startedAt: now, lastSeenAt: now, endAt: now + durationMs };
      return true;
    }
    function tickFocus() {
      const focus = focusSession();
      if (!focus) return false;
      const now = clock(), previous = focus.lastSeenAt;
      if (now < previous) focus.endAt -= previous - now;
      focus.lastSeenAt = Math.min(now, focus.endAt);
      return previous !== focus.lastSeenAt || now < previous;
    }
    function focusRemaining() {
      const focus = focusSession();
      return focus ? Math.max(0, Math.ceil((focus.endAt - Math.max(focus.lastSeenAt, clock())) / 1000)) : 0;
    }
    function cancelFocus() { sessions().focus = null; }
    function playEndAt() {
      const play = sessions().play;
      return play ? play.lastTickAt + state.gameSec * 1000 : null;
    }
    function notificationKey() {
      const focus = focusSession();
      return JSON.stringify([focus?.id, focus?.endAt, sessions().play?.id, playEndAt()]);
    }
    return Object.freeze({ togglePlay, isPlaying, tickPlay, startFocus, activeFocus, focusSession, tickFocus, focusRemaining, cancelFocus, playEndAt, notificationKey });
  }
  global.GameTimer = Object.freeze({ create });
})(window);
