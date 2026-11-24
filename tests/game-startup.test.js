const test=require("node:test");
const assert=require("node:assert/strict");
const path=require("node:path");
const {fs,vm,jsDir,context,html,scripts,createContext,nodes,storage,document,getNode,getReloads}=require("./game-fixture.cjs");
test("game khởi động và xử lý nhiệm vụ, bảo khố, danh hiệu, hồ sơ, tông chiến và thiên kiếp qua UI",()=>{
 for(const name of scripts){
  assert.doesNotThrow(()=>vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),context,{filename:name}),name);
 }
 assert.ok(getNode("gn").innerHTML.length>0,"navigation phải được render trong lần khởi động đầu");
 assert.equal(getNode("lwk").innerHTML.match(/data-ld=/g)?.length,7);

 getNode("nm").value="Ôn JavaScript";
 getNode("nd").value="25";
 getNode("nl").value="1";
 getNode("add").onclick();
 const key=vm.runInContext("GameState.KEY",context);
 const quest=JSON.parse(storage.get(key)).quests[0];
 assert.equal(quest.name,"Ôn JavaScript");
 assert.match(getNode("quest-summary").textContent,/1 đang chờ · 0 hoàn thành/);
 assert.match(getNode("list").innerHTML,/Thưởng cơ bản/);
 const button={dataset:{a:"t",id:quest.id}};
 getNode("list").onclick({target:{closest:()=>button}});
 const saved=JSON.parse(storage.get(key));
 assert.ok(saved.quests[0].got>0);
 assert.match(getNode("quest-summary").textContent,/0 đang chờ · 1 hoàn thành/);
 assert.match(getNode("list").innerHTML,/Đã nhận/);
 assert.match(getNode("list").innerHTML,/Chi tiết linh lực/);
 assert.equal(saved.quests[0].completion.breakdown.adjusted+saved.quests[0].completion.breakdown.itemGain,saved.quests[0].got);
 assert.equal(saved.hist[saved.quests[0].doneOn].m,25);
 getNode("list").onclick({target:{closest:()=>button}});
 const undone=JSON.parse(storage.get(key));
 assert.equal(undone.points,saved.points-saved.quests[0].got);
 assert.equal(undone.hist[saved.quests[0].doneOn].m,0);
 assert.equal(undone.quests[0].completion.undone,true);
 assert.equal(undone.ls.q,saved.ls.q-1);
 getNode("list").onclick({target:{closest:()=>button}});
 const redone=JSON.parse(storage.get(key));
 assert.equal(redone.points,saved.points);
 assert.equal(redone.quests[0].got,saved.quests[0].got);
 assert.deepEqual(redone.quests[0].completion.breakdown,saved.quests[0].completion.breakdown);
 assert.equal(redone.ls.q,saved.ls.q);
 assert.equal(redone.stl.length,saved.stl.length);
 getNode("lb").onclick({target:{closest:()=>({dataset:{pi:"-1"}})}});
 assert.match(getNode("prof").innerHTML,/Lịch sử tu vi/);
 getNode("prof").onclick({target:{closest:()=>true}});
 assert.equal(getNode("prof").innerHTML,"");

 vm.runInContext("S.inv.ca=1",context);
 getNode("i").onclick({target:{closest:()=>({dataset:{a:"use",id:"ca"}})}});
 const afterItem=JSON.parse(storage.get(key));
 assert.equal(afterItem.inv.ca,0);
 assert.equal(afterItem.fx[0].n,2);
 assert.equal(afterItem.ls.it,1);

 getNode("sect").onclick({target:{closest:()=>({dataset:{a:"sj",id:"0"}})}});
 const afterJoin=JSON.parse(storage.get(key));
 assert.equal(afterJoin.sect,0);
 assert.equal(afterJoin.points,afterItem.points);
 const settled=vm.runInContext(`
  S.lb.week=GameDateData.weekStart((S.dOff||0)-7);
  const oldPoints=S.points;
  render();
  ({updatedWeek:S.lb.week===weekStart(),gainedPoints:S.points>oldPoints,log:S.lb.log});
 `,context);
 assert.equal(settled.updatedWeek,true);
 assert.equal(settled.gainedPoints,true);
 assert.match(settled.log,/Tông môn chiến/);

 // Exercise the extracted feature modules through their actual DOM handlers.
 const clickAction=(host,action,id)=>getNode(host).onclick({target:{closest:selector=>
  selector==="[data-a]"||selector===`[data-a=${action}]`?{dataset:{a:action,id}}:null
 }});
 const readSave=()=>JSON.parse(storage.get(key));
 const purchase=vm.runInContext(`S.points=5000; S.act=""; render();
  ({points:S.points,owned:S.inv.ca||0,cost:ITEMS.find(i=>i.id==="ca").c})`,context);
 clickAction("k","buy","ca");
 const purchased=readSave();
 assert.equal(purchased.points,purchase.points-purchase.cost);
 assert.equal(purchased.inv.ca,purchase.owned+1);
 clickAction("k","buy","ca");
 assert.equal(readSave().points,purchased.points);
 assert.equal(readSave().inv.ca,purchased.inv.ca);

 vm.runInContext("S.ls.it=10; render()",context);
 assert.ok(readSave().tt.n5);
 assert.ok(readSave().nw.t.n5);
 clickAction("i","eq","n5");
 assert.equal(readSave().title,"n5");
 assert.equal(readSave().nw.t.n5,undefined);
 clickAction("i","eq","n5");
 assert.equal(readSave().title,"");

 vm.runInContext("S.sh=1; S.tma=0; render()",context);
 assert.match(getNode("exams").innerHTML,/data-a="xm" data-id="tl"/);
 clickAction("exams","xm","tl");
 assert.equal(readSave().sh,0);
 assert.equal(readSave().tma,0);
 assert.match(getNode("msg").textContent,/Diễn kiếp Trúc Cơ Lôi Kiếp/);

 const beforeExam=vm.runInContext(`S.sem.res.tl={rows:[{u:true,ok:true,n:"Đạo hữu",s:95,g:"Xuất sắc",xp:S.points,sp:-1}],claimed:false,seen:true};
  render(); ({points:S.points,items:S.inv.bm||0,gain:GameRewards.eventGain(RW["Xuất sắc"]*EX[0].w,S.tcCharges,rewardFactors()).gain})`,context);
 assert.match(getNode("exams").innerHTML,/data-a="xc" data-id="tl"/);
 clickAction("exams","xc","tl");
 const examReward=readSave();
 assert.equal(examReward.sem.res.tl.claimed,true);
 assert.equal(examReward.points,beforeExam.points+beforeExam.gain);
 assert.equal(examReward.inv.bm,beforeExam.items+1);
 clickAction("exams","xc","tl");
 assert.equal(readSave().points,examReward.points);
 assert.equal(readSave().inv.bm,examReward.inv.bm);

 vm.runInContext("S.kf=today(); render()",context);
 const trialButtons=[...getNode("kiep").innerHTML.matchAll(/data-k="([dw][^"]+)"\s*>/g)];
 assert.equal(trialButtons.length,6);
 for(const [index,match] of trialButtons.entries()){
  const [,trialKey]=match,reward=[20,35,60,150,120,220][index];
  const before=vm.runInContext(`({points:S.points,completed:S.ls.kn||0,tea:S.inv.ca||0,gain:modGain(${Number(reward)}+(petBuff().kp||0)+(eqT("n14")?25:0)+(S.kd===today()?30:0)),bonus:modGain(30)})`,context);
  const button={dataset:{k:trialKey,r:reward}};
  const event={target:{closest:selector=>selector==="button[data-k]"?button:null}};
  getNode("kiep").onclick(event);
  const after=readSave();
  assert.equal(after.kc[trialKey],1);
  assert.equal(after.ls.kn,before.completed+1);
  assert.equal(after.points,before.points+before.gain+(index===2?before.bonus:0));
  assert.equal(after.inv.ca,before.tea+(index===5?1:0));
  getNode("kiep").onclick(event);
  assert.equal(readSave().points,after.points);
  assert.equal(readSave().ls.kn,after.ls.kn);
 }
});

