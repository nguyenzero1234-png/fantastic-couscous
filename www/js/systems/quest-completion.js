(function(root){
  // A completion receipt keeps its original reward and additive counters on redo.
  // Consumed effects, streak milestones and awarded items are one-time outcomes.
  function applyReceipt(q, receipt, d, direction){
    const {S,hAdd,LS}=d;
    const {day,gain,mins,stats,at}=receipt;
    S.points+=direction*gain;
    hAdd(day,direction*gain,direction*mins);
    root.GameAnalytics?.recordCompletion(S,receipt,direction);
    root.GameSubjects?.recordCompletion(S,receipt,direction);
    S.cnt=S.cnt||{};
    S.cnt[day]=Math.max(0,(S.cnt[day]||0)+direction);
    const ls=LS();
    for(const key of ["q","m","ni","da","ru","lg"]){
      if(stats[key])ls[key]=Math.max(0,(ls[key]||0)+direction*stats[key]);
    }
    S.life=S.life||{};
    S.life.q=Math.max(0,(S.life.q||0)+direction*(stats.q||0));
    const log=S.stl||(S.stl=[]);
    if(at){
      if(direction>0){
        log.push([at,mins]);
        if(log.length>1&&log[log.length-2][0]>at)log.sort((a,b)=>a[0]-b[0]);
        if(log.length>300)log.shift();
      }
      else{const index=log.findIndex(row=>row[0]===at&&row[1]===mins);if(index>=0)log.splice(index,1)}
    }
    receipt.undone=direction<0;
    q.completion=receipt;
    q.doneOn=receipt.undone?null:day;
    q.got=receipt.undone?0:gain;
  }
  function undo(q,d){
    if(!d.isDone(q)||q.chain)return {ok:false,reason:"Nhiệm vụ không thể hoàn tác."};
    const receipt=q.completion||{day:q.doneOn,gain:q.got??q.pts??0,mins:q.mins||0,at:0,stats:{q:1,m:q.mins||0,ru:q.due?1:0,lg:(q.mins||0)>=120?1:0},undone:false};
    if(d.S.points<receipt.gain)return {ok:false,reason:"Không đủ linh lực để hoàn tác phần thưởng đã nhận."};
    const mission=d.S.menhRecovery;
    if(mission?.days?.includes(receipt.day)&&(d.S.hist?.[receipt.day]?.m||0)-receipt.mins<60)return {ok:false,reason:"Ngày tu luyện đã dùng để nhận Mệnh, không thể hoàn tác dưới 60 phút."};
    applyReceipt(q,receipt,d,-1);
    return {ok:true,gain:receipt.gain};
  }
  function finish(q, d) {
    const { S, today, dayStr, GameTimer, GameStreak, KS, extraGet, extraSet, vlog, TB, LS, petBuff, GameRewards, eqT, rewardFactors, hourNow, ITEMS, myRk, hAdd, rname, uxp, isDone } = d;
    let extra = extraGet();
      const t=today();
      if(isDone(q))return false;
      if(GameTimer.activeFocus()===q)GameTimer.cancelFocus();
      if(q.completion?.undone&&(!q.repeat||q.completion.day===t)){
        applyReceipt(q,q.completion,d,1);
        return true;
      }
      if(S.streak.last!==t){
        const decision=GameStreak.completeDay({last:S.streak.last,today:t,yesterday:dayStr(1),twoDaysAgo:dayStr(2),streak:S.streak.n,lifeCharm:S.inv.the,heartCharm:!!S.sh,random:Math.random});
        if(decision.consumeLifeCharm)S.inv.the--;
        if(decision.consumeHeartCharm)S.sh=0;
        if(decision.triggerDemon){S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;}
        if(decision.extra)extra=decision.extra;
        if(decision.log)vlog(decision.log);
        S.streak=decision.streak;
      }
      const completedAt=d.completedAt??Date.now();
      const deadlineResult=q.due?(completedAt<=q.due?"onTime":"late"):"none";
      const late=deadlineResult==="late";
      const base=late?root.GameQuestData.lateBasePoints(q):q.pts;
      const tf=TB(late?{...q,due:0}:q),ls=LS(),pb=petBuff(),mins=q.mins||0,h=hourNow();
      if(S.pw>0)S.pw=GameRewards.chargeUse(S.pw,mins).remaining;
      if(tf.nightMinutes>0){const key=GameRewards.nightKey(t,h);S.nightStudy=S.nightStudy||{};S.nightStudy[key]=(S.nightStudy[key]||0)+tf.nightMinutes}
      let m=GameRewards.streakMultiplier(S.streak.n,tf.cap);
      const curse=GameStreak.progressCurses({minutes:q.mins||0,tm:!!S.tm,tmTasks:S.tmTasks,tma:!!S.tma,tmaTasks:S.tmaTasks,calmTitle:eqT("n12")});
      S.tm=curse.tm;S.tmTasks=curse.tmTasks;S.tma=curse.tma;S.tmaTasks=curse.tmaTasks;
      if(curse.clearedSelf){ls.tmc=(ls.tmc||0)+1;extra+=" Tâm Ma Tự Thân đã tan."}
      if(curse.clearedHeavenly)extra+=" Thiên Ma Nhập Tâm đã bị trấn áp.";
      const tmb=curse.taskBonus;
      if(S.buff.n>0){const charge=GameRewards.chargeUse(S.buff.n,mins);m*=1+(S.buff.m-1)*(mins>0?charge.used/mins:0);S.buff.n=charge.remaining}
      if(S.tb&&Date.now()<S.tb)m*=1.2;
      m*=tf.mult;
      const technique=root.GameTechniques?.quote(S,q,t,h,d.completedAt);
      const questReward=GameRewards.questCompletionReward(base,m,tf.flat+(technique?.bonus||0),tmb,S.fx||[],rewardFactors(),e=>!e.t||(e.t==="q"&&deadlineResult==="onTime")||(e.t==="l"&&mins>=60),mins);
      if(late)questReward.breakdown.deadlineBonusRemoved=q.pts-base;
      if(technique)questReward.breakdown.technique=technique.bonus;
      q.got=questReward.gain;S.fx=questReward.effects;
      const stats={q:1,m:mins,ni:h>=22||h<5?1:0,da:h>=5&&h<7?1:0,ru:deadlineResult==="onTime"?1:0,lg:mins>=120?1:0};
      {const ks=KS();ls.ms=Math.max(ls.ms||0,S.streak.n);ks.ms=Math.max(ks.ms||0,S.streak.n);
       if(pb.dr&&Math.random()<1-Math.pow(1-pb.dr,mins/60)){const pool=["ca","tl","sl","ln","hx","ht","tq","ll","td","dk"],d=pool[Math.floor(Math.random()*pool.length)];S.inv[d]=(S.inv[d]||0)+1;extra+=" Thôn Thiên Thử nhặt được "+ITEMS.find(i=>i.id===d).n+"."}}
      const r0=myRk();
      const at=Date.now();
      applyReceipt(q,{day:t,gain:q.got,mins,stats,at,undone:false,breakdown:questReward.breakdown,tracked:!!S.studyReport,subjectId:root.GameSubjects?.find(S,q.subjectId)?.id||null,deadlineResult},d,1);
      if(technique){root.GameTechniques.claim(S,t,technique.id);extra+=" "+root.GameTechniques.find(technique.id).name+" đã vận chuyển."}
      ls.top=ls.top||(myRk()<=10?1:0);if(myRk()<=1)ls.t1=1;ls.mc=Math.max(ls.mc||0,S.cnt[t]);
      vlog("Hoàn thành "+q.name+": +"+q.got+" linh lực"+(S.tdPenalty?" (Trừng Phạt −"+Math.min(30,5*Math.max(1,S.tdStacks||1))+"%)":"")+", giờ học hôm nay "+(((S.hist[t]||{}).m||0)/60).toFixed(1)+" giờ, tu vi "+rname(uxp())+", hạng "+r0+" → "+myRk());
      const c=q.chain&&S.chains.find(x=>x.id===q.chain);
      if(c&&!c.paid){const st=S.quests.filter(x=>x.chain===c.id);if(st.every(isDone)){c.paid=true;c.bonus=GameRewards.chainCompletionReward(st.reduce((s,x)=>s+x.got,0),eqT("t7"),rewardFactors(),st.reduce((s,x)=>s+(x.mins||0),0));S.points+=c.bonus;root.GameAnalytics.recordPoints(S,c.bonus,false,t);hAdd(t,c.bonus,0);extra=" Hoàn thành chuỗi: thưởng thêm +"+c.bonus+" linh lực!"}}
    
    extraSet(extra);
    return true;
  }
  root.GameQuestCompletion = { finish, undo };
})(typeof window !== "undefined" ? window : globalThis);
