/* Parser dữ liệu nhiệm vụ dạng văn bản. Các nguồn thời gian/ngẫu nhiên được tiêm vào để kiểm thử. */
(function(global){
 "use strict";
 function parseDiff(s){
  s=(s||"1").trim().toLowerCase();
  if(s==="1.5"||s==="1.3"||s==="kho"||s==="khó"||s==="hard")return 1.3;
  if(s==="1.25"||s==="1.15"||s==="vua"||s==="vừa"||s==="medium")return 1.15;
  return 1;
 }
 function deadlineMultiplier(kind){return {"1":1.25,"3":1.15,"0":1.1}[kind]||1}
 function basePoints(minutes,rate,difficulty=1,deadlineKind=""){
  return Math.max(1,Math.round(minutes*rate*Math.round(difficulty*100)*Math.round(deadlineMultiplier(deadlineKind)*100)/600000));
 }
 function lateBasePoints(q){
  if(!Number.isFinite(q.pts)||q.pts<=0)return 0;
  if(Number.isFinite(q.basePts)&&q.basePts>=1&&q.basePts<=q.pts)return q.basePts;
  // Legacy tasks with a known multiplier keep their original configured rate.
  return Math.max(1,Math.round(q.pts/deadlineMultiplier(q.deadlineKind)));
 }
 function isDone(quest,today){return !!quest.doneOn&&(!quest.repeat||quest.doneOn===today)}
 function isExpired(quest,isDoneFn,now){
  return !!quest.due&&!isDoneFn(quest)&&now>quest.due;
 }
 function isUnlocked(quests,quest,isDoneFn){
  const chain=quests.filter(x=>x.chain===quest.chain);
  return chain.slice(0,chain.indexOf(quest)).every(isDoneFn);
 }
 function parseBulkLine(line,options){
  const o=options||{},clock=typeof o.now==="function"?o.now:()=>o.now==null?Date.now():o.now,random=o.random||Math.random;
  const parts=String(line||"").split("|").map(x=>x.trim());
  if(!parts[0])return null;
  const subjectId=parts[5]&&o.resolveSubject?o.resolveSubject(parts[5]):null;
  if(parts[5]&&!subjectId)return null;
  const name=parts[0].slice(0,80),mins=Math.min(480,Math.max(5,parseInt(parts[1])||30)),diff=parseDiff(parts[2]);
  const rep=parts[3]==="1"||/^l[aă]p/i.test(parts[3]||"");
  let due=0;const h=(parts[4]||"").toLowerCase();
  if(h==="1"||h==="1h")due=clock()+3600000;
  else if(h==="3"||h==="3h")due=clock()+3*3600000;
  else if(h==="0"||h==="homnay"||h==="hôm nay"||h==="today"){const d=new Date(clock());due=d.setHours(23,59,59,999)}
  const deadlineKind=due?(h==="1"||h==="1h"?"1":h==="3"||h==="3h"?"3":"0"):"";
  const pts=basePoints(mins,o.perHour||280,diff,deadlineKind);
  return {id:"b"+clock().toString(36)+random().toString(36).slice(2,6),name,pts,basePts:basePoints(mins,o.perHour||280,diff),mins,due,repeat:rep&&!due,doneOn:null,diff,deadlineKind,...(subjectId?{subjectId}:{})};
 }

 function importBulk(text,options){
  const lines=String(text||"").split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith("#")&&!s.startsWith("//"));
  const quests=[],rejected=[];let invalid=0;
  lines.forEach(line=>{const q=parseBulkLine(line,options);if(q)quests.push(q);else{invalid++;rejected.push(line)}});
  return {quests,invalid,total:lines.length,...(rejected.length?{rejected}:{})};
 }
 function exportOpen(quests,options){
  const o=options||{},now=o.now==null?Date.now():o.now,isDoneFn=o.isDone||(()=>false),isExpiredFn=o.isExpired||(()=>false);
  const open=(quests||[]).filter(q=>!q.chain&&!isDoneFn(q)&&!isExpiredFn(q));
  const text=open.map(q=>{
   const diff=q.diff||1,lim=q.due?(q.deadlineKind??(q.due-now<2*3600000?"1":q.due-now<4*3600000?"3":"homnay")):"";
   const fields=[q.name,q.mins||30,diff,q.repeat?1:0,lim];
   if(q.subjectId)fields.push(q.subjectId);
   return fields.join(" | ");
  }).join("\n");
  return {quests:open,text};
 }
 function addChain(state,name,lines,id){
  const steps=[];
  for(const line of lines){
   const [label,duration,subject]=line.split("|");
   if(!label.trim())continue;
   const mins=Math.min(480,Math.max(5,parseInt(duration,10)||30));
   const subjectId=subject?.trim()?global.GameSubjects.resolve(state,subject,true):null;
   if(subject?.trim()&&!subjectId)return 0;
   steps.push({name:label.trim().slice(0,80),pts:Math.max(1,Math.round(mins/60*state.perHour)),mins,...(subjectId?{subjectId}:{})});
  }
  if(!name||steps.length<2)return 0;
  while(state.chains.some(chain=>chain.id===id))id+="_";
  state.chains.push({id,name,paid:false,bonus:0});
  steps.forEach((step,i)=>state.quests.push({...step,id:id+i,chain:id,doneOn:null}));
  return steps.length;
 }
 function addPresetChains(state,presets){
  let added=0;
  presets.forEach(([name,lines],i)=>{
   if(state.chains.some(chain=>chain.name===name))return;
   if(addChain(state,name,lines,"c"+Date.now().toString(36)+"d"+i))added++;
  });
  return added;
 }
 global.GameQuestData=Object.freeze({parseDiff,parseBulkLine,isDone,isExpired,isUnlocked,importBulk,exportOpen,addChain,addPresetChains,basePoints,deadlineMultiplier,lateBasePoints});

})(window);
