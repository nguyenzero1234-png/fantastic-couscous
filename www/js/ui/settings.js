/* UI tùy chỉnh giao diện và sao lưu; quản lý hiển thị và thao tác. */
(function(root){
 "use strict";
 function create(deps){
  const {S,fold,container}=deps;
  let portraitRequest=0;
  function setPortrait(src){
    S.ui=S.ui||{};
    const previous=S.ui.portrait;
    if(src)S.ui.portrait=src;else delete S.ui.portrait;
    if(deps.save()===false){
      if(previous)S.ui.portrait=previous;else delete S.ui.portrait;
      deps.say("Không thể lưu chân dung.");return;
    }
    render();deps.refresh();deps.say(src?"Đã đổi chân dung.":"Đã dùng chân dung mặc định.");
  }
  function render(){
    const u={skin:"classic",density:"normal",fs:"md",theme:"auto",ornament:"classic",...S.ui};
    const draft=deps.$?.("bk")?.value||"";
    const advanced=deps.$?.("bkadvanced")?.open||false;
    const choice=(k,v,label,active)=>`<button type="button" class="btn alt${active?" on":""}" data-ui="${k}" data-v="${v}" aria-pressed="${active}">${label}</button>`;
    const options=(label,k,values)=>`<div class="setting-field"><b>${label}</b><div class="ui-opt" role="group" aria-label="${label}">${values.map(([v,n])=>choice(k,v,n,u[k]===v)).join("")}</div></div>`;
    container.innerHTML=fold("general","Chung",`
<div class="setting-field"><b>Chế độ chơi</b><div class="ui-opt" role="group" aria-label="Chế độ chơi">
  ${choice("studyOnly","0","Đầy đủ",!u.studyOnly)}${choice("studyOnly","1","Chỉ học",!!u.studyOnly)}
</div><small>Chỉ học giúp tập trung vào nhiệm vụ, nhật trình và thiên kiếp.</small></div>
<div class="setting-row"><div><b>Âm thanh</b><small>Hiệu ứng khi thao tác</small></div><button type="button" class="btn alt${S.snd===0?"":" on"}" data-bk="sn" role="switch" aria-checked="${S.snd!==0}">${S.snd===0?"Tắt":"Bật"}</button></div>
<div class="setting-field"><b>Thời lượng kiếp sau</b><div class="ui-opt cycle-options" role="group" aria-label="Thời lượng kiếp sau">${[[30,"1 tháng"],[60,"2 tháng"],[90,"3 tháng"],[119,"Học kỳ"]].map(([days,label])=>choice("cycleDays",days,label,(S.nextCycleDays||119)===days)).join("")}</div><small>Kiếp hiện tại: ${S.cycleDays||119} ngày. Kiếp sau: ${S.nextCycleDays||119} ngày. Áp dụng khi luân hồi.</small></div>
<div class="setting-row"><b>Đạo hiệu</b><button class="btn alt" data-bk="nm">Đổi tên</button></div>
<div class="setting-row"><b>Hướng dẫn</b><button class="btn alt" data-bk="tut">Xem lại</button></div>`,1)
    +fold("ui","Giao diện",`
<div class="setting-field"><b>Chân dung</b><div class="portrait-setting">
  ${root.GameIcons.portrait(S,S.name,{player:1,w:64,h:64})}
  <div><input id="portraitfile" type="file" accept="image/jpeg,image/png,image/webp" hidden>
  <button type="button" class="btn alt" data-bk="portrait">Chọn ảnh</button>
  ${root.GameIcons.validPortrait(u.portrait)?'<button type="button" class="btn alt" data-bk="portraitReset">Mặc định</button>':""}
  <small>Ảnh lưu cùng bản sao JSON.</small></div></div></div>
${options("Phong cách","skin",[["classic","Cổ thư"],["jade","Thanh ngọc"],["ink","Mặc thư"],["night","U huyền"]])}
${options("Chế độ sáng","theme",[["auto","Tự động"],["light","Sáng"],["dark","Tối"]])}
${options("Cỡ chữ","fs",[["sm","Nhỏ"],["md","Vừa"],["lg","Lớn"]])}
${options("Mật độ","density",[["compact","Gọn"],["normal","Vừa"],["roomy","Rộng"]])}
${options("Trang trí","ornament",[["classic","Cổ phong"],["minimal","Tối giản"]])}<small>Tối giản ẩn câu trích dẫn và hoa văn viền Thiên Kiêu.</small>`,0)
    +fold("bk","Sao lưu",`
<small>Tiến trình được lưu trên thiết bị. Giữ một bản sao khi đổi máy hoặc cài lại app.</small>
${deps.isWriteBlocked?.()?'<p class="setting-alert" role="alert">Đang khóa lưu. Hãy tải dữ liệu cứu hộ trước khi khôi phục.</p><button class="btn alt" data-bk="recovery">Tải dữ liệu cứu hộ</button>':""}
<input id="bkfile" type="file" accept=".json,application/json" hidden>
<div class="setting-actions"><button class="btn" data-bk="dl">Tải bản sao JSON</button><button class="btn alt" data-bk="file">Chọn file khôi phục</button></div>
<details class="setting-advanced" id="bkadvanced"${advanced||draft?" open":""}><summary>JSON thủ công</summary>
<label for="bk">Nội dung bản sao</label><textarea id="bk" placeholder="Dán JSON để khôi phục hoặc tạo bản sao để sao chép…"></textarea>
<div class="setting-actions"><button class="btn alt" data-bk="ex">Tạo và sao chép</button><button class="btn alt" data-bk="im">Khôi phục JSON</button></div></details>`,!!deps.isWriteBlocked?.())
    +fold("advanced","Nâng cao",`
<div class="setting-row"><div><b>Thiên Đạo</b><small>Kiểm thử trên tiến trình hiện tại</small></div><button class="btn alt${S.god?" on":""}" data-bk="god" role="switch" aria-checked="${!!S.god}">${S.god?"Bật":"Tắt"}</button></div>
${S.god?'<div class="setting-actions"><button class="btn alt" data-bk="godopen">Mở Thiên Đạo</button></div>':""}`,0);
    const field=deps.$?.("bk");
    if(field)field.value=draft;
  }
  function bindEvents(){
    const {$,FO,save,refresh,drawNav,say,sfx,today,askName,showTut,importBackup}=deps;
$("gear").onclick=()=>{const p=$("setpanel"),on=p.hidden;p.hidden=!on;$("sbody").hidden=on;$("gear").classList.toggle("on",on);$("gear").setAttribute("aria-expanded",on);$("settings-title").textContent=on?"Cài đặt":"Thống kê";$("gear").textContent=on?"←":"⚙";$("gear").setAttribute("aria-label",on?"Về thống kê":"Cài đặt");$("gear").title=on?"Về thống kê":"Cài đặt";$("settings-version").hidden=!on};
$("s").addEventListener("toggle",e=>{const k=e.target.dataset&&e.target.dataset.k;if(k)FO[k]=e.target.open},true);
container.onclick=e=>{
  const ui=e.target.closest("[data-ui]");
  if(ui){
    if(ui.dataset.ui==="cycleDays"){
      const days=Number(ui.dataset.v);if(![30,60,90,119].includes(days))return;
      const previous=S.nextCycleDays;S.nextCycleDays=days;
      if(save()===false){S.nextCycleDays=previous;render();say("Không thể lưu thời lượng kiếp sau.");return}
      render();say("Kiếp sau sẽ kéo dài "+days+" ngày.");return;
    }
    S.ui=S.ui||{};
    if(ui.dataset.ui==="studyOnly"){S.ui.studyOnly=ui.dataset.v==="1";save();root.GameUI.apply(S);render();drawNav();refresh();say(S.ui.studyOnly?"Đã bật chế độ Chỉ học.":"Đã về chế độ đầy đủ.");return}
    const key=ui.dataset.ui,previous=S.ui[key];
    if(key==="ornament"&&ui.dataset.v==="classic")delete S.ui[key];else S.ui[key]=ui.dataset.v;
    if(save()===false){if(previous===undefined)delete S.ui[key];else S.ui[key]=previous;render();say("Không thể lưu giao diện.");return}
    root.GameUI.apply(S);render();say("Đã đổi giao diện.");return;
  }
  const b=e.target.closest("button");if(!b)return;const a=b.dataset.bk;
  if(a==="ex"||a==="dl"||a==="recovery"){
    try{
      const raw=a==="recovery"?deps.recoveryData():GameStorage.exportData(S);if(a==="ex"){$("bkadvanced").open=true;$("bk").value=raw;$("bk").select()}
      if(a==="ex"){say("Đã tạo bản sao JSON.");try{navigator.clipboard?.writeText(raw)?.then(()=>say("Đã sao chép JSON.")).catch(()=>say("Hãy sao chép JSON đã chọn."))}catch(x){say("Hãy sao chép JSON đã chọn.")}}
      else{
        const blob=new Blob([raw],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
        link.href=url;link.download="tu-tien-hoc-dao-"+(a==="recovery"?"recovery":"backup")+"-"+today()+".json";document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);say("Đã tải file backup JSON.");
      }
    }catch(x){say("Không thể tạo backup: "+(x.message||"dữ liệu không hợp lệ."))}
  }
  else if(a==="portrait"){$("portraitfile").click()}
  else if(a==="portraitReset"){portraitRequest++;setPortrait(null)}
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
  else if(a==="god"){if(!S.god&&!root.confirm("Bật Thiên Đạo? Các lệnh kiểm thử tác động trực tiếp tới tiến trình."))return;S.god=!S.god;save();render();drawNav();refresh();say(S.god?"Đã bật Thiên Đạo.":"Đã tắt Thiên Đạo.")}
  else if(a==="godopen"&&S.god)deps.openGod();
  else if(a==="nm")askName();
  else if(a==="tut"){S.tutDone=0;S.tutStep=0;save();showTut()}

};

container.addEventListener("change",async e=>{
  if(e.target.id==="portraitfile"){
    const file=e.target.files?.[0];e.target.value="";
    if(!file)return;
    const request=++portraitRequest;
    try{const src=await root.GameIcons.readPortrait(file);if(request===portraitRequest)setPortrait(src)}
    catch(x){if(request===portraitRequest)say(x.message||"Không đọc được ảnh.")}
    return;
  }
  if(e.target.id!=="bkfile")return;
  const file=e.target.files&&e.target.files[0];if(!file)return;
  try{
    const raw=await file.text();$("bkadvanced").open=true;$("bk").value=raw;
    say("Đã đọc file backup. Kiểm tra nội dung rồi bấm «Khôi phục JSON» để xác nhận.");
  }catch(x){say("Không đọc được file backup.")}
  e.target.value="";
});
  }
  return Object.freeze({render,bindEvents});
 }
 root.GameSettingsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
