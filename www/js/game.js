const KEY=GameState.KEY;
const GameStateHandle=GameState.create();
const S=GameStateHandle.state;
const initialCycle=GameProgressData.cycleConfig(S.cycleDays);
const RL=initialCycle.realms,EX=initialCycle.exams,RW=GameProgressData.RW;
let KD=initialCycle.days,END=initialCycle.end;
function applyNextCycle(){
  const config=GameProgressData.cycleConfig(S.nextCycleDays);
  S.cycleDays=config.days;S.nextCycleDays=config.days;
  KD=config.days;END=config.end;
  RL.splice(0,RL.length,...config.realms);EX.splice(0,EX.length,...config.exams);
  renderSettings();
}
const GameTimer=window.GameTimer.create(S,()=>Date.now());
let timerNoticeKey=GameTimer.notificationKey(),timerDirty=false,lastTimerSave=Date.now(),timerDay=null;
let KSALT=(S.rb||0)*7919;

const save=()=>{
  const key=GameTimer.notificationKey();
  if(key!==timerNoticeKey)timerDirty=true;
  const ok=GameStateHandle.save();
  if(ok){
    document.getElementById("savewarning").hidden=true;
    timerDirty=false;lastTimerSave=Date.now();
    if(key!==timerNoticeKey){timerNoticeKey=key;window.NTforce?.()}
  }
  return ok;
};
function showSaveWarning(){
  const warning=document.getElementById("savewarning");
  warning.hidden=false;
  warning.textContent=GameStateHandle.isWriteBlocked()?"Dữ liệu lưu bị lỗi. Tạm khóa lưu để bảo toàn tiến trình. Mở Cài đặt → Sao lưu để xuất dữ liệu cứu hộ hoặc nhập backup hợp lệ.":"Không thể lưu tiến trình. Hãy xuất backup và kiểm tra bộ nhớ thiết bị.";
}
window.addEventListener("game-save-error",showSaveWarning);
if(GameStateHandle.isWriteBlocked())showSaveWarning();
const SectSystem=GameSectSystem.create({
 state:S,realmIndex:()=>ri(uxp()),lifeStats:()=>LS(),examResults:()=>xr(),save
});
const {sects:SECTS,masters:MASTERS,masterBuff}=SectSystem;
const $=id=>document.getElementById(id);
const today=()=>GameDateData.today(S.dOff||0);
const esc=GameText.escapeHtml;
const isDone=q=>GameQuestData.isDone(q,today());
const pad=GameTimeFormat.pad;
const fmt=GameTimeFormat.formatDuration;
let extra="",tmr=0;
const say=t=>{const m=t+extra;extra="";$("msg").textContent=m;if(!m)return;const el=$("toast");el.textContent=m;el.classList.add("on");clearTimeout(tmr);tmr=setTimeout(()=>el.classList.remove("on"),3800);if(/\+\d|Đột phá|Danh hiệu mới|Hoàn thành/.test(m)&&ri(S.points)<=S.pk&&!FeedbackUI.active())burst()};
function burst(){FeedbackUI.burst()}



const {TITLES,tok,eqT,chkT}=GameItemSystem.createTitles({getState:()=>S,lifeStats:()=>LS(),examResults:()=>xr(),EX,getEnd:()=>END,END:GameProgressData.END,markNew:id=>{nwS().t[id]=1},save,say,schedule:(fn,ms)=>setTimeout(fn,ms)});
// Giá ≈ 2,5–4× giá trị kỳ vọng của hiệu ứng (linh lực / tiện ích)
/* Hệ thống vật phẩm: mọi vật phẩm tăng linh lực đều hoàn lại ít nhất bằng giá mua, phát dần theo nhiệm vụ.
   q:[số giờ học, linh lực cố định mỗi giờ, điều kiện ("" mọi nhiệm vụ, "q" nhiệm vụ nhanh, "l" từ 60 phút)]
   ex: linh lực cộng thêm một lần (ngoài q). u: tác dụng riêng của vật phẩm tiện ích.
   Vật phẩm tăng linh lực thuần: tổng nhận = 2 lần giá. Vật phẩm tiện ích: tác dụng riêng + hoàn lại 1 lần giá.
   Tổng cơ bản = số giờ học × linh lực mỗi giờ + ex. */
const ITEMS=GameItemData.catalog();


const nowHM=GameTimeFormat.currentClock;
const tm=GameTimeFormat.toMinutes;
const hm=GameTimeFormat.toClock;
const sq=x=>S.quests.find(y=>y.id===x.qid);
const {B,BH,F,hs,vn,CDN,isTK,bio,STG,NVC_TITLES}=GameNpcRoster.create(GameNoise.hash,GameNoise.value);
const LeaderboardSimulation=GameLeaderboardSimulation.create({state:S,B,BH,CDN,hash:hs,noise:vn,getSalt:()=>KSALT,getBxp:(...args)=>bxp(...args),leaderboardData:GameLeaderboardData});
const {advance,rkf,lthM,HTC,htReset,htCount,htLate,htExtra,evAt,EC,FL,fl,eff,hrAt,hrs,efTxt,CH,CD,SP,cum,SO,SN,computeSO}=LeaderboardSimulation;
/* Icon SVG tự vẽ — vật phẩm, linh thú, chân dung */
const {IC,AV_NAM,AV_NU,AVATARS,petIcon}=GameIcons;
const portrait=(seed,opts)=>GameIcons.portrait(S,seed,opts);
const avatar=name=>`<span class="av">${portrait(name)}</span>`;
function sectStats(now){return GameSectWar.stats(SECTS.length,B.map((b,i)=>({sect:SO[i],xp:bxp(i,now)})),S.sect,uxp())}
const ugain=(d1,d2)=>GameAnalytics.sumPointsBetween(S.hist,d1,d2);
function warScores(t1,t2,d1,d2){
  const sh=(S.dOff||0)*864e5;t1-=sh;t2-=sh;
  const npc=B.map((b,i)=>({sect:SO[i],gain:Math.max(0,bxp(i,t2)-bxp(i,t1))}));
  const userGain=S.sect!=null?Math.max(0,ugain(d1,d2)):0;
  return GameSectWar.score(SECTS.length,npc,S.sect,userGain,SN);
}
const warPairs=GameSectWar.pairs;
const warFlavor=GameSectWar.flavor;
const sectWarEpoch=Date.parse("2026-01-05T00:00:00");
function warReward(){return GameSectWar.reward({
  state:S,sects:SECTS,weekEnd:sectWarEpoch,scoreWeek:warScores,modGain,hasTitle:()=>eqT("n15"),
  today,addHistory:(day,points,mins)=>hAdd(day,points,mins),log:vlog,
  random:Math.random
});}

