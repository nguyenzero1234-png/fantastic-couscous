(function(global){
  "use strict";
  function create({hosts,plan,startFocus,escapeHtml,say}){
    let markup;
    const messages={active:"Đang trong phiên học.",busy:"Đang có việc trong Nhật trình.",short:"Chưa có nhiệm vụ phù hợp khung giờ hoặc hạn còn lại.",empty:"Chưa có nhiệm vụ sẵn sàng."};
    function render(){
      const result=plan();
      const next=result.status==="ready"?`<div class="study-plan-main"><b>${escapeHtml(result.quest.name)}</b><small>${escapeHtml(result.reason)} · ${result.quest.mins} phút</small></div><button type="button" class="btn alt" data-study-id="${escapeHtml(result.quest.id)}">Học ngay</button>`:`<small>${messages[result.status]}</small>`;
      if(markup!==next){hosts.forEach(host=>{host.innerHTML=next});markup=next}
    }
    const click=e=>{
      const button=e.target.closest("[data-study-id]");
      if(!button)return;
      const result=plan();
      if(result.status!=="ready"||result.quest.id!==button.dataset.studyId){render();say("Gợi ý đã thay đổi theo Nhật trình.");return}
      startFocus(result.quest);
    };
    hosts.forEach(host=>{host.onclick=click});
    return {render};
  }
  global.GameStudyPlannerUI=Object.freeze({create});
})(window);
