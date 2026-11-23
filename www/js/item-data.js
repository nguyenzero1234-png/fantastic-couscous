/* ===== Mô tả dữ liệu vật phẩm =====
   Tạo phần mô tả và tổng linh lực từ cấu hình; không sửa vật phẩm đầu vào. */
(function(root){
  "use strict";
  function describe(item){
    if(!item||!item.q)return {};
    const [n,v,t]=item.q;
    const total=n*v+(item.ex||0);
    const condition=t==="q"?" nhanh":t==="l"?" từ 60 phút":"";
    const ratio=total/item.c;
    const ratioText=Number.isInteger(ratio)?String(ratio):ratio.toFixed(1).replace(".",",");
    const description="Dùng: "+(item.u?item.u+"; ":"")+(item.ex?"thêm ":"")+n+" nhiệm vụ"+condition+" kế tiếp, mỗi nhiệm vụ +"+v+" linh lực cố định (tổng +"+total+(ratio>=2?", gấp "+ratioText+" lần giá":", hoàn lại đủ giá cộng tác dụng riêng")+")";
    return {tot:total,d:description};
  }
  root.GameItemData=Object.freeze({describe});
})(typeof window!=="undefined"?window:globalThis);
