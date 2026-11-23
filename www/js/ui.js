/* Compatibility entry point; implementation lives in ui/preferences.js. */
(function(root){ "use strict"; if(!root.GameUI) throw new Error("ui/preferences.js must load before ui.js"); })(typeof window!=="undefined"?window:globalThis);
