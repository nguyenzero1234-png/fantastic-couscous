/* UI bảo khố, kho đồ, hiệu ứng và danh hiệu. */
(function(root){
 "use strict";
 function create(deps){
  const {S,today,ITEMS,IC,TITLES,nwS,masters,remaining,$,itemSystem,save,render}=deps;
  const tok=deps.isTitleUnlocked;
  function buffTxt(){
    const a=[];
    if(S.buff.n>0)a.push("×"+S.buff.m+" linh lực cho "+S.buff.n+" nhiệm vụ");
    (S.fx||[]).forEach(e=>a.push("+"+e.v+" linh lực cố định cho "+e.n+" nhiệm vụ"+(e.t==="q"?" nhanh":e.t==="l"?" từ 60 phút":"")));
    if(S.xb&&Date.now()<S.xb.u)a.push("+"+S.xb.v+" linh lực cố định mỗi nhiệm vụ, còn "+remaining(S.xb.u));
    if(S.tb&&Date.now()<S.tb)a.push("+20% linh lực trong "+Math.ceil((S.tb-Date.now())/36e5)+" giờ");
    if(S.sl)a.push("lần đổi nhàn hạ tới rẻ hơn 30%");if(S.lt)a.push("lần đổi nhàn hạ tới tặng thêm "+S.lt+" phút");
    if(S.ln===today())a.push("kiếp nạn hôm nay nhẹ hơn 25%");if(S.kd===today())a.push("kiếp nạn hôm nay +30 linh lực");
    if(S.sh)a.push("Hộ Tâm Phù đang chờ chặn lần tâm ma kế tiếp");if(S.eb)a.push("lần nhận thưởng event hoặc lệnh bài tới +"+S.eb+" linh lực");if(S.tcCharges>0)a.push("Thiên Cơ Lệnh: +50% cho "+S.tcCharges+" lần nhận thưởng");
    if(S.pw>0)a.push("buff linh thú ×2 cho "+S.pw+" nhiệm vụ");
    if(S.tdPenalty)a.push("Thiên Đạo Trừng Phạt: −"+Math.min(30,5*Math.max(1,S.tdStacks||1))+"% linh lực (×"+Math.max(1,S.tdStacks||1)+")");
    if((S.failStreak||0)>0)a.push("Chuỗi độ kiếp thất bại: "+S.failStreak);
    if(S.master!=null&&S.sect===S.master)a.push("Sư phụ "+masters[S.master].n+": "+masters[S.master].buff);
    return a.length?"Đang có hiệu ứng: "+a.join("; "):"";
  }
    function renderShop(){
  $("shop").innerHTML=ITEMS.map(i=>{const own=S.inv[i.id]||0,bought=S.dailyBought[today()]||[],off=S.points<i.c||bought.includes(i.id);
    return `<li>${IC[i.id]||""}<div class="nm">${i.n}<small>${i.d}${own?", đang có "+own:""}</small></div><span class="pb">${i.c}</span><button class="btn" data-a="buy" data-id="${i.id}" ${off?"disabled":""}>${bought.includes(i.id)?"Đã mua hôm nay":"Mua"}</button></li>`}).join("");
  const inv=ITEMS.filter(i=>S.inv[i.id]);
  $("inv").innerHTML=Array.from({length:Math.max(12,Math.ceil(inv.length/3)*3)},(_,k)=>{const i=inv[k];return i?`<li class="slot"><span class="cnt">×${S.inv[i.id]}</span><span class="ic">${IC[i.id]||""}</span><b>${i.n}</b>${i.use?`<button class="btn" data-a="use" data-id="${i.id}" style="margin:0;padding:6px 10px;font-size:13px">Dùng</button>`:`<small>${i.once?"Đang phát huy":"Tự kích hoạt"}</small>`}</li>`:`<li class="slot blank"><span class="ic">◌</span><small>Ô trống</small></li>`}).join("");
  $("buff").textContent=buffTxt();
  $("titles").innerHTML=TITLES.map(t=>{const ok=tok(t);return `<li class="${ok?"":"lock"}"><div class="nm">${t.n}${nwS().t[t.id]?'<span class="nd" title="Mới"></span>':""}<small>${t.d}</small><small style="color:var(--gold)">Buff: ${t.b}</small></div>${ok?`<button class="btn ${S.title===t.id?"":"alt"}" data-a="eq" data-id="${t.id}">${S.title===t.id?"Đang đeo":"Đeo"}</button>`:"🔒"}</li>`}).join("");
}

  function handleClick(e){
    const button=e.target.closest("[data-a]");
    if(!button||button.disabled)return;
    const {a,id}=button.dataset;
    let handled=false;
    if(a==="buy")handled=itemSystem.buy(id);
    else if(a==="use")handled=itemSystem.use(id);
    else if(a==="eq")handled=itemSystem.equipTitle(id);
    if(handled){save();render()}
  }
  return Object.freeze({render:renderShop,handleClick});
 }
 root.GameInventoryUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
