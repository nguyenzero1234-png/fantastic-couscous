/* Hệ thống tông môn: cấu hình, điều kiện/buff, chiến tông môn và nhiệm vụ tuần. */
/* Hệ thống tông môn và sư phụ: dữ liệu cấu hình + điều kiện/buff bái sư. */
(function(root){
  "use strict";
  const SECTS=[
    {n:"Thiên Kiếm Tông",d:"Lấy kiếm lập đạo, ưa tốc chiến",lore:"Tông môn cổ kính dựng trên đỉnh Vân Kiếm Sơn. Mỗi đệ tử khi nhập môn đều được trao một thanh linh kiếm, lấy kiếm ý làm đạo tâm. Chủ trương «một kiếm phá vạn pháp», thích quyết thắng nhanh gọn. Tàng kiếm các của tông lưu giữ hơn ba ngàn kiếm phổ từ các đời tổ sư."},
    {n:"Huyền Đan Môn",d:"Đan đạo thâm sâu, bền bỉ đường dài",lore:"Nằm giữa thung lũng Đan Hà, khói lò luyện đan chưa từng tắt suốt ngàn năm. Đệ tử Huyền Đan Môn tin rằng đan dược là cầu nối giữa phàm và tiên. Họ kiên nhẫn, tỉ mỉ, coi thất bại trăm lần chỉ là một bước trên đường cầu đạo. Đan phương thượng cổ được giữ bí truyền trong thất đại trưởng lão."},
    {n:"Vạn Pháp Các",d:"Thu thập trăm pháp, giỏi biến hóa",lore:"Một tòa các chín tầng lơ lửng trên hồ Linh Tâm. Bên trong chứa hàng vạn pháp quyết, trận đồ, phù lục thu thập từ khắp Cửu Châu. Đệ tử Vạn Pháp Các không chuyên một môn, mà học đủ trăm nhà rồi dung hợp thành đạo riêng. Người ngoài thường nói: «Vạn Pháp xuất thủ, không ai đoán được chiêu kế tiếp»."},
    {n:"Thái Hư Điện",d:"Cổ tông ẩn thế, nền tảng vững chắc",lore:"Tồn tại từ thời Thái Cổ, ẩn mình trong lớp không gian nứt vỡ của Thái Hư. Ít khi xuất thế, nhưng mỗi lần xuất hiện đều làm chấn động Thiên Kiêu Bảng. Đệ tử Thái Hư Điện tu luyện chậm rãi, xây nền móng vững như núi, tin rằng chỉ có gốc rễ sâu mới chống được thiên kiếp cuối cùng."},
    {n:"Cửu U Cốc",d:"Hành sự quỷ dị, thích bất ngờ",lore:"Nằm sâu trong Cửu U U Minh, nơi ánh sáng mặt trời không bao giờ chạm tới. Đệ tử Cửu U Cốc tu luyện pháp môn âm hàn, thích hành động trong bóng tối và bất ngờ. Nhiều người e sợ, nhưng trong lịch sử Cửu Châu, không ít lần chính họ đã ngăn được đại họa mà các chính đạo không dám đối mặt."},
    {n:"Bách Thảo Đường",d:"Y đạo nhân từ, đồng tâm hiệp lực",lore:"Dựng giữa cánh đồng dược thảo bạt ngàn, Bách Thảo Đường lấy «cứu người» làm tông chỉ. Đệ tử không chỉ giỏi y đạo mà còn hợp lực thành trận, lấy nhu thắng cương. Trong tông môn chiến, họ ít khi dẫn đầu về sát thương, nhưng luôn là chỗ dựa vững chắc khi đồng đạo gặp nạn."}
  ];
  function create({state,realmIndex,lifeStats,examResults}){
    const S=state;
    const MASTERS=[
      {n:"Kiếm Tôn Bạch Hồng",title:"Trưởng lão Thiên Kiếm",req:"Trúc Cơ trở lên và tổng ≥8 nhiệm vụ",ok:()=>realmIndex()>=1&&(lifeStats().q||0)>=8,okTxt:()=>realmIndex()>=1&&(lifeStats().q||0)>=8?"Đã đủ điều kiện":"Cần Trúc Cơ + ≥8 nhiệm vụ",buff:"+8 linh lực cố định mỗi nhiệm vụ từ 45 phút",apply:()=>({fl:8})},
      {n:"Đan Thánh Huyền Cơ",title:"Thái thượng trưởng lão Huyền Đan",req:"Dùng ≥3 vật phẩm và chuỗi ≥3 ngày",ok:()=>(lifeStats().it||0)>=3&&(S.streak.n||0)>=3,okTxt:()=>(lifeStats().it||0)>=3&&(S.streak.n||0)>=3?"Đã đủ điều kiện đan đạo":"Cần dùng ≥3 vật phẩm + chuỗi 3 ngày",buff:"Mỗi lần dùng vật phẩm +10 linh lực",apply:()=>({itemBonus:10})},
      {n:"Pháp Tôn Vạn Tượng",title:"Các chủ Vạn Pháp",req:"Hoàn thành ≥15 nhiệm vụ",ok:()=>(lifeStats().q||0)>=15,okTxt:()=>(lifeStats().q||0)>=15?"Đã đủ kinh nghiệm":"Cần ≥15 nhiệm vụ",buff:"+5% linh lực mọi nhiệm vụ",apply:()=>({mult:1.05})},
      {n:"Thái Hư Lão Tổ",title:"Điện chủ Thái Hư",req:"Chuỗi ≥7 ngày và không tâm ma",ok:()=>(S.streak.n||0)>=7&&!S.tm,okTxt:()=>(S.streak.n||0)>=7&&!S.tm?"Đạo tâm đủ tĩnh":"Cần chuỗi ≥7 ngày, không tâm ma",buff:"Giảm 15% chi phí đổi nhàn hạ",apply:()=>({dc:15})},
      {n:"U Minh Quỷ Tôn",title:"Cốc chủ Cửu U",req:"≥5 nhiệm vụ đêm (22h–5h)",ok:()=>(lifeStats().ni||0)>=5,okTxt:()=>(lifeStats().ni||0)>=5?"Đã quen bóng tối":"Cần ≥5 nhiệm vụ đêm",buff:"Nhiệm vụ đêm +12 linh lực cố định",apply:()=>({fn:12})},
      {n:"Dược Vương Thanh Liên",title:"Đường chủ Bách Thảo",req:"1 thiên kiếp từ Khá trở lên",ok:()=>examResults().some(r=>{const me=r.rows.find(z=>z.u);return me&&["Xuất sắc","Giỏi","Khá"].includes(me.g)}),okTxt:()=>examResults().some(r=>{const me=r.rows.find(z=>z.u);return me&&["Xuất sắc","Giỏi","Khá"].includes(me.g)})?"Đã đủ":"Cần 1 thiên kiếp từ Khá trở lên",buff:"Khi có tâm ma, mỗi nhiệm vụ +8 linh lực",apply:()=>({ft:8})}
    ];
    function masterBuff(){
      if(S.master==null||S.sect==null||S.master!==S.sect)return {};
      return MASTERS[S.sect].apply()||{};
    }
    return {sects:SECTS,masters:MASTERS,masterBuff};
  }
  root.GameSectSystem={create};
})(typeof window!=="undefined"?window:globalThis);


