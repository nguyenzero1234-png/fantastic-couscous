(function(root){
 function show(d,e){
  const S=d.state,r=S.sem&&S.sem.res[e.id],me=r&&r.rows.find(z=>z.u),ml=r&&r.menhLoss?r.menhLoss:0;
  const host=d.document.getElementById("thd");
  host.innerHTML='<div class="box" style="border-color:var(--gold)"><h2>Thiên Kiếp Giáng Lâm</h2><small>Ngày thứ '+e.day+' của kiếp · '+e.n+'</small><p style="margin:12px 0;line-height:1.65">'+e.desc+'</p><p style="margin:10px 0;line-height:1.65"><b>'+e.kind+'</b><br>Viên mãn '+d.realmLabels[e.need][0]+' → thăng '+d.realmLabels[e.need+1][0]+' · Hệ số ×'+e.w+'</p>'+d.exGod(e)+(me?'<p style="margin:10px 0">Kết quả của ngươi: <b>'+me.s+' điểm — '+me.g+'</b>'+(me.st!=null?' <small>(chuỗi học '+me.st+' ngày)</small>':'')+(me.ok?'':' (chưa đủ tu vi)')+(ml?' · <span style="color:var(--red)">Trừ '+ml+' Mệnh</span>':'')+'</p>':'')+'<p style="margin:10px 0;color:var(--mute);font-size:14px">Phải xác nhận đã đối diện thiên kiếp này trước khi tiếp tục tu luyện. Sau đó sẽ chuyển tới tab Thiên kiếp để xem bảng và nhận thưởng (nếu đủ điều kiện).</p><div class="row"><button class="btn" style="margin-left:0" id="exok">Kính nhận thiên kiếp</button></div></div>';
  host.hidden=false;d.body.style.pointerEvents="none";host.style.pointerEvents="auto";
  d.document.getElementById("exok").onclick=()=>{if(S.sem&&S.sem.res[e.id])S.sem.res[e.id].seen=true;S.exLock=null;d.save();host.hidden=true;d.body.style.pointerEvents="";const next=d.findNext();if(next){S.exLock=next.id;d.setTimeout(()=>show(d,next),200)}else{d.go("w","x");d.render()}};
 }
 root.GameExamModal={show};
})(typeof window!=="undefined"?window:globalThis);
