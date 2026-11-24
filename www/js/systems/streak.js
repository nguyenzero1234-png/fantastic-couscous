/* Quy tắc chuỗi ngày học và tâm ma. Không phụ thuộc DOM, storage hoặc trạng thái global. */
(function(global){
  "use strict";
  function current(streak,today,yesterday){
    const x=streak||{};
    return x.last===today||x.last===yesterday?(x.n||0):0;
  }
  function completeDay(input){
    const x=input||{},prevN=Number(x.streak)||0;
    let continued=x.last===x.yesterday,consumeLifeCharm=false,consumeHeartCharm=false,triggerDemon=false,extra="",log="";
    if(!continued&&x.last===x.twoDaysAgo&&(Number(x.lifeCharm)||0)>0){continued=true;consumeLifeCharm=true;extra=" Đã dùng Tục Mệnh Phù — chuỗi được giữ."}
    if(!continued&&prevN>=2){
      if(x.heartCharm){consumeHeartCharm=true;extra+=" Hộ Tâm Phù đã chặn tâm ma."}
      else if((typeof x.random==="function"?x.random():Number(x.random)||0)<0.5)triggerDemon=true;
      extra=(extra?extra+" ":"")+"Chuỗi "+prevN+" ngày đứt — "+(x.heartCharm?"Hộ Tâm Phù đã chặn tâm ma.":triggerDemon?"tâm ma xâm nhập đạo tâm!":"may mắn không phát sinh tâm ma.");
      log="Mất chuỗi học ("+prevN+" ngày)"+(triggerDemon?" → tâm ma":" → không phát sinh tâm ma");
    }
    return {streak:{n:continued?prevN+1:1,last:x.today},consumeLifeCharm,consumeHeartCharm,triggerDemon,extra,log};
  }
  function checkBreak(input){
    const x=input||{},last=x.last,n=Number(x.streak)||0;
    if(!last||n<2||last===x.today||last===x.yesterday)return null;
    if(last===x.twoDaysAgo&&(Number(x.lifeCharm)||0)>0)return null;
    const blocked=!!x.heartCharm,triggerDemon=!blocked&&(typeof x.random==="function"?x.random():Number(x.random)||0)<0.5;
    return {
      consumeHeartCharm:blocked,triggerDemon,
      log:"Mất chuỗi học ("+n+" ngày, bỏ phiên)"+(blocked?" — Hộ Tâm Phù chặn tâm ma":triggerDemon?" → tâm ma":" — không phát sinh tâm ma"),
      message:"Chuỗi "+n+" ngày đã đứt."+(blocked?" Hộ Tâm Phù đã chặn tâm ma.":triggerDemon?" Tâm ma xuất hiện, cần 2 nhiệm vụ ≥25 phút để trấn áp.":" May mắn không phát sinh tâm ma lần này.")
    };
  }
  function progressCurses(input){
    const x=input||{},minutes=Number(x.minutes)||0;
    let tm=!!x.tm,tmTasks=Number(x.tmTasks)||0,tma=!!x.tma,tmaTasks=Number(x.tmaTasks)||0;
    let clearedSelf=false,clearedHeavenly=false,taskBonus=0;
    if(minutes>=25){
      if(tm){tmTasks++;if(tmTasks>=2){tm=false;tmTasks=0;clearedSelf=true;taskBonus=x.calmTitle?40:0}}
      if(tma&&minutes>=45){tmaTasks++;if(tmaTasks>=3){tma=false;tmaTasks=0;clearedHeavenly=true}}
    }
    return {tm,tmTasks,tma,tmaTasks,clearedSelf,clearedHeavenly,taskBonus};
  }

  function set(state,n,options){
    const o=options||{},today=o.today,offset=Number(o.dayOffset)||0,now=o.now==null?Date.now():o.now;
    n=Math.max(0,Math.min(400,n|0));
    state.streak={last:n>0?today:"",n};
    state.hist=state.hist||{};
    for(let i=0;i<420;i++){
      const d=new Date(now+offset*864e5);d.setDate(d.getDate()-i);
      const key=d.toLocaleDateString("sv"),h=state.hist[key];
      if(i<n){if(!h)state.hist[key]={p:0,m:1,g:1};else if(!(h.m>0)){h.m=1;h.g=1}}
      else if(h&&h.g){if(h.p===0&&h.m<=1)delete state.hist[key];else{h.m=Math.max(0,h.m-1);delete h.g}}
    }
    if(o.lifeStats){const life=o.lifeStats();life.ms=Math.max(life.ms||0,n)}
    if(o.cycleState){const cycle=o.cycleState();cycle.ms=Math.max(cycle.ms||0,n)}
    return n;
  }
  global.GameStreak=Object.freeze({current,completeDay,checkBreak,progressCurses,set});
})(window);
