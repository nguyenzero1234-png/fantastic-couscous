# Tu Tiên Học Đạo — Stage 2C: Cân bằng tu luyện

**Bản cập nhật:** Stage 2C · 24/11/2026 · Bản cân bằng để chủ dự án nghiệm thu.

**Mốc phục hồi:** tag `stage2-pre-balance-b0811e3`, commit `b0811e31155e1b5c01aa6254f10f1a4928d2f9b4` (Stage 2B). Trước khi quay lui, xuất backup dữ liệu trong app. Bản cũ diễn giải số lượt hiệu ứng theo nhiệm vụ, bản mới theo giờ; cần phục hồi cả save tương ứng nếu muốn tái lập chính xác trạng thái trước cân bằng.

## 1. Mục tiêu và phạm vi

Giữ nguyên phong cách tu tiên, một loại linh lực vừa là tu vi vừa là tiền tệ, luật thiên kiếp bắt buộc, hình phạt thất bại, tông môn, NPC và luân hồi. Điều chỉnh số liệu để phần thưởng phản ánh lượng học thật, giảm động cơ chia nhỏ nhiệm vụ, khuyến khích học đều. Các luật lớn cần chủ dự án duyệt; chỉnh số liệu nhỏ được tự thực hiện và ghi báo cáo.

Kiếp mặc định tiếp tục 119 ngày (17 tuần), tương ứng một học kỳ đại học Việt Nam để mô hình hóa. **Chưa triển khai** tùy chọn kiếp ngắn 1 tháng hay các độ dài khác. Khi thực hiện sau, cần thống nhất lại lịch tám thiên kiếp, tốc độ NPC, ngưỡng cảnh giới, mục tiêu tuần, vật phẩm và dữ liệu luân hồi theo từng độ dài. Không chuyển độ dài giữa một kiếp đang diễn ra.

## 2. Linh lực cơ bản, nhiệm vụ và tiến trình

| Thông số | Trước | Stage 2C |
|---|---:|---:|
| Linh lực mặc định / 60 phút | 200 | 280 |
| Độ khó dễ / vừa / khó | 1 / 1,25 / 1,5 | 1 / 1,15 / 1,3 |
| Hạn mã 1 / 3 / 0 | 2 / 1,75 / 1,5 | 1,25 / 1,15 / 1,1 |
| Không hạn | 1 | 1 |
| Thưởng chuỗi ngày học tối đa | 50% | 50% |
| Phí đổi một phút nhàn hạ cơ bản | 2 | 2 |

Công thức điểm gốc = làm tròn(phút học × 280/60 × hệ số khó × hệ số hạn), tối thiểu 1. Mức 280 là mặc định, người dùng vẫn được dùng mức tùy chỉnh. Nhiệm vụ tạo qua form, nhập hàng loạt, sửa và tạo lại dùng chung công thức; mẫu nhiệm vụ và prompt AI đồng bộ. Mã hạn được lưu để tính lại đúng. Parser chấp nhận hệ số cũ 1,25/1,5 và ánh xạ về hệ số mới.

Migration Stage 2C đổi mức mặc định cũ 200 thành 280 một lần, giữ mức tùy chỉnh khác và giữ nguyên điểm gốc đã lưu của nhiệm vụ cũ (kể cả nhiệm vụ đang học); khi sửa/tạo lại sẽ áp dụng công thức mới. Không cộng bù hoặc truy thu linh lực quá khứ.

Các mốc cảnh giới giữ nguyên: 0, 20.000, 42.000, 66.000, 92.000, 118.000, 145.000, 172.000, 200.000; Chân Tiên không có trần. Ở cùng số giờ, chia nhỏ nhiệm vụ bình thường không còn được hưởng nhiều lần phần thưởng cố định. Chênh lệch làm tròn vẫn có thể xuất hiện; phiên học dài có điều kiện riêng.

## 3. Thiên kiếp, Đạo tâm và Mệnh

| Ngày | Thiên kiếp | Linh lực : Đạo tâm cũ | Mới | Chuỗi ngày để tối đa Đạo tâm |
|---:|---|---:|---:|---:|
| 13 | Trúc Cơ Lôi Kiếp | 98:2 | 80:20 | 5 |
| 24 | Kết Đan Hỏa Kiếp | 96:4 | 80:20 | 10 |
| 36 | Anh Biến Lôi Kiếp | 94:6 | 78:22 | 16 |
| 48 | Hóa Thần Tâm Ma Kiếp | 90:10 | 76:24 | 28 |
| 61 | Luyện Hư Hàn Băng Kiếp | 90:10 | 75:25 | 40 |
| 75 | Hợp Thể Cửu Trọng Lôi Kiếp | 90:10 | 73:27 | 55 |
| 88 | Đại Thừa Hỗn Nguyên Kiếp | 90:10 | 72:28 | 70 |
| 100 | Phi Thăng Kiếp | 90:10 | 70:30 | 85 |

