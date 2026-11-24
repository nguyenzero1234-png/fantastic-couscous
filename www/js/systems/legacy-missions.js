/* Sứ mệnh xuyên kiếp: điều kiện, mở khóa và HTML độc lập với bootstrap. */
(function(root){
"use strict";
const paths=[
 {id:"steady",n:"Tĩnh Tâm",d:"7 ngày học từ 20 phút",need:7,met:S=>Object.values(S.hist||{}).filter(day=>day.m>=20).length},
 {id:"breadth",n:"Vạn Pháp",d:"3 môn học từ 30 phút mỗi môn",need:3,met:S=>(S.subjects?.list||[]).filter(s=>root.GameSubjects.minutes(S,s.id)>=30).length},
 {id:"balance",n:"Song Tu",d:"4 ngày học hai môn, mỗi môn từ 15 phút",need:4,met:S=>Object.values(S.subjects?.days||{}).filter(day=>(S.subjects?.list||[]).filter(s=>(day[s.id]||0)>=15).length>=2).length}
];
const records=S=>Array.isArray(S.rbh)?S.rbh.filter(r=>r&&typeof r==="object"):[];
function lifePath(S){
 const index=Number.isSafeInteger(S.rb)&&S.rb>=0?S.rb%paths.length:0;
 const p=paths[index];
 return {id:p.id,n:p.n,d:p.d,need:p.need,progress:Math.min(p.need,p.met(S))};
}
function validPath(value){
 const p=paths.find(p=>p.id===value?.id);
 return !!p&&Number.isInteger(value.progress)&&value.progress>=0&&value.progress<=p.need;
}
function pathDescription(value){
 if(!validPath(value))return "";
 const p=paths.find(p=>p.id===value.id);
 return `${p.n} · ${value.progress}/${p.need}${value.progress===p.need?" · Viên mãn":""}`;
}
const definitions=[
 {id:"L1",n:"Sơ Nhập Đạo Đồ",d:"Hoàn thành hướng dẫn lần đầu",ok:S=>!!S.tutDone},
 {id:"L2",n:"Bách Nhiệm Chi Nhân",d:"Tổng ≥100 nhiệm vụ (mọi kiếp)",ok:S=>(S.life&&S.life.q||0)>=100},
 {id:"L3",n:"Thiên Kiêu Cựu Nhân",d:"Từng đứng top 10",ok:S=>!!(S.life&&S.life.top10)},
 {id:"L4",n:"Độ Kiếp Giả",d:"Vượt ≥5 thiên kiếp (mọi kiếp, từ Khá)",ok:S=>(S.life&&S.life.exOk||0)>=5},
 {id:"L5",n:"Luân Hồi Khách",d:"Trải ≥2 kiếp",ok:S=>(S.rb||0)>=2},
 {id:"L6",n:"Tông Môn Tín Đồ",d:"Gia nhập tông ≥3 lần (đếm kiếp có tông)",ok:S=>(S.life&&S.life.sectN||0)>=3},
 {id:"L7",n:"Viên Mãn Đạo Hữu",d:"Từng đạt phán quyết Viên Mãn hoặc Xuất Sắc",ok:S=>!!(S.life&&S.life.excel)},
 {id:"L8",n:"Mệnh Cứng Như Sắt",d:"Từng ân xá Trừng Phạt",ok:S=>!!(S.life&&S.life.anXa)},
 {id:"L9",n:"Tam Tông Truyền Nhân",d:"Lĩnh ngộ 3 truyền thừa khác nhau qua ít nhất 2 kiếp đã khép",ok:S=>{const lives=records(S).filter(r=>Array.isArray(r.transmissions)&&r.transmissions.length);return lives.length>=2&&new Set(lives.flatMap(r=>r.transmissions).filter(id=>Number.isInteger(id)&&id>=0&&id<6)).size>=3}},
 {id:"L10",n:"Tuế Nguyệt Vô Ngại",d:"Khép lại hai kiếp đủ kỳ hạn với thời lượng khác nhau",ok:S=>new Set(records(S).filter(r=>root.GameProgressData.CYCLE_DAYS.includes(r.cycleDays)&&r.days>=r.cycleDays).map(r=>r.cycleDays)).size>=2},
 {id:"L11",n:"Tam Đạo Đồng Quy",d:"Viên mãn cả ba đạo lộ qua các kiếp đã khép",ok:S=>new Set(records(S).map(r=>r.lifePath).filter(v=>validPath(v)&&v.progress===paths.find(p=>p.id===v.id).need).map(v=>v.id)).size===paths.length},
 {id:"L12",n:"Đạo Tâm Bất Tức",d:"Hai kiếp đã khép, mỗi kiếp từng giữ chuỗi học từ 7 ngày",ok:S=>records(S).filter(r=>Number.isFinite(r.ms)&&r.ms>=7).length>=2}
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
  const got=S.legacy||{},p=lifePath(S);
  return `<div class="box"><h2>Sứ mệnh xuyên kiếp</h2>
    <small>Hoàn thành một lần là mãi mãi. <b>Không buff linh lực</b> — chỉ danh hiệu và ký ức trên Thiên Thư. Không mất khi luân hồi.</small></div>`+
    `<div class="box"><h2>Đạo lộ kiếp này · ${p.n}</h2><small>${p.d} · ${p.progress}/${p.need}</small><div class="bar"><i style="width:${Math.round(p.progress/p.need*100)}%"></i></div><small>${p.progress===p.need?"Đã viên mãn. Sẽ khắc vào sử kiếp khi luân hồi.":"Mục tiêu tự nguyện, luân phiên mỗi kiếp."}</small></div>`+
    definitions.map(item=>`<div class="box"><div class="row" style="margin:0"><b style="flex:1">${item.n}</b><span class="pb">${got[item.id]?"Đã khắc":"Chưa"}</span></div>
      <small style="display:block;margin-top:4px">${item.d}</small>
      ${got[item.id]?`<small style="color:var(--jade)">Khắc vào đạo quả · ${formatDate(got[item.id])}</small>`:""}
    </div>`).join("");
 }
 return {definitions,lifeTrack,check,render};
}
root.GameLegacyMissions={create,lifePath,validPath,pathDescription};
})(typeof window!=="undefined"?window:globalThis);
