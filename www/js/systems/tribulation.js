/* Core xử lý thiên kiếp: chấm điểm, Mệnh, thất bại và khóa xem kết quả. */
(function(root){
 "use strict";
 function create(deps){
  const {S,EX,exD,KD,KS,B,SP,sc,playerXpAt,immuneTaiHu,vlog,bxp,spKn,kh,khNpc,spE,streakAt,SPQ,ri,gr,daoTam,spRetire,save}=deps;
  const hs=deps.hash,getSalt=deps.getSalt,showTdLenh=deps.showTdLenh,showExModal=deps.showExModal,schedule=deps.schedule;
  function resolveEx(){
  if(!S.sem)S.sem={res:{}};
  const now=Date.now();let ch=0,pending=null;
  EX.forEach((e,ei)=>{
    const d=exD(e);if(now<d||S.sem.res[e.id])return;
    // Không cho thiên kiếp vượt quá ngày KD của kiếp hiện tại
    if(e.day>=KD)return;
    // dn: mốc thời gian của kiếp (bù phần thời gian bị tua tay bằng Thiên Đạo Lệnh); dv: ngày tương ứng trên lịch ảo của nhật ký
    const dn=d.getTime()+(KS().skx||0),dv=new Date(dn+(S.dOff||0)*864e5);
    // Thiên phú Bất Diệt Kim Thân (Giang Thừa Ảnh): 70% kích hoạt mỗi thiên kiếp, nhận chênh lệch với hạng 5 (30% số lần kích hoạt: hạng 2)
    {const gi=B.findIndex(b=>b.n==="Giang Thừa Ảnh");
     if(gi>=0&&S.lb&&Math.abs(hs(gi+1+getSalt(),310,ei))<.7){
       const k=Math.abs(hs(gi+1+getSalt(),311,ei))<.3?2:5;
       {const x0=(dn-S.lb.t0)/SP;if(!S.lb.gb)S.lb.gb=[];if(!S.lb.gb.some(g=>g.ex===e.id))S.lb.gb.push({ex:e.id,x0,x1:x0+5*1440,m:k===2?.2:.1})}
       const bd=B.map((b,j)=>({j,s:sc(j,dn)}));bd.push({j:-1,s:playerXpAt(dv)});bd.sort((a,b)=>b.s-a.s);
        const me=bd.find(z=>z.j===gi),tg=bd[k-1],immune=!!tg&&immuneTaiHu(tg.j),dl=tg&&tg.j!==gi&&!immune?Math.max(0,tg.s-me.s):0;
       if(dl>0){S.lb.adj[gi]=(S.lb.adj[gi]||0)+dl;if(!S.lb.spx)S.lb.spx={};S.lb.spx[gi]=(S.lb.spx[gi]||0)+dl}
        vlog("Bất Diệt Kim Thân: Giang Thừa Ảnh kích hoạt ở "+e.n+", "+(immune?"Cố Thái Hư miễn nhiễm phần chênh lệch; Giang không nhận linh lực chênh lệch.":dl>0?"nhận +"+Math.round(dl)+" linh lực, ngang hạng "+k:"đã đứng trên hạng "+k+" nên không nhận thêm")+". Tốc độ học +"+(k===2?20:10)+"% trong 5 ngày.");
     }}
    const rows=B.map((b,i)=>{const xp=bxp(i,dn),sk=spKn(i,e);return{n:b.n,xp,sp:sk,s:khNpc(xp,spE(e,sk))}});
    const ux=playerXpAt(dv);
    const stk=streakAt(dv,!!(KS().skx||KS().skd||(Date.now()-d.getTime())<3*864e5));
    {const psk=(S.sp&&S.sp.ex===e.id)?S.sp.k:-1,pe=spE(e,psk);rows.push({n:S.name||"Bạn",u:1,xp:ux,st:stk,sp:psk,s:kh(ux,pe,daoTam(stk,pe))})}
    rows.forEach(r=>{r.ok=ri(r.xp/(r.sp===2?SPQ[2].f:1))>=e.need;r.g=gr(r.s)});
    // Xếp hạng: điểm đánh giá cao hơn đứng trên; bằng điểm thì tu vi (linh lực) cao hơn đứng trên
    rows.sort((a,b)=>b.s-a.s||b.xp-a.xp);
    const me0=rows.find(r=>r.u);
    let menhLoss=0;
    if(!me0.ok||me0.g==="Yếu"){
      // Chuỗi thất bại tăng trừ Mệnh: +25% mỗi lần fail liên tiếp (tối đa ×2.5)
      S.failStreak=(S.failStreak||0)+1;
      const streakMul=Math.min(2.5,1+0.25*(S.failStreak-1));
      menhLoss=Math.round((10*e.w+(!me0.ok?6:0))*streakMul);
      S.menh=Math.max(0,(S.menh||100)-menhLoss);
      vlog("Kiếp nạn "+e.n+": trừ "+menhLoss+" Mệnh (chuỗi fail ×"+S.failStreak+", còn "+S.menh+")");
      if(S.menh<=0){
        S.menh=0;
        S.tdStacks=(S.tdStacks||0)+1;
        S.tdPenalty=true;
        schedule(()=>showTdLenh(),600);
      }
    }else{
      S.failStreak=0;
      if(me0.ok&&me0.g!=="Yếu"&&["Xuất sắc","Giỏi","Khá"].includes(me0.g)){S.life=S.life||{};S.life.exOk=(S.life.exOk||0)+1}
    }
    S.sem.res[e.id]={rows,claimed:false,loss:0,menhLoss,seen:false};spRetire(e,dn);ch=1;
    if(!pending)pending=e;
  });
  if(ch)save();
  // Bắt buộc xem bảng thiên kiếp trước khi chơi tiếp
  if(pending&&!S.exLock){S.exLock=pending.id;schedule(()=>showExModal(pending),300)}
}
  return Object.freeze({resolveEx});
 }
 root.GameTribulationSystem=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
