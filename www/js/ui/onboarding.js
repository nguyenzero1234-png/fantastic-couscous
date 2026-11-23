/* UI nhập đạo ban đầu: chọn hình thể và đạo hiệu. */
(function(root){
 "use strict";
 function create(deps){
  const {S,AV_NAM,AV_NU,$,save,render,say,schedule}=deps;
  const showTutorial=deps.showTutorial;
  function askName(){
const o=$("nmo");
const g=S.gender==="nu"?"nu":"nam";
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
  S.name=v;S.gender=pick||"nam";
  save();o.hidden=true;render();
  say("Chào mừng "+(S.gender==="nu"?"nữ tu":"đạo hữu")+" "+v+".");
  if(!S.tutDone)schedule(showTutorial,300);
};
$("nmk").onclick=done;$("nmi").onkeydown=e=>{if(e.key==="Enter")done()};
  }
  return Object.freeze({askName});
 }
 root.GameOnboardingUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
