/* Giao diện Vấn Đạo Thí Luyện trong Vạn Pháp. */
(function(root){
 "use strict";
 function create({S,$,today,escapeHtml:esc,confirm,saveReview,say}){
  const api=root.GameKnowledgeTrial;
  let session=null,serial=0,lastOptions=null,lastMarkup=null;
  const subject=()=>$("trial-subject"),count=()=>$("trial-count");
  function render(){
   const subjects=S.subjects?.list||[];
   const options='<option value="*">Tất cả môn</option><option value="none">Chưa phân môn</option>'+subjects.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}${s.archived?" (đã lưu trữ)":""}</option>`).join("");
   if(options!==lastOptions){const previous=subject().value;subject().innerHTML=options;subject().value=["*","none",...subjects.map(s=>s.id)].includes(previous)?previous:"*";lastOptions=options}
   const available=api.pool(S,subject().value).length;
   $("trial-available").textContent=`${available} thẻ khả dụng`;
   $("trial-start").disabled=!available;
   $("trial-setup").hidden=!!session;
   let html="";
   if(session){
    const card=api.current(session),step=session.results.length;
    const token=`${serial}-${step}`;
    if(card){
     const name=root.GameSubjects.find(S,card.subjectId)?.name||"Chưa phân môn";
     html=`<div class="review-card"><small>Câu ${step+1}/${session.cards.length} · ${esc(name)}</small><progress class="trial-progress" max="${session.cards.length}" value="${step}" aria-label="Tiến độ thí luyện"></progress><p class="review-text">${esc(card.question)}</p>${session.revealed?`<div class="review-answer"><small>Đáp án</small><p class="review-text">${esc(card.answer)}</p></div><div class="chips"><button data-trial="forget" data-token="${token}">Chưa nhớ</button><button data-trial="remember" data-token="${token}">Đã nhớ</button></div>`:`<button data-trial="reveal" data-token="${token}">Xem đáp án</button>`}<button class="trial-exit" data-trial="end" data-token="${token}">Kết thúc phiên</button></div>`;
    }else{
     const result=api.summary(session);
     const plan=root.GameReviewCards.reviewTomorrow(S,result.missed,today());
     html=`<div class="review-card"><small>Kết quả tự đánh giá</small><div class="trial-score">${result.correct}/${result.total} · ${result.percent}%</div>${result.missed.length?`<details class="fold"><summary>${result.missed.length} câu cần ôn lại</summary><ul class="trial-missed">${result.missed.map(c=>`<li>${esc(c.question)}</li>`).join("")}</ul></details><div class="chips">${plan?`<button data-trial="schedule" data-token="${token}">Ôn ${plan.count} thẻ vào ngày mai</button>`:""}<button data-trial="retry" data-token="${token}">Luyện lại câu chưa nhớ</button></div>`:"<p>Đã nhớ toàn bộ câu hỏi trong phiên.</p>"}<button class="trial-exit" data-trial="end" data-token="${token}">Phiên mới</button></div>`;
    }
   }
   if(html!==lastMarkup){$("trial-current").innerHTML=html;lastMarkup=html}
  }
  function bind(){
   subject().onchange=render;
   $("trial-start").onclick=()=>{
    if(session)return;
    session=api.start(S,subject().value,Number(count().value));
    if(session)serial++;
    render();
   };
   $("trial-current").onclick=e=>{
    const button=e.target.closest("[data-trial]");
    if(!session||!button||button.dataset.token!==`${serial}-${session.results.length}`)return;
    const action=button.dataset.trial,card=api.current(session);
    if(action==="schedule"&&!card){
     const plan=root.GameReviewCards.reviewTomorrow(S,api.summary(session).missed,today());
     if(plan&&confirm(`Chuyển ${plan.count} thẻ chưa nhớ về lịch ôn ngày mai?`)&&saveReview(plan.cards)){
      say(`Đã xếp ${plan.count} thẻ ôn vào ngày mai.`);
     }
     render();return;
    }
    if(action==="end"){
     if(card&&!confirm("Kết thúc phiên thí luyện đang làm?"))return;
     session=null;render();return;
    }
    let next=null;
    if(action==="retry")next=api.retry(session);
    else if(card&&action==="reveal")next=api.reveal(session,card.id);
    else if(card&&["forget","remember"].includes(action))next=api.grade(session,card.id,action==="remember");
    if(!next)return;
    session=next;if(action==="retry")serial++;render();
   };
  }
  function reset(){session=null;serial++;render()}
  return Object.freeze({render,bind,reset});
 }
 root.GameKnowledgeTrialUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
