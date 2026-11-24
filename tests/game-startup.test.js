const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,".."),jsDir=path.join(root,"www","js");
function element(id){
 const classes=new Set();
 return {
  id,innerHTML:"",textContent:"",value:"",checked:false,hidden:false,disabled:false,open:false,
  dataset:{},style:{cssText:"",setProperty(){},removeProperty(){}},classList:{
   add(...xs){xs.forEach(x=>classes.add(x))},remove(...xs){xs.forEach(x=>classes.delete(x))},
   toggle(x,on){if(on===undefined)on=!classes.has(x);if(on)classes.add(x);else classes.delete(x);return on},
   contains(x){return classes.has(x)}
  },
  children:[],files:[],scrollLeft:0,clientWidth:320,offsetLeft:0,offsetWidth:80,
  appendChild(x){this.children.push(x);return x},append(...xs){this.children.push(...xs)},
  remove(){},removeChild(x){this.children=this.children.filter(y=>y!==x)},
  listeners:{},addEventListener(type,fn){this.listeners[type]=fn},removeEventListener(){},setAttribute(){},getAttribute(){return null},removeAttribute(){},
  querySelector(selector){
   const id=/^#([\w-]+)$/.exec(selector)?.[1];
   return id&&this.innerHTML.includes(`id="${id}"`)?getNode(id):null;
  },querySelectorAll(){return []},closest(){return null},
  focus(){},select(){},click(){},scrollIntoView(){},insertAdjacentHTML(){},
  getBoundingClientRect(){return {height:0,width:320,top:0,left:0}},
  play(){return Promise.resolve()},pause(){},getContext(){return {}}
 };
}
const nodes=new Map();
const getNode=id=>{if(!nodes.has(id))nodes.set(id,element(id));return nodes.get(id)};
const document={
 title:"Tu Tiên Học Đạo",visibilityState:"visible",
 documentElement:Object.assign(element("html"),{style:{setProperty(){},removeProperty(){}},clientWidth:390}),
 body:element("body"),head:element("head"),
 getElementById:getNode,createElement:tag=>element(tag),createTextNode:text=>({textContent:String(text)}),
 querySelector(){return null},querySelectorAll(){return []},addEventListener(){},removeEventListener(){},
 execCommand(){return true}
};
const storage=new Map();
const localStorage={getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k),clear:()=>storage.clear()};
const navigator={standalone:false,vibrate(){},clipboard:{writeText:()=>Promise.resolve()}};
let reloads=0;
const location={href:"https://example.test/",reload(){reloads++}};
const URLApi={createObjectURL:()=>"blob:test",revokeObjectURL(){}};
const timeout=()=>1,matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
const createContext=()=>vm.createContext({
 document,localStorage,navigator,location,URL:URLApi,Blob,screen:{height:800,width:390},innerHeight:800,innerWidth:390,devicePixelRatio:1,
 setTimeout:timeout,clearTimeout(){},setInterval:timeout,clearInterval(){},requestAnimationFrame:timeout,cancelAnimationFrame(){},
 dispatchEvent(){},addEventListener(){},removeEventListener(){},matchMedia,confirm:()=>true,prompt:()=>"",console:{log(){},warn(){},error(){},info(){}},
 Date,Math,Object,Array,Number,String,Boolean,RegExp,JSON,Map,Set,Promise,Intl,Error,TypeError,parseInt,parseFloat,isNaN,
 performance:{now:()=>0}
});
const context=createContext();
vm.runInContext("globalThis.window=globalThis",context);
const html=fs.readFileSync(path.join(root,"www","index.html"),"utf8");
const scripts=[...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x=>x[1]);
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
 const button={dataset:{a:"t",id:quest.id}};
 getNode("list").onclick({target:{closest:()=>button}});
 const saved=JSON.parse(storage.get(key));
 assert.ok(saved.quests[0].got>0);
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
 const trialButtons=[...getNode("kiep").innerHTML.matchAll(/data-k="([dw][^"]+)" data-r="(\d+)"\s*>/g)];
 assert.equal(trialButtons.length,6);
 for(const [index,match] of trialButtons.entries()){
  const [,trialKey,reward]=match;
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
 const oldRaw=storage.get(key);
 getNode("bk").value="invalid JSON";
 setting({bk:"im"},"button");
 assert.equal(storage.get(key),oldRaw);
 assert.equal(reloads,0);
 const imported={...JSON.parse(oldRaw),points:12345,ui:{skin:"ink",density:"normal",fs:"md",theme:"auto"}};
 const file={id:"bkfile",files:[{text:async()=>JSON.stringify(imported)}],value:"test.json"};
 await box.listeners.change({target:file});
 assert.equal(JSON.parse(getNode("bk").value).points,12345);
 assert.equal(file.value,"");
 setting({bk:"im"},"button");
 assert.equal(reloads,1);
 assert.equal(storage.get(key+".backup"),oldRaw);
 assert.equal(JSON.parse(storage.get(key)).points,12345);
 vm.runInContext("S.points=42; save()",context);
 assert.equal(JSON.parse(storage.get(key)).points,12345);
 nodes.clear();
 const fresh=createContext();
 vm.runInContext("globalThis.window=globalThis",fresh);
 for(const name of scripts)vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),fresh,{filename:name});
 assert.equal(vm.runInContext("S.points",fresh),12345);
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
