/* Central game state: loading, schema defaults, migrations and persistence. */
(function(root){
  "use strict";
  const KEY="quest-study-v1";
  const DEFAULTS={
    quests:[],points:0,gameSec:0,timers:{focus:null,play:null},rate:2,perHour:280,
    streak:{last:"",n:0},hist:{},chains:[],
    ev:{w:{h:10,r:100},m:{h:40,r:500}},claimed:{},inv:{},
    buff:{n:0,m:1},title:"",sched:{},lb:null,sem:null,
    menh:100,tdPenalty:false,failStreak:0,tdStacks:0,
    dailyBought:{},tmTasks:0,tmaTasks:0,tcCharges:0,
    petReveal:null,petEvolution:null
  };
  function migrate(state){
    const S=state;
    S.schemaVersion=2;
    if(!S.studyReport)S.studyReport=root.GameAnalytics.newReport(S);
    if(!S.studyReport.sinceDay)S.studyReport.sinceDay=new Date(S.studyReport.since+(S.dOff||0)*864e5).toLocaleDateString("sv");
    if(!S.timers)S.timers={focus:null,play:null};
    if(!S.ph200){S.ph200=1;}
    // Only migrate the previous default; custom study rates remain user-controlled.
    if(!S.balanceStage2C){if(S.perHour===200)S.perHour=280;S.balanceStage2C=1;}
    if(!S.nightStudy)S.nightStudy={};
    if(S.menh==null)S.menh=100;
    if(S.tdPenalty==null)S.tdPenalty=false;
    if(S.failStreak==null)S.failStreak=0;
    if(S.tdStacks==null)S.tdStacks=0;
    if(!S.dailyBought)S.dailyBought={};
    if(S.tmTasks==null)S.tmTasks=0;
    if(S.tmaTasks==null)S.tmaTasks=0;
    if(S.tcCharges==null)S.tcCharges=0;
    if(S._balCleared==null){
      if(S.lb&&S.lb.bal)S.lb.bal=Array(50).fill(0);
      S.bal=0;S._balCleared=1;
    }
    if(!S.ui)S.ui={skin:"classic",density:"normal",fs:"md",theme:"auto"};
    if(S.fb&&S.fb.n>0)(S.fx=S.fx||[]).push({n:S.fb.n,v:S.fb.v,t:""});
    delete S.fb;
    return S;
  }
  function create(options){
    const opts=options||{},storage=opts.storage||root.GameStorage;
    const key=opts.key||KEY;
    const defaults=()=>JSON.parse(JSON.stringify(opts.defaults||DEFAULTS));
    const normalize=parsed=>migrate(Object.assign(defaults(),parsed));
    const state=migrate(storage.load(key,defaults(),normalize));
    if(opts.applyUI!==false&&root.GameUI&&root.GameUI.apply)root.GameUI.apply(state);
    let importing=false;
    function importBackup(raw){
      const imported=storage.importData(key,raw,normalize);
      importing=true;
      return imported;
    }
    return {key,state,importBackup,isWriteBlocked:()=>!!storage.isWriteBlocked?.(key),recoveryData:()=>storage.recoveryData(key),save:()=>importing?false:storage.save(key,state)};
  }
  root.GameState={KEY,DEFAULTS,migrate,create};
})(typeof window!=="undefined"?window:globalThis);
