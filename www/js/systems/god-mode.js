/* God mode system: diagnostics and privileged test actions. */
(function(root){
 "use strict";
 function create(deps){
  const {S,KD,END,B,cum,CD,ALLS,RL,TITLES,ITEMS,IC,PS,SPQ,SECTS,KEY,today,hAdd,ri,say,doRebirth,showThd,lbInit,weekStart,settle,KS,vlog,resolveEx,warGain,nextEx,spRoll,lbRows,save,renderGod,render,go,askName,sfx,burst}=deps;
  const setStreak=deps.setStreak,curStreak=deps.curStreak,kAge=deps.kAge,storage=deps.storage,location=deps.location,schedule=deps.schedule,getMaxXp=deps.getMaxXp,$=deps.$;
  function calib(){const o=[];for(const d of [28,56,84,112,KD,126]){const m=d*1440;let s=0;for(let j=0;j<B.length;j++){cum(j,m);s+=CD[j][m]+B[j].p}o.push("Ngày "+d+": NPC trung bình "+Math.round(s/B.length)+" linh lực")}$("gout").textContent="Mốc viên mãn "+END+" ở ngày "+KD+"\n"+o.join("\n")}
function selfCheck(){
  const r=[],ok=(n,c)=>r.push((c?"✓ ":"✗ ")+n),fin=Number.isFinite;
  ok("Linh lực hợp lệ ("+Math.round(S.points)+")",fin(S.points)&&S.points>=0);
  const menh=S.menh??100;
  ok("Mệnh "+menh+"/100",fin(menh)&&menh>=0&&menh<=100);
  ok("Giờ nhàn hạ hợp lệ",fin(S.gameSec)&&S.gameSec>=0);
  ok("Đủ "+ALLS.length+" mục giao diện",ALLS.every(i=>$(i)));
  ok("Nhiệm vụ đều có tên và linh lực",S.quests.every(q=>q.name&&fin(q.pts)));
  ok("Bước liên hoàn không mồ côi",S.quests.every(q=>!q.chain||S.chains.some(c=>c.id===q.chain)));
  ok("Lịch sử không có số âm hoặc NaN",Object.values(S.hist).every(h=>fin(h.p)&&h.p>=0&&fin(h.m)&&h.m>=0));
  ok("Bảng xếp hạng ("+B.length+" tu sĩ)",!!S.lb&&B.length>0);
  ok("Mốc cảnh giới tăng dần",RL.every((x,i)=>!i||x[1]>RL[i-1][1]));
  ok("Danh hiệu: "+TITLES.length,TITLES.every(t=>t.n&&t.b&&t.d&&typeof t.ok==="function"));
  ok("Vật phẩm: "+ITEMS.length,ITEMS.every(i=>IC[i.id]));
  ok("Vật phẩm hoàn lại ≥ giá mua",ITEMS.every(i=>!i.q||i.tot>=i.c));
  ok("Linh thú: "+PS.length,PS.every(p=>p.e(1)&&p.e(5)));
  ok("Linh thú đang theo hợp lệ",!S.act||!!(S.pets&&S.pets[S.act]));
  ok("Tên: "+(S.name||"chưa"),true);
  ok("Kiếp "+KD+" ngày, còn "+Math.max(0,Math.ceil(KD-kAge()))+" ngày",true);
  ok("Giờ giả lập: "+(S.hh==null?"thật":S.hh+"h"),true);
  let sz=0;try{sz=(storage.getItem(KEY)||"").length}catch(e){}
  ok("Lưu trữ ("+Math.round(sz/1024)+" KB)",sz>0);
  $("gout").textContent=r.join("\n");
}
function runGod(a,btn){
  const t=today(),add=n=>{S.points+=n;hAdd(t,n,0)};
  if(a==="wp"){
    if(!btn.dataset.arm){btn.dataset.arm=1;btn.textContent="Bấm lần nữa!";schedule(()=>{delete btn.dataset.arm;btn.textContent="Tẩy trắng"},4000);return false}
    try{deps.resetProgress()}catch(error){say("Không thể đặt lại: "+error.message);return false}
    location.reload();return false;
  }
  if(a==="pt")add(1000);
  else if(a==="pb")add(10000);
  else if(a==="sv"){const raw=String($("gv")?.value??"").trim(),value=Number(raw);if(!raw||!Number.isSafeInteger(value)||value<0){say("Nhập linh lực nguyên không âm hợp lệ.");return false}S.points=value;hAdd(t,0,0)}
  else if(a==="xp"){const k=ri(S.points);if(RL[k+1])add(RL[k+1][1]-S.points);else say("Đã ở đỉnh cảnh giới.")}
  else if(a==="dt"){const mx=getMaxXp();add(Math.max(0,mx-S.points))}
  else if(a==="rb"){doRebirth();return false}
  else if(a==="pv"){showThd(deps.buildRecord());return false}
  else if(a==="rc"){if(!deps.confirm("Xóa lịch sử và số lần luân hồi?"))return false;S.rbh=[];S.rb=0}
  else if(a==="day"){advance(1,false);vlog("Thiên Đạo: tua 1 ngày")}
  else if(a==="st"){setStreak(curStreak()+1);vlog("Thiên Đạo: chuỗi +1")}
  else if(a==="gt")S.gameSec=(S.gameSec||0)+3600;
  else if(a==="tm"){S.tm=1;S.tmTasks=0}
  else if(a==="tma"){S.tma=1;S.tmaTasks=0}
  else if(a==="tx"){S.tm=0;S.tmTasks=0;S.tma=0;S.tmaTasks=0}
  else if(a==="wk"){if(!S.lb)lbInit();const d=new Date(weekStart()+"T00:00:00");d.setDate(d.getDate()-7);S.lb.week=d.toLocaleDateString("sv");settle()}
  else if(a==="kf")S.kf=t;
  else if(a==="kc")S.kc={};
  else if(a==="it")ITEMS.filter(i=>!i.once).forEach(i=>S.inv[i.id]=(S.inv[i.id]||0)+3);
  else if(a==="bf"){S.buff={n:5,m:1.25};S.fx=[{n:3,v:30,t:""},{n:2,v:30,t:"q"},{n:2,v:30,t:"l"}];S.xb={u:Date.now()+864e5,v:15};S.tb=Date.now()+864e5;S.sl=1;S.ln=t;S.sh=1;S.lt=15;S.eb=100;S.pw=3;S.kd=t;S.tcCharges=4;S.cbUntil=Date.now()+864e5}
  else if(a==="k0"){const o=KS().start;KS().start=Date.now()-KD*864e5-1e3;KS().skx=(KS().skx||0)+(o-KS().start)}
  else if(a==="ti")TITLES.forEach(x=>(S.tt||(S.tt={}))[x.id]=Date.now());
  else if(a==="tr"){S.tt={};S.ft=false;S.title=""}
  else if(a==="ic"){S.inv={};S.buff={n:0,m:1};S.fx=[];S.xb=null;S.sh=0;S.lt=0;S.eb=0;S.pw=0;S.sl=0;S.tb=0;S.ln=null;S.kd=null;S.tcCharges=0;S.cbUntil=0}
  else if(a==="hh"){const c=[null,23,6,12];const cur=S.hh==null?null:S.hh;S.hh=c[(c.indexOf(cur)+1)%4]}
  else if(a==="ev")hAdd(t,0,Math.max((S.ev.w||{}).h||10,(S.ev.m||{}).h||40)*60);
  else if(a==="ex"){S.sem=S.sem||{res:{}};const o=KS().start;KS().start=Date.now()-KD*864e5;KS().skx=(KS().skx||0)+(o-KS().start);S.sem.res={};resolveEx()}
  else if(a==="xr"){S.sem=null;S.exLock=null}
  else if(a==="sw"){if(S.sect==null)S.sect=0;const w=warGain();vlog("Thiên Đạo: thắng tông chiến +"+w)}
  else if(a==="js"){S.sect=Math.floor(Math.random()*SECTS.length);S.master=null}
  else if(a==="bm"){if(S.sect==null)S.sect=0;S.master=S.sect}
  else if(a==="mh"){S.menh=100;S.failStreak=0}
  else if(a==="m0"){S.menh=0;S.tdPenalty=true;S.tdStacks=Math.max(1,S.tdStacks||0)}
  else if(a==="ax"){S.tdPenalty=false;S.tdStacks=0;S.failStreak=0;S.menh=Math.max(S.menh||0,100)}
  else if(a==="fp"){S.tdPenalty=true;S.tdStacks=(S.tdStacks||0)+1;S.menh=0}
  else if(a==="cr"){S.claimed={};S.ci={last:"",n:0}}
  else if(a==="ps"){S.pets={};S.act=""}
  else if(a==="cal"){calib();return false}
  else if(a==="pa"){S.pets=S.pets||{};PS.forEach(p=>S.pets[p.id]={lv:5,t:Date.now()});if(!S.act)S.act="hl"}
  else if(a==="pe"){S.pets=S.pets||{};if(!S.pets.hl)S.pets.hl={lv:1,t:Date.now()};S.pets.hl.t=Date.now()-8*36e5;S.act="hl"}
  else if(a==="ft")S.ft=!S.ft;
  else if(a==="sp0"||a==="sp1"||a==="sp2"){const nx=nextEx();if(!nx){say("Không còn thiên kiếp kế tiếp.");return false}S.sp={k:+a.slice(2),ex:nx.id,t:Date.now()};vlog("Thiên Đạo ban "+SPQ[+a.slice(2)].n)}
  else if(a==="spx"){S.sp=null;if(S.lb){S.lb.sp={}}}
  else if(a==="spr"){lbInit();const sg=spRoll(lbRows(),Math.floor(Math.random()*1e6));save();renderGod();render();say(sg.length?"Trúng: "+sg.map(x=>x.n+" ("+SPQ[x.k].n+")").join(", "):"Không ai trúng (không trúng quay, đã giữ cơ duyên, hoặc hết thiên kiếp kế tiếp).");return false}
  else if(a==="sx")setStreak(0);
  else if(a==="sb"){const n=curStreak();setStreak(0);S.tm=1;S.tmTasks=0;KS().tm=(KS().tm||0)+1;vlog("Thiên Đạo: đứt chuỗi "+n+" ngày → tâm ma")}
  else if(a==="sd")S.seed=1+Math.floor(Math.random()*1e9);
  else if(a==="qs"){[["Ôn bài",45,0],["Đọc sách",30,0],["Luyện code",60,0],["Làm đề",120,0],["Nhanh 1 giờ",30,Date.now()+36e5]].forEach(([n,m,d],i)=>S.quests.push({id:"g"+Date.now().toString(36)+i,name:"[Mẫu] "+n,pts:Math.max(1,Math.round(m/60*(S.perHour||280))),mins:m,due:d||null,repeat:false,doneOn:null}))}
  else if(a==="fx"){sfx(523);schedule(()=>sfx(784),130);burst()}
  else if(a==="ck"){selfCheck();return false}
  else if(a==="off"){S.god=false;go("s","s");save();deps.refreshSettings?.();render();say("Đã tắt Thiên Đạo.");return false}
  else return null;
  return true;
}
  function advance(n,keep){
    const prev=curStreak();
    KS().skd=(KS().skd||0)+n*864e5;S.dOff=(S.dOff||0)+n;if(S.lb)S.lb.t0-=n*864e5;KS().start-=n*864e5;
    if(keep)setStreak(prev+n);
  }
  return Object.freeze({calib,selfCheck,run:runGod,advance});
 }
 root.GameGodModeSystem=Object.freeze({create});
})(typeof window!=="undefined"?window:globalThis);