function renderProf(){ProfileUI.render()}
function renderSect(){SectUI.render()}
const rkAt=(i,ms)=>{const s=sc(i,ms);let r=1;for(let j=0;j<B.length;j++)if(j!==i&&sc(j,ms)>s)r++;return r};
/* Hạng hiện tại của NPC trên bảng chung (tính cả người chơi, hòa điểm thì NPC đứng trước, khớp thứ tự bảng xếp hạng) */
const rkNow=i=>{const t=Date.now(),s=sc(i,t);let r=1;for(let j=0;j<B.length;j++){if(j===i)continue;const o=sc(j,t);if(o>s||(o===s&&j<i))r++}if(S.points>s)r++;return r};
const myRk=()=>{const t=Date.now();let r=1;for(let i=0;i<B.length;i++)if(sc(i,t)>=S.points)r++;return r};
function vlog(t){(S.vlog||(S.vlog=[])).unshift({t,ts:Date.now()});S.vlog.length=Math.min(S.vlog.length,40)}
function brk(){
  const rr=ri(uxp()),peak=S.pk||0;
  S.rm=rr;S.pk=Math.max(peak,rr);
  if(rr===0)FeedbackUI.clear();
  if(rr<=peak)return;
  StorySystem.onRealmUp(peak,rr);
  vlog("Đột phá tu vi: "+rname(uxp()));
  save();
  FeedbackUI.breakthrough(rr);
}
const fmtT=ms=>GameTimeFormat.eventTimestamp(ms);
function recentEv(index){
  const n0=Math.floor((Date.now()-S.lb.t0)/3600000),L=[];
  for(let i=0;i<B.length;i++){if(index!=null&&i!==index)continue;for(let m=n0-72;m<=n0;m++){const e=evAt(i,m);if(e)L.push(e)}}
  return L.filter(e=>S.lb.t0+(e.m+e.ph)*36e5<=Date.now()).sort((a,b)=>(b.m+b.ph)-(a.m+a.ph));
}
function renderVan(){LeaderboardUI.renderTimeline()}
let _oppStatsUI=null;
function spStatsHtml(){return (_oppStatsUI||(_oppStatsUI=GameOpportunityStatsUI.create({S,B,EX,KN,KX,CDN,SPQ,evAt,knAt,KS,KT0,spA,getKD:()=>KD,getKSALT:()=>KSALT}))).html()}
const xr=()=>S.sem?Object.values(S.sem.res).filter(r=>r.claimed):[];
const ri=x=>GameProgressData.realmIndex(x,RL);
const rname=x=>GameProgressData.realmName(x,RL);

