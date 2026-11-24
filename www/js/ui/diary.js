/* UI nhật ký và Đạo Văn; dữ liệu ký lục được cấp từ story system. */
(function(root){
 "use strict";
 function create(deps){
  const {S,dayStr,today,$}=deps;
  const genDiary=deps.generateDiary,chkStoryFlags=deps.checkStoryFlags;
  function render(){
  const el=$("diary");if(!el)return;
  try{chkStoryFlags();}catch(e){}
  const days=[];for(let i=0;i<14;i++)days.push(dayStr(i));
  const log=(S.storyLog||[]).slice().reverse();
  let storyHtml="";
  if(log.length){
    storyHtml=`<div class="box" style="border-color:var(--gold)"><h2>Đạo Văn · Ký lục</h2>
      <small>Những trang đột phá, bái tông, vấn đạo, khế ước linh thú và luân hồi. Không buff số liệu — chỉ còn chữ.</small></div>`+
      log.slice(0,12).map(s=>{
        const when=s.day||(s.at?new Date(s.at).toLocaleDateString("vi-VN"):"");
        return `<div class="box"><b>${s.title}</b><small style="display:block;margin:4px 0;opacity:.75">${when}</small>${(s.lines||[]).map(x=>`<p style="margin:6px 0;line-height:1.65;font-size:14px">${x}</p>`).join("")}</div>`;
      }).join("");
  }else{
    storyHtml=`<div class="box"><h2>Đạo Văn · Ký lục</h2><small>Chưa có trang nào. Đột phá cảnh giới, bái tông, nhận linh thú hoặc luân hồi sẽ được Thiên Đạo ghi lại đây.</small></div>`;
  }
  el.innerHTML=`<div class="box"><h2>Nhật ký đạo hữu</h2><small>Thiên Đạo ghi vài dòng mỗi ngày dựa trên tu luyện thật. Không ảnh hưởng số liệu, chỉ là ký lục. Kéo xuống xem Đạo Văn (đột phá & dấu mốc).</small></div>`+
    days.map(d=>{const L=genDiary(d),isT=d===today();
      return `<div class="box"${isT?` style="border-color:var(--gold)"`:""}><b>${isT?"Hôm nay":d}</b>${L.map(x=>`<p style="margin:6px 0;line-height:1.6;font-size:14px">${x}</p>`).join("")}</div>`;
    }).join("")+
    `<div style="margin-top:18px"></div>`+storyHtml;
}

  return Object.freeze({render});
 }
 root.GameDiaryUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
