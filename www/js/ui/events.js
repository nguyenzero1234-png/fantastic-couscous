/* UI sự kiện tuần/tháng và Kỳ Sự Cửu Châu; tính tiến độ được tiêm từ analytics. */
(function(root){
 "use strict";
 function create(deps){
  const {S,evCur,ugain,GameAnalytics,dayStr,today,KSD,$}=deps;
  const weekStart=deps.weekStart,esc=deps.escapeHtml;
  function render(){
  // Sự kiện cố định tuần/tháng + các kỳ sự cổ phong
  const E=[
    ["w","Tuần Luyện · Thiên Cơ","tuần này","Mỗi tuần Thiên Cơ mở một lần. Học đủ giờ trong tuần để nhận phúc."],
    ["m","Nguyệt Luyện · Thái Ấm","tháng này","Mỗi tháng Thái Ấm chiếu xuống. Học đủ giờ trong tháng để nhận đại phúc."]
  ];
  let h=E.map(([p,n,sub,desc])=>{
    const cur=evCur(p),ev=S.ev[p],goal=ev.h*60,ck=p+":"+(p==="w"?weekStart():today().slice(0,7)),got=S.claimed[ck],ok=cur>=goal;
    return `<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${n}</h2><span class="pb">+${ev.r}</span></div>
      <small style="display:block;line-height:1.5;margin-top:2px">${desc}</small>
      <small>Học đủ ${ev.h} giờ trong ${sub}: ${Math.floor(cur/60)} giờ ${cur%60} phút</small>
      <div class="bar"><i style="width:${Math.min(100,Math.round(cur/goal*100))}%"></i></div>
      <div class="row">${S.god?`<label>Mục tiêu <input type="number" min="1" max="999" value="${ev.h}" data-p="${p}" data-f="h"> giờ</label>
      <label>Thưởng <input type="number" min="1" max="9999" value="${ev.r}" data-p="${p}" data-f="r"> linh lực</label>`:`<small style="flex:1">Mục tiêu ${ev.h} giờ · Thưởng ${ev.r} linh lực</small>`}
      <button class="btn" data-a="ec" data-k="${ck}" data-p="${p}" ${got||!ok?"disabled":""}>${got?"Đã nhận":"Nhận thưởng"}</button></div></div>`;
  }).join("");
  const T=today(),ws=weekStart(),mo=T.slice(0,7);
  const weekQuests=()=>GameAnalytics.sumCountsBetween(S.cnt,ws,T);
  const weekNight=()=>GameAnalytics.countStudyLogEntries(S.stl,ws,T,h=>h>=22||h<5);
  const weekDawn=()=>GameAnalytics.countStudyLogEntries(S.stl,ws,T,h=>h<7);
  const weekStats=()=>GameAnalytics.studyWindowStats(S.hist,ws,T),wDs=()=>weekStats().days,wDays=()=>weekStats().daysWithStudy,wBest=()=>weekStats().bestMinutes,cs=(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0;
  const EXTRA=[
    {id:"xs1",n:"Canh Khuya Tụng Kinh",desc:"Hoàn thành ≥3 nhiệm vụ trong khung 22h–5h tuần này.",ok:()=>weekNight()>=3,r:70,ck:"xs1:"+ws},
    {id:"xs2",n:"Bình Minh Công Pháp",desc:"Hoàn thành ≥3 nhiệm vụ trước 7h tuần này.",ok:()=>weekDawn()>=3,r:70,ck:"xs2:"+ws},
    {id:"xs3",n:"Bách Luyện Thành Cương",desc:"Hoàn thành ≥10 nhiệm vụ trong tuần này.",ok:()=>weekQuests()>=10,r:90,ck:"xs3:"+ws},
    {id:"xs4",n:"Đạo Tâm Bất Chuyển",desc:"Chuỗi ngày học hiện tại ≥5.",ok:()=>(S.streak.n||0)>=5,r:80,ck:"xs4:"+ws},
    {id:"xs5",n:"Linh Thú Hữu Duyên",desc:"Đang có linh thú theo cùng (tháng này nhận 1 lần).",ok:()=>!!(S.pets&&S.act&&S.pets[S.act]),r:50,ck:"xs5:"+mo},
    {id:"xs6",n:"Tông Môn Đồng Tâm",desc:"Gia nhập tông và đóng góp ≥80 linh lực tuần này.",ok:()=>S.sect!=null&&ugain(ws,"9999")>=80,r:100,ck:"xs6:"+ws},
    {id:"xs7",n:"Cần Cù Bù Thông Minh",desc:"Học đủ 5 giờ trong tuần này.",tg:300,cur:evCur("w"),unit:"phút học",per:"w",ok:()=>evCur("w")>=300,r:80,ck:"xs7:"+ws},
    {id:"xs8",n:"Nhật Nhật Tinh Tiến",desc:"Có học ở ít nhất 5 ngày khác nhau trong tuần này.",tg:5,cur:wDays(),unit:"ngày có học",per:"w",ok:()=>wDays()>=5,r:90,ck:"xs8:"+ws},
    {id:"xs9",n:"Một Ngày Bốn Canh",desc:"Có một ngày học đủ 4 giờ trong tuần này.",tg:240,cur:wBest(),unit:"phút (ngày tốt nhất)",per:"w",ok:()=>wBest()>=240,r:80,ck:"xs9:"+ws},
    {id:"xs10",n:"Thạch Phá Thiên Kinh",desc:"Học đủ 20 giờ trong tháng này.",tg:1200,cur:evCur("m"),unit:"phút học",per:"m",ok:()=>evCur("m")>=1200,r:200,ck:"xs10:"+mo},
    {id:"xs11",n:"Trì Chi Dĩ Hằng",desc:"Chuỗi ngày học hiện tại đạt 14 ngày (nhận một lần trong tháng).",tg:14,cur:cs,unit:"ngày chuỗi",per:"m",ok:()=>cs>=14,r:150,ck:"xs11:"+mo}
  ];
  const ea=x=>esc(String(x)).replace(/"/g,"&quot;"),God=!!S.god,so=S.kso||{};
  const rng=p=>p==="m"?mo+"-01":ws;
  const stN=(p,f)=>GameAnalytics.countStudyLogEntries(S.stl||[],rng(p),T,f);
  const KM={c:["nhiệm vụ hoàn thành",p=>{let n=0;for(const k in S.cnt||{})if(k>=rng(p)&&k<=T)n+=S.cnt[k];return n}],m:["phút học",p=>evCur(p)],s:["ngày chuỗi học",()=>(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0],n:["nhiệm vụ đêm (22h-5h)",p=>stN(p,h=>h>=22||h<5)],d:["nhiệm vụ trước 7h",p=>stN(p,h=>h<7)]};
  h+=`<div class="box"><h2>Kỳ Sự Cửu Châu</h2><small>Các kỳ sự mở theo điều kiện. Mỗi kỳ sự chỉ nhận một lần trong tuần hoặc tháng tương ứng.${God?" Thiên Đạo: có thể thêm, sửa và xóa kỳ sự.":""}</small></div>`;
  if(God){const k=KSD;
    h+=`<div class="box"><h2>[God] Thêm kỳ sự</h2>
      <input type="text" data-kd="n" value="${ea(k.n||"")}" placeholder="Tên kỳ sự" maxlength="40">
      <input type="text" data-kd="d" value="${ea(k.d||"")}" placeholder="Mô tả ngắn" maxlength="120" style="margin-top:6px">
      <div class="row"><label>Điều kiện <select data-kd="m">${Object.keys(KM).map(m=>`<option value="${m}"${(k.m||"c")===m?" selected":""}>${KM[m][0]}</option>`).join("")}</select></label>
      <label>Đạt ≥ <input type="number" min="1" max="9999" data-kd="t" value="${ea(k.t||5)}"></label></div>
      <div class="row"><label>Thưởng <input type="number" min="1" max="9999" data-kd="r" value="${ea(k.r||60)}"> linh lực</label>
      <label>Chu kỳ <select data-kd="p"><option value="w"${(k.p||"w")==="w"?" selected":""}>Tuần</option><option value="m"${k.p==="m"?" selected":""}>Tháng</option></select></label>
      <button class="btn" data-a="kadd">Thêm</button></div></div>`}
  const card=(x,custom)=>{const got=S.claimed[x.ck],ok=x.ok();
    return `<div class="box"><div class="row" style="margin:0"><b style="flex:1">${esc(x.n)}</b><span class="pb">+${x.r}</span></div>
      <small style="display:block;margin-top:4px;line-height:1.5">${esc(x.desc)}</small>
      ${x.tg?`<small>${Math.min(x.cur,99999)}/${x.tg} ${x.unit} · ${x.per==="m"?"tháng này":"tuần này"}</small><div class="bar"><i style="width:${Math.min(100,Math.round(x.cur/x.tg*100))}%"></i></div>`:""}
      <div class="row" style="margin-top:8px"><button class="btn" data-a="xs" data-ck="${x.ck}" data-r="${x.r}" ${got||!ok?"disabled":""}>${got?"Đã nhận":ok?"Nhận thưởng":"Chưa đủ điều kiện"}</button>
      ${God?`<button class="btn alt" data-a="ked" data-id="${x.id}" data-n="${ea(x.n)}" data-r="${x.r}" data-d="${ea(x.desc)}" data-tg="${x.tg||""}" data-c="${custom?1:0}">Sửa</button>${custom?`<button class="btn alt" data-a="kdel" data-id="${x.id}">Xóa</button>`:(so[x.id]?`<button class="btn alt" data-a="kreset" data-id="${x.id}">Gốc</button>`:"")}`:""}</div></div>`};
  h+=EXTRA.map(x=>card(Object.assign({},x,so[x.id]||{}),false)).join("");
  h+=(S.ks||[]).map(c=>{const km=KM[c.met]||KM.c,cur=km[1](c.per);return card({id:c.id,n:c.n,desc:c.desc||"",r:c.r,tg:c.tg,cur,unit:km[0],per:c.per,ok:()=>cur>=c.tg,ck:c.id+":"+(c.per==="m"?mo:ws)},true)}).join("");
  $("events").innerHTML=h;
}
  return Object.freeze({render});
 }
 root.GameEventsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
