/* ===== Mô tả dữ liệu vật phẩm =====
   Tạo phần mô tả và tổng linh lực từ cấu hình; không sửa vật phẩm đầu vào. */
(function(root){
  "use strict";
  function describe(item){
    if(!item||!item.q)return {};
    const [n,v,t]=item.q;
    const total=n*v+(item.ex||0);
    const condition=t==="q"?" có hạn giờ":t==="l"?" trong phiên từ 60 phút":"";
    const ratio=total/item.c;
    const description="Dùng: "+(item.u?item.u+"; ":"")+(item.ex?"thêm ":"")+n+" giờ học"+condition+" kế tiếp, mỗi giờ +"+v+" linh lực (tổng cơ bản +"+total+", "+Math.round(ratio*100)+"% giá mua, trước hệ số thưởng/phạt)";
    return {tot:total,d:description};
  }
  const catalogData=[
 {id:"ca",n:"Tỉnh Thần Linh Trà",c:100,q:[2,65,""],use:1},
 {id:"tl",n:"Tụ Linh Phù",c:200,q:[3,80,""],use:1},
 {id:"ll",n:"Linh Thú Lương",c:300,q:[3,80,""],u:"3 giờ học kế tiếp buff cố định của linh thú ×2",use:1},
 {id:"hy",n:"Hồ Ly Quả",c:400,q:[3,100,""],u:"Cửu Vĩ Hồ tích thêm 4 giờ linh lực",use:1},
 {id:"tq",n:"Thời Quang Sa",c:500,q:[3,135,""],u:"lần đổi nhàn hạ kế tiếp tặng thêm 15 phút",use:1},
 {id:"ln",n:"Thiên Nhãn Phù",c:600,q:[3,160,""],u:"hôm nay mục tiêu kiếp nạn giảm 25%",use:1},
 {id:"bm",n:"Tích Cốc Đan",c:700,q:[4,200,""],use:1},
 {id:"td",n:"Thần Hành Phù",c:800,q:[4,220,"q"],use:1},
 {id:"bq",n:"Bế Quan Đan",c:900,q:[3,345,"l"],use:1},
 {id:"sl",n:"Sa Lậu Cổ Kính",c:1000,q:[4,200,""],u:"lần đổi nhàn hạ kế tiếp giảm 30% cho tối đa 120 phút",use:1},
 {id:"lq",n:"Thiên Địa Linh Quả",c:1100,q:[4,300,""],use:1},
 {id:"hx",n:"Tụ Linh Hương",c:1200,q:[4,330,""],use:1},
 {id:"ty",n:"Thanh Tâm Phù",c:1300,q:[4,260,""],u:"xóa tâm ma ngay",use:1},
 {id:"cb",n:"Cố Bản Đan",c:1400,q:[4,260,""],u:"xóa tâm ma và tăng 10% linh lực trong 24 giờ",use:1},
 {id:"ht",n:"Hộ Tâm Phù",c:1500,q:[4,300,""],u:"chặn lần tâm ma kế tiếp",use:1},
 {id:"dk",n:"Độ Kiếp Đan",c:1600,q:[4,320,""],u:"hôm nay mỗi kiếp nạn vượt được +30 linh lực",use:1},
 {id:"vh",n:"Vạn Hóa Đan",c:1700,q:[5,375,""],use:1},
 {id:"tc",n:"Tụ Linh Trận Đồ",c:1800,q:[5,395,""],use:1},
 {id:"ghe",n:"Ngộ Đạo Bồ Đoàn",c:1900,q:[5,420,""],use:1},
 {id:"cl",n:"Thiên Cơ Lệnh",c:2100,q:[5,335,""],u:"+50% linh lực cho 4 lần nhận thưởng sự kiện kế tiếp",use:1},
 {id:"the",n:"Tục Mệnh Phù",c:2400,d:"Tự dùng khi lỡ 1 ngày, giữ nguyên chuỗi ngày học",use:1}
];;
  function catalog(){
    return catalogData.map(item=>Object.assign({},item,{q:item.q&&item.q.slice()},describe(item)));
  }
  root.GameItemData=Object.freeze({describe,catalog});
})(typeof window!=="undefined"?window:globalThis);
