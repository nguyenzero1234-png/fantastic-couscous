/* Giao diện Thiên Đạo: bố cục và trạng thái hiển thị. */
(function(root){
 "use strict";
 const groups=[
  {id:"progress",title:"Tu vi & thời gian",buttons:[["pt","+1.000 linh lực"],["pb","+10.000 linh lực"],["xp","Lên cảnh giới kế"],["dt","Lên Chân Tiên"],["day","+1 ngày"],["st","+1 chuỗi học"],["k0","Kiếp hết hạn"],["hh","Đổi giờ giả lập"]]},
  {id:"trial",title:"Thiên kiếp & Mệnh",buttons:[["ex","Chốt mọi thiên kiếp"],["xr","Làm lại thiên kiếp"],["kf","Vượt kiếp nạn hôm nay"],["kc","Xóa nhận kiếp nạn"],["mh","Mệnh = 100"],["m0","Mệnh = 0"],["ax","Xóa Trừng Phạt"],["fp","Gây Trừng Phạt"]]},
  {id:"study",title:"Học tập & trạng thái",buttons:[["qs","Tạo nhiệm vụ mẫu"],["gt","+1 giờ nhàn hạ"],["tm","Gây tâm ma tự thân"],["tma","Gây thiên ma nhập tâm"],["tx","Xóa mọi tâm ma"],["sx","Xóa chuỗi học"],["sb","Đứt chuỗi + tâm ma"],["bf","Cấp buff thử"],["ev","Đầy tiến độ kỳ sự"],["cr","Xóa nhận thưởng"]]},
  {id:"treasure",title:"Bảo vật & linh thú",buttons:[["it","+3 mỗi vật phẩm"],["pa","Mọi thú cấp 5"],["pe","Hồ tích đầy"],["ti","Cấp mọi danh hiệu"],["ft","Bật/tắt đặc quyền danh hiệu"],["ic","Dọn kho & buff"],["ps","Xóa linh thú"],["tr","Thu hồi danh hiệu"]]},
  {id:"sect",title:"Tông môn & cơ duyên",buttons:[["sw","Thắng tông chiến"],["js","Gia nhập tông ngẫu nhiên"],["bm","Bái sư bỏ điều kiện"],["sp0","Ban Chi Lực"],["sp1","Ban Gia Tốc"],["sp2","Ban Khai Ân"],["spr","Quay 3 hạng cuối"],["spx","Xóa cơ duyên đặc biệt"],["sd","Làm mới kỳ ngộ"],["wk","Chốt bảng tuần"]]},
  {id:"diagnostics",title:"Kiểm tra hệ thống",buttons:[["ck","Tự kiểm tra"],["cal","Hiệu chuẩn NPC"],["fx","Thử âm thanh"]]},
  {id:"reset",title:"Luân hồi & đặt lại",buttons:[["pv","Xem phán quyết"],["rb","Luân hồi ngay"],["rc","Xóa sử luân hồi"],["wp","Tẩy trắng"]]}
 ];
 const danger=new Set(["ic","ps","tr","rc","wp","rb","sx","sb","cr","spx","xr","ex","kc","k0","m0","fp"]);
 function create({S,$,getCurStreak}){
  let mounted=false,lastPoints;
  const button=([id,label])=>`<button type="button" class="btn alt${danger.has(id)?" god-danger":""}" data-gm="${id}">${label}</button>`;
  function render(){
   const host=$("g");if(!host)return;
   if(!S.god){if(mounted)host.innerHTML="";mounted=false;lastPoints=undefined;return}
   if(!mounted){
    host.innerHTML=`<div class="box god-head"><div class="god-title"><h2>Thiên Đạo</h2>${button(["off","Tắt"])}</div><small>Chế độ kiểm thử · tác động trực tiếp đến tiến trình.</small><div class="god-status" id="godstatus"></div></div>
    ${groups.map(g=>`<details class="fold god-group" data-god-group="${g.id}"${g.id==="progress"?" open":""}><summary>${g.title}</summary>
     ${g.id==="progress"?`<div class="god-point"><label for="gv">Đặt linh lực</label><div><input type="number" id="gv" min="0" step="1" inputmode="numeric">${button(["sv","Áp dụng"])}</div></div>`:""}
     ${g.id==="reset"?`<small>Tẩy trắng cần bấm hai lần. Tiến trình trước đó được giữ trong bản sao nội bộ.</small>`:""}
     <div class="god-actions">${g.buttons.map(button).join("")}</div>
     ${g.id==="diagnostics"?`<pre id="gout" aria-live="polite"></pre>`:""}</details>`).join("")}`;
    mounted=true;
   }
   const points=Math.round(S.points),input=$("gv");
   if(input&&(lastPoints===undefined||input.value===String(lastPoints)))input.value=String(points);
   lastPoints=points;
   $("godstatus").textContent=`${points.toLocaleString("vi-VN")} linh lực · Mệnh ${S.menh??100}/100 · Chuỗi ${getCurStreak()} ngày · Giờ ${S.hh==null?"thật":S.hh+"h"}${S.tdPenalty?" · Trừng Phạt ×"+(S.tdStacks||1):""}`;
  }
  return Object.freeze({render});
 }
 root.GameGodModeUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