test("cài đặt, nhập file backup sau render và tải lại đồng bộ state",async()=>{
 const key=vm.runInContext("GameState.KEY",context);
 getNode("lbulk").value="08:00-08:30 | Kiểm thử lịch | T2,T4";
 getNode("lin").onclick();
 assert.ok(JSON.parse(storage.get(key)).rep.some(slot=>slot.label==="Kiểm thử lịch"));
 vm.runInContext("S.god=true;render()",context);
 getNode("events").oninput({target:{dataset:{kd:"n"},value:"Kỳ sự kiểm thử"}});
 const eventButton={dataset:{a:"kadd"}};
 getNode("events").onclick({target:{closest:()=>eventButton}});
 assert.ok(JSON.parse(storage.get(key)).ks.some(event=>event.n==="Kỳ sự kiểm thử"));
 assert.match(getNode("events").innerHTML,/data-kd="n" value=""/);
 const box=vm.runInContext("bx",context);
 const setting=(dataset,selector)=>box.onclick({target:{closest:s=>s===selector?{dataset}:null}});
 setting({ui:"skin",v:"jade"},"[data-ui]");
 assert.equal(JSON.parse(storage.get(key)).ui.skin,"jade");
 assert.match(box.innerHTML,/data-bk="god"/);
 vm.runInContext("S.god=false; go(\"s\",\"s\")",context);
 getNode("setpanel").hidden=true;getNode("gear").onclick();
 assert.equal(getNode("settings-title").textContent,"Cài đặt");
 assert.equal(getNode("sbody").hidden,true);
 assert.doesNotMatch(getNode("sn").innerHTML,/data-s="g"/);
 setting({bk:"god"},"button");
 assert.equal(JSON.parse(storage.get(key)).god,true);
 assert.match(getNode("sn").innerHTML,/data-s="g"/);
 setting({ui:"studyOnly",v:"1"},"[data-ui]");
 setting({bk:"godopen"},"button");
 assert.equal(getNode("g").hidden,false);
 assert.match(getNode("g").innerHTML,/data-god-group="progress"/);
 assert.match(getNode("g").innerHTML,/data-gm="day"/);
 assert.match(getNode("g").innerHTML,/data-gm="st"/);
 getNode("g").onclick({target:{closest:()=>({dataset:{gm:"off"}})}});
 assert.equal(JSON.parse(storage.get(key)).god,false);
 assert.equal(getNode("g").hidden,true);
 assert.doesNotMatch(getNode("sn").innerHTML,/data-s="g"/);
 setting({ui:"studyOnly",v:"1"},"[data-ui]");
 assert.equal(JSON.parse(storage.get(key)).ui.studyOnly,true);
 setting({ui:"studyOnly",v:"0"},"[data-ui]");
 getNode("gear").onclick();
 assert.equal(getNode("settings-title").textContent,"Thống kê");
 assert.equal(getNode("sbody").hidden,false);
 const oldRaw=storage.get(key);
 getNode("bk").value="invalid JSON";
 setting({bk:"im"},"button");
 assert.equal(storage.get(key),oldRaw);
 assert.equal(getReloads(),0);
 const imported={...JSON.parse(oldRaw),points:12345,god:true,ui:{skin:"ink",density:"normal",fs:"md",theme:"auto"}};
 const file={id:"bkfile",files:[{text:async()=>JSON.stringify(imported)}],value:"test.json"};
 await box.listeners.change({target:file});
 assert.equal(JSON.parse(getNode("bk").value).points,12345);
 assert.equal(file.value,"");
 setting({bk:"im"},"button");
 assert.equal(getReloads(),1);
 assert.equal(storage.get(key+".backup"),oldRaw);
 assert.equal(JSON.parse(storage.get(key)).points,12345);
 vm.runInContext("S.points=42; save()",context);
 assert.equal(JSON.parse(storage.get(key)).points,12345);
 nodes.clear();
 const fresh=createContext();
 vm.runInContext("globalThis.window=globalThis",fresh);
 for(const name of scripts)vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),fresh,{filename:name});
 assert.equal(vm.runInContext("S.points",fresh),12345);
 assert.equal(vm.runInContext("S.god",fresh),true);
 assert.equal(vm.runInContext("S.ui.skin",fresh),"ink");
 assert.equal(getNode("pts").textContent,12345);
 assert.equal(vm.runInContext("S.points+=10;save();S.points",fresh),12355);
 assert.equal(JSON.parse(storage.get(key)).points,12355);
});

test("khởi động khi cả hai save lỗi hiển thị cảnh báo và giữ nguyên dữ liệu",()=>{
 const key=vm.runInContext("GameState.KEY",context);
 const primary="{invalid",backup='{"quests":[],"points":-1}';
 storage.set(key,primary);
 storage.set(key+".backup",backup);
 nodes.clear();
 const fresh=createContext();
 vm.runInContext("globalThis.window=globalThis",fresh);
 for(const name of scripts)vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),fresh,{filename:name});
 assert.equal(getNode("savewarning").hidden,false);
 assert.match(getNode("savewarning").textContent,/Tạm khóa lưu/);
 assert.equal(vm.runInContext("save()",fresh),false);
 assert.equal(storage.get(key),primary);
 assert.equal(storage.get(key+".backup"),backup);
 assert.match(vm.runInContext("bx.innerHTML",fresh),/Tải dữ liệu cứu hộ/);
});

