/* Giao diện Thiên Cơ Lục. Nội dung chính sử nằm trong data/world-lore.js. */
(function(root){
 "use strict";
 function create({SECTS,$,worldStatus,chapterStatus}){
  const {ages,chapters,sectTraditions}=root.GameWorldLore;
  const esc=value=>root.GameText.escapeHtml(String(value??""));
  const prose=lines=>lines.map(line=>`<p>${esc(line)}</p>`).join("");
  const chapter=(title,subtitle,body,open=false)=>`<details class="box lore-chapter"${open?" open":""}><summary><span><b>${title}</b><small>${subtitle}</small></span><span class="lore-chevron" aria-hidden="true">⌄</span></summary><div class="lore-prose">${body}</div></details>`;
  let renderedHost=null;
  function render(){
   const el=$("lore");if(!el)return;
   if(renderedHost!==el){
    el.innerHTML=`
     <div class="box lore-cover"><small>Cửu Châu · Thiên thư</small><h2>Thiên Cơ Lục</h2><p>Chín châu, sáu truyền thừa, một trang mệnh thư còn bỏ ngỏ.</p></div>
     <div id="lore-current" class="box lore-current" hidden></div>
     ${chapterStatus?chapter("Phong Vân Cửu Châu","Chương truyện mở theo đạo lộ",'<div id="lore-milestones"></div>'):""}
     ${chapter("Nguyên Lưu Chi Chủ","Khởi đầu của đạo hữu",prose(chapters.origin),true)}
     ${chapter("Chính sử Cửu Châu","Bốn thời đại",ages.map(age=>`<div class="lore-era"><h3>${esc(age.title)}</h3>${prose([age.text])}</div>`).join(""))}
     ${chapter("Sơn hà Cửu Châu","Chín châu và hai thánh địa",prose(chapters.lands))}
     ${chapter("Sáu đại tông môn","Truyền thừa và nếp sống",SECTS.map((s,i)=>`<div class="lore-sect"><h3>${esc(s.n)}</h3>${prose([s.lore,sectTraditions[i]].filter(Boolean))}</div>`).join(""))}
     ${chapter("Thiên kiêu đương thế","Những con đường cầu đạo",prose(chapters.rivals))}
     ${chapter("Thiên Đạo và đạo lộ","Cảnh giới, thiên kiếp, luân hồi",prose(chapters.law))}
     ${chapter("Nhân gian dưới chân núi","Kỳ ngộ và đời sống tu hành",prose(chapters.life))}
    `;
    renderedHost=el;
   }
   const current=el.querySelector?.("#lore-current");
   if(!current||!worldStatus)return;
   const s=worldStatus();
   const content=`<h2>Phong vân hiện thế</h2><div class="lore-current-grid"><div><small>Đạo hữu · Kiếp ${esc(s.life)}</small><b>${esc(s.name)} · ${esc(s.realm)}</b><small>Ngày ${esc(s.day)}/${esc(s.days)} · Hạng ${esc(s.rank)}</small></div><div><small>Đứng đầu Thiên Kiêu Bảng</small><b>${esc(s.leader)}</b><small>${esc(s.leaderSect)}</small></div></div><p class="lore-note">Thiên kiếp đã diễn ra: ${esc(s.exams)}${s.penalty?" · Đang chịu Thiên Đạo Trừng Phạt":""}</p>${s.latest?`<p class="lore-note">Đạo Văn gần nhất: ${esc(s.latest)}</p>`:""}`;
   if(current.innerHTML!==content)current.innerHTML=content;
   current.hidden=false;
   const milestones=el.querySelector?.("#lore-milestones");
   if(milestones&&chapterStatus){
    const content=chapterStatus().map(c=>`<div class="lore-era"><h3>${esc(c.title)}</h3><small>${esc(c.condition)} · ${c.unlocked?"Đã mở":"Chưa mở"}</small>${c.unlocked?prose([c.text]):""}</div>`).join("");
    if(milestones.innerHTML!==content)milestones.innerHTML=content;
   }
  }
  return Object.freeze({render});
 }
 root.GameLoreUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
