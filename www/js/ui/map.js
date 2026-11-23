/* UI bản đồ Cửu Châu; điều hướng và dữ liệu game được tiêm từ bootstrap. */
(function(root){
 "use strict";
 function create(deps){
  const {S,SECTS,$}=deps;
  const esc=deps.escapeHtml,myRk=deps.rank,go=deps.navigate,renderApp=deps.render;
  function render(){
  const el=$("map");if(!el)return;
  // Tọa độ % theo bản đồ cổ họa Cửu Châu (ảnh gốc)
  // px/py = left%, top% — khớp chấm trên tranh
  const locs=[
    {id:"cc",n:"Cửu Châu",px:50,py:11,d:"Thiên Sơn trung tâm · Thiên Kiêu Bảng treo trên đỉnh. Cả chín châu hướng về đây mỗi tuần khi bảng chốt.",go:()=>go("t","b"),col:"#f5f0e0",tag:"Bảng xếp hạng"},
    {id:"ccw",n:"Cửu Châu (Tây)",px:28,py:23,d:"Động phủ trên núi mây phía tây. Nơi ghi chép Thiên Cơ và đạo quả các đời.",go:()=>go("s","o"),col:"#c0c0c8",tag:"Thiên Cơ Lục"},
    {id:"dc",n:"Dương Châu",px:72,py:21,d:"Tông môn trên dãy núi phía đông bắc. Không gian cổ, nền tảng vững — Thái Hư Điện đóng tại đây.",go:()=>go("t","z"),sect:3,col:"#8b6bb8",tag:SECTS[3].n},
    {id:"hc",n:"Hoài Châu",px:50,py:34,d:"Đảo giữa sông lớn. Vạn Pháp Các lơ lửng trên hồ Linh Tâm, trăm nhà pháp thuật hội tụ.",go:()=>go("t","z"),sect:2,col:"#5eb0c8",tag:SECTS[2].n},
    {id:"tc",n:"Tùng Châu",px:36,py:40,d:"Rừng phong đỏ và đình cổ. Kỳ ngộ và linh thú thường xuất hiện nơi hoang nguyên này.",go:()=>go("w","e"),col:"#c8483a",tag:"Kỳ ngộ / Linh thú"},
    {id:"thc",n:"Thanh Châu",px:16,py:50,d:"Thác nước và lâu đài trên vách đá. Thiên Kiếm Tông dựng kiếm các tại đây — kiếm ý xé mây.",go:()=>go("t","z"),sect:0,col:"#3a6aaa",tag:SECTS[0].n},
    {id:"tuc",n:"Tứ Châu",px:48,py:54,d:"Núi giữa lòng châu. Lôi Đài Thiên Kiếp đứng trên đỉnh — nơi thiên kiếp giáng xuống thử đạo tâm.",go:()=>go("w","x"),col:"#d4a84a",tag:"Thiên kiếp"},
    {id:"uc",n:"Ung Châu",px:78,py:50,d:"Đình đài giữa đồng xanh. Bách Thảo Đường trồng dược liệu bạt ngàn, hương thuốc bay xa trăm dặm.",go:()=>go("t","z"),sect:5,col:"#3a9a5a",tag:SECTS[5].n},
    {id:"kc",n:"Ký Châu",px:20,py:78,d:"Thành cổ dưới mây núi phía tây nam. Cửu U Cốc ẩn trong bóng tối vĩnh cửu gần đây.",go:()=>go("t","z"),sect:4,col:"#6a5a9a",tag:SECTS[4].n},
    {id:"tec",n:"Tề Châu",px:48,py:80,d:"Đình quán giữa đồng bằng. Càn Khôn Bảo Khố mở cửa tại đây — đổi bảo vật bằng linh lực.",go:()=>go("k","k"),col:"#e8d8b0",tag:"Kỳ Bảo"},
    {id:"lc",n:"Lạc Châu",px:74,py:72,d:"Lâu đài lá vàng mùa thu. Huyền Đan Môn luyện đan trong thung lũng Đan Hà thuộc Lạc Châu.",go:()=>go("t","z"),sect:1,col:"#c9a84c",tag:SECTS[1].n}
  ];
  const mine=S.sect;
  // Ảnh bản đồ: cùng thư mục với HTML (cuu-chau-map.jpg)
  const mapSrc="assets/map/cuu-chau-map.jpg";
  el.innerHTML=`<div class="box"><h2>Bản đồ Cửu Châu · 九州圖</h2>
    <small style="display:block;line-height:1.6;margin-top:4px">Bản đồ cổ họa chín châu. Chạm chấm sáng trên tranh để mở khu vực trong game.</small>
    <small style="display:block;margin-top:4px">Bạn: <b>${esc(S.name||"Đệ tử")}</b> · ${mine!=null?SECTS[mine].n:"Chưa vào tông"} · Hạng ${myRk()}</small>
  </div>
  <div class="box" style="padding:6px;overflow:auto">
    <div id="cmapwrap" style="position:relative;width:100%;max-width:900px;margin:0 auto;line-height:0;border-radius:4px;overflow:hidden;border:1px solid var(--gold);box-shadow:var(--shadow)">
      <img src="${mapSrc}" alt="Bản đồ Cửu Châu" style="width:100%;height:auto;display:block;user-select:none;pointer-events:none" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <div style="display:none;padding:24px;text-align:center;font-size:14px;line-height:1.5;color:var(--mute)">Không tải được ảnh bản đồ. Hãy để file <b>cuu-chau-map.jpg</b> cùng thư mục với file HTML.</div>
      ${locs.map((L,i)=>{
        const on=mine!=null&&L.sect===mine;
        return `<button type="button" data-map="${i}" title="${L.n}" aria-label="${L.n}"
          style="position:absolute;left:${L.px}%;top:${L.py}%;transform:translate(-50%,-50%);
            width:${on?22:16}px;height:${on?22:16}px;border-radius:50%;padding:0;margin:0;
            background:${L.col};border:${on?"3px solid #f5e6a0":"2px solid #fff"};
            box-shadow:0 0 0 2px rgba(0,0,0,.25),0 2px 8px rgba(0,0,0,.35);
            cursor:pointer;z-index:2;transition:transform .12s">
        </button>`;
      }).join("")}
    </div>
  </div>
  <div class="box" id="mapinfo"><small>Chạm một chấm trên bản đồ để xem mô tả châu và dịch chuyển.</small></div>
  <div class="box"><small style="line-height:1.55"><b>Chú giải chín châu:</b> Cửu Châu (đỉnh) · Dương · Hoài · Tùng · Thanh · Tứ · Ung · Ký · Tề · Lạc. Chấm viền vàng = tông môn bạn đang gia nhập.</small></div>`;
  el.onclick=e=>{
    const g=e.target.closest("[data-map]");if(!g)return;
    const L=locs[+g.dataset.map];if(!L)return;
    $("mapinfo").innerHTML=`<div class="row" style="margin:0;align-items:flex-start"><div style="flex:1">
      <b>${L.n}</b> · <span class="pb">${L.tag}</span>
      <br><small style="line-height:1.55;display:block;margin-top:4px">${L.d}</small></div>
      <button class="btn" data-goto="${g.dataset.map}" style="margin-left:8px">Đi tới</button></div>`;
  };
  el.querySelector("#mapinfo").onclick=e=>{
    const b=e.target.closest("[data-goto]");if(!b)return;
    const L=locs[+b.dataset.goto];if(L&&L.go){L.go();renderApp()}
  };
}
  return Object.freeze({render});
 }
 root.GameMapUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