function timerFixture(nativePlugin){
 storage.clear();nodes.clear();
 let now=new Date(2026,10,24,23,58,0).getTime();
 class Clock extends Date {
  constructor(...args){super(...(args.length?args:[now]))}
  static now(){return now}
 }
 const events={};
 const doc={...document,addEventListener(type,fn){(events[type]??=[]).push(fn)}};
 function boot(){
  nodes.clear();
  for(const type of Object.keys(events))delete events[type];
  const c=createContext({Date:Clock,document:doc,Capacitor:nativePlugin?{isNativePlatform:()=>true,Plugins:{LocalNotifications:nativePlugin}}:undefined});
  vm.runInContext("globalThis.window=globalThis",c);
  for(const name of scripts)vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),c,{filename:name});
  return c;
 }
 let c=boot();
 return {
  run:code=>vm.runInContext(code,c),
  advance:ms=>{now+=ms},reload:()=>{c=boot()},
  saved:()=>JSON.parse(storage.get("quest-study-v1")),
  click:(a,id,section="list")=>getNode(section).onclick({target:{closest:()=>({dataset:{a,id}})}}),
  flush:()=>vm.runInContext("reconcileTimers(true)",c),
  visibility:hidden=>{doc.hidden=hidden;for(const fn of events.visibilitychange||[])fn()}
 };
}

test("Stage 6C: gợi ý theo Nhật trình, kiểm tra lại khi bấm và bắt đầu timer thật",()=>{
 const f=timerFixture();
 f.advance(8*3600000+2*60000);
 f.run(`S.quests=[{id:'a',name:'Ôn bài',mins:25,pts:100,due:Date.now()+3600000},{id:'b',name:'Bài tập',mins:20,pts:100}]; S.sched={}; S.rep=[]; render()`);
 assert.match(getNode("study-plan").innerHTML,/Ôn bài/);
 const click=id=>getNode("study-plan").onclick({target:{closest:()=>({dataset:{studyId:id}})}});
 f.run(`S.rep=[{id:'r',d:[(new Date(today()+'T12:00:00').getDay()+6)%7],s:'08:00',e:'08:30',label:'Bài tập'}]`);
 click('a');
 assert.equal(f.run("!!GameTimer.focusSession()"),false);
 assert.match(getNode("study-plan").innerHTML,/Bài tập/);
 const before=f.run("JSON.stringify({points:S.points,sched:S.sched,rep:S.rep,quests:S.quests})");
 click('b');
 assert.equal(f.run("GameTimer.activeFocus().id"),'b');
 assert.equal(f.run("JSON.stringify({points:S.points,sched:S.sched,rep:S.rep,quests:S.quests})"),before);
 assert.match(getNode("study-plan").innerHTML,/Đang trong phiên học/);
});

test("Stage 6H: Nhật trình gom lịch, gợi ý học và điều hướng đến thẻ đến hạn",()=>{
 const f=timerFixture();
 f.advance(8*3600000+2*60000);
 f.run(`S.quests=[{id:'a',name:'Ôn bài',mins:25,pts:100}];
   S.sched={}; S.rep=[];
   S.sched[today()]=[{id:'s',s:'09:00',e:'10:00',label:'Đọc & ghi chú'}];
   S.reviewCards=GameReviewCards.upsert(S,null,{question:'Câu hỏi',answer:'Đáp án'},today());
   go('u','l')`);
 assert.match(getNode("now").innerHTML,/09:00.*Đọc &amp; ghi chú/);
 assert.match(getNode("today-study").innerHTML,/Ôn bài/);
 assert.equal(getNode("today-review-count").textContent,"1 thẻ đến hạn");
 assert.equal(getNode("today-review-open").hidden,false);
 getNode("today-review-open").onclick();
 assert.equal(getNode("subjects").hidden,false);
 assert.equal(getNode("review-fold").open,true);
 assert.match(getNode("review-current").innerHTML,/Câu hỏi/);
 assert.doesNotMatch(getNode("review-current").innerHTML,/Đáp án/);
 f.run(`S.reviewCards=[]; go('u','l')`);
 assert.equal(getNode("today-review-open").hidden,true);
 getNode("today-review-open").onclick();
 assert.equal(getNode("l").hidden,false);
 getNode("today-study").onclick({target:{closest:()=>({dataset:{studyId:"a"}})}});
 assert.equal(f.run("GameTimer.activeFocus().id"),"a");
 assert.match(getNode("today-study").innerHTML,/Đang trong phiên học/);
});

test("D: tạo nhiệm vụ và học ngay, giữ bản nháp khi đang học",()=>{
 const f=timerFixture();
 getNode("nm").value="Ôn bài";
 getNode("nd").value="25";
 getNode("nl").value="1.15";
 getNode("nq").value="1";
 getNode("nr").checked=true;
 getNode("nq").onchange();
 assert.equal(getNode("nr").disabled,true);
 assert.match(getNode("prev").textContent,/^\d+ linh lực$/);
 assert.equal(Number.parseInt(getNode("prev").textContent),f.run("calc()"));
 getNode("add-study").onclick();
 const saved=f.saved(),q=saved.quests[0];
 assert.equal(q.name,"Ôn bài");
 assert.equal(q.repeat,false);
 assert.equal(saved.timers.focus.questId,q.id);
 assert.match(getNode("list").innerHTML,/Đang học/);
 assert.equal(getNode("add-study").disabled,true);
 getNode("nm").value="Bản nháp";
 getNode("add-study").onclick();
 assert.equal(f.saved().quests.length,1);
 assert.equal(getNode("nm").value,"Bản nháp");
 getNode("add").onclick();
 assert.equal(f.saved().quests.length,2);
 assert.notEqual(f.saved().quests[1].id,q.id);
 getNode("fx").onclick();
 assert.equal(f.saved().timers.focus,null);
 assert.equal(getNode("add-study").disabled,false);
});

test("D: hướng dẫn tu luyện có tab riêng trong cả hai chế độ",()=>{
 const f=timerFixture();
 const guide=html.match(/<section id="study-guide" hidden>([\s\S]*?)<\/section>/)?.[1];
 assert.ok(guide);
 for(const title of ["Nhiệm vụ","Liên hoàn","Nhật trình"])assert.ok(guide.includes("<summary>"+title+"</summary>"));
 assert.ok(guide.includes('id="quest-modifiers"'));
 const questSection=html.match(/<section id="q">([\s\S]*?)<\/section>/)[1];
 assert.doesNotMatch(questSection,/quest-modifiers|Tên nhiệm vụ \| phút \| độ khó/);
 assert.match(getNode("sn").innerHTML,/data-s="study-guide"/);
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"study-guide"}})}});
 assert.equal(getNode("study-guide").hidden,false);
 assert.equal(getNode("q").hidden,true);
 f.run("S.ui.studyOnly=true;drawNav()");
 assert.equal(getNode("study-guide").hidden,false);
 assert.match(getNode("sn").innerHTML,/data-s="study-guide"/);
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"q"}})}});
 assert.equal(getNode("study-guide").hidden,true);
 assert.equal(getNode("q").hidden,false);
});

