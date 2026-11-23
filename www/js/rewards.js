/* Quy tắc tính linh lực cơ bản và thưởng sự kiện. Không phụ thuộc DOM hoặc lưu trữ. */
(function(global){
  "use strict";
  function modGain(amount,factors){
    const f=factors||{};
    const multiplier=(Number(f.td)||0)*(Number(f.balance)||0)*(Number(f.status)||0);
    return Math.max(0,Math.floor(Math.round(Number(amount)||0)*multiplier));
  }
  function eventGain(amount,charges,factors){
    let value=Number(amount)||0,remaining=Math.max(0,Math.floor(Number(charges)||0));
    if(remaining>0){value=Math.round(value*1.5);remaining--}
    return {gain:modGain(value,factors),charges:remaining,exhausted:remaining===0&&charges>0};
  }
  global.GameRewards=Object.freeze({modGain,eventGain});
})(window);
