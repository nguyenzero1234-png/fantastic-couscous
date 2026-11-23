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
