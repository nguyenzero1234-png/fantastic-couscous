(function(global){
  "use strict";
  // A recommendation is a read-only snapshot of the current study window.
  function recommend({quests,slots,today,now,active}){
    if(active)return {status:"active"};
    const clock=new Date(now);
    const minute=clock.getHours()*60+clock.getMinutes()+clock.getSeconds()/60+clock.getMilliseconds()/60000;
    const done=q=>global.GameQuestData.isDone(q,today);
    const open=q=>!done(q)&&!global.GameQuestData.isExpired(q,done,now)&&
      (!q.chain||global.GameQuestData.isUnlocked(quests,q,done));
    const available=q=>open(q)&&
      !(q.completion?.undone&&(!q.repeat||q.completion.day===today))&&Number.isFinite(q.mins)&&q.mins>0;
    const eligible=quests.filter(available);
    const toMinute=s=>{const [h,m]=String(s).split(":").map(Number);return h*60+m};
    const schedule=slots.map(slot=>({start:toMinute(slot.s),end:toMinute(slot.e),
      quest:quests.find(q=>q.id===slot.qid)||(slot.rep?quests.find(q=>q.name===slot.label&&open(q)):null)}))
      .filter(s=>Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.start>=0&&s.end<=1440&&s.start<s.end);
    const current=schedule.filter(s=>s.start<=minute&&minute<s.end);
    const future=schedule.filter(s=>s.start>minute);
    const next=Math.min(1440,...future.map(s=>s.start));
    const end=Math.min(next,...current.map(s=>s.end));
    const endAt=new Date(now).setHours(0,end,0,0);
    const fits=q=>now+q.mins*60000<=endAt&&(!q.due||now+q.mins*60000<=q.due);
    if(current.length){
      const q=current[0].quest;
      if(!q||!current.every(s=>s.quest===q)||!available(q))return {status:"busy"};
      return fits(q)?{status:"ready",quest:q,reason:"Đúng giờ Nhật trình"}:{status:"short"};
    }
    const candidates=eligible.filter(q=>!future.some(s=>s.quest===q)&&fits(q));
    candidates.sort((a,b)=>(a.due||Infinity)-(b.due||Infinity)||a.mins-b.mins);
    if(candidates.length){
      const quest=candidates[0];
      return {status:"ready",quest,reason:quest.due?"Ưu tiên hạn gần nhất":"Vừa khung giờ trống"};
    }
    return {status:eligible.length?"short":"empty"};
  }
  global.GameStudyPlanner=Object.freeze({recommend});
})(window);
