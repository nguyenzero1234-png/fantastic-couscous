/* Vạn Pháp: môn học, mục tiêu và sử theo biên nhận hoàn thành. */
(function(root){
 "use strict";
 const defaults=[["math","Toán học"],["code","Lập trình"],["english","Tiếng Anh"],["language","Ngoại ngữ"],["research","NCKH"]];
 const key=id=>typeof id==="string"&&/^[a-z][a-z0-9-]{0,63}$/.test(id)&&!["constructor","prototype","none"].includes(id);
 const label=name=>typeof name==="string"&&name.trim().length>0&&name.length<=60&&!/[|\x00-\x1f\x7f]/.test(name);
 const goal=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
 const record=v=>v&&typeof v==="object"&&!Array.isArray(v);
 const normalize=name=>name.trim().normalize("NFC").toLocaleLowerCase("vi");
 function init(S){
  if(!S.subjects)S.subjects={list:defaults.map(([id,name])=>({id,name,daily:0,weekly:0,archived:false})),days:{},since:new Date(Date.now()+(S.dOff||0)*864e5).toLocaleDateString("sv")};
  return S.subjects;
 }
 function valid(data){
  if(!record(data)||!Array.isArray(data.list)||!record(data.days)||typeof data.since!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(data.since))return false;
  const ids=new Set(),names=new Set();
  for(const s of data.list){
   if(!record(s)||!key(s.id)||!label(s.name)||!goal(s.daily,1440)||!goal(s.weekly,10080)||typeof s.archived!=="boolean"||ids.has(s.id)||names.has(normalize(s.name)))return false;
   if(data.list.some(other=>other!==s&&other?.id===s.name))return false;
   ids.add(s.id);names.add(normalize(s.name));
  }
  return Object.entries(data.days).every(([day,values])=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&record(values)&&Object.entries(values).every(([id,n])=>(id==="none"||ids.has(id))&&typeof n==="number"&&Number.isFinite(n)&&n>=0));
 }
 function find(S,id){return S.subjects?.list.find(s=>s.id===id)}
 function resolve(S,name,includeArchived=false){
  if(!name||!name.trim())return null;
  const list=S.subjects?.list||[];
  return (list.find(s=>(includeArchived||!s.archived)&&s.id===name.trim())||list.find(s=>(includeArchived||!s.archived)&&normalize(s.name)===normalize(name)))?.id;
 }
 function update(S,id,values){
  const data=init(S),name=String(values.name||"").trim(),daily=values.daily,weekly=values.weekly;
  if(!label(name)||!goal(daily,1440)||!goal(weekly,10080))return false;
  if(data.list.some(s=>s.id!==id&&(normalize(s.name)===normalize(name)||s.id===name)))return false;
  if(id){const s=find(S,id);if(!s)return false;Object.assign(s,{name,daily,weekly});return true}
  let next="subject-"+Date.now().toString(36);
  while(find(S,next)||data.list.some(s=>s.name===next)||name===next)next+="-1";
  data.list.push({id:next,name,daily,weekly,archived:false});return true;
 }
 function recordCompletion(S,receipt,direction){
  if(!S.subjects||!Object.prototype.hasOwnProperty.call(receipt,"subjectId")||!/^\d{4}-\d{2}-\d{2}$/.test(receipt.day))return;
  const id=find(S,receipt.subjectId)?.id||"none";
  const day=S.subjects.days[receipt.day]||(S.subjects.days[receipt.day]={});
  day[id]=Math.max(0,(day[id]||0)+direction*receipt.mins);
  if(!day[id])delete day[id];
  if(!Object.keys(day).length)delete S.subjects.days[receipt.day];
 }
 function minutes(S,id,from="",to="9999-99-99"){
  return Object.entries(S.subjects?.days||{}).reduce((sum,[day,values])=>sum+(day>=from&&day<=to?(values[id||"none"]||0):0),0);
 }
 function archive(S){
  if(!S.subjects)return null;
  return {since:S.subjects.since,totals:[...S.subjects.list.map(s=>({id:s.id,name:s.name,minutes:minutes(S,s.id)})),{id:null,name:"Chưa phân môn",minutes:minutes(S,null)}].filter(s=>s.minutes>0)};
 }
 function reset(S){const data=init(S);data.days={};data.since=new Date(Date.now()+(S.dOff||0)*864e5).toLocaleDateString("sv")}
 root.GameSubjects=Object.freeze({init,valid,key,find,resolve,update,recordCompletion,minutes,archive,reset});
})(typeof window!=="undefined"?window:globalThis);
