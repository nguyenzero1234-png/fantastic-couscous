/* Mô phỏng tu vi NPC và phân bổ tông môn; giữ cache nội bộ, nhận nguồn ngoài qua DI. */
(function(root){
 "use strict";
 function create(deps){
  const {B,BH,CDN,leaderboardData}=deps;
  const S=deps.state,hs=deps.hash,vn=deps.noise,getSalt=deps.getSalt,getBxp=deps.getBxp;
  const EC=[],RK=[];let RKn=0;
  function advance(M){
  while(RKn<M){
    RKn++;
    const x=[];for(let j=0;j<B.length;j++){cum(j,RKn*60);x.push([j,CD[j][RKn*60]+B[j].p])}
    x.sort((a,b)=>b[1]-a[1]);const r=[];x.forEach((q,k)=>{r[q[0]]=k});RK[RKn]=r;
  }
}
const rkf=(i,m)=>{if(m<=0)return 1;advance(m);return 1+2*Math.pow(RK[m][i]/(B.length-1),1.5)};
/* Thái Dương Vương Triều (Lăng Tiêu Hàn): hạng 1 lúc kích hoạt → ×1,35 tỉ lệ xuất hiện cơ duyên trong cửa sổ 5 ngày (m tính theo giờ mô phỏng) */
function lthM(i,m){
  const w=S.lb&&S.lb.td;if(!w||!w.length||B[i].n!=="Lăng Tiêu Hàn")return 1;
  for(const g of w)if(g.t===1&&m*60>=g.x0&&m*60<g.x1)return 1.35;
  return 1;
}
/* Bách Gia Hội Tụ (Hạ Trường Ca): đếm số loại cơ duyên khác nhau đã xuất hiện; HTC.f[k] = thời điểm (giờ) loại k xuất hiện lần đầu */
const HTC={s:0,f:Array(9).fill(Infinity)};
const htReset=()=>{HTC.s=0;HTC.f.fill(Infinity)};
function htCount(i,t){
  const n=Math.floor(t);
  while(HTC.s<=n){const m=HTC.s++,v=evAt(i,m);if(v&&HTC.f[v.k]===Infinity)HTC.f[v.k]=v.m+v.ph}
  let c=0;for(const x of HTC.f)if(x<=t)c++;
  return c;
}
/* Vạn Hóa Quy Nhất: sau khi gặp đủ 9 loại, mỗi ngày +0,3% hiệu suất, tối đa +20% */
function htLate(t){const T=Math.max(...HTC.f);return isFinite(T)&&T<=t?Math.min(0.2,0.003*(t-T)/24):0}
function htExtra(i,ms){
  if(!BH[i].ht)return 0;
  const t=(ms-S.lb.t0)/SP/60;if(!(t>0))return 0;
  htCount(i,t);
  return HTC.f.every(x=>x<=t)?50000:0;
}
function evAt(i,m){
  const ec=EC[i]||(EC[i]={});if(m in ec)return ec[m];
  const o=BH[i];let r=null;
  if(hs(i+1+getSalt(),20,m)>1-o.lam*o.lm*lthM(i,m)*rkf(i,m)/12){
    const a=Math.abs(hs(i+1+getSalt(),21,m)),c=Math.abs(hs(i+1+getSalt(),22,m)),k=Math.floor(Math.abs(hs(i+1+getSalt(),23,m))*9)%9;
    r={i,m,k,c,ph:Math.abs(hs(i+1+getSalt(),24,m)),dur:(6+a*18)*o.dm*(k===5?2:1),dh:1+(o.dh*o.dhm-1)*c,flat:Math.round(500+2500*c),name:CDN[k]};
  }
  return ec[m]=r;
}
const FL=[];
function fl(i,n){const c=FL[i]||(FL[i]={});if(c[n])return c[n];const L=[];for(let m=n-79;m<=n;m++){const v=evAt(i,m);if(v&&m+v.ph+v.dur>n)L.push(v)}return c[n]=L}
function eff(i,t){
  const o=BH[i];let h=o.h+o.fh,e=1+o.eb,nv=1;if(o.ht)e*=1+0.02*htCount(i,t)+htLate(t);
  for(const v of fl(i,Math.floor(t))){const st=v.m+v.ph;if(t<st||t>=st+v.dur)continue;
    if(v.k===0||v.k===5)h+=v.dh;else if(v.k===1)e*=1.25+0.35*v.c;else if(v.k===3){nv*=0.35;h+=0.5*v.dh}else if(v.k===6){e*=1.3;h+=1}else if(v.k===7){nv*=2.5;e*=1.4}}
  return {h:Math.min(o.cap,h),e,nv};
}
const hrAt=(i,t)=>eff(i,t).h;
const hrs=(i,n)=>hrAt(i,n+0.5);
const efTxt=e=>leaderboardData.eventEffectText(e,B[e.i],BH[e.i]);
const CH=[],CD=[],SP=60000;
function cum(i,k){
  const c=CH[i]||(CH[i]=[0]),d=CD[i]||(CD[i]=[0]),b=B[i],o=BH[i];
  while(c.length<=k){
    const s=c.length-1,n=Math.floor(s/60),f=eff(i,s/60);
    let bu=0;
    const v=evAt(i,n);
    if(v&&Math.floor((n+v.ph)*60)===s){if(v.k===2)bu=60*(1+b.b)*(2+4*v.c)*o.bm;else if(v.k===4)bu=Math.max(150,0.02*d[s])*o.bm;else if(v.k===8)bu=v.flat*o.bm;if(o.neg)bu=-bu}
    const dr=f.h*60*(1+b.b)/1440*f.e*(1+0.3*vn(i+1+getSalt(),9,s/60))+bu;
    let g=hs(i+1+getSalt(),1,s)*b.v*0.237*o.vm*f.nv;
    const j=hs(i+1+getSalt(),2,s);
    if(Math.abs(j)>1-0.0024*o.jm)g+=(o.jp?(hs(i+1+getSalt(),4,s)>-o.jp?1:-1):Math.sign(j))*b.v*1.8*(0.5+Math.abs(hs(i+1+getSalt(),3,s)));
    c.push(c[s]+(dr+g)*o.sm);d.push(d[s]+dr*o.sm);
  }
  return c[k];
}
const SO=[],SN=[0,0,0,0,0,0];
function computeSO(){
  const T=S.lb.t0+7*864e5,q=B.map((b,i)=>({i,v:getBxp(i,T)})).sort((x,y)=>y.v-x.v),ord=[0,1,2,3,4,5,5,4,3,2,1,0];
  q.forEach((e,k)=>{SO[e.i]=ord[k%12]});SN.fill(0);SO.forEach(s=>SN[s]++);
}
  function invalidateAt(x0){
   const kx=Math.floor(x0),hm=Math.ceil(x0/60);
   for(let j=0;j<B.length;j++){
    if(CH[j]&&CH[j].length>kx+1)CH[j].length=kx+1;
    if(CD[j]&&CD[j].length>kx+1)CD[j].length=kx+1;
    const ec=EC[j];if(ec)for(const m in ec)if(+m>=hm)delete ec[m];
    const fc=FL[j];if(fc)for(const n in fc)if(+n>=hm)delete fc[n];
   }
   RKn=Math.min(RKn,Math.max(0,hm-1));RK.length=Math.min(RK.length,RKn+1);htReset();
  }
  function reset(){CH.length=0;CD.length=0;EC.length=0;FL.length=0;RK.length=0;SO.length=0;RKn=0;htReset()}
  return Object.freeze({advance,rkf,lthM,HTC,htReset,htCount,htLate,htExtra,evAt,EC,FL,fl,eff,hrAt,hrs,efTxt,CH,CD,SP,cum,SO,SN,computeSO,invalidateAt,reset});
 }
 root.GameLeaderboardSimulation=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);

/* Leaderboard system: weekly settlement, NPC effects and special fortunes. */
(function(root){
 "use strict";
 function create(deps){
  const {S,B,KS,save,vlog}=deps;
  const simulation=deps.simulation,leaderboardData=deps.leaderboardData,npcData=deps.npcData,hs=deps.hash,getSalt=deps.getSalt;
  const EX=deps.exams,KD=deps.days,exD=deps.examDate,playerXpAt=deps.playerXpAt,weekStart=deps.weekStart,myRk=deps.myRank,warReward=deps.warReward,getBxpX=deps.bxpAt;
  const SP=simulation.SP,cum=simulation.cum,CD=simulation.CD,htExtra=simulation.htExtra,SO=simulation.SO,computeSO=simulation.computeSO;
  const bsX=(i,x)=>{const k=Math.floor(x);if(k<0)return B[i].p;const f=x-k;return B[i].p+cum(i,k)*(1-f)+cum(i,k+1)*f};
// Bất Diệt Kim Thân: cửa sổ buff tốc độ học (x0..x1 theo phút mô phỏng, m = +10% hoặc +20%)
function gbExtra(i,ms,fn){
  const w=S.lb&&S.lb.gb;if(!w||!w.length||B[i].n!=="Giang Thừa Ảnh")return 0;
  const x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){const x1=Math.min(x,g.x1);if(x1>g.x0)t+=g.m*(fn(i,x1)-fn(i,g.x0))}
  return t;
}
/* ===== Đạo Vận (Bạch Nhược Hư) =====
   Mỗi 10 ngày kể từ ngày 5 của kiếp, cướp toàn bộ tăng trưởng linh lực của hạng 1 (không tính chính hắn) trong 3 ngày.
   Hạng 1 là người chơi → cướp của hạng 2. 30% thất bại. Cướp được cộng dồn với tăng trưởng cá nhân; nạn nhân mất đúng phần bị cướp.
   Cửa sổ được chốt (người bị cướp, thành/bại) một lần khi tới giờ và lưu ở S.lb.dv. */
let BNH_I=-2,BNH_BUSY=0;
const bnhI=()=>BNH_I>=-1?BNH_I:(BNH_I=B.findIndex(b=>b.n==="Bạch Nhược Hư"));
const immuneTaiHu=i=>npcData.isImmuneTaiHu(i,B);
const bnhBase=()=>{const k=KS().start,b=(k-S.lb.t0)/SP;return isFinite(b)?b:0};
const bnhX0=w=>bnhBase()+(4+10*w)*1440;
function bnhSync(){
  if(BNH_BUSY||!S.lb)return;const bi=bnhI();if(bi<0)return;
  if(!S.lb.dv)S.lb.dv=[];
  const now=Date.now();
  if(now<S.lb.t0+bnhX0(S.lb.dv.length)*SP)return;
  BNH_BUSY=1;
  try{
    while(S.lb.dv.length<60){
      const w=S.lb.dv.length,x0=bnhX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=[];
      for(let j=0;j<B.length;j++)if(j!==bi)rows.push({j,s:sc(j,ms)});
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      let tg=rows[0];if(tg&&tg.j===-1)tg=rows[1];
       const immune=!!tg&&immuneTaiHu(tg.j),ok=!immune&&Math.abs(hs(bi+1+getSalt(),330,w))>=.3;
       S.lb.dv.push({x0,x1:x0+3*1440,v:tg?tg.j:-1,ok,immune});
       vlog(immune?"Thái Hư Bất Thoái: Cố Thái Hư miễn nhiễm Đạo Vận; Bạch Nhược Hư không cướp được tăng trưởng.":ok&&tg?"Đạo Vận: Bạch Nhược Hư cướp tăng trưởng linh lực của "+B[tg.j].n+" trong 3 ngày.":"Đạo Vận: Bạch Nhược Hư cướp đoạt thất bại.");
    }
  }finally{BNH_BUSY=0}
}
function bnhExtra(i,ms,fn){
  const w=S.lb&&S.lb.dv;if(!w||!w.length)return 0;
  const bi=bnhI();let t=0;const x=(ms-S.lb.t0)/SP;
  for(const g of w){
    if(!g.ok||g.v<0||immuneTaiHu(g.v)||(i!==bi&&i!==g.v))continue;
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    const d=Math.max(0,fn(g.v,x1)-fn(g.v,g.x0));
    t+=i===bi?d:-d*(B[i].n==="Hạ Trường Ca"?.5:1);
  }
  return t;
}
/* ===== Hồng Nhan Hoạ Thủy (Liễu Như Yên) =====
   Mỗi 20 ngày (mốc ngày 20, 40, ... của kiếp): nếu Liễu đứng hạng 6 trở xuống thì
   - hạng 1-5 (trừ người chơi và Cố Thái Hư) chịu «Tâm thần điên đảo»: -15% linh lực nhận từ mọi nguồn trong 5 ngày;
   - Liễu nhận «Thăng Hoa» trong 5 ngày: +2.000 linh lực mỗi ngày.
   Cửa sổ được chốt một lần khi tới giờ và lưu ở S.lb.hh. */
let LNY_I=-2,LNY_BUSY=0;
const lnyI=()=>LNY_I>=-1?LNY_I:(LNY_I=B.findIndex(b=>b.n==="Liễu Như Yên"));
const lnyX0=w=>bnhBase()+20*(w+1)*1440;
function lnySync(){
  if(LNY_BUSY||!S.lb)return;const li=lnyI();if(li<0)return;
  if(!S.lb.hh)S.lb.hh=[];
  const now=Date.now();
  if(now<S.lb.t0+lnyX0(S.lb.hh.length)*SP)return;
  LNY_BUSY=1;
  try{
    while(S.lb.hh.length<40){
      const w=S.lb.hh.length,x0=lnyX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=B.map((b,j)=>({j,s:sc(j,ms)}));
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      const rk=rows.findIndex(r=>r.j===li)+1,on=rk>=6?1:0;
      const tg=on?rows.slice(0,5).filter(r=>r.j>=0&&!immuneTaiHu(r.j)).map(r=>r.j):[];
      S.lb.hh.push({x0,x1:x0+5*1440,on,tg});
      vlog(on?"Hồng Nhan Hoạ Thủy: Liễu Như Yên đứng hạng "+rk+", giáng «Tâm thần điên đảo» (-15% linh lực mọi nguồn, 5 ngày) lên "+(tg.length?tg.map(j=>B[j].n).join(", "):"không ai")+" và nhận «Thăng Hoa» (+2.000 linh lực/ngày, 5 ngày).":"Hồng Nhan Hoạ Thủy: Liễu Như Yên đứng hạng "+rk+" nên không kích hoạt.");
    }
  }finally{LNY_BUSY=0}
}
function lnyExtra(i,ms,fn){
  const w=S.lb&&S.lb.hh;if(!w||!w.length)return 0;
  const li=lnyI(),x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){
    if(!g.on)continue;
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    if(i===li)t+=2000*(x1-g.x0)/1440;
    else if(g.tg.indexOf(i)>=0)t-=(B[i].n==="Hạ Trường Ca"?.075:.15)*Math.max(0,fn(i,x1)-fn(i,g.x0));
  }
  return t;
}
/* ===== Thái Dương Vương Triều (Lăng Tiêu Hàn) =====
   Mỗi 10 ngày kích hoạt 1 lần (lần đầu vào ngày 10 của kiếp), hiệu ứng kéo dài 5 ngày. Hạng được chốt đúng lúc kích hoạt:
   - hạng 1: ×1,35 tỉ lệ xuất hiện cơ duyên (xử lý trong evAt qua lthM);
   - hạng 2-5: +20% tốc độ tu luyện (cộng thêm 20% phần linh lực tăng trong 5 ngày);
   - hạng 6-50: +500 linh lực mỗi ngày.
   Cửa sổ được chốt một lần khi tới giờ và lưu ở S.lb.td. Khi chốt cửa sổ hạng 1 thì xóa cache mô phỏng từ mốc đó trở đi. */
let LTH_I=-2,LTH_BUSY=0;
const lthI=()=>LTH_I>=-1?LTH_I:(LTH_I=B.findIndex(b=>b.n==="Lăng Tiêu Hàn"));
const lthX0=w=>bnhBase()+10*(w+1)*1440;
function lthInval(x0){simulation.invalidateAt(x0)}
function lthSync(){
  if(LTH_BUSY||!S.lb)return;const li=lthI();if(li<0)return;
  if(!S.lb.td)S.lb.td=[];
  const now=Date.now();
  if(now<S.lb.t0+lthX0(S.lb.td.length)*SP)return;
  LTH_BUSY=1;
  try{
    while(S.lb.td.length<12){
      const w=S.lb.td.length,x0=lthX0(w),ms=S.lb.t0+x0*SP;if(now<ms)break;
      const rows=B.map((b,j)=>({j,s:sc(j,ms)}));
      rows.push({j:-1,s:playerXpAt(new Date(ms))});
      rows.sort((a,b)=>b.s-a.s);
      const rk=rows.findIndex(r=>r.j===li)+1,t=rk===1?1:rk<=5?2:rk<=50?3:0;
      S.lb.td.push({x0,x1:x0+5*1440,t,rk});
      if(t===1)lthInval(x0);
      vlog(t===1?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng 1, cơ duyên xuất hiện thường xuyên hơn 35% trong 5 ngày."
        :t===2?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+", nhận thêm 20% tốc độ tu luyện trong 5 ngày."
        :t===3?"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+", mỗi ngày nhận thêm 500 linh lực trong 5 ngày."
        :"Thái Dương Vương Triều: Lăng Tiêu Hàn đứng hạng "+rk+" nên không nhận hiệu ứng.");
    }
  }finally{LTH_BUSY=0}
}
function lthExtra(i,ms,fn){
  const w=S.lb&&S.lb.td;if(!w||!w.length||i!==lthI())return 0;
  const x=(ms-S.lb.t0)/SP;let t=0;
  for(const g of w){
    const x1=Math.min(x,g.x1);if(x1<=g.x0)continue;
    if(g.t===2)t+=.2*(fn(i,x1)-fn(i,g.x0));
    else if(g.t===3)t+=500*(x1-g.x0)/1440;
  }
  return t;
}
const bs=(i,ms)=>{bnhSync();lnySync();lthSync();return bsX(i,(ms-S.lb.t0)/SP)+spExtra(i,ms,bsX)+gbExtra(i,ms,bsX)+bnhExtra(i,ms,bsX)+lnyExtra(i,ms,bsX)+lthExtra(i,ms,bsX)+htExtra(i,ms)};
/* ===== Cơ duyên đặc biệt (chỉ 3 hạng cuối) =====
   Mỗi lần chốt bảng tuần, mỗi nhân vật đứng 3 hạng cuối quay một lần: 20% Chi Lực, 20% Gia Tốc, 20% Khai Ân, 40% không có.
   Một nhân vật chỉ giữ một cơ duyên đặc biệt tại một thời điểm. Hiệu lực đến thiên kiếp kế tiếp (chỉ riêng người đó). */
const SPQ=[
 {n:"Thiên Đạo Chi Lực",p:.2,npc:120,pl:30,pd:"+30 linh lực cố định mỗi nhiệm vụ",nd:"+120 linh lực mỗi ngày"},
 {n:"Thiên Đạo Gia Tốc",p:.2,mul:.4,mul2:1.4,pd:"linh lực nhận từ nhiệm vụ ×1,4",nd:"tốc độ tăng linh lực +40% (phần linh lực tăng thêm kể từ lúc nhận)"},
 {n:"Thiên Đạo Khai Ân",p:.2,f:.8,pd:"giảm 20% mốc linh lực, chuỗi đạo tâm và mức tu vi yêu cầu của thiên kiếp kế tiếp",nd:"giảm 20% mốc linh lực và chuỗi đạo tâm yêu cầu của thiên kiếp kế tiếp"}
];
const spA=()=>S.sp&&!(S.sem&&S.sem.res&&S.sem.res[S.sp.ex])?S.sp:null;
const spK=()=>{const p=spA();return p?p.k:-1};
const spKn=(i,e)=>{const p=S.lb&&S.lb.sp&&S.lb.sp[i];return p&&p.ex===e.id?p.k:-1};
const spE=(e,k)=>k===2?Object.assign({},e,{chuan:Math.round(e.chuan*SPQ[2].f),ls:Math.max(1,Math.round(e.ls*SPQ[2].f))}):e;
const nextEx=()=>EX.find(e=>e.day<KD&&!(S.sem&&S.sem.res[e.id])&&exD(e).getTime()>Date.now());
const spUntil=p=>{const e=EX.find(z=>z.id===p.ex);return e?(exD(e).getTime()+(KS().skx||0)-S.lb.t0)/SP:Infinity};
// Phần linh lực NPC được cộng thêm từ cơ duyên đặc biệt đang hiệu lực (tính theo bước mô phỏng x)
function spExtra(i,ms,fn){
  const p=S.lb&&S.lb.sp&&S.lb.sp[i];if(!p||p.k===2)return 0;
  const x1=Math.min((ms-S.lb.t0)/SP,spUntil(p));if(x1<=p.x0)return 0;
  return p.k===0?SPQ[0].npc*(x1-p.x0)/1440:SPQ[1].mul*(fn(i,x1)-fn(i,p.x0));
}
function lbRows(){const t=Date.now(),rows=B.map((b,i)=>({n:b.n,s:Math.max(0,bs(i,t)+(S.lb.adj[i]||0)),i,u:0}));rows.push({n:S.name||"Bạn",s:S.points,u:1});return leaderboardData.rankRows(rows)}
function spRoll(rows,seed){
  if(!S.lb.sp)S.lb.sp={};if(!S.lb.spl)S.lb.spl=[];
  const nx=nextEx(),got=[];if(!nx)return got;
  const eligible=rows.filter(r=>r.rank>=rows.length-2&&!(r.u?spA():S.lb.sp[r.i]));
  leaderboardData.rollSpecial(eligible,seed,getSalt(),hs).forEach(({row:r,k})=>{
    if(r.u){S.sp={k,ex:nx.id,t:Date.now()};vlog("Cơ duyên đặc biệt: "+SPQ[k].n+" — hiệu lực đến "+nx.n)}
    else S.lb.sp[r.i]={k,ex:nx.id,x0:(Date.now()-S.lb.t0)/SP};
    S.lb.spl.unshift({t:Date.now(),n:r.n,u:r.u?1:0,k,ex:nx.id});got.push({n:r.u?"bạn":r.n,k,u:r.u?1:0});
  });
  S.lb.spl.length=Math.min(S.lb.spl.length,60);
  return got;
}
// Hết thiên kiếp e: cơ duyên đặc biệt gắn với kiếp này hết hạn; phần linh lực NPC đã nhận được giữ lại
function spRetire(e,dn){
  if(S.lb&&S.lb.sp){
    if(!S.lb.spx)S.lb.spx={};
    for(const k in S.lb.sp){const p=S.lb.sp[k];if(p.ex!==e.id)continue;const i=+k;
      if(p.k!==2){S.lb.adj[i]=(S.lb.adj[i]||0)+spExtra(i,dn,bsX);S.lb.spx[i]=(S.lb.spx[i]||0)+spExtra(i,dn,getBxpX)}
      delete S.lb.sp[k]}
  }
  if(S.sp&&S.sp.ex===e.id)S.sp=null;
}
const BAL_RANK=40,BAL_MULT=1.25; // Hạng 40 trở xuống nhận Thiên Đạo Cân Bằng (+25% tốc độ)
const sc=(i,ms)=>Math.max(0,bs(i,ms)+(S.lb.adj[i]||0)+(S.lb.bal&&S.lb.bal[i]||0));
function lbInit(){if(!S.lb)S.lb={t0:Date.now()-24*3600000,week:weekStart(),adj:Array(50).fill(0),bal:Array(50).fill(0),log:""};if(!S.lb.bal)S.lb.bal=Array(50).fill(0);if(!S.lb.sp)S.lb.sp={};if(!S.lb.spx)S.lb.spx={};if(!S.lb.spl)S.lb.spl=[];if(!S.lb.gb)S.lb.gb=[];if(!S.lb.dv)S.lb.dv=[];if(!S.lb.hh)S.lb.hh=[];if(!S.lb.td)S.lb.td=[];if(!SO.length)computeSO()}
function playerBalanced(){return myRk()>=BAL_RANK}
function settle(){
  if(S.lb.week===weekStart())return;
  const t=Date.now();
  // Xếp hạng: 1 = cao nhất
  const rows=B.map((b,i)=>({n:b.n,s:Math.max(0,bs(i,t)+(S.lb.adj[i]||0)),i,u:0}));
  rows.push({n:S.name||"Bạn",s:S.points,u:1});
  rows.sort((a,b)=>b.s-a.s);
  rows.forEach((r,k)=>r.rank=k+1);
  // Thiên Đạo Cân Bằng: hạng 40 trở xuống — không còn trừ/tâm ma cuối bảng
  if(!S.lb.bal)S.lb.bal=Array(50).fill(0);
  S.lb.bal.fill(0);
  const helped=[];
  rows.forEach(r=>{
    if(r.rank<BAL_RANK)return;
    if(r.u){
      S.bal=1; // người chơi: +25% linh lực nhận khi còn hạng ≥40 (kiểm tra liên tục qua playerBalanced)
      helped.push(r.n+" (bạn)");
    }else{
      // NPC: cộng một lần ~12% điểm tuần này vào cột cân bằng (làm mới mỗi tuần)
      const bonus=Math.max(30,Math.floor(r.s*0.12));
      S.lb.bal[r.i]=bonus;
      helped.push(r.n);
    }
  });
  // Hạng < 40 không giữ bal tuần trước
  if(!playerBalanced())S.bal=0;
  const nHelp=rows.filter(r=>r.rank>=BAL_RANK).length;
  S.lb.log="Chốt bảng tuần: Thiên Đạo Cân Bằng ban ân cho "+nHelp+" vị hạng "+BAL_RANK+" trở xuống (+25% tốc độ cho đạo hữu khi còn dưới top "+(BAL_RANK-1)+"; NPC nhận linh lực cân bằng ~12%). Không còn hình phạt đứng cuối.";
  if(helped.length&&helped.length<=8)S.lb.log+=" Gồm: "+helped.slice(0,8).join(", ")+".";
  {const sg=spRoll(rows,Math.floor(Date.parse(weekStart()+"T00:00:00")/6048e5));if(sg.length)S.lb.log+=" Cơ duyên đặc biệt cho 3 hạng cuối: "+sg.map(x=>x.n+" ("+SPQ[x.k].n+")").join(", ")+"."}
  S.lb.log+=warReward();
  S.lb.week=weekStart();save();
}
const spark=(i,t0)=>leaderboardData.sparkline(Array.from({length:40},(_,j)=>sc(i,t0-(39-j)*90000)));
  return Object.freeze({SPQ,spA,spK,spKn,spE,nextEx,spUntil,spExtra,lbRows,spRoll,spRetire,BAL_RANK,BAL_MULT,sc,lbInit,playerBalanced,settle,spark,bs,bsX,immuneTaiHu});
 }
 root.GameLeaderboardSystem=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
