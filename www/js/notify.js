/* ===== Thông báo nhắc nhở (Capacitor Local Notifications) — Phần 2 (khung) + Phần 3 (nhắc học) + Phần 4 (thưởng, thiên kiếp, kỳ ngộ) =====
   - Chỉ hoạt động trong app Capacitor (APK); trên trình duyệt thường sẽ tự bỏ qua.
   - Mỗi nhóm thông báo có dải id riêng: study 1000-1999, reward 2000-2999, ex 3000-3999, user 4000-4999.
   - Các hàm trong BLD trả về danh sách {id (0-999), title, body, at: Date}. Phần 3, 4, 5 sẽ điền vào đây. */
(function(){
  const CAP=window.Capacitor;
  const native=!!(CAP&&CAP.isNativePlatform&&CAP.isNativePlatform());
  const LN=native&&CAP.Plugins?CAP.Plugins.LocalNotifications:null;
  const CH="nhacnho",TEST_ID=9001,MAXN=60;           // iOS chỉ cho tối đa 64 thông báo đang chờ
  const RANGE={study:1000,reward:2000,ex:3000,user:4000};
  const cfg=()=>{const n=S.nt||(S.nt={});if(n.on==null)n.on=false;if(!n.t)n.t="20:00";if(!n.g)n.g={study:1,reward:1,ex:1,user:1};return n};
  const nextAt=(h,m)=>{const d=new Date();d.setHours(h,m,0,0);if(d.getTime()<=Date.now()+60000)d.setDate(d.getDate()+1);return d};

  const quiet=d=>{const x=new Date(d);if(x.getHours()<8)x.setHours(8,0,0,0);else if(x.getHours()>=22){x.setDate(x.getDate()+1);x.setHours(8,0,0,0)}return x};   // không báo ban đêm (22h-8h)
  const fmtHM=mi=>{const h=Math.floor(mi/60),r=mi%60,p=[];if(h)p.push(h+" giờ");if(r||!h)p.push(r+" phút");return p.join(" ")};
  const full=()=>!(S.ui&&S.ui.studyOnly);                                                   // chế độ Chỉ học ẩn các tab thưởng
  const APP="Tu Tiên Học Đạo";
  const GEN=["Đến giờ tu luyện rồi! Làm một nhiệm vụ nhỏ để tích linh lực.","Linh lực đang chờ bạn. Chỉ cần 25 phút thôi!","Đạo tâm cần được rèn mỗi ngày. Vào học một chút nhé.","Đừng để lâu quá, Thiên Kiêu Bảng đang chạy đua đó!"];
  const hm=()=>{const x=/^(\d\d):(\d\d)$/.exec(cfg().t||"20:00");return x?[+x[1],+x[2]]:[20,0]};
  const dayAt=(d,h,mi)=>{const x=new Date();x.setDate(x.getDate()+d);x.setHours(h,mi,0,0);return x};
  const fut=t=>t.getTime()>Date.now()+60000;
  // Các nhóm thông báo. study = Phần 3, reward và ex = Phần 4 (đều xong); user = Phần 5
  const BLD={
    study:()=>{
      const out=[],now=Date.now(),[h,mi]=hm(),st=S.streak||{last:"",n:0},n=st.n||0,done=st.last===today();
      const atRisk=n>=2&&st.last===dayStr(1);                 // hôm qua có học, hôm nay chưa: chuỗi sẽ đứt lúc nửa đêm
      // 0-3: nhắc học hằng ngày (hôm nay nếu chưa học, cộng 3 ngày tới)
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
      // 10-11: chuỗi sắp đứt (21:30, hoặc 23:00 nếu đã quá 21:30)
      if(n>=2){
        let k=-1,at=null;
        if(st.last===dayStr(1)){k=0;at=dayAt(0,21,30);if(!fut(at))at=dayAt(0,23,0)}
        else if(done){k=1;at=dayAt(1,21,30)}
        if(at&&fut(at)){
          const dd=dayAt(k,h,mi);
          if(!(fut(dd)&&Math.abs(dd-at)<45*60000))           // trùng giờ nhắc hằng ngày thì bỏ
            out.push({id:10+k,title:"Chuỗi sắp đứt!",body:"Chuỗi "+n+" ngày sắp đứt. Học trước nửa đêm để tránh tâm ma.",at});
        }
      }
      // 100-129: nhiệm vụ nhanh sắp hết hạn
      (S.quests||[]).filter(q=>q.due&&q.due>now+60000&&!isDone(q)).sort((a,b)=>a.due-b.due).slice(0,30).forEach((q,i)=>{
        const dd=new Date(q.due),eod=dd.getHours()===23&&dd.getMinutes()===59;
        let at,lead;
        if(eod){at=new Date(q.due);at.setHours(21,0,0,0);lead="sẽ hết hạn lúc nửa đêm";if(!fut(at)){at=new Date(q.due-30*60000);lead="chỉ còn 30 phút"}}
        else{at=new Date(q.due-15*60000);lead="chỉ còn 15 phút"}
        if(!fut(at))return;
        out.push({id:100+i,title:"Nhiệm vụ nhanh sắp hết hạn",body:"«"+String(q.name).slice(0,40)+"» "+lead+". Học ngay để nhận thưởng nhanh!",at});
      });
      // 400-429: khung giờ trong Nhật trình (hôm nay và ngày mai)
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
      // 700: hết phiên học tập trung
      try{if(fq&&fEnd>now+3000)out.push({id:700,title:"Học xong rồi!",body:"«"+String(fq.name).slice(0,40)+"» đã đủ "+fq.mins+" phút. Vào nhận linh lực nhé!",at:new Date(fEnd)})}catch(e){}
      return out;
    },
    reward:()=>{
      const out=[],now=Date.now();
      if(!full())return out;
      // 0: Cửu Vĩ Hồ thu đầy linh lực (tối đa 8 giờ)
      let petFull=false;
      try{
        const a=S.pets&&S.pets.hl;
        if(a&&S.act==="hl"){
          const at=quiet(new Date(a.t+8*36e5)),gain=Math.floor(8*(2+a.lv+(eqT("n6")?2:0)));
          if(a.t+8*36e5>now+60000)out.push({id:0,title:"Cửu Vĩ Hồ đã đầy",body:"Cửu Vĩ Hồ đã thu đủ "+gain+" linh lực. Vào nhận nhé!",at});
          else petFull=true;
        }
      }catch(e){}
      // 10-11: sắp hết tuần/tháng mà event còn thiếu giờ (chỉ khi thiếu không quá 5 giờ)
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
      // 1: phần thưởng đang chờ (một thông báo duy nhất, vào 12:00 kế tiếp)
      try{
        const at=nextAt(12,0),isToday=at.toDateString()===new Date().toDateString(),parts=[];
        const c=S.ci;
        if(!S.dOff&&c&&c.last&&(isToday?c.last===dayStr(1):c.last===today())){
          const k=c.n%7+1,r=CI[k-1];
          parts.push("Điểm danh ngày "+k+": +"+r[0]+" linh lực"+(k===7?" (thưởng lớn)":""));
        }
        let f={};try{f=nwCompute()}catch(e){}
        const L=S.god?99:Math.max(ri(uxp()),S.pk||0),names=[];
        f.y=nwHas('#lenh button[data-a="lc"]:not([disabled]),#lenh button[data-a="kc"]:not([disabled])');   // Lệnh bài: bỏ nút Điểm danh (đã xử lý riêng ở trên) và kỳ ngộ chưa xem
        activeGR().forEach(g=>g.s.forEach(x=>{if(["j","e","y","x"].includes(x[0])&&f[x[0]]&&(x[2]||0)<=L)names.push(x[1])}));
        if(names.length)parts.push("Chưa nhận thưởng ở: "+names.join(", "));
        if(petFull)parts.push("Cửu Vĩ Hồ đã đầy");
        if(parts.length)out.push({id:1,title:"Phần thưởng đang chờ",body:parts.join(" · "),at});
      }catch(e){}
      return out;
    },
    ex:()=>{
      const out=[],now=Date.now();
      // 0-1: thiên kiếp kế tiếp (báo trước 24 giờ, hoặc 3 giờ nếu đã quá; và đúng giờ giáng)
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
      // 100-102: kỳ ngộ bất ngờ trong 2 ngày tới (tối đa 1 thông báo mỗi ngày, chỉ báo ban ngày)
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
    user:()=>[]
  };
  function build(){
    const c=cfg(),out=[];
    Object.keys(BLD).forEach(g=>{
      if(!c.g[g])return;
      let arr=[];try{arr=BLD[g]()||[]}catch(e){console.warn("NT build "+g,e)}
      arr.forEach(n=>{if(n.at&&+n.at>Date.now()+5000)out.push({id:RANGE[g]+(n.id|0),title:n.title,body:n.body,at:n.at})});
    });
    out.sort((a,b)=>a.at-b.at);
    return out.slice(0,MAXN);
  }

  async function perm(ask){
    if(!LN)return "web";
    try{let p=await LN.checkPermissions();if(p.display!=="granted"&&ask)p=await LN.requestPermissions();return p.display}
    catch(e){return "error"}
  }
  async function channel(){
    if(!LN)return;
    try{await LN.createChannel({id:CH,name:"Nhắc nhở học tập",description:"Nhắc học, nhận thưởng, thiên kiếp",importance:4,visibility:1,vibration:true})}catch(e){}
  }
  async function cancelOurs(){
    try{
      const p=await LN.getPending();
      const ids=(p.notifications||[]).map(n=>n.id).filter(id=>id>=1000&&id<5000);
      if(ids.length)await LN.cancel({notifications:ids.map(id=>({id}))});
    }catch(e){}
  }

  // Hủy thông báo cũ rồi hẹn lại; bỏ qua nếu danh sách không đổi
  let busy=false,again=false,sig=null,tm=0;
  async function run(force){
    if(!LN)return;
    if(busy){again=true;return}
    busy=true;
    try{
      const c=cfg();
      if(!c.on){if(sig!=="off"){await cancelOurs();sig="off"}return}
      if((await perm(false))!=="granted"){sig=null;return}
      const list=build(),s=JSON.stringify(list.map(n=>[n.id,n.title,n.body,+n.at]));
      if(!force&&s===sig)return;
      await cancelOurs();
      if(list.length)await LN.schedule({notifications:list.map(n=>({id:n.id,title:n.title,body:n.body,channelId:CH,schedule:{at:n.at,allowWhileIdle:true}}))});
      sig=s;
    }catch(e){console.warn("NT run",e);sig=null}
    finally{busy=false;if(again){again=false;run(false)}}
  }
  // save() gọi hàm này; chờ 5 giây cho đỡ gọi dồn
  window.NTsave=()=>{if(!LN)return;clearTimeout(tm);tm=setTimeout(()=>run(false),5000)};

  // ----- Giao diện trong Thiên Thư > Thống kê -----
  const box=document.createElement("div");box.style.display="contents";box.id="ntbox";
  async function paint(){
    const c=cfg();let st;
    if(!native)st="Chỉ hoạt động trong app cài trên điện thoại (bản APK), không chạy trên trình duyệt.";
    else{
      const p=await perm(false);
      st=p==="granted"?"Đã được cấp quyền thông báo.":p==="denied"?"Quyền thông báo đang bị tắt. Vào Cài đặt điện thoại, mở mục Ứng dụng, chọn game rồi bật Thông báo.":"Chưa cấp quyền thông báo.";
    }
    box.innerHTML=`<details class="fold" data-k="nt"${FO.nt?" open":""}><summary>Thông báo nhắc nhở</summary><small>${st}</small>
<div class="chips" style="margin-top:8px"><button class="btn alt${c.on?" on":""}" data-nt="tg">${c.on?"Đang bật · bấm để tắt":"Bật thông báo"}</button><button class="btn alt" data-nt="test">Thử thông báo (5 giây)</button></div>
<div class="row"><label>Giờ nhắc học <input type="time" id="ntt" value="${c.t}"></label></div></details>`;
  }
  box.onclick=async e=>{
    const b=e.target.closest("button[data-nt]");if(!b)return;
    const a=b.dataset.nt,c=cfg();
    if(!native){say("Chỉ dùng được trong app cài trên điện thoại.");return}
    if(a==="tg"){
      if(!c.on){
        const p=await perm(true);
        if(p!=="granted"){say("Chưa được cấp quyền thông báo. Hãy bật quyền trong cài đặt điện thoại.");paint();return}
        await channel();c.on=true;save();say("Đã bật thông báo.");run(true);
      }else{c.on=false;save();run(true);say("Đã tắt thông báo.")}
      paint();
    }else if(a==="test"){
      const p=await perm(true);
      if(p!=="granted"){say("Chưa được cấp quyền thông báo. Hãy bật quyền trong cài đặt điện thoại.");paint();return}
      await channel();
      try{
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
    channel();
    setTimeout(()=>run(true),3000);                       // lúc mở app
    document.addEventListener("visibilitychange",()=>{if(document.hidden)run(false);else paint()}); // lúc thoát app
    setInterval(()=>run(false),600000);                   // mỗi 10 phút khi đang mở
    let lf="";                                            // phiên học bắt đầu/hủy không gọi save(), nên theo dõi riêng
    setInterval(()=>{let k="";try{k=fq?fq.id+":"+fEnd:""}catch(e){}if(k!==lf){lf=k;window.NTsave()}},2000);
  }
  window.NT={BLD,build,nextAt,run,RANGE,cfg};
})();
