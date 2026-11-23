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
