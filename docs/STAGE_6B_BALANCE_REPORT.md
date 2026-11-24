# Stage 6B — Báo cáo mô phỏng cân bằng (2026-11-24)

Trạng thái: hoàn thành khảo sát và bản sửa Stage 6B.1–6B.2. Các bảng số liệu ban đầu thuộc baseline Stage 6B, trước sửa deadline. Hệ số thiên kiếp, mức Trừng Phạt, giá nhàn hạ, ngưỡng ân xá và dữ liệu NPC giữ nguyên.

## 1. Phương pháp

- Mô phỏng 119 ngày (17 tuần), bắt đầu thứ Hai 05/01/2026 theo giờ địa phương, seed ngẫu nhiên cố định. Dùng các script từ `www/index.html`, logic nhiệm vụ, lịch sử, chuỗi học, thiên kiếp, điểm danh, bảo khố, nhật/tuần kiếp, phục hồi Mệnh, luân hồi và bảng xếp hạng đủ 50 NPC của game. Chốt tuần khi mở game đầu ngày thứ Hai, độ kiếp lúc 12 giờ trưa; ghi nhận thưởng khi đủ điều kiện. Các kịch bản thông thường học từ 13 giờ; cặp ngày/đêm học trước thiên kiếp.
- Học cơ bản 280 linh lực/giờ, nhiệm vụ độ khó thường. Các kịch bản mua trà dùng Tỉnh Thần Linh Trà có sẵn hoặc mua nếu đủ điểm. Nhàn hạ đổi 60 phút/ngày học (2 linh lực/phút); đo chi phí đổi, chưa mô phỏng sử dụng đồng hồ chơi. Hạng được lấy từ công thức game, NPC đứng trước nếu hòa điểm. Số ngày cân bằng là số ngày nhận diện buff tại đầu ngày, không phải số lần hưởng buff thực tế.
- Kịch bản gián đoạn học thứ Hai–thứ Sáu, bỏ hai ngày cuối tuần và bỏ một nhiệm vụ có hạn mỗi thứ Sáu. Hoàn thành 153 giờ/kiếp, bỏ 85 phiên dự kiến (68 phiên cuối tuần và 17 nhiệm vụ hết hạn). Dùng hạn một giờ, bỏ nhiệm vụ nếu quá hạn. Luân hồi thật qua bốn kiếp, giữ trạng thái Trừng Phạt như cơ chế hiện tại.
- Chạy headless, bỏ dựng giao diện và timer thời gian thực. Dùng `finish` tại mốc hoàn thành giả lập và nút mua nhàn hạ; vẫn chạy xử lý tiến trình trong `render`. Không chủ động chọn danh hiệu, kích hoạt linh thú, bái sư, gia nhập tông môn, công pháp, cơ duyên hoặc God Mode. Một seed, một lịch và lựa chọn hành vi cố định, không đại diện cho toàn bộ người dùng. Không suy ra quan hệ nhân quả giữa các kịch bản khác nhau nếu nhiều yếu tố cùng đổi.

Lệnh tái lập (PowerShell):

```powershell
$env:TZ='Asia/Ho_Chi_Minh'
node tests/balance-sim.cjs --full
node tests/balance-sim.cjs --full --scenario irregular
node tests/balance-sim.cjs --full --scenario steady --days 30
node tests/balance-sim.cjs
```

Lệnh cuối giữ mô phỏng Stage 2C cũ (study-only), không trộn số liệu hai phương pháp. `--days` hỗ trợ 30/60/90/119; `--scenario` chọn riêng từng hồ sơ. Mỗi dòng JSON có kết quả từng kiếp, chi tiết 8 thiên kiếp, điểm, hạng, Mệnh, chuỗi học, số stack, phút đêm đủ điều kiện và thống kê thu/chi.

## 2. Kết quả 119 ngày