const gr=s=>GameProgressData.grade(s);
const exD=e=>GameDateData.examDate(KS().start,e.day);
const uxp=ds=>ds?GameAnalytics.pointsThrough(S.hist,ds):S.points;
const bxX=(i,x)=>{const k=Math.floor(x);if(k<0)return B[i].p;cum(i,k+1);const f=x-k,d=CD[i];return B[i].p+d[k]*(1-f)+d[k+1]*f};
/* Tu vi của NPC = đúng điểm hiện trên bảng xếp hạng (sc), để cảnh giới và linh lực luôn khớp nhau */
const bxp=(i,ms)=>sc(i,ms);
// Điểm = A·L + bm·D  (A = 100 − bm). L (0..1): phần linh lực, đầy khi linh lực ≥ chuan; D (0..1): đạo tâm = số ngày học/14.
// Đạo tâm cộng tối đa bm điểm (2 → 10, tăng dần theo độ khó của thiên kiếp, không quá 10).
const kh=(xp,e,D)=>GameProgressData.examScore(xp,e,D);
// Điểm NPC (hàm riêng, không dùng chung với người chơi): chỉ dựa vào linh lực, thang 0..100.
// Cùng đường cong L như kh() nhưng nhân 100 thay vì A, nên NPC đạt 100 khi linh lực ≥ mốc viên mãn (chuan).
const khNpc=(xp,e)=>GameProgressData.npcExamScore(xp,e);
// Chỉ hiện ở chế độ god: điều kiện để đạt 100 điểm
function exCond(e){return GameProgressData.examConditions(e,kh,rname)}
const exGod=e=>S.god?`<small style="display:block;margin-top:6px;color:var(--gold);line-height:1.5"><b>[God] Điều kiện đạt 100:</b><br>${exCond(e).join("<br>")}</small>`:"";
// Đạo tâm: số ngày (trong 14 ngày trước kiếp) có học, tính từ nhật ký HOẶC chuỗi ngày liên tiếp đang có.
const actDays=(d,cur)=>GameProgressData.activeDays(S.hist,S.streak,d,cur,today());
// Linh lực người chơi tại ngày dv: lịch sử đến ngày đó + phần linh lực không có trong nhật ký (đặt tay).
// Nếu lịch sử đã được tính hết (độ kiếp đúng hạn / hạn đã qua so với dữ liệu) thì dùng đúng linh lực hiện có.
function playerXpAt(dv){return GameProgressData.playerXpAt(S.hist,S.points,dv.toLocaleDateString("sv"))}
// Chuỗi học liên tục (số ngày liên tiếp có học) tính đến ngày d. cur: đang độ kiếp đúng hạn/bị tua → tính đến hôm nay và gộp chuỗi hiện tại (kể cả được Tục Mệnh Phù giữ).
function streakAt(d,cur){return GameProgressData.streakAt(S.hist,S.streak,d,cur,today(),dayStr(1))}
// Đạo tâm 0..1 = chuỗi / chuỗi yêu cầu của kiếp (chuỗi càng dài, kiếp càng cuối càng đòi hỏi nhiều)
const daoTam=(st,e)=>GameProgressData.taoTamProgress(st,e);
function resolveEx(){TribulationSystem.resolveEx()}
function showExModal(e){
  GameExamModal.show({state:S,realmLabels:RL,graceFactor:SPQ[2].f,exGod,save,go,render,findNext:()=>EX.find(x=>S.sem&&S.sem.res[x.id]&&!S.sem.res[x.id].seen),document,body:document.body,setTimeout},e);
}
function renderExams(){TribulationUI.render()}
function renderLb(){LeaderboardUI.render()}
const rn=x=>x.qid&&sq(x)?sq(x).name:x.label;
const rem=t=>GameTimeFormat.remaining(t,Date.now());
const expired=q=>GameQuestData.isExpired(q,isDone,Date.now());
const weekStart=()=>GameDateData.weekStart(S.dOff||0);
const sumMins=f=>GameAnalytics.sumMinutes(S.hist,f);
const evCur=p=>p==="w"?sumMins(k=>k>=weekStart()&&k<=today()):sumMins(k=>k.slice(0,7)===today().slice(0,7));
const unlocked=q=>GameQuestData.isUnlocked(S.quests,q,isDone);
const stepRow=(q,lock)=>{const d=isDone(q);return `<li class="${d?"done":""}${lock?" lock":""}"><button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành bước">${d?"✓":lock?"🔒":""}</button><div class="nm">${esc(q.name)}<small>${q.mins} phút${GameSubjects.find(S,q.subjectId)?" · "+esc(GameSubjects.find(S,q.subjectId).name):""}</small></div>${!d&&!lock?`<button class="play" data-a="p" data-id="${q.id}">Học</button>`:""}<span class="pb">+${d?(q.got??q.pts):q.pts}</span></li>`};
function renderLich(){if(window.GameWeeklySchedule)window.GameWeeklySchedule.render();else ActivityUI.renderSchedule()}
function renderShop(){InventoryUI.render()}
function renderChains(){ActivityUI.renderChains()}
var FO={};
function fold(k,t,b,o){return `<details class="fold" data-k="${k}"${(FO[k]===undefined?o:FO[k])?" open":""}><summary>${t}</summary>${b}</details>`}
function renderEvents(){EventsUI.render()}
function hAdd(d,p,m){const h=S.hist[d]||(S.hist[d]={p:0,m:0});h.p=Math.max(0,h.p+p);h.m=Math.max(0,h.m+m)}
// Trừng Phạt xếp chồng: mỗi lần hết Mệnh +1 stack, −5% mỗi stack (tối đa −30%)
function tdMult(){return S.tdPenalty?Math.max(0.7,1-0.05*Math.max(1,S.tdStacks||1)):1}
function balMult(){return playerBalanced()?GameRewards.balanceMultiplier(S.rb):1}
function rewardFactors(){return GameRewards.rewardFactors({tdPenalty:S.tdPenalty,tdStacks:S.tdStacks,balanced:playerBalanced(),balMult:balMult(),tm:S.tm,tma:S.tma,cbUntil:S.cbUntil},Date.now())}
function modGain(n){return GameRewards.modGain(n,rewardFactors())}
function eventGain(n){const r=GameRewards.eventGain(n,S.tcCharges,rewardFactors());S.tcCharges=r.charges;if(r.exhausted)extra+=" Thiên Cơ Lệnh đã dùng hết 4 lần.";return r.gain}
function addPts(n,mins,day){
  const before=ri(S.points||0);
  const g=modGain(n);if(!g&&!mins)return 0;
  S.points+=g;GameAnalytics.recordPoints(S,g,false,day||today());hAdd(day||today(),g,mins||0);
  const after=ri(S.points||0);
  if(after>before){try{onRealmUp(before,after);}catch(e){}}
  return g;
}
function showTdLenh(){TribulationUI.showTdLenh()}
const dayStr=o=>GameDateData.dayOffset(S.dOff||0,o);
const dur=()=>Math.min(480,Math.max(5,parseInt($("nd").value)||0));
const calc=()=>GameQuestData.basePoints(dur(),S.perHour,parseFloat($("nl").value)||1,$("nq").value);
function finish(q,completedAt){
  const before=ri(S.points);
  const completed=GameQuestCompletion.finish(q, {
    S, today, dayStr, GameTimer, GameStreak, KS,
    extraGet:()=>extra, extraSet:value=>{extra=value;}, vlog, TB, LS, petBuff,
    GameRewards, eqT, rewardFactors, hourNow, ITEMS, myRk, hAdd, rname, uxp, isDone, completedAt
  });
  if(completed&&ri(S.points)>before)onRealmUp(before,ri(S.points));
  return completed;
}
function undoQuest(q){return GameQuestCompletion.undo(q,{S,isDone,LS,hAdd})}
function startFocus(q){
  reconcileTimers();
  if(isDone(q)){say("Nhiệm vụ đã hoàn thành.");return}
  if(expired(q)||(q.chain&&!unlocked(q))){say("Nhiệm vụ đã hết hạn hoặc chưa mở khóa.");return}
  if(!Number.isFinite(q.mins)||q.mins<=0){say("Nhiệm vụ chưa có thời lượng học hợp lệ.");return}
  if(!GameTimer.startFocus(q,q.mins*60000)){say("Đang có một phiên học. Hãy hủy hoặc chờ xong.");return}
  timerDirty=true;save();say("Bắt đầu học: "+q.name);render();return true;
}
const MapUI=GameMapUI.create({S,SECTS,escapeHtml:esc,rank:()=>myRk(),navigate:(...args)=>go(...args),render:()=>render(),$});
function renderMap(){MapUI.render()}
const LoreUI=GameLoreUI.create({SECTS,$,chapterStatus:()=>GameWorldChronicle.chapters(S),worldStatus:()=>{
  const now=Date.now();
  let leaderIndex=-1,highest=S.points,rank=1;
  for(let i=0;i<B.length;i++){
    const points=sc(i,now);
    if(points>=S.points)rank++;
    if(points>highest||(points===highest&&leaderIndex===-1)){
      highest=points;leaderIndex=i;
    }
  }
  const leader=leaderIndex<0?S.name||"Đạo hữu":B[leaderIndex].n;
  const leaderSect=SECTS[leaderIndex<0?S.sect:SO[leaderIndex]]?.n||"Tán tu";
  return {name:S.name||"Đạo hữu",realm:rname(uxp()),life:(S.rb||0)+1,day:Math.max(1,Math.min(KD,Math.floor(kAge())+1)),days:KD,rank,leader,leaderSect,exams:Object.keys(S.sem?.res||{}).length,penalty:S.tdPenalty,latest:S.storyLog?.at(-1)?.title};
}});
function renderLore(){LoreUI.render()}
function renderMore(){
  renderChains();renderEvents();renderLich();renderShop();renderExams();renderSect();renderLenh();renderHero();renderKn();renderMap();renderGod();renderDiary();renderAch();chkLegacy();renderX();
  renderVisibleScreens();
  SubjectsUI.options();
  ActivityUI.renderQuestPreview();
  if(document.activeElement!==$("ph"))$("ph").value=S.perHour;
  const focusTask=GameTimer.activeFocus();$("focus").hidden=!focusTask;if(focusTask){$("fn").textContent=focusTask.name;$("ft").textContent=fmt(GameTimer.focusRemaining())}
  nwUpdate();
}

function render(){
  lbInit();settle();resolveEx();brk();chkT();
  if(S.exLock&&S.sem&&S.sem.res[S.exLock]&&!S.sem.res[S.exLock].seen&&$("thd").hidden){const e=EX.find(x=>x.id===S.exLock);if(e)showExModal(e)}
  if(kEnd()&&!S.thdAsk&&$("thd").hidden&&!S.exLock){S.thdAsk=1;showThd(buildRec(),1)}
  $("pts").textContent=S.points;
  $("today").textContent="Hôm nay: +"+(S.hist[today()]||{p:0}).p+" linh lực"+(TITLES.some(t=>t.id===S.title&&tok(t))?", danh hiệu "+TITLES.find(t=>t.id===S.title).n:"");
  $("gt").textContent=$("gt2").textContent=fmt(S.gameSec);
  $("run").textContent=GameTimer.isPlaying()?"Tạm dừng":"Khai mở nhàn hạ";
  if(document.activeElement!==$("rate"))$("rate").value=S.rate;
  const m=Math.max(0,parseInt($("mins").value)||0);
  $("cost").textContent="Cần "+LC(m)+" linh lực, tu vi giảm tương ứng";
  ActivityUI.renderQuests();
  StudyPlannerUI.render();
  renderMore();
}

