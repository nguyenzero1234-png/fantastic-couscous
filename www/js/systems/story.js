/* Story system: mốc truyện, ký lục và nhật ký theo ngày. */
(function(root){
 "use strict";
 function create(deps){
  const {S,GameStoryData,GameDiaryData,today,realmIndex,SECTS,PS,TITLES,say,QT}=deps;
  const prevMemory=deps.previousMemory,tok=deps.isTitleUnlocked,REALM_STORY=GameStoryData.realmStory;
  function storyLog(){return S.storyLog||(S.storyLog=[])}
function storyFlags(){return S.storyFlags||(S.storyFlags={})}
function pushStory(id,title,lines,meta){
  return GameStoryData.append(S,id,title,lines,meta,Date.now(),today());
}
function onRealmUp(from,to){
  for(let k=from+1;k<=to&&k<REALM_STORY.length;k++){
    const st=REALM_STORY[k];if(!st)continue;
    if(pushStory("realm:"+k,"Đột phá · "+st.t,st.lines,{realm:k})){
      try{say("Đạo Văn ghi lại: đột phá "+st.t+".");}catch(e){}
    }
  }
}
function checkFlags(){
  const f=storyFlags();
  // Backfill đột phá đã qua (save cũ) — chỉ ghi một lần
  if(!f.realmBF){f.realmBF=1;const k=ri(S.points||0);if(k>0)onRealmUp(0,k);}
  if(S.sect!=null&&!f.sect){f.sect=1;const n=SECTS[S.sect]?SECTS[S.sect].n:"tông môn";
    pushStory("sect:"+S.sect,"Bái nhập · "+n,[
      "Dưới cờ "+n+", tên ngươi được viết vào sổ tông.",
      "Tông môn không hứa thành tiên. Chỉ hứa có chỗ đứng khi trời đổ mưa.",
      "Ngươi cúi đầu một cái. Đủ."
    ]);}
  if(S.act&&!f.pet){f.pet=1;const pt=PS.find(p=>p.id===S.act);const pn=pt?pt.n:"linh thú";
    pushStory("pet:"+S.act,"Khế ước · "+pn,[
      pn+" nhận linh lực từ ngươi, rồi trả lại bằng sự hiện diện.",
      "Không lời thề. Chỉ có một sợi dây mỏng không đứt khi ngươi quên nhìn.",
      "Càn Khôn túi nhẹ hơn một chút — vì có chỗ cho nó."
    ]);}
  if(S.title&&!f.title){f.title=1;const ti=TITLES.find(t=>t.id===S.title);const tn=ti?ti.n:S.title;
    pushStory("title:"+S.title,"Danh hiệu · 「"+tn+"」",[
      "Người đời bắt đầu gọi ngươi bằng hai chữ không phải tên.",
      "「"+tn+"」. Danh hiệu không nâng tu vi. Nó chỉ nhắc ngươi đã đi qua gì.",
      "Thiên Kiêu Bảng không cần biết. Nhật ký thì ghi."
    ]);}
  if((S.rb||0)>=1&&!f.rb){f.rb=1;
    pushStory("rb:"+S.rb,"Luân hồi · Kiếp "+((S.rb||0)+1),[
      "Bát canh có thể đã nguội. Ký ức thì chưa.",
      "Kiếp trước gập lại. Kiếp này mở trang trắng — trừ vài vết mờ ở góc.",
      prevMemory()||"Thiên Đạo không nhắc. Ngươi tự nhớ."
    ]);}
  S.storyFlags=f;
}

function generateDiary(day){
  const h=S.hist[day]||{p:0,m:0},n=(S.cnt&&S.cnt[day])||0,m=h.m||0,p=h.p||0;
  const isT=day===today(),seed=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);
  const pt=S.act?PS.find(x=>x.id===S.act):null;
  const recent=(S.storyLog||[]).filter(x=>x.day===day).map(x=>x.title);
  const prev=isT&&(S.rb||0)>0&&seed%11===0?prevMemory():null;
  return GameDiaryData.generate(day,{n,m,p},{
    isToday:isT,streak:(S.streak.n||0),tm:!!S.tm,
    sectName:S.sect!=null?SECTS[S.sect].n:null,
    menh:S.menh==null?100:S.menh,
    petName:pt&&pt.n,storyTitles:recent,prevMemory:prev
  },QT);
}
  return Object.freeze({storyLog,storyFlags,pushStory,onRealmUp,checkFlags,generateDiary});
 }
 root.GameStorySystem=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
