/* Profile UI: render hồ sơ người chơi/NPC và lịch sử tu vi. */
(function(root){
 "use strict";
 function create(deps){
  const {S,B,SO,SECTS,TITLES,BH,SP,CDN,HTC,NVC_TITLES,RL,STG,$,uxp,bxp,ri,tok,bio,myRk,rkNow,portrait,isTK,esc,htCount,htLate,hrs,miles,fmtT,rname}=deps;
  function renderProf(){
   const PI=deps.getProfileIndex();

  }
  return Object.freeze({render:renderProf});
 }
 root.GameProfileUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
