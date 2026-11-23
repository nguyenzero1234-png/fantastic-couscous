/* Renderer thống kê: chỉ nhận state và dịch vụ cần thiết qua dependency injection. */
(function(root){
 "use strict";
 function create(deps){
  const {S,$,today,dayStr,GameAnalytics,GameTimeFormat,fold,uxp,ri,RL,rname,EX,exD}=deps;
  const getKD=deps.getKD,getKAge=deps.getKAge,bestKiep=deps.bestKiep;
  let SPD=7,SMT="p";
  function render(){
  const T=today(),days=n=>Array.from({length:n},(_,k)=>dayStr(n-1-k)),H=S.hist,C=S.cnt||{};
  const d7=days(7),d30=days(30),analytics=GameAnalytics.summarize(H,C,{today:T,days7:d7,days30:d30,streak:(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0});
  const {g,sm,sn,mo,mA,pA,bp,bd,ls}=analytics;
  const hr=m=>GameTimeFormat.hoursLabel(m);
  const cards=[["Hôm nay",hr(g(T,"m")),g(T,"p")+" linh lực, "+(C[T]||0)+" nhiệm vụ"],["7 ngày qua",hr(sm(d7,"m")),sm(d7,"p")+" linh lực, "+sn(d7)+" nhiệm vụ"],["30 ngày qua",hr(sm(d30,"m")),sm(d30,"p")+" linh lực, "+sn(d30)+" nhiệm vụ"],["Tháng này",hr(mo.reduce((t,k)=>t+H[k].m,0)),mo.reduce((t,k)=>t+H[k].p,0)+" linh lực"],["Tổng cộng",hr(mA),pA+" linh lực"],["Trung bình 30 ngày",(sm(d30,"m")/1800).toFixed(1)+" giờ/ngày",Math.round(sm(d30,"p")/30)+" linh lực/ngày"],["Ngày tốt nhất",bp+" linh lực",bd||"chưa có"],["Chuỗi ngày học",((S.streak.last===T||S.streak.last===dayStr(1))?S.streak.n:0)+" ngày","kỷ lục "+ls+" ngày"],["Số kiếp",((S.rbh||[]).length)+" đã qua","Đang ở kiếp "+((S.rb||0)+1)+", còn "+Math.max(0,Math.ceil(getKD()-getKAge()))+" ngày"],["Kiếp linh lực cao nhất","Kiếp "+bestKiep().n+": "+bestKiep().pk,bestKiep().cur?"kiếp hiện tại đang dẫn đầu":"đã qua"]];
  const arr=days(SPD).map(d=>({d,v:g(d,SMT==="p"?"p":"m")})),mx=Math.max(1,...arr.map(x=>x.v));
  const bars=arr.map((x,i)=>`<div><span>${SPD===7?(SMT==="p"?x.v:Math.round(x.v/6)/10):""}</span><i style="height:${Math.round(x.v/mx*80)}px"></i><span>${SPD===7||i%5===0?x.d.slice(8):""}</span></div>`).join("");
  const hm=days(35).map(d=>{const m=g(d,"m");return `<i title="${d}: ${m} phút" style="aspect-ratio:1;border-radius:4px;background:${m?"var(--jade)":"var(--line)"};opacity:${m?(0.3+0.7*Math.min(1,m/240)).toFixed(2):1}"></i>`}).join("");
  const x=uxp(),k=ri(x),a7=sm(d7,"p")/7,nx=RL[k+1];
  const fc=nx?(a7>0?`Với nhịp 7 ngày gần nhất (${Math.round(a7)} linh lực/ngày), bạn lên ${nx[0]} sau khoảng ${Math.ceil((nx[1]-x)/a7)} ngày.`:"Học vài buổi để có dự báo lên cảnh giới."):"Bạn đã đạt đỉnh tu vi.";
  const nk=S.sem?EX.filter(e=>!S.sem.res[e.id]).sort((a,b)=>exD(a)-exD(b))[0]:null;
  const nt=nk?`Kiếp kế tiếp: ${nk.n}, còn ${Math.max(0,Math.ceil((exD(nk)-Date.now())/864e5))} ngày, cần tu vi ${RL[nk.need][0]}${k>=nk.need?" (bạn đã đủ)":", còn thiếu "+(RL[nk.need][1]-x)+" linh lực"}.`:"";
  const bt=(a,l,on,at)=>`<button class="btn ${on?"":"alt"}" ${at}>${l}</button>`;
  $("stats").innerHTML=fold("t1","Tổng quan",`<div class="grid2">${cards.map(c=>`<div class="box"><span class="lbl">${c[0]}</span><div class="num" style="font-size:22px">${c[1]}</div><small>${c[2]}</small></div>`).join("")}</div>`,1)
   +fold("t2","Biểu đồ",`<div class="chips">${bt(0,"7 ngày",SPD===7,'data-sp="7"')}${bt(0,"30 ngày",SPD===30,'data-sp="30"')}${bt(0,"Linh lực",SMT==="p",'data-sm="p"')}${bt(0,"Giờ học",SMT==="m",'data-sm="m"')}</div><div class="bars" style="gap:${SPD===7?8:2}px">${bars}</div>`,1)
   +fold("t3","Bản đồ chuyên cần 5 tuần",`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px">${hm}</div><small>Đậm hơn là học nhiều hơn, đầy màu khi đạt 4 giờ.</small>`,0)
   +fold("t4","Dự báo tu vi",`<small>${rname(x)}. ${fc}</small>${nt?`<small style="display:block;margin-top:6px">${nt}</small>`:""}`,1);
}
  function handleClick(e){const b=e.target.closest("[data-sp],[data-sm]");if(!b)return;if(b.dataset.sp)SPD=+b.dataset.sp;if(b.dataset.sm)SMT=b.dataset.sm;render()}
  return Object.freeze({render,handleClick,settings:()=>({days:SPD,metric:SMT})});
 }
 root.GameStatisticsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
