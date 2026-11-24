/* Công pháp học tập: điều kiện theo hành vi ghi nhận được, một lần thưởng/ngày. */
(function(root){
 "use strict";
 const catalog=Object.freeze([
  {id:"focus",name:"Tĩnh Tâm Quyết",description:"Học tập trung ít nhất 25 phút bằng bộ đếm Học."},
  {id:"variety",name:"Vạn Pháp Kinh",description:"Học hai môn khác nhau, mỗi môn ít nhất 20 phút."},
  {id:"review",name:"Ôn Cố Quyết",description:"Ôn tập qua nhiệm vụ lặp từ 20 phút."},
  {id:"steady",name:"Trường Sinh Công",description:"Duy trì chuỗi từ 3 ngày, hoàn thành một nhiệm vụ từ 20 phút."},
  {id:"solve",name:"Thiên Diễn Quyết",description:"Chia bài tập hoặc nghiên cứu thành liên hoàn, hoàn thành một bước từ 30 phút."},
  {id:"hard",name:"Khổ Tu Kinh",description:"Hoàn thành nhiệm vụ độ khó Khó từ 30 phút."}
 ].map(Object.freeze));
 const bonus=12,find=id=>catalog.find(t=>t.id===id);
 const validDay=day=>/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day))&&new Date(day).toISOString().slice(0,10)===day;
 function init(S){return S.technique||(S.technique={active:"",days:{}})}
 function valid(data){
  return !!data&&typeof data==="object"&&!Array.isArray(data)&&(data.active===""||!!find(data.active))&&
   !!data.days&&typeof data.days==="object"&&!Array.isArray(data.days)&&Object.entries(data.days).every(([day,id])=>validDay(day)&&!!find(id));
 }
 function select(S,id){if(id!==""&&!find(id))return false;init(S).active=id;return true}
 function quote(S,q,day,hour,completedAt){
  const data=S.technique,id=data?.active,mins=q.mins||0;
  if(!find(id)||data.days[day]||hour<5||hour>=22||q.due&&(completedAt??Date.now())>q.due)return null;
  // Delayed timer reconciliation must not turn an overnight session into a daytime bonus.
  if(Number.isFinite(completedAt)){
   const endHour=S.hh??new Date(completedAt).getHours();
   if(root.GameDateData.today(S.dOff||0,completedAt)!==day||endHour<5||endHour>=22)return null;
  }
  let eligible=false;
  switch(id){
   case "focus":eligible=mins>=25&&Number.isFinite(completedAt);break;
   case "variety":{
    const subject=root.GameSubjects.find(S,q.subjectId)?.id,days=S.subjects?.days[day]||{};
    eligible=!!subject&&(days[subject]||0)+mins>=20&&Object.entries(days).some(([key,m])=>key!=="none"&&key!==subject&&m>=20);break;
   }
   case "review":eligible=!!q.repeat&&mins>=20;break;
   case "steady":eligible=(S.streak?.n||0)>=3&&mins>=20;break;
   case "solve":eligible=!!q.chain&&mins>=30;break;
   case "hard":eligible=q.diff>=1.3&&mins>=30;break;
  }
  return eligible?{id,bonus}:null;
 }
 function claim(S,day,id){if(find(id)&&!init(S).days[day])S.technique.days[day]=id}
 function archive(S){
  const days=Object.values(S.technique?.days||{});
  return catalog.map(t=>({id:t.id,days:days.filter(id=>id===t.id).length})).filter(t=>t.days>0);
 }
 function reset(S){init(S).days={}}
 root.GameTechniques=Object.freeze({catalog,bonus,find,init,valid,select,quote,claim,archive,reset});
})(typeof window!=="undefined"?window:globalThis);
