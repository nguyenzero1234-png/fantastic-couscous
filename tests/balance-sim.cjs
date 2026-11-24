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
