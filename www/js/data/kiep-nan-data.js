/* ===== Dữ liệu kỳ ngộ/kiếp nạn =====
   Tách phép sinh sự kiện xác định khỏi state game; seed và hash do caller cung cấp. */
(function(root){
  "use strict";
  function create(seed,h,epoch,types,hash){
    if(hash(seed,90,h)<0.88)return null;
    const g=k=>Math.abs(hash(seed,91+k,h));
    const W=[3,4,6,8][Math.floor(g(0)*4)%4];
    const T=[30,45,60,90,120][Math.floor(g(1)*5)%5];
    const k=Math.floor(g(2)*6)%6;
    const st=epoch+(h+g(3))*36e5;
    return {
      h,k,W,T,st,en:st+W*36e5,
      pts:Math.round(T*0.8*(1+(8-W)/8)*types[k][2]),
      name:types[k][0],desc:types[k][1]
    };
  }
  root.GameKiepNanData=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
