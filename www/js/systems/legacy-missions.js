/* Sứ mệnh xuyên kiếp: điều kiện, mở khóa và HTML độc lập với bootstrap. */
(function(root){
"use strict";
const definitions=[
 {id:"L1",n:"Sơ Nhập Đạo Đồ",d:"Hoàn thành hướng dẫn lần đầu",ok:S=>!!S.tutDone},
 {id:"L2",n:"Bách Nhiệm Chi Nhân",d:"Tổng ≥100 nhiệm vụ (mọi kiếp)",ok:S=>(S.life&&S.life.q||0)>=100},
 {id:"L3",n:"Thiên Kiêu Cựu Nhân",d:"Từng đứng top 10",ok:S=>!!(S.life&&S.life.top10)},
 {id:"L4",n:"Độ Kiếp Giả",d:"Vượt ≥5 thiên kiếp (mọi kiếp, từ Khá)",ok:S=>(S.life&&S.life.exOk||0)>=5},
 {id:"L5",n:"Luân Hồi Khách",d:"Trải ≥2 kiếp",ok:S=>(S.rb||0)>=2},
 {id:"L6",n:"Tông Môn Tín Đồ",d:"Gia nhập tông ≥3 lần (đếm kiếp có tông)",ok:S=>(S.life&&S.life.sectN||0)>=3},
 {id:"L7",n:"Viên Mãn Đạo Hữu",d:"Từng đạt phán quyết Viên Mãn hoặc Xuất Sắc",ok:S=>!!(S.life&&S.life.excel)},
 {id:"L8",n:"Mệnh Cứng Như Sắt",d:"Từng ân xá Trừng Phạt",ok:S=>!!(S.life&&S.life.anXa)}
];
function create({S,save=()=>{},say=()=>{},now=Date.now,setTimeoutFn=setTimeout,formatDate=ts=>new Date(ts).toLocaleDateString("vi-VN")}){
 function lifeTrack(){
  S.life=S.life||{q:0,top10:0,exOk:0,sectN:0,excel:0,anXa:0};
  S.life.q=(S.life.q||0);
  return S.life;
 }
 function check(){
  lifeTrack();
  const got=S.legacy||(S.legacy={}),newly=[];
  definitions.forEach(item=>{if(!got[item.id]&&item.ok(S)){got[item.id]=now();newly.push(item.n)}});
  if(newly.length){save();setTimeoutFn(()=>say("Sứ mệnh hoàn thành: "+newly.join(", ")+"! (danh hiệu vĩnh viễn)"),250)}
  return newly;
 }
 function render(){
  lifeTrack();
  const got=S.legacy||{};
  return `<div class="box"><h2>Sứ mệnh xuyên kiếp</h2>
    <small>Hoàn thành một lần là mãi mãi. <b>Không buff linh lực</b> — chỉ danh hiệu và ký ức trên Thiên Thư. Không mất khi luân hồi.</small></div>`+
    definitions.map(item=>`<div class="box"><div class="row" style="margin:0"><b style="flex:1">${item.n}</b><span class="pb">${got[item.id]?"Đã khắc":"Chưa"}</span></div>
      <small style="display:block;margin-top:4px">${item.d}</small>
      ${got[item.id]?`<small style="color:var(--jade)">Khắc vào đạo quả · ${formatDate(got[item.id])}</small>`:""}
    </div>`).join("");
 }
 return {definitions,lifeTrack,check,render};
}
root.GameLegacyMissions={create};
})(typeof window!=="undefined"?window:globalThis);
