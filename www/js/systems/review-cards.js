/* Ôn Cố Lục: thẻ ghi nhớ và lịch ôn theo ngày. */
(function(root){
 "use strict";
 const intervals=[1,3,7,14,30],limit=300;
 const date=day=>typeof day==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day))&&new Date(day).toISOString().slice(0,10)===day;
 const content=(text,max)=>typeof text==="string"&&text.trim().length>0&&text===text.trim()&&text.length<=max;
 const list=S=>S.reviewCards||[];
 function shiftDay(day,days){
  const next=new Date(day);
  next.setUTCDate(next.getUTCDate()+days);
  const key=next.toISOString().slice(0,10);
  return date(key)?key:null;
 }
 function valid(cards){
  if(!Array.isArray(cards)||cards.length>limit)return false;
  const ids=new Set();
  return cards.every(c=>{
   if(!c||typeof c.id!=="string"||!/^review-[a-z0-9-]{1,56}$/.test(c.id)||ids.has(c.id)||!(c.subjectId===null||root.GameSubjects.key(c.subjectId))||!content(c.question,300)||!content(c.answer,1000)||!Number.isInteger(c.stage)||c.stage<0||c.stage>5||!date(c.due))return false;
   ids.add(c.id);return true;
  });
 }
 function due(S,day){return list(S).filter(c=>c.due<=day).sort((a,b)=>a.due.localeCompare(b.due))}
 function upsert(S,id,values,day,now=Date.now()){
  if(!date(day)||!values||typeof values.question!=="string"||typeof values.answer!=="string")return null;
  const question=values.question.trim(),answer=values.answer.trim(),subjectId=values.subjectId||null;
  if(!content(question,300)||!content(answer,1000)||(subjectId!==null&&!root.GameSubjects.find(S,subjectId)))return null;
  const cards=list(S),old=cards.find(c=>c.id===id);
  if(id&&!old||!id&&cards.length>=limit)return null;
  if(old){
   const changed=question!==old.question||answer!==old.answer;
   return cards.map(c=>c.id===id?{...c,question,answer,subjectId,stage:changed?0:c.stage,due:changed?day:c.due}:c);
  }
  if(!Number.isSafeInteger(now)||now<0)return null;
  const base="review-"+now.toString(36);let next=base,suffix=0;
  while(cards.some(c=>c.id===next))next=base+"-"+(++suffix);
  return [...cards,{id:next,subjectId,question,answer,stage:0,due:day}];
 }
 function grade(S,id,remembered,day){
  const card=list(S).find(c=>c.id===id);
  if(!date(day)||!card||card.due>day||typeof remembered!=="boolean")return null;
  const stage=remembered?Math.min(5,card.stage+1):0;
  const nextDay=shiftDay(day,remembered?intervals[stage-1]:1);
  if(!nextDay)return null;
  return list(S).map(c=>c.id===id?{...c,stage,due:nextDay}:c);
 }
 function reviewTomorrow(S,missed,day){
  const tomorrow=date(day)&&shiftDay(day,1);
  if(!tomorrow||!missed.length)return null;
  const byId=new Map(missed.map(card=>[card.id,card]));
  let count=0;
  const cards=list(S).map(card=>{
   const tested=byId.get(card.id);
   if(!tested||card.due<=tomorrow||card.question!==tested.question||card.answer!==tested.answer)return card;
   count++;
   return {...card,due:tomorrow};
  });
  return count?{cards,count}:null;
 }
 function remove(S,id){return list(S).some(c=>c.id===id)?list(S).filter(c=>c.id!==id):null}
 const normalizeText=value=>String(value||"").normalize("NFC").trim().replace(/\s+/g," ").toLocaleLowerCase("vi");
 function importText(S,text,day,now=Date.now()){
  if(typeof text!=="string"||!date(day)||!Number.isSafeInteger(now)||now<0)return {cards:null,added:0,skipped:0,invalid:1,capacity:0};
  const original=list(S),seen=new Set(original.map(card=>(card.subjectId||"none")+"\u0000"+normalizeText(card.question)));
  let next=original.slice();
  let added=0,skipped=0,invalid=0,capacity=0;
  for(const raw of text.replace(/^\uFEFF/,"").split(/\r?\n/)){
   const line=raw.replace(/^[ \f\v]+|[ \f\v]+$/g,"");
   if(!line.trim()||line.trim().startsWith("```")||/^[\s|:+-]+$/.test(line))continue;
   let columns;
   if(line.includes("\t"))columns=line.split("\t");
   else if(line.includes("|")){
    const row=line.startsWith("|")?line.slice(1):line;
    columns=(row.endsWith("|")?row.slice(0,-1):row).split("|");
   }else{invalid++;continue}
   columns=columns.map(value=>value.trim());
   if(columns.length!==3){invalid++;continue}
   const header=columns.map(normalizeText);
   if((header[0]==="môn học"||header[0]==="subject")&&(header[1]==="câu hỏi"||header[1]==="question")&&(header[2]==="đáp án"||header[2]==="answer"))continue;
   const [subjectName,question,answer]=columns;
   if(!content(question,300)||!content(answer,1000)){invalid++;continue}
   const subjectId=subjectName?root.GameSubjects.resolve(S,subjectName):null;
   if(subjectName&&!subjectId){invalid++;continue}
   const key=(subjectId||"none")+"\u0000"+normalizeText(question);
   if(seen.has(key)){skipped++;continue}
   if(next.length>=limit){skipped++;capacity++;continue}
   const candidate=upsert({...S,reviewCards:next},null,{subjectId,question,answer},day,now+added);
   if(!candidate){invalid++;continue}
   next=candidate;
   seen.add(key);added++;
  }
  return {cards:added?next:null,added,skipped,invalid,capacity};
 }
 root.GameReviewCards=Object.freeze({valid,list,due,upsert,grade,reviewTomorrow,remove,importText,limit});
})(typeof window!=="undefined"?window:globalThis);
