/* UI các tab Tu Luyện: lịch học, bảo khố và liên hoàn. */
(function(root){
 "use strict";
 function create(deps){
  const {S,nowHM,today,tm,isDone,sq,rn,ITEMS,IC,buffTxt,TITLES,nwS,$}=deps;
  const esc=deps.escapeHtml,expired=deps.isExpired,unlocked=deps.isUnlocked,tok=deps.isTitleUnlocked,stepRow=deps.renderStepRow;
  function renderSchedule(){
  const now=nowHM(),day=(S.sched[today()]||[]).slice().sort((a,b)=>a.s<b.s?-1:1);
  const v=$("lq").value;
  $("lq").innerHTML="<option value=\"\">Chọn nhiệm vụ (tùy chọn)</option>"+S.quests.filter(q=>!isDone(q)&&!expired(q)&&(!q.chain||unlocked(q))).map(q=>`<option value="${q.id}">${esc(q.name)} (+${q.pts})</option>`).join("");
  $("lq").value=v;
  const cur=day.find(x=>now>=x.s&&now<x.e),nxt=day.find(x=>x.s>now);
  let h=`<span class="lbl">Bây giờ, ${now}</span>`;
  if(cur){const q=sq(cur),d=q&&isDone(q);
    h+=`<h2 style="font-size:20px;margin:4px 0">${esc(rn(cur))}</h2><small>${cur.s} - ${cur.e}, còn ${tm(cur.e)-tm(now)} phút${d?", đã hoàn thành":""}</small>`;
    if(q&&!d&&!expired(q))h+=`<div class="row"><button class="btn" data-a="t" data-id="${q.id}">Hoàn thành</button>${q.mins?`<button class="btn alt" data-a="p" data-id="${q.id}" style="margin-left:0">Học</button>`:""}</div>`;
  }else h+=`<h2 style="font-size:20px;margin:4px 0">Không có việc trong khung giờ này</h2><small>${nxt?"Kế tiếp "+nxt.s+": "+esc(rn(nxt)):"Hôm nay chưa có lịch phía sau"}</small>`;
  $("now").innerHTML=h;
  $("nowbar").hidden=!cur;if(cur)$("nowbar").textContent="Bây giờ ("+cur.s+" - "+cur.e+"): "+rn(cur);
  $("slots").innerHTML=day.length?day.map(x=>{const q=sq(x),d=q&&isDone(q);
    return `<li class="${now>=x.e?"past":now>=x.s?"now":""}${d?" done":""}">${q&&!d&&!expired(q)?`<button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành"></button>`:d?`<button class="tick" disabled>✓</button>`:""}<div class="nm">${esc(rn(x))}<small>${x.s} - ${x.e}</small></div><button class="del" data-a="ld" data-id="${x.id}" aria-label="Xóa khỏi lịch">×</button></li>`}).join("")
    :`<li class="empty" style="display:block">Chưa có lịch hôm nay. Thêm khung giờ hoặc bấm Tự xếp lịch.</li>`;
}
  function renderShop(){
  $("shop").innerHTML=ITEMS.map(i=>{const own=S.inv[i.id]||0,bought=S.dailyBought[today()]||[],off=S.points<i.c||bought.includes(i.id);
    return `<li>${IC[i.id]||""}<div class="nm">${i.n}<small>${i.d}${own?", đang có "+own:""}</small></div><span class="pb">${i.c}</span><button class="btn" data-a="buy" data-id="${i.id}" ${off?"disabled":""}>${bought.includes(i.id)?"Đã mua hôm nay":"Mua"}</button></li>`}).join("");
  const inv=ITEMS.filter(i=>S.inv[i.id]);
  $("inv").innerHTML=Array.from({length:Math.max(12,Math.ceil(inv.length/3)*3)},(_,k)=>{const i=inv[k];return i?`<li class="slot"><span class="cnt">×${S.inv[i.id]}</span><span class="ic">${IC[i.id]||""}</span><b>${i.n}</b>${i.use?`<button class="btn" data-a="use" data-id="${i.id}" style="margin:0;padding:6px 10px;font-size:13px">Dùng</button>`:`<small>${i.once?"Đang phát huy":"Tự kích hoạt"}</small>`}</li>`:`<li class="slot blank"><span class="ic">◌</span><small>Ô trống</small></li>`}).join("");
  $("buff").textContent=buffTxt();
  $("titles").innerHTML=TITLES.map(t=>{const ok=tok(t);return `<li class="${ok?"":"lock"}"><div class="nm">${t.n}${nwS().t[t.id]?'<span class="nd" title="Mới"></span>':""}<small>${t.d}</small><small style="color:var(--gold)">Buff: ${t.b}</small></div>${ok?`<button class="btn ${S.title===t.id?"":"alt"}" data-a="eq" data-id="${t.id}">${S.title===t.id?"Đang đeo":"Đeo"}</button>`:"🔒"}</li>`}).join("");
}
  function renderChains(){
  $("chains").innerHTML=S.chains.length?S.chains.map(c=>{
    const st=S.quests.filter(x=>x.chain===c.id),d=st.filter(isDone).length;
    return `<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${esc(c.name)}</h2><span class="pb">${c.paid?"Xong +"+c.bonus:d+"/"+st.length+" · còn "+st.filter(x=>!isDone(x)).reduce((t,x)=>t+(x.mins||0),0)+"p"}</span><button class="del" data-a="cd" data-id="${c.id}" aria-label="Xóa chuỗi">×</button></div><div class="bar"><i style="width:${st.length?Math.round(d/st.length*100):0}%"></i></div><ul style="margin-top:8px">${st.map((q,i)=>stepRow(q,!st.slice(0,i).every(isDone))).join("")}</ul></div>`}).join("")
  :`<div class="empty">Chưa có chuỗi. Tạo chuỗi đầu tiên ở phía trên.</div>`;
}
  return Object.freeze({renderSchedule,renderShop,renderChains});
 }
 root.GameActivityUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
