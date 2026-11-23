/* UI tùy chỉnh giao diện và sao lưu; thao tác được giữ ở bootstrap. */
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
  return Object.freeze({render});
 }
 root.GameSettingsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