$("rate").oninput=()=>{const v=parseInt($("rate").value);if(v>=1){S.rate=Math.min(500,v);save();render()}};
$("mins").oninput=render;
document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{$("mins").value=b.dataset.m;render()});
$("buy").onclick=()=>{
  reconcileTimers();
  const m=parseInt($("mins").value)||0;if(m<1){say("Nhập số phút muốn đổi.");return}
  const quote=leisureQuote(m),cost=quote.cost;
  if(S.points<cost){say("Chưa đủ linh lực: cần "+cost+", bạn có "+S.points+". Làm thêm nhiệm vụ nhé.");return}
  S.points-=cost;GameAnalytics.recordLeisureCost(S,today(),cost);const bo=quote.bonusSeconds;S.sl=0;S.lt=0;S.gameSec+=m*60+bo;LS().lv=(LS().lv||0)+m;save();render();say("Đã đổi "+cost+" linh lực lấy "+m+" phút chơi"+(bo?" (thêm "+bo+" giây)":"")+".");
};
$("run").onclick=()=>{
  const wasPlaying=GameTimer.isPlaying();reconcileTimers();
  if(wasPlaying&&!GameTimer.isPlaying())return;
  if(!GameTimer.isPlaying()&&S.gameSec<=0){say("Chưa có giờ chơi. Hãy đổi linh lực trước.");return}
  const playing=GameTimer.togglePlay();timerDirty=true;save();say(playing?"Đang tính giờ chơi.":"Đã tạm dừng.");render();
};
function reconcileTimers(flush=false,refresh=true){
  const play=GameTimer.tickPlay();
  const focusChanged=GameTimer.tickFocus();
  timerDirty=timerDirty||play.changed||focusChanged;
  let transition=play.ended;
  const focus=GameTimer.focusSession(),q=GameTimer.activeFocus();
  if(play.ended)say("Hết giờ chơi. Quay lại làm nhiệm vụ nhé.");
  if(focus&&(!q||isDone(q))){
    GameTimer.cancelFocus();transition=true;
  }else if(q&&GameTimer.focusRemaining()===0){
    GameTimer.cancelFocus();transition=true;
    if(finish(q,focus.endAt))say("Học xong "+q.mins+" phút! +"+q.got+" linh lực.");
  }
  timerDirty=timerDirty||transition;
  const now=Date.now();
  if(timerDirty&&(transition||flush||GameTimer.notificationKey()!==timerNoticeKey||now<lastTimerSave||now-lastTimerSave>=15000))save();
  const day=today(),dayChanged=timerDay!==null&&day!==timerDay;
  timerDay=day;
  if((transition||dayChanged)&&refresh)render();
  else{
    $("gt").textContent=$("gt2").textContent=fmt(S.gameSec);
    $("run").textContent=GameTimer.isPlaying()?"Tạm dừng":"Khai mở nhàn hạ";
    if(GameTimer.activeFocus())$("ft").textContent=fmt(GameTimer.focusRemaining());
  }
}
setInterval(()=>reconcileTimers(),500);
document.addEventListener("visibilitychange",()=>reconcileTimers(true));
window.addEventListener("pagehide",()=>reconcileTimers(true));
window.addEventListener("pageshow",()=>reconcileTimers(true));
window.addEventListener("focus",()=>reconcileTimers(true));
$("fx").onclick=()=>{
  reconcileTimers();
  if(!GameTimer.focusSession())return;
  GameTimer.cancelFocus();timerDirty=true;save();say("Đã hủy phiên học, không tính linh lực.");render();
};
setInterval(()=>{if(!$("b").hidden)renderLb()},1000);
setInterval(()=>{if(!$("v").hidden)renderVan()},3000);
setInterval(()=>{if(!$("z").hidden)renderSect()},3000);
const RC=GameCultivationDisplayData.realmColors, QT=GameCultivationDisplayData.quotes;
function renderHero(){ProfileUI.renderHero()}
const KT0=GameFortuneData.epoch, KN=GameFortuneData.events, KX=GameFortuneData.effects;
function knAt(h){
  if(!S.seed)S.seed=1+Math.floor(Math.random()*1e9);
  return GameKiepNanData.create(S.seed,h,KT0,KN,hs);
}
function grantPet(prefer){return GamePetData.grant(S,PS,prefer,{now:Date.now(),random:Math.random,markNew:id=>{nwS().p[id]=1}})}
const kmins=o=>GameAnalytics.sumStudyMinutesBetween(S.stl,o.st,o.en);
function knList(){const now=Date.now(),h0=Math.floor((now-KT0)/36e5),L=[];for(let h=h0-14;h<=h0;h++){const o=knAt(h);if(o&&o.st<=now&&now-o.en<6*36e5)L.push(o)}return L.reverse()}function renderKn(){ActivityUI.renderFortunes()}
function claimKn(h){return RewardClaims.claimFortune(h)}
const CI=[[10],[15],[20,"ca"],[30],[40,"bm"],[60],[120,"the"]];
const RewardClaims=GameRewardClaims.create({S,CI,ITEMS,KX,knAt,kmins,eventGain,hAdd,today,dayStr,modGain,grantPet,vlog,save,render,say,addPts,onPointsChanged:before=>{if(ri(S.points)>ri(before))onRealmUp(ri(before),ri(S.points))},hasBonusTitle:()=>eqT("n16"),random:Math.random});
function checkin(){return RewardClaims.checkin()}
$("kn").onclick=e=>{nwSeenK();const k=e.target.closest("[data-a=kc]");if(k&&!k.disabled)claimKn(+k.dataset.id)};
const StatsUI=GameStatisticsUI.create({S,$,today,dayStr,weekStart,GameAnalytics,GameTimeFormat,fold,uxp,ri,RL,rname,EX,exD,getKD:()=>KD,getKAge:()=>kAge(),bestKiep:()=>bk()});
function renderStats(){StatsUI.render()}
$("stats").onclick=e=>StatsUI.handleClick(e);
const LQ=[
 {id:"d1",n:"Nhật Khóa Tu Luyện",per:"d",met:"m",tg:60,r:20,desc:"Học đủ 60 phút trong ngày"},
 {id:"d2",n:"Dạ Độc Kinh Thư",per:"d",met:"m",tg:120,r:45,desc:"Học đủ 120 phút trong ngày"},
 {id:"d3",n:"Trảm Yêu Trừ Ma",per:"d",met:"c",tg:3,r:25,desc:"Hoàn thành 3 nhiệm vụ trong ngày"},
 {id:"d4",n:"Nhật Nhật Tinh Tiến",per:"d",met:"p",tg:150,r:30,desc:"Kiếm 150 linh lực trong ngày"},
 {id:"w1",n:"Chu Thiên Vận Chuyển",per:"w",met:"m",tg:360,r:80,desc:"Học đủ 6 giờ trong tuần"},
 {id:"w2",n:"Ngũ Nhật Bất Đoạn",per:"w",met:"d",tg:5,r:100,desc:"Học ít nhất 30 phút trong 5 ngày khác nhau"},
 {id:"w3",n:"Phá Quan Thập Tướng",per:"w",met:"c",tg:10,r:90,it:"bm",desc:"Hoàn thành 10 nhiệm vụ trong tuần"},
 {id:"m1",n:"Nguyệt Quan Đại Điển",per:"m",met:"m",tg:1800,r:300,it:"the",desc:"Học đủ 30 giờ trong tháng"},
 {id:"m2",n:"Nhị Thập Nhật Khổ Tu",per:"m",met:"d",tg:20,r:350,desc:"Học ít nhất 30 phút trong 20 ngày khác nhau"},
 {id:"m3",n:"Bách Chiến Bách Thắng",per:"m",met:"c",tg:60,r:300,desc:"Hoàn thành 60 nhiệm vụ trong tháng"}
];
const LP={d:["Nhật khóa","Làm mới mỗi ngày"],w:["Tuần khóa","Làm mới mỗi thứ Hai"],m:["Nguyệt khóa","Làm mới mỗi tháng"]};
const lpk=p=>GameDateData.periodKey(p,today(),weekStart());
function lval(t){return GameAnalytics.questProgress(S.hist,S.cnt,t,today(),weekStart())}
function renderLenh(){ActivityUI.renderDailyMissions()}
$("lenh").onclick=e=>{
  const k=e.target.closest("[data-a=kc],[data-a=ci]");if(k&&!k.disabled){if(k.dataset.a==="kc")claimKn(+k.dataset.id);else checkin();return}
  const b=e.target.closest("[data-a=lc]");if(!b||b.disabled)return;
  const t=LQ.find(x=>x.id===b.dataset.id),ck="q:"+t.id+":"+lpk(t.per);
  if(S.claimed[ck]||lval(t)<t.tg)return;
  S.claimed[ck]=1;const rr=eventGain(evB(t.r));S.eb=0;S.points+=rr;GameAnalytics.recordPoints(S,rr,false,today());hAdd(today(),rr,0);if(t.it)S.inv[t.it]=(S.inv[t.it]||0)+1;
  save();render();say("Hoàn thành "+t.n+": +"+rr+" linh lực"+(t.it?" và 1 "+ITEMS.find(i=>i.id===t.it).n:"")+".");
};
/* Học kỳ bắt đầu đã bị gỡ — thiên kiếp gắn với ngày trong kiếp */
setInterval(()=>{const a=document.activeElement;if(!a||!a.matches("input,select,textarea"))render()},30000);
$("ph").oninput=()=>{const v=parseInt($("ph").value);if(v>=1){S.perHour=Math.min(1000,v);save();renderMore()}};
/* ===== Bản 2: gộp tab, kiếp nạn, linh sủng, Thiên Đạo, sao lưu, âm thanh ===== */
const AudioUI=GameAudio.create(()=>S.snd===0,window);
const sfx=AudioUI.sfx;
const FeedbackUI=GameFeedbackUI.create({document,$,sfx,navigator,schedule:setTimeout,cancel:clearTimeout,matchMedia,realmColors:RC,realmStory:GameStoryData.realmStory});
const clk=AudioUI.clk;
AudioUI.bind(document);
const GR=[
 {id:"u",n:"Tu Luyện",s:[["q","Nhiệm vụ"],["c","Liên hoàn"],["l","Nhật trình"],["subjects","Vạn Pháp"],["study-guide","Hướng dẫn"]]},
 {id:"t",n:"Thiên Kiêu",s:[["b","Bảng"],["f","Thiên diễn"],["v","Vạn Sự Điện"],["z","Tông môn",1],["p","Bản đồ",1]]},
 {id:"w",n:"Thử Thách",s:[["j","Kiếp nạn"],["e","Kỳ sự"],["y","Lệnh bài"],["x","Thiên kiếp",1]]},
 {id:"k",n:"Bảo Khố",s:[["k","Kỳ Bảo"],["i","Càn Khôn"],["r","Nhàn hạ"]]},
 {id:"s",n:"Thiên Thư",s:[["s","Thống kê"],["d","Nhật ký"],["a","Sứ mệnh"],["o","Thiên Cơ Lục"],["g","Thiên Đạo"]]}
];
const GR_SIMPLE=[
 {id:"u",n:"Tu Luyện",s:[["q","Nhiệm vụ"],["l","Nhật trình"],["subjects","Vạn Pháp"],["study-guide","Hướng dẫn"]]},
 {id:"w",n:"Thử Thách",s:[["x","Thiên kiếp",1]]},
 {id:"s",n:"Thiên Thư",s:[["s","Thống kê"],["d","Nhật ký"],["g","Thiên Đạo"]]}
];
const ALLS=["q","c","l","subjects","study-guide","j","e","y","x","b","f","v","z","p","k","i","r","s","o","g","d","a"];
let TG="u",TS="q";
function activeGR(){return (S.ui&&S.ui.studyOnly)?GR_SIMPLE:GR}
/* ===== Chấm đỏ thông báo =====
   Hiện chấm đỏ ở tab (nhóm + mục con) và cạnh từng mục khi có: phần thưởng chưa nhận, danh hiệu mới chưa đeo,
   linh thú mới, kỳ ngộ bất ngờ chưa xem. Trạng thái "mới" lưu ở S.nw (t: danh hiệu, p: linh thú, k: kỳ ngộ đã xem, kt: đã báo). */function nwS(){const n=S.nw||(S.nw={});if(!n.t)n.t={};if(!n.p)n.p={};if(!n.k)n.k={};if(!n.kt)n.kt={};return n}
