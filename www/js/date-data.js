/* Các phép tính ngày theo local time, không phụ thuộc trạng thái game. */
(function(global){
  "use strict";
  const DAY=864e5;
  function shiftedDate(offsetDays, now){
    const base=now==null?Date.now():Number(now);
    return new Date(base+(Number(offsetDays)||0)*DAY);
  }
  function today(offsetDays, now){
    return shiftedDate(offsetDays,now).toLocaleDateString("sv");
  }
  function dayOffset(offsetDays, days, now){
    const date=shiftedDate(offsetDays,now);
    date.setDate(date.getDate()-(Number(days)||0));
    return date.toLocaleDateString("sv");
  }
  function weekStart(offsetDays, now){
    const date=shiftedDate(offsetDays,now);
    date.setDate(date.getDate()-(date.getDay()+6)%7);
    return date.toLocaleDateString("sv");
  }
  global.GameDateData=Object.freeze({today,dayOffset,weekStart});
})(window);