Điểm linh lực vẫn theo hàm tiến trình bão hòa hiện có; điểm Đạo tâm theo tỷ lệ chuỗi ngày học so với yêu cầu. Xếp loại Xuất sắc ≥90, Giỏi ≥80, Khá ≥65, Trung bình ≥50, Yếu <50. Cần đủ cảnh giới yêu cầu và điểm từ Trung bình trở lên mới vượt kiếp. Chỉ đúng loại Thiên phú có điều kiện giảm mốc mới tác động tư cách độ kiếp theo luật cũ. Diễn kiếp, hiển thị điều kiện và nhận thưởng đã đồng bộ. NPC vẫn tính điểm từ linh lực.

Không có lượt thi lại, tự miễn phạt hay cứu điểm. Mất Mệnh = làm tròn((10 × sức kiếp + 6 nếu thiếu tư cách) × min(2,5; 1 + 0,25 × (chuỗi thất bại − 1))). Mệnh tối thiểu 0. Khi thất bại và Mệnh về 0, thêm một tầng Thiên Đạo Trừng Phạt, mỗi tầng −5% linh lực, tổng tối đa −30%. Qua kiếp hợp lệ mới đặt lại chuỗi thất bại. Dự báo mức mất Mệnh khớp hệ số lần thất bại tiếp theo.

Ân Xá giữ nguyên mục tiêu một kiếp viên mãn. Kiểm tra đủ cả tám thiên kiếp, từng kiếp phải đủ tư cách và từ Khá trở lên, cùng xếp loại tổng kết phù hợp. Danh hiệu và điều kiện bái Dược Vương kiểm tra tư cách thật. Thất bại không được tính như một lần vượt kiếp.

**Nhiệm vụ đặc biệt mới — Tĩnh Tâm Dưỡng Mệnh.** Sau lần thất bại gần nhất, học ít nhất 60 phút mỗi ngày trong ba ngày riêng biệt sau ngày chịu phạt. Đủ điều kiện thì nhận 15 Mệnh một lần, tối đa 100. Không hoàn lại kết quả thi, không xóa tầng Trừng Phạt, không xóa chuỗi thất bại. Một lần thất bại mới bắt đầu lại nhiệm vụ. Những ngày đã dùng nhận Mệnh được khóa hoàn tác nếu việc hoàn tác làm tổng phút học ngày đó dưới 60. Khi luân hồi, nhiệm vụ được đặt lại. Save đang chịu phạt trước Stage 2C sẽ có nhiệm vụ này từ lần thất bại tiếp theo.

## 4. Kiếp nạn và thưởng học

