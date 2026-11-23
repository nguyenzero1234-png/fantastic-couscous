/* ===== Lịch tuần (thay thế tab Nhật trình theo ngày) =====
   Nạp SAU game.js và notify.js. File này tự ghi đè renderLich, importSched, các nút của tab Nhật trình
   và phần thông báo theo lịch, nên game.js / notify.js không cần sửa.

   Dữ liệu (lưu cùng S trong localStorage):
   - S.sched[ngày]  : việc một lần  {id,s,e,qid,label}                (như cũ)
   - S.rep          : việc lặp hàng tuần {id,d:[0..6 (0=T2..6=CN)],s,e,label}
   - S.rskip[ngày]  : danh sách id việc lặp được bỏ riêng ngày đó */
(function(){
  "use strict";
  let LDK=null,LWO=0;                       // ngày đang xem, độ lệch tuần (0 = tuần này)
  const WD=["T2","T3","T4","T5","T6","T7","CN"];
  const wdOf=k=>(new Date(k+"T12:00:00").getDay()+6)%7;
  const weekKeys=()=>{
    const d=new Date(weekStart()+"T12:00:00");d.setDate(d.getDate()+7*LWO);
    return Array.from({length:7},(_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return x.toLocaleDateString("sv")});
  };
  const dm=k=>k.slice(8)+"/"+k.slice(5,7);

  // Lịch của một ngày = việc một lần + việc lặp trùng thứ (trừ việc đã bỏ riêng ngày đó)
  function slotsOf(k){
    const skip=(S.rskip&&S.rskip[k])||[];
    const rep=(S.rep||[]).filter(r=>r.d.includes(wdOf(k))&&!skip.includes(r.id))
      .map(r=>({id:r.id,s:r.s,e:r.e,qid:"",label:r.label,rep:1}));
    return (S.sched[k]||[]).concat(rep).sort((a,b)=>a.s<b.s?-1:1);
  }
  // Việc lặp tự gắn với nhiệm vụ đang mở có cùng tên
  const qOf=x=>sq(x)||(x.rep?S.quests.find(q=>q.name===x.label&&!isDone(q)&&!expired(q)&&(!q.chain||unlocked(q))):null);
  const clash=(k,a,b)=>slotsOf(k).find(x=>a<tm(x.e)&&b>tm(x.s));

  function syncDc(){
    const k=LDK||today();
    document.querySelectorAll("#ldc input").forEach(x=>x.checked=+x.dataset.dc===wdOf(k));
  }

  function renderLich(){
    const T=today(),now=nowHM(),wk=weekKeys();
    if(!LDK||!wk.includes(LDK))LDK=wk.includes(T)?T:wk[0];
    const day=slotsOf(LDK),tod=slotsOf(T),isT=LDK===T;
    $("lwt").textContent=dm(wk[0])+" – "+dm(wk[6]);
    $("lwk").innerHTML=wk.map((k,i)=>`<button class="d7${k===LDK?" on":""}" data-ld="${k}">${WD[i]}<b>${k.slice(8)}</b><span>${slotsOf(k).length||""}</span></button>`).join("");
    const v=$("lq").value;
    $("lq").innerHTML="<option value=\"\">Chọn nhiệm vụ (tùy chọn)</option>"+S.quests.filter(q=>!isDone(q)&&!expired(q)&&(!q.chain||unlocked(q))).map(q=>`<option value="${q.id}">${esc(q.name)} (+${q.pts})</option>`).join("");
    $("lq").value=v;
    const cur=tod.find(x=>now>=x.s&&now<x.e),nxt=tod.find(x=>x.s>now);
    let h=`<span class="lbl">Bây giờ, ${now}</span>`;
    if(cur){
      const q=qOf(cur),d=q&&isDone(q);
      h+=`<h2 style="font-size:20px;margin:4px 0">${esc(rn(cur))}</h2><small>${cur.s} - ${cur.e}, còn ${tm(cur.e)-tm(now)} phút${d?", đã hoàn thành":""}</small>`;
      if(q&&!d&&!expired(q))h+=`<div class="row"><button class="btn" data-a="t" data-id="${q.id}">Hoàn thành</button>${q.mins?`<button class="btn alt" data-a="p" data-id="${q.id}" style="margin-left:0">Học</button>`:""}</div>`;
    }else h+=`<h2 style="font-size:20px;margin:4px 0">Không có việc trong khung giờ này</h2><small>${nxt?"Kế tiếp "+nxt.s+": "+esc(rn(nxt)):"Hôm nay chưa có lịch phía sau"}</small>`;
    $("now").innerHTML=h;
    $("nowbar").hidden=!cur;if(cur)$("nowbar").textContent="Bây giờ ("+cur.s+" - "+cur.e+"): "+rn(cur);
    $("slots").innerHTML=day.length?day.map(x=>{
      const q=qOf(x),d=q&&isDone(q);
      return `<li class="${isT?(now>=x.e?"past":now>=x.s?"now":""):""}${d?" done":""}">${q&&!d&&!expired(q)&&isT?`<button class="tick" data-a="t" data-id="${q.id}" aria-label="Hoàn thành"></button>`:d?`<button class="tick" disabled>✓</button>`:""}<div class="nm">${esc(rn(x))}<small>${x.s} - ${x.e}${x.rep?" · lặp hàng tuần":""}</small></div><button class="del" data-a="ld" data-id="${x.id}" aria-label="Xóa khỏi lịch">×</button></li>`;
    }).join(""):`<li class="empty" style="display:block">Chưa có lịch ${WD[wdOf(LDK)]} ${dm(LDK)}. Thêm khung giờ bên dưới.</li>`;
    $("lrep").innerHTML=(S.rep||[]).length?S.rep.slice().sort((a,b)=>a.s<b.s?-1:1).map(r=>`<li><div class="nm">${esc(r.label)}<small>${r.d.map(i=>WD[i]).join(", ")} · ${r.s} - ${r.e}</small></div><button class="del" data-a="rd" data-id="${r.id}" aria-label="Xóa việc lặp">×</button></li>`).join("")
      :`<li class="empty" style="display:block">Chưa có việc lặp. Tick «Lặp lại hàng tuần» khi thêm khung giờ.</li>`;
  }

  // Thêm khung giờ: một lần (vào các ngày đã chọn của tuần đang xem) hoặc lặp hàng tuần
  function addSlot(){
    const s=$("ls").value,e=$("le").value,q=S.quests.find(x=>x.id===$("lq").value),label=q?q.name:$("ll").value.trim();
    if(!s||!e||s>=e||!label){say("Chọn giờ bắt đầu trước giờ kết thúc, và một nhiệm vụ hoặc tên việc.");return}
    const ds=[...document.querySelectorAll("#ldc input:checked")].map(x=>+x.dataset.dc).sort(),wk=weekKeys(),rep=$("lrep0").checked;
    if(!ds.length){say("Chọn ít nhất một ngày trong tuần.");return}
    for(const i of ds){
      const ov=clash(wk[i],tm(s),tm(e));
      if(ov){say("Trùng khung "+ov.s+" - "+ov.e+" ("+rn(ov)+") vào "+WD[i]+".");return}
    }
    const id="s"+Date.now().toString(36);
    if(rep)(S.rep=S.rep||[]).push({id,d:ds,s,e,label});
    else ds.forEach((i,n)=>{(S.sched[wk[i]]=S.sched[wk[i]]||[]).push({id:id+n,s,e,qid:q?q.id:"",label})});
    $("ll").value="";save();render();say(rep?"Đã thêm việc lặp hàng tuần.":"Đã thêm vào lịch.");
  }

  function autoSlots(){
    const k=LDK||today();
    const cand=S.quests.filter(q=>!isDone(q)&&!expired(q)&&q.mins&&(!q.chain||unlocked(q))).sort((a,b)=>(a.due||9e15)-(b.due||9e15));
    const day=S.sched[k]||(S.sched[k]=[]),have=new Set(slotsOf(k).map(x=>x.qid));
    let t=k===today()?Math.ceil(tm(nowHM())/15)*15:480,n=0;
    for(const q of cand){
      if(have.has(q.id))continue;
      const len=Math.min(q.mins,120);
      for(let i=0;i<50;i++){const bad=slotsOf(k).find(x=>t<tm(x.e)&&t+len>tm(x.s));if(!bad)break;t=tm(bad.e)}
      if(t+len>1320)break;
      day.push({id:"s"+Date.now().toString(36)+n++,s:hm(t),e:hm(t+len),qid:q.id,label:q.name});t+=len+10;
    }
    save();render();say(n?"Đã xếp "+n+" nhiệm vụ vào lịch.":"Không còn khung giờ hoặc nhiệm vụ để xếp.");
  }

  // Mỗi dòng: HH:MM-HH:MM | Tên việc [| T2,T4,CN]  (có cột thứ thì thành việc lặp hàng tuần)
  function importSched(){
    const k=LDK||today(),wk=weekKeys(),day=S.sched[k]||(S.sched[k]=[]);let n=0,bad=0;
    ($("lbulk").value||"").split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith("#")).forEach(l=>{
      const m=l.match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*\|\s*([^|]+?)\s*(?:\|\s*(.+))?$/);if(!m){bad++;return}
      const a=+m[1]*60+ +m[2],b=+m[3]*60+ +m[4],lb=m[5].trim().slice(0,50);
      if(a>=b||b>1440){bad++;return}
      const ds=[...(m[6]||"").matchAll(/T([2-7])|CN/gi)].map(z=>/cn/i.test(z[0])?6:+z[1]-2);
      const id="s"+Date.now().toString(36)+n;
      if(ds.length){
        if(ds.some(i=>clash(wk[i],a,b))){bad++;return}
        (S.rep=S.rep||[]).push({id,d:[...new Set(ds)].sort(),s:hm(a),e:hm(b),label:lb});n++;return;
      }
      if(clash(k,a,b)){bad++;return}
      const q=S.quests.find(x=>x.name===lb&&!isDone(x)&&!expired(x)&&(!x.chain||unlocked(x)));
      day.push({id,s:hm(a),e:hm(b),qid:q?q.id:"",label:lb});n++;
    });
    if(n){$("lbulk").value="";save();render()}
    say(n?("Đã nhập "+n+" khung"+(bad?", bỏ "+bad+" dòng lỗi/trùng giờ":"")+"."):"Không đọc được dòng nào. Mẫu: 19:00-19:45 | Tên việc | T2,T4");
  }

  // Xóa khung giờ / việc lặp; mọi nút khác vẫn dùng bộ xử lý cũ của game.js
  const old=$("slots").onclick;
  const onClick=e=>{
    const b=e.target.closest("button");
    if(b&&b.dataset.a==="rd"){S.rep=(S.rep||[]).filter(x=>x.id!==b.dataset.id);save();render();say("Đã xóa việc lặp hàng tuần.");return}
    if(b&&b.dataset.a==="ld"){
      const id=b.dataset.id,k=LDK||today(),r=(S.rep||[]).find(x=>x.id===id);
      if(r){
        if(confirm("Đây là việc lặp hàng tuần.\nOK = xóa mọi tuần\nHủy = chỉ bỏ ngày này"))S.rep=S.rep.filter(x=>x.id!==id);
        else{S.rskip=S.rskip||{};S.rskip[k]=(S.rskip[k]||[]).concat(id)}
      }else S.sched[k]=(S.sched[k]||[]).filter(x=>x.id!==id);
      save();render();return;
    }
    if(old)old(e);
  };
  $("slots").onclick=$("now").onclick=$("lrep").onclick=onClick;
  $("ladd").onclick=addSlot;
  $("lauto").onclick=autoSlots;
  $("lin").onclick=importSched;
  $("lwk").onclick=e=>{const b=e.target.closest("[data-ld]");if(!b)return;LDK=b.dataset.ld;syncDc();renderLich()};
  $("lwp").onclick=()=>{LWO--;LDK=null;renderLich();syncDc()};
  $("lwn").onclick=()=>{LWO++;LDK=null;renderLich();syncDc()};

  // Ghi đè các hàm của game.js (renderMore gọi renderLich theo tên toàn cục)
  window.renderLich=renderLich;
  window.importSched=importSched;
  window.slotsOf=slotsOf;

  // Dọn dữ liệu bỏ-riêng-ngày quá 30 ngày
  {const cut=new Date(Date.now()-30*864e5).toLocaleDateString("sv");Object.keys(S.rskip||{}).forEach(k=>{if(k<cut)delete S.rskip[k]})}

  // Thông báo: thay phần "khung giờ trong lịch" (id 400-429) bằng lịch tuần, hẹn trước 3 ngày, gồm cả việc lặp (id 400-439)
  if(window.NT&&NT.BLD&&NT.BLD.study){
    const prev=NT.BLD.study,fut=t=>t.getTime()>Date.now()+60000;
    NT.BLD.study=()=>{
      const out=prev().filter(n=>!(n.id>=400&&n.id<440));
      if(!S.dOff){
        let k=0;
        [0,1,2].forEach(d=>{
          const key=dayStr(-d);
          slotsOf(key).forEach(sl=>{
            if(k>=40||!/^\d\d:\d\d$/.test(sl.s||""))return;
            const q=qOf(sl);
            if(q&&sl.qid&&isDone(q))return;
            const at=new Date(key+"T"+sl.s+":00");if(!fut(at))return;
            out.push({id:400+k++,title:"Đến giờ học theo lịch",body:sl.s+"-"+(sl.e||"")+": "+String(sl.label||(q&&q.name)||"Việc đã hẹn").slice(0,50),at});
          });
        });
      }
      return out;
    };
  }

  syncDc();
  render();
})();