| Hồ sơ | Giờ học thực | Linh lực cuối | Đỉnh linh lực | Hạng cuối | Qua kiếp | Mệnh | Stack |
|---|---:|---:|---:|---:|---:|---:|---:|
| beginner: 1h/ngày | 119 | 77.937 | 77.937 | 51 | 1/8 | 15 | 2 |
| steady: 2h/ngày, trà, nhàn hạ | 238 | 108.637 | 108.757 | 40 | 2/8 | 15 | 2 |
| steady-save: 2h/ngày, trà, giữ điểm | 238 | 121.343 | 121.343 | 33 | 2/8 | 15 | 2 |
| irregular: kiếp 1 | 153 | 76.273 | 76.393 | 51 | 1/8 | 15 | 2 |
| irregular: kiếp 2 | 153 | 62.725 | 62.845 | 51 | 0/8 | 15 | 5 |
| irregular: kiếp 3 | 153 | 48.307 | 48.427 | 51 | 0/8 | 15 | 8 |
| irregular: kiếp 4 | 153 | 44.169 | 44.289 | 51 | 0/8 | 15 | 11 |
| consistent: 4h/ngày, trà | 476 | 233.605 | 233.605 | 9 | 8/8 | 100 | 0 |
| split: 1h/ngày, 12 phiên 5 phút | 119 | 74.859 | 74.859 | 51 | 1/8 | 15 | 2 |
| night: 3h/ngày, 00–03 giờ | 357 | 172.497 | 172.497 | 15 | 4/8 | 17 | 0 |
| day: 3h/ngày, 08–11 giờ | 357 | 172.646 | 172.646 | 15 | 4/8 | 17 | 0 |

### 2.1. Thiên kiếp và đạo tâm

Thiên kiếp hiện kết hợp linh lực (70–80 điểm) và đạo tâm (20–30 điểm), nhưng còn yêu cầu cảnh giới tối thiểu. Điểm đánh giá cao vẫn có thể trượt do thiếu cảnh giới. Người học 1h/ngày đủ 119 ngày liên tục, không có Tâm Ma Tự Thân, vẫn trượt 7 lần; điểm các kiếp sau khoảng 66–67. Người 2h giữ điểm trượt từ ngày thứ 37 (chỉ số ngày 36), dù đạt 81 điểm Giỏi, vì 38.493 < 42.000 linh lực. Người học 3h ban ngày có điểm 91 ở ngày 61 nhưng 89.813 < 92.000, trượt Luyện Hư Hàn Băng Kiếp; sau đó trượt ba lần tiếp theo. Người học 4h có trà qua toàn bộ 8 kiếp, Mệnh 100 và đạt Chân Tiên.

### 2.2. Nhàn hạ và bảo khố

Hai hồ sơ 2h có cùng lịch và chiến lược trà. Đổi nhàn hạ tiêu 14.280 linh lực trong 119 ngày. Chênh điểm cuối 12.706 (khoảng 10,5% so với giữ điểm), do hệ thống cân bằng và buff khác nhau trong tiến trình. Hạng cuối giảm từ 33 xuống 40 nhưng số kiếp vượt giữ nguyên 2/8. Chi phí vật phẩm 9.800 và 9.900 linh lực tương ứng. Nhàn hạ có chi phí thực sự; dữ liệu này chưa chứng minh mức giá hiện tại cần tăng hoặc giảm.

### 2.3. Trừng Phạt và nhiều kiếp

| Kiếp gián đoạn | Hệ số cân bằng tối đa | Ngày đủ cân bằng đầu ngày | Stack đầu → cuối | Lần hồi Mệnh | Tâm Ma Tự Thân phát sinh |
|---|---:|---:|---:|---:|---:|
| 1 | 1,25 | 116 | 0 → 2 | 7 | 9 |
| 2 | 1,15 | 115 | 2 → 5 | 8 | 6 |
| 3 | 1,05 | 119 | 5 → 8 | 8 | 9 |
| 4 | 1,00 | 0 | 8 → 11 | 8 | 7 |