test("D: render chỉ cập nhật bảng xếp hạng đang mở và giữ DOM ổn định",()=>{
 const f=timerFixture(),writes={};
 for(const id of ["lb","van","gn","sn","list","lwk","lq","slots","lrep"]){
  const node=getNode(id);let value=node.innerHTML;writes[id]=0;
  Object.defineProperty(node,"innerHTML",{get:()=>value,set:next=>{value=next;writes[id]++},configurable:true});
 }
 f.run("render();render()");
 for(const id of Object.keys(writes))assert.equal(writes[id],0,id);
 getNode("gn").onclick({target:{closest:()=>({dataset:{g:"t"}})}});
 assert.equal(getNode("b").hidden,false);
 assert.equal(writes.lb,1);assert.equal(writes.van,0);
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"v"}})}});
 assert.equal(getNode("v").hidden,false);
 assert.equal(writes.van,1);assert.equal(writes.lb,1);
 getNode("gn").onclick({target:{closest:()=>({dataset:{g:"u"}})}});
 getNode("nm").value="Đọc sách";getNode("nd").value="25";
 getNode("add").onclick();
 assert.match(getNode("list").innerHTML,/Đọc sách/);
 assert.equal(writes.list,1);assert.equal(writes.lq,1);
 assert.equal(writes.lb,1);assert.equal(writes.van,1);
});

test("B: focus và giờ chơi khôi phục qua reload, deadline và nửa đêm, thưởng đúng một lần",()=>{
 const f=timerFixture();
 f.run('S.quests.push({id:"other",name:"Khác",mins:5,pts:10},{id:"q",name:"Học",mins:5,pts:100,due:Date.now()+60000});S.gameSec=600;save()');
 f.click("p","q");
 getNode("run").onclick();
 const initial=f.saved();
 assert.equal(initial.timers.focus.questId,"q");
 assert.ok(initial.timers.play.id);
 f.advance(90000);f.visibility(true);
 assert.equal(f.saved().gameSec,510);
 f.reload();
 assert.equal(f.saved().gameSec,510);
 assert.equal(f.run("GameTimer.focusRemaining()"),210);
 assert.equal(f.saved().timers.focus.id,initial.timers.focus.id);
 assert.equal(getNode("focus").hidden,false);
 f.advance(240000);f.reload();
 const settled=f.saved(),q=settled.quests[1];
 assert.equal(settled.timers.focus,null);
 assert.equal(settled.gameSec,270);
 assert.equal(q.doneOn,"2026-11-25");
 assert.equal(settled.hist[q.doneOn].m,5);
 assert.ok(q.got>0);
 assert.equal(q.completion.deadlineResult,"late");
 assert.equal(settled.studyReport.days["2026-11-24"].play,120);
 assert.equal(settled.studyReport.days["2026-11-25"].play,210);
 assert.equal(settled.studyReport.days[q.doneOn].earned,q.got);
 assert.equal(settled.studyReport.days[q.doneOn].late,1);
 f.reload();f.flush();
 assert.equal(f.saved().points,settled.points);
 assert.equal(f.saved().hist[q.doneOn].m,5);
 assert.deepEqual(f.saved().studyReport,settled.studyReport);
 f.advance(1000000);f.reload();
 assert.equal(f.saved().gameSec,0);
 assert.equal(f.saved().timers.play,null);
 assert.equal(Object.values(f.saved().studyReport.days).reduce((sum,row)=>sum+row.play,0),600);
});

test("6B: timer đúng hạn, quá hạn và khôi phục biên nhận gốc",()=>{
 for(const late of [false,true]){
  const f=timerFixture();
  f.run(`S.quests.push({id:"q",name:"Học",mins:5,pts:125,basePts:100,deadlineKind:"1",due:Date.now()+${late?299999:300000}});S.fx=[{v:60,n:1,t:"q"}];save()`);
  f.click("p","q");
  f.run("S.perHour=500;save()");
  f.advance(360000);f.reload();
  const settled=f.saved(),receipt=settled.quests[0].completion;
  assert.equal(receipt.deadlineResult,late?"late":"onTime");
  assert.equal(receipt.breakdown.base,late?100:125);
  assert.equal(receipt.stats.ru,late?0:1);
  assert.equal(receipt.breakdown.itemGain>0,!late);
  assert.equal(settled.fx[0].n===1,late);
  f.click("t","q");assert.equal(f.saved().quests[0].completion.undone,true);
  f.click("t","q");assert.deepEqual(f.saved().quests[0].completion,receipt);
  assert.equal(f.saved().points,settled.points);
  assert.deepEqual(f.saved().fx,settled.fx);
 }
});

test("B: hoàn thành thủ công, hủy, xóa chuỗi, sửa/tạo lại và nhiệm vụ khóa",()=>{
 const f=timerFixture();
 f.run('S.quests.push({id:"q",name:"Học",mins:5,pts:100},{id:"expired",name:"Hết hạn",mins:5,pts:100,due:Date.now()-1},{id:"a",name:"A",mins:5,pts:100,chain:"c"},{id:"b",name:"B",mins:5,pts:100,chain:"c"});S.chains.push({id:"c",name:"Chuỗi"});save()');
 f.click("p","expired");f.click("p","b");
 assert.equal(f.saved().timers.focus,null);
 f.click("p","q");
 f.click("rn","q");
 assert.equal(f.saved().timers.focus.questId,"q");
 f.click("t","q");
 const points=f.saved().points;
 assert.equal(f.saved().timers.focus,null);
 f.advance(360000);f.reload();
 assert.equal(f.saved().points,points);
 f.click("p","a");getNode("fx").onclick();
 assert.equal(f.saved().timers.focus,null);
 f.click("p","a");f.click("cd","c","chains");
 assert.equal(f.saved().timers.focus,null);
 f.advance(360000);f.reload();
 assert.equal(f.saved().points,points);
});

