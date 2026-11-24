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
  addEventListener(){},removeEventListener(){},setAttribute(){},getAttribute(){return null},removeAttribute(){},
  querySelector(){return null},querySelectorAll(){return []},closest(){return null},
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
const location={href:"https://example.test/",reload(){}};
const URLApi={createObjectURL:()=>"blob:test",revokeObjectURL(){}};
const window={
 document,localStorage,navigator,location,URL:URLApi,Blob,innerWidth:390,innerHeight:800,devicePixelRatio:1,
 dispatchEvent(){},addEventListener(){},removeEventListener(){},confirm:()=>true,prompt:()=>""
};
const timeout=()=>1,matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
const context=vm.createContext({
 window,document,localStorage,navigator,location,URL:URLApi,Blob,screen:{height:800,width:390},innerHeight:800,innerWidth:390,
 setTimeout:timeout,clearTimeout(){},setInterval:timeout,clearInterval(){},requestAnimationFrame:timeout,cancelAnimationFrame(){},
 addEventListener(){},removeEventListener(){},matchMedia,confirm:()=>true,prompt:()=>"",console:{log(){},warn(){},error(){},info(){}},
 Date,Math,Object,Array,Number,String,Boolean,RegExp,JSON,Map,Set,Promise,Intl,Error,TypeError,parseInt,parseFloat,isNaN,
 performance:{now:()=>0}
});
const html=fs.readFileSync(path.join(root,"www","index.html"),"utf8");
const scripts=[...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x=>x[1]);
test("game.js khởi động qua thứ tự script thật mà không vướng TDZ",()=>{
 for(const name of scripts){
  if(name==="game.js")break;
  vm.runInContext(fs.readFileSync(path.join(jsDir,name),"utf8"),context,{filename:name});
  Object.assign(context,window);
 }
 assert.doesNotThrow(()=>vm.runInContext(fs.readFileSync(path.join(jsDir,"game.js"),"utf8"),context,{filename:"game.js"}));
 assert.ok(getNode("gn").innerHTML.length>0,"navigation phải được render trong lần khởi động đầu");
});
