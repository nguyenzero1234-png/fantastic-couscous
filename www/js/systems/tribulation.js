/* Thiên kiếp, nhật/tuần kiếp, thưởng, Mệnh và luân hồi. */
(function(root){
 "use strict";
 function recoveryProgress(state,today){
  const mission=state.menhRecovery;
  if(!mission||mission.claimed)return 0;
  return Object.entries(state.hist||{}).filter(([day,entry])=>day>mission.start&&day<=today&&(entry.m||0)>=60).length;
 }
 function trialRows(state,day,week,realm,kmet){
  const days=Array.from({length:7},(_,i)=>{const d=new Date(week+"T00:00:00");d.setDate(d.getDate()+i);return d.toLocaleDateString("sv")});
  const scale=(1+.2*realm)*(state.ln===day?.75:1),hash=[...day].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7),variation=1+(Math.abs(hash)%3)*.25;
  const daily=[["Hạ Kiếp","m",Math.round(30*scale*variation/5)*5,20,"phút tu luyện"],["Trung Kiếp","m",Math.round(60*scale*variation/5)*5,35,"phút tu luyện"],["Thượng Kiếp","l",Math.round(45*scale*variation/5)*5,60,"phút học liền một phiên"]];
  const weekly=[["Tuần Kiếp","m",Math.round(360*scale/30)*30,150,"phút tu luyện"],["Cần Kiếp","d",5,120,"ngày có tu luyện"],["Thiên Lôi Kiếp","m",Math.round(720*scale/30)*30,220,"phút tu luyện"]];
  const metrics=dates=>state.kf===day?{m:99999,d:7,l:999}:kmet(dates);
  const rows=(prefix,date,definitions,met)=>definitions.map(([name,kind,target,reward,unit],i)=>({name,target,reward,unit,key:prefix+date+i,progress:met[kind]||0}));
  return {daily:rows("d",day,daily,metrics([day])),weekly:rows("w",week,weekly,metrics(days))};
 }
 function create(deps){
  const {S,EX,exD,KD,KS,B,SP,sc,playerXpAt,immuneTaiHu,vlog,bxp,spKn,kh,khNpc,spE,streakAt,SPQ,ri,gr,daoTam,spRetire,save}=deps;
  const hs=deps.hash,getSalt=deps.getSalt,showTdLenh=deps.showTdLenh,showExModal=deps.showExModal,schedule=deps.schedule;
  const buildRecord=deps.buildRecord,buildRec=deps.buildRecord,burst=deps.burst,sfx=deps.sfx,setSalt=deps.setSalt,weekStart=deps.weekStart,LeaderboardSimulation=deps.LeaderboardSimulation,LeaderboardUI=deps.LeaderboardUI,setProfileIndex=deps.setProfileIndex,chkLegacy=deps.chkLegacy,render=deps.render,showThd=deps.showThd;
  function resolveEx(){
  if(!S.sem)S.sem={res:{}};
  const now=Date.now();let ch=0,pending=null;
  EX.forEach((e,ei)=>{
    const d=exD(e);if(now<d||S.sem.res[e.id])return;
    // Không cho thiên kiếp vượt quá ngày KD của kiếp hiện tại
    if(e.day>=(S.cycleDays||KD))return;
    // dn: mốc thời gian của kiếp (bù phần thời gian bị tua tay bằng Thiên Đạo Lệnh); dv: ngày tương ứng trên lịch ảo của nhật ký
    const dn=d.getTime()+(KS().skx||0),dv=new Date(dn+(S.dOff||0)*864e5);
    // Thiên phú Bất Diệt Kim Thân (Giang Thừa Ảnh): 70% kích hoạt mỗi thiên kiếp, nhận chênh lệch với hạng 5 (30% số lần kích hoạt: hạng 2)
    {const gi=B.findIndex(b=>b.n==="Giang Thừa Ảnh");
     if(gi>=0&&S.lb&&Math.abs(hs(gi+1+getSalt(),310,ei))<.7){
       const k=Math.abs(hs(gi+1+getSalt(),311,ei))<.3?2:5;
       {const x0=(dn-S.lb.t0)/SP;if(!S.lb.gb)S.lb.gb=[];if(!S.lb.gb.some(g=>g.ex===e.id))S.lb.gb.push({ex:e.id,x0,x1:x0+5*1440,m:k===2?.2:.1})}
       const bd=B.map((b,j)=>({j,s:sc(j,dn)}));bd.push({j:-1,s:playerXpAt(dv)});bd.sort((a,b)=>b.s-a.s);
        const me=bd.find(z=>z.j===gi),tg=bd[k-1],immune=!!tg&&immuneTaiHu(tg.j),dl=tg&&tg.j!==gi&&!immune?Math.max(0,tg.s-me.s):0;
       if(dl>0){S.lb.adj[gi]=(S.lb.adj[gi]||0)+dl;if(!S.lb.spx)S.lb.spx={};S.lb.spx[gi]=(S.lb.spx[gi]||0)+dl}
        vlog("Bất Diệt Kim Thân: Giang Thừa Ảnh kích hoạt ở "+e.n+", "+(immune?"Cố Thái Hư miễn nhiễm phần chênh lệch; Giang không nhận linh lực chênh lệch.":dl>0?"nhận +"+Math.round(dl)+" linh lực, ngang hạng "+k:"đã đứng trên hạng "+k+" nên không nhận thêm")+". Tốc độ học +"+(k===2?20:10)+"% trong 5 ngày.");
     }}
    const rows=B.map((b,i)=>{const xp=bxp(i,dn),sk=spKn(i,e);return{n:b.n,xp,sp:sk,s:khNpc(xp,spE(e,sk))}});
    const ux=playerXpAt(dv);
    const stk=streakAt(dv,!!(KS().skx||KS().skd||(Date.now()-d.getTime())<3*864e5));
    {const psk=(S.sp&&S.sp.ex===e.id)?S.sp.k:-1,pe=spE(e,psk);rows.push({n:S.name||"Bạn",u:1,xp:ux,st:stk,sp:psk,s:kh(ux,pe,daoTam(stk,pe))})}
    rows.forEach(r=>{r.ok=ri(r.xp/(r.sp===2?SPQ[2].f:1))>=e.need;r.g=gr(r.s)});
    // Xếp hạng: điểm đánh giá cao hơn đứng trên; bằng điểm thì tu vi (linh lực) cao hơn đứng trên
    rows.sort((a,b)=>b.s-a.s||b.xp-a.xp);
    const me0=rows.find(r=>r.u);
    let menhLoss=0;
    if(!me0.ok||me0.g==="Yếu"){
      // Chuỗi thất bại tăng trừ Mệnh: +25% mỗi lần fail liên tiếp (tối đa ×2.5)
      S.failStreak=(S.failStreak||0)+1;
      const streakMul=Math.min(2.5,1+0.25*(S.failStreak-1));
      menhLoss=Math.round((10*e.w+(!me0.ok?6:0))*streakMul);
      S.menh=Math.max(0,(S.menh??100)-menhLoss);
      S.menhRecovery={start:deps.today(),claimed:false,days:S.menhRecovery?.days||[]};
      vlog("Kiếp nạn "+e.n+": trừ "+menhLoss+" Mệnh (chuỗi fail ×"+S.failStreak+", còn "+S.menh+")");
      if(S.menh<=0){
        S.menh=0;
        S.tdStacks=(S.tdStacks||0)+1;
        S.tdPenalty=true;
        schedule(()=>showTdLenh(),600);
      }
    }else{
      S.failStreak=0;
      if(me0.ok&&me0.g!=="Yếu"&&["Xuất sắc","Giỏi","Khá"].includes(me0.g)){S.life=S.life||{};S.life.exOk=(S.life.exOk||0)+1}
    }
    S.sem.res[e.id]={rows,claimed:false,loss:0,menhLoss,seen:false};spRetire(e,dn);ch=1;
    if(!pending)pending=e;
  });
  if(ch)save();
  // Bắt buộc xem bảng thiên kiếp trước khi chơi tiếp
  if(pending&&!S.exLock){S.exLock=pending.id;schedule(()=>showExModal(pending),300)}
}
  function doRebirth(){
  const rec=buildRec();if(S.studyReport)rec.studyReport=root.GameAnalytics.archiveReport(S);if(S.subjects)rec.subjects=root.GameSubjects.archive(S);if(S.technique)rec.techniques=root.GameTechniques.archive(S);(S.rbh||(S.rbh=[])).push(rec);
  if(rec.anXa){S.tdPenalty=false;S.tdStacks=0;S.failStreak=0;S.life=S.life||{};S.life.anXa=1;vlog("Thiên Đạo Ân Xá: Trừng Phạt và chuỗi fail đã được xóa bỏ.");burst();sfx(880)}
  if(rec.grade==="Viên Mãn Xuất Chúng"||rec.grade==="Xuất Sắc"){S.life=S.life||{};S.life.excel=1}
  if(S.sect!=null){S.life=S.life||{};S.life.sectN=(S.life.sectN||0)+1}
  // legacy + life + ui + name + god + tut + diary prefs keep
  S.rb=(S.rb||0)+1;
  S.storyLog=[];S.storyFlags={};delete S.npcAffinity;S.points=0;S.hist={};S.cnt={};S.stl=[];S.rm=0;S.pk=0;S.tm=0;S.kc={};S.kst=null;KS();
  deps.applyNextCycle?.();
  S.studyReport=root.GameAnalytics.newReport(S);
  root.GameSubjects.reset(S);
  root.GameTechniques.reset(S);
  S.menh=100;S.failStreak=0;S.menhRecovery=null;S.nightStudy={};
  setSalt(S.rb*7919);S.thdAsk=0;S.sem=null;S.exLock=null;S.fx=[];S.buff={n:0,m:1};S.xb=null;S.tb=null;S.sh=null;S.sl=0;S.lt=0;S.ln=null;S.kd=null;S.eb=0;S.pw=0;S.master=null;
  S.inv={};S.pets={};S.act=null;S.tt={};S.title=null;S.nw=null;S.sect=null;S.gameSec=0;S.timers={focus:null,play:null};S.streak={n:0,last:""};
  S.quests=[];S.chains=[];S.claimed={};S.sched={};S.ev={w:{h:10,r:100},m:{h:40,r:500}};S.sm=null;
  if(S.lb){S.lb.t0=Date.now();S.lb.adj=Array(50).fill(0);S.lb.bal=Array(50).fill(0);S.lb.week=weekStart();S.lb.log="";S.lb.sp={};S.lb.spx={};S.lb.spl=[];S.lb.gb=[];S.lb.dv=[];S.lb.hh=[];S.lb.td=[]}
  S.bal=0
  S.sp=null;
  LeaderboardSimulation.reset();LeaderboardUI.reset();setProfileIndex();
  vlog("Luân hồi lần "+S.rb+". Mọi thứ của kiếp trước đã trở về hư không.");
  chkLegacy();
  save();render();showThd(rec);sfx(392);schedule(()=>sfx(659),150);
}

  function simulateExam(id){
    const ex=EX.find(z=>z.id===id);
    if(!ex)return;
    if(!S.tma){
      if(S.sh)S.sh=0;
      else if(Math.random()<0.5){S.tma=1;S.tmaTasks=0}
    }
    const xp=deps.uxp(),kind=(S.sp&&S.sp.ex===ex.id)?S.sp.k:-1,ee=spE(ex,kind);
    const score=kh(xp,ee,daoTam(streakAt(new Date(),true),ee));
    save();render();
    deps.say("Diễn kiếp "+ex.n+": "+score+" điểm ("+gr(score)+"). "+(ri(xp/(kind===2?SPQ[2].f:1))>=ex.need?"Đủ tu vi độ kiếp.":"Chưa đủ tu vi."));
  }
  function claimRecovery(){
    if(recoveryProgress(S,deps.today())<3)return false;
    S.menhRecovery.claimed=true;
    const days=Object.keys(S.hist||{}).filter(day=>day>S.menhRecovery.start&&day<=deps.today()&&(S.hist[day].m||0)>=60).sort().slice(0,3);
    S.menhRecovery.days=[...new Set([...(S.menhRecovery.days||[]),...days])];
    S.menh=Math.min(100,(S.menh??100)+15);
    vlog("Tĩnh Tâm Dưỡng Mệnh: hoàn thành ba ngày tu luyện, hồi 15 Mệnh.");
    save();render();deps.say("Tĩnh Tâm Dưỡng Mệnh hoàn thành. Mệnh hiện tại: "+S.menh+"/100.");
    return true;
  }
  function claimExam(id){
    const ex=EX.find(z=>z.id===id),r=S.sem&&S.sem.res[id];
    if(!ex||!r||r.claimed)return;
    const me=r.rows.find(z=>z.u);
    if(!me||!me.ok||me.g==="Yếu")return;
    const pts=deps.eventGain(deps.RW[me.g]*ex.w);
    r.claimed=true;S.points+=pts;root.GameAnalytics.recordPoints(S,pts,false,deps.today());deps.hAdd(deps.today(),pts,0);
    if(me.g==="Xuất sắc")S.inv.bm=(S.inv.bm||0)+1;
    save();render();
    deps.say("Nhận thưởng "+ex.n+": +"+pts+" linh lực"+(me.g==="Xuất sắc"?" và 1 Tích Cốc Đan":"")+".");
  }
  function claimTrial(key){
    const {petBuff,eqT,today,lifeStats,modGain,hAdd,say}=deps;
    const rows=trialRows(S,today(),weekStart(),ri(deps.uxp()),deps.kmet);
    const trial=[...rows.daily,...rows.weekly].find(row=>row.key===key);
    if(!trial||trial.progress<trial.target)return false;
    const KC=S.kc||(S.kc={}),pre=key.slice(0,11);
    if(KC[key])return;
    const r=trial.reward+(petBuff().kp||0)+(eqT("n14")?25:0)+(S.kd===today()?30:0);
    KC[key]=1;
    const life=lifeStats();life.kn=(life.kn||0)+1;
    const rr=modGain(r);S.points+=rr;root.GameAnalytics.recordPoints(S,rr,false,today());hAdd(today(),rr,0);
    let message="Vượt kiếp thành công: +"+rr+" linh lực.";
    if([0,1,2].every(index=>KC[pre+index])){
      if(key[0]==="d"){
        const bonus=modGain(30);S.points+=bonus;root.GameAnalytics.recordPoints(S,bonus,false,today());hAdd(today(),bonus,0);
        message+=" Vượt đủ ba kiếp, thêm +"+bonus+" linh lực.";
      }else{S.inv.ca=(S.inv.ca||0)+1;message+=" Nhận 1 Tỉnh Thần Linh Trà."}
    }
    save();render();say(message);
  }
  return Object.freeze({resolveEx,doRebirth,simulateExam,claimExam,claimTrial,claimRecovery});
 }
 root.GameTribulationSystem=Object.freeze({create,recoveryProgress,trialRows});
})(typeof window!=="undefined"?window:globalThis);