test("B: play pause, mua thêm giờ, rollback đồng hồ và focus orphan",()=>{
 const f=timerFixture();
 f.run('S.points=500;S.gameSec=120;S.quests.push({id:"q",name:"Học",mins:5,pts:100});save()');
 f.click("p","q");getNode("run").onclick();
 f.advance(30000);f.flush();
 assert.equal(f.saved().gameSec,90);
 assert.equal(f.run("GameTimer.focusRemaining()"),270);
 f.advance(-60000);f.flush();
 assert.equal(f.saved().gameSec,90);
 assert.equal(f.run("GameTimer.focusRemaining()"),270);
 f.advance(10000);getNode("run").onclick();
 assert.equal(f.saved().gameSec,80);
 assert.equal(f.saved().timers.play,null);
 f.advance(20000);f.reload();
 assert.equal(f.saved().gameSec,80);
 getNode("run").onclick();f.advance(120000);
 getNode("mins").value="1";getNode("buy").onclick();
 assert.equal(f.saved().timers.play,null);
 assert.equal(f.saved().gameSec,60);
 assert.equal(Object.values(f.saved().studyReport.days).reduce((sum,row)=>sum+row.play,0),120);
 assert.ok(Object.values(f.saved().studyReport.days).some(row=>row.leisureCost>0));
 f.run("S.quests=[];save()");f.reload();
 assert.equal(f.saved().timers.focus,null);
});

test("B: notification timer, hủy, lỗi native và khôi phục quyền",async()=>{
 const pending=new Map();
 let permission="granted",fail=false,requests=0,scheduleCalls=0;
 const plugin={
  checkPermissions:async()=>({display:permission}),
  requestPermissions:async()=>{requests++;return {display:permission}},
  createChannel:async()=>{},
  getPending:async()=>({notifications:[...pending.values()]}),
  cancel:async({notifications})=>notifications.forEach(n=>pending.delete(n.id)),
  schedule:async({notifications})=>{
   scheduleCalls++;
   if(fail)throw Error("mock schedule failure");
   notifications.forEach(n=>pending.set(n.id,n));
  }
 };
 const f=timerFixture(plugin),drain=()=>new Promise(resolve=>setImmediate(resolve));
 await drain();
 f.run('S.nt.on=true;S.quests.push({id:"q",name:"Học",mins:5,pts:100});S.gameSec=60;save()');
 f.click("p","q");getNode("run").onclick();
 await drain();
 assert.ok(pending.has(1700));assert.ok(pending.has(1701));
 assert.equal(+pending.get(1700).schedule.at,f.saved().timers.focus.endAt);
 const before=scheduleCalls;
 f.advance(15000);f.flush();await f.run("NT.run(false)");await drain();
 assert.equal(scheduleCalls,before);
 getNode("fx").onclick();await drain();
 assert.equal(pending.has(1700),false);
 permission="denied";await f.run("NT.run(true)");
 assert.equal(requests,0);
 assert.match(getNode("ntsync").textContent,/Chưa cấp quyền/);
 assert.equal(pending.size,0);
 permission="granted";fail=true;await f.run("NT.run(true)");
 assert.match(getNode("ntsync").textContent,/Chưa đồng bộ/);
 fail=false;await f.run("NT.run(false)");
 assert.match(getNode("ntsync").textContent,/Đã đồng bộ/);
 assert.ok(pending.has(1701));
 f.run("S.nt.on=false;save()");await f.run("NT.run(true)");
 assert.equal(pending.size,0);
});

test("B: nhiệm vụ lặp có lượt mới sau nửa đêm và luân hồi xóa cả hai phiên",()=>{
 const f=timerFixture();
 f.run('S.quests.push({id:"q",name:"Học mỗi ngày",mins:5,pts:100,repeat:true});S.gameSec=600;save()');
 f.click("t","q");
 const prior=f.saved();
 f.advance(180000);f.visibility(false);
 f.click("p","q");getNode("run").onclick();
 assert.equal(f.saved().timers.focus.questId,"q");
 f.advance(300000);f.visibility(false);
 assert.equal(f.saved().quests[0].doneOn,"2026-11-25");
 assert.equal(f.saved().hist["2026-11-25"].m,5);
 assert.ok(f.saved().points>prior.points);
 f.run('S.quests.push({id:"r",name:"Học tiếp",mins:5,pts:100});save()');
 f.click("p","r");
 assert.ok(f.saved().timers.play);
 assert.ok(f.saved().timers.focus);
 f.run("doRebirth()");
 assert.equal(f.saved().gameSec,0);
 assert.equal(f.saved().timers.focus,null);
 assert.equal(f.saved().timers.play,null);
 f.advance(300000);f.reload();
 assert.equal(f.saved().points,0);
});

test("3B: môn học, biên nhận gốc, lặp, xóa, reload và luân hồi",()=>{
 const f=timerFixture();
 const minutes=id=>f.run("GameSubjects.minutes(S,"+JSON.stringify(id)+")");
 getNode("subject-name").value="Giải tích <1>";
 getNode("subject-daily").value="45";
 getNode("subject-weekly").value="180";
 getNode("subject-add").onclick();
 const subject=f.saved().subjects.list.at(-1);
 assert.equal(subject.daily,45);
 getNode("nm").value="Ôn tích phân";getNode("nd").value="30";getNode("nsubject").value=subject.id;getNode("nr").checked=true;
 getNode("add").onclick();
 const q=f.saved().quests[0];
 assert.equal(q.subjectId,subject.id);
 f.click("t",q.id);
 assert.equal(minutes(subject.id),30);
 const gain=f.saved().quests[0].got;
 f.run("S.quests[0].subjectId='code';GameSubjects.update(S,"+JSON.stringify(subject.id)+",{name:'Giải tích II',daily:45,weekly:180});save()");
 f.click("t",q.id);
 assert.equal(minutes(subject.id),0);
 f.click("t",q.id);
 assert.equal(minutes(subject.id),30);
 assert.equal(f.saved().quests[0].got,gain);
 assert.equal(minutes("code"),0);
 f.advance(180000);f.click("t",q.id);
 assert.equal(minutes("code"),30);
 assert.equal(minutes(subject.id),30);
 f.click("d",q.id);f.reload();
 assert.equal(minutes("code"),30);assert.equal(minutes(subject.id),30);
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"subjects"}})}});
 assert.match(getNode("subject-list").innerHTML,/Giải tích II/);
 f.run("S.ui.studyOnly=true;drawNav()");
 assert.equal(getNode("subjects").hidden,false);
 getNode("subject-list").onclick({target:{closest:()=>({dataset:{subjectAction:"archive",id:subject.id}})}});
 assert.equal(f.saved().subjects.list.at(-1).archived,true);
 assert.doesNotMatch(getNode("nsubject").innerHTML,/Giải tích II/);
 f.run("doRebirth()");
 assert.equal(minutes("code"),0);
 assert.equal(f.saved().subjects.list.at(-1).weekly,180);
 assert.equal(f.saved().rbh.at(-1).subjects.totals.find(s=>s.id===subject.id).minutes,30);
});

