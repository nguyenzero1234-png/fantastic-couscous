/* Compatibility entry point; implementation lives in core/game-loop.js. */
(function(root){ "use strict"; if(!root.GameTimer) throw new Error("core/game-loop.js must load before timer.js"); })(typeof window!=="undefined"?window:globalThis);
