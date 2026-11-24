/* Dữ liệu tĩnh cho hiển thị đạo đồ và cơ duyên theo giờ. */
(function(root){
"use strict";
const RC=["#7fb8a4","#4fc48a","#e0b341","#6aa3ff","#b07cff","#ff6fae","#ff8a4c","#f4e7b0","#fff3c4"];
const QT=[
  "「Việc học không thể ngừng nghỉ.」— Tuân Tử · Khuyến học",
  "「Kiên trì không bỏ cuộc, vàng đá cũng có thể khắc được.」— Tuân Tử · Khuyến học",
  "「Không tích lũy từng bước nhỏ, chẳng thể đi xa ngàn dặm.」— Tuân Tử · Khuyến học",
  "「Không học chẳng thể mở rộng tài năng, không có chí chẳng thể thành tựu học vấn.」— Gia Cát Lượng · Giới tử thư",
  "「Học mà không suy nghĩ thì mê muội, suy nghĩ mà không học thì nguy hại.」— Luận Ngữ · Vi chính",
  "「Kiến thức trên trang giấy vẫn còn nông cạn, muốn hiểu thấu phải tự mình thực hành.」— Lục Du · Đông dạ độc thư thị tử Duật",
  "「Hỏi sao nước trong đến thế, bởi có nguồn nước mới không ngừng chảy tới.」— Chu Hy · Quan thư hữu cảm",
  "「Thấu hiểu việc đời đều là học vấn, thông đạt nhân tình chính là văn chương.」— Hồng Lâu Mộng · Hồi 5",
  "「Chỉ cần thấu rõ bản tâm, giữ chí chân thành, nơi tâm hướng về chính là Linh Sơn.」— Tây Du Ký · Hồi 24",
  "「Việc đọc sách chớ cầu quá nhiều. Tham nhiều khó tiêu hóa, đọc sâu hiểu kỹ mới là thượng sách.」— Kiếm Lai (dịch ý)",
  "「Trước hết hãy tích lũy, sau đó chắt lọc tinh hoa, cứ từ từ mà tiến.」— Kiếm Lai (dịch ý)"
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
