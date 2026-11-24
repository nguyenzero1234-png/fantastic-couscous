/* Quy tắc tính linh lực cơ bản và thưởng sự kiện. Không phụ thuộc DOM hoặc lưu trữ. */
(function(global){
  "use strict";
  function rewardFactors(state,now){
    const s=state||{},time=Number(now)||0;
    const td=s.tdPenalty?Math.max(0.7,1-0.05*Math.max(1,s.tdStacks||1)):1;
    const balance=s.balanced?s.balMult:1;
    const status=(s.tm?0.8:1)*(s.tma?0.65:1)*(s.cbUntil>time?1.1:1);
    return {td,balance,status};
  }
  function modGain(amount,factors){
    const f=factors||{};
    const rounded=Math.round(Number(amount)||0);
    return Math.max(0,Math.floor(rounded*(Number(f.td)||0)*(Number(f.balance)||0)*(Number(f.status)||0)));
  }
  function eventGain(amount,charges,factors){
    let value=Number(amount)||0,remaining=Math.max(0,Math.floor(Number(charges)||0));
    if(remaining>0){value=Math.round(value*1.5);remaining--}
    return {gain:modGain(value,factors),charges:remaining,exhausted:remaining===0&&charges>0};
  }
  function streakMultiplier(streakDays,cap){
    return 1+Math.min(Number(cap)||0,0.05*((Number(streakDays)||0)-1));
  }
  // One effect charge represents 60 minutes of eligible study.
  function chargeUse(charges,minutes){
    const available=Math.max(0,Math.round((Number(charges)||0)*60));
    const used=Math.min(available,Math.max(0,Number(minutes)||0));
    return {used,remaining:(available-used)/60};
  }
  function balanceMultiplier(rebirths){return [1.25,1.15,1.05][Math.max(0,Math.floor(Number(rebirths)||0))]||1}
  function leisureQuote(minutes,rate,discount,masterDiscount,petDiscount,titleDiscount,petBonus,titleBonus,itemBonus){
    const m=Math.max(0,Number(minutes)||0),r=Math.max(1,Number(rate)||1);
    const eligible=discount?Math.min(m,120):0;
    const cost=Math.max(1,Math.ceil((m-eligible*.3)*r*(1-(masterDiscount||0)/100)*(1-((petDiscount||0)+(titleDiscount?8:0))/100)));
    const bonusSeconds=Math.floor(m*60*((petBonus||0)+(titleBonus?5:0))/60)+(itemBonus||0)*60;
    return {cost,bonusSeconds};
  }
  function nightKey(day,hour){
    if(hour>=5)return day;
    const d=new Date(day+"T12:00:00");d.setDate(d.getDate()-1);
    return d.toLocaleDateString("sv");
  }
  function nightMinutes(state,day,hour,minutes){
    if(hour>=5&&hour<22)return 0;
    return Math.min(Math.max(0,Number(minutes)||0),Math.max(0,120-((state.nightStudy||{})[nightKey(day,hour)]||0)));
  }
  function questCompletionReward(basePoints,multiplier,flatBonus,taskBonus,fx,factors,isEligible,minutes=60){
    const subtotal=Math.round((Number(basePoints)||0)*(Number(multiplier)||0)+(Number(flatBonus)||0)+(Number(taskBonus)||0));
    const adjusted=modGain(subtotal,factors);
    let gain=adjusted;
    const remaining=[];
    (Array.isArray(fx)?fx:[]).forEach(e=>{
      if(e&&e.n>0&&(!isEligible||isEligible(e))){
        const charge=chargeUse(e.n,minutes);
        gain+=modGain(e.v*charge.used/60,factors);
        e.n=charge.remaining;
      }
      if(e&&e.n>0)remaining.push(e);
    });
      return {gain,effects:remaining,breakdown:{base:Number(basePoints)||0,multiplier:Number(multiplier)||0,flat:Number(flatBonus)||0,taskBonus:Number(taskBonus)||0,subtotal,td:Number(factors?.td)||0,balance:Number(factors?.balance)||0,status:Number(factors?.status)||0,adjusted,itemGain:gain-adjusted}};
  }
  function chainCompletionReward(totalQuestGain,bonusTitle,factors,totalMinutes=240){
    return Math.round((Number(totalQuestGain)||0)*0.15)+(bonusTitle?modGain(Math.min(120,totalMinutes/60*30),factors):0);
  }

  function questBonus(q,deps){
    const {S,petBuff,masterBuff,hourNow,today,ri,uxp,hasTitle,myRk,spK,SPQ}=deps;
    const pt=petBuff(),mb=masterBuff(),H=hourNow(),mins=q.mins||0,studied=(S.hist?.[today()]?.m||0);
    const hours=mins/60,night=nightMinutes(S,today(),H,mins)/60,morning=H>=5&&H<9;
    const pm=1+(mins>0?chargeUse(S.pw,mins).used/mins:0);
    let flat=3*ri(uxp());
    if(S.xb&&Date.now()<S.xb.u)flat+=S.xb.v;
    if(hasTitle("t1"))flat+=3;if(hasTitle("t2"))flat+=Math.min(14,S.streak.n);
    if(hasTitle("t4")&&S.tm)flat+=12;if(hasTitle("t6")&&mins>=60)flat+=10;
    if(hasTitle("n2")&&morning)flat+=10;if(hasTitle("n3")&&q.due)flat+=12;
    if(hasTitle("n7")&&mins>=120)flat+=30;if(hasTitle("n9")&&myRk()<=3)flat+=10;
    if(hasTitle("n11")&&S.act)flat+=4;if(hasTitle("n18"))flat+=12;
    // Buff sư phụ
    if(mb.fl&&mins>=45)flat+=mb.fl;
    if(mb.ft&&S.tm)flat+=mb.ft;
    flat+=pm*((pt.fq||0)+(mins>=45?pt.fl||0:0)+(q.due?pt.fr||0:0)+(S.tm?pt.ft||0:0)+Math.min(10,Math.min(14,S.streak.n)*(pt.fs||0))+(morning?pt.fm||0:0));
    // First hour and the part after two hours of daily study are duration based.
    const firstHours=Math.min(hours,Math.max(0,60-studied)/60);
    const first=(pm*(pt.f1||0)+(hasTitle("n10")?25:0))*firstHours;
    const later=hasTitle("n8")?6*Math.min(hours,Math.max(0,studied+mins-120)/60):0;
    const nightBonus=(hasTitle("n1")?10:0)+(mb.fn||0)+pm*(pt.fn||0);
    return{flat:(flat+(spK()===0?SPQ[0].pl:0))*hours+first+later+nightBonus*night,mult:(mb.mult||1)*(spK()===1?SPQ[1].mul2:1),cap:.5,tm:.2,nightMinutes:night*60};
  }
  global.GameRewards=Object.freeze({rewardFactors,modGain,eventGain,streakMultiplier,questCompletionReward,chainCompletionReward,questBonus,chargeUse,balanceMultiplier,nightKey,nightMinutes,leisureQuote});
  function createClaims(deps){
    const {S,CI,ITEMS,KX,knAt,kmins,eventGain,hAdd,today,dayStr,modGain,grantPet,vlog,save,render,say}=deps;
    const addPts=deps.addPts,hasBonusTitle=deps.hasBonusTitle,random=deps.random||Math.random;
    function claimFortune(h){
      const o=knAt(h),ck="o:"+h;
      if(!o||S.claimed[ck]||kmins(o)<o.T)return false;
      const before=S.points;
      S.claimed[ck]=1;const op=eventGain(o.pts);S.points+=op;global.GameAnalytics.recordPoints(S,op,false,today());hAdd(today(),op,0);
      let extraPet="";
      if(o.k===1)S.inv.ca=(S.inv.ca||0)+1;
      else if(o.k===3)S.inv.bm=(S.inv.bm||0)+1;
      else if(o.k===4){S.points+=80;global.GameAnalytics.recordPoints(S,80,false,today());hAdd(today(),80,0)}
      else if(o.k===2){if(S.buff.n>0)addPts(20);else S.buff={n:3,m:1.3}}
      else if(o.k===5){const pet=grantPet();if(pet){extraPet=" · Linh thú xuất hiện: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
      if(o.k!==5&&o.T>=90&&random()<0.18){const pet=grantPet();if(pet){extraPet=" · Kỳ ngộ ban thêm linh thú: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
      deps.onPointsChanged?.(before);
      vlog("Kỳ ngộ "+o.name+": +"+(op+(o.k===4?80:0))+" linh lực");save();render();say("Kỳ ngộ "+o.name+": +"+op+" linh lực, "+KX[o.k]+extraPet+".");
      return true;
    }
    function checkin(){
      const c=S.ci||(S.ci={last:"",n:0}),T=today();if(c.last===T)return false;
      c.n=c.last===dayStr(1)?c.n%7+1:1;c.last=T;const r=CI[c.n-1],rr=modGain(r[0]+(hasBonusTitle()?15:0));
      S.points+=rr;global.GameAnalytics.recordPoints(S,rr,false,T);hAdd(T,rr,0);if(r[1])S.inv[r[1]]=(S.inv[r[1]]||0)+1;
      let petMsg="";
      if(c.n===7&&random()<0.35){const pet=grantPet();if(pet){petMsg=" · Điểm danh tròn tuần, linh thú theo về: "+pet.n+"!";vlog("Nhận linh thú từ điểm danh: "+pet.n)}}
      vlog("Điểm danh ngày "+c.n+": +"+rr+" linh lực");save();render();say("Điểm danh ngày "+c.n+": +"+rr+" linh lực"+(r[1]?" và 1 "+ITEMS.find(i=>i.id===r[1]).n:"")+petMsg+".");
      return true;
    }
    return Object.freeze({claimFortune,checkin});
  }
  global.GameRewardClaims=Object.freeze({create:createClaims});

})(window);
