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
