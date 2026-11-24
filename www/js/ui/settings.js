/* UI tùy chỉnh giao diện và sao lưu; quản lý hiển thị và thao tác. */
(function(root){
 "use strict";
 function create(deps){
  const {S,fold,container}=deps;
  function render(){
  const u=S.ui||{skin:"classic",density:"normal",fs:"md",theme:"auto"};
  const on=(k,v)=>u[k]===v?" on":"";
  container.innerHTML=fold("ui","Giao diện",`<small>Tùy chỉnh phong cách — vẫn giữ tông cổ thư. Thay đổi áp dụng ngay.</small>
<div class="srt"><b>Chủ đề màu</b>
  <div class="ui-opt">
    <button class="btn alt${on("skin","classic")}" data-ui="skin" data-v="classic">Cổ thư (đỏ son)</button>
    <button class="btn alt${on("skin","jade")}" data-ui="skin" data-v="jade">Thanh ngọc</button>
    <button class="btn alt${on("skin","ink")}" data-ui="skin" data-v="ink">Mặc thư</button>
    <button class="btn alt${on("skin","night")}" data-ui="skin" data-v="night">U huyền</button>
  </div></div>
<div class="srt"><b>Sáng / tối</b>
  <div class="ui-opt">
    <button class="btn alt${on("theme","auto")}" data-ui="theme" data-v="auto">Theo hệ thống</button>
    <button class="btn alt${on("theme","light")}" data-ui="theme" data-v="light">Sáng</button>
    <button class="btn alt${on("theme","dark")}" data-ui="theme" data-v="dark">Tối</button>
  </div></div>
<div class="srt"><b>Mật độ giao diện</b>
  <div class="ui-opt">
    <button class="btn alt${on("density","compact")}" data-ui="density" data-v="compact">Gọn</button>
    <button class="btn alt${on("density","normal")}" data-ui="density" data-v="normal">Vừa</button>
    <button class="btn alt${on("density","roomy")}" data-ui="density" data-v="roomy">Rộng</button>
  </div></div>
<div class="srt"><b>Cỡ chữ</b>
  <div class="ui-opt">
    <button class="btn alt${on("fs","sm")}" data-ui="fs" data-v="sm">Nhỏ</button>
    <button class="btn alt${on("fs","md")}" data-ui="fs" data-v="md">Vừa</button>
    <button class="btn alt${on("fs","lg")}" data-ui="fs" data-v="lg">Lớn</button>
  </div></div>
<div class="srt"><b>Chế độ chơi</b>
  <div class="ui-opt">
    <button class="btn alt${u.studyOnly?"":" on"}" data-ui="studyOnly" data-v="0">Đầy đủ</button>
    <button class="btn alt${u.studyOnly?" on":""}" data-ui="studyOnly" data-v="1">Chỉ học</button>
  </div>
  <small style="display:block;margin-top:4px">Chỉ học: ẩn bảng, tông, bảo khố phức tạp — giữ nhiệm vụ, nhật trình, thiên kiếp, nhật ký.</small>
</div>`,1)+fold("bk","Sao lưu & hệ thống",`<small>Dữ liệu chỉ nằm trong trình duyệt này. Xuất ra để không mất khi đổi máy.</small>
${deps.isWriteBlocked?.()?'<p role="alert">Đang khóa lưu để bảo toàn dữ liệu lỗi. Hãy xuất dữ liệu cứu hộ trước khi nhập backup mới.</p><button class="btn alt" data-bk="recovery">Tải dữ liệu cứu hộ</button>':""}
<textarea id="bk" placeholder="Dữ liệu backup JSON sẽ hiện ở đây…"></textarea>
<input id="bkfile" type="file" accept=".json,application/json" hidden>
<div class="chips" style="margin-top:8px">
  <button class="btn alt" data-bk="ex">Tạo backup</button>
  <button class="btn alt" data-bk="dl">Tải file JSON</button>
  <button class="btn alt" data-bk="im">Nhập JSON</button>
  <button class="btn alt" data-bk="file">Chọn file backup</button>
  <button class="btn alt" data-bk="sn">${S.snd===0?"Bật âm":"Tắt âm"}</button>
  <button class="btn alt" data-bk="nm">Đổi tên</button>
  <button class="btn alt" data-bk="tut">Hướng dẫn lại</button>
  <button class="btn alt" data-bk="god">${S.god?"Tắt Thiên Đạo":"Thiên Đạo"}</button>
</div>`,0);
}
  function bindEvents(){
    const {$,FO,save,refresh,drawNav,say,sfx,today,askName,showTut,importBackup}=deps;
$("gear").onclick=()=>{const p=$("setpanel"),on=p.hidden;p.hidden=!on;$("sbody").hidden=on;$("gear").classList.toggle("on",on);$("gear").setAttribute("aria-expanded",on)};
$("s").addEventListener("toggle",e=>{const k=e.target.dataset&&e.target.dataset.k;if(k)FO[k]=e.target.open},true);
container.onclick=e=>{
  const ui=e.target.closest("[data-ui]");
  if(ui){
    S.ui=S.ui||{};
    if(ui.dataset.ui==="studyOnly"){S.ui.studyOnly=ui.dataset.v==="1";save();root.GameUI.apply(S);render();drawNav();refresh();say(S.ui.studyOnly?"Đã bật chế độ Chỉ học.":"Đã về chế độ đầy đủ.");return}
    S.ui[ui.dataset.ui]=ui.dataset.v;save();root.GameUI.apply(S);render();say("Đã đổi giao diện.");return;
  }
  const b=e.target.closest("button");if(!b)return;const a=b.dataset.bk;
  if(a==="ex"||a==="dl"||a==="recovery"){
    try{
      const raw=a==="recovery"?deps.recoveryData():GameStorage.exportData(S);$("bk").value=raw;$("bk").select();
      if(a==="ex"){try{navigator.clipboard&&navigator.clipboard.writeText(raw)}catch(x){}say("Đã tạo backup. Hãy sao chép hoặc tải file để cất giữ.")}
      else{
        const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
        link.href=url;link.download="tu-tien-hoc-dao-"+(a==="recovery"?"recovery":"backup")+"-"+today()+".json";document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);say("Đã tải file backup JSON.");
      }
    }catch(x){say("Không thể tạo backup: "+(x.message||"dữ liệu không hợp lệ."))}
  }
  else if(a==="file"){$("bkfile").click()}
  else if(a==="im"){
    try{
      if(!window.confirm("Nhập backup sẽ thay thế tiến trình hiện tại. Bản hiện tại sẽ được lưu thành backup nội bộ trước. Tiếp tục?"))return;
      importBackup($("bk").value);
    }catch(x){say("Không thể nhập backup: "+(x.message||"dữ liệu không hợp lệ.")+" Tiến trình hiện tại chưa bị thay thế.");return}
    say("Đã nhập backup thành công. Đang tải lại.");
    root.location.reload();
  }
  else if(a==="sn"){S.snd=S.snd===0?1:0;save();render();say(S.snd===0?"Đã tắt âm thanh.":"Đã bật âm thanh.");sfx(660)}
  else if(a==="nm")askName();
  else if(a==="tut"){S.tutDone=0;S.tutStep=0;save();showTut()}
  else if(a==="god"){S.god=!S.god;save();render();refresh();say(S.god?"Thiên Đạo đã mở, mọi tab được mở khóa.":"Đã tắt Thiên Đạo.")}
};

container.addEventListener("change",async e=>{
  if(e.target.id!=="bkfile")return;
  const file=e.target.files&&e.target.files[0];if(!file)return;
  try{
    $("bk").value=await file.text();
    say("Đã đọc file backup. Kiểm tra nội dung rồi bấm «Nhập JSON» để xác nhận.");
  }catch(x){say("Không đọc được file backup.")}
  e.target.value="";
});
  }
  return Object.freeze({render,bindEvents});
 }
 root.GameSettingsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
