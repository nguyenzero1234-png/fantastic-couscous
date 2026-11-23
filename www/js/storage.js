/* Compatibility entry point. The implementation lives in core/storage.js. */
(function(root){
  "use strict";
  if(!root.GameStorage)throw new Error("core/storage.js must be loaded before storage.js");
})(typeof window!=="undefined"?window:globalThis);
