/* UI thiên kiếp và Mệnh; dữ liệu/công thức nghiệp vụ được tiêm từ systems. */
(function(root){
 "use strict";
 function create(deps){
  const {S,uxp,ri,RL,rname,KD,EX,exD,spA,SPQ,exGod,modGain,RW,EXOPEN,$}=deps;
  function render(){
  const x=uxp(),k=ri(x),lo=RL[k][1],hi=RL[k+1]?RL[k+1][1]:lo+1,p=Math.min(100,Math.round((x-lo)/(hi-lo)*100));
  const menh=S.menh==null?100:S.menh;
  let h=`<div class="box"><span class="lbl">Tu vi của bạn</span><div class="num">${rname(x)}</div><div class="bar"><i style="width:${p}%"></i></div><small>Linh lực ${x}${RL[k+1]?", còn "+(hi-x)+" để lên "+RL[k+1][0]:", Chân Tiên không chia tầng — linh lực tăng không giới hạn đến hết kiếp"}. Linh lực chính là tu vi: tiêu ở Kỳ Bảo điện hay đổi nhàn hạ đều làm tu vi giảm.</small></div>`;
  h+=`<div class="box"><span class="lbl">Mệnh</span><div class="num" style="color:${menh<=20?"var(--red)":menh<=50?"var(--gold)":"inherit"}">${menh}/100</div>
    <div class="bar"><i style="width:${menh}%;background:${menh<=20?"var(--red)":"var(--jade)"}"></i></div>
    <small>Thất bại trừ Mệnh theo sức kiếp; chuỗi fail liên tiếp tăng mức trừ (tối đa ×2,5). Hết Mệnh → Trừng Phạt xếp chồng (−5% mỗi lần, tối đa −30%).${S.tdPenalty?` <b style="color:var(--red)">Đang Trừng Phạt −${Math.min(30,5*Math.max(1,S.tdStacks||1))}%${(S.failStreak||0)>1?" · chuỗi fail "+S.failStreak:""}.</b>`:""}${(S.failStreak||0)>0&&!S.tdPenalty?` Chuỗi fail hiện: ${S.failStreak}.`:""}</small></div>`;
  h+=`<div class="box"><small>Thiên kiếp giáng theo ngày trong kiếp hiện tại (tối đa ${KD} ngày): ngày ${EX.map(e=>e.day).join(", ")}. Mỗi thiên kiếp là cửa ải viên mãn một cảnh giới để thăng lên cảnh giới kế. Khi đến hạn sẽ hiện bảng bắt buộc xác nhận. Thất bại trừ Mệnh theo sức mạnh kiếp.</small></div>`;
  EX.forEach(e=>{
    const d=exD(e),r=S.sem&&S.sem.res[e.id];
    const predLoss=Math.round(8*e.w)+5,sk=(spA()&&S.sp.ex===e.id)?S.sp.k:-1,fk=sk===2?SPQ[2].f:1;
    h+=`<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${e.n}</h2><span class="pb">Ngày ${e.day}</span></div><small>${e.kind}. ${d.toLocaleDateString("vi-VN")}, viên mãn ${RL[e.need][0]} → thăng ${RL[e.need+1][0]}</small>${exGod(e)}<small style="display:block;margin-top:4px;line-height:1.5;color:var(--mute)">${e.desc}</small>`;
    if(!r){
      h+=`<small style="display:block;margin-top:6px">Còn ${Math.max(0,Math.ceil((d-Date.now())/864e5))} ngày. ${ri(x/fk)>=e.need?"Bạn đã đủ tu vi độ kiếp.":"Bạn chưa đủ tu vi, cần thêm "+(Math.ceil(RL[e.need][1]*fk)-x)+" linh lực."}${sk>=0?` <b style="color:var(--gold)">${SPQ[sk].n}: ${SPQ[sk].pd}.</b>`:""} Nếu thất bại sẽ trừ khoảng ${Math.round(8*e.w)}–${predLoss} Mệnh.</small><div class="row"><button class="btn alt" data-a="xm" data-id="${e.id}" style="margin-left:0">Diễn kiếp</button></div></div>`;
    }else{
      const me=r.rows.find(z=>z.u);
      const ml=r.menhLoss||0;
      h+=`<div class="row"><b style="font-size:28px">${me.s}</b><span class="pb">${me.g}</span><small>Hạng ${r.rows.indexOf(me)+1}/${r.rows.length}, ${rname(me.xp)}${me.ok?"":", chưa đủ tu vi nên không nhận thưởng"}${ml?`, <b style="color:var(--red)">trừ ${ml} Mệnh</b>`:""}</small>${me.ok&&!r.claimed?`<button class="btn" data-a="xc" data-id="${e.id}">Nhận ${modGain(RW[me.g]*e.w)} linh lực</button>`:r.claimed?"<small>Đã nhận thưởng</small>":""}</div><ul class="exl${EXOPEN[e.id]?" open":""}" style="margin-top:8px">${r.rows.map((z,i)=>`<li class="${z.u?"now":z.ok?"":"lock"}${(i>=10&&!z.u)?" more":""}"><b style="width:22px">${i+1}</b><div class="nm">${z.n}<small>${rname(z.xp)}</small>${z.sp>=0?`<small style="color:var(--gold)">${SPQ[z.sp].n}</small>`:""}</div><b>${z.s}</b><span class="pb">${z.g}</span></li>`).join("")}</ul>${r.rows.length>10?`<button class="btn alt" data-a="xl" data-id="${e.id}" style="margin-left:0;margin-top:6px">${EXOPEN[e.id]?"Thu gọn":"Xem đủ "+r.rows.length+" người"}</button>`:""}</div>`;
    }
  });
  h+=`<div class="box"><small>Thang 100 điểm: Xuất sắc từ 90, Giỏi 80 đến 89, Khá 65 đến 79, Trung bình 50 đến 64, Yếu dưới 50. NPC có công thức riêng, chỉ dựa vào linh lực (không có đạo tâm): đạt 100 khi linh lực ≥ mốc viên mãn của kiếp đó. Điểm của bạn gồm phần linh lực (so với mốc viên mãn của cảnh giới đó — cũng là mức NPC trung bình đạt được vào ngày giáng kiếp) và đạo tâm (chuỗi ngày học liên tục; kiếp càng cuối càng đòi chuỗi dài); mỗi kiếp chia tỉ trọng khác nhau. Đạo tâm chỉ cộng tối đa từ 2 điểm (kiếp đầu) đến 10 điểm (kiếp khó), phần còn lại đến từ linh lực. Chưa đủ tu vi hoặc đạt mức Yếu → trừ Mệnh theo hệ số kiếp (không trừ linh lực trực tiếp). Hết Mệnh sẽ chịu Thiên Đạo Trừng Phạt (−5% mọi nguồn linh lực). Muốn ân xá: hoàn thành kiếp viên mãn và mọi thiên kiếp từ Khá trở lên.</small></div>`;
  $("exams").innerHTML=h;
}
  return Object.freeze({render});
 }
 root.GameTribulationUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
