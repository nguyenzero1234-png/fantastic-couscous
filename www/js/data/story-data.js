/* Dữ liệu Đạo Văn và thao tác ghi nhật ký, không phụ thuộc DOM. */
(function(root){
"use strict";
const realmStory=[
  null, // Luyện Khí — khởi đầu, không có đột phá vào
  {t:"Trúc Cơ",lines:[
    "Linh khí lần đầu ngưng thành trụ trong đan điền. Ngực nóng một nhịp, rồi dịu.",
    "Bên ngoài, trời không đổi. Bên trong, có một cái nền vừa được đặt xuống.",
    "Từ đây, tu vi không còn là đống cát rời."
  ]},
  {t:"Kim Đan",lines:[
    "Một viên đan phác hiện trong biển khí. Tròn, nặng, im lặng.",
    "Ngươi nhìn nó như nhìn một lời hứa chưa nói thành lời.",
    "Kim Đan không sáng. Nó chỉ không tan."
  ]},
  {t:"Nguyên Anh",lines:[
    "Trong đan, có thứ gì đó mở mắt. Không phải người, cũng không phải hồn phách thuần.",
    "Nguyên Anh ngồi đó, nhỏ, nhưng biết nhìn ra ngoài.",
    "Lần đầu tiên, tu vi có chỗ để về."
  ]},
  {t:"Hóa Thần",lines:[
    "Thần thức kéo dài hơn thân xác. Nghe được gió ngoài cửa, dù cửa vẫn đóng.",
    "Hóa Thần không phải bay lên. Là đứng giữa hai tầng trời và đất mà không vỡ.",
    "Thiên Đạo ghi thêm một nét. Không khen, không chê."
  ]},
  {t:"Luyện Hư",lines:[
    "Hư không không còn trống. Ngươi chạm vào nó như chạm vào nước lạnh.",
    "Luyện Hư: lấy cái không làm chỗ đứng. Ai không quen sẽ chóng mặt.",
    "Ngươi quen dần. Hoặc giả vờ quen."
  ]},
  {t:"Hợp Thể",lines:[
    "Thân và đạo không còn là hai sổ riêng. Một trang viết đủ cả hai.",
    "Hợp Thể nghe lớn. Thực ra chỉ là hết chỗ trốn trong chính mình.",
    "Bước này, nhiều người dừng. Ngươi không dừng."
  ]},
  {t:"Đại Thừa",lines:[
    "Tu vi đầy đến mức linh khí quanh thân tự xếp thành lớp.",
    "Đại Thừa: gần cuối núi, gió lớn hơn, đường hẹp hơn.",
    "Phía trước còn một bậc. Bậc ấy tên Chân Tiên."
  ]},
  {t:"Chân Tiên",lines:[
    "Không có sấm. Không có hoa rơi. Chỉ có một khoảng lặng đủ dài để nghe nhịp thở.",
    "Chân Tiên không phải hết đường. Là hết cái tên cũ của đường.",
    "Thiên Đạo ghi tên ngươi vào tiên lục. Khi kiếp này khép lại, con đường luân hồi vẫn chờ phía trước."
  ]}
];;
function append(state,id,title,lines,meta,now,day){
 const log=state.storyLog||(state.storyLog=[]);
 if(log.some(x=>x.id===id))return false;
 log.push({id,title,lines:lines.slice(),at:now,day,...(meta||{})});
 if(log.length>40)log.splice(0,log.length-40);
 return true;
}
root.GameStoryData={realmStory,append};
})(typeof window!=="undefined"?window:globalThis);