- Nhật Kiếp: Hạ Kiếp mục tiêu gốc 30 phút, Trung Kiếp 60 phút, Thượng Kiếp một phiên liên tục 45 phút; thưởng 20/35/60. Hệ số cảnh giới và biến thiên theo ngày giữ nguyên. Vượt cả ba thêm 30 linh lực.
- Tuần Kiếp: mục tiêu gốc 360 phút, 5 ngày có học, 720 phút (thay mục tiêu đếm nhiệm vụ bằng thời lượng ở kiếp cuối tuần); thưởng 150/120/220, đủ ba nhận Tỉnh Thần Linh Trà. Thiên Nhãn Phù giảm mục tiêu thời lượng 25% như trước. Dữ liệu nghiệp vụ tính chung cho giao diện và nhận thưởng; nhận khóa cũ, chưa đạt mục tiêu hoặc nhận trùng bị chặn.
- Thưởng cố định theo cảnh giới, linh thú, sư phụ, danh hiệu, Thiên Đạo Chi Lực và hiệu ứng tương tự tính theo giờ học thực ghi nhận. Thanh Long và Bất Hủ Kim Thân áp dụng theo tỷ lệ tối đa giờ đầu ngày; Cuồng Phong Tốc Thủ tính phần học sau hai giờ trong ngày. Chuỗi nhiệm vụ thưởng 15% tổng linh lực đã thực nhận, tránh áp lại hệ số phạt lần hai; danh hiệu chuỗi thêm 30/giờ, tối đa 120.
- Thưởng buổi sáng từ 05:00 đến trước 09:00; tránh trùng với thưởng đêm. Dạ Minh Điểu, danh hiệu đêm và U Minh Quỷ Tôn dùng chung ngân sách tối đa 120 phút mỗi đêm (22:00 đến trước 05:00 hôm sau). Học vượt mức vẫn có linh lực cơ bản, không thêm thưởng đêm. Ngân sách không khôi phục khi hoàn tác để tránh nhận lại.
- Định nghĩa đêm hiện dựa trên giờ hoàn thành và số phút của nhiệm vụ, theo cơ chế ghi nhận nhiệm vụ của app. Chưa phân bổ theo từng phút đồng hồ trong phiên băng qua khung giờ; chưa truy hồi thưởng đêm trước cập nhật. Đây là giới hạn cần xem xét khi cải thiện timer.
- Hệ số ngẫu nhiên Thôn Thiên Thử chuyển từ xác suất mỗi nhiệm vụ sang xác suất theo thời lượng: 1 − (1 − p)^(phút/60), với p = xác suất một giờ. Mỗi nhiệm vụ vẫn tối đa một vật phẩm, nên tổng số vật phẩm kỳ vọng chưa hoàn toàn bất biến khi chia nhỏ. Điều kiện mở khóa một số danh hiệu, bái sư và nhiệm vụ tông môn vẫn dựa trên số nhiệm vụ; cần theo dõi hành vi thực tế.

## 5. Kỳ Bảo Điện và buff

Giữ giá, chức năng đặc trưng và loại tiền tệ. Trước đây nhiều món hoàn vốn sau vài nhiệm vụ rất ngắn; nay hiệu ứng có ngân sách giờ học, phần linh lực nhận tỷ lệ với phút đủ điều kiện, số lượt lẻ được lưu để dùng tiếp. Bảng dưới ghi tổng linh lực cơ bản khi dùng đủ hiệu ứng, trước hệ số thưởng/phạt, chưa định giá hiệu ứng phụ.

| Vật phẩm | Giá | Tổng cũ | Giờ × linh lực/giờ mới | Tổng mới |
|---|---:|---:|---:|---:|
| Tỉnh Thần Linh Trà | 100 | 200 | 2 × 65 | 130 |
| Tụ Linh Phù | 200 | 300 | 3 × 80 | 240 |
| Linh Thú Lương | 300 | 450 | 3 × 80 | 240 |
| Hồ Ly Quả | 400 | 600 | 3 × 100 | 300 |
| Thời Quang Sa | 500 | 750 | 3 × 135 | 405 |
| Thiên Nhãn Phù | 600 | 900 | 3 × 160 | 480 |
| Tích Cốc Đan | 700 | 700 | 4 × 200 | 800 |
| Thần Hành Phù | 800 | 800 | 4 × 220 | 880 |
| Bế Quan Đan | 900 | 900 | 3 × 345 | 1.035 |
| Sa Lậu Cổ Kính | 1.000 | 1.000 | 4 × 200 | 800 |
| Thiên Địa Linh Quả | 1.100 | 1.100 | 4 × 300 | 1.200 |
| Tụ Linh Hương | 1.200 | 1.200 | 4 × 330 | 1.320 |
| Thanh Tâm Phù | 1.300 | 1.300 | 4 × 260 | 1.040 |
| Cố Bản Đan | 1.400 | 1.400 | 4 × 260 | 1.040 |
| Hộ Tâm Phù | 1.500 | 1.500 | 4 × 300 | 1.200 |
| Độ Kiếp Đan | 1.600 | 1.600 | 4 × 320 | 1.280 |
| Vạn Hóa Đan | 1.700 | 1.700 | 5 × 375 | 1.875 |
| Tụ Linh Trận Đồ | 1.800 | 1.800 | 5 × 395 | 1.975 |
| Ngộ Đạo Bồ Đoàn | 1.900 | 1.900 | 5 × 420 | 2.100 |
| Thiên Cơ Lệnh | 2.100 | 2.100 | 5 × 335 | 1.675 |
| Tục Mệnh Phù | 2.400 | Giữ chuỗi | Giữ chuỗi | — |