function renderVisibleScreens(){
  if(!$("o").hidden)renderLore();
  if(!$("q").hidden)StudyPlannerUI.render();
  if(!$("l").hidden){renderLich();StudyPlannerUI.render();renderTodayReview()}
  if(!$("b").hidden)renderLb();
  if(!$("v").hidden)renderVan();
  if(!$("s").hidden)renderStats();
  if(!$("subjects").hidden){SubjectsUI.render();ReviewCardsUI.render();KnowledgeTrialUI.render()}
}
const NavigationUI=GameNavigationUI.create({S,GR,GR_SIMPLE,ALLS,$,document,nwS,knList,save,sfx,say,ri,uxp,renderPet,onNavigate:renderVisibleScreens,schedule:(fn,ms)=>setTimeout(fn,ms)});
function nwUpdate(){NavigationUI.update()}
function nwSeenK(){NavigationUI.seenK()}
function drawNav(){NavigationUI.drawNav()}
function go(g,s){NavigationUI.go(g,s)}
/* Kiếp nạn */
function kmet(days){return GameAnalytics.kiepMetrics(S.hist,S.cnt||{},S.stl||[],days)}
function renderKiep(){TribulationUI.renderKiep()}
/* Linh sủng */
const {PS}=GamePetData;
const petRank=(p,lv)=>GamePetData.rank(p,lv);
if(S.pet&&!S.pets){S.pets={hl:{lv:S.pet.lv+1,t:S.pet.t}};S.act="hl";delete S.pet}
function petBuff(){return GamePetData.buff(S.pets,S.act)}
function petAcc(){return GamePetData.accrued(S.pets,S.act,Date.now(),eqT("n6")?2:0)}
function setAct(id){const g=GamePetData.setActive(S,id,Date.now(),eqT("n6")?2:0);if(g)hAdd(today(),g,0)}
function renderPet(){GamePetUI.render({S,$,PS,petIcon,petRank,nwS,petAcc,save,render,document})}
$("pet").onclick=e=>GamePetUI.handleClick(e,{S,$,PS,petRank,setAct,say,modGain,petAcc,hAdd,today,Date,save,render});

