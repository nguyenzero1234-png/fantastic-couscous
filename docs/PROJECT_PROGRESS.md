# Project Progress Tracker

> Cập nhật lần cuối: 2026-11-23
> Mốc mới: tách thống kê/lịch sử học sang `analytics.js`; 1.000 bộ dữ liệu hồi quy đạt.  
> Nhánh theo dõi: `stage-1/foundation`  
> Mục đích: ghi lại các phần đã hoàn thành, việc còn lại và cập nhật tài liệu này sau mỗi mốc hoàn thành.

## Đã hoàn thành

### Nền tảng và độ an toàn dữ liệu
- [x] Kiểm tra và xác thực dữ liệu khi đọc save từ `localStorage`.
- [x] Ghi log lỗi lưu và phát sự kiện `game-save-error` thay vì im lặng bỏ qua lỗi.
- [x] Tắt `android.allowMixedContent` trong `capacitor.config.json`.
- [x] Thêm cơ chế backup tự động vào `quest-study-v1.backup`.
- [x] Khôi phục từ backup hợp lệ khi save chính bị thiếu hoặc hỏng; phát sự kiện `game-save-recovered`.
- [x] Lỗi khi ghi backup không làm gián đoạn việc ghi save chính.

### Tách module bước đầu
- [x] Tách phần đọc/ghi save sang `www/js/storage.js` (IIFE, cung cấp `window.GameStorage`).
- [x] Chuyển `www/js/game.js` sang dùng `GameStorage.load()` và `GameStorage.save()`.
- [x] Nạp `storage.js`, `ui.js` và `timer.js` trước `game.js` trong `www/index.html`.
- [x] Giữ các script ở dạng classic script để tương thích với global dùng chung trong `notify.js` và `schedule.js`.
- [x] Tách cấu hình giao diện (skin, density, font size, theme) sang `www/js/ui.js`, cung cấp API `window.GameUI.apply(S)`.
- [x] Tách trạng thái và phép tính timer phiên nhàn hạ/phiên học sang `www/js/timer.js` (`window.GameTimer`).
- [x] Tách phép tính hệ số linh lực và thưởng Thiên Cơ Lệnh sang `www/js/rewards.js` (`window.GameRewards`).
- [x] Tách công thức thưởng hoàn thành nhiệm vụ, hiệu ứng thưởng theo nhiệm vụ, thưởng hoàn thành chuỗi và hệ số liên hoàn ngày học sang `GameRewards`; `game.js` vẫn quản lý trạng thái, điều kiện hiệu ứng và lưu lịch sử.
- [x] Bổ sung tài liệu kiến trúc và tiến độ tại `docs/FOUNDATION_STAGE_1.md`.