test("3B: nhập môn chính xác, giữ dòng lỗi, xuất và chuỗi tương thích",()=>{
 const f=timerFixture();
 getNode("qbulk").value="Đọc | 30 | 1 | 0 | | Toán học\nSai | 20 | 1 | 0 | | Không có\nCũ | 15";
 getNode("qbulkin").onclick();
 assert.equal(f.saved().quests.length,2);
 assert.equal(f.saved().quests[0].subjectId,"math");
 assert.equal(f.saved().quests[1].subjectId,undefined);
 assert.match(getNode("qbulk").value,/^Sai/);
 getNode("qbulkex").onclick();
 assert.match(getNode("qbulk").value,/\| math/);
 getNode("cn").value="Chuỗi";getNode("cs").value="Bước một | 25 | Lập trình\nBước hai | 35 | Sai";
 getNode("cadd").onclick();assert.equal(f.saved().chains.length,0);
 getNode("cs").value="Bước một | 25 | Lập trình\nBước hai | 35 | Tiếng Anh";
 getNode("cadd").onclick();assert.equal(f.saved().chains.length,1);
 assert.equal(f.saved().quests.at(-1).subjectId,"english");
 f.click("t",f.saved().quests.at(-2).id,"chains");
 assert.equal(f.run("GameSubjects.minutes(S,'code')"),25);
 assert.equal(f.run("GameStorage.validSave(S)"),true);
 f.run("S.subjects.days['2026-11-24']={bogus:100}");
 assert.equal(f.run("GameStorage.validSave(S)"),false);
});

test("5B: công pháp, thưởng qua biên nhận, hoàn tác, reload và luân hồi",()=>{
 const f=timerFixture();f.advance(10*3600000);
 assert.equal(f.saved().technique.active,"");
 f.run("delete S.technique;GameState.migrate(S);save()");
 assert.equal(f.saved().technique.active,"");
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"subjects"}})}});
 const select=id=>{getNode("technique-select").value=id;getNode("technique-select").onchange()};
 select("review");assert.equal(f.saved().technique.active,"review");
 f.run('S.quests.push({id:"a",name:"Ôn bài",mins:20,pts:100,repeat:true},{id:"b",name:"Khó",mins:30,pts:100,diff:1.3});S.tdPenalty=true;S.tdStacks=2;save()');
 f.click("t","a");const first=f.saved().quests[0].completion,b=first.breakdown;
 assert.equal(b.technique,12);assert.equal(b.td,0.9);
 assert.equal(b.subtotal,Math.round(b.base*b.multiplier+b.flat+b.taskBonus));
 assert.match(getNode("list").innerHTML,/Trong thưởng cộng: công pháp \+12/);
 f.click("t","a");select("hard");f.click("t","b");
 assert.equal(f.saved().quests[1].completion.breakdown.technique,undefined);
 f.click("t","a");assert.deepEqual(f.saved().quests[0].completion,first);
 f.reload();assert.equal(f.saved().technique.active,"hard");
 getNode("sn").onclick({target:{closest:()=>({dataset:{s:"subjects"}})}});
 f.run("S.ui.studyOnly=true;drawNav()");assert.equal(getNode("subjects").hidden,false);
 assert.match(getNode("technique-status").textContent,/Hôm nay đã vận công/);
 assert.equal(f.run("GameStorage.validSave(S)"),true);
 assert.equal(f.run("GameStorage.validSave({...S,technique:{active:'bad',days:{}}})"),false);
 f.run("doRebirth()");assert.deepEqual(f.saved().rbh.at(-1).techniques,[{id:"review",days:1}]);
 assert.deepEqual(f.saved().technique,{active:"hard",days:{}});
});

test("5B: Tĩnh Tâm Quyết chỉ thưởng timer đủ thời lượng vào ban ngày",()=>{
 const f=timerFixture();
 f.run('GameTechniques.select(S,"focus");S.quests.push({id:"night",name:"Đêm",mins:25,pts:100},{id:"manual",name:"Tự ghi",mins:25,pts:100},{id:"day",name:"Ban ngày",mins:25,pts:100});save()');
 f.click("p","night");f.advance(10*3600000);f.reload();
 assert.equal(f.saved().quests[0].completion.breakdown.technique,undefined);
 f.click("t","manual");assert.equal(f.saved().quests[1].completion.breakdown.technique,undefined);
 f.click("p","day");f.advance(25*60000);f.flush();
 assert.equal(f.saved().quests[2].completion.breakdown.technique,12);
 assert.equal(Object.keys(f.saved().technique.days).length,1);
});

test("5E: nhận truyền thừa tại tông môn, reload và lưu sử kiếp",()=>{
 const f=timerFixture();
 f.run("S.sect=S.master=0;for(let i=1;i<=6;i++)S.hist['2026-11-0'+i]={m:45,p:0};save();renderSect()");
 assert.match(getNode("sect").innerHTML,/Kiếm Tâm Minh Ngộ/);
 getNode("sect").onclick({target:{closest:()=>({dataset:{a:"inherit"},disabled:false})}});
 assert.deepEqual(f.saved().transmissions,[0]);
 assert.match(getNode("sect").innerHTML,/Đã lĩnh ngộ/);
 f.reload();f.run("renderSect()");
 assert.match(getNode("sect").innerHTML,/Đã lĩnh ngộ/);
 f.run("doRebirth()");
 assert.equal(f.saved().transmissions,undefined);
 assert.deepEqual(f.saved().rbh.at(-1).transmissions,[0]);
 assert.match(getNode("thd").innerHTML,/Truyền thừa: Kiếm Tâm Minh Ngộ/);
});

test("5F: đạo lộ tự đổi qua luân hồi, lưu sử kiếp và danh hiệu",()=>{
 const f=timerFixture();
 f.run("for(let i=1;i<=7;i++)S.hist['2026-11-0'+i]={m:20,p:0};save();renderAch()");
 assert.match(getNode("ach").innerHTML,/Tĩnh Tâm/);
 assert.match(getNode("ach").innerHTML,/Đã viên mãn/);
 f.run("doRebirth()");
 assert.deepEqual(f.saved().rbh.at(-1).lifePath,{id:"steady",progress:7});
 assert.match(getNode("thd").innerHTML,/Đạo lộ: Tĩnh Tâm/);
 assert.match(getNode("ach").innerHTML,/Vạn Pháp/);
 f.run("S.subjects.days={'2026-11-01':{math:30,code:30,english:30}};save();doRebirth()");
 assert.deepEqual(f.saved().rbh.at(-1).lifePath,{id:"breadth",progress:3});
 f.run("for(let i=1;i<=4;i++)S.subjects.days['2026-11-0'+i]={math:15,code:15};save();doRebirth()");
 assert.deepEqual(f.saved().rbh.at(-1).lifePath,{id:"balance",progress:4});
 assert.ok(f.saved().legacy.L11);
 f.reload();assert.ok(f.saved().legacy.L11);
 assert.match(getNode("ach").innerHTML,/Tam Đạo Đồng Quy/);
 assert.match(getNode("ach").innerHTML,/Tĩnh Tâm/);
});

