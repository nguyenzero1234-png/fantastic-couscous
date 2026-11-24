/* Giao diện Vạn Pháp. */
(function(root){
 "use strict";
 function create({S,$,today,weekStart,escapeHtml:esc,save,refresh,say,prompt}){
  const api=root.GameSubjects;
  let lastOptions=null,lastMarkup=null;
  function options(){
   const host=$("nsubject"),list=S.subjects.list.filter(s=>!s.archived);
   const html='<option value="">Chưa phân môn</option>'+list.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
   if(html===lastOptions)return;
   const previous=host.value;host.innerHTML=html;host.value=list.some(s=>s.id===previous)?previous:"";lastOptions=html;
  }
  function render(){
   const data=S.subjects,T=today(),W=weekStart();
   const review=$("weekly-review");
   if(review){
    const r=root.GameAnalytics.weeklyReview(S,T,W),t=r.totals;
    const html=`<div class="lore-current-grid"><div><small>Thời gian học đã ghi nhận</small><b>${t.minutes} phút</b><small>${t.activeDays}/${r.days.length} ngày có học</small></div><div><small>Nhiệm vụ hoàn thành</small><b>${t.tasks}</b><small>${r.since?`${t.onTime} đúng hạn · ${t.late} quá hạn`:"Chưa có dữ liệu hạn"}</small></div></div>${r.partial&&r.since?`<small>Thống kê hạn ghi nhận từ ${esc(r.since)}; dữ liệu tuần có thể chưa đủ.</small>`:""}${r.focus?`<p class="lore-note">Môn cần chú ý: ${esc(r.focus.name)} · ${r.focus.minutes}/${r.focus.weekly} phút mục tiêu tuần.</p>`:`<small>Chưa có môn còn thiếu mục tiêu tuần đã đặt.</small>`}${r.subjectPartial?"<small>Dữ liệu theo môn của tuần có thể chưa đầy đủ.</small>":""}`;
    if(review.innerHTML!==html)review.innerHTML=html;
   }
   const techniques=root.GameTechniques,training=techniques.init(S),selected=techniques.find(training.active);
   if($("technique-select").value!==training.active)$("technique-select").value=training.active;
   $("technique-info").textContent=selected?selected.description:"Chọn một công pháp phù hợp cách học của đạo hữu.";
   $("technique-status").textContent=(training.days[T]?"Hôm nay đã vận công.":"Thưởng 12 linh lực cơ bản, một lần/ngày từ 5h đến trước 22h, chịu hệ số hiện tại.")+" · "+Object.keys(training.days).length+" ngày vận công kiếp này.";
   const line=(title,m,g)=>`<small>${title}: ${m}${g?"/"+g:""} phút</small>${g?`<div class="bar"><i style="width:${Math.min(100,m/g*100)}%"></i></div>`:""}`;
   const cards=data.list.map(s=>`<div class="box subject-card"><div class="row"><b>${esc(s.name)}</b>${s.archived?"<small>Đã lưu trữ</small>":""}</div>${line("Hôm nay",api.minutes(S,s.id,T,T),s.daily)}${line("Tuần này",api.minutes(S,s.id,W,T),s.weekly)}<small>Tổng kiếp này: ${api.minutes(S,s.id)} phút</small><div class="chips"><button class="btn alt" data-subject-action="edit" data-id="${esc(s.id)}">Sửa</button><button class="btn alt" data-subject-action="archive" data-id="${esc(s.id)}">${s.archived?"Khôi phục":"Lưu trữ"}</button></div></div>`);
   const archive=(S.rbh||[]).slice(-5).reverse().filter(r=>Array.isArray(r?.subjects?.totals)).map(r=>`<div class="box"><b>Kiếp ${Number(r.n)||0}</b>${r.subjects.totals.filter(s=>s&&typeof s.name==="string"&&Number.isFinite(s.minutes)).map(s=>`<small>${esc(s.name)} · ${s.minutes} phút</small>`).join("")}</div>`).join("");
   const active=cards.filter((_,i)=>!data.list[i].archived).join("");
   const inactive=cards.filter((_,i)=>data.list[i].archived).join("");
   const html=active+`<div class="box subject-card"><b>Chưa phân môn</b>${line("Hôm nay",api.minutes(S,null,T,T),0)}${line("Tuần này",api.minutes(S,null,W,T),0)}<small>Tổng kiếp này: ${api.minutes(S,null)} phút</small></div>`+inactive+archive;
   if(html!==lastMarkup){$("subject-list").innerHTML=html;lastMarkup=html}
   $("subject-coverage").textContent="Ghi nhận theo môn từ "+data.since+".";
  }
  function bind(){
   const techniques=root.GameTechniques,select=$("technique-select");
   select.innerHTML='<option value="">Không chọn</option>'+techniques.catalog.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
   select.onchange=()=>{const previous=techniques.init(S).active;if(!techniques.select(S,select.value))return;if(!save()){techniques.select(S,previous);render();return}render();say("Đã chọn công pháp học tập.")};
   $("subject-add").onclick=()=>{
    if(!api.update(S,null,{name:$("subject-name").value,daily:Number($("subject-daily").value||0),weekly:Number($("subject-weekly").value||0)})){say("Tên trùng hoặc mục tiêu không hợp lệ.");return}
    $("subject-name").value="";$("subject-daily").value="0";$("subject-weekly").value="0";save();refresh();say("Đã mở môn học.");
   };
   $("subject-list").onclick=e=>{
    const b=e.target.closest("[data-subject-action]");if(!b)return;
    const s=api.find(S,b.dataset.id);if(!s)return;
    if(b.dataset.subjectAction==="archive")s.archived=!s.archived;
    else if(b.dataset.subjectAction==="edit"){
     const raw=prompt("Tên môn | mục tiêu phút/ngày | phút/tuần",`${s.name} | ${s.daily} | ${s.weekly}`);if(raw==null)return;
     const [name,daily,weekly]=raw.split("|").map(x=>x.trim());
     if(!api.update(S,s.id,{name,daily:Number(daily??s.daily),weekly:Number(weekly??s.weekly)})){say("Tên trùng hoặc mục tiêu không hợp lệ.");return}
    }
    save();refresh();
   };
  }
  return Object.freeze({render,options,bind});
 }
 root.GameSubjectsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
