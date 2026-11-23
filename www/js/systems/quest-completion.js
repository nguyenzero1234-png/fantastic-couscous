(function(root){
  function finish(q, d) {
    const { S, today, dayStr, GameTimer, GameStreak, KS, extraGet, extraSet, vlog, TB, LS, petBuff, GameRewards, eqT, rewardFactors, hourNow, ITEMS, myRk, hAdd, rname, uxp, isDone } = d;
    let extra = extraGet();
      const t=today();
      if(GameTimer.activeFocus()===q)GameTimer.cancelFocus();
      if(S.streak.last!==t){
        const decision=GameStreak.completeDay({last:S.streak.last,today:t,yesterday:dayStr(1),twoDaysAgo:dayStr(2),streak:S.streak.n,lifeCharm:S.inv.the,heartCharm:!!S.sh,random:Math.random});
        if(decision.consumeLifeCharm)S.inv.the--;
        if(decision.consumeHeartCharm)S.sh=0;
        if(decision.triggerDemon){S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;}
        if(decision.extra)extra=decision.extra;
        if(decision.log)vlog(decision.log);
        S.streak=decision.streak;
      }
      const tf=TB(q),ls=LS(),pb=petBuff();if(S.pw>0)S.pw--;
      let m=GameRewards.streakMultiplier(S.streak.n,tf.cap);
      const curse=GameStreak.progressCurses({minutes:q.mins||0,tm:!!S.tm,tmTasks:S.tmTasks,tma:!!S.tma,tmaTasks:S.tmaTasks,calmTitle:eqT("n12")});
      S.tm=curse.tm;S.tmTasks=curse.tmTasks;S.tma=curse.tma;S.tmaTasks=curse.tmaTasks;
      if(curse.clearedSelf){ls.tmc=(ls.tmc||0)+1;extra+=" Tâm Ma Tự Thân đã tan."}
      if(curse.clearedHeavenly)extra+=" Thiên Ma Nhập Tâm đã bị trấn áp.";
      const tmb=curse.taskBonus;
      if(S.buff.n>0){m*=S.buff.m;S.buff.n--}
      if(S.tb&&Date.now()<S.tb)m*=1.2;
      m*=tf.mult;
      const questReward=GameRewards.questCompletionReward(q.pts,m,tf.flat,tmb,S.fx||[],rewardFactors(),e=>!e.t||(e.t==="q"&&q.due)||(e.t==="l"&&(q.mins||0)>=60));
      q.got=questReward.gain;S.fx=questReward.effects;
      {const h=hourNow(),ks=KS();ls.q++;S.life=S.life||{};S.life.q=(S.life.q||0)+1;ls.m+=q.mins||0;if(h>=22||h<5)ls.ni++;if(h<7)ls.da++;if(q.due)ls.ru++;if((q.mins||0)>=120)ls.lg++;ls.ms=Math.max(ls.ms,S.streak.n);ks.ms=Math.max(ks.ms,S.streak.n);
       if(pb.dr&&Math.random()<pb.dr){const pool=["ca","tl","sl","ln","hx","ht","tq","ll","td","dk"],d=pool[Math.floor(Math.random()*pool.length)];S.inv[d]=(S.inv[d]||0)+1;extra+=" Thôn Thiên Thử nhặt được "+ITEMS.find(i=>i.id===d).n+"."}}
      const r0=myRk();(S.cnt||(S.cnt={}))[t]=(S.cnt[t]||0)+1;(S.stl||(S.stl=[])).push([Date.now(),q.mins||0]);if(S.stl.length>300)S.stl.shift();q.doneOn=t;
      // q.got đã qua modGain; addPts không nhân lần 2 — ghi hist trực tiếp
      S.points+=q.got;hAdd(t,q.got,q.mins||0);
      ls.top=ls.top||(myRk()<=10?1:0);if(myRk()<=1)ls.t1=1;ls.mc=Math.max(ls.mc||0,S.cnt[t]);
      vlog("Hoàn thành "+q.name+": +"+q.got+" linh lực"+(S.tdPenalty?" (Trừng Phạt −"+Math.min(30,5*Math.max(1,S.tdStacks||1))+"%)":"")+", giờ học hôm nay "+(((S.hist[t]||{}).m||0)/60).toFixed(1)+" giờ, tu vi "+rname(uxp())+", hạng "+r0+" → "+myRk());
      const c=q.chain&&S.chains.find(x=>x.id===q.chain);
      if(c&&!c.paid){const st=S.quests.filter(x=>x.chain===c.id);if(st.every(isDone)){c.paid=true;c.bonus=GameRewards.chainCompletionReward(st.reduce((s,x)=>s+x.got,0),eqT("t7"),rewardFactors());S.points+=c.bonus;hAdd(t,c.bonus,0);extra=" Hoàn thành chuỗi: thưởng thêm +"+c.bonus+" linh lực!"}}
    
    extraSet(extra);
  }
  root.GameQuestCompletion = { finish };
})(typeof window !== "undefined" ? window : globalThis);
