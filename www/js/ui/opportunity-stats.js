/* UI bảng thống kê cơ duyên (Vạn Sự Điện). Trả về chuỗi HTML; dữ liệu được tiêm qua dependency injection. */
(function(root){
 "use strict";
 function create(deps){
  const {S,B,EX,KN,KX,CDN,SPQ,evAt,knAt,KS,KT0,spA}=deps;
  const getKD=deps.getKD,getKSALT=deps.getKSALT;
  const CDE=["+giờ học/ngày trong thời gian cơ duyên","hiệu suất ×1,25 đến ×1,60","cộng thẳng linh lực (60×(1+hệ số)×2 đến 6)","biến động còn 35%, +0,5× giờ học","cộng thẳng khoảng 2% linh lực (tối thiểu 150)","+giờ học/ngày, kéo dài gấp đôi","hiệu suất ×1,30 và +1 giờ học/ngày","hiệu suất ×1,40 nhưng biến động ×2,5","cộng thẳng 500 đến 3.000 linh lực"];
  let SPC=null;
  function html(){
   const KD=getKD(),KSALT=getKSALT();

  const now=Date.now(),H=36e5,n0=Math.min(24*KD,Math.max(0,Math.floor((now-S.lb.t0)/H)));
  if(!SPC||SPC.n0!==n0||SPC.t0!==S.lb.t0||SPC.k!==KSALT){
    const cn=Array(9).fill(0);
    for(let i=0;i<B.length;i++)for(let m=0;m<=n0;m++){const e=evAt(i,m);if(e&&S.lb.t0+(e.m+e.ph)*H<=now)cn[e.k]++}
    SPC={n0,t0:S.lb.t0,k:KSALT,cn};
  }
  const h1=Math.floor((now-KT0)/H),h0=Math.max(0,Math.floor((KS().start-KT0)/H)),pn=Array(KN.length).fill(0),pg=Array(KN.length).fill(0);
  for(let h=h0;h<=h1;h++){const o=knAt(h);if(o&&o.st<=now){pn[o.k]++;if(S.claimed["o:"+h])pg[o.k]++}}
  const spl=S.lb.spl||[],cnt=(k,u)=>spl.filter(x=>x.k===k&&!!x.u===!!u).length;
  const T=(head,rows)=>`<div style="overflow-x:auto;margin-top:6px"><table style="width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.45"><thead><tr>${head.map(x=>`<th style="text-align:left;white-space:nowrap;padding:4px 6px;border-bottom:1px solid var(--mute)">${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td style="padding:4px 6px;border-bottom:1px solid rgba(128,128,128,.25);vertical-align:top">${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const hold=[];const ps=spA();if(ps)hold.push("Bạn: "+SPQ[ps.k].n+" (đến "+((EX.find(z=>z.id===ps.ex)||{}).n||"thiên kiếp kế tiếp")+")");
  for(const k in (S.lb.sp||{})){const p=S.lb.sp[k];hold.push(B[+k].n+": "+SPQ[p.k].n+" (đến "+((EX.find(z=>z.id===p.ex)||{}).n||"thiên kiếp kế tiếp")+")")}
  let h=`<div class="box"><h2>Bảng thống kê cơ duyên</h2><small>Số liệu tính từ đầu kiếp hiện tại. Có ba nhóm: cơ duyên đặc biệt cho 3 hạng cuối, cơ duyên của NPC và kỳ ngộ của người chơi.</small>`;
  h+=`<b style="display:block;margin-top:10px;font-size:13px;color:var(--gold)">1. Cơ duyên đặc biệt (chỉ 3 hạng cuối, cả NPC lẫn người chơi)</b><small>Mỗi lần chốt bảng tuần, mỗi nhân vật đứng 3 hạng cuối quay một lần: 20% mỗi loại, 40% không trúng. Không ai giữ hai cơ duyên này cùng lúc. Hiệu lực chỉ riêng người đó, kéo dài đến thiên kiếp kế tiếp.</small>`;
  h+=T(["Cơ duyên","Người chơi","NPC","Tỉ lệ","NPC nhận","Bạn nhận"],SPQ.map((q,k)=>[`<b>${q.n}</b>`,q.pd,q.nd,Math.round(q.p*100)+"%",cnt(k,0),cnt(k,1)]));
  h+=`<small style="display:block;margin-top:6px">Đang hiệu lực: ${hold.length?hold.join("; "):"chưa có ai."}</small>`;
  h+=`<b style="display:block;margin-top:14px;font-size:13px;color:var(--gold)">2. Cơ duyên của NPC (${CDN.length} loại)</b><small>Mỗi NPC gặp trung bình 0,5 đến 3 lần mỗi ngày (hạng càng thấp càng dễ gặp). Khi cơ duyên xuất hiện, mỗi loại có xác suất 1/${CDN.length}.</small>`;
  h+=T(["Cơ duyên","Hiệu ứng","Tỉ lệ","Số lần (mọi NPC)"],CDN.map((n,k)=>[`<b>${n}</b>`,CDE[k],"1/"+CDN.length,SPC.cn[k]]));
  h+=`<b style="display:block;margin-top:14px;font-size:13px;color:var(--gold)">3. Kỳ ngộ của người chơi (${KN.length} loại)</b><small>Mỗi giờ có khoảng 6% xuất hiện một kỳ ngộ (khoảng 1 đến 2 lần mỗi ngày). Mỗi loại có xác suất 1/${KN.length}. Cần học đủ số phút trong khung giờ để nhận.</small>`;
  h+=T(["Kỳ ngộ","Thưởng thêm","Tỉ lệ","Đã xuất hiện","Đã nhận"],KN.map((q,k)=>[`<b>${q[0]}</b>`,KX[k]+(q[2]!==1?" (thưởng gốc ×"+String(q[2]).replace(".",",")+")":""),"1/"+KN.length,pn[k],pg[k]]));
  return h+`</div>`;
  }
  return Object.freeze({html});
 }
 root.GameOpportunityStatsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
