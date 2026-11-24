/* Derived chronicle. Reading these records never changes rewards or save data. */
(function(root){
 "use strict";
 function chapters(state){
  const progress=root.GameProgressData;
  const realms=progress.cycleConfig(state.cycleDays).realms;
  const archive=state.rbh||[];
  const peak=Math.max(state.pk||0,...realms.map((r,i)=>Math.max(state.points||0,state.kst?.pk||0)>=r[1]?i:0));
  const reached=index=>peak>=index||archive.some(r=>r.pk>=progress.cycleConfig(r.cycleDays).realms[index][1]);
  const passed=Object.values(state.sem?.res||{}).some(r=>r.rows?.some(p=>p.u&&p.ok&&p.g!=="Yếu"));
  const joined=state.sect!=null||archive.some(r=>r.sect)||(state.storyLog||[]).some(r=>r.id?.startsWith("sect:"));
  const topTen=state.life?.top10||archive.some(r=>r.rank>0&&r.rank<=10);
  return [
   {title:"I · Trang mệnh thư trắng",condition:"Khởi đầu đạo lộ",unlocked:true,text:"Cổ khố còn lưu một trang sách không mang tên. Người giữ sách tin rằng mỗi việc đạo hữu làm sẽ để lại một nét mực."},
   {title:"II · Dấu vết linh mạch",condition:"Từng đạt Trúc Cơ",unlocked:reached(1),text:"Bên lề cổ thư có một đồ hình chín mạch. Truyền thuyết kể rằng người đọc được nó phải tự xây nền đạo hạnh trước khi tìm hiểu nguồn gốc của linh khí."},
   {title:"III · Đồng môn luận đạo",condition:"Từng gia nhập tông môn",unlocked:joined,text:"Sáu truyền thừa giữ sáu bản chú giải khác nhau về cùng một trang thiên thư. Lời giải có lẽ nằm trong những điều họ cùng gìn giữ."},
   {title:"IV · Vấn tâm dưới lôi đài",condition:"Vượt qua một thiên kiếp trong kiếp này",unlocked:passed,text:"Trong thiên thư có lời răn: thiên lôi thử sức, năm tháng thử tâm. Câu cuối bị khuyết, chỉ còn chữ Học."},
   {title:"V · Vết mực tiền kiếp",condition:"Trải qua một lần luân hồi",unlocked:(state.rb||0)>=1,text:"Có thuyết cho rằng mệnh thư không mất đi khi thân xác đổi thay. Những ký lục còn lưu là đầu mối đầu tiên để tìm hiểu danh xưng Nguyên Lưu."},
   {title:"VI · Danh khắc Thiên Bảng",condition:"Từng ghi nhận Top 10",unlocked:!!topTen,text:"Trên kim bảng, danh tự hiện lên rồi đổi chỗ theo từng kỳ khảo nghiệm. Cổ thư chép rằng danh tiếng là dấu tích của công phu, còn công phu mới là thứ theo người đi xa."},
   {title:"VII · Cửu mạch quy nguyên",condition:"Từng đạt Kim Đan và trải qua ba lần luân hồi",unlocked:reached(2)&&(state.rb||0)>=3,text:"Ba vòng luân hồi gợi lại lời cổ nhân: nguồn của đạo không nằm ở một kiếp duy nhất. Bí mật của trang trắng vẫn còn chờ người viết tiếp."}
  ];
 }
 function observations(state,today){
  return (Array.isArray(state.lb?.rankHistory)?state.lb.rankHistory:[]).filter(r=>typeof r?.day==="string"&&r.day<=today&&Array.isArray(r.order)&&new Set(r.order).size===r.order.length).slice().sort((a,b)=>a.day.localeCompare(b.day));
 }
 function rankNews(state,roster,today){
  const history=observations(state,today);
  const last=history.at(-1),previous=history.at(-2);
  if(!last||!previous||last.day===previous.day)return [];
  const name=i=>i===-1?state.name||"Đạo hữu":roster[i]?.n;
  return last.order.map((id,index)=>({id,to:index+1,from:previous.order.indexOf(id)+1})).filter(r=>r.from&&r.from!==r.to&&name(r.id)).sort((a,b)=>Math.abs(b.from-b.to)-Math.abs(a.from-a.to)).slice(0,3).map(r=>({title:`${name(r.id)} · Hạng ${r.from} → ${r.to}`,detail:`Hai mốc ghi nhận ${previous.day} và ${last.day}`}));
 }
 function realmNews(state,roster,today){
  const history=observations(state,today),last=history.at(-1),previous=history.at(-2);
  if(!last||!previous||last.day===previous.day||!Array.isArray(last.realms)||!Array.isArray(previous.realms))return [];
  const realms=root.GameProgressData.RL;
  return roster.map((npc,i)=>({npc,from:previous.realms[i],to:last.realms[i]})).filter(r=>Number.isInteger(r.from)&&Number.isInteger(r.to)&&r.to>r.from&&realms[r.from]&&realms[r.to]).sort((a,b)=>(b.to-b.from)-(a.to-a.from)).slice(0,2).map(r=>({title:`${r.npc.n} · ${realms[r.from][0]} → ${realms[r.to][0]}`,detail:`Tu vi quan sát từ ${previous.day} đến ${last.day}`}));
 }
 function news(state,roster,today){
  const ranks=rankNews(state,roster,today);
  const realm=(state.storyLog||[]).filter(r=>r.id?.startsWith("realm:")&&r.day<=today).at(-1);
  const exams=root.GameProgressData.EX;
  const exam=exams.filter(e=>state.sem?.res?.[e.id]?.rows?.some(r=>r.u)).at(-1);
  const player=exam&&state.sem.res[exam.id].rows.find(r=>r.u);
  const war=(state.vlog||[]).find(r=>typeof r.t==="string"&&r.t.startsWith("Tông môn chiến:")&&Number.isFinite(r.ts)&&(!state.kst?.start||r.ts>=state.kst.start)&&new Date(r.ts+(state.dOff||0)*864e5).toLocaleDateString("sv")<=today);
  return [...(realm?[{title:realm.title,detail:realm.day}]:[]),...(player?[{title:exam.n+" · "+(player.ok&&player.g!=="Yếu"?"Vượt kiếp":"Thất bại"),detail:"Kết quả: "+player.g}]:[]),...(war?[{title:war.t,detail:"Kết quả tông môn chiến gần nhất"}]:[]),...realmNews(state,roster,today),...ranks].slice(0,8);
 }
 function relationship(state,index,playerRank,npcRank,npcSect){
  const labels=[];
  if(state.sect!=null&&state.sect===npcSect)labels.push("Đồng môn");
  if(Math.abs(playerRank-npcRank)<=2&&playerRank!==npcRank)labels.push("Đối thủ cùng bậc");
  const count=state.npcAffinity?.[index]||0;
  if(count>=3)labels.push(count>=7?"Bạn đồng hành":"Đạo hữu quen biết");
  return labels.join(" · ")||"Tu sĩ hữu duyên";
 }
 root.GameWorldChronicle=Object.freeze({chapters,rankNews,realmNews,news,relationship});
})(typeof window!=="undefined"?window:globalThis);