Linh lực kiếp 4 giảm 42,1% so với kiếp 1, dù cùng số giờ thực học. Mệnh hồi 15 sau ba ngày đủ 60 phút, mỗi thất bại mở nhiệm vụ hồi phục mới. Trừng Phạt trừ 5%/stack, giới hạn 30%; số stack vẫn tích lũy vượt 6. Thiên Đạo Cân Bằng ngừng từ kiếp 4 đúng thiết kế. Chưa khảo sát người cải thiện mạnh ở kiếp tiếp theo hoặc ân xá thành công; không thể kết luận họ không có đường phục hồi.

### 2.4. Chia nhỏ và học đêm

- Chia 12 phiên 5 phút so với 1 phiên 60 phút/ngày, cùng 119 giờ. Tổng thưởng nhiệm vụ 61.598 so với 61.559 (+39), nhưng tổng linh lực cuối thấp hơn 3.078 do thiếu một số thưởng nhật/tuần kiếp phiên dài. Mỗi ngày hoàn tác rồi làm lại phiên đầu không tăng linh lực ròng; mô phỏng có kiểm tra trực tiếp và dừng nếu vi phạm. Chưa kiểm tra mọi tổ hợp vật phẩm, công pháp, chuỗi nhiệm vụ với thao tác này.
- Cặp học ngày/đêm đều có 357 giờ, 119 ngày, 4/8 kiếp, hạng 15, Mệnh 17. Học đêm ghi nhận đúng 14.280 phút (120 phút × 119 đêm) đủ điều kiện thưởng, không đêm nào vượt 120 phút. Điểm cuối thấp hơn học ngày 149 (0,09%). Không trang bị buff đêm chủ động nên đây là phép thử giới hạn phút và tiến trình mặc định, chưa phải phép đo tối đa hiệu ứng sư phụ/linh thú/danh hiệu.
- Mô phỏng bỏ nhiệm vụ hết hạn đúng chặn UI. Đọc code và kiểm thử timer hiện có cho thấy phiên bắt đầu hợp lệ vẫn hoàn thành được sau hạn; receipt đánh dấu `late`, nhưng `finish` tính thưởng theo `q.pts` đã có hệ số deadline. Cần xem xét khoản thưởng hạn cho trường hợp này; việc giữ công học thực tế và việc hưởng thưởng đúng hạn là hai vấn đề riêng.

## 3. Đề xuất chờ duyệt

| Ưu tiên | Hạng mục | Đề xuất và tiêu chí cần kiểm chứng |
|---|---|---|
| P1 | Thiên kiếp | Hiển thị riêng điểm đánh giá, điều kiện cảnh giới và nguyên nhân trượt. Giữ yêu cầu linh lực và hình phạt khi trượt. Mô phỏng các mốc cảnh giới/đạo tâm khác nhau trước khi chọn hệ số mới; mục tiêu đề xuất 1h đều 1–3/8, 2h đều 3–5/8, 3h đều 5–7/8, 4h đều có cơ hội 8/8. Đây là mục tiêu thiết kế, chưa phải kết quả của công thức mới. |
| P1 | Deadline | Nếu phiên kết thúc muộn, giữ thưởng học cơ bản theo thời lượng nhưng không cấp phần nhân thưởng đúng hạn. Nhiệm vụ hết hạn chưa bắt đầu vẫn bị khóa. Dùng mốc `completedAt` thực tế và bảo toàn receipt/hoàn tác/reload. Không cộng thêm hình phạt chưa được duyệt. |
| P2 | Trừng Phạt, luân hồi | Giữ phạt tối đa 30%, mức mất Mệnh, điều kiện ân xá nghiêm khắc và tắt cân bằng từ kiếp 4. Khảo sát thêm lộ trình 2h hoặc 4h sau kiếp thất bại để đánh giá khả năng thoát phạt bằng nỗ lực. Kiểm tra số stack vượt 6 để thông báo rõ hiệu lực thực tế. |
| P2 | Nhàn hạ | Giữ giá mặc định 2/phút trước mắt; hiển thị chi phí và ảnh hưởng cảnh giới trước khi đổi. Chạy thêm mức 30/60/120 phút nếu cần quyết định giá. |
| P3 | Phiên ngắn và học đêm | Giữ giới hạn 120 phút thưởng đêm; không khuyến khích học đêm. Kiểm thử thêm phiên qua nửa đêm có buff thật, vật phẩm/công pháp và hoàn tác. Hiện không có bằng chứng cần tăng thưởng phiên nhỏ. |

