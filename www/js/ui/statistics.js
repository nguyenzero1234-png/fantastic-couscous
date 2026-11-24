/* Renderer thống kê: chỉ nhận state và dịch vụ cần thiết qua dependency injection. */
(function(root){
 "use strict";
 function create(deps){
  const {S,$,today,dayStr,GameAnalytics,GameTimeFormat,fold,uxp,ri,RL,rname,EX,exD}=deps;
  const getKD=deps.getKD,getKAge=deps.getKAge;
  let SPD=7,SMT="m",selectedDay=null,lastMarkup=null,lastHost=null;
  const num=n=>Number.isFinite(n)?n:0;
  const duration=m=>`${Math.floor(Math.round(Math.max(0,m))/60)} giờ ${Math.round(Math.max(0,m))%60} phút`;
  const delta=n=>`${n>0?"+":""}${n}`;
  function render(){
  const T=today(),days=n=>Array.from({length:n},(_,k)=>dayStr(n-1-k)),H=S.hist,C=S.cnt||{};
  const d7=days(7),d30=days(30),analytics=GameAnalytics.summarize(H,C,{today:T,days7:d7,days30:d30,streak:(S.streak.last===T||S.streak.last===dayStr(1))?(S.streak.n||0):0});
  const {g,sm,sn,mo,mA,pA,bp,bd,ls}=analytics;
  const hr=m=>GameTimeFormat.hoursLabel(m);
  const period=GameAnalytics.reportPeriod(S,days(SPD));
  const previous=GameAnalytics.reportPeriod(S,Array.from({length:SPD},(_,i)=>dayStr(2*SPD-1-i)));
  const cards=[["Hôm nay",duration(g(T,"m")),(C[T]||0)+" nhiệm vụ"],["7 ngày qua",hr(sm(d7,"m")),sn(d7)+" nhiệm vụ"],["30 ngày qua",hr(sm(d30,"m")),sn(d30)+" nhiệm vụ"],["Tháng này",hr(sm(mo,"m")),sn(mo)+" nhiệm vụ"],["Tổng kiếp này",hr(mA),pA+" linh lực lịch sử"],["Trung bình 30 ngày",(sm(d30,"m")/1800).toFixed(1)+" giờ/ngày","Tính cả ngày không học"],["Ngày tốt nhất",bp+" linh lực",bd||"chưa có"],["Chuỗi ngày học",analytics.streak+" ngày","Kỷ lục "+ls+" ngày"]];
  const arr=days(SPD).map(d=>({d,v:g(d,SMT)})),mx=Math.max(1,...arr.map(x=>x.v));
  const activeDay=days(35).includes(selectedDay)?selectedDay:T;
  const detailDay=GameAnalytics.reportPeriod(S,[activeDay]);
  const bars=arr.map(x=>`<button type="button" class="stats-bar" data-stat-day="${x.d}" aria-pressed="${x.d===activeDay}" aria-label="${x.d}: ${x.v} ${SMT==="p"?"linh lực":"phút"}"><span>${SPD===7?x.v:""}</span><i style="height:${Math.round(x.v/mx*80)}px"></i><span>${x.d.slice(8)}</span></button>`).join("");
  const hm=days(35).map(d=>{const m=g(d,"m");return `<button type="button" data-stat-day="${d}" aria-pressed="${d===activeDay}" aria-label="${d}: ${m} phút" style="--heat:${m?(0.3+0.7*Math.min(1,m/240)).toFixed(2):0};">${d.slice(8)}</button>`}).join("");
  const reportSince=S.studyReport?.sinceDay||"chưa có";
  const coverage=days(SPD).some(d=>d<=reportSince)?"Khoảng này có thể thiếu dữ liệu trước hoặc trong ngày bắt đầu ghi nhận.":"";
  const deadlines=period.onTime+period.late;
  const report=`<div class="grid2"><div class="box"><span class="lbl">Tổng thu linh lực</span><div class="num">${period.earned+period.otherEarned}</div><small>Nhiệm vụ ${period.earned} · Khác ${period.otherEarned}</small></div><div class="box"><span class="lbl">Tổng chi linh lực</span><div class="num">${period.leisureCost+period.otherCost}</div><small>Nhàn hạ ${period.leisureCost} · Khác ${period.otherCost}</small></div><div class="box"><span class="lbl">Đã dùng giờ chơi</span><div class="num">${Math.floor(period.play/60)} phút</div></div><div class="box"><span class="lbl">Hoàn thành đúng hạn</span><div class="num">${deadlines?Math.round(period.onTime/deadlines*100)+"%":"—"}</div><small>${period.onTime} đúng hạn · ${period.late} trễ</small></div></div>${period.debugAdded||period.debugRemoved?`<small>Thiên Đạo chỉnh trực tiếp: +${period.debugAdded} / −${period.debugRemoved} linh lực.</small>`:""}<small>Ghi nhận từ ${reportSince}. ${coverage} Tỷ lệ hạn chỉ xét nhiệm vụ có hạn đã hoàn thành. Giờ học là thời lượng nhiệm vụ được ghi nhận; giờ chơi là thời gian timer đã trừ. Thu chi đã tính hoàn tác và hoàn tiền.</small>`;
  const old=(Array.isArray(S.rbh)?S.rbh:[]).filter(r=>r&&Number.isFinite(r.hrs)&&Number.isFinite(r.n));
  const history=old.slice(-5).reverse().map(r=>{const a=r.studyReport?.totals;return `<div class="stats-life"><b>Kiếp ${r.n}</b><span>${hr(r.hrs*60)} · ${num(r.quests)} nhiệm vụ</span><small>${r.days>0?(r.hrs/r.days).toFixed(1)+" giờ/ngày":"—"} · Đỉnh ${num(r.pk)} linh lực</small><small>${a?`Thu ${num(a.earned)+num(a.otherEarned)} · Chi ${num(a.leisureCost)+num(a.otherCost)} · Chơi ${Math.floor(num(a.play)/60)} phút (phần đã ghi nhận)`:"Chưa có sử thu chi"}</small></div>`}).join("");
  const life=`<div class="stats-life"><b>Kiếp ${(S.rb||0)+1} · Hiện tại</b><span>${hr(mA)} · ${Object.values(C).reduce((a,b)=>a+num(b),0)} nhiệm vụ</span><small>Còn ${Math.max(0,Math.ceil(getKD()-getKAge()))} ngày</small></div>${history}<small>Tổng thời gian các kiếp có sử: ${hr(mA+old.reduce((a,r)=>a+r.hrs*60,0))}. Hiển thị 5 kiếp gần nhất.</small>`;
  const x=uxp(),k=ri(x),a7=sm(d7,"p")/7,nx=RL[k+1];
  const fc=nx?(a7>0?`Với nhịp 7 ngày gần nhất (${Math.round(a7)} linh lực/ngày), bạn lên ${nx[0]} sau khoảng ${Math.ceil((nx[1]-x)/a7)} ngày.`:"Học vài buổi để có dự báo lên cảnh giới."):"Bạn đã đạt đỉnh tu vi.";
  const nk=S.sem?EX.filter(e=>!S.sem.res[e.id]).sort((a,b)=>exD(a)-exD(b))[0]:null;
  const nt=nk?`Kiếp kế tiếp: ${nk.n}, còn ${Math.max(0,Math.ceil((exD(nk)-Date.now())/864e5))} ngày, cần tu vi ${RL[nk.need][0]}${k>=nk.need?" (bạn đã đủ)":", còn thiếu "+(RL[nk.need][1]-x)+" linh lực"}.`:"";
  const bt=(a,l,on,at)=>`<button type="button" class="btn ${on?"":"alt"}" aria-pressed="${on}" ${at}>${l}</button>`;
  const host=$("stats");
  const markup=fold("t1","Tổng quan",`<div class="grid2">${cards.map(c=>`<div class="box"><span class="lbl">${c[0]}</span><div class="num" style="font-size:22px">${c[1]}</div><small>${c[2]}</small></div>`).join("")}</div>`,1)
   +fold("t2","Nhịp tu luyện",`<div class="chips">${bt(0,"7 ngày",SPD===7,'data-sp="7"')}${bt(0,"30 ngày",SPD===30,'data-sp="30"')}${bt(0,"Linh lực",SMT==="p",'data-sm="p"')}${bt(0,"Phút học",SMT==="m",'data-sm="m"')}</div><div class="stats-compare"><b>${duration(period.minutes)}</b><small>${delta(period.minutes-previous.minutes)} phút · ${delta(period.tasks-previous.tasks)} nhiệm vụ so với ${SPD} ngày trước</small><small>${period.activeDays}/${SPD} ngày có học</small></div><div class="stats-chart" style="--days:${SPD}">${bars}</div><small>Chọn ngày để xem chi tiết.</small><div class="stats-day"><b>${activeDay.slice(8)}/${activeDay.slice(5,7)}/${activeDay.slice(0,4)}</b> · ${duration(detailDay.minutes)} · ${detailDay.tasks} nhiệm vụ · ${detailDay.historyPoints} linh lực lịch sử</div>`,1)
   +fold("t3","Bản đồ chuyên cần 5 tuần",`<div class="stats-heatmap">${hm}</div><small>Đậm hơn là học nhiều hơn, đầy màu khi đạt 4 giờ.</small><div class="stats-day">${activeDay} · ${duration(detailDay.minutes)}</div>`,0)
   +fold("t7",`Thu chi & thời hạn · ${SPD} ngày`,report,0)
   +fold("t8","Sử luân hồi",life,0)
   +fold("t4","Dự báo tu vi",`<small>${rname(x)}. ${fc}</small>${nt?`<small style="display:block;margin-top:6px">${nt}</small>`:""}`,1);
  if(host!==lastHost||lastMarkup!==markup){
   const scroll=host.querySelector?.(".stats-chart")?.scrollLeft||0;
   const openStates=new Map(Array.from(host.querySelectorAll?.("details[data-k]")||[],node=>[node.dataset.k,node.open]));
   host.innerHTML=markup;
   for(const node of host.querySelectorAll?.("details[data-k]")||[])if(openStates.has(node.dataset.k))node.open=openStates.get(node.dataset.k);
   const chart=host.querySelector?.(".stats-chart");if(chart)chart.scrollLeft=scroll;
   lastHost=host;lastMarkup=markup;
  }
}
  function handleClick(e){const b=e.target.closest("[data-sp],[data-sm],[data-stat-day]");if(!b)return;if(b.dataset.sp)SPD=+b.dataset.sp;if(b.dataset.sm)SMT=b.dataset.sm;if(b.dataset.statDay)selectedDay=b.dataset.statDay;render()}
  return Object.freeze({render,handleClick,settings:()=>({days:SPD,metric:SMT})});
 }
 root.GameStatisticsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
