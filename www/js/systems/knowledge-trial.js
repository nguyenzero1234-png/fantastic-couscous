/* Vấn Đạo Thí Luyện: phiên tự kiểm tra từ Ôn Cố Lục. */
(function(root){
 "use strict";
 function pool(S,subject){
  return root.GameReviewCards.list(S).filter(c=>subject==="*"||(subject==="none"?!root.GameSubjects.find(S,c.subjectId):c.subjectId===subject));
 }
 function round(cards){
  return {cards:cards.map(c=>({id:c.id,subjectId:c.subjectId,question:c.question,answer:c.answer})),results:[],revealed:false};
 }
 function start(S,subject,count,random=Math.random){
  if(![5,10,20].includes(count))return null;
  const cards=pool(S,subject);
  if(!cards.length)return null;
  // Fisher–Yates: mỗi thẻ chỉ xuất hiện một lần trong phiên.
  for(let i=cards.length-1;i>0;i--){
   const j=Math.floor(random()*(i+1));
   [cards[i],cards[j]]=[cards[j],cards[i]];
  }
  return round(cards.slice(0,count));
 }
 const current=session=>session?.cards[session.results.length]||null;
 function reveal(session,id){
  const card=current(session);
  if(!card||card.id!==id||session.revealed)return null;
  return {...session,revealed:true};
 }
 function grade(session,id,remembered){
  const card=current(session);
  if(!card||card.id!==id||!session.revealed||typeof remembered!=="boolean")return null;
  return {...session,results:[...session.results,remembered],revealed:false};
 }
 function summary(session){
  if(!session||current(session))return null;
  const total=session.cards.length,correct=session.results.filter(Boolean).length;
  return {total,correct,percent:Math.round(correct*100/total),missed:session.cards.filter((_,i)=>!session.results[i])};
 }
 function retry(session){
  const result=summary(session);
  return result?.missed.length?round(result.missed):null;
 }
 root.GameKnowledgeTrial=Object.freeze({pool,start,current,reveal,grade,summary,retry});
})(typeof window!=="undefined"?window:globalThis);
