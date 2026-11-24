/* Bảo khố, kho đồ, hiệu ứng vật phẩm và trang bị danh hiệu. */
(function(root){
  "use strict";
  function use(state,id,item,deps){
    const {hasTitle,masterBuff,lifeStats,modGain,addHistory,today,say}=deps;
    const extra=hasTitle("n5")?1:0;
    const now=Date.now();
    const alreadyActive="Đang có hiệu ứng rồi.";
    const alreadyUsed="Hôm nay đã dùng rồi.";
    const addEffect=(count,value,type)=>{
      if((state.fx||[]).length>=6)return "Đang có quá nhiều hiệu ứng cố định.";
      (state.fx=state.fx||[]).push({n:count+extra,v:value,t:type||""});
    };
    const effects={
      ty:{check:()=>state.tm||state.tma?null:"Bạn không có tâm ma.",apply:()=>{state.tm=0;state.tmTasks=0;state.tma=0;state.tmaTasks=0}},
      cb:{check:()=>null,apply:()=>{state.tm=0;state.tma=0;state.tmTasks=0;state.tmaTasks=0;state.cbUntil=now+864e5}},
      ht:{check:()=>state.sh?alreadyActive:null,apply:()=>{state.sh=1}},
      sl:{check:()=>state.sl?alreadyActive:null,apply:()=>{state.sl=1}},
      tq:{check:()=>state.lt?alreadyActive:null,apply:()=>{state.lt=15}},
      ln:{check:()=>state.ln===today()?alreadyUsed:null,apply:()=>{state.ln=today()}},
      dk:{check:()=>state.kd===today()?alreadyUsed:null,apply:()=>{state.kd=today()}},
      cl:{check:()=>state.tcCharges>0?alreadyActive:null,apply:()=>{state.tcCharges=4}},
      ll:{check:()=>state.pw>0?alreadyActive:null,apply:()=>{state.pw=5+extra}},
      hy:{check:()=>state.pets&&state.pets.hl?null:"Bạn chưa có Cửu Vĩ Hồ.",apply:()=>{state.pets.hl.t-=4*36e5}}
    };
    const effect=effects[id];
    let error=effect?effect.check():null;
    if(!error&&item.q)error=addEffect(item.q[0],item.q[1],item.q[2]);
    if(error){say(error);return false}
    if(effect)effect.apply();
    state.inv[id]--;
    lifeStats().it++;
    let bonus=0;
    if(hasTitle("n17"))bonus+=15;
    if(masterBuff().itemBonus)bonus+=masterBuff().itemBonus;
    if(bonus){state.points+=modGain(bonus);addHistory(today(),modGain(bonus),0)}
    say("Đã dùng "+item.n+(bonus?" (+"+modGain(bonus)+" linh lực)":"")+".");
    return true;
  }

  function createTitles({getState,lifeStats,examResults,EX,END,markNew,save,say,schedule}){
    const cl=p=>Object.keys(getState().claimed).filter(k=>k[0]===p).length;
    const TITLES=[
     {id:"t1",n:"Phá Hiểu Tân Tinh",d:"Nhận thưởng event tuần lần đầu",b:"+3 linh lực cố định mỗi nhiệm vụ",ok:()=>cl("w")>=1},
     {id:"t2",n:"Hỏa Luyện Bất Diệt",d:"Nhận thưởng event tuần 4 lần",b:"Mỗi ngày chuỗi cộng +1 linh lực cố định mỗi nhiệm vụ (tối đa +14)",ok:()=>cl("w")>=4},
     {id:"t3",n:"Nguyệt Hạ Kiếm Tiên",d:"Nhận thưởng event tháng lần đầu",b:"Thưởng event +60 linh lực",ok:()=>cl("m")>=1},
     {id:"t4",n:"Bách Chiến Bất Khuất",d:"Nhận thưởng event tháng 3 lần",b:"Khi mang tâm ma, mỗi nhiệm vụ +12 linh lực",ok:()=>cl("m")>=3},
     {id:"t5",n:"Song Tuyệt Học Bá",d:"Nhận cả event tuần và tháng trong cùng một tháng",b:"Mỗi lần nhận thưởng event hoặc lệnh bài +20 linh lực",ok:()=>{const K=Object.keys(getState().claimed);return K.some(k=>k[0]==="m"&&K.some(j=>j[0]==="w"&&j.slice(2,9)===k.slice(2)))}},
     {id:"t6",n:"Thiên Kiếp Khôi Thủ",d:"Đạt mức Xuất sắc ở một đợt thiên kiếp và nhận thưởng",b:"Nhiệm vụ từ 60 phút +10 linh lực cố định",ok:()=>examResults().some(r=>r.rows.some(z=>z.u&&z.g==="Xuất sắc"))},
     {id:"t7",n:"Vạn Kiếp Bất Hoại",d:"Vượt mọi thiên kiếp với từ Trung bình trở lên",b:"Hoàn thành liên hoàn +120 linh lực",ok:()=>examResults().length>=EX.length&&examResults().every(r=>r.rows.some(z=>z.u&&z.s>=50))},
     {id:"n1",n:"Dạ Hành Kiếm Tiên",d:"Hoàn thành 10 nhiệm vụ trong khoảng 22 giờ đến 5 giờ sáng",b:"Nhiệm vụ làm lúc 22 giờ đến 5 giờ +10 linh lực cố định",ok:()=>lifeStats().ni>=10},
     {id:"n2",n:"Thần Hi Đạo Quân",d:"Hoàn thành 10 nhiệm vụ trước 7 giờ sáng",b:"Nhiệm vụ làm trước 9 giờ +10 linh lực cố định",ok:()=>lifeStats().da>=10},
     {id:"n3",n:"Phách Lực Vô Song",d:"Hoàn thành 15 nhiệm vụ nhanh có hạn giờ",b:"+12 linh lực cố định cho nhiệm vụ nhanh",ok:()=>lifeStats().ru>=15},
     {id:"n4",n:"Luân Hồi Chi Chủ",d:"Chuyển kiếp lần đầu",b:"Mỗi lần đổi nhàn hạ rẻ hơn 8 linh lực",ok:()=>(getState().rb||0)>=1},
     {id:"n5",n:"Thượng Cổ Đan Sư",d:"Dùng 10 vật phẩm",b:"Vật phẩm tăng cường kéo dài thêm 1 nhiệm vụ",ok:()=>lifeStats().it>=10},
     {id:"n6",n:"Bảng Thượng Hữu Danh",d:"Lọt top 10 bảng Thiên Kiêu khi hoàn thành một nhiệm vụ",b:"Cửu Vĩ Hồ thu thêm 2 linh lực mỗi giờ",ok:()=>lifeStats().top>=1},
     {id:"n7",n:"Bế Quan Vạn Niên",d:"Hoàn thành 10 nhiệm vụ dài từ 120 phút",b:"Nhiệm vụ từ 120 phút +30 linh lực cố định",ok:()=>lifeStats().lg>=10},
     {id:"n8",n:"Cuồng Phong Tốc Thủ",d:"Hoàn thành 8 nhiệm vụ trong một ngày",b:"Từ nhiệm vụ thứ 4 trong ngày, mỗi nhiệm vụ +6 linh lực",ok:()=>(lifeStats().mc||0)>=8},
     {id:"n9",n:"Thiên Kiêu Độc Tôn",d:"Đứng hạng 1 bảng Thiên Kiêu khi hoàn thành nhiệm vụ",b:"Khi đang hạng 1 đến 3, mỗi nhiệm vụ +10 linh lực",ok:()=>!!lifeStats().t1},
     {id:"n10",n:"Bất Hủ Kim Thân",d:"Giữ chuỗi ngày học 21 ngày",b:"Nhiệm vụ đầu tiên mỗi ngày +25 linh lực",ok:()=>lifeStats().ms>=21},
     {id:"n11",n:"Vạn Thú Chi Vương",d:"Ấp nở 5 loài linh thú",b:"Khi có linh thú theo cùng, mỗi nhiệm vụ +4 linh lực",ok:()=>Object.keys(getState().pets||{}).length>=5},
     {id:"n12",n:"Phá Ma Thần Tướng",d:"Trừ tâm ma 3 lần",b:"Mỗi lần trừ tâm ma nhận ngay +40 linh lực",ok:()=>(lifeStats().tmc||0)>=3},
     {id:"n13",n:"Nhàn Vân Dã Hạc",d:"Đổi tổng cộng 300 phút nhàn hạ",b:"Mỗi lần đổi nhàn hạ tặng thêm 5 phút",ok:()=>(lifeStats().lv||0)>=300},
     {id:"n14",n:"Độ Kiếp Hành Giả",d:"Vượt 30 kiếp nạn",b:"Mỗi lần vượt kiếp nạn +25 linh lực",ok:()=>(lifeStats().kn||0)>=30},
     {id:"n15",n:"Tông Môn Chi Trụ",d:"Thắng 3 trận tông môn chiến",b:"Thắng tông môn chiến +100 linh lực",ok:()=>(lifeStats().sw||0)>=3},
     {id:"n16",n:"Phi Thăng Chi Tử",d:"Đạt Chân Tiên lần đầu",b:"Điểm danh mỗi ngày +15 linh lực",ok:()=>getState().points>=END||(getState().rbh||[]).some(r=>r.pk>=END)},
     {id:"n17",n:"Càn Khôn Bảo Chủ",d:"Giữ 15 vật phẩm trong Càn Khôn Giới cùng lúc",b:"Mỗi lần dùng vật phẩm nhận ngay +15 linh lực",ok:()=>Object.values(getState().inv).reduce((a,b)=>a+b,0)>=15},
     {id:"n18",n:"Nguyên Lưu Chưởng Khống Giả",d:"Đạt Chân Tiên và từng đứng hạng 1 bảng Thiên Kiêu khi hoàn thành nhiệm vụ",b:"Mỗi nhiệm vụ +12 linh lực cố định",ok:()=>(getState().points>=END||(getState().rbh||[]).some(r=>r.pk>=END))&&!!lifeStats().t1}
    ];
    const tok=t=>!!getState().ft||!!(getState().tt&&getState().tt[t.id])||t.ok();
    const eqT=id=>{const t=TITLES.find(x=>x.id===id);return !!t&&getState().title===id&&tok(t)};
    function chkT(){const T=getState().tt||(getState().tt={}),nw=[];TITLES.forEach(x=>{if(!T[x.id]&&x.ok()){T[x.id]=Date.now();markNew(x.id);nw.push(x.n)}});if(nw.length){save();schedule(()=>say("Danh hiệu mới: "+nw.join(", ")+"!"),200)}}
    return Object.freeze({TITLES,tok,eqT,chkT});
  }

  function create(deps){
    const {S,ITEMS,TITLES,today,petBuff,isTitleUnlocked,say}=deps;
    function buy(id){
      const item=ITEMS.find(x=>x.id===id);
      if(!item)return false;
      const bought=S.dailyBought[today()]||(S.dailyBought[today()]=[]);
      if(bought.includes(id)){say("Vật phẩm này đã mua hôm nay; ngày mai có thể mua lại.");return false}
      if(S.points<item.c){say("Chưa đủ linh lực.");return false}
      S.points=S.points-item.c+(petBuff().rf||0);
      S.inv[id]=(S.inv[id]||0)+1;
      bought.push(id);
      say("Đã mua "+item.n+".");
      return true;
    }
    function useItem(id){
      const item=ITEMS.find(x=>x.id===id);
      if(!item||!S.inv[id])return false;
      use(S,id,item,deps);
      return true;
    }
    function equipTitle(id){
      const title=TITLES.find(x=>x.id===id);
      if(!title||!isTitleUnlocked(title))return false;
      S.title=S.title===id?"":id;
      if(S.nw&&S.nw.t)delete S.nw.t[id];
      say(S.title?"Đã đeo danh hiệu "+title.n+".":"Đã gỡ danh hiệu.");
      return true;
    }
    return Object.freeze({buy,use:useItem,equipTitle});
  }
  root.GameItemSystem=Object.freeze({create,createTitles,use});
})(typeof window!=="undefined"?window:globalThis);
