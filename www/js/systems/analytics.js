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
 function studyWindowStats(history,startKey,endKey){
  const H=history||{};
  const days=Object.keys(H).filter(key=>key>=startKey&&key<=endKey);
  return {
   days,
   daysWithStudy:days.filter(key=>H[key].m>0).length,
   bestMinutes:Math.max(0,...days.map(key=>H[key].m||0))
  };
 }
 function sumCountsBetween(counts,startKey,endKey){
  let total=0;
  const C=counts||{};
  for(const key in C)if(key>=startKey&&key<=endKey)total+=C[key];
  return total;
 }
 function countStudyLogEntries(studyLog,startKey,endKey,hourPredicate){
  let total=0;
  (studyLog||[]).forEach(entry=>{
   const date=new Date(entry[0]),key=date.toLocaleDateString("sv");
   if(key>=startKey&&key<=endKey&&hourPredicate(date.getHours()))total++;
  });
  return total;
 }
 function sumStudyMinutesBetween(studyLog,startTimestamp,endTimestamp){
  let total=0;
  (studyLog||[]).forEach(entry=>{
   if(entry[0]>=startTimestamp&&entry[0]<=endTimestamp)total+=entry[1];
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
 const reportFields=["play","earned","leisureCost","onTime","late","otherEarned","otherCost","debugAdded","debugRemoved"];
 function newReport(state,now=Date.now()){
  return {since:now,sinceDay:new Date(now+(state.dOff||0)*864e5).toLocaleDateString("sv"),days:{}};
 }
 function reportDay(state,day){
  if(!state.studyReport)return null;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return null;
  return state.studyReport.days[day]||(state.studyReport.days[day]=Object.fromEntries(reportFields.map(key=>[key,0])));
 }
 function recordCompletion(state,receipt,direction){
  if(!receipt.tracked)return;
  const row=reportDay(state,receipt.day);
  if(!row)return;
  row.earned=Math.max(0,row.earned+direction*receipt.gain);
  if(receipt.deadlineResult!=="none"&&receipt.deadlineResult)row[receipt.deadlineResult]=Math.max(0,row[receipt.deadlineResult]+direction);
 }
 function recordPlay(state,start,seconds,clipToSince=true){
  if(!state.studyReport||!Number.isFinite(start)||!Number.isFinite(seconds)||seconds<=0)return;
  const end=start+seconds*1000;
  if(!Number.isFinite(end))return;
  let cursor=clipToSince?Math.max(start,state.studyReport.since):start;
  const offset=(state.dOff||0)*864e5;
  // An imported timer can span an unrealistic number of days. Bound the
  // processing window and retain the remaining duration on its last day.
  for(let i=0;cursor<end&&i<3660;i++){
   const date=new Date(cursor+offset),day=date.toLocaleDateString("sv");
   date.setHours(24,0,0,0);
   const next=Math.min(end,date.getTime()-offset);
   if(!Number.isFinite(next)||next<=cursor)break;
   const row=reportDay(state,day);if(!row)break;
   row.play+=(next-cursor)/1000;
   cursor=next;
  }
  if(cursor<end){const row=reportDay(state,new Date(end-1+offset).toLocaleDateString("sv"));if(row)row.play+=(end-cursor)/1000;}
 }
 function recordLeisureCost(state,day,cost){const row=reportDay(state,day);if(row)row.leisureCost+=cost;}
 function recordPoints(state,delta,debug=false,day=new Date(Date.now()+(state.dOff||0)*864e5).toLocaleDateString("sv")){
  if(!Number.isFinite(delta)||!delta)return;
  const row=reportDay(state,day);if(!row)return;
  const key=debug?(delta>0?"debugAdded":"debugRemoved"):(delta>0?"otherEarned":"otherCost");
  row[key]=(row[key]||0)+Math.abs(delta);
 }
 function reportPeriod(state,days){
  const totals={minutes:0,tasks:0,activeDays:0,historyPoints:0,...Object.fromEntries(reportFields.map(key=>[key,0]))};
  for(const day of days){
   const h=state.hist?.[day];
   totals.minutes+=h?.m||0;totals.historyPoints+=h?.p||0;totals.tasks+=state.cnt?.[day]||0;
   if(h?.m>0)totals.activeDays++;
   const tracked=state.studyReport?.days[day];
   if(tracked)for(const key of reportFields)totals[key]+=tracked[key]||0;
  }
  return totals;
 }
 function archiveReport(state){
  if(!state.studyReport)return null;
  const days=new Set([...Object.keys(state.hist||{}),...Object.keys(state.cnt||{}),...Object.keys(state.studyReport.days)]);
  return {since:state.studyReport.since,sinceDay:state.studyReport.sinceDay,totals:reportPeriod(state,days)};
 }
 function studyTrend(state,currentDays,previousDays){
  const start=Number.isFinite(state.kst?.start)?new Date(state.kst.start+(state.dOff||0)*864e5).toLocaleDateString("sv"):null;
  const eligible=days=>days.filter(day=>!start||day>=start);
  const current=eligible(currentDays),previous=eligible(previousDays);
  return {current:reportPeriod(state,current),previous:reportPeriod(state,previous),days:current.length,previousDays:previous.length,comparable:!!start&&current.length===currentDays.length&&previous.length===previousDays.length&&previous[0]>start};
 }
 function subjectProgress(state,days,today,weekStart){
  const data=state.subjects;
  if(!data)return null;
  const selected=new Set(days),totals=new Map(),daily=new Map(),weekly=new Map();
  for(const [day,values] of Object.entries(data.days))for(const [id,minutes] of Object.entries(values)){
   if(selected.has(day))totals.set(id,(totals.get(id)||0)+minutes);
   if(day===today)daily.set(id,minutes);
   if(day>=weekStart&&day<=today)weekly.set(id,(weekly.get(id)||0)+minutes);
  }
  const rows=data.list.map(s=>({...s,minutes:totals.get(s.id)||0,today:daily.get(s.id)||0,week:weekly.get(s.id)||0}));
  const assigned=rows.reduce((sum,s)=>sum+s.minutes,0),unassigned=totals.get("none")||0;
  const recorded=reportPeriod(state,days).minutes;
  return {rows,assigned,unassigned,untracked:Math.max(0,recorded-assigned-unassigned),since:data.since,partial:days.some(day=>day<=data.since)};
 }
 function lifePace(minutes,tasks,days){
  const validDays=Number.isFinite(days)&&days>0;
  return {minutesPerDay:validDays&&Number.isFinite(minutes)?minutes/days:null,tasksPerDay:validDays&&Number.isFinite(tasks)?tasks/days:null};
 }
 global.GameAnalytics=Object.freeze({summarize,kiepMetrics,questProgress,sumMinutes,sumPointsBetween,pointsThrough,countStudyLogEntries,sumCountsBetween,studyWindowStats,sumStudyMinutesBetween,newReport,recordCompletion,recordPlay,recordLeisureCost,recordPoints,reportPeriod,archiveReport,studyTrend,subjectProgress,lifePace});
})(window);