/* Thiên Đạo (godmode) — nhóm gọn, đủ chức năng */
// Đặt chuỗi = n ngày tính đến hôm nay (lịch ảo), đồng bộ nhật ký ngày để streakAt/actDays đọc từ lịch sử vẫn khớp
function setStreak(n){return GameStreak.set(S,n,{today:today(),dayOffset:S.dOff||0,now:Date.now(),lifeStats:()=>LS(),cycleState:()=>KS()})}
const curStreak=()=>GameStreak.current(S.streak,today(),dayStr(1));
const GodModeUI=GameGodModeUI.create({S,$,getCurStreak:curStreak});
function renderGod(){GodModeUI.render()}
function calib(){GodModeSystem.calib()}
function selfCheck(){GodModeSystem.selfCheck()}
function runGod(a,btn){return GodModeSystem.run(a,btn)}
$("lbgod").onclick=e=>{
  const b=e.target.closest("button[data-q]");if(!b||!S.god)return;
  runGod(b.dataset.q==="d"?"day":"st",b);
  save();render();say(b.dataset.q==="d"?"Đã tua thêm 1 ngày.":"Chuỗi: "+curStreak()+" ngày.");
};
$("g").onclick=e=>{
  const b=e.target.closest("button[data-gm]");if(!b||!S.god)return;
  const a=b.dataset.gm,r=runGod(a,b);
  if(r===null){say("Lệnh không nhận diện: "+a);return}
  if(r===false)return;
  save();render();
  say("Đã thi triển: "+b.textContent+".");
};

/* Sao lưu và cài đặt + tùy chỉnh giao diện */
const bx=document.createElement("div");bx.style.display="contents";bx.id="setbox";
const SettingsUI=GameSettingsUI.create({S,fold,container:bx,$,FO,save,refresh:render,drawNav:()=>drawNav(),openGod:()=>go("s","g"),say,sfx:(...args)=>sfx(...args),today,askName,showTut:()=>showTut(),importBackup:GameStateHandle.importBackup,isWriteBlocked:GameStateHandle.isWriteBlocked,recoveryData:GameStateHandle.recoveryData});
function renderSettings(){SettingsUI.render()}
renderSettings();
$("setpanel").appendChild(bx);
SettingsUI.bindEvents();

