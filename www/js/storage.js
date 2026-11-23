/* ===== Lưu trữ tiến trình =====
   Tách riêng đọc/ghi localStorage và sao lưu để game.js tập trung vào gameplay.
   Giữ API toàn cục nhỏ để notify.js và schedule.js (classic scripts) tương thích. */
(function(global){
  "use strict";

  function validSave(value){
    return !!value && typeof value==="object" && !Array.isArray(value) &&
      Array.isArray(value.quests) && typeof value.points==="number" &&
      Number.isFinite(value.points);
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

  function importData(key,raw){
    const state=parseBackup(raw);
    const backupKey=key+".backup";
    const current=localStorage.getItem(key);
    if(current){
      let parsed;
      try{parsed=JSON.parse(current)}catch(_){parsed=null}
      if(validSave(parsed)&&localStorage.getItem(backupKey)!==current){
        // Không ghi đè tiến trình hiện tại nếu không thể bảo toàn bản trước khi nhập.
        localStorage.setItem(backupKey,current);
      }
    }
    const serialized=JSON.stringify(state);
    localStorage.setItem(key,serialized);
    try{global.NTsave&&global.NTsave()}catch(error){
      console.warn("[Tu Tiên Học Đạo] Không thể lưu trạng thái thông báo.",error);
    }
    return state;
  }

  function load(key,defaults){
    const backupKey=key+".backup";
    let state=Object.assign({},defaults);

    function recoverBackup(){
      const backupRaw=localStorage.getItem(backupKey);
      if(!backupRaw)return false;
      const backup=JSON.parse(backupRaw);
      if(!validSave(backup))throw new Error("Backup data is invalid");
      state=Object.assign(state,backup);
      console.warn("[Tu Tiên Học Đạo] Đã khôi phục từ bản sao lưu gần nhất.");
      try{global.dispatchEvent(new Event("game-save-recovered"))}catch(_){}
      return true;
    }

    try{
      const raw=localStorage.getItem(key);
      if(raw){
        try{
          const parsed=JSON.parse(raw);
          if(!validSave(parsed))throw new Error("Save data is invalid");
          state=Object.assign(state,parsed);
        }catch(primaryError){
          console.error("[Tu Tiên Học Đạo] Bản lưu chính bị lỗi; đang thử bản sao lưu.",primaryError);
          if(!recoverBackup())throw primaryError;
        }
      }else if(!recoverBackup()){
        console.info("[Tu Tiên Học Đạo] Chưa có dữ liệu lưu; bắt đầu tiến trình mới.");
      }
    }catch(error){
      console.error("[Tu Tiên Học Đạo] Không thể đọc dữ liệu đã lưu hoặc bản sao lưu. Giữ trạng thái mặc định để tránh nạp dữ liệu lỗi.",error);
    }
    return state;
  }

  function save(key,state){
    const backupKey=key+".backup";
    try{
      const current=localStorage.getItem(key);
      if(current){
        try{
          const parsed=JSON.parse(current);
          if(validSave(parsed)&&localStorage.getItem(backupKey)!==current)
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
    }catch(error){
      ok=false;
      console.error("[Tu Tiên Học Đạo] Lưu thất bại. Hãy xuất bản sao lưu và kiểm tra dung lượng bộ nhớ.",error);
      try{global.dispatchEvent(new Event("game-save-error"))}catch(_){}
    }
    try{global.NTsave&&global.NTsave()}catch(error){
      console.warn("[Tu Tiên Học Đạo] Không thể lưu trạng thái thông báo.",error);
    }
    return ok;
  }

  global.GameStorage=Object.freeze({load,save,validSave,parseBackup,exportData,importData});
})(window);
