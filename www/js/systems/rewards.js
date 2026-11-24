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
  function questCompletionReward(basePoints,multiplier,flatBonus,taskBonus,fx,factors,isEligible){
    let gain=modGain(Math.round((Number(basePoints)||0)*(Number(multiplier)||0)+(Number(flatBonus)||0)+(Number(taskBonus)||0)),factors);
    const remaining=[];
    (Array.isArray(fx)?fx:[]).forEach(e=>{
      if(e&&e.n>0&&(!isEligible||isEligible(e))){
        gain+=modGain(e.v,factors);
        e.n--;
      }
      if(e&&e.n>0)remaining.push(e);
    });
    return {gain,effects:remaining};
  }
  function chainCompletionReward(totalQuestGain,bonusTitle,factors){
    return modGain(Math.round((Number(totalQuestGain)||0)*0.25)+(bonusTitle?120:0),factors);
  }

  function questBonus(q,deps){
    const {S,petBuff,masterBuff,hourNow,today,ri,uxp,hasTitle,myRk,spK,SPQ}=deps;
    const pt=petBuff(),mb=masterBuff(),H=hourNow(),mins=q.mins||0,nT=(S.cnt&&S.cnt[today()])||0,pm=S.pw>0?2:1;
    let flat=3*ri(uxp());
    if(S.xb&&Date.now()<S.xb.u)flat+=S.xb.v;
    if(hasTitle("t1"))flat+=3;if(hasTitle("t2"))flat+=Math.min(14,S.streak.n);
    if(hasTitle("t4")&&S.tm)flat+=12;if(hasTitle("t6")&&mins>=60)flat+=10;
    if(hasTitle("n1")&&(H>=22||H<5))flat+=10;if(hasTitle("n2")&&H<9)flat+=10;if(hasTitle("n3")&&q.due)flat+=12;
    if(hasTitle("n7")&&mins>=120)flat+=30;if(hasTitle("n8")&&nT>=3)flat+=6;if(hasTitle("n9")&&myRk()<=3)flat+=10;
    if(hasTitle("n10")&&nT===0)flat+=25;if(hasTitle("n11")&&S.act)flat+=4;if(hasTitle("n18"))flat+=12;
    // Buff sư phụ
    if(mb.fl&&mins>=45)flat+=mb.fl;
    if(mb.fn&&(H>=22||H<5))flat+=mb.fn;
    if(mb.ft&&S.tm)flat+=mb.ft;
    flat+=pm*((pt.fq||0)+(mins>=45?pt.fl||0:0)+(q.due?pt.fr||0:0)+(S.tm?pt.ft||0:0)+(nT===0?pt.f1||0:0)+Math.min(10,Math.min(14,S.streak.n)*(pt.fs||0))+(H<9?pt.fm||0:0)+(H>=22||H<5?pt.fn||0:0));
    return{flat:flat+(spK()===0?SPQ[0].pl:0),mult:(mb.mult||1)*(spK()===1?SPQ[1].mul2:1),cap:.5,tm:.2};
  }
  global.GameRewards=Object.freeze({rewardFactors,modGain,eventGain,streakMultiplier,questCompletionReward,chainCompletionReward,questBonus});
  function createClaims(deps){
    const {S,CI,ITEMS,KX,knAt,kmins,eventGain,hAdd,today,dayStr,modGain,grantPet,vlog,save,render,say}=deps;
    const addPts=deps.addPts,hasBonusTitle=deps.hasBonusTitle,random=deps.random||Math.random;
    function claimFortune(h){
      const o=knAt(h),ck="o:"+h;
      if(!o||S.claimed[ck]||kmins(o)<o.T)return false;
      S.claimed[ck]=1;const op=eventGain(o.pts);S.points+=op;hAdd(today(),op,0);
      let extraPet="";
      if(o.k===1)S.inv.ca=(S.inv.ca||0)+1;
      else if(o.k===3)S.inv.bm=(S.inv.bm||0)+1;
      else if(o.k===4)hAdd(today(),80,0);
      else if(o.k===2){if(S.buff.n>0)addPts(20);else S.buff={n:3,m:1.3}}
      else if(o.k===5){const pet=grantPet();if(pet){extraPet=" · Linh thú xuất hiện: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
      if(o.k!==5&&o.T>=90&&random()<0.18){const pet=grantPet();if(pet){extraPet=" · Kỳ ngộ ban thêm linh thú: "+pet.n+"!";vlog("Nhận linh thú từ kỳ ngộ: "+pet.n)}}
      vlog("Kỳ ngộ "+o.name+": +"+op+" linh lực");save();render();say("Kỳ ngộ "+o.name+": +"+op+" linh lực, "+KX[o.k]+extraPet+".");
      return true;
    }
    function checkin(){
      const c=S.ci||(S.ci={last:"",n:0}),T=today();if(c.last===T)return false;
      c.n=c.last===dayStr(1)?c.n%7+1:1;c.last=T;const r=CI[c.n-1],rr=modGain(r[0]+(hasBonusTitle()?15:0));
      S.points+=rr;hAdd(T,rr,0);if(r[1])S.inv[r[1]]=(S.inv[r[1]]||0)+1;
      let petMsg="";
      if(c.n===7&&random()<0.35){const pet=grantPet();if(pet){petMsg=" · Điểm danh tròn tuần, linh thú theo về: "+pet.n+"!";vlog("Nhận linh thú từ điểm danh: "+pet.n)}}
      vlog("Điểm danh ngày "+c.n+": +"+rr+" linh lực");save();render();say("Điểm danh ngày "+c.n+": +"+rr+" linh lực"+(r[1]?" và 1 "+ITEMS.find(i=>i.id===r[1]).n:"")+petMsg+".");
      return true;
    }
    return Object.freeze({claimFortune,checkin});
  }
  global.GameRewardClaims=Object.freeze({create:createClaims});

})(window);