function checkStreakBreak(){
  // Mất chuỗi vì bỏ ngày (chưa học hôm qua / trước đó) → tâm ma, không cần đợi nhiệm vụ mới
  const decision=GameStreak.checkBreak({last:S.streak.last,streak:S.streak.n,today:today(),yesterday:dayStr(1),twoDaysAgo:dayStr(2),lifeCharm:S.inv&&S.inv.the,heartCharm:!!S.sh,random:Math.random});
  if(!decision)return;
  if(decision.consumeHeartCharm)S.sh=0;
  if(decision.triggerDemon){S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;}
  vlog(decision.log);
  S.streak.n=0;save();
  say(decision.message);
}
function renderX(){
  checkStreakBreak();
  let tb="";
  {const sp=spA();if(sp){const e=EX.find(z=>z.id===sp.ex);tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--gold)"><b style="color:var(--gold)">${SPQ[sp.k].n}</b><br><small>${SPQ[sp.k].pd}. Hiệu lực đến ${e?e.n:"thiên kiếp kế tiếp"}.</small></div>`}}
  if(S.tm)tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--red)"><b style="color:var(--red)">Tâm Ma Tự Thân</b><br><small>Linh lực nhận −20%. Hoàn thành 2 nhiệm vụ, mỗi nhiệm vụ ≥25 phút để trừ ma (${S.tmTasks||0}/2).</small></div>`;if(S.tma)tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--red)"><b style="color:var(--red)">Thiên Ma Nhập Tâm</b><br><small>Linh lực nhận −35%. Hoàn thành 3 nhiệm vụ, mỗi nhiệm vụ ≥45 phút để trừ ma (${S.tmaTasks||0}/3).</small></div>`;
  if(typeof playerBalanced==="function"&&playerBalanced())tb+=`<div class="box" style="margin-bottom:10px;border-color:var(--jade)"><b style="color:var(--jade)">Thiên Đạo Cân Bằng</b><br><small>Hạng ${myRk()} ≥ ${BAL_RANK}: mọi nguồn linh lực ×${balMult()} (+${Math.round((balMult()-1)*100)}%). Vào top ${BAL_RANK-1} thì buff tắt. Không còn phạt đứng cuối bảng.</small></div>`;
  $("tmb").innerHTML=tb;
  renderKiep();renderPet();renderRb();renderRbs();drawNav();KS().pk=Math.max(KS().pk,S.points);
}
/* Chuyển kiếp */
const DEF=()=>({quests:[],points:0,gameSec:0,rate:2,perHour:280,streak:{last:"",n:0},hist:{},chains:[],ev:{w:{h:10,r:100},m:{h:40,r:500}},claimed:{},inv:{},buff:{n:0,m:1},title:"",sched:{},lb:null,sem:null});
const LS=()=>S.ls||(S.ls={q:0,m:0,ni:0,da:0,ru:0,lg:0,kn:0,it:0,top:0,ms:0,tmc:0});
const KS=()=>S.kst||(S.kst={start:Date.now(),pk:0,ms:0,tm:0});

const evB=r=>r+(eqT("t3")?60:0)+(eqT("t5")?20:0)+(S.eb||0);
const leisureQuote=m=>{const p=petBuff();return GameRewards.leisureQuote(m,S.rate,S.sl,masterBuff().dc,p.dc,eqT("n4"),p.mn,eqT("n13"),S.lt)};
const LC=m=>leisureQuote(m).cost;
const hourNow=()=>S.hh!=null?S.hh:new Date().getHours();
const kAge=()=>(Date.now()-KS().start)/864e5;
const kEnd=()=>kAge()>=KD; // kiếp chỉ kết thúc khi hết thời gian
const bk=()=>GameProgressData.bestKiep(S.rbh,KS().pk,S.points,(S.rb||0)+1);

function warGain(){const w=addPts(150+(eqT("n15")?100:0));LS().sw=(LS().sw||0)+1;return w}
function TB(q){
  return GameRewards.questBonus(q,{S,petBuff,masterBuff,hourNow,today,ri,uxp,hasTitle:eqT,myRk,spK,SPQ});
}
function renderRb(){TribulationUI.renderRb()}
function buildRec(){
  return GameRebirthData.buildRecord(S,{
    cycle:KS,now:Date.now,pets:PS,titles:TITLES,isTitleUnlocked:tok,
    milestones:()=>miles(-1),rank:myRk,npcs:B,npcXp:bxp,lifeStats:LS,
    sects:SECTS,end:END,cycleDays:KD,realms:RL,realmName:rname
  });
}
/* ===== Hướng dẫn lần đầu ===== */
const TUT=[
  {t:"Chào mừng đạo hữu",b:"Đây là con đường Tu Tiên Học Đạo: mỗi giờ học thật sẽ hóa thành linh lực, đẩy tu vi lên cao. Bấm Tiếp để biết cách bắt đầu."},
  {t:"Lập nhiệm vụ",b:"Vào Tu Luyện → Nhiệm vụ. Đặt tên việc học, số phút, độ khó — hoàn thành để nhận linh lực. Có mẫu sẵn phía trên."},
  {t:"Linh lực & cảnh giới",b:"Linh lực là tu vi. Đủ mốc sẽ đột phá cảnh giới (Luyện Khí → … → Đại Thừa → Chân Tiên). Tiêu linh lực (đổi bảo vật, nhàn hạ) cũng làm tu vi giảm."},
  {t:"Thiên Kiêu Bảng",b:"Ngươi cạnh tranh với các tu sĩ trên bảng. Học đều để giữ hạng. Tông môn mở từ Trúc Cơ — có bái sư và nhiệm vụ tông."},
  {t:"Thiên kiếp & Mệnh",b:"Theo ngày trong kiếp, thiên kiếp giáng xuống. Thất bại trừ Mệnh; hết Mệnh chịu Trừng Phạt. Phải xác nhận bảng kiếp trước khi chơi tiếp."},
  {t:"Nhật ký & Sứ mệnh",b:"Thiên Thư có Nhật ký đạo hữu và Sứ mệnh xuyên kiếp (chỉ danh hiệu). Cài đặt cho phép chế độ Chỉ học nếu muốn tối giản. Chúc tu luyện thuận lợi."}
];const OnboardingUI=GameOnboardingUI.create({S,AV_NAM,AV_NU,TUT,$,save,render,say,canChooseFirstCycle,chooseFirstCycle,showTutorial:()=>showTut(),schedule:(fn,ms)=>setTimeout(fn,ms)});
function canChooseFirstCycle(){
  return !S.name&&!S.gender&&!S.rb&&!S.points&&!S.tdPenalty&&!S.quests.length&&!Object.keys(S.hist).length&&!Object.keys(S.sem?.res||{}).length&&(!S.kst||kAge()<1);
}
function chooseFirstCycle(days){
  if(!canChooseFirstCycle())return;
  S.nextCycleDays=GameProgressData.validCycleDays(days);
  applyNextCycle();
}
function askName(){OnboardingUI.askName()}
function showTut(){OnboardingUI.showTutorial()}
/* ===== Nhật ký đạo hữu ===== */

/* ===== Đạo Văn · Ký lục đột phá cảnh giới (Story) ===== */
const StorySystem=GameStorySystem.create({S,GameStoryData,GameDiaryData,today,realmIndex:ri,SECTS,PS,TITLES,say,QT,previousMemory:()=>prevMemory(),isTitleUnlocked:tok});
function storyLog(){return StorySystem.storyLog()}
function storyFlags(){return StorySystem.storyFlags()}
function pushStory(...args){return StorySystem.pushStory(...args)}
function onRealmUp(from,to){return StorySystem.onRealmUp(Math.max(from,S.pk||0),to)}
function chkStoryFlags(){return StorySystem.checkFlags()}
function genDiary(day){return StorySystem.generateDiary(day)}
const DiaryUI=GameDiaryUI.create({S,dayStr,today,generateDiary:d=>genDiary(d),checkStoryFlags:()=>chkStoryFlags(),$});
function renderDiary(){DiaryUI.render()}
/* ===== Nhiệm vụ tông môn tuần ===== */
function sectMissions(){return GameSectMissions.list(S,{weekStart,sumMins,Date});}
function claimSectM(id){return GameSectMissions.claim(S,id,{weekStart,sumMins,Date,say,addPts,vlog,save,render});}

const LegacyMissions=GameLegacyMissions.create({S,save,say});
const LEGACY=LegacyMissions.definitions;
function lifeTrack(){return LegacyMissions.lifeTrack()}
function chkLegacy(){return LegacyMissions.check()}
function renderAch(){const el=$("ach");if(el)el.innerHTML=LegacyMissions.render()}

/* ===== Ký ức kiếp trước ===== */
function prevMemory(){return GameRebirthData.previousMemory(S.rbh||[]);}

function showThd(r,ask){TribulationUI.showThd(r,ask)}
function doRebirth(){GameTimer.tickPlay();TribulationSystem.doRebirth();KnowledgeTrialUI.reset()}
const rbx=document.createElement("div");rbx.style.display="contents";rbx.id="rbs";$("sbody").appendChild(rbx);
function renderRbs(){TribulationUI.renderRbs()}
if(!S.name||!S.gender)askName();
else if(!S.tutDone)setTimeout(showTut,400);

/* Thiên diễn */
$("f").innerHTML=`<div class="box"><h2>Thiên Diễn</h2><small>Suy diễn tu vi các tu sĩ sau số ngày bạn nhập, rồi tính bạn cần tu luyện thế nào để giữ hạng hiện tại. Tối đa 90 ngày.</small><div class="row"><label>Sau <input type="number" id="fd" min="1" max="90" value="7"> ngày</label><button class="btn" id="fgo">Diễn toán</button></div></div><div id="fout"></div>`;
function thienDien(){LeaderboardUI.renderForecast()}
$("fgo").onclick=thienDien;
/* Dependency-injected feature modules are created only after their full dependency set is initialized. */
const LeaderboardSystem=GameLeaderboardSystem.create({S,B,KS,save,vlog,simulation:LeaderboardSimulation,leaderboardData:GameLeaderboardData,npcData:GameNpcData,hash:hs,getSalt:()=>KSALT,exams:EX,days:KD,examDate:exD,playerXpAt,weekStart:()=>weekStart(),myRank:myRk,warReward,bxpAt:bxX});
const {SPQ,spA,spK,spKn,spE,nextEx,spUntil,spExtra,lbRows,spRoll,spRetire,BAL_RANK,BAL_MULT,sc,lbInit,playerBalanced,settle,spark,bs,bsX,immuneTaiHu}=LeaderboardSystem;
function miles(i){
  const out=[];
  if(i<0){let c=0,k=0;Object.keys(S.hist).sort().forEach(d=>{c+=S.hist[d].p;while(k<RL.length&&c>=RL[k][1]){out.push([k,new Date(d+"T12:00:00").getTime()]);k++}});return out}
  const now=Date.now(),H=36e5,cur=ri(sc(i,now));let r=0;
  for(let t=S.lb.t0;r<=cur&&r<RL.length;t+=H){const tt=Math.min(t,now);while(r<=cur&&r<RL.length&&sc(i,tt)>=RL[r][1]){out.push([r,tt]);r++}if(tt>=now)break}
  return out;
}
const NpcWorld=GameNpcWorld.create({S,B,hash:hs,today,getKAge:kAge,days:KD,pushStory,save});
const ProfileUI=GameProfileUI.create({S,B,SO,SECTS,TITLES,BH,SP,CDN,HTC,NVC_TITLES,RL,STG,$,uxp,bxp,ri,tok,bio,myRk,rkNow,portrait,isTK,escapeHtml:esc,esc,htCount,htLate,hrs,miles,fmtT,rname,realmColors:RC,quotes:QT,document,prevMemory:()=>prevMemory(),days:KD,getKAge:()=>kAge(),world:NpcWorld,recentEv,efTxt,today});
const SectUI=GameSectUI.create({S,sectStats,warScores,ugain,warPairs,warFlavor,SECTS,MASTERS,sectMissions,weekStart:()=>weekStart(),weekEnd:sectWarEpoch,membership:SectSystem,claimMission:claimSectM,log:vlog,save,refresh:render,say,$});
const LeaderboardUI=GameLeaderboardUI.create({S,B,sc,lbInit,BAL_RANK,BAL_MULT,SECTS,SO,rname,uxp,bxp,ri,spark,AVATARS,KD,$,escapeHtml:esc,portrait,isTopCultivator:i=>isTK(i),renderProfile:()=>renderProf(),getKAge:()=>kAge(),getCurStreak:()=>curStreak(),myRank:myRk,today,dayStr,recentEv,efTxt,hrs,myRk,rkNow,fmtT,hrAt,rkAt,spStatsHtml:()=>spStatsHtml(),world:NpcWorld,save});
const TribulationUI=GameTribulationUI.create({S,uxp,ri,RL,rname,KD,END,EX,exD,spA,SPQ,exGod,modGain,RW,$,today,weekStart:()=>weekStart(),kmet,kAge:()=>kAge(),kEnd:()=>kEnd(),KS,bestKiep:()=>bk(),fold,doRebirth:()=>doRebirth(),say,document,Blob,URL,prompt,simulateExam:id=>TribulationSystem.simulateExam(id),claimExam:id=>TribulationSystem.claimExam(id),claimTrial:key=>TribulationSystem.claimTrial(key),claimRecovery:()=>TribulationSystem.claimRecovery()});
const TribulationSystem=GameTribulationSystem.create({S,EX,exD,KD,KS,B,SP,sc,playerXpAt,immuneTaiHu,vlog,bxp,spKn,kh,khNpc,spE,streakAt,SPQ,ri,gr,daoTam,spRetire,save,hash:hs,getSalt:()=>KSALT,showTdLenh:()=>showTdLenh(),showExModal:e=>showExModal(e),schedule:(fn,ms)=>setTimeout(fn,ms),buildRecord:()=>buildRec(),applyNextCycle,burst,sfx,setSalt:v=>{KSALT=v},weekStart,LeaderboardSimulation,LeaderboardUI,setProfileIndex:ProfileUI.resetSelection,chkLegacy,render,showThd:(...args)=>showThd(...args),uxp,RW,eventGain,modGain,hAdd,today,petBuff,eqT,lifeStats:LS,say,kmet});
const ItemSystem=GameItemSystem.create({S,ITEMS,TITLES,today,petBuff,isTitleUnlocked:tok,hasTitle:eqT,masterBuff,lifeStats:LS,modGain,addHistory:hAdd,say});
const InventoryUI=GameInventoryUI.create({S,today,ITEMS,IC,TITLES,nwS,masters:MASTERS,remaining:rem,$,isTitleUnlocked:tok,itemSystem:ItemSystem,save,render});
const ActivityUI=GameActivityUI.create({S,nowHM,today,tm,isDone,sq,rn,ITEMS,nwS,escapeHtml:esc,isExpired:q=>expired(q),isUnlocked:q=>unlocked(q),renderStepRow:(q,l)=>stepRow(q,l),getLQ:()=>LQ,getLP:()=>LP,lval:t=>lval(t),lpk:p=>lpk(p),getFortunes:()=>knList(),studyMinutes:o=>kmins(o),remaining:t=>rem(t),fortuneEffects:KX,dayStr,formatTime:fmtT,getCheckinRewards:()=>CI,itemIcons:IC,$,dur,calc,rewardFactors,save,refresh:render,say,hAdd,finish,undoQuest,startFocus,GameTimer,GameQuestData,templates:GameQuestTemplates,document,navigator,prompt,setTimeout,clearTimeout});
const StudyPlannerUI=GameStudyPlannerUI.create({hosts:[$("study-plan"),$("today-study")],plan:()=>GameStudyPlanner.recommend({quests:S.quests,slots:window.GameWeeklySchedule?.slotsOf(today())||S.sched[today()]||[],today:today(),now:Date.now(),active:GameTimer.focusSession()}),startFocus,escapeHtml:esc,say});
ActivityUI.bindQuestEvents();
const SubjectsUI=GameSubjectsUI.create({S,$,today,weekStart,escapeHtml:esc,save,refresh:render,say,prompt});
SubjectsUI.bind();
const KnowledgeTrialUI=GameKnowledgeTrialUI.create({S,$,today,escapeHtml:esc,confirm:message=>window.confirm(message),saveReview:cards=>ReviewCardsUI.commit(cards),say});
KnowledgeTrialUI.bind();
const ReviewCardsUI=GameReviewCardsUI.create({S,$,today,escapeHtml:esc,save,say,confirm:message=>window.confirm(message),onChange:KnowledgeTrialUI.render});
ReviewCardsUI.bind();
function renderTodayReview(){
  const count=GameReviewCards.due(S,today()).length;
  $("today-review-count").textContent=count?`${count} thẻ đến hạn`:"Không có thẻ đến hạn";
  $("today-review-open").hidden=!count;
  return count;
}
$("today-review-open").onclick=()=>{
  if(!renderTodayReview())return;
  go("u","subjects");
  $("review-fold").open=true;
  $("review-current").focus();
};
const EventsUI=GameEventsUI.create({S,evCur,ugain,GameAnalytics,dayStr,today,weekStart:()=>weekStart(),escapeHtml:esc,$,save,refresh:render,say,vlog,prompt,modGain,hAdd,TITLES,tok,evB,grantPet,ITEMS});
EventsUI.bindEvents();
const GodModeSystem=GameGodModeSystem.create({S,KD,END,B,cum,CD,ALLS,RL,TITLES,ITEMS,IC,PS,SPQ,SECTS,KEY,today,hAdd,ri,say,doRebirth,showThd,lbInit,weekStart,settle,KS,vlog,resolveEx,warGain,nextEx,spRoll,lbRows,save,renderGod,render,go,askName,sfx,burst,setStreak:v=>setStreak(v),curStreak:()=>curStreak(),kAge:()=>kAge(),storage:localStorage,location,schedule:(fn,ms)=>setTimeout(fn,ms),buildRecord:()=>buildRec(),refreshSettings:renderSettings,resetProgress:()=>GameStateHandle.importBackup(JSON.stringify(GameState.DEFAULTS)),confirm:message=>window.confirm(message),getMaxXp:()=>END,$});

ProfileUI.bindSelection();
TribulationUI.bindEvents();
$("k").onclick=$("i").onclick=InventoryUI.handleClick;
$("lball").onclick=LeaderboardUI.toggleAll;
$("sect").onclick=SectUI.handleClick;
drawNav();

// Existing saves establish their baseline before timer reconciliation can earn new points.
const initialRealm=ri(S.points),initialPeak=Math.max(S.pk||0,S.rm||0,initialRealm);
if(S.pk!==initialPeak||S.rm!==initialRealm){
  StorySystem.onRealmUp(Math.max(S.pk||0,S.rm||0),initialRealm);
  S.pk=initialPeak;S.rm=initialRealm;
  chkStoryFlags();save();
}
reconcileTimers(true,false);
render();

/* Thanh trạng thái hệ thống: nếu trình duyệt không báo vùng an toàn phía trên thì tự chừa chỗ */
(function(){
  const probe=document.createElement("div");probe.style.cssText="position:fixed;top:0;left:0;height:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  const apply=()=>{
    let h=probe.getBoundingClientRect().height;
    const full=matchMedia("(display-mode: standalone)").matches||matchMedia("(display-mode: fullscreen)").matches||navigator.standalone||(matchMedia("(pointer:coarse)").matches&&innerHeight>=screen.height-2);
    if(!h&&full&&matchMedia("(pointer:coarse)").matches)h=28;
    document.documentElement.style.setProperty("--sat",h+"px");
  };
  apply();addEventListener("resize",apply);addEventListener("orientationchange",apply);
})();
