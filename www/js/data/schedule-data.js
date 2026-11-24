/* Parser và xác thực khung lịch học dạng văn bản. */
(function(global){
 "use strict";
 const minute=s=>+s.slice(0,2)*60+ +s.slice(3);
 function parseLine(line,existing){
  const m=String(line||"").match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*\|\s*(.+)$/);
  if(!m)return null;
  const a=+m[1]*60+ +m[2],b=+m[3]*60+ +m[4];
  if(a>=b||b>1440||(existing||[]).some(x=>a<minute(x.e)&&b>minute(x.s)))return null;
  return {start:a,end:b,label:m[5].trim().slice(0,50)};
 }
 global.GameScheduleData=Object.freeze({parseLine});
})(window);
