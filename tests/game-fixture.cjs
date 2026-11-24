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
const createContext=(overrides={})=>vm.createContext({
 document,localStorage,navigator,location,URL:URLApi,Blob,screen:{height:800,width:390},innerHeight:800,innerWidth:390,devicePixelRatio:1,
 setTimeout:timeout,clearTimeout(){},setInterval:timeout,clearInterval(){},requestAnimationFrame:timeout,cancelAnimationFrame(){},
 dispatchEvent(){},addEventListener(){},removeEventListener(){},matchMedia,confirm:()=>true,prompt:()=>"",console:{log(){},warn(){},error(){},info(){}},
 Date,Math,Object,Array,Number,String,Boolean,RegExp,JSON,Map,Set,Promise,Intl,Error,TypeError,parseInt,parseFloat,isNaN,
 performance:{now:()=>0},...overrides
});
const context=createContext();
vm.runInContext("globalThis.window=globalThis",context);
const html=fs.readFileSync(path.join(root,"www","index.html"),"utf8");
const scripts=[...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x=>x[1]);

module.exports={fs,vm,jsDir,context,html,scripts,createContext,nodes,storage,document,getNode,getReloads:()=>reloads};
