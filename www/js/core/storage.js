/* Core storage adapter: localStorage, validation, backup and import/export.
   Tách riêng đọc/ghi localStorage và sao lưu để game.js tập trung vào gameplay.
   Exposes a stable GameStorage API for classic scripts. */
(function(global){
  "use strict";
  const blockedKeys=new Set();
  const rejectedPrimaries=new Set();
  const record=v=>!!v&&typeof v==="object"&&!Array.isArray(v);
  const nonnegative=v=>typeof v==="number"&&Number.isFinite(v)&&v>=0;
  const session=v=>record(v)&&typeof v.id==="string"&&v.id.length>0&&nonnegative(v.startedAt);
  const optional=(v,check)=>v===undefined||check(v);

  function validSave(value){
    if(!record(value)||!Array.isArray(value.quests)||!nonnegative(value.points))return false;
    if(!optional(value.schemaVersion,v=>v===1||v===2))return false;
    if(!optional(value.gameSec,v=>Number.isSafeInteger(v)&&v>=0))return false;
    if(!optional(value.timers,v=>record(v)&&
      (v.play===null||(session(v.play)&&nonnegative(v.play.lastTickAt)))&&
      (v.focus===null||(session(v.focus)&&typeof v.focus.questId==="string"&&v.focus.questId.length>0&&nonnegative(v.focus.lastSeenAt)&&nonnegative(v.focus.endAt)&&v.focus.endAt>=v.focus.lastSeenAt))))return false;
    if(Object.prototype.hasOwnProperty.call(value,"__proto__"))return false;
    const ids=new Set();
    for(const q of value.quests){
      if(!record(q)||typeof q.id!=="string"||!q.id||ids.has(q.id))return false;
      ids.add(q.id);
      if(!optional(q.name,v=>typeof v==="string")||!optional(q.pts,nonnegative)||!optional(q.mins,nonnegative)||!optional(q.got,nonnegative)||!optional(q.doneOn,v=>v===null||typeof v==="string")||!optional(q.due,v=>v===null||nonnegative(v)))return false;
      if(!optional(q.completion,v=>record(v)&&typeof v.day==="string"&&nonnegative(v.gain)&&nonnegative(v.mins)&&nonnegative(v.at)&&record(v.stats)&&Object.values(v.stats).every(nonnegative)&&typeof v.undone==="boolean"))return false;
    }
    const maps=["hist","sched","claimed","inv","cnt","ls","life","pets","tt","kc"];
    if(maps.some(k=>!optional(value[k],record)))return false;
    if(!optional(value.streak,v=>record(v)&&typeof v.last==="string"&&nonnegative(v.n)))return false;
    if(!optional(value.buff,v=>record(v)&&nonnegative(v.n)&&nonnegative(v.m)))return false;
    if(!optional(value.hist,v=>Object.values(v).every(h=>record(h)&&nonnegative(h.p)&&nonnegative(h.m))))return false;
    if(!optional(value.nightStudy,v=>record(v)&&Object.values(v).every(n=>nonnegative(n)&&n<=120)))return false;
    if(!optional(value.menhRecovery,v=>v===null||(record(v)&&typeof v.start==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v.start)&&typeof v.claimed==="boolean"&&optional(v.days,days=>Array.isArray(days)&&days.every(day=>typeof day==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(day))))))return false;
    if(!optional(value.sched,v=>Object.values(v).every(a=>Array.isArray(a)&&a.every(record))))return false;
    if(!optional(value.chains,v=>Array.isArray(v)&&v.every(record)))return false;
    if(!optional(value.ev,v=>record(v)&&["w","m"].every(k=>record(v[k])&&nonnegative(v[k].h)&&nonnegative(v[k].r))))return false;
    if(!optional(value.sem,v=>v===null||(record(v)&&record(v.res)&&Object.values(v.res).every(r=>record(r)&&Array.isArray(r.rows)&&r.rows.every(record)))))return false;
    if(!optional(value.lb,v=>v===null||record(v)))return false;
    for(const key of ["fx","rep","stl","ks","storyLog"]){
      if(!optional(value[key],Array.isArray))return false;
    }
    if(!optional(value.stl,v=>v.every(row=>Array.isArray(row)&&nonnegative(row[0])&&nonnegative(row[1]))))return false;
    if(!optional(value.fx,v=>v.every(e=>record(e)&&nonnegative(e.n)&&nonnegative(e.v))))return false;
    return true;
  }

  function parseBackup(raw){
    const parsed=typeof raw==="string"?JSON.parse(raw):raw;
    const state=parsed&&parsed.app==="tu-tien-hoc-dao"&&parsed.formatVersion===1?parsed.data:parsed;
    if(!validSave(state))throw new Error("Backup data is invalid");
    return state;
  }

  function exportData(state){
    if(!validSave(state))throw new Error("Cannot export invalid save data");
    return JSON.stringify({
      app:"tu-tien-hoc-dao",
      formatVersion:1,
      exportedAt:new Date().toISOString(),
      data:state
    },null,2);
  }

  function importData(key,raw,normalize){
    const parsedState=parseBackup(raw);
    const state=normalize?normalize(parsedState):parsedState;
    if(!validSave(state))throw new Error("Migrated backup data is invalid");
    const backupKey=key+".backup";
    const current=localStorage.getItem(key);
    if(blockedKeys.has(key))localStorage.setItem(key+".recovery",recoveryData(key));
    if(current){
      let parsed;
      try{parsed=JSON.parse(current)}catch(_){parsed=null}
      if(!rejectedPrimaries.has(key)&&validSave(parsed)&&localStorage.getItem(backupKey)!==current){
        // Không ghi đè tiến trình hiện tại nếu không thể bảo toàn bản trước khi nhập.
        localStorage.setItem(backupKey,current);
      }
    }
    const serialized=JSON.stringify(state);
    localStorage.setItem(key,serialized);
    blockedKeys.delete(key);
    rejectedPrimaries.delete(key);
    try{global.NTsave&&global.NTsave()}catch(error){
      console.warn("[Tu Tiên Học Đạo] Không thể lưu trạng thái thông báo.",error);
    }
    return state;
  }

  function recoveryData(key){
    return JSON.stringify({app:"tu-tien-hoc-dao",primary:localStorage.getItem(key),backup:localStorage.getItem(key+".backup")},null,2);
  }

  function load(key,defaults,normalize){
    const backupKey=key+".backup";
    let state=Object.assign({},defaults);
    blockedKeys.delete(key);
    rejectedPrimaries.delete(key);

    function prepare(raw){
      const parsed=JSON.parse(raw);
      if(!validSave(parsed))throw new Error("Save data is invalid");
      const prepared=normalize?normalize(parsed):Object.assign({},defaults,parsed);
      if(!validSave(prepared))throw new Error("Migrated save data is invalid");
      return prepared;
    }

    function recoverBackup(){
      const backupRaw=localStorage.getItem(backupKey);
      if(backupRaw===null)return false;
      state=prepare(backupRaw);
      console.warn("[Tu Tiên Học Đạo] Đã khôi phục từ bản sao lưu gần nhất.");
      try{global.dispatchEvent(new Event("game-save-recovered"))}catch(_){}
      return true;
    }

    try{
      const raw=localStorage.getItem(key);
      if(raw!==null){
        try{
          state=prepare(raw);
        }catch(primaryError){
          rejectedPrimaries.add(key);
          console.error("[Tu Tiên Học Đạo] Bản lưu chính bị lỗi; đang thử bản sao lưu.",primaryError);
          if(!recoverBackup())throw primaryError;
        }
      }else if(!recoverBackup()){
        console.info("[Tu Tiên Học Đạo] Chưa có dữ liệu lưu; bắt đầu tiến trình mới.");
      }
    }catch(error){
      blockedKeys.add(key);
      console.error("[Tu Tiên Học Đạo] Không thể đọc dữ liệu đã lưu hoặc bản sao lưu. Giữ trạng thái mặc định để tránh nạp dữ liệu lỗi.",error);
    }
    return state;
  }

  function save(key,state){
    if(blockedKeys.has(key)||!validSave(state)){
      console.error("[Tu Tiên Học Đạo] Tạm khóa lưu để bảo toàn dữ liệu lỗi hoặc trạng thái không hợp lệ.");
      try{global.dispatchEvent(new Event("game-save-error"))}catch(_){}
      return false;
    }
    const backupKey=key+".backup";
    try{
      const current=localStorage.getItem(key);
      if(current){
        try{
          const parsed=JSON.parse(current);
          if(!rejectedPrimaries.has(key)&&validSave(parsed)&&localStorage.getItem(backupKey)!==current)
            localStorage.setItem(backupKey,current);
        }catch(backupError){
          console.warn("[Tu Tiên Học Đạo] Bỏ qua việc sao lưu vì bản lưu hiện tại không hợp lệ.",backupError);
        }
      }
    }catch(backupError){
      console.warn("[Tu Tiên Học Đạo] Không thể tạo bản sao lưu tự động.",backupError);
    }

    let ok=true;
    try{
      localStorage.setItem(key,JSON.stringify(state));
      rejectedPrimaries.delete(key);
    }catch(error){
      ok=false;
      console.error("[Tu Tiên Học Đạo] Lưu thất bại. Hãy xuất bản sao lưu và kiểm tra dung lượng bộ nhớ.",error);
      try{global.dispatchEvent(new Event("game-save-error"))}catch(_){}
    }
    if(ok)try{global.NTsave&&global.NTsave()}catch(error){
      console.warn("[Tu Tiên Học Đạo] Không thể lưu trạng thái thông báo.",error);
    }
    return ok;
  }

  global.GameStorage=Object.freeze({load,save,validSave,parseBackup,exportData,importData,recoveryData,isWriteBlocked:key=>blockedKeys.has(key)});
})(window);
