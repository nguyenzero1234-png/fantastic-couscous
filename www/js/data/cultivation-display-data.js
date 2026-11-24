/* Dữ liệu tĩnh cho hiển thị đạo đồ và cơ duyên theo giờ. */
(function(root){
"use strict";
const RC=["#7fb8a4","#4fc48a","#e0b341","#6aa3ff","#b07cff","#ff6fae","#ff8a4c","#f4e7b0","#fff3c4"];
const QT=[
  "「Người tôn kính không phải kẻ mạnh, mà là kẻ dám làm mọi thứ vì mục tiêu.」— Phương Nguyên · Cổ Chân Nhân",
  "「Ta vì thành tiên, không vì cứu thế.」— Phương Nguyên · Cổ Chân Nhân",
  "「Thiên địa bất nhân, vạn vật vi sô cẩu.」— Đạo Đức Kinh (phong vị)",
  "「Đạo tâm không vững, tu vi chỉ là cát bụi.」— phong vị cầu đạo",
  "「Một bước sai, vạn kiếp không quay đầu.」— phong vị tu tiên",
  "「Kiếp này không xong, còn có kiếp sau — miễn là còn thở.」— phong vị luân hồi",
  "「Ngồi xuống một canh giờ cũng là đạo. Không cần ai chứng kiến.」— phong vị khổ tu",
  "「Linh lực không nhớ tên ngươi. Chỉ nhớ ngươi có ngồi hay không.」— Thiên Đạo ký lục",
  "「Tông môn cho chỗ đứng. Đạo tâm thì phải tự dựng.」— lời sư phụ vô danh",
  "「Chuỗi ngày không phải huy chương. Chỉ là bằng chứng ngươi chưa bỏ.」— Nhật ký đạo hữu",
  "「Thiên kiếp không hỏi ngươi mệt chưa. Nó chỉ hỏi ngươi còn đứng không.」— Lôi kiếp cổ thư",
  "「Linh thú không nói. Nhưng nó nhớ từng lần ngươi quay lại.」— Sổ Càn Khôn",
  "「Danh hiệu là cái bóng. Người đi trước mới là xương sống.」— Thiên Kiêu Bảng chú",
  "「Sợ chết thì đừng cầu trường sinh.」— phong vị Cầu Ma",
  "「Cơ duyên không đến tìm ta; ta đi gặp cơ duyên.」— phong vị hành giả",
  "「Trang nhật ký trắng không phải thất bại. Chỉ là chưa viết.」— Thiên Thư",
  "「Hôm nay ít. Ngày mai có thể nhiều. Đạo không tính theo một trang.」— Lão giả bên án thư",
  "「Mệnh mỏng thì đi chậm. Đi chậm vẫn là đi.」— lời độ kiếp",
  "「Khi kiếp khép, Thiên Đạo gập trang. Phần còn lại là của ngươi.」— Luân hồi chí",
  "「Không thành ma, không thành tiên — thành người biết ngồi xuống.」— biến tấu Cầu Ma"
];
const KT0=Date.parse("2026-01-01T00:00:00");
const KN=[
  ["Thiên Cơ Hiện Thế","Thiên cơ lộ ra trong khoảnh khắc, ai nắm bắt được sẽ nhận phúc lớn.",1.5],
  ["Tiên Nhân Khảo Nghiệm","Một vị tiên nhân vô danh ra đề khảo nghiệm.",1],
  ["Linh Mạch Bùng Phát","Linh mạch dưới chân đột ngột tuôn trào.",1],
  ["Bí Cảnh Mở Cửa","Một bí cảnh chỉ mở trong chốc lát.",1],
  ["Cố Nhân Tương Ngộ","Cố nhân xuất hiện, trao một cơ duyên.",1],
  ["Linh Thú Xuất Thế","Trong sương mù hiện ra bóng dáng linh thú — cơ duyên ngàn năm có một.",1.2]
];
const KX=["linh lực thưởng ×1,5","+1 Tỉnh Thần Linh Trà","hiệu ứng ×1,3 cho 3 giờ học kế tiếp","+1 Tích Cốc Đan","+80 linh lực","cơ hội nhận linh thú"];
root.GameCultivationDisplayData={realmColors:RC,quotes:QT};
root.GameFortuneData={epoch:KT0,events:KN,effects:KX};
})(typeof window!=="undefined"?window:globalThis);
