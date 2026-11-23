/* ===== Xác định cơ duyên đặc biệt trên Thiên Kiêu Bảng =====
   Chỉ xử lý lựa chọn xác định; trạng thái và hiệu lực do game.js quản lý. */
(function(root){
  "use strict";
  function rollSpecial(rows,seed,salt,hash){
    const result=[];
    rows.forEach(row=>{
      const q=Math.abs(hash((row.u?900:row.i+1)+salt,140,seed));
      const k=q<.2?0:q<.4?1:q<.6?2:-1;
      if(k>=0)result.push({row,k});
    });
    return result;
  }
  function eventEffectText(e,b,o){
    return ["+"+e.dh.toFixed(1)+" giờ học/ngày","hiệu suất ×"+(1.25+0.35*e.c).toFixed(2),(o.neg?"trừ thẳng ":"cộng thẳng ")+Math.round(60*(1+b.b)*(2+4*e.c)*o.bm)+" linh lực","biến động còn 35%, +"+(0.5*e.dh).toFixed(1)+" giờ học/ngày",(o.neg?"trừ thẳng":"cộng thẳng")+" khoảng 2% linh lực (tối thiểu "+Math.round(150*o.bm)+")","+"+e.dh.toFixed(1)+" giờ học/ngày, kéo dài gấp đôi","hiệu suất ×1,30 và +1 giờ học/ngày","hiệu suất ×1,40 nhưng biến động ×2,5",(o.neg?"trừ thẳng ":"cộng thẳng ")+Math.round(e.flat*o.bm)+" linh lực cố định"][e.k];
  }
  root.GameLeaderboardData=Object.freeze({rollSpecial,eventEffectText});
})(typeof window!=="undefined"?window:globalThis);
