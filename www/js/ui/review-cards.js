/* Giao diện Ôn Cố Lục trong Vạn Pháp. */
(function(root){
 "use strict";
 function create({S,$,today,escapeHtml:esc,save,say,confirm,onChange=()=>{}}){
  const api=root.GameReviewCards;
  let revealed=null,shown=null,lastMarkup=null;
  const select=()=>$("review-select"),subject=()=>$("review-subject");
  function options(node,markup){
   if(node._reviewOptions===markup)return;
   const previous=node.value;node.innerHTML=markup;node.value=previous;node._reviewOptions=markup;
  }
  function render(){
   const cards=api.list(S),day=today(),queue=api.due(S,day),card=queue[0];
   $("review-count").textContent=`${queue.length} đến hạn / ${cards.length} thẻ`;
   options(select(),'<option value="">Thẻ mới</option>'+cards.map(c=>`<option value="${esc(c.id)}">${esc(c.question.slice(0,65))}</option>`).join(""));
   options(subject(),'<option value="">Chưa phân môn</option>'+(S.subjects?.list||[]).map(s=>`<option value="${esc(s.id)}">${esc(s.name)}${s.archived?" (đã lưu trữ)":""}</option>`).join(""));
   const key=card?day+"/"+card.id+"/"+card.question+"/"+card.answer:null;
   if(shown!==key){shown=key;revealed=null}
   let html;
   if(!card){
    const next=cards.map(c=>c.due).sort()[0];
    html=`<p>${next?"Đã ôn hết. Lần ôn tiếp theo: "+esc(next):"Chưa có thẻ. Hãy ghi lại điều cần nhớ."}</p>`;
   }else{
    const id=esc(card.id),name=root.GameSubjects.find(S,card.subjectId)?.name||"Chưa phân môn";
    html=`<div class="review-card"><small>${esc(name)} · Bậc ${card.stage}/5</small><p class="review-text">${esc(card.question)}</p>${revealed===key?`<div class="review-answer"><small>Đáp án</small><p class="review-text">${esc(card.answer)}</p></div><div class="chips"><button data-review="forget" data-id="${id}">Chưa nhớ</button><button data-review="remember" data-id="${id}">Đã nhớ</button></div>`:`<button data-review="reveal" data-id="${id}">Xem đáp án</button>`}</div>`;
   }
   if(html!==lastMarkup){$("review-current").innerHTML=html;lastMarkup=html}
  }
  function fill(){
   const card=api.list(S).find(c=>c.id===select().value);
   subject().value=root.GameSubjects.find(S,card?.subjectId)?.id||"";
   $("review-question").value=card?.question||"";
   $("review-answer").value=card?.answer||"";
   $("review-delete").hidden=!card;
  }
  function commit(next){
   if(!next)return false;
   const previous=S.reviewCards;S.reviewCards=next;
   if(!save()){
    if(previous===undefined)delete S.reviewCards;else S.reviewCards=previous;
    say("Không lưu được Ôn Cố Lục. Hãy thử lại.");return false;
   }
   revealed=null;render();onChange();return true;
  }
  function importCards(){
   const result=api.importText(S,$("review-import").value,today());
   if(!result.added){
    const parts=["Chưa có thẻ mới để nhập."];
    if(result.skipped)parts.push(result.skipped+" dòng trùng hoặc vượt giới hạn.");
    if(result.invalid)parts.push(result.invalid+" dòng sai định dạng hoặc môn học.");
    if(result.capacity)parts.push("Đã chạm giới hạn "+api.limit+" thẻ.");
    const message=parts.join(" ");$("review-import-hint").textContent=message;say(message);return;
   }
   if(!commit(result.cards)){$("review-import-hint").textContent="Không lưu được. Hãy thử nhập lại.";return}
   const parts=["Đã nhập "+result.added+" thẻ."];
   if(result.skipped)parts.push("Bỏ qua "+result.skipped+" dòng trùng hoặc vượt giới hạn.");
   if(result.invalid)parts.push(result.invalid+" dòng sai định dạng hoặc môn học.");
   if(result.capacity)parts.push("Đã chạm giới hạn "+api.limit+" thẻ.");
   const message=parts.join(" ");$("review-import-hint").textContent=message;say(message);
  }
  function copyPrompt(){
   const prompt=root.GameReviewCardPrompt?.build(S);
   if(!prompt){say("Chưa tải được prompt AI.");return}
   const copied=()=>{const message="Đã chép prompt AI. Gửi prompt cùng tài liệu hoặc ảnh cho ChatGPT, rồi dán kết quả vào Ôn Cố Lục.";$("review-import-hint").textContent=message;say("Đã chép prompt AI.")};
   const fallback=()=>{
    const doc=root.document;
    if(!doc?.createElement||!doc.body||!doc.execCommand){say("Trình duyệt không cho phép chép tự động. Hãy thử lại trên HTTPS.");return}
    const field=doc.createElement("textarea");field.value=prompt;field.style.cssText="position:fixed;opacity:0";doc.body.appendChild(field);field.select();
    let ok=false;try{ok=doc.execCommand("copy")}catch(e){}
    field.remove();
    if(ok)copied();else say("Không thể chép prompt tự động. Hãy thử lại trên HTTPS.");
   };
   const clipboard=root.navigator?.clipboard;
   if(clipboard?.writeText){try{clipboard.writeText(prompt).then(copied,fallback)}catch(e){fallback()}}
   else fallback();
  }
  function bind(){
   select().onchange=fill;
   $("review-prompt").onclick=copyPrompt;
   $("review-import-btn").onclick=importCards;
   $("review-save").onclick=()=>{
    const id=select().value||null;
    const next=api.upsert(S,id,{subjectId:subject().value,question:$("review-question").value,answer:$("review-answer").value},today());
    if(!next){say("Cần câu hỏi và đáp án hợp lệ. Tối đa 300 thẻ.");return}
    if(commit(next)){select().value="";fill();say("Đã ghi thẻ vào Ôn Cố Lục.")}
   };
   $("review-delete").onclick=()=>{
    const id=select().value;if(!id||!confirm("Xóa thẻ ôn tập này?"))return;
    if(commit(api.remove(S,id))){select().value="";fill();say("Đã xóa thẻ.")}
   };
   $("review-current").onclick=e=>{
    const b=e.target.closest("[data-review]");if(!b)return;
    const card=api.due(S,today())[0];
    if(!card||card.id!==b.dataset.id)return;
    render();
    if(b.dataset.review==="reveal"){revealed=shown;render();return}
    if(revealed!==shown||!['remember','forget'].includes(b.dataset.review))return;
    if(commit(api.grade(S,card.id,b.dataset.review==="remember",today())))say("Đã cập nhật lịch ôn.");
   };
  }
  return Object.freeze({render,bind,commit});
 }
 root.GameReviewCardsUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
