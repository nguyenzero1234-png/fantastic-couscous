/* UI các tab Tu Luyện: lịch học, bảo khố và liên hoàn. */
(function(root){
 "use strict";
 function create(deps){
  const {S,nowHM,today,tm,isDone,sq,rn,ITEMS,IC,buffTxt,TITLES,nwS,$}=deps;
  const esc=deps.escapeHtml,expired=deps.isExpired,unlocked=deps.isUnlocked,tok=deps.isTitleUnlocked,stepRow=deps.renderStepRow;
  const getLQ=deps.getLQ,getLP=deps.getLP,lval=deps.lval,lpk=deps.lpk;
  const getFortunes=deps.getFortunes,studyMinutes=deps.studyMinutes,remaining=deps.remaining,fortuneEffects=deps.fortuneEffects,dayStr=deps.dayStr,formatTime=deps.formatTime,getCheckinRewards=deps.getCheckinRewards,itemIcons=deps.itemIcons;
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
  function checkinFortuneSummary(){
  const T=today(),c=S.ci||{last:"",n:0},act=(c.last===T||c.last===dayStr(1))?c.n:0,done=c.last===T,now=Date.now();
  let h=`<div class="box"><h2>Điểm danh</h2><small>Điểm danh liên tiếp 7 ngày, ngày thứ 7 thưởng lớn.</small><div class="days7">${getCheckinRewards().map((r,j)=>`<div class="d7 ${j<act?"on":""}"><b>${j+1}</b>+${r[0]}${r[1]?"<br>"+itemIcons[r[1]]:""}</div>`).join("")}</div><button class="btn" style="margin-left:0" data-a="ci" ${done?"disabled":""}>${done?"Đã điểm danh hôm nay":"Điểm danh"}</button></div>`;
  const L=getFortunes();
  h+=`<div class="box"><h2>Kỳ ngộ gần đây</h2><small>Cơ duyên xuất hiện bất ngờ, khoảng 1 đến 2 lần mỗi ngày. Học đủ phút trong khung giờ để nhận thưởng.</small><ul>${L.length?L.map(o=>{const m=studyMinutes(o),got=S.claimed["o:"+o.h];
    return `<li><div class="nm">${o.name}<small>${formatTime(o.st)}: học ${o.T} phút trong ${o.W} giờ, ${Math.min(m,o.T)}/${o.T} phút</small></div><span class="pb">+${o.pts}</span>${got?"<small>Đã nhận</small>":m>=o.T?`<button class="btn" data-a="kc" data-id="${o.h}">Nhận</button>`:o.en>now?"<small>Đang diễn ra</small>":"<small>Bỏ lỡ</small>"}</li>`}).join(""):`<li class="empty" style="display:block">Chưa có kỳ ngộ nào gần đây. Hãy mở app thường xuyên.</li>`}</ul></div>`;
  return h;
  }
  function renderFortunes(){
  const now=Date.now(),L=getFortunes().filter(o=>o.en>now||(studyMinutes(o)>=o.T&&!S.claimed["o:"+o.h]));
  let h=L.map(o=>{const m=studyMinutes(o),ok=m>=o.T,got=S.claimed["o:"+o.h];
    return `<div class="kn"><div class="row" style="margin:0"><b style="flex:1;font-family:var(--serif)">Kỳ ngộ: ${o.name}${nwS().k[o.h]?"":'<span class="nd" title="Mới"></span>'}</b><span class="pb">+${o.pts}</span></div><small>${o.desc}</small><div style="margin-top:6px;font-size:14px">Học ${o.T} phút trong ${o.W} giờ ${o.en>now?"(còn "+remaining(o.en)+")":"(đã hết hạn)"}. Đã học ${Math.min(m,o.T)}/${o.T} phút. Thêm: ${fortuneEffects[o.k]}.</div><div class="bar"><i style="width:${Math.min(100,Math.round(m/o.T*100))}%"></i></div><button class="btn" style="margin-left:0" data-a="kc" data-id="${o.h}" ${ok&&!got?"":"disabled"}>${got?"Đã nhận":ok?"Nhận thưởng":"Hoàn thành nhiệm vụ để tích phút"}</button></div>`}).join("");
  if(S.streak.last===dayStr(1)&&S.streak.n>=2&&new Date().getHours()>=18)h+=`<div class="kn" style="border-color:var(--red)"><b>Chuỗi ${S.streak.n} ngày học sắp đứt!</b><br><small>Học trước nửa đêm để giữ chuỗi. Đứt chuỗi (≥2 ngày) sẽ bị <b>tâm ma</b> xâm nhập.</small></div>`;
  $("kn").innerHTML=h;
  }
  function renderDailyMissions(){
  const LQ=getLQ(),LP=getLP();
  $("lenh").innerHTML=checkinFortuneSummary()+["d","w","m"].map(p=>`<div class="box"><h2>${LP[p][0]}</h2><small>${LP[p][1]}</small><ul>${LQ.filter(t=>t.per===p).map(t=>{const raw=lval(t),v=Math.min(raw,t.tg),got=S.claimed["q:"+t.id+":"+lpk(p)];
    return `<li style="display:block"><div class="row" style="margin:0"><b style="flex:1">${t.n}</b><span class="pb">+${t.r}${t.it?" và "+ITEMS.find(i=>i.id===t.it).n:""}</span></div><small>${t.desc}: ${Math.round(v)}/${t.tg}${t.met==="m"?" phút":""}</small><div class="bar"><i style="width:${Math.round(v/t.tg*100)}%"></i></div><div class="row" style="margin:0"><button class="btn" data-a="lc" data-id="${t.id}" ${got||raw<t.tg?"disabled":""}>${got?"Đã nhận":"Nhận thưởng"}</button></div></li>`}).join("")}</ul></div>`).join("");
}
  return Object.freeze({renderSchedule,renderShop,renderChains,renderDailyMissions,renderFortunes,checkinFortuneSummary});
 }
 root.GameActivityUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
