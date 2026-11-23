/* Quy tắc tính linh lực cơ bản và thưởng sự kiện. Không phụ thuộc DOM hoặc lưu trữ. */
(function(global){
  "use strict";
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
  function questCompletionReward(basePoints,multiplier,flatBonus,taskBonus,fx,factors){
    let gain=modGain(Math.round((Number(basePoints)||0)*(Number(multiplier)||0)+(Number(flatBonus)||0)+(Number(taskBonus)||0)),factors);
    const remaining=[];
    (Array.isArray(fx)?fx:[]).forEach(e=>{
      if(e&&e.n>0){
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
  global.GameRewards=Object.freeze({modGain,eventGain,streakMultiplier,questCompletionReward,chainCompletionReward});
})(window);