test("3C: vấn đạo theo giờ học, ghi một lần mỗi ngày và phong văn theo kiếp",()=>{
 const f=timerFixture();
 const openNpc=i=>getNode("lb").onclick({target:{closest:()=>({dataset:{pi:String(i)}})}});
 const talk=()=>getNode("prof").onclick({target:{closest:s=>s==="[data-a=npc-talk]"?{}:null}});
 assert.equal(f.run("B.every((b,i)=>!!NpcWorld.personality(i))"),true);
 const before=f.run("S.points"),rank=f.run("myRk()");
 openNpc(49);
 assert.match(getNode("prof").innerHTML,/Vấn đạo · Trầm ổn/);
 assert.match(getNode("prof").innerHTML,/Một bước vững vàng/);
 talk();
 assert.match(getNode("prof").innerHTML,/Đã ghi lời vấn đạo hôm nay/);
 assert.equal(f.saved().points,before);
 assert.equal(f.run("myRk()"),rank);
 assert.equal(f.saved().storyLog.filter(x=>x.npc===49).length,1);
 assert.equal(f.saved().npcAffinity[49],1);
 assert.match(getNode("prof").innerHTML,/Tương thức/);
 openNpc(40);talk();
 assert.equal(f.saved().storyLog.filter(x=>x.id.startsWith("npc-talk:")).length,1);
 const initial=f.run("JSON.stringify(NpcWorld.events())");
 f.reload();openNpc(49);
 assert.match(getNode("prof").innerHTML,/Đã ghi lời vấn đạo hôm nay/);
 assert.equal(f.run("JSON.stringify(NpcWorld.events())"),initial);
 f.advance(180000);
 f.run("S.hist[today()]={m:25,p:0};save()");
 openNpc(49);
 assert.match(getNode("prof").innerHTML,/Căn cơ đã dày thêm/);
 talk();
 assert.equal(f.saved().storyLog.filter(x=>x.npc===49).length,2);
 assert.equal(f.saved().npcAffinity[49],2);
 f.run("S.kst.start-=6*864e5");
 assert.equal(f.run("NpcWorld.events().length"),3);
 assert.equal(f.run("NpcWorld.events()[0].day"),7);
 f.run("go('t','v')");
 assert.match(getNode("van").innerHTML,/Phong văn/);
 assert.match(getNode("van").innerHTML,/Ngày 7/);
 f.run("doRebirth()");
 assert.equal(f.run("NpcWorld.canRecord()"),true);
 assert.equal(f.run("NpcWorld.relationship(49).count"),0);
 assert.equal(f.run("NpcWorld.events()[0].day"),1);
 assert.notEqual(f.run("JSON.stringify(NpcWorld.events())"),initial);
});

test("3D: chỉ mừng cảnh giới cao nhất mới, giữ ký lục qua reload và luân hồi",()=>{
 const f=timerFixture();
 assert.equal(getNode("realm-breakthrough").hidden,true);
 f.run("S.points=42000;render()");
 assert.equal(getNode("realm-breakthrough").hidden,false);
 assert.equal(getNode("realm-breakthrough-name").textContent,"Kim Đan");
 assert.equal(f.saved().pk,2);
 assert.equal(f.saved().storyLog.filter(x=>x.id.startsWith("realm:")).length,2);
 f.run("FeedbackUI.clear();render()");
 assert.equal(getNode("realm-breakthrough").hidden,true);
 f.run("S.points=0;render();save();S.points=42000;render();save()");
 assert.equal(getNode("realm-breakthrough").hidden,true);
 assert.equal(f.saved().storyLog.filter(x=>x.id.startsWith("realm:")).length,2);
 f.reload();
 assert.equal(getNode("realm-breakthrough").hidden,true);
 f.run("S.points=66000;render()");
 assert.equal(getNode("realm-breakthrough-name").textContent,"Nguyên Anh");
 assert.equal(f.saved().pk,3);
 f.run("doRebirth()");
 assert.equal(getNode("realm-breakthrough").hidden,true);
 assert.equal(f.saved().pk,0);
 f.run("S.points=20000;render()");
 assert.equal(getNode("realm-breakthrough-name").textContent,"Trúc Cơ");
 assert.equal(f.saved().pk,1);
});

test("3E: chọn kiếp đầu, khóa kiếp hiện tại, đổi khi luân hồi và giữ sử",()=>{
 const f=timerFixture();
 assert.match(getNode("nmo").innerHTML,/first-cycle/);
 getNode("first-cycle").value="30";
 getNode("nmi").value="Kiểm thử";
 getNode("nmk").onclick();
 assert.equal(f.saved().cycleDays,30);
 assert.equal(f.run("KD"),30);
 assert.equal(f.run("END"),50420);
 assert.equal(f.run("EX.length"),8);
 assert.equal(f.run("EX.map(e=>e.day).join(',')"),"3,6,9,12,15,19,22,25");
 assert.match(getNode("hero").innerHTML,/Ngày 1\/30/);
 const select=days=>f.run("bx.onclick({target:{closest:()=>({dataset:{ui:'cycleDays',v:'"+days+"'}})}})");
 select(60);
 assert.equal(f.saved().nextCycleDays,60);
 assert.equal(f.run("KD"),30);
 assert.equal(f.run("kEnd()"),false);
 f.reload();
 assert.equal(f.run("KD"),30);
 assert.equal(f.saved().nextCycleDays,60);
 assert.equal(f.run("EX[0].chuan"),5042);
 f.run("S.points=50420; S.kst.pk=50420;save();doRebirth()");
 assert.equal(f.saved().cycleDays,60);
 assert.equal(f.run("KD"),60);
 assert.equal(f.run("END"),100840);
 assert.equal(f.saved().rbh[0].cycleDays,30);
 assert.equal(f.saved().rbh[0].end,50420);
 assert.match(getNode("rbs").innerHTML,/Dừng chân ở Chân Tiên/);
 assert.match(getNode("hero").innerHTML,/Ngày 1\/60/);
 assert.match(f.run("bx.innerHTML"),/Kiếp hiện tại: 60 ngày/);
 f.reload();
 assert.equal(f.run("KD"),60);
 assert.equal(f.run("EX[0].day"),7);
 assert.equal(f.run("EX[0].chuan"),10084);
 select(119);
 assert.equal(f.run("KD"),60);
 f.run("doRebirth()");
 assert.equal(f.run("KD"),119);
 assert.equal(f.run("END"),200000);
 assert.equal(f.run("EX.map(e=>e.day).join(',')"),"13,24,36,48,61,75,88,100");
 assert.match(getNode("rbs").innerHTML,/Dừng chân ở Chân Tiên/);
});

