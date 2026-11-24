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

  global.GameRewards=Object.freeze({rewardFactors,modGain,eventGain,streakMultiplier,questCompletionReward,chainCompletionReward});
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