Vật phẩm thuần linh lực hoàn vốn khoảng 109–130% trước hệ số; vật phẩm có tác dụng phụ có thể thấp hơn giá mua để người chơi cân nhắc. Thần Hành Phù cần nhiệm vụ có hạn, Bế Quan Đan cần phiên từ 60 phút. Linh Thú Lương nhân đôi buff cố định linh thú trong 3 giờ học (trước 5 nhiệm vụ, chưa kể hiệu ứng thêm). Kỳ ngộ tăng 30% phần thưởng học có thời lượng theo ngân sách 3 giờ. Thiên Cơ Lệnh vẫn tăng 50% cho 4 lần nhận sự kiện; Tục Mệnh Phù và các tác dụng giải/chặn tâm ma, tích lũy, giảm mục tiêu giữ chức năng. Cố Bản Đan tăng 10% trong 24 giờ như cũ. Hiệu ứng đã kích hoạt từ save cũ giữ giá trị và số lượt còn lại nhưng diễn giải lượt theo giờ từ lần cập nhật này. Các vật phẩm chưa dùng theo bảng mới.

Tâm Ma Tự Thân −20%, Thiên Ma Nhập Tâm −35%, Trừng Phạt −5% mỗi tầng (trần −30%) giữ nguyên. Cách giải tâm ma bằng 2 phiên từ 25 phút/3 phiên từ 45 phút tương ứng được giữ; lần giải thành công vẫn áp hệ số trạng thái hiện tại như trước. Thưởng giải tâm ma với danh hiệu phù hợp là một lần, không nhân theo từng nhiệm vụ.

## 6. Nhàn hạ

Chi phí cơ bản 2 linh lực/phút, thống nhất phần hiển thị và giao dịch. Huyền Quy đổi từ giảm linh lực cố định mỗi lần sang giảm 4–12% tùy cấp; danh hiệu tương ứng giảm 8%. Giảm giá sư phụ giữ theo tỷ lệ. Mặc Miêu cộng 1–5 phút mỗi 60 phút nhàn hạ, Nhàn Vân Dã Hạc cộng 5 phút/60 phút, phân bổ theo giây. Thời Quang Sa vẫn cộng một lần 15 phút; Sa Lậu Cổ Kính giảm 30% cho tối đa 120 phút của giao dịch tiếp theo. Mua nhiều lần nhỏ không nhân lên thưởng định kỳ như trước; chi phí có thể khác nhẹ do làm tròn lên.

## 7. Thiên Đạo Cân Bằng

Hạng 40 trở xuống được hỗ trợ tùy số lần đã luân hồi:

| Kiếp hiện tại | Thưởng khi đủ điều kiện |
|---|---:|
| Kiếp 1 (chưa luân hồi) | +25% |
| Kiếp 2 | +15% |
| Kiếp 3 | +5% |
| Kiếp 4 trở đi | 0% |

Vào top 39 tắt hỗ trợ ngay; xuống hạng 40 trở lại có thể nhận nếu số kiếp còn đủ điều kiện. Người chơi lâu năm hết hỗ trợ để duy trì cạnh tranh. NPC giữ hỗ trợ khoảng 12% khi chốt tuần và các thiên phú riêng. Nhật ký chốt tuần, bảng xếp hạng và màn hình buff hiển thị theo hệ số thực tế. Giữ đối thủ cạnh tranh mạnh. Không có hình phạt bổ sung chỉ vì đứng cuối bảng.

## 8. Mô phỏng định lượng

Chạy `node tests/balance-sim.cjs` để đối chiếu mã trước cân bằng từ tag với mã hiện tại. Kịch bản 119 ngày (ngày 0–118), nhiệm vụ 60 phút độ khó thường, học đủ mỗi ngày, không deadline, vật phẩm, danh hiệu, sư phụ, linh thú, điểm danh, NPC, kỳ ngộ, buff cân bằng, nhàn hạ hay hồi Mệnh. Thưởng kiếp hợp lệ được nhận; phạt theo đúng công thức. Thiên kiếp trong mô phỏng được xử lý sau học của ngày ghi trong cấu hình, nên là mô hình so sánh có kiểm soát; thời điểm thực tế có thể sớm hơn trong ngày.