(function(root) {
  "use strict";

  const FLAVORS = [
    ["Kiếm khí xung thiên", "Hai tông đọ kiếm đạo, tốc chiến quyết thắng thua."],
    ["Đan lửa đối đầu", "Lò đan đỏ rực, bên nào bền bỉ hơn sẽ thắng."],
    ["Vạn pháp hỗn chiến", "Pháp thuật đầy trời, biến hóa vô cùng."],
    ["Thái Hư ẩn thế", "Cổ tông xuất thế, nền tảng quyết định tất cả."],
    ["Cửu U quỷ ảnh", "Bóng tối len lỏi, bất ngờ quyết định cục diện."],
    ["Bách Thảo đồng tâm", "Y đạo hợp lực, lấy nhu thắng cương."]
  ];

  const pairs = week => {
    const rotation = ((week % 5) + 5) % 5;
    const order = [0, 1, 2, 3, 4].map(k => 1 + (k + rotation) % 5);
    return [[0, order[0]], [order[1], order[4]], [order[2], order[3]]];
  };

  const flavor = (a, b) => FLAVORS[(a * 7 + b * 13) % FLAVORS.length];

  const score = (sectCount, npcRows, userSect, userGain, npcCounts) => {
    const totals = Array.from({ length: sectCount }, () => 0);
    (npcRows || []).forEach(row => {
      if (row && Number.isInteger(row.sect) && totals[row.sect] != null)
        totals[row.sect] += Math.max(0, Number(row.gain) || 0);
    });
    if (userSect != null && totals[userSect] != null)
      totals[userSect] += Math.max(0, Number(userGain) || 0);
    return totals.map((value, sect) => {
      const count = Math.max(0, Number((npcCounts || [])[sect]) || 0) + (userSect === sect ? 1 : 0);
      return count > 0 ? value / count : 0;
    });
  };

  const reward = deps => {
    const S = deps.state;
    if (S.sect == null) return "";
    const start = new Date(S.lb.week + "T00:00:00").getTime();
    const end = start + 7 * 864e5;
    const week = Math.round((start - deps.weekEnd) / 6048e5);
    const scores = deps.scoreWeek(start, end, S.lb.week, new Date(end).toLocaleDateString("sv"));
    const pair = pairs(week).find(item => item.includes(S.sect));
    if (!pair) return "";
    const opponent = pair[0] === S.sect ? pair[1] : pair[0];
    const own = scores[S.sect], other = scores[opponent], diff = own - other;
    const flavorText = flavor(S.sect, opponent);
    if (diff > 0) {
      const base = deps.modGain(150 + Math.min(150, Math.round(diff * 0.35)) + (deps.hasTitle() ? 100 : 0));
      const bonus = diff > 80 && deps.random() < 0.35;
      S.points += base;
      deps.addHistory(deps.today(), base, 0);
      S.lb.sw = (S.lb.sw || 0) + 1;
      let message = " Tông môn chiến: " + deps.sects[S.sect].n + " đại thắng " + deps.sects[opponent].n + " (+" + base + " linh lực)";
      if (bonus) {
        S.inv.ca = (S.inv.ca || 0) + 1;
        message += " · nhận thêm 1 Tỉnh Thần Linh Trà nhờ công trạng lớn.";
      }
      deps.log("Tông môn chiến: " + deps.sects[S.sect].n + " thắng " + deps.sects[opponent].n + " (" + flavorText[0] + "), +" + base + " linh lực" + (bonus ? " +Tỉnh Thần Linh Trà" : ""));
      return message + ".";
    }
    const consolation = deps.modGain(Math.min(40, Math.round(Math.abs(diff) * 0.08) + 15));
    S.points += consolation;
    deps.addHistory(deps.today(), consolation, 0);
    deps.log("Tông môn chiến: " + deps.sects[S.sect].n + " thua " + deps.sects[opponent].n + " (" + flavorText[0] + "), nhận " + consolation + " linh lực an ủi");
    return " Tông môn chiến: " + deps.sects[S.sect].n + " thua " + deps.sects[opponent].n + ". Thiên Đạo ban " + consolation + " linh lực an ủi — thất bại cũng là tu luyện.";
  };

  const stats = (sectCount, npcRows, userSect, userXp) => {
    const result = Array.from({ length: sectCount }, () => ({ xp: 0, n: 0 }));
    (npcRows || []).forEach(row => {
      if (!row || !Number.isInteger(row.sect) || !result[row.sect]) return;
      result[row.sect].xp += row.xp;
      result[row.sect].n++;
    });
    if (userSect != null && result[userSect]) {
      result[userSect].xp += userXp;
      result[userSect].n++;
    }
    return result;
  };

  root.GameSectWar = Object.freeze({ pairs, flavor, stats, score, reward });
})(typeof window !== "undefined" ? window : globalThis);