### Kiểm tra
- [x] Kiểm tra cú pháp JavaScript bằng parse cho `storage.js`, `ui.js`, `timer.js`, `game.js`, `notify.js`, `schedule.js`.
- [x] GitHub Actions build APK cho commit `8a7da3cd94b7aab9d3333a04f28b9863c35dae04` thành công: [Build run #23](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45169198792).
- [x] Sau khi tách `rewards.js` bước đầu: parse cú pháp, thứ tự nạp script và 188 ca kiểm tra runtime cho công thức thưởng linh lực đạt.
- [x] Sau khi mở rộng `rewards.js`: parse cú pháp, kiểm tra thứ tự nạp script và 898 tình huống hồi quy đối chiếu công thức cũ/mới cho thưởng nhiệm vụ, hiệu ứng vật phẩm, thưởng chuỗi và hệ số liên hoàn ngày học đều đạt.
- [x] Sau khi tách `streak.js`: parse cú pháp, kiểm tra thứ tự nạp script và 33.200 tình huống hồi quy đối chiếu logic cũ/mới cho streak, vật phẩm bảo hộ, xác suất tâm ma và tiến độ trấn áp đều đạt.
- [x] Sau khi tách `analytics.js`: parse cú pháp, kiểm tra thứ tự nạp script và 1.000 bộ dữ liệu hồi quy đối chiếu thống kê tổng quan, chuỗi ngày tốt nhất, biểu đồ và chỉ số kiếp nạn đều đạt.
- [ ] Chưa xác nhận build APK sau thay đổi mới hoặc kiểm thử Android thật.

## Đang thực hiện
- [x] Tách logic quyết định giữ/đứt chuỗi, dùng phù bảo hộ và tiến độ trấn áp tâm ma sang `www/js/streak.js`.
- [x] Kiểm thử hồi quy 33.200 tổ hợp cho streak, vật phẩm bảo hộ và tiến độ trấn áp; không có sai khác.
- [x] Tách phép tổng hợp thống kê và chỉ số kiếp nạn sang `www/js/analytics.js`.
- [x] Kiểm thử 1.000 bộ dữ liệu ngẫu nhiên, so sánh thống kê cũ/mới; không có sai khác.
- [x] Kiểm tra cú pháp và thứ tự nạp `analytics.js` trước `game.js`.

## Việc cần làm tiếp

### Ưu tiên 1 — Hoàn thiện cấu trúc module
- [x] Tách quy tắc thuần của chuỗi ngày học và tiến độ Tâm Ma/Thiên Ma sang `www/js/streak.js`; `game.js` tiếp tục quản lý vật phẩm, log, save và hiệu ứng UI.
- [x] Tách phép tổng hợp thống kê học tập và chỉ số kiếp nạn sang `www/js/analytics.js`.
- [ ] Tiếp tục tách các quy tắc gameplay độc lập khỏi `game.js`; không di chuyển các luồng có nhiều tác động phụ khi chưa có kiểm thử hồi quy đầy đủ.
- [ ] Xác định rõ API giữa các module; tránh phụ thuộc global ngầm.
- [ ] Sau mỗi lần tách, kiểm tra thứ tự nạp script và tương thích với `schedule.js`, `notify.js`.

### Ưu tiên 2 — Kiểm thử và độ tin cậy
- [ ] Thêm kiểm thử tự động cho load/save, validate dữ liệu, backup và recovery.
- [ ] Kiểm thử luồng chơi chính: tạo/lưu nhiệm vụ, hoàn thành nhiệm vụ, timer, phần thưởng và tải lại ứng dụng.
- [ ] Kiểm thử trên thiết bị Android thật; xác nhận dữ liệu không mất sau khi đóng/mở lại app.
- [ ] Cải thiện thông báo cho người dùng khi lưu thất bại hoặc khôi phục dữ liệu.

### Ưu tiên 3 — Quản lý dữ liệu người chơi
- [ ] Thiết kế chức năng xuất/nhập bản sao lưu toàn bộ dữ liệu người chơi.
- [ ] Xem xét đồng bộ dữ liệu ngoài thiết bị (chỉ triển khai khi có thiết kế bảo mật, xác thực và xử lý xung đột phù hợp).
- [ ] Kiểm thử các tình huống storage đầy, JSON lỗi, dữ liệu phiên bản cũ và backup không hợp lệ.

### Ưu tiên 4 — Quy trình phát hành
- [ ] Rà soát workflow build APK và bổ sung kiểm thử tự động trước bước build.
- [ ] Thiết lập quy trình ký APK/release an toàn; không đưa keystore hoặc secrets vào repository.
- [ ] Tạo checklist phát hành và kiểm tra bản build trên thiết bị trước khi phát hành.

## Ghi chú kỹ thuật
- `game.js` vẫn còn lớn và phần gameplay chưa được tách hoàn toàn; lần tách hiện tại chỉ là bước đầu cho storage.
- Save hiện vẫn lưu cục bộ trên thiết bị bằng `localStorage`; backup hiện tại cũng nằm trên cùng thiết bị, không thay thế backup ngoài thiết bị.
- Việc parse cú pháp và build APK thành công chưa thay thế cho kiểm thử chức năng trên thiết bị thật.
- Các thay đổi của giai đoạn này nằm trên nhánh `stage-1/foundation`; không coi `main` đã được cập nhật.

## Quy tắc cập nhật
1. Khi bắt đầu một hạng mục, chuyển nó sang mục **Đang thực hiện**.
2. Chỉ đánh dấu hoàn thành sau khi đã kiểm tra kết quả; ghi kèm commit hoặc link CI nếu có.
3. Nếu phát sinh lỗi hoặc thay đổi phạm vi, ghi rõ trong mục phù hợp.
4. Sau mỗi mốc hoàn thành, cập nhật ngày và nội dung file này trong cùng nhánh làm việc.
