/* Profile UI: render hồ sơ người chơi/NPC và lịch sử tu vi. */
(function(root){
 "use strict";
 function create(deps){
  const {S,B,SO,SECTS,TITLES,BH,SP,CDN,HTC,NVC_TITLES,RL,STG,$,uxp,bxp,ri,tok,bio,myRk,rkNow,portrait,isTK,esc,htCount,htLate,hrs,miles,fmtT,rname}=deps;
  const RC=deps.realmColors,QT=deps.quotes,document=deps.document,getPrevMemory=deps.prevMemory,KD=deps.days,kAge=deps.getKAge;
  function renderProf(){
    const PI=deps.getProfileIndex ? deps.getProfileIndex() : selectedIndex;
  const el=$("prof");if(PI==null){el.innerHTML="";return}
  const u=PI<0,i=PI,now=Date.now(),n0=Math.floor((now-S.lb.t0)/36e5),b=u?null:B[i],xp=u?uxp():bxp(i,now),k=ri(xp);
  const sect=u?(S.sect!=null?SECTS[S.sect].n:"Chưa gia nhập tông môn"):SECTS[SO[i]].n;
  const bt=u?"Nguyên Lưu Chi Chủ, kẻ xuyên không đứng ngoài vòng vận mệnh, thân phận thần bí, thực lực khủng bố, khiến cả thiên kiêu cũng phải kiêng dè"+(TITLES.some(t=>t.id===S.title&&tok(t))?", mang danh hiệu "+TITLES.find(t=>t.id===S.title).n:"")+".":bio(i);
  const rankTxt=u?("Hạng "+myRk()+" trên Thiên Kiêu Bảng"):("Hạng "+rkNow(i)+" trên Thiên Kiêu Bảng");
  const nm=u?(S.name||"Bạn"):b.n;
  const avP=u?portrait(nm,{player:1,w:56,h:56}):portrait(nm,{w:56,h:56}),tk=!u&&isTK(i);
  const talentHtml=tk&&b&&b.d?(()=>{const parts=b.d.split(" — "),name=parts.shift(),desc=parts.join(" — ");return `<section class="prof-talent" aria-label="Thiên phú"><div class="prof-talent-tag">✦ THIÊN PHÚ ĐỘC NHẤT</div><h3>${esc(name)}</h3><p>${esc(desc||"Thiên phú chưa được ghi chép.")}</p></section>`})():"";
  const htHtml=(!u&&BH[i].ht)?(()=>{const t=Math.max(0,(now-S.lb.t0)/SP/60),c=htCount(i,t);return `<section class="prof-talent" aria-label="Cơ duyên đã đạt"><div class="prof-talent-tag">✦ CƠ DUYÊN ĐÃ ĐẠT</div><h3>Bách Gia Hội Tụ: ${c}/9 loại · +${Math.round((c*2+htLate(t)*100)*10)/10}% hiệu suất</h3><ul style="list-style:none;padding:0;margin:8px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px">${CDN.map((n,k)=>{const f=HTC.f[k],got=f<=t;return `<li style="${got?"color:var(--gold)":"opacity:.5"}">${got?"✔":"○"} ${esc(n)}${got?` <small>(ngày ${Math.floor(f/24)+1})</small>`:""}</li>`}).join("")}</ul>${c>=9?`<p style="margin-top:8px">Đã gặp đủ 9 loại, nhận 50.000 linh lực thưởng. Vạn Hóa Quy Nhất đang tăng: +${Math.round(htLate(t)*1000)/10}% (tối đa +20%).</p>`:""}</section>`})():"";
  const world=deps.world,dialogue=!u&&world?world.dialogue(i):null;
  const worldHtml=dialogue?`<section class="prof-dialogue"><h3 class="prof-section-title">Vấn đạo · ${esc(dialogue.trait)}</h3><p class="prof-copy">«${esc(dialogue.line)}»</p><button class="btn alt" data-a="npc-talk" ${world.canRecord()?"":"disabled"}>${world.canRecord()?"Ghi vào Đạo Văn":"Đã ghi lời vấn đạo hôm nay"}</button></section>`:"";
  el.innerHTML=`<div class="box prof-card" style="margin-bottom:14px"><div class="row prof-head${u?" player-frame":tk?" tkf tkh":""}" style="margin:0;align-items:flex-start">${avP}<div class="prof-head-info" style="flex:1;min-width:0"><h2 style="margin:0">${esc(nm)}</h2><small>${u?"":b.t+", "}${sect} · ${rankTxt}</small></div><button class="del" data-a="pc" aria-label="Đóng">×</button></div><div class="num prof-realm">${rname(xp)}</div>${u?`<small style="display:block;margin:2px 0 4px;letter-spacing:.04em">«${NVC_TITLES[k]}»</small>`:""}<small>Linh lực ${Math.round(xp)}${u?"":", giờ học "+hrs(i,n0).toFixed(1)+" giờ/ngày"}</small>${worldHtml}<section class="prof-bio"><h3 class="prof-section-title">Tiểu sử</h3><p class="prof-copy">${esc(bt)}</p></section>${talentHtml}${htHtml}<p class="prof-rank-note">${esc(STG[k])}</p><h3 class="prof-section-title">Lịch sử tu vi</h3><ul class="prof-history">${miles(PI).map(m=>`<li><div class="nm">${RL[m[0]][0]}<small>${fmtT(m[1])}</small></div></li>`).join("")||`<li class="empty" style="display:block">Chưa có mốc nào.</li>`}</ul></div>`;
  }
  function renderHero(){
   const prevMemory=getPrevMemory;
  const x=uxp(),k=ri(x),lo=RL[k][1],hi=RL[k+1]?RL[k+1][1]:lo+1,p=Math.min(1,(x-lo)/(hi-lo)),C=2*Math.PI*52;
  const dn=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5),ttl=TITLES.find(t=>t.id===S.title&&tok(t));
  document.documentElement.style.setProperty("--aura",RC[k]);
  const menh=S.menh==null?100:S.menh;
  const mem=prevMemory();
  if(myRk()<=10){S.life=S.life||{};S.life.top10=1}
  $("hero").innerHTML=`<div class="hero"><div class="av">${portrait(S.name,{player:1,w:56,h:56})}</div><div class="ring"><svg viewBox="0 0 120 120"><circle class="rb" cx="60" cy="60" r="52"/><circle class="rf" cx="60" cy="60" r="52" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-p)).toFixed(1)}"/></svg><div class="hc"><div class="rn">${RL[k][0]}</div><div class="rt">${RL[k+1]?"tầng "+Math.min(9,Math.floor(p*9)+1):"vô cực"}</div></div></div><div class="hi"><b style="font-size:18px">${esc(S.name||"Đệ tử")}</b><br><small>${rname(x)} · Kiếp ${(S.rb||0)+1}${ttl?" · "+ttl.n:""}</small><br><small>Ngày ${Math.min(KD,Math.floor(kAge())+1)}/${KD} của kiếp · Mệnh ${menh}/100${S.tdPenalty?` · <span style="color:var(--red)">Trừng Phạt −${Math.min(30,5*Math.max(1,S.tdStacks||1))}%</span>`:""}${(S.failStreak||0)>1?` · fail×${S.failStreak}`:""}</small><br><small>${S.sect!=null?SECTS[S.sect].n:"Chưa vào tông môn"}, Hạng ${myRk()} trên Thiên Kiêu Bảng</small><br><small>Linh lực ${x}${RL[k+1]?" / "+hi:""}</small>${mem?`<small style="display:block;margin-top:4px;opacity:.85;font-style:italic">${mem}</small>`:""}<div class="qt">${QT[Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/36e5)%QT.length]}</div></div></div>`;
}
  let selectedIndex=null;
  function resetSelection(){selectedIndex=null}
  function bindSelection(){
    $("lb").onclick=event=>{
      const row=event.target.closest("li[data-pi]");
      if(!row)return;
      selectedIndex=Number(row.dataset.pi);
      renderProf();
      $("prof").scrollIntoView({behavior:"smooth",block:"nearest"});
    };
    $("prof").onclick=event=>{
      if(event.target.closest("[data-a=pc]")){
        resetSelection();
        renderProf();
        return;
      }
      if(selectedIndex!==null&&selectedIndex>=0&&event.target.closest("[data-a=npc-talk]")&&deps.world?.record(selectedIndex))renderProf();
    };
  }
  return Object.freeze({render:renderProf,renderHero,bindSelection,resetSelection});
 }
 root.GameProfileUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
