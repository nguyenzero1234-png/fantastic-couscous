/* ===== Thông báo nhắc nhở (Capacitor Local Notifications) — Phần 2–5 =====
   - Chỉ hoạt động trong app Capacitor (APK); trên trình duyệt thường sẽ tự bỏ qua.
   - Mỗi nhóm thông báo có dải id riêng: study 1000-1999, reward 2000-2999, ex 3000-3999, user 4000-4999.
   - user: người chơi tự tạo nhắc nhở (lưu trong S.nt.u).
   - Cải tiến: tự hủy + lên lịch lại ngay khi Thiên Đạo tua ngày; hiển thị trạng thái rõ ràng. */
(function(){
  const CAP=window.Capacitor;
  const native=!!(CAP&&CAP.isNativePlatform&&CAP.isNativePlatform());
  const LN=native&&CAP.Plugins?CAP.Plugins.LocalNotifications:null;
  const CH="nhacnho",TEST_ID=9001,MAXN=60;
  const RANGE={study:1000,reward:2000,ex:3000,user:4000};
  const cfg=()=>{
    const n=S.nt||(S.nt={});
    if(n.on==null)n.on=false;
    if(!n.t)n.t="20:00";
    if(!n.g)n.g={study:1,reward:1,ex:1,user:1};
    if(!Array.isArray(n.u))n.u=[];
    return n;
  };
  const nextAt=(h,m)=>{const d=new Date();d.setHours(h,m,0,0);if(d.getTime()<=Date.now()+60000)d.setDate(d.getDate()+1);return d};

  const quiet=d=>{const x=new Date(d);if(x.getHours()<8)x.setHours(8,0,0,0);else if(x.getHours()>=22){x.setDate(x.getDate()+1);x.setHours(8,0,0,0)}return x};
  const fmtHM=mi=>{const h=Math.floor(mi/60),r=mi%60,p=[];if(h)p.push(h+" giờ");if(r||!h)p.push(r+" phút");return p.join(" ")};
  const full=()=>!(S.ui&&S.ui.studyOnly);
  const APP="Tu Tiên Học Đạo";
  const GEN=["Đến giờ tu luyện rồi! Làm một nhiệm vụ nhỏ để tích linh lực.","Linh lực đang chờ bạn. Chỉ cần 25 phút thôi!","Đạo tâm cần được rèn mỗi ngày. Vào học một chút nhé.","Đừng để lâu quá, Thiên Kiêu Bảng đang chạy đua đó!"];
  const hm=()=>{const x=/^(\d\d):(\d\d)$/.exec(cfg().t||"20:00");return x?[+x[1],+x[2]]:[20,0]};
  const dayAt=(d,h,mi)=>{const x=new Date();x.setDate(x.getDate()+d);x.setHours(h,mi,0,0);return x};
  const fut=t=>t.getTime()>Date.now()+60000;

  function nextUserId(){
    const used=new Set((cfg().u||[]).map(x=>x.id|0));
    for(let i=1;i<900;i++)if(!used.has(i))return i;
    return Date.now()%900+1;
  }
  function addUserReminder(title,body,h,m){
    const c=cfg();
    if((c.u||[]).length>=20){say("Tối đa 20 nhắc nhở tùy chỉnh.");return false}
    title=(title||"").trim().slice(0,40);
    body=(body||"").trim().slice(0,80);
    if(!title){say("Nhập tiêu đề nhắc nhở.");return false}
    h=+h;m=+m;
    if(isNaN(h)||h<0||h>23||isNaN(m)||m<0||m>59){say("Giờ không hợp lệ.");return false}
    const id=nextUserId();
    c.u.push({id,title,body:body||title,h,m});
    save();run(true);return true;
  }
  function delUserReminder(id){
    const c=cfg();
    c.u=(c.u||[]).filter(x=>(x.id|0)!==(id|0));
    save();run(true);
  }

  const BLD={
    study:()=>{
      const out=[],now=Date.now(),[h,mi]=hm(),st=S.streak||{last:"",n:0},n=st.n||0,done=st.last===today();
      const atRisk=n>=2&&st.last===dayStr(1);
      for(let d=0;d<=3;d++){
        if(d===0&&done)continue;
        const at=dayAt(d,h,mi);if(!fut(at))continue;
        let body;
        if(d===0&&atRisk)body="Chuỗi "+n+" ngày đang chờ bạn. Làm một nhiệm vụ để giữ chuỗi!";
        else if(S.tm)body="Tâm ma đang làm giảm 20% linh lực bạn nhận. Hoàn thành "+Math.max(1,2-(S.tmTasks||0))+" nhiệm vụ từ 25 phút để xua tan.";
        else if(d===1&&done&&n>=2)body="Chuỗi "+n+" ngày đang chờ. Hôm nay làm thêm một nhiệm vụ nhé!";
        else body=GEN[d%GEN.length];
        out.push({id:d,title:APP,body,at});
      }
      if(n>=2){
        let k=-1,at=null;
        if(st.last===dayStr(1)){k=0;at=dayAt(0,21,30);if(!fut(at))at=dayAt(0,23,0)}
        else if(done){k=1;at=dayAt(1,21,30)}
        if(at&&fut(at)){
          const dd=dayAt(k,h,mi);
          if(!(fut(dd)&&Math.abs(dd-at)<45*60000))
            out.push({id:10+k,title:"Chuỗi sắp đứt!",body:"Chuỗi "+n+" ngày sắp đứt. Học trước nửa đêm để tránh tâm ma.",at});
        }
      }
      (S.quests||[]).filter(q=>q.due&&q.due>now+60000&&!isDone(q)).sort((a,b)=>a.due-b.due).slice(0,30).forEach((q,i)=>{
        const dd=new Date(q.due),eod=dd.getHours()===23&&dd.getMinutes()===59;
        let at,lead;
        if(eod){at=new Date(q.due);at.setHours(21,0,0,0);lead="sẽ hết hạn lúc nửa đêm";if(!fut(at)){at=new Date(q.due-30*60000);lead="chỉ còn 30 phút"}}
        else{at=new Date(q.due-15*60000);lead="chỉ còn 15 phút"}
        if(!fut(at))return;
        out.push({id:100+i,title:"Nhiệm vụ nhanh sắp hết hạn",body:"«"+String(q.name).slice(0,40)+"» "+lead+". Học ngay để nhận thưởng nhanh!",at});
      });
      if(!S.dOff){
        let k=0;
        [today(),dayStr(-1)].forEach(key=>{
          ((S.sched&&S.sched[key])||[]).forEach(sl=>{
            if(k>=30||!/^\d\d:\d\d$/.test(sl.s||""))return;
            const q=(S.quests||[]).find(x=>x.id===sl.qid);
            if(q&&isDone(q))return;
            const at=new Date(key+"T"+sl.s+":00");if(!fut(at))return;
            out.push({id:400+k++,title:"Đến giờ học theo lịch",body:sl.s+"-"+(sl.e||"")+": "+String(sl.label||(q&&q.name)||"Việc đã hẹn").slice(0,50),at});
          });
        });
      }
      const focus=GameTimer.activeFocus(),session=GameTimer.focusSession();
      if(focus&&session.endAt>now)out.push({id:700,title:"Học xong rồi!",body:"«"+String(focus.name).slice(0,40)+"» đã đủ "+focus.mins+" phút. Vào nhận linh lực nhé!",at:new Date(session.endAt)});
      const playEnd=GameTimer.playEndAt();
      if(playEnd&&playEnd>now)out.push({id:701,title:"Hết giờ chơi!",body:"Quay lại học tập để tích thêm linh lực.",at:new Date(playEnd)});
      return out;
    },
    reward:()=>{
      const out=[],now=Date.now();
      if(!full())return out;
      let petFull=false;
      try{
        const a=S.pets&&S.pets.hl;
        if(a&&S.act==="hl"){
          const at=quiet(new Date(a.t+8*36e5)),gain=Math.floor(8*(2+a.lv+(eqT("n6")?2:0)));
          if(a.t+8*36e5>now+60000)out.push({id:0,title:"Cửu Vĩ Hồ đã đầy",body:"Cửu Vĩ Hồ đã thu đủ "+gain+" linh lực. Vào nhận nhé!",at});
          else petFull=true;
        }
      }catch(e){}
      if(!S.dOff){
        try{
          const ws=weekStart(),sun=new Date(ws+"T00:00:00");sun.setDate(sun.getDate()+6);sun.setHours(18,0,0,0);
          const ev=S.ev.w,rem=ev.h*60-evCur("w");
          if(!S.claimed["w:"+ws]&&rem>0&&rem<=300&&fut(sun))out.push({id:10,title:"Sắp hết tuần!",body:"Tuần Luyện còn thiếu "+fmtHM(rem)+" nữa là nhận +"+ev.r+" linh lực. Hôm nay là ngày cuối tuần.",at:sun});
        }catch(e){}
        try{
          const t=new Date(),mo=today().slice(0,7),last=new Date(t.getFullYear(),t.getMonth()+1,0,18,0,0,0);
          const ev=S.ev.m,rem=ev.h*60-evCur("m");
          if(!S.claimed["m:"+mo]&&rem>0&&rem<=300&&fut(last))out.push({id:11,title:"Sắp hết tháng!",body:"Nguyệt Luyện còn thiếu "+fmtHM(rem)+" nữa là nhận +"+ev.r+" linh lực. Hôm nay là ngày cuối tháng.",at:last});
        }catch(e){}
      }
      try{
        const at=nextAt(12,0),isToday=at.toDateString()===new Date().toDateString(),parts=[];
        const c=S.ci;
        if(!S.dOff&&c&&c.last&&(isToday?c.last===dayStr(1):c.last===today())){
          const k=c.n%7+1,r=CI[k-1];
          parts.push("Điểm danh ngày "+k+": +"+r[0]+" linh lực"+(k===7?" (thưởng lớn)":""));
        }
        let f={};try{f=nwCompute()}catch(e){}
        const L=S.god?99:Math.max(ri(uxp()),S.pk||0),names=[];
        f.y=nwHas('#lenh button[data-a="lc"]:not([disabled]),#lenh button[data-a="kc"]:not([disabled])');
        activeGR().forEach(g=>g.s.forEach(x=>{if(["j","e","y","x"].includes(x[0])&&f[x[0]]&&(x[2]||0)<=L)names.push(x[1])}));
        if(names.length)parts.push("Chưa nhận thưởng ở: "+names.join(", "));
        if(petFull)parts.push("Cửu Vĩ Hồ đã đầy");
        if(parts.length)out.push({id:1,title:"Phần thưởng đang chờ",body:parts.join(" · "),at});
      }catch(e){}
      return out;
    },
    ex:()=>{
      const out=[],now=Date.now();
      try{
        const nx=S.kst?nextEx():null;
        if(nx){
          const T=exD(nx),menh=S.menh==null?100:S.menh;
          const warn=menh<=40?" Mệnh chỉ còn "+menh+", thất bại có thể hết Mệnh và bị Trừng Phạt.":"";
          let a1=new Date(+T-24*36e5),when="ngày mai";
          if(!fut(a1)){a1=new Date(+T-3*36e5);when="hôm nay"}
          if(fut(a1))out.push({id:0,title:"Thiên kiếp sắp giáng!",body:nx.n+" sẽ giáng xuống lúc 12:00 "+when+"."+warn+" Tích thêm linh lực và giữ chuỗi để vượt kiếp.",at:a1});
          if(fut(T))out.push({id:1,title:"Thiên kiếp đã giáng!",body:nx.n+" đã đến. Vào xem kết quả độ kiếp.",at:T});
        }
      }catch(e){}
      if(full()){
        try{
          const h0=Math.floor((now-KT0)/36e5),seen={};let k=0;
          for(let h=h0;h<=h0+48&&k<3;h++){
            const o=knAt(h);if(!o||o.st<=now||S.claimed["o:"+o.h])continue;
            const at=quiet(new Date(o.st));
            if(!fut(at)||o.en-at<2*36e5)continue;
            const day=at.toDateString();if(seen[day])continue;seen[day]=1;
            out.push({id:100+k++,title:"Kỳ ngộ bất ngờ!",body:o.name+": học "+o.T+" phút trong "+o.W+" giờ để nhận +"+o.pts+" linh lực.",at});
          }
        }catch(e){}
      }
      return out;
    },
    user:()=>{
      const out=[],list=cfg().u||[];
      list.forEach((u)=>{
        const h=u.h|0,m=u.m|0;
        [0,1].forEach(d=>{
          const at=dayAt(d,h,m);
          if(fut(at))out.push({id:(u.id|0)+d*200,title:u.title||"Nhắc nhở",body:u.body||u.title||"",at});
        });
      });
      return out.slice(0,40);
    }
  };
  function build(){
    const c=cfg(),out=[];
    Object.keys(BLD).forEach(g=>{
      if(!c.g[g])return;
      let arr=[];try{arr=BLD[g]()||[]}catch(e){console.warn("NT build "+g,e)}
      arr.forEach(n=>{if(n.at&&+n.at>Date.now()+((g==="study"&&(n.id===700||n.id===701))?0:5000))out.push({id:RANGE[g]+(n.id|0),title:n.title,body:n.body,at:n.at})});
    });
    out.sort((a,b)=>a.at-b.at);
    const timers=out.filter(n=>n.id===1700||n.id===1701);
    return timers.concat(out.filter(n=>n.id!==1700&&n.id!==1701).slice(0,MAXN-timers.length)).sort((a,b)=>a.at-b.at);
  }

  async function perm(ask){
    if(!LN)return "web";
    try{let p=await LN.checkPermissions();if(p.display!=="granted"&&ask)p=await LN.requestPermissions();return p.display}
    catch(e){return "error"}
  }
  async function channel(){
    if(!LN)return;
    await LN.createChannel({id:CH,name:"Nhắc nhở học tập",description:"Nhắc học, nhận thưởng, thiên kiếp",importance:4,visibility:1,vibration:true});
  }
  let busy=false,again=false,forceAgain=false,tm=null,lastDOff=S.dOff||0;
  let scheduled=new Map(),syncStatus="";
  function status(message){
    syncStatus=message;
    const el=document.getElementById("ntsync");
    if(el)el.textContent=message;
  }
  async function run(force){
    if(!LN||GameStateHandle.isWriteBlocked())return;
    if(busy){again=true;forceAgain=forceAgain||!!force;return}
    busy=true;
    try{
      const c=cfg(),permission=c.on?await perm(false):null;
      const allowed=c.on&&permission==="granted";
      const list=allowed?build():[];
      const desired=new Map(list.map(n=>[n.id,JSON.stringify([n.title,n.body,+n.at])]));
      const unchanged=desired.size===scheduled.size&&[...desired].every(([id,key])=>scheduled.get(id)===key);
      const message=!c.on?"Đã tắt lịch thông báo.":permission==="granted"?"Đã đồng bộ lịch thông báo.":permission==="error"?"Không kiểm tra được quyền thông báo.":"Chưa cấp quyền thông báo.";
      if(!force&&unchanged&&syncStatus===message)return;
      const pending=await LN.getPending();
      const ids=new Set((pending.notifications||[]).map(n=>n.id).filter(id=>id>=1000&&id<5000));
      const stale=[...ids].filter(id=>!desired.has(id));
      if(stale.length)await LN.cancel({notifications:stale.map(id=>({id}))});
      const changed=list.filter(n=>!ids.has(n.id)||scheduled.get(n.id)!==desired.get(n.id));
      if(changed.length){
        await channel();
        await LN.schedule({notifications:changed.map(n=>({id:n.id,title:n.title,body:n.body,channelId:CH,schedule:{at:n.at,allowWhileIdle:true}}))});
      }
      scheduled=desired;
      status(message);
    }catch(e){
      console.warn("NT run",e);scheduled.clear();
      status("Chưa đồng bộ được lịch thông báo. Sẽ thử lại.");
    }finally{
      busy=false;
      if(again){const force=forceAgain;again=false;forceAgain=false;run(force)}
    }
  }
  window.NTsave=()=>{
    if(!LN||tm!==null)return;
    tm=setTimeout(()=>{tm=null;run(false)},5000);
  };
  window.NTforce=()=>{
    if(!LN)return;
    if(tm!==null)clearTimeout(tm);
    tm=null;run(true);
  };

  const box=document.createElement("div");box.style.display="contents";box.id="ntbox";
  async function paint(){
    const c=cfg();let st;
    if(!native)st="Chỉ hoạt động trong app cài trên điện thoại (bản APK), không chạy trên trình duyệt.";
    else{
      const p=await perm(false);
      st=p==="granted"?"Đã được cấp quyền thông báo.":p==="denied"?"Quyền thông báo đang bị tắt. Vào Cài đặt điện thoại, mở mục Ứng dụng, chọn game rồi bật Thông báo.":"Chưa cấp quyền thông báo.";
    }
    const dOffNote=S.dOff?`<div style="margin-top:6px;padding:6px 8px;background:rgba(180,80,40,.12);border-radius:6px;font-size:12px;color:var(--red,#b45309)">Lịch game khác ngày thực. Một số thông báo theo lịch đang tạm tắt.</div>`:"";

    const list=c.u||[];
    let userHtml=`<details class="setting-advanced" data-k="ntcustom"${FO.ntcustom?" open":""}><summary>Nhắc nhở riêng (${list.length}/20)</summary>
      `;
    if(list.length){
      userHtml+=`<ul style="list-style:none;padding:0;margin:0 0 8px">`+list.map(u=>{
        const hh=String(u.h|0).padStart(2,"0"),mm=String(u.m|0).padStart(2,"0");
        return `<li style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,.06)">
          <div style="flex:1;min-width:0"><b>${esc(u.title||"Nhắc")}</b> <small>${hh}:${mm}</small>
          ${u.body&&u.body!==u.title?`<br><small style="opacity:.75">${esc(u.body)}</small>`:""}</div>
          <button class="btn alt" data-nt="udel" data-id="${u.id}" style="padding:2px 8px;font-size:12px">Xóa</button>
        </li>`;
      }).join("")+`</ul>`;
    }else{
      userHtml+=`<small style="display:block;margin-bottom:8px;opacity:.7">Chưa có nhắc nhở nào. Thêm bên dưới.</small>`;
    }
    userHtml+=`<div class="row" style="flex-wrap:wrap;gap:6px">
      <input type="text" id="ntut" placeholder="Tiêu đề (vd: Uống nước)" maxlength="40" style="flex:1;min-width:120px">
      <input type="text" id="ntub" placeholder="Nội dung (tùy chọn)" maxlength="80" style="flex:1;min-width:120px">
      <input type="time" id="ntuh" value="09:00" style="width:auto">
      <button class="btn" data-nt="uadd">Thêm</button>
    </div></details>`;

    box.innerHTML=`<details class="fold" data-k="nt"${FO.nt?" open":""}><summary>Nhắc nhở</summary><small>${st}</small><small id="ntsync" style="display:block">${syncStatus}</small>${dOffNote}
<div class="setting-actions"><button class="btn alt${c.on?" on":""}" data-nt="tg">${c.on?"Đang bật":"Bật thông báo"}</button><button class="btn alt" data-nt="test">Thử thông báo</button></div>
<div class="row"><label>Giờ nhắc học <input type="time" id="ntt" value="${c.t}"></label></div>
${userHtml}
</details>`;
  }
  box.onclick=async e=>{
    const b=e.target.closest("button[data-nt]");if(!b)return;
    const a=b.dataset.nt,c=cfg();
    if(a==="udel"){
      delUserReminder(+b.dataset.id);
      say("Đã xóa nhắc nhở.");
      paint();
      return;
    }
    if(a==="uadd"){
      const title=($("ntut")&&$("ntut").value)||"";
      const body=($("ntub")&&$("ntub").value)||"";
      const tv=($("ntuh")&&$("ntuh").value)||"09:00";
      const m=/^(\d\d):(\d\d)$/.exec(tv);
      if(!m){say("Chọn giờ hợp lệ.");return}
      if(addUserReminder(title,body,+m[1],+m[2])){
        say("Đã thêm nhắc nhở hàng ngày lúc "+tv+".");
        paint();
      }
      return;
    }
    if(!native){say("Chỉ dùng được trong app cài trên điện thoại.");return}
    if(a==="tg"){
      if(!c.on){
        const p=await perm(true);
        if(p!=="granted"){say("Chưa được cấp quyền thông báo. Hãy bật quyền trong cài đặt điện thoại.");paint();return}
        c.on=true;save();say("Đã bật thông báo.");run(true);
      }else{c.on=false;save();run(true);say("Đã tắt thông báo.")}
      paint();
    }else if(a==="test"){
      const p=await perm(true);
      if(p!=="granted"){say("Chưa được cấp quyền thông báo. Hãy bật quyền trong cài đặt điện thoại.");paint();return}
      try{
        await channel();
        await LN.schedule({notifications:[{id:TEST_ID,title:"Tu Tiên Học Đạo",body:"Thông báo thử: hệ thống nhắc nhở đã hoạt động!",channelId:CH,schedule:{at:new Date(Date.now()+5000),allowWhileIdle:true}}]});
        say("Đã hẹn thông báo thử sau 5 giây. Có thể thoát ra màn hình chính để xem.");
      }catch(x){say("Không hẹn được thông báo thử.")}
      paint();
    }
  };
  box.onchange=e=>{
    if(e.target.id==="ntt"&&/^\d\d:\d\d$/.test(e.target.value)){cfg().t=e.target.value;save();run(true);say("Đã đổi giờ nhắc học.")}
  };
  paint();
  $("setpanel").appendChild(box);

  if(native){
    run(true);
    document.addEventListener("visibilitychange",()=>{run(true);if(!document.hidden)paint()});
    window.addEventListener("pageshow",()=>run(true));
    setInterval(()=>run(false),60000);
    setInterval(()=>{
      const cur=S.dOff||0;
      if(cur!==lastDOff){
        lastDOff=cur;
        scheduled.clear();
        run(true);
        paint();
      }
    },1500);
  }
  window.NT={BLD,build,nextAt,run,RANGE,cfg,force:()=>run(true),addUserReminder,delUserReminder};
})();
