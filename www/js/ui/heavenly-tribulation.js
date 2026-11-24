/* UI thiên kiếp và Mệnh; dữ liệu/công thức nghiệp vụ được tiêm từ systems. */
(function(root){
 "use strict";
 function create(deps){
  const {S,uxp,ri,RL,rname,KD,EX,exD,spA,SPQ,exGod,modGain,RW,$}=deps;
  const EXOPEN=deps.EXOPEN||{};
  const today=deps.today,weekStart=deps.weekStart,kmet=deps.kmet,kAge=deps.kAge,kEnd=deps.kEnd,KS=deps.KS,bk=deps.bestKiep,fold=deps.fold,doRebirth=deps.doRebirth,say=deps.say,document=deps.document,Blob=deps.Blob,URL=deps.URL,prompt=deps.prompt;
  function render(){
  const x=uxp(),k=ri(x),lo=RL[k][1],hi=RL[k+1]?RL[k+1][1]:lo+1,p=Math.min(100,Math.round((x-lo)/(hi-lo)*100));
  const menh=S.menh==null?100:S.menh;
  let h=`<div class="box"><span class="lbl">Tu vi của bạn</span><div class="num">${rname(x)}</div><div class="bar"><i style="width:${p}%"></i></div><small>Linh lực ${x}${RL[k+1]?", còn "+(hi-x)+" để lên "+RL[k+1][0]:", Chân Tiên không chia tầng — linh lực tăng không giới hạn đến hết kiếp"}. Linh lực chính là tu vi: tiêu ở Kỳ Bảo điện hay đổi nhàn hạ đều làm tu vi giảm.</small></div>`;
  h+=`<div class="box"><span class="lbl">Mệnh</span><div class="num" style="color:${menh<=20?"var(--red)":menh<=50?"var(--gold)":"inherit"}">${menh}/100</div>
    <div class="bar"><i style="width:${menh}%;background:${menh<=20?"var(--red)":"var(--jade)"}"></i></div>
    <small>Thất bại trừ Mệnh theo sức kiếp; chuỗi fail liên tiếp tăng mức trừ (tối đa ×2,5). Hết Mệnh → Trừng Phạt xếp chồng (−5% mỗi lần, tối đa −30%).${S.tdPenalty?` <b style="color:var(--red)">Đang Trừng Phạt −${Math.min(30,5*Math.max(1,S.tdStacks||1))}%${(S.failStreak||0)>1?" · chuỗi fail "+S.failStreak:""}.</b>`:""}${(S.failStreak||0)>0&&!S.tdPenalty?` Chuỗi fail hiện: ${S.failStreak}.`:""}</small></div>`;
  if(S.menhRecovery){const days=root.GameTribulationSystem.recoveryProgress(S,today());h+=`<div class="box"><h2>Tĩnh Tâm Dưỡng Mệnh</h2><small>Thiên lôi lưu thương, lấy chuyên cần dưỡng lại bản nguyên. Sau lần thất bại gần nhất, tu luyện ít nhất 60 phút mỗi ngày trong 3 ngày riêng biệt. Hồi 15 Mệnh một lần, Trừng Phạt và chuỗi thất bại vẫn được giữ.</small><div class="row"><b>${S.menhRecovery.claimed?"Đã viên mãn":Math.min(3,days)+"/3 ngày"}</b><button class="btn" data-a="xr" ${S.menhRecovery.claimed||days<3?"disabled":""}>Dưỡng Mệnh</button></div></div>`}
  h+=`<div class="box"><small>Thiên kiếp giáng theo ngày trong kiếp hiện tại (tối đa ${S.cycleDays||KD} ngày): ngày ${EX.map(e=>e.day).join(", ")}. Mỗi thiên kiếp là cửa ải viên mãn một cảnh giới để thăng lên cảnh giới kế. Khi đến hạn sẽ hiện bảng bắt buộc xác nhận. Thất bại trừ Mệnh theo sức mạnh kiếp.</small></div>`;
  EX.forEach(e=>{
    const d=exD(e),r=S.sem&&S.sem.res[e.id];
    const penaltyMultiplier=Math.min(2.5,1+0.25*(S.failStreak||0)),predLoss=Math.round((10*e.w+6)*penaltyMultiplier),sk=(spA()&&S.sp.ex===e.id)?S.sp.k:-1,fk=sk===2?SPQ[2].f:1;
    h+=`<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${e.n}</h2><span class="pb">Ngày ${e.day}</span></div><small>${e.kind}. ${d.toLocaleDateString("vi-VN")}, viên mãn ${RL[e.need][0]} → thăng ${RL[e.need+1][0]}</small>${exGod(e)}<small style="display:block;margin-top:4px;line-height:1.5;color:var(--mute)">${e.desc}</small>`;
    if(!r){
      h+=`<small style="display:block;margin-top:6px">Còn ${Math.max(0,Math.ceil((d-Date.now())/864e5))} ngày. ${ri(x/fk)>=e.need?"Bạn đã đủ tu vi độ kiếp.":"Bạn chưa đủ tu vi, cần thêm "+(Math.ceil(RL[e.need][1]*fk)-x)+" linh lực."}${sk>=0?` <b style="color:var(--gold)">${SPQ[sk].n}: ${SPQ[sk].pd}.</b>`:""} Nếu thất bại sẽ trừ khoảng ${Math.round(10*e.w*penaltyMultiplier)}–${predLoss} Mệnh.</small><div class="row"><button class="btn alt" data-a="xm" data-id="${e.id}" style="margin-left:0">Diễn kiếp</button></div></div>`;
    }else{
      const me=r.rows.find(z=>z.u);
      const ml=r.menhLoss||0;
      h+=`<div class="row"><b style="font-size:28px">${me.s}</b><span class="pb">${me.g}</span><small>Hạng ${r.rows.indexOf(me)+1}/${r.rows.length}, ${rname(me.xp)}${me.ok?"":", chưa đủ tu vi nên không nhận thưởng"}${ml?`, <b style="color:var(--red)">trừ ${ml} Mệnh</b>`:""}</small>${me.ok&&me.g!=="Yếu"&&!r.claimed?`<button class="btn" data-a="xc" data-id="${e.id}">Nhận ${modGain(RW[me.g]*e.w)} linh lực</button>`:r.claimed?"<small>Đã nhận thưởng</small>":""}</div><ul class="exl${EXOPEN[e.id]?" open":""}" style="margin-top:8px">${r.rows.map((z,i)=>`<li class="${z.u?"now":z.ok?"":"lock"}${(i>=10&&!z.u)?" more":""}"><b style="width:22px">${i+1}</b><div class="nm">${z.n}<small>${rname(z.xp)}</small>${z.sp>=0?`<small style="color:var(--gold)">${SPQ[z.sp].n}</small>`:""}</div><b>${z.s}</b><span class="pb">${z.g}</span></li>`).join("")}</ul>${r.rows.length>10?`<button class="btn alt" data-a="xl" data-id="${e.id}" style="margin-left:0;margin-top:6px">${EXOPEN[e.id]?"Thu gọn":"Xem đủ "+r.rows.length+" người"}</button>`:""}</div>`;
    }
  });
  h+=`<div class="box"><small>Thang 100 điểm: Xuất sắc từ 90, Giỏi 80 đến 89, Khá 65 đến 79, Trung bình 50 đến 64, Yếu dưới 50. NPC có công thức riêng, chỉ dựa vào linh lực (không có đạo tâm): đạt 100 khi linh lực ≥ mốc viên mãn của kiếp đó. Điểm của bạn gồm 70–80 điểm linh lực và 20–30 điểm đạo tâm (chuỗi ngày học liên tục; kiếp càng cuối càng đòi chuỗi dài). Chưa đủ tu vi hoặc đạt mức Yếu → trừ Mệnh theo hệ số kiếp. Hết Mệnh sẽ chịu Thiên Đạo Trừng Phạt (−5% mỗi tầng, tối đa −30% mọi nguồn linh lực). Muốn ân xá: hoàn thành kiếp viên mãn và mọi thiên kiếp từ Khá trở lên.</small></div>`;
  $("exams").innerHTML=h;
}
  function renderKiep(){
  const {daily,weekly}=root.GameTribulationSystem.trialRows(S,today(),weekStart(),ri(uxp()),kmet),KC=S.kc||(S.kc={});
  const row=({name:n,target:T,reward:r,unit:u,key,progress})=>{const cur=Math.min(progress,T),ok=progress>=T;
    return `<li style="display:block"><div class="row" style="margin:0"><b style="flex:1">${n}</b><span class="pb">+${r}</span></div><small>${cur}/${T} ${u}</small><div class="bar"><i style="width:${Math.round(cur/T*100)}%"></i></div><div class="row" style="margin:0"><button class="btn" style="margin-left:auto" data-k="${key}" ${KC[key]||!ok?"disabled":""}>${KC[key]?"Đã vượt kiếp":"Độ kiếp"}</button></div></li>`};
  $("kiep").innerHTML=`<div class="box"><h2>Nhật Kiếp</h2><small>Đổi mỗi ngày, độ khó tăng theo cảnh giới. Vượt đủ ba kiếp được thêm 30 linh lực.</small><ul>${daily.map(row).join("")}</ul></div><div class="box"><h2>Tuần Kiếp</h2><small>Đổi vào thứ Hai. Vượt đủ ba kiếp được 1 Tỉnh Thần Linh Trà.</small><ul>${weekly.map(row).join("")}</ul></div>`;
}
  function renderRb(){
  const days=S.cycleDays||KD,end=RL[RL.length-1][1];
  const rb=S.rb||0,left=Math.max(0,Math.ceil(days-kAge()));let h="";
  if(kEnd())h=`<div class="box" style="margin-bottom:14px;border-color:var(--gold)"><b>Kiếp này đã khép lại</b><br><small>${S.points>=end?"Đã chứng Chân Tiên, kiếp khép lại đúng kỳ hạn.":"Đã đủ "+days+" ngày của một kiếp."} Bước vào luân hồi: linh lực về 0, mọi vật phẩm, linh thú, danh hiệu, tông môn và hiệu ứng đều trở về hư không. Bảng NPC cùng thiên kiếp làm lại từ đầu. Không còn hiệu ứng vĩnh viễn từ kiếp trước.</small><div class="row"><button class="btn" style="margin-left:0" data-rb="1">Bước vào luân hồi</button></div></div>`;
  else h=`<small style="display:block;margin:0 2px 10px">Kiếp thứ ${rb+1}, còn ${left} ngày.</small>`;
  $("tmb").insertAdjacentHTML("beforeend",h);
}
  function renderRbs(){
  const h=S.rbh||[];
  const bb=bk(),top=bb.pk>0?"Kiếp "+bb.n+(bb.cur?" (đang tu)":"")+": "+bb.pk+" linh lực":"chưa có";
  $("rbs").innerHTML=fold("t7","Các Kiếp Trước",`<div class="grid2"><div><span class="lbl">Số kiếp đã qua</span><div class="num">${h.length}</div><small>Đang ở kiếp thứ ${(S.rb||0)+1}</small></div><div><span class="lbl">Kỷ lục linh lực</span><div class="num" style="font-size:18px">${top}</div></div></div>${h.length?`<ul>${h.map((r,i)=>`<li><div class="nm">Kiếp ${r.n}${r.name?" · "+r.name:""}${r.grade?" · "+r.grade:""}<small>Dừng chân ở ${root.GameProgressData.realmName(r.pk,root.GameProgressData.cycleConfig(r.cycleDays).realms)}. ${r.days}/${r.cycleDays||119} ngày, ${r.quests} nhiệm vụ, hạng ${r.rank}, đỉnh ${r.pk} linh lực.</small></div><button class="btn alt" data-vi="${i}">Xem lại</button></li>`).reverse().join("")}</ul>`:""}`,0);
}
  function showThd(r,ask){
  const transmissions=root.GameSectSystem.transmissionNames(r.transmissions),path=root.GameLegacyMissions.pathDescription(r.lifePath);
  $("thd").innerHTML=`<div class="box"><h2>Kiếp Trước</h2><small>Kiếp thứ ${r.n} · ${r.name}${r.grade?" · Đánh giá: "+r.grade:""}</small>${r.txt.map(x=>`<p style="margin:10px 0">${x}</p>`).join("")}${transmissions.length?`<p>Truyền thừa: ${transmissions.join(", ")}</p>`:""}${path?`<p>Đạo lộ: ${path}</p>`:""}
    <div class="row">
      ${ask?`<button class="btn" style="margin-left:0" id="thr">Bước vào luân hồi</button>`:""}
      <button class="btn alt" style="margin-left:0" id="thx">${ask?"Để sau":"Đóng"}</button>
      <button class="btn alt" style="margin-left:0" id="thex">Xuất phán quyết</button>
    </div></div>`;
  $("thd").hidden=false;
  $("thx").onclick=()=>{$("thd").hidden=true};
  if(ask)$("thr").onclick=()=>{$("thd").hidden=true;doRebirth()};
  $("thex").onclick=()=>{
    const text=["Kiếp Trước","Kiếp "+r.n+" · "+r.name+(r.grade?" · "+r.grade:""),"",...(r.txt||[]),...(transmissions.length?["Truyền thừa: "+transmissions.join(", ")]:[]),...(path?["Đạo lộ: "+path]:[])].join("\n");
    try{
      const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="phan-quyet-kiep-"+r.n+".txt";a.click();
      say("Đã tải phán quyết (.txt). Có thể in hoặc chuyển PDF từ trình duyệt.");
    }catch(e){prompt("Sao chép phán quyết:",text)}
  };
}
    function showTdLenh(){
    const name=S.name||"đạo hữu",st=Math.max(1,S.tdStacks||1),pct=Math.min(30,5*st);
    $("thd").innerHTML=`<div class="box" style="border-color:var(--red)"><h2>Thiên Đạo Lệnh Bảng</h2>
      <small>Thiên chỉ · Lần thứ ${st}</small>
      <p style="margin:12px 0;line-height:1.6">${name}. Tên đã được đọc. Không có lý do nào khác.</p>
      <p style="margin:10px 0;line-height:1.6">Mệnh cạn không do ai rút. Nó chảy hết vì không có gì chắn. Thiên kiếp đến, gục. Thiên kiếp lại đến, gục. Xác thân còn đứng, linh căn đã tắt.</p>
      <p style="margin:10px 0;line-height:1.6">Cán cân nghiêng thì Thiên Đạo ghi lại. Không giận, không thương. <b>Thiên Đạo Trừng Phạt</b> áp xuống (chồng lần ${st}):</p>
      <p style="margin:10px 0;line-height:1.6">• Mọi nguồn linh lực thu về bị bớt <b>${pct}%</b> (mỗi lần Mệnh cạn thêm 5%, tối đa 30%).<br>• Gục thêm một lần, Mệnh mất thêm một phần. Không ai đếm hộ.<br>• Mệnh nằm ở 0 cho đến khi tự đứng dậy.</p>
      <p style="margin:10px 0;line-height:1.6">Điều kiện gỡ: một kiếp <b>viên mãn</b>, mọi thiên kiếp từ <b>Khá</b> trở lên. Không có đường tắt. Không có ngoại lệ.</p>
      <p style="margin:12px 0;font-style:italic;color:var(--mute)">Cửa không đóng. Cũng không có ai đứng chờ ở cửa.</p>
      <div class="row"><button class="btn" style="margin-left:0" id="thx">Kính tuân</button></div>
    </div>`;
    $("thd").hidden=false;
    $("thx").onclick=()=>{$("thd").hidden=true};
  }

  function bindEvents(){
    $("exams").onclick=e=>{
      const toggle=e.target.closest("[data-a=xl]");
      if(toggle){
        const id=toggle.dataset.id,list=toggle.parentNode.querySelector("ul.exl");
        EXOPEN[id]=!EXOPEN[id];
        if(list)list.classList.toggle("open",!!EXOPEN[id]);
        toggle.textContent=EXOPEN[id]?"Thu gọn":"Xem đủ "+(list?list.children.length:0)+" người";
        return;
      }
      const simulation=e.target.closest("[data-a=xm]");
      const claim=e.target.closest("[data-a=xc]");
      if(e.target.closest("[data-a=xr]"))deps.claimRecovery?.();
      else if(simulation)deps.simulateExam(simulation.dataset.id);
      else if(claim)deps.claimExam(claim.dataset.id);
    };
    $("kiep").onclick=e=>{
      const button=e.target.closest("button[data-k]");
      if(button&&!button.disabled)deps.claimTrial(button.dataset.k);
    };
    $("tmb").onclick=e=>{
      const button=e.target.closest("button[data-rb]");
      if(!button)return;
      if(!button.dataset.arm){
        button.dataset.arm=1;button.textContent="Bấm lần nữa để xác nhận";return;
      }
      doRebirth();
    };
    $("rbs").onclick=e=>{
      const button=e.target.closest("[data-vi]");
      if(button&&S.rbh&&S.rbh[+button.dataset.vi])showThd(S.rbh[+button.dataset.vi]);
    };
  }
  return Object.freeze({render,renderKiep,renderRb,renderRbs,showThd,showTdLenh,bindEvents});
 }
 root.GameTribulationUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
