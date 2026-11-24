/* UI nhật ký và Đạo Văn, giữ trạng thái mở chương khi dữ liệu đổi. */
(function(root){
 "use strict";
 function create(deps){
  const {S,dayStr,today,$}=deps;
  const genDiary=deps.generateDiary,chkStoryFlags=deps.checkStoryFlags;
  const esc=value=>root.GameText.escapeHtml(String(value??""));
  const prose=lines=>lines.map(x=>`<p>${esc(x)}</p>`).join("");
  let lastHost=null,lastContent="";
  function render(){
   const el=$("diary");if(!el)return;
   try{chkStoryFlags();}catch(e){}
   const openState=new Map(Array.from(el.querySelectorAll?.("details[data-entry]")||[]).map(d=>[d.dataset.entry,d.open]));
   const entry=(key,title,date,lines,open)=>`<details data-entry="${esc(key)}" class="box lore-chapter"${(openState.get(key)??open)?" open":""}><summary><span><b>${esc(title)}</b><small>${esc(date)}</small></span><span class="lore-chevron" aria-hidden="true">⌄</span></summary><div class="lore-prose">${prose(lines)}</div></details>`;
   const log=(S.storyLog||[]).slice().reverse().slice(0,12);
   const storyHtml=`<div class="box lore-cover"><h2>Đạo Văn · Ký lục</h2><p>${log.length?"Những dấu mốc đã xảy ra trên đạo lộ của ngươi.":"Chưa có dấu mốc. Khi đột phá, bái tông hoặc gặp cơ duyên, Thiên Đạo sẽ ghi lại."}</p></div>`+
     log.map((s,i)=>entry("story:"+s.id,s.title,s.day||(s.at?new Date(s.at).toLocaleDateString("vi-VN"):""),s.lines||[],i===0)).join("");
   const days=Array.from({length:14},(_,i)=>dayStr(i));
   const diaryHtml=`<div class="box"><h2>Nhật ký đạo hữu</h2><small>Mười bốn ngày gần nhất, dựa trên quá trình tu luyện thực tế.</small></div>`+
     days.map(d=>entry("day:"+d,d===today()?"Hôm nay":d,d===today()?d:"Nhật trình",genDiary(d),d===today())).join("");
   const content=storyHtml+diaryHtml;
   if(lastHost!==el||lastContent!==content){el.innerHTML=content;lastHost=el;lastContent=content;}
  }
  return Object.freeze({render});
 }
 root.GameDiaryUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