test("Stage 4: cá nhân hóa tồn tại qua reload và luân hồi, trả lại mặc định",()=>{
 const f=timerFixture();
 const src="data:image/jpeg;base64,/9j/AA==";
 getNode("nmi").value="Kiểm thử";getNode("nmk").onclick();
 f.run("S.ui.portrait="+JSON.stringify(src)+";save();render();renderSettings()");
 const select=v=>f.run("bx.onclick({target:{closest:()=>({dataset:{ui:'ornament',v:'"+v+"'}})}})");
 select("minimal");
 assert.equal(f.saved().ui.ornament,"minimal");
 assert.equal(f.saved().ui.portrait,src);
 assert.ok(getNode("hero").innerHTML.includes(src));
 assert.match(f.run("bx.innerHTML"),/portraitReset/);
 f.reload();
 assert.ok(getNode("hero").innerHTML.includes(src));
 assert.equal(f.saved().ui.ornament,"minimal");
 f.run("doRebirth()");
 assert.equal(f.saved().ui.portrait,src);
 assert.equal(f.saved().ui.ornament,"minimal");
 f.run("bx.onclick({target:{closest:selector=>selector==='button'?{dataset:{bk:'portraitReset'}}:null}})");
 select("classic");
 assert.equal(f.saved().ui.portrait,undefined);
 assert.equal(f.saved().ui.ornament,undefined);
 assert.match(getNode("hero").innerHTML,/assets\/avatars\/nam\.jpg/);
});

test("Stage 6E: thẻ ôn giữ qua reload và luân hồi, không tăng linh lực",()=>{
 const f=timerFixture();
 getNode("nmi").value="Kiểm thử";getNode("nmk").onclick();
 const points=f.run("S.points");
 getNode("review-question").value="Định nghĩa?";
 getNode("review-answer").value="Một đáp án";
 getNode("review-save").onclick();
 assert.equal(f.saved().reviewCards.length,1);
 const id=f.saved().reviewCards[0].id;
 f.reload();f.run("ReviewCardsUI.render()");
 assert.match(getNode("review-current").innerHTML,/Định nghĩa/);
 assert.doesNotMatch(getNode("review-current").innerHTML,/Một đáp án/);
 const click=review=>getNode("review-current").onclick({target:{closest:()=>({dataset:{review,id}})}});
 click("reveal");click("remember");
 assert.equal(f.saved().reviewCards[0].stage,1);
 assert.equal(f.saved().points,points);
 const cards=f.saved().reviewCards;
 f.run("doRebirth()");
 assert.deepEqual(f.saved().reviewCards,cards);
 f.reload();assert.deepEqual(f.saved().reviewCards,cards);
});

test("Stage 6F: thí luyện dùng thẻ thật, giữ lịch ôn và kết thúc khi luân hồi",()=>{
 const f=timerFixture();
 getNode("nmi").value="Kiểm thử";getNode("nmk").onclick();
 f.run("KnowledgeTrialUI.render()");
 assert.equal(getNode("trial-start").disabled,true);
 getNode("review-question").value="Định nghĩa?";
 getNode("review-answer").value="Một đáp án";
 getNode("review-save").onclick();
 assert.equal(getNode("trial-start").disabled,false);
 const cards=f.saved().reviewCards,points=f.saved().points;
 getNode("trial-count").value="5";
 getNode("trial-start").onclick();
 assert.equal(getNode("trial-setup").hidden,true);
 assert.match(getNode("trial-current").innerHTML,/Định nghĩa/);
 assert.doesNotMatch(getNode("trial-current").innerHTML,/Một đáp án/);
 const click=trial=>getNode("trial-current").onclick({target:{closest:()=>({dataset:{trial,token:"1-0"}})}});
 click("reveal");assert.match(getNode("trial-current").innerHTML,/Một đáp án/);
 click("remember");assert.match(getNode("trial-current").innerHTML,/1\/1 · 100%/);
 f.run("save()");assert.deepEqual(f.saved().reviewCards,cards);assert.equal(f.saved().points,points);
 f.run("doRebirth()");assert.equal(getNode("trial-setup").hidden,false);assert.deepEqual(f.saved().reviewCards,cards);
});

test("Stage 6I: xác nhận, lưu lịch ôn và thấy thẻ trong Hôm nay sau khi tải lại",()=>{
 const f=timerFixture();
 f.run(`S.reviewCards=GameReviewCards.upsert(S,null,{question:'Định nghĩa?',answer:'Một đáp án'},'2026-12-10');
   S.reviewCards[0].stage=3; save(); go('u','subjects')`);
 getNode("trial-count").value="5";
 getNode("trial-start").onclick();
 const click=(trial,token="1-0")=>getNode("trial-current").onclick({target:{closest:()=>({dataset:{trial,token}})}});
 click("reveal");click("forget");
 assert.match(getNode("trial-current").innerHTML,/Ôn 1 thẻ vào ngày mai/);
 f.run("window.confirm=()=>false");
 click("schedule","1-1");
 assert.equal(f.saved().reviewCards[0].due,"2026-12-10");
 f.run(`window.confirm=()=>true; var writeReviewTest=localStorage.setItem;
   localStorage.setItem=()=>{throw new Error('Quota')}`);
 try{click("schedule","1-1")}finally{f.run("localStorage.setItem=writeReviewTest")}
 assert.equal(f.run("S.reviewCards[0].due"),"2026-12-10");
 const points=f.saved().points;
 click("schedule","1-1");
 assert.equal(f.saved().reviewCards[0].due,"2026-11-25");
 assert.equal(f.saved().reviewCards[0].stage,3);
 assert.equal(f.saved().points,points);
 assert.doesNotMatch(getNode("trial-current").innerHTML,/Ôn 1 thẻ vào ngày mai/);
 f.run("go('u','l')");
 assert.equal(getNode("today-review-count").textContent,"Không có thẻ đến hạn");
 f.advance(3*60000);f.reload();f.run("go('u','l')");
 assert.equal(getNode("today-review-count").textContent,"1 thẻ đến hạn");
});
