/* UI Thiên Kiêu Bảng; ranking data và profile rendering được tiêm từ bootstrap. */
(function(root){
 "use strict";
 function create(deps){
  const {S,B,sc,lbInit,BAL_RANK,BAL_MULT,SECTS,SO,rname,uxp,bxp,spark,AVATARS,KD,$}=deps;
  const esc=deps.escapeHtml,portrait=deps.portrait,isTK=deps.isTopCultivator,renderProf=deps.renderProfile;
  const getKAge=deps.getKAge,getCurStreak=deps.getCurStreak;
  let showAll=false,PV={};
  function render(){
  lbInit();
  const t=Date.now(),rows=B.map((b,i)=>({i,n:b.n,s:sc(i,t)}));rows.push({u:1,n:S.name||"Bạn",s:S.points});
  rows.sort((a,b)=>b.s-a.s);
  const me=rows.findIndex(r=>r.u)+1,last=rows[rows.length-1];
  const nx=new Date();nx.setHours(0,0,0,0);nx.setDate(nx.getDate()+((8-nx.getDay())%7||7));
  const ms=nx-t;
  const balOn=me>=BAL_RANK;
  let h=`<span class="lbl">Thứ hạng của bạn</span><div class="num">${me}/${rows.length}</div><small>Chốt bảng sau ${Math.floor(ms/864e5)} ngày ${Math.floor(ms%864e5/36e5)} giờ.</small>`;
  h+=`<small style="display:block;margin-top:6px"><b>Thiên Đạo Cân Bằng:</b> hạng ${BAL_RANK} trở xuống nhận buff tốc độ (bạn +${Math.round((BAL_MULT-1)*100)}% linh lực nhận; NPC +~12% linh lực cân bằng mỗi tuần). Mục tiêu: dễ chen vào top ${BAL_RANK-1}. Không còn phạt đứng cuối.</small>`;
  if(balOn)h+=`<small style="display:block;margin-top:6px;color:var(--jade)">Bạn đang trong vùng Cân Bằng (hạng ${me}) — mọi nguồn linh lực ×${BAL_MULT}.</small>`;
  else h+=`<small style="display:block;margin-top:6px">Bạn đã vào top ${BAL_RANK-1}; buff Cân Bằng tắt. Đứng cuối hiện: ${last.n}.</small>`;
  if(S.lb.log)h+=`<small style="display:block;margin-top:6px">${esc(S.lb.log)}</small>`;
  $("lbhead").innerHTML=h;
  $("lbgod").hidden=!S.god;if(S.god)$("lbgodi").textContent="Ngày "+Math.floor(getKAge())+"/"+KD+" · chuỗi "+getCurStreak();
  $("lb").innerHTML=rows.map((r,k)=>{if(!showAll&&k>=20&&!r.u)return "";const b=B[r.i],p=PV[r.n],d=p==null?0:r.s-p;PV[r.n]=r.s;
    const ar=Math.abs(d)<.05?"":`<small style="display:block;color:${d>0?"var(--jade)":"var(--red)"}">${d>0?"▲":"▼"} ${Math.abs(d).toFixed(1)}</small>`;
    const balMark=!r.u&&k+1>=BAL_RANK?` · <span style="color:var(--jade)">Cân Bằng</span>`:(r.u&&balOn?` · <span style="color:var(--jade)">Cân Bằng ×${BAL_MULT}</span>`:"");
    const avHtml=r.u?`<span style="width:36px;height:36px;flex:none;overflow:hidden;border-radius:50%">${portrait(S.name,{player:1,w:36,h:36})}</span>`:(AVATARS[r.n]?`<span style="width:36px;height:36px;flex:none;overflow:hidden;border-radius:50%">${portrait(r.n,{w:36,h:36})}</span>`:"");
    return `<li data-pi="${r.u?-1:r.i}" style="cursor:pointer" class="${r.u?"now":(isTK(r.i)?"tkf":"")}"><b style="width:22px">${k+1}</b>${avHtml}<div class="nm">${r.n}<small>${r.u?"Linh lực hiện có":b.t+", +"+Math.round(b.b*100)+"% tốc độ"}${balMark}</small><small>${r.u?(S.sect!=null?SECTS[S.sect].n:"Chưa có tông môn"):SECTS[SO[r.i]].n}, ${rname(r.u?uxp():bxp(r.i,t))}</small>${r.u?"":`<small>${b.d}</small>`}</div>${r.u?"":spark(r.i,t)}<div style="text-align:right;min-width:64px"><b>${r.u?r.s:r.s.toFixed(1)}</b>${ar}</div></li>`}).join("");
  renderProf();
}
const rn=x=>x.qid&&sq(x)?sq(x).name:x.label;
  function toggleAll(){showAll=!showAll;$("lball").textContent=showAll?"Chỉ hiện top 20":"Hiện tất cả";render()}
  return Object.freeze({render,toggleAll,settings:()=>({showAll})});
 }
 root.GameLeaderboardUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
