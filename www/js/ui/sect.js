/* UI màn hình tông môn; renderer nhận các hệ thống và dữ liệu qua dependency injection. */
(function(root){
 "use strict";
 function create(deps){
  const {S,sectStats,warScores,ugain,warPairs,warFlavor,SECTS,MASTERS,sectMissions,$}=deps;
  const weekStart=deps.weekStart,EP=deps.weekEnd;
  function render(){
  const now=Date.now(),A=sectStats(now),ord=[0,1,2,3,4,5].sort((a,b)=>A[b].xp/A[b].n-A[a].xp/A[a].n);
  const ws=new Date(weekStart()+"T00:00:00").getTime(),w=Math.round((ws-EP)/6048e5),ps=ws-7*864e5;
  const cur=warScores(ws,now+(S.dOff||0)*864e5,weekStart(),"9999"),prv=warScores(ps,ws,new Date(ps).toLocaleDateString("sv"),weekStart());
  const myContrib=S.sect!=null?Math.round(ugain(weekStart(),"9999")):0;
  const card=(pairs,v,live)=>pairs.map(([a,b])=>{
    const sa=v[a]||0,sb=v[b]||0,t=sa+sb||1,mine=a===S.sect||b===S.sect;
    const lead=sa>=sb?a:b,diff=Math.abs(sa-sb),pct=(sa+sb)>0?Math.round(sa/t*100):50;
    const fl=warFlavor(a,b);
    let st="";
    if(live){
      if(diff<8)st="Ngang ngửa, chưa phân thắng bại";
      else if(lead===S.sect)st="Tông môn bạn đang dẫn trước · "+Math.round(diff)+" điểm";
      else if(mine)st="Tông môn bạn đang bị dẫn · kém "+Math.round(diff)+" điểm";
      else st=SECTS[lead].n+" đang dẫn";
    }else st="Thắng: "+SECTS[lead].n+(diff>=50?" (đại thắng)":diff>=20?" (thắng rõ)":" (thắng sát nút)");
    return `<li class="${mine?"now":""}" style="display:block">
      <div class="row" style="margin:0"><b style="flex:1">${SECTS[a].n}</b><b>${Math.round(sa)}</b></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="row" style="margin:0"><b style="flex:1">${SECTS[b].n}</b><b>${Math.round(sb)}</b></div>
      <small>${fl[0]} — ${fl[1]}</small>
      <small style="display:block;margin-top:2px">${st}</small>
    </li>`}).join("");
  // Bảng xếp hạng theo điểm chiến tuần này
  const warOrd=[0,1,2,3,4,5].sort((a,b)=>cur[b]-cur[a]);
  let h="";
  if(S.sect==null){
    h=`<div class="box"><h2>Bạn chưa có tông môn</h2><small>Gia nhập một tông môn bên dưới. Mỗi tuần tông môn của bạn sẽ đấu với một tông khác. Đóng góp linh lực bằng cách hoàn thành nhiệm vụ — càng học nhiều, tông môn càng mạnh. Thắng nhận thưởng lớn, thua vẫn nhận linh lực an ủi.</small></div>`;
  }else{
    const p=warPairs(w).find(q=>q.includes(S.sect));
    const o=p?(p[0]===S.sect?p[1]:p[0]):null;
    const sa=cur[S.sect]||0,sb=o!=null?cur[o]:0,diff=sa-sb;
    let status="Chưa có đối thủ tuần này.";
    if(o!=null){
      if(diff>15)status="Đang dẫn trước "+SECTS[o].n+" · +"+Math.round(diff)+" điểm. Giữ vững!";
      else if(diff<-15)status="Đang bị "+SECTS[o].n+" dẫn · kém "+Math.round(-diff)+" điểm. Hãy cày thêm nhiệm vụ!";
      else status="Ngang ngửa với "+SECTS[o].n+". Mỗi nhiệm vụ đều có thể lật kèo.";
    }
    const M=MASTERS[S.sect],hasM=S.master===S.sect,canBai=M.ok();
    h=`<div class="box"><span class="lbl">Tông môn của bạn</span><div class="num">${SECTS[S.sect].n}</div>
      <small style="display:block;line-height:1.55;margin-top:4px">${SECTS[S.sect].lore}</small>
      <small style="display:block;margin-top:6px">Hạng tổng ${ord.indexOf(S.sect)+1}/6 · Hạng chiến tuần ${warOrd.indexOf(S.sect)+1}/6</small>
      <small style="display:block;margin-top:4px">Đóng góp tuần này của bạn: <b style="color:var(--gold)">${myContrib}</b> linh lực</small>
      <small style="display:block;margin-top:2px;color:var(--mute)">${status}</small></div>`;
    h+=`<div class="box"><h2>Bái sư</h2>
      <div class="row" style="margin:0"><b style="flex:1">${M.n}</b><span class="pb">${M.title}</span></div>
      <small style="display:block;margin-top:6px;line-height:1.55"><b>Điều kiện:</b> ${M.req}</small>
      <small style="display:block;margin-top:4px;line-height:1.55"><b>Hiệu ứng khi thụ giáo:</b> ${M.buff}</small>
      <small style="display:block;margin-top:4px;color:var(--mute)">Trạng thái: ${M.okTxt()}</small>
      ${hasM
        ?`<small style="display:block;margin-top:8px;color:var(--jade)">Đã bái sư — đang thụ giáo. Buff đang có hiệu lực (xem ô hiệu ứng).</small>
          <div class="row" style="margin-top:8px"><button class="btn alt" style="margin-left:0" data-a="unbai">Hủy bái sư</button></div>
          <small style="display:block;margin-top:4px;color:var(--mute)">Hủy sẽ mất buff ngay. Có thể bái lại khi đủ điều kiện.</small>`
        :`<div class="row" style="margin-top:10px"><button class="btn" style="margin-left:0" data-a="bai" ${canBai?"":"disabled"}>${canBai?"Bái sư ngay":"Chưa đủ điều kiện"}</button></div>`}
    </div>`;
    const sms=sectMissions();
    h+=`<div class="box"><h2>Nhiệm vụ tông · tuần này</h2><small>Hoàn thành để nhận linh lực và đóng góp danh dự tông môn. Làm mới mỗi tuần.</small>`+
      sms.map(m=>{const cur=Math.min(m.met(),m.need),got=S.sm&&S.sm.got[m.id];
        return `<div style="margin-top:10px"><b>${m.n}</b><br><small>${m.d}: ${cur}/${m.need}</small>
          <div class="bar"><i style="width:${Math.round(cur/m.need*100)}%"></i></div>
          <button class="btn" style="margin-left:0;margin-top:4px" data-a="sm" data-id="${m.id}" ${got||cur<m.need?"disabled":""}>${got?"Đã nhận":"Nhận +"+m.r}</button></div>`;
      }).join("")+`</div>`;
  }
  h+=`<div class="box"><h2>Xếp hạng tông môn</h2><small>Theo linh lực bình quân toàn bộ (không chỉ tuần này).</small><ul>${ord.map((s,k)=>`<li class="${s===S.sect?"now":""}"><b style="width:22px">${k+1}</b><div class="nm">${SECTS[s].n}<small>${SECTS[s].d}, ${A[s].n} đệ tử</small></div><b>${Math.round(A[s].xp/A[s].n)}</b>${s===S.sect?"":`<button class="btn alt" data-a="sj" data-id="${s}">${S.sect==null?"Gia nhập":"Chuyển (100 linh lực)"}</button>`}</li>`).join("")}</ul></div>`;
  h+=`<div class="box"><h2>Tông môn chiến tuần này</h2>
    <small>Điểm = linh lực trung bình mỗi đệ tử kiếm được từ thứ Hai đến nay. Tông đông người không được lợi. Học nhiều = đóng góp lớn. Thắng theo biên độ nhận thưởng cao hơn, thắng lớn có cơ hội thêm bảo vật.</small>
    <ul>${card(warPairs(w),cur,true)}</ul></div>`;
  h+=`<div class="box"><h2>Bảng điểm chiến tuần</h2><ul>${warOrd.map((s,k)=>`<li class="${s===S.sect?"now":""}"><b style="width:22px">${k+1}</b><div class="nm">${SECTS[s].n}</div><b>${Math.round(cur[s])}</b></li>`).join("")}</ul></div>`;
  h+=`<div class="box"><h2>Tuần trước</h2><ul>${card(warPairs(w-1),prv,false)}</ul></div>`;
  $("sect").innerHTML=h;
}
  return Object.freeze({render});
 }
 root.GameSectUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
