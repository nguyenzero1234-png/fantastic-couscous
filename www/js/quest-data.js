/* Parser dữ liệu nhiệm vụ dạng văn bản. Các nguồn thời gian/ngẫu nhiên được tiêm vào để kiểm thử. */
(function(global){
 "use strict";
 function parseDiff(s){
  s=(s||"1").trim().toLowerCase();
  if(s==="1.5"||s==="kho"||s==="khó"||s==="hard")return 1.5;
  if(s==="1.25"||s==="vua"||s==="vừa"||s==="medium")return 1.25;
  return 1;
 }
 function parseBulkLine(line,options){
  const o=options||{},now=o.now==null?Date.now():o.now,random=o.random||Math.random;
  const parts=String(line||"").split("|").map(x=>x.trim());
  if(!parts[0])return null;
  const name=parts[0].slice(0,80),mins=Math.min(480,Math.max(5,parseInt(parts[1])||30)),diff=parseDiff(parts[2]);
  const rep=parts[3]==="1"||/^l[aă]p/i.test(parts[3]||"");
  let due=0;const h=(parts[4]||"").toLowerCase();
  if(h==="1"||h==="1h")due=now+3600000;
  else if(h==="3"||h==="3h")due=now+3*3600000;
  else if(h==="0"||h==="homnay"||h==="hôm nay"||h==="today"){const d=new Date(now);due=d.setHours(23,59,59,999)}
  const pts=Math.max(1,Math.round(mins/60*(o.perHour||200)*diff));
  return {id:"b"+now.toString(36)+random().toString(36).slice(2,6),name,pts,mins,due,repeat:rep&&!due,doneOn:null,diff};
 }
 global.GameQuestData=Object.freeze({parseDiff,parseBulkLine});
})(window);