Các phương án cân bằng tiếp theo cần có backup/tag trước khi thay đổi gameplay và bảng so sánh trước/sau bằng cùng seed, lịch và hồ sơ. Stage 6B.1 đã sửa thưởng deadline và trình bày kết quả thiên kiếp. Các thay đổi hệ số còn chờ duyệt.

## 4. Kiểm chứng

- Mô phỏng đủ 11 kết quả kiếp 119 ngày (8 hồ sơ, một hồ sơ qua 4 kiếp), cặp ngày/đêm chạy lại với cùng ngày lịch, không vượt ranh giới kiếp. Mô phỏng 30 ngày với `steady` chạy thành công. Chế độ legacy vẫn sinh 21 dòng kết quả.
- 156/156 kiểm thử đạt ở Asia/Ho_Chi_Minh và UTC. Dùng chung fixture headless với bộ kiểm thử khởi động để tránh nhân bản cấu hình DOM giả lập.
- Nghiệm thu Android thật và CI của bản cập nhật họa tiết Stage 6A vẫn chưa được xác nhận trong lượt này. Bản baseline Stage 6B chỉ đổi công cụ mô phỏng; Stage 6B.1–6B.2 đã thay đổi mã chạy trên Android và cần build lại.


## 5. Stage 6B.1–6B.2 — Đã triển khai

- Phiên học bắt đầu hợp lệ và kết thúc sau hạn vẫn nhận phần học cơ bản; bỏ hệ số deadline và các buff chỉ dành cho hoàn thành đúng hạn. Lấy thời điểm kết thúc thực tế, kể cả khi reload sau nửa đêm. Nhiệm vụ chưa bắt đầu mà hết hạn vẫn khóa. Receipt lưu phần thưởng bị bỏ, hỗ trợ hoàn tác và khôi phục nguyên receipt kể cả sau hạn. Nhiệm vụ cũ có loại hạn xác định ước tính điểm cơ bản từ điểm lưu/hệ số; nếu loại hạn không xác định thì giữ điểm cũ, tránh tự đoán.
- Thiên kiếp hiển thị riêng điểm/xếp loại, ngưỡng linh lực, nguyên nhân trượt và chuỗi thất bại. Không đổi ngưỡng hoặc mức phạt.
- Thiên Kiêu Bảng rút gọn thẻ còn tên thiên phú; chân dung 44 px (40 px trên màn hình ≤360 px), giữ hai họa tiết rồng Stage 6A. Hồ sơ chứa mô tả đầy đủ, 7 mốc hạng gần nhất, 5 cơ duyên gần đây trong 3 ngày; lưu tối đa 30 ngày quan sát bảng, theo ID nhân vật, xóa khi luân hồi. Không suy diễn hạng những ngày chưa mở bảng. Các mục chi tiết giữ trạng thái mở khi cập nhật cùng hồ sơ.
- Nhãn vật phẩm, Bạch Hổ và danh hiệu deadline dùng “đúng hạn”. Nhiệm vụ có receipt hoàn tác hiển thị “Có thể khôi phục” thay cho trạng thái hết hạn và ẩn nút tạo lại.

## 6. Mô phỏng phục hồi ở kiếp thứ năm

Hai lần chạy cùng seed, 119 ngày/kiếp. Bốn kiếp đầu học gián đoạn như baseline và tích lũy 11 stack. Kiếp 5 học đều cả 119 ngày, dùng trà khi đủ điểm, không đổi nhàn hạ, không deadline, không học đêm, không chủ động chọn buff khác. Thiên Đạo Cân Bằng đã tắt.

