/* UI bảng điều khiển Thiên Đạo; thao tác vẫn do game bootstrap xử lý. */
(function(root){
 "use strict";
 function create(deps){
  const {S,GMG,$}=deps;
  const curStreak=deps.getCurStreak;
  function render(){
  const g=$("g");if(!g)return;
  g.innerHTML=`<div class="box"><h2>Thiên Đạo</h2>
    <small>Chế độ kiểm tra — ảnh hưởng dữ liệu thật. Mọi tab được mở khóa khi bật.</small>
    <div class="row" style="margin-top:8px"><label>Linh lực đặt tay <input type="number" id="gv" min="0" value="${Math.round(S.points)||1000}"></label>
      <small style="margin-left:8px">Chuỗi hiện tại: ${curStreak()} ngày</small>
      <small style="margin-left:8px">Mệnh ${S.menh==null?100:S.menh}/100${S.tdPenalty?" · Trừng Phạt ×"+(S.tdStacks||1):""}</small></div>
    ${GMG.map(G=>`<div style="margin-top:12px"><b style="font-size:13px;color:var(--gold)">${G.h}</b>${G.n?`<small style="display:block;margin-top:2px">${G.n}</small>`:""}
      <div class="chips" style="margin-top:6px">${G.b.map(([id,lab])=>`<button class="btn alt" data-gm="${id}">${lab}</button>`).join("")}</div></div>`).join("")}
    <pre id="gout" style="white-space:pre-wrap;font:13px/1.6 var(--serif);margin:12px 0 0;max-height:200px;overflow:auto"></pre>
  </div>`;
}
  return Object.freeze({render});
 }
 root.GameGodModeUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
