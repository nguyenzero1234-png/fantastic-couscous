/* UI lịch học, chuỗi nhiệm vụ, điểm danh và kỳ ngộ. */
(function(root){
 "use strict";
 function create(deps){
  const {S,nowHM,today,tm,isDone,sq,rn,ITEMS,nwS,$}=deps;
  const esc=deps.escapeHtml,expired=deps.isExpired,unlocked=deps.isUnlocked,stepRow=deps.renderStepRow;
  const getLQ=deps.getLQ,getLP=deps.getLP,lval=deps.lval,lpk=deps.lpk;
  const getFortunes=deps.getFortunes,studyMinutes=deps.studyMinutes,remaining=deps.remaining,fortuneEffects=deps.fortuneEffects,dayStr=deps.dayStr,formatTime=deps.formatTime,getCheckinRewards=deps.getCheckinRewards,itemIcons=deps.itemIcons;
  function renderSchedule(){
  const now=nowHM(),day=(S.sched[today()]||[]).slice().sort((a,b)=>a.s<b.s?-1:1);
  const v=$("lq").value;
  $("lq").innerHTML="<option value=\"\">Chọn nhiệm vụ (tùy chọn)</option>"+S.quests.filter(q=>!isDone(q)&&!expired(q)&&(!q.chain||unlocked(q))).map(q=>`<option value="${q.id}">${esc(q.name)} (+${q.pts})</option>`).join("");
  $("lq").value=v;
  const cur=day.find(x=>now>=x.s&&now<x.e),nxt=day.find(x=>x.s>now);
  let h=`<span class="lbl">Bây giờ, ${now}</span>`;
  if(cur){const q=sq(cur),d=q&&isDone(q);
    h+=`<h2 style="font-size:20px;margin:4px 0">${esc(rn(cur))}</h2><small>${cur.s} - ${cur.e}, còn ${tm(cur.e)-tm(now)} phút${d?", đã hoàn thành":""}</small>`;
    if(q&&!d&&!expired(q))h+=`<div class="row"><button class="btn" data-a="t" data-id="${q.id}">Hoàn thành</button>${q.mins?`<button class="btn alt" data-a="p" data-id="${q.id}" style="margin-left:0">Học</button>`:""}</div>`;
  }else h+=`<h2 style="font-size:20px;margin:4px 0">Không có việc trong khung giờ này</h2><small>${nxt?"Kế tiếp "+nxt.s+": "+esc(rn(nxt)):"Hôm nay chưa có lịch phía sau"}</small>`;
  $("now").innerHTML=h;
  $("nowbar").hidden=!cur;if(cur)$("nowbar").textContent="Bây giờ ("+cur.s+" - "+cur.e+"): "+rn(cur);
  $("slots").innerHTML=day.length?day.map(x=>{const q=sq(x),d=q&&isDone(q);
    return `<li class="${now>=x.e?"past":now>=x.s?"now":""}${d?" done":""}">${q&&!d&&!expired(q)?`<button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành"></button>`:d?`<button class="tick" disabled>✓</button>`:""}<div class="nm">${esc(rn(x))}<small>${x.s} - ${x.e}</small></div><button class="del" data-a="ld" data-id="${x.id}" aria-label="Xóa khỏi lịch">×</button></li>`}).join("")
    :`<li class="empty" style="display:block">Chưa có lịch hôm nay. Thêm khung giờ hoặc bấm Tự xếp lịch.</li>`;
}
  function renderChains(){
  $("chains").innerHTML=S.chains.length?S.chains.map(c=>{
    const st=S.quests.filter(x=>x.chain===c.id),d=st.filter(isDone).length;
    return `<div class="box"><div class="row" style="margin:0"><h2 style="flex:1">${esc(c.name)}</h2><span class="pb">${c.paid?"Xong +"+c.bonus:d+"/"+st.length+" · còn "+st.filter(x=>!isDone(x)).reduce((t,x)=>t+(x.mins||0),0)+"p"}</span><button class="del" data-a="cd" data-id="${c.id}" aria-label="Xóa chuỗi">×</button></div><div class="bar"><i style="width:${st.length?Math.round(d/st.length*100):0}%"></i></div><ul style="margin-top:8px">${st.map((q,i)=>stepRow(q,!st.slice(0,i).every(isDone))).join("")}</ul></div>`}).join("")
  :`<div class="empty">Chưa có chuỗi. Tạo chuỗi đầu tiên ở phía trên.</div>`;
}
  function checkinFortuneSummary(){
  const T=today(),c=S.ci||{last:"",n:0},act=(c.last===T||c.last===dayStr(1))?c.n:0,done=c.last===T,now=Date.now();
  let h=`<div class="box"><h2>Điểm danh</h2><small>Điểm danh liên tiếp 7 ngày, ngày thứ 7 thưởng lớn.</small><div class="days7">${getCheckinRewards().map((r,j)=>`<div class="d7 ${j<act?"on":""}"><b>${j+1}</b>+${r[0]}${r[1]?"<br>"+itemIcons[r[1]]:""}</div>`).join("")}</div><button class="btn" style="margin-left:0" data-a="ci" ${done?"disabled":""}>${done?"Đã điểm danh hôm nay":"Điểm danh"}</button></div>`;
  const L=getFortunes();
  h+=`<div class="box"><h2>Kỳ ngộ gần đây</h2><small>Cơ duyên xuất hiện bất ngờ, khoảng 1 đến 2 lần mỗi ngày. Học đủ phút trong khung giờ để nhận thưởng.</small><ul>${L.length?L.map(o=>{const m=studyMinutes(o),got=S.claimed["o:"+o.h];
    return `<li><div class="nm">${o.name}<small>${formatTime(o.st)}: học ${o.T} phút trong ${o.W} giờ, ${Math.min(m,o.T)}/${o.T} phút</small></div><span class="pb">+${o.pts}</span>${got?"<small>Đã nhận</small>":m>=o.T?`<button class="btn" data-a="kc" data-id="${o.h}">Nhận</button>`:o.en>now?"<small>Đang diễn ra</small>":"<small>Bỏ lỡ</small>"}</li>`}).join(""):`<li class="empty" style="display:block">Chưa có kỳ ngộ nào gần đây. Hãy mở app thường xuyên.</li>`}</ul></div>`;
  return h;
  }
  function renderFortunes(){
  const now=Date.now(),L=getFortunes().filter(o=>o.en>now||(studyMinutes(o)>=o.T&&!S.claimed["o:"+o.h]));
  let h=L.map(o=>{const m=studyMinutes(o),ok=m>=o.T,got=S.claimed["o:"+o.h];
    return `<div class="kn"><div class="row" style="margin:0"><b style="flex:1;font-family:var(--serif)">Kỳ ngộ: ${o.name}${nwS().k[o.h]?"":'<span class="nd" title="Mới"></span>'}</b><span class="pb">+${o.pts}</span></div><small>${o.desc}</small><div style="margin-top:6px;font-size:14px">Học ${o.T} phút trong ${o.W} giờ ${o.en>now?"(còn "+remaining(o.en)+")":"(đã hết hạn)"}. Đã học ${Math.min(m,o.T)}/${o.T} phút. Thêm: ${fortuneEffects[o.k]}.</div><div class="bar"><i style="width:${Math.min(100,Math.round(m/o.T*100))}%"></i></div><button class="btn" style="margin-left:0" data-a="kc" data-id="${o.h}" ${ok&&!got?"":"disabled"}>${got?"Đã nhận":ok?"Nhận thưởng":"Hoàn thành nhiệm vụ để tích phút"}</button></div>`}).join("");
  if(S.streak.last===dayStr(1)&&S.streak.n>=2&&new Date().getHours()>=18)h+=`<div class="kn" style="border-color:var(--red)"><b>Chuỗi ${S.streak.n} ngày học sắp đứt!</b><br><small>Học trước nửa đêm để giữ chuỗi. Đứt chuỗi (≥2 ngày) sẽ bị <b>tâm ma</b> xâm nhập.</small></div>`;
  $("kn").innerHTML=h;
  }
  function renderDailyMissions(){
  const LQ=getLQ(),LP=getLP();
  $("lenh").innerHTML=checkinFortuneSummary()+["d","w","m"].map(p=>`<div class="box"><h2>${LP[p][0]}</h2><small>${LP[p][1]}</small><ul>${LQ.filter(t=>t.per===p).map(t=>{const raw=lval(t),v=Math.min(raw,t.tg),got=S.claimed["q:"+t.id+":"+lpk(p)];
    return `<li style="display:block"><div class="row" style="margin:0"><b style="flex:1">${t.n}</b><span class="pb">+${t.r}${t.it?" và "+ITEMS.find(i=>i.id===t.it).n:""}</span></div><small>${t.desc}: ${Math.round(v)}/${t.tg}${t.met==="m"?" phút":""}</small><div class="bar"><i style="width:${Math.round(v/t.tg*100)}%"></i></div><div class="row" style="margin:0"><button class="btn" data-a="lc" data-id="${t.id}" ${got||raw<t.tg?"disabled":""}>${got?"Đã nhận":"Nhận thưởng"}</button></div></li>`}).join("")}</ul></div>`).join("");
}
  function renderQuests(){
    const rem=remaining;
  const qs=S.quests.filter(x=>!x.chain).sort((a,b)=>(isDone(a)||expired(a))-(isDone(b)||expired(b)));
  $("list").innerHTML=qs.length?qs.map(q=>{const d=isDone(q);
    return `<li class="${d?"done":expired(q)?"exp":""}"><button class="tick" data-a="t" data-id="${q.id}" aria-label="${d?"Bỏ hoàn thành":"Hoàn thành"}">${d?"✓":""}</button><div class="nm">${esc(q.name)}<small>${[q.due&&!d?(expired(q)?"hết hạn":"nhanh, còn "+rem(q.due)):"",q.mins?q.mins+" phút":"",q.repeat?"lặp lại mỗi ngày":""].filter(Boolean).join(", ")}</small></div>${!d&&q.mins&&!expired(q)?`<button class="play" data-a="p" data-id="${q.id}">Học</button>`:""}${expired(q)?`<button class="play" data-a="rn" data-id="${q.id}">Tạo lại</button>`:""}<span class="pb">+${d?(q.got??q.pts):q.pts}</span><button class="del" data-a="d" data-id="${q.id}" aria-label="Xóa nhiệm vụ">×</button></li>`}).join("")
    :`<li class="empty" style="display:block">Chưa có nhiệm vụ. Thêm việc học đầu tiên ở phía trên.</li>`;
  }
  function bindQuestEvents(){
    const {dur,calc,save,refresh,renderMore,say,hAdd,finish,undoQuest,startFocus,GameTimer,GameQuestData,templates,document,navigator,prompt,setTimeout,clearTimeout}=deps;
    const {PN,PLAN,AI_PROMPT,CHAIN_PROMPT,SCHED_PROMPT,PRESET_MIX,DEF_Q,DEF_C,DEF_S}=templates;
function addQuest(){
  const name=$("nm").value.trim();
  const mins=dur(),pts=calc();
  if(!name){say("Hãy nhập tên nhiệm vụ.");$("nm").focus();return}
  const qv=$("nq").value,due=qv===""?0:(qv==="0"?new Date().setHours(23,59,59,999):Date.now()+qv*3600000);
  S.quests.push({id:Date.now().toString(36),name,pts,mins,due,repeat:qv===""&&$("nr").checked,doneOn:null});
  $("nm").value="";say("Đã thêm nhiệm vụ.");save();refresh();
}

$("add").onclick=addQuest;
$("nm").onkeydown=e=>{if(e.key==="Enter")addQuest()};



function parseBulkLine(line){return GameQuestData.parseBulkLine(line,{perHour:S.perHour||200,now:Date.now,random:Math.random})}
function importBulkQuests(){
  const raw=$("qbulk").value||"",result=GameQuestData.importBulk(raw,{perHour:S.perHour||200,now:Date.now,random:Math.random});
  if(!result.total){say("Chưa có dòng nào để nhập.");return}
  const added=result.quests;
  if(!added.length){say("Không đọc được nhiệm vụ. Kiểm tra mẫu: Tên | phút");return}
  S.quests.push(...added);
  $("qbulk").value="";
  if($("qbulkhint"))$("qbulkhint").textContent="Đã nhập "+added.length+" nhiệm vụ.";
  save();refresh();say("Đã nhập "+added.length+" nhiệm vụ từ bộ dán.");
}
function exportQuestsText(){
  const result=GameQuestData.exportOpen(S.quests,{now:Date.now(),isDone:q=>isDone(q),isExpired:q=>expired(q)}),qs=result.quests;
  if(!qs.length){say("Không có nhiệm vụ đang mở để xuất.");return}
  const text=result.text;
  $("qbulk").value=text;
  try{navigator.clipboard.writeText(text)}catch(e){}
  if($("qbulkhint"))$("qbulkhint").textContent="Đã xuất "+qs.length+" nhiệm vụ (cũng đã chép nếu trình duyệt cho phép).";
  say("Đã xuất "+qs.length+" nhiệm vụ ra ô dán.");
}
$("qbulkin").onclick=importBulkQuests;
const cpy=(t,m)=>{const ok=()=>say(m||"Đã chép prompt AI. Dán vào ChatGPT/Claude, điền các mục [ ], rồi dán kết quả vào app.");
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,()=>fb());else fb();
  function fb(){const a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();let r=false;try{r=document.execCommand("copy")}catch(e){}a.remove();say(r?(m||"Đã chép prompt AI."):"Trình duyệt chặn chép. Hãy thử lại hoặc dùng HTTPS.")}};
$("qbulkcp").onclick=()=>cpy(AI_PROMPT);
$("ccp").onclick=()=>cpy(CHAIN_PROMPT);
$("lcp").onclick=()=>cpy(SCHED_PROMPT);
function addDefQ(){let n=0;DEF_Q.split("\n").forEach(l=>{const q=parseBulkLine(l);if(!q||S.quests.some(x=>x.name===q.name&&!isDone(x)))return;S.quests.push(q);n++});return n}
$("qdef").onclick=()=>{const n=addDefQ();if(n){save();refresh()}say(n?"Đã thêm "+n+" nhiệm vụ mặc định.":"Nhiệm vụ mặc định đã có sẵn trong danh sách.")};

$("cdef").onclick=()=>{const n=GameQuestData.addPresetChains(S,DEF_C);if(n){save();refresh()}say(n?"Đã thêm "+n+" chuỗi mẫu.":"Các chuỗi mẫu đã có rồi.")};

$("ldef").onclick=()=>{addDefQ();save();refresh();$("lbulk").value=DEF_S;root.GameWeeklySchedule.importSchedule()};
{const cut=new Date(Date.now()-30*864e5).toLocaleDateString("sv");Object.keys(S.sched||{}).forEach(k=>{if(k<cut)delete S.sched[k]})}
let _ud=null,_ut=0;
$("und").onclick=()=>{if(_ud){S.quests.push(_ud);_ud=null;$("und").hidden=true;save();refresh();say("Đã khôi phục nhiệm vụ.")}};
$("list").addEventListener("click",e=>{const n=e.target.closest(".nm");if(!n||e.target.closest("button"))return;
  const li=n.closest("li"),id=li&&li.querySelector("[data-id]")&&li.querySelector("[data-id]").dataset.id,q=S.quests.find(x=>x.id===id);
  if(!q||isDone(q)||q.chain)return;
  if(GameTimer.activeFocus()===q){say("Hãy kết thúc hoặc hủy phiên học trước khi sửa.");return}
  if(q.completion?.undone&&(!q.repeat||q.completion.day===today())){say("Lượt học đã hoàn tác giữ nguyên phần thưởng và thời lượng. Hãy khôi phục hoặc tạo nhiệm vụ mới.");return}
  const v=prompt("Sửa nhiệm vụ: Tên | phút",q.name+" | "+(q.mins||30));if(v==null)return;
  const p=v.split("|"),nm=(p[0]||"").trim().slice(0,80);if(!nm)return;
  const mi=Math.min(480,Math.max(5,parseInt(p[1])||q.mins||30));
  q.name=nm;q.mins=mi;q.pts=Math.max(1,Math.round(mi/60*S.perHour*(q.diff||1)));save();refresh();say("Đã sửa nhiệm vụ.")});
$("qbulkex").onclick=exportQuestsText;
$("qbulkmix").onclick=()=>{
  $("qbulk").value=PRESET_MIX;
  if($("qbulkhint"))$("qbulkhint").textContent="Đã nạp 21 nhiệm vụ mẫu (VSTEP + Code + NCKH + môn khác). Sửa nếu cần rồi bấm Nhập bộ nhiệm vụ.";
  say("Đã nạp bộ VSTEP + Code + NCKH vào ô dán. Bấm Nhập để thêm vào danh sách.");
};
$("list").onclick=$("chains").onclick=$("slots").onclick=$("now").onclick=e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.a==="cd"){if(GameTimer.activeFocus()?.chain===b.dataset.id)GameTimer.cancelFocus();S.chains=S.chains.filter(c=>c.id!==b.dataset.id);S.quests=S.quests.filter(x=>x.chain!==b.dataset.id);save();refresh();say("Đã xóa chuỗi.");return}
  const q=S.quests.find(x=>x.id===b.dataset.id);if(!q)return;
  if(b.dataset.a!=="d"&&b.dataset.a!=="rn"){
    if(q.chain&&!isDone(q)&&!unlocked(q)){say("Hãy hoàn thành bước trước.");return}
    if(q.chain&&isDone(q)){say("Bước của chuỗi không thể hoàn tác.");return}
    if(expired(q)){say("Nhiệm vụ nhanh đã hết hạn. Hãy xóa hoặc tạo lại.");return}
  }
  if(b.dataset.a==="rn"){if(GameTimer.activeFocus()===q){say("Hãy kết thúc hoặc hủy phiên học trước khi tạo lại.");return}q.due=0;q.pts=Math.max(1,Math.round((q.mins||30)/60*S.perHour*(q.diff||1)));save();refresh();say("Đã tạo lại, không còn hạn.");return}
  if(b.dataset.a==="d"){if(GameTimer.activeFocus()===q)GameTimer.cancelFocus();S.quests=S.quests.filter(x=>x!==q);if(!q.chain){_ud=q;$("und").hidden=false;clearTimeout(_ut);_ut=setTimeout(()=>{$("und").hidden=true;_ud=null},8000)}say("Đã xóa nhiệm vụ.")}
  else if(b.dataset.a==="p"){startFocus(q);return}
  else if(isDone(q)){const result=undoQuest(q);if(!result.ok){say(result.reason);return}say("Đã bỏ hoàn thành, trừ "+result.gain+" linh lực.")}
  else{if(!finish(q))return;say("Hoàn thành! +"+q.got+" linh lực"+(q.got>q.pts?" (có thưởng chuỗi ngày học)":"")+".")}
  save();refresh();
};


document.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>{
  const k=b.dataset.plan;
  if(S.chains.some(c=>c.name===PN[k])){say("Bạn đã có chuỗi này rồi.");return}
  const id="c"+Date.now().toString(36)+k;
  S.chains.push({id,name:PN[k],paid:false,bonus:0});
  PLAN[k].forEach((l,i)=>{const [n,m]=l.split("|"),mins=+m;S.quests.push({id:id+i,name:"Tuần "+(i+1)+": "+n,pts:Math.max(1,Math.round(mins/60*S.perHour)),mins,chain:id,doneOn:null})});
  save();refresh();say("Đã tạo chuỗi 15 tuần ở bên dưới.");
});
$("tpl").onclick=e=>{const b=e.target.closest("[data-tn]");if(!b)return;$("nm").value=b.dataset.tn;$("nd").value=b.dataset.tm;renderMore()};
$("cadd").onclick=()=>{
  let raw=$("cs").value.split("\n").map(s=>s.trim()).filter(Boolean);
  const mt=raw.length&&raw[0].match(/^t[êe]n chu[ỗo]i\s*:\s*(.+)/i);
  if(mt){if(!$("cn").value.trim())$("cn").value=mt[1].slice(0,60);raw=raw.slice(1)}
  const name=$("cn").value.trim();
  const lines=raw.filter(l=>!l.startsWith("#")).slice(0,15);
  const count=GameQuestData.addChain(S,name,lines,"c"+Date.now().toString(36));
  if(!count){say("Cần tên chuỗi và ít nhất 2 bước, mỗi bước một dòng.");return}
  $("cn").value=$("cs").value="";save();refresh();say("Đã tạo chuỗi "+count+" bước.");
};
  }
  return Object.freeze({renderQuests,bindQuestEvents,renderSchedule,renderChains,renderDailyMissions,renderFortunes,checkinFortuneSummary});
 }
 root.GameActivityUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
