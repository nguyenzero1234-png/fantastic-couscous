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
  root.GameLeaderboardData=Object.freeze({rollSpecial});
})(typeof window!=="undefined"?window:globalThis);
