/* UI nhập đạo ban đầu: chọn hình thể và đạo hiệu. */
(function(root){
 "use strict";
 function create(deps){
  const {S,AV_NAM,AV_NU,$,save,render,say,schedule}=deps;
  const TUT=deps.TUT;
  const showTutorial=deps.showTutorial;
  function askName(){
const o=$("nmo");
const g=S.gender==="nu"?"nu":"nam",chooseCycle=deps.canChooseFirstCycle?.();
o.innerHTML=`<div class="box"><h2>Nhập đạo · Chọn hình thể</h2>
  <small>Thiên Đạo cần biết đạo hiệu và hình thể của ngươi. Avatar theo nam hoặc nữ.</small>
  <div class="row" style="margin-top:10px;justify-content:center;gap:16px;flex-wrap:wrap">
    <button type="button" class="btn alt gender-pick${g==="nam"?" on":""}" data-g="nam" style="padding:8px;min-width:120px">
      <img src="${AV_NAM}" alt="Nam" width="88" height="88" style="border-radius:50%;object-fit:cover;border:3px solid ${g==="nam"?"var(--gold)":"var(--line)"};display:block;margin:0 auto 6px">
      <span>Nam tu</span>
    </button>
    <button type="button" class="btn alt gender-pick${g==="nu"?" on":""}" data-g="nu" style="padding:8px;min-width:120px">
      <img src="${AV_NU}" alt="Nữ" width="88" height="88" style="border-radius:50%;object-fit:cover;border:3px solid ${g==="nu"?"var(--gold)":"var(--line)"};display:block;margin:0 auto 6px">
      <span>Nữ tu</span>
    </button>
  </div>
  ${chooseCycle?'<div class="first-cycle"><label for="first-cycle"><b>Thời lượng kiếp đầu</b></label><select id="first-cycle"><option value="119" selected>Học kỳ · 119 ngày</option><option value="30">1 tháng · 30 ngày</option><option value="60">2 tháng · 60 ngày</option><option value="90">3 tháng · 90 ngày</option></select></div>':""}
  <div class="row" style="margin-top:12px"><input type="text" id="nmi" maxlength="20" placeholder="Ví dụ: Lăng Vân / Tố Tuyết" value="${S.name||""}"><button class="btn" id="nmk" style="margin-left:0">Nhập đạo</button></div>
</div>`;
o.hidden=false;
let pick=g;
o.querySelectorAll(".gender-pick").forEach(btn=>{
  btn.onclick=()=>{
    pick=btn.dataset.g;
    o.querySelectorAll(".gender-pick").forEach(b=>{
      const on=b.dataset.g===pick;
      b.classList.toggle("on",on);
      const img=b.querySelector("img");
      if(img)img.style.borderColor=on?"var(--gold)":"var(--line)";
    });
  };
});
const done=()=>{
  const v=$("nmi").value.replace(/[<>&"'`]/g,"").trim().slice(0,20);
  if(!v){$("nmi").focus();return}
  if(chooseCycle)deps.chooseFirstCycle(Number($("first-cycle").value));
  S.name=v;S.gender=pick||"nam";
  save();o.hidden=true;render();
  say("Chào mừng "+(S.gender==="nu"?"nữ tu":"đạo hữu")+" "+v+".");
  if(!S.tutDone)schedule(showTutorial,300);
};
$("nmk").onclick=done;$("nmi").onkeydown=e=>{if(e.key==="Enter")done()};
  }
  function showTutorialStep(){
  if(S.tutDone)return;
  const i=S.tutStep||0,step=TUT[i];if(!step){S.tutDone=1;save();$("tut").hidden=true;return}
  $("tut").innerHTML=`<div class="box"><h2>Hướng dẫn · ${i+1}/${TUT.length}</h2><p style="margin:12px 0;line-height:1.7"><b>${step.t}</b><br>${step.b}</p>
    <div class="row"><button class="btn" style="margin-left:0" id="tutn">${i===TUT.length-1?"Bắt đầu tu luyện":"Tiếp"}</button>
    <button class="btn alt" id="tutsk">Bỏ qua</button></div></div>`;
  $("tut").hidden=false;
  $("tutn").onclick=()=>{S.tutStep=(S.tutStep||0)+1;if(S.tutStep>=TUT.length){S.tutDone=1;S.tutStep=0;$("tut").hidden=true;say("Hướng dẫn xong. Hãy lập nhiệm vụ đầu tiên.");}save();if(!S.tutDone)showTutorialStep();else render()};
  $("tutsk").onclick=()=>{S.tutDone=1;S.tutStep=0;save();$("tut").hidden=true;say("Đã bỏ qua hướng dẫn. Có thể xem lại trong Cài đặt.")};
}

  return Object.freeze({askName,showTutorial:showTutorialStep});
 }
 root.GameOnboardingUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
