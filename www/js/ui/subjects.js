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
