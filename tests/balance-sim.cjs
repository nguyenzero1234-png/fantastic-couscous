// Reproducible comparison of study-only progression before and after Stage 2C.
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {execFileSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const baseline="stage2-pre-balance-b0811e3";
function load(ref){
  const window={};
  const ctx=vm.createContext({window,Date,Math});
  for(const file of ["data/progression-data.js","systems/rewards.js"]){
    const name="www/js/"+file;
    const source=ref?execFileSync("git",["show",ref+":"+name],{cwd:root,encoding:"utf8"}):fs.readFileSync(path.join(root,name),"utf8");
    vm.runInContext(source,ctx,{filename:name});
  }
  return {P:window.GameProgressData,R:window.GameRewards};
}
function simulate({P,R},rate,hours,{rest=0,spend=0,catchup=1,recovery=false}={}){
  const S={points:0,streak:{n:0},hist:{},cnt:{},menh:100,tdPenalty:false,tdStacks:0,failStreak:0};
  let passes=0,active=0,studyMinutes=0,healed=0,lastFailure=-1;
  const ri=x=>P.realmIndex(x,P.RL);
  const factors=()=>R.rewardFactors({...S,balanced:catchup>1,balMult:catchup},0);
  for(let day=0;day<P.KD;day++){
    const date=new Date(Date.UTC(2026,0,1+day)).toISOString().slice(0,10);
    if(rest&&((day+1)%rest===0))S.streak.n=0;
    else{
      active++;S.streak.n++;
      S.hist[date]={m:0};S.cnt[date]=0;
      for(let hour=0;hour<hours;hour++){
        const bonus=R.questBonus({mins:60},{S,petBuff:()=>({}),masterBuff:()=>({}),hourNow:()=>15,today:()=>date,ri,uxp:()=>S.points,hasTitle:()=>false,myRk:()=>20,spK:()=>-1,SPQ:[]});
        const result=R.questCompletionReward(rate,R.streakMultiplier(S.streak.n,bonus.cap)*bonus.mult,bonus.flat,0,[],factors(),null,60);
        S.points+=result.gain;S.hist[date].m+=60;S.cnt[date]++;studyMinutes+=60;
      }
      S.points=Math.max(0,S.points-spend);
      if(recovery&&lastFailure>=0&&day>lastFailure&&++healed===3)S.menh=Math.min(100,S.menh+15);
    }
    for(const exam of P.EX.filter(e=>e.day===day)){
      const ok=ri(S.points)>=exam.need;
      const grade=P.grade(P.examScore(S.points,exam,P.taoTamProgress(S.streak.n,exam)));
      if(ok&&grade!=="Yếu"){
        passes++;S.failStreak=0;
        S.points+=R.eventGain(P.RW[grade]*exam.w,0,factors()).gain;
      }else{
        S.failStreak++;S.menh=Math.max(0,S.menh-Math.round((10*exam.w+(ok?0:6))*Math.min(2.5,1+.25*(S.failStreak-1))));
        if(S.menh===0){S.tdPenalty=true;S.tdStacks++}
        lastFailure=day;healed=0;
      }
    }
  }
  return {hours,rate,active,studyMinutes,points:S.points,realm:P.RL[ri(S.points)][0],passes,menh:S.menh};
}
function legacy(){
const old=load(baseline),current=load();
for(const hours of [1,2,3,4,6]){
  console.log(JSON.stringify({scenario:"study-only",before:simulate(old,200,hours),after:simulate(current,280,hours)}));
}
for(const [scenario,options] of [
  ["recovery",{recovery:true}],["weekly-rest",{rest:7,recovery:true}],["spend-60-min-play",{spend:120,recovery:true}],["catchup-upper-bound",{catchup:1.25,recovery:true}]
]){
  console.log(JSON.stringify({scenario,after:simulate(current,280,2,options)}));
}

for(const days of current.P.CYCLE_DAYS){
  const cycle=current.P.cycleConfig(days);
  const scenario={P:{...current.P,KD:cycle.days,END:cycle.end,RL:cycle.realms,EX:cycle.exams},R:current.R};
  for(const hours of [2,4,6])console.log(JSON.stringify({scenario:"cycle-length",days,end:cycle.end,...simulate(scenario,280,hours)}));
}
}

// Run the game itself with a deterministic local clock. The simulation bypasses
// DOM rendering but preserves the state transitions normally run by render().
function fullSimulation(profile,days){
  const {createContext,jsDir,scripts,nodes,storage}=require("./game-fixture.cjs");
  nodes.clear();storage.clear();
  let now=new Date(2026,0,5,0,0,0).getTime(),seed=123456789;
  class Clock extends Date {
    constructor(...args){super(...(args.length?args:[now]))}
    static now(){return now}
  }
  const random=Object.create(Math);
  random.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const context=createContext({Date:Clock,Math:random,__balanceHeadless:true});
  const run=code=>vm.runInContext(code,context);
  run("globalThis.window=globalThis");
  for(const name of scripts){
    let source=fs.readFileSync(path.join(jsDir,name),"utf8");
    if(name==="game.js"){
      const marker="function render(){";
      if(!source.includes(marker))throw Error("Game render entry point changed");
      source=source.replace(marker,marker+"\n  if(globalThis.__balanceHeadless){lbInit();settle();resolveEx();brk();chkT();checkStreakBreak();KS().pk=Math.max(KS().pk,S.points);return;}");
    }
    vm.runInContext(source,context,{filename:name});
  }
  if(days!==119)run(`S.nextCycleDays=${days};applyNextCycle()`);
  for(let life=0;life<(profile.lives||1);life++){
    const persona=life>=4&&profile.recoveryHours?{...profile,hours:profile.recoveryHours,irregular:false,deadlines:false,leisure:0,tea:profile.recoveryTea}:profile;
    const start=now;
    let missed=0,expiredTasks=0,balancedDays=0,recoveries=0,teaUsed=0,nightMinutes=0;
    const startingStacks=run("S.tdStacks||0");
    const startBalance=run("GameRewards.balanceMultiplier(S.rb||0)");
    const setClock=(day,hour,minute=0)=>{
      const d=new Date(start);d.setDate(d.getDate()+day);d.setHours(hour,minute,0,0);now=d.getTime();
    };
    const examsAtNoon=day=>{
      setClock(day,12);
      run("resolveEx();for(const e of EX){const r=S.sem?.res[e.id];if(r&&!r.seen){r.seen=true;S.exLock=null;TribulationSystem.claimExam(e.id)}}");
    };
    for(let day=0;day<days;day++){
      const studyStart=persona.night?0:persona.early?8:13;
      setClock(day,Math.min(8,studyStart));run("render()");
      if(run("playerBalanced()"))balancedDays++;
      // Both paired day/night scenarios study before the same local-noon exam.
      if(studyStart>=12)examsAtNoon(day);
      const rest=persona.irregular&&day%7>=5;
      if(rest){missed+=persona.hours;continue}
      setClock(day,studyStart);run("checkin()");
      if(persona.tea&&run("(S.inv.ca||0)>0||ItemSystem.buy('ca')")&&run("ItemSystem.use('ca')"))teaUsed++;
      const minutes=persona.split||60;
      const tasks=persona.hours*60/minutes;
      for(let task=0;task<tasks;task++){
        const end=studyStart*60+(task+1)*minutes;
        setClock(day,Math.floor(end/60),end%60);
        const deadline=!!persona.deadlines;
        const skip=deadline&&day%7===4&&task===tasks-1;
        const q={id:`sim-${life}-${day}-${task}`,name:"Study",mins:minutes,diff:1,deadlineKind:deadline?"1":"",repeat:false,doneOn:null,due:deadline?now+(skip?-1:60000):null};
        context.simQuest=q;
        const completed=run("(()=>{const q=simQuest;q.pts=GameQuestData.basePoints(q.mins,S.perHour,q.diff,q.deadlineKind);S.quests.push(q);if(expired(q))return false;return finish(q,Date.now())})()");
        if(!completed){missed++;expiredTasks++;continue}
        if(persona.undo&&task===0){
          const ok=run("(()=>{const p=S.points;undoQuest(simQuest);finish(simQuest,Date.now());return p===S.points})()");
          if(!ok)throw Error("Undo/redo changed net points");
        }
        run("brk();chkT();KS().pk=Math.max(KS().pk,S.points)");
      }
      run("(()=>{const rows=GameTribulationSystem.trialRows(S,today(),weekStart(),ri(uxp()),kmet);for(const row of [...rows.daily,...rows.weekly])if(row.progress>=row.target)TribulationSystem.claimTrial(row.key)})()");
      if(run("TribulationSystem.claimRecovery()"))recoveries++;
      if(persona.leisure){context.leisureMinutes=persona.leisure;run("$('mins').value=String(leisureMinutes);$('buy').onclick()")}
      nightMinutes=run("Object.values(S.nightStudy||{}).reduce((a,b)=>a+b,0)");
      if(run("Object.values(S.nightStudy||{}).some(x=>x>120)"))throw Error("Night reward exceeded 120 minutes");
      if(studyStart<12)examsAtNoon(day);
    }
    setClock(days,0);run("render()");
    const result=run(`(()=>{const report=GameAnalytics.archiveReport(S).totals;const exams=EX.map(e=>{const r=S.sem?.res[e.id],me=r?.rows.find(x=>x.u);return {day:e.day,score:me?.s??null,grade:me?.g??null,pass:!!(me?.ok&&me.g!=="Yếu"),xp:me?.xp??null,menhLoss:r?.menhLoss??0}});return {life:(S.rb||0)+1,days:KD,points:S.points,peak:KS().pk,rank:myRk(),realm:rname(S.points),menh:S.menh,stacks:S.tdStacks||0,streak:KS().ms,demons:KS().tm,passes:exams.filter(e=>e.pass).length,exams,report,amnesty:buildRec().anXa}})()`);
    console.log(JSON.stringify({scenario:persona.name,startingStacks,startBalance,balancedDays,recoveries,teaUsed,missed,expiredTasks,nightMinutes,...result}));
    if(life+1<(profile.lives||1))run("doRebirth()");
  }
}

const personas=[
  {name:"beginner",hours:1},
  {name:"steady",hours:2,leisure:60,tea:true},
  {name:"steady-save",hours:2,tea:true},
  {name:"irregular",hours:2,irregular:true,deadlines:true,leisure:60,lives:4},
  {name:"consistent",hours:4,tea:true},
  {name:"split",hours:1,split:5,undo:true},
  {name:"night",hours:3,night:true},
  {name:"day",hours:3,early:true}
];
if(process.argv.includes("--full")){
  const option=name=>process.argv[process.argv.indexOf(name)+1];
  const days=process.argv.includes("--days")?Number(option("--days")):119;
  const irregular=personas.find(p=>p.name==="irregular");
  const recovery=[[1,true],[1,false],[2,true],[2,false],[4,true]].map(([hours,tea])=>({
    ...irregular,name:`recovery-${hours}h${tea?"":"-no-tea"}`,lives:5,recoveryHours:hours,recoveryTea:tea
  }));
  const selected=process.argv.includes("--scenario")?[...personas,...recovery].filter(p=>p.name===option("--scenario")):personas;
  if(![30,60,90,119].includes(days)||!selected.length)throw Error("Invalid scenario or cycle length");
  for(const persona of selected)fullSimulation(persona,days);
}else legacy();