| Kịch bản kiếp 5 | Giờ thực học | Linh lực cuối | Hạng | Kiếp vượt | Mệnh cuối | Stack đầu → cuối | Ân xá |
|---|---:|---:|---:|---:|---:|---|---|
| 2h/ngày | 238 | 83.836 | 51 | 1/8 | 15 | 11 → 13 | Không |
| 4h/ngày | 476 | 160.087 | 18 | 3/8 | 15 | 11 → 12 | Không |

Kiếp 5 học 2h có điểm đánh giá Khá ở cả 8 lần, nhưng 7 lần thiếu cảnh giới; học 4h đạt 1 Xuất sắc và 7 Giỏi về điểm đánh giá, nhưng 5 lần thiếu cảnh giới. Cả hai giữ chuỗi 119 ngày, không phát sinh Tâm Ma Tự Thân, không đạt ân xá. Mô phỏng xác nhận nỗ lực đều đặn cải thiện tu vi và hạng nhưng chưa đủ thoát phạt trong hai kịch bản. Giữ tính nghiêm khắc và mức phạt hiện tại; đề xuất khảo sát thêm chiến lược có buff hợp lệ và cân bằng riêng ngưỡng linh lực/đạo tâm trước khi thay đổi. Chưa kết luận không thể ân xá.

Lệnh tái lập:

```powershell
$env:TZ='Asia/Ho_Chi_Minh'
node tests/balance-sim.cjs --full --scenario recovery-2h
node tests/balance-sim.cjs --full --scenario recovery-4h
```

## 7. Kiểm chứng bản cập nhật

- 157/157 bài kiểm thử tại Asia/Ho_Chi_Minh và UTC. Hồi quy thời điểm kết thúc đúng hạn/quá hạn 1 ms, reload qua nửa đêm, đổi tốc độ sau khi bắt đầu phiên, dùng vật phẩm đúng hạn và undo/redo receipt. Kiểm tra ghi hạng ngày đầu, đổi ngày, lỗi lưu, giới hạn 30 ngày, lùi lịch, reset luân hồi và ID khi trùng tên.
- Edge headless 760/390/320/280 px: đủ 51 hàng, không tràn ngang, tên thiên phú rút gọn, mục lịch sử mở qua cập nhật, không lỗi JS. Chưa đo lại kích thước avatar sau render bằng DOM thật.
- Chưa build APK hoặc nghiệm thu Android thật; workspace chưa có thư mục android và SDK cục bộ chưa được xác nhận. Chưa commit/push bản Stage 6B.

## 8. Stage 6I — So sánh phục hồi có và không dùng trà

Cùng seed và bốn kiếp đầu như mục 6. Kiếp thứ năm học đủ 119 ngày. Bốn lượt đều bắt đầu với 11 stack, kết thúc với 13 stack, vượt 1/8 thiên kiếp, còn 15 Mệnh và chưa được ân xá.

| Kịch bản | Linh lực cuối | Lượt dùng trà |
|---|---:|---:|
| 1 giờ/ngày, dùng trà khi đủ điểm | 47.719 | 118 |
| 1 giờ/ngày, không dùng trà | 47.286 | 0 |
| 2 giờ/ngày, dùng trà khi đủ điểm | 83.836 | 118 |
| 2 giờ/ngày, không dùng trà | 83.116 | 0 |

Trà tăng lần lượt 433 và 720 linh lực ở hai mức thời lượng. Kết quả phục hồi giữ nguyên trong bốn kịch bản này. Chưa khảo sát tổ hợp buff khác hoặc thay đổi công thức.

Chạy lại bằng `node tests/balance-sim.cjs --full --scenario <tên>` với `TZ=Asia/Ho_Chi_Minh` và một trong các tên `recovery-1h`, `recovery-1h-no-tea`, `recovery-2h`, `recovery-2h-no-tea`.
