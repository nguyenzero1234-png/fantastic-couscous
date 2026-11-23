/* Các phép tổng hợp thống kê và lịch sử học, không thao tác DOM/storage. */
(function(global){
 "use strict";
 function summarize(history,counts,options){
  const H=history||{},C=counts||{},o=options||{},today=o.today||"",d7=o.days7||[],d30=o.days30||[];
  const g=(d,f)=>(H[d]||{})[f]||0;
  const sm=(days,f)=>days.reduce((t,d)=>t+g(d,f),0);
  const sn=days=>days.reduce((t,d)=>t+(C[d]||0),0);
  const mo=Object.keys(H).filter(k=>k.slice(0,7)===today.slice(0,7));
  let mA=0,pA=0,bp=0,bd="";
  for(const k in H){mA+=H[k].m;pA+=H[k].p;if(H[k].p>bp){bp=H[k].p;bd=k}}
  let ls=0,run=0,pv=null;
  Object.keys(H).filter(k=>H[k].m>0).sort().forEach(k=>{run=pv&&Math.round((new Date(k)-new Date(pv))/864e5)===1?run+1:1;ls=Math.max(ls,run);pv=k});
  return {g,sm,sn,mo,mA,pA,bp,bd,ls,streak:o.streak||0};
 }
 function kiepMetrics(history,counts,studyLog,days){
  let m=0,n=0,d=0;const H=history||{},C=counts||{},L=studyLog||[],D=days||[];
  D.forEach(k=>{const h=H[k];if(h&&h.m>0){m+=h.m;d++}n+=C[k]||0});
  const l=L.filter(x=>D.includes(new Date(x[0]).toLocaleDateString("sv"))).reduce((a,x)=>Math.max(a,x[1]),0);
  return {m,n,d,l};
 }
 function countStudyLogEntries(studyLog,startKey,endKey,hourPredicate){
  let total=0;
  (studyLog||[]).forEach(entry=>{
   const date=new Date(entry[0]),key=date.toLocaleDateString("sv");
   if(key>=startKey&&key<=endKey&&hourPredicate(date.getHours()))total++;
  });
  return total;
 }
 function sumMinutes(history,predicate){
  let total=0;
  for(const key in history)if(predicate(key))total+=history[key].m;
  return total;
 }
 function sumPointsBetween(history,startKey,endKey){
  let total=0;
  for(const key in history)if(key>=startKey&&key<endKey)total+=history[key].p;
  return total;
 }
 function pointsThrough(history,dateKey){
  let total=0;
  for(const key in history)if(key<=dateKey)total+=history[key].p;
  return total;
 }
 function questProgress(history,counts,task,todayKey,weekStartKey){
  const H=history||{},C=counts||{},T=todayKey;
  const matches=task.per==="d"?k=>k===T:task.per==="w"?k=>k>=weekStartKey&&k<=T:k=>k.slice(0,7)===T.slice(0,7);
  let value=0;
  new Set([...Object.keys(H),...Object.keys(C)]).forEach(k=>{
   if(!matches(k))return;
   const h=H[k]||{p:0,m:0};
   if(task.met==="m")value+=h.m;
   else if(task.met==="p")value+=h.p;
   else if(task.met==="c")value+=C[k]||0;
   else if(h.m>=30)value++;
  });
  return value;
 }
 global.GameAnalytics=Object.freeze({summarize,kiepMetrics,questProgress,sumMinutes,sumPointsBetween,pointsThrough,countStudyLogEntries});
})(window);