| Học/ngày | Trước: linh lực, cảnh giới | Sau: linh lực, cảnh giới | Kiếp vượt trước → sau | Mệnh sau |
|---:|---|---|---:|---:|
| 1 giờ | 33.030 · Trúc Cơ | 47.528 · Kim Đan | 0 → 1/8 | 0 |
| 2 giờ | 68.306 · Nguyên Anh | 95.745 · Hóa Thần | 1 → 1/8 | 0 |
| 3 giờ | 103.301 · Hóa Thần | 147.708 · Hợp Thể | 2 → 3/8 | 0 |
| 4 giờ | 141.536 · Luyện Hư | 204.379 · Chân Tiên | 3 → 8/8 | 100 |
| 6 giờ | 221.745 · Chân Tiên | 308.400 · Chân Tiên | 8 → 8/8 | 100 |

Mức 280 đạt mục tiêu cuối kiếp: 1 giờ Trúc Cơ–Kim Đan, 2 giờ Nguyên Anh–Hóa Thần, 3 giờ Luyện Hư–Hợp Thể, 4 giờ Đại Thừa–Chân Tiên. Học 6 giờ tạo thêm tích lũy cho cạnh tranh Chân Tiên; chưa xác minh thứ hạng cụ thể. Các nhóm thấp vẫn mất Mệnh nặng do không đủ điều kiện ở các kiếp cao, phù hợp lựa chọn giữ hình phạt nghiêm.

Kịch bản bổ sung (2 giờ/ngày, tất cả có nhận hồi Mệnh theo điều kiện, trừ kịch bản chuẩn trên):

| Kịch bản | Linh lực cuối | Cảnh giới | Kiếp vượt | Mệnh |
|---|---:|---|---:|---:|
| Hồi Mệnh sau thất bại | 97.611 | Hóa Thần | 1/8 | 15 |
| Nghỉ mỗi ngày thứ 7, chuỗi bị ngắt | 62.409 | Kim Đan | 0/8 | 15 |
| Đổi 60 phút chơi mỗi ngày học (−120 linh lực) | 83.147 | Nguyên Anh | 1/8 | 15 |
| Luôn được hỗ trợ +25%, giả định giới hạn trên | 122.557 | Luyện Hư | 2/8 | 15 |

Ngày nghỉ trong kịch bản chỉ mô hình hóa ngắt chuỗi, không mô phỏng phát sinh tâm ma ngẫu nhiên. Kịch bản cân bằng liên tục là giới hạn giả định vì hạng thật thay đổi; không dự báo hạng NPC. Không khuyến khích học 6 giờ/ngày chỉ để cạnh tranh; đây là mốc đánh giá kinh tế game. Cần số liệu chơi thật để đo tỷ lệ mua vật phẩm, tích lũy theo hạng và ảnh hưởng lịch học/nghỉ.

## 9. Kiểm thử, cấu trúc và nghiệm thu

- Mã nghiệp vụ ở các module `systems/rewards.js`, `systems/quests.js`, `systems/quest-completion.js`, `systems/tribulation.js`, `systems/leaderboard.js`, `systems/items.js`, `systems/pets.js`, `systems/sect.js`; số liệu trong `data/`; migration/validation trong `core/`; trình bày trong `ui/`. Không thêm file JS nghiệp vụ ở gốc ngoài `game.js`.
- Thêm các ca hồi quy: thưởng khi chia phiên, ngân sách đêm qua nửa đêm, nhàn hạ theo thời lượng, hỗ trợ giảm theo số kiếp, hồi Mệnh một lần và khóa hoàn tác, nhận kiếp đúng điều kiện. Siết kiểm thử ân xá đủ tư cách và đủ danh sách kiếp. Bản cập nhật hiển thị Stage 2C trong tab Thống kê.
- Kiểm thử cục bộ 134/134 ở cả `UTC` và `Asia/Ho_Chi_Minh`; `git diff --check` đạt. Mô phỏng 119 ngày chạy thành công.
- Commit mã nguồn Stage 2C: `6b56dacf99516201528507e6aaa614e482f59b72`. Xét duyệt tự động từ chối push lên GitHub do chưa xác nhận quyền gửi mã nguồn và tag đến repo đích. Đã kiểm tra remote theo dõi đúng nhánh và mốc trước cân bằng; CI/APK Stage 2C chưa chạy. Bản cập nhật còn ở máy cục bộ.
- Phần còn cần nghiệm thu sau build: cài APK trên Android thật, nhập backup 2B, timer qua đêm, thử giao dịch nhàn hạ, thử Mệnh 0/hồi Mệnh, theo dõi bảng NPC qua tuần. Kiểm tra dữ liệu đã lưu và thời gian thông báo. Chờ chủ dự án duyệt số liệu; tag trước cân bằng là mốc phục hồi.
