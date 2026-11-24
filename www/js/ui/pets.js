(function(root){
 function render(d){
  const {S,$,PS,petIcon,petRank,nwS,petAcc,save,render,document}=d;
    const P=S.pets||(S.pets={});
    const owned=Object.keys(P).length;
    $("pet").innerHTML=`<h2>Linh Thú</h2><small>Linh thú <b>không thể mua</b>. Chỉ nhận được qua <b>Kỳ ngộ</b> (đặc biệt loại Linh Thú Xuất Thế), <b>Kỳ sự tuần/tháng</b> và điểm danh tròn tuần. Chỉ linh thú đang theo cùng mới phát huy buff. Tiến hóa đổi danh hiệu và tăng hiệu ứng. Buff đã được cân bằng lại; thức ăn chỉ nhân đôi buff nhiệm vụ trong 3 nhiệm vụ, không nhân đôi hiệu ứng ngoài nhiệm vụ. Phượng Hoàng tối đa +10 linh lực mỗi nhiệm vụ.</small>
    <small style="display:block;margin-top:4px">Đã thu phục: ${owned}/${PS.length}</small>
    <ul>${PS.map(p=>{const o=P[p.id],on=S.act===p.id,title=o?petRank(p,o.lv):null,next=o&&o.lv<5?petRank(p,o.lv+1):null;
      return `<li style="display:block"><div class="row" style="margin:0;align-items:center"><span class="pet-ico">${petIcon(p.id)}</span><b style="flex:1">${o?title:p.n}${nwS().p[p.id]?'<span class="nd" title="Mới"></span>':""}</b>${on?`<span class="pb">Đang theo</span>`:!o?`<span class="pb" style="opacity:.6">Chưa gặp</span>`:`<span class="pb" style="opacity:.75">${p.n}</span>`}</div><small>${p.d}: ${p.e(o?o.lv:1)}${o?"":" · danh hiệu mở đầu: "+petRank(p,1)}</small><div class="row" style="margin:6px 0 0">${!o?`<small style="color:var(--mute)">Chờ kỳ ngộ hoặc sự kiện…</small>`:`${on?"":`<button class="btn" style="margin-left:0" data-pa="act" data-id="${p.id}">Cho theo cùng</button>`}${o.lv<5?`<button class="btn alt" style="margin-left:0" data-pa="up" data-id="${p.id}" ${S.points<150*o.lv?"disabled":""}>Tiến hóa → ${next} (${150*o.lv})</button>`:`<small style="color:var(--jade)">Đã đạt đỉnh danh hiệu</small>`}${on&&p.id==="hl"?`<button class="btn" style="margin-left:0" data-pa="get" ${petAcc()<1?"disabled":""}>Thu hoạch ${petAcc()}</button>`:""}`}</div></li>`}).join("")}</ul>`;
    const oldReveal=document.getElementById("pet-reveal-overlay");
    if(oldReveal)oldReveal.remove();
    const notice=S.petEvolution||S.petReveal;
    if(notice){
      const r=notice,isEvolution=!!S.petEvolution,overlay=document.createElement("div");
      overlay.id="pet-reveal-overlay";
      overlay.className="pet-reveal-overlay";
      overlay.innerHTML=`<div class="pet-reveal" role="dialog" aria-modal="true" aria-labelledby="pet-reveal-title">
        <div class="pet-sparks">✦　✧　✦　✧　✦</div>
        <div class="pet-seal">THIÊN ĐẠO CHỨNG GIÁM · ${isEvolution?"ĐẠI ĐẠO THĂNG HOA":"CƠ DUYÊN HIỆN THẾ"}</div>
        <div class="pet-reveal-icon">${petIcon(r.id)}</div>
        <h2 id="pet-reveal-title">${isEvolution?"Linh Thú Tiến Hóa":"Linh Thú Xuất Thế"}</h2>
        <span class="pet-name">${isEvolution?r.newRank:r.n}</span>
        <span class="pet-sub">${isEvolution?`ĐỘT PHÁ CẢNH GIỚI · ${r.oldRank} → ${r.newRank} · CẤP ${r.lv}/5`:`DANH HIỆU KHỞI ĐẦU · ${r.base}`}</span>
        <p class="pet-lore">${isEvolution?`Linh quang hội tụ, huyết mạch thức tỉnh. ${r.n} đã vượt qua giới hạn, bước vào cảnh giới mới!`:r.d}</p>
        <div class="pet-talent"><b>✧ ${isEvolution?"Thiên phú sau tiến hóa":"Thiên phú &amp; hiệu ứng"} ✧</b><br>${r.e}</div>
        <div class="pet-sparks">❖　❖　❖</div>
        <button class="pet-confirm" type="button" id="pet-reveal-confirm">${isEvolution?"XÁC NHẬN ĐỘT PHÁ":"XÁC NHẬN THU NHẬN"}</button>
      </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector("#pet-reveal-confirm").addEventListener("click",()=>{
        S.petReveal=null;S.petEvolution=null;save();render();
      });
    }
 }
 function handleClick(e,d){
  const {S,$,PS,petRank,setAct,say,modGain,petAcc,hAdd,today,Date,save,render}=d;
    const b=e.target.closest("button");if(!b||b.disabled)return;
    const a=b.dataset.pa,id=b.dataset.id,P=S.pets||(S.pets={}),p=PS.find(x=>x.id===id),o=P[id];
    if(a==="accept"){S.petReveal=null;S.petEvolution=null;save();render();return}
    if(a==="hatch"){say("Linh thú không thể ấp bằng linh lực. Hãy tìm qua Kỳ ngộ hoặc Sự kiện.");return}
    else if(a==="act"&&o){setAct(id);say("Đã cho "+petRank(p,o.lv)+" theo cùng.")}
    else if(a==="up"&&o&&o.lv<5){const c=150*o.lv;if(S.points<c){say("Chưa đủ linh lực: cần "+c+".");return}const oldRank=petRank(p,o.lv);S.points-=c;root.GameAnalytics.recordPoints(S,-c,false,today());o.lv++;S.petEvolution={id:p.id,n:p.n,oldRank,newRank:petRank(p,o.lv),lv:o.lv,e:p.e(o.lv)}}
    else if(a==="get"&&P.hl){const g=modGain(petAcc());P.hl.t=Date.now();S.points+=g;root.GameAnalytics.recordPoints(S,g,false,today());hAdd(today(),g,0);say("Linh thú thu hoạch được +"+g+" linh lực.")}
    save();render();
 }
 root.GamePetUI={render,handleClick};
})(typeof window!=="undefined"?window:globalThis);
