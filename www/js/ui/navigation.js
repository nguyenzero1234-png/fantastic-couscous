/* Điều hướng tab và badge thông báo; nghiệp vụ phần thưởng vẫn thuộc systems. */
(function(root){
 "use strict";
 function create(deps){
  const {S,GR,GR_SIMPLE,ALLS,$,document,nwS,knList,save,sfx,say,ri,uxp,renderPet,schedule}=deps;
  const NW_BASE=document.title;let NW_F={};let TG="u",TS="q",groupMarkup=null,screenMarkup=null;
  function activeGR(){return ((S.ui&&S.ui.studyOnly)?GR_SIMPLE:GR).map(g=>({...g,s:g.s.filter(x=>x[0]!=="g"||S.god)}))}
  const nwHas=s=>!!document.querySelector(s);
const nwFull=()=>{const a=S.pets&&S.pets.hl;return !!a&&S.act==="hl"&&(Date.now()-a.t)/36e5>=8};
function nwCompute(){
  const n=nwS(),now=Date.now(),f={};
  f.j=nwHas('#kiep button[data-k]:not([disabled])');
  f.e=nwHas('#events button[data-a="ec"]:not([disabled]),#events button[data-a="xs"]:not([disabled])');
  f.y=nwHas('#lenh button[data-a="lc"]:not([disabled]),#lenh button[data-a="ci"]:not([disabled]),#lenh button[data-a="kc"]:not([disabled]),#kn button[data-a="kc"]:not([disabled])')||knList().some(o=>o.en>now&&!n.k[o.h]);
  f.x=nwHas('#exams button[data-a="xc"]:not([disabled])');
  f.z=nwHas('#sect button[data-a="sm"]:not([disabled])');
  f.i=Object.keys(n.t).length>0||Object.keys(n.p).length>0||nwFull();
  return f;
}
function nwKn(){
  const n=nwS(),now=Date.now();let fresh=null;
  knList().forEach(o=>{if(o.en>now&&!n.kt[o.h]){n.kt[o.h]=1;fresh=o}});
  const ks=Object.keys(n.kt);if(ks.length>300){ks.map(Number).sort((a,b)=>a-b).slice(0,ks.length-200).forEach(k=>{delete n.kt[k];delete n.k[k]})}
  if(fresh){save();sfx(880);say("Kỳ ngộ bất ngờ: "+fresh.name+"! Học "+fresh.T+" phút trong "+fresh.W+" giờ để nhận thưởng.")}
}
function nwApply(){
  const f=NW_F,L=S.god?99:Math.max(ri(uxp()),S.pk||0);
  const gf={};activeGR().forEach(g=>{gf[g.id]=g.s.some(x=>((x[2]||0)<=L||S.god)&&f[x[0]])});
  document.querySelectorAll("#gn button[data-g]").forEach(b=>b.classList.toggle("rd",!!gf[b.dataset.g]));
  document.querySelectorAll("#sn button[data-s]").forEach(b=>b.classList.toggle("rd",!!f[b.dataset.s]));
  document.title=(Object.keys(f).some(k=>f[k])?"● ":"")+NW_BASE;
}
function nwUpdate(){try{NW_F=nwCompute();nwKn();nwApply()}catch(e){}}
function nwSeenK(){const n=nwS();let ch=0;knList().forEach(o=>{if(!n.k[o.h]){n.k[o.h]=1;ch=1}});if(ch){document.querySelectorAll("#kn .nd").forEach(x=>x.remove());save();nwUpdate()}}
function nwOpen(s){
  if(s!=="y"&&s!=="i")return;
  schedule(()=>{if(TS!==s)return;
    if(s==="y")nwSeenK();
    else{const n=nwS();if(Object.keys(n.p).length){n.p={};save();renderPet();nwUpdate()}}
  },2500);
}
  function drawNav(){
  const L=S.god?99:Math.max(ri(uxp()),S.pk||0);
  const nav=activeGR().filter(g=>g.s.some(x=>(x[2]||0)<=L||S.god));
  let G=nav.find(x=>x.id===TG);if(!G){TG=nav[0].id;G=nav[0];TS=G.s[0][0]}
  const vis=G.s.filter(x=>(x[2]||0)<=L||S.god);
  if(!vis.some(x=>x[0]===TS))TS=vis[0][0];
  ALLS.forEach(i=>{const el=$(i);if(el)el.hidden=i!==TS});
  const groups=nav.map(g=>`<button data-g="${g.id}" class="${g.id===TG?"on":""}">${g.n}</button>`).join("");
  const screens=vis.map(x=>`<button data-s="${x[0]}" class="${x[0]===TS?"on":""}">${x[1]}</button>`).join("");
  const changed=[];
  if(groups!==groupMarkup){$("gn").innerHTML=groups;groupMarkup=groups;changed.push("gn")}
  if(screens!==screenMarkup){$("sn").innerHTML=screens;screenMarkup=screens;changed.push("sn")}
  $("sn").hidden=vis.length<2;try{nwApply()}catch(e){}
  changed.forEach(id=>{const n=$(id),b=n.querySelector(".on");if(b)n.scrollLeft=b.offsetLeft-(n.clientWidth-b.offsetWidth)/2});
  $("lkh").textContent=(S.ui&&S.ui.studyOnly)?"Chế độ Chỉ học — bật lại trong Cài đặt.":(L<2?"Trúc Cơ mở Tông môn và Thiên kiếp.":"");
 }
 function go(g,s){TG=g;const G=activeGR().find(x=>x.id===g)||activeGR()[0];TS=s||(G.s.some(x=>x[0]===TS)?TS:G.s[0][0]);drawNav();if(deps.onNavigate)deps.onNavigate(TS);nwOpen(TS);say("")}
 $("gn").onclick=e=>{const b=e.target.closest("button");if(b)go(b.dataset.g)};
 $("sn").onclick=e=>{const b=e.target.closest("button");if(b)go(TG,b.dataset.s)};
 return Object.freeze({drawNav,go,update:nwUpdate,seenK:nwSeenK,settings:()=>({group:TG,screen:TS})});
 }
 root.GameNavigationUI=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