(function(root){
 function list(S,d){
  if(S.sect==null)return [];
  const ws=d.weekStart(),key="sm:"+ws+":"+S.sect;
  if(!S.sm||S.sm.key!==key){
    const pool=[
      {id:"q5",n:"Ngũ Nhiệm Đồng Tâm",d:"Hoàn thành 5 nhiệm vụ trong tuần",need:5,met:()=>{let n=0;for(const k in S.cnt||{})if(k>=ws)n+=S.cnt[k];return n},r:60},
      {id:"m120",n:"Bách Nhị Khổ Luyện",d:"Học đủ 120 phút trong tuần",need:120,met:()=>Math.floor(d.sumMins(k=>k>=ws)/1),r:80},
      {id:"st3",n:"Tam Nhật Bất Nghỉ",d:"Chuỗi ngày học ≥3",need:3,met:()=>S.streak.n||0,r:50},
      {id:"lg2",n:"Trường Công Hai Phiên",d:"2 nhiệm vụ từ 45 phút trong tuần",need:2,met:()=>(S.stl||[]).filter(x=>{const day=new d.Date(x[0]).toLocaleDateString("sv");return day>=ws&&x[1]>=45}).length,r:70}
    ];
    const pick=[pool[S.sect%pool.length],pool[(S.sect+2)%pool.length]];
    S.sm={key,ids:pick.map(x=>x.id),got:{}};
  }
  const all=[
    {id:"q5",n:"Ngũ Nhiệm Đồng Tâm",d:"Hoàn thành 5 nhiệm vụ trong tuần",need:5,met:()=>{let n=0;for(const k in S.cnt||{})if(k>=ws)n+=S.cnt[k];return n},r:60},
    {id:"m120",n:"Bách Nhị Khổ Luyện",d:"Học đủ 120 phút trong tuần",need:120,met:()=>Math.floor(d.sumMins(k=>k>=ws)),r:80},
    {id:"st3",n:"Tam Nhật Bất Nghỉ",d:"Chuỗi ngày học ≥3",need:3,met:()=>S.streak.n||0,r:50},
    {id:"lg2",n:"Trường Công Hai Phiên",d:"2 nhiệm vụ từ 45 phút trong tuần",need:2,met:()=>(S.stl||[]).filter(x=>{const day=new d.Date(x[0]).toLocaleDateString("sv");return day>=ws&&x[1]>=45}).length,r:70}
  ];
  return all.filter(x=>(S.sm.ids||[]).includes(x.id));
 }
 function claim(S,id,d){
  const m=list(S,d).find(x=>x.id===id);if(!m||S.sm.got[id])return;
  if(m.met()<m.need){d.say("Chưa đủ tiến độ nhiệm vụ tông.");return}
  S.sm.got[id]=1;const rr=d.addPts(m.r);d.vlog("Nhiệm vụ tông: "+m.n+" +"+rr);d.save();d.render();d.say("Hoàn thành 「"+m.n+"」: +"+rr+" linh lực.");
 }
 root.GameSectMissions={list,claim};
})(typeof window!=="undefined"?window:globalThis);
