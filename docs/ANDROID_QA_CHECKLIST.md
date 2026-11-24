# Kiểm thử nghiệm thu Android — Giai đoạn 1

## Trạng thái và phạm vi

CI build APK debug chỉ xác nhận khả năng cài dependency, đồng bộ Capacitor và biên dịch. Nó không thay thế việc cài và thao tác trên thiết bị Android thật. Không đánh dấu checklist này hoàn thành nếu chưa có người cầm thiết bị thực hiện và ghi lại model máy, phiên bản Android, phiên bản APK và kết quả.

Ngày 2026-11-24, sau khi nhận link APK từ Build APK run 45326644529 (commit `fcf07f5`), người dùng phản hồi “App dùng tốt”. Đã có xác nhận sử dụng cơ bản; chưa có model máy, phiên bản Android, SHA APK thực tế hoặc kết quả từng mục bên dưới. Giữ các mục nghiệm thu chi tiết mở đến khi có kết quả tương ứng.

## Chuẩn bị

- [ ] Tải artifact `TuTienHocDao-apk` từ GitHub Actions của commit mới nhất đã xanh.
- [ ] Ghi model thiết bị, phiên bản Android và mã SHA commit tương ứng.
- [ ] Nếu đang có save quan trọng, mở Cài đặt → Sao lưu & hệ thống → Tạo backup → Tải file JSON và cất file ra ngoài thiết bị.
- [ ] Cài APK debug; xác nhận ứng dụng mở không crash.

## Kiểm thử dữ liệu

- [ ] Tạo nhiệm vụ mới, hoàn thành một nhiệm vụ và xác nhận linh lực/lịch sử tăng đúng.
- [ ] Tạo chuỗi nhiệm vụ và một lịch học; đóng app hoàn toàn rồi mở lại.
- [ ] Xác nhận nhiệm vụ, điểm, lịch, chuỗi ngày, thống kê và tùy chọn giao diện còn nguyên.
- [ ] Tải file backup JSON; xác nhận file có nội dung JSON và metadata phiên bản.
- [ ] Xóa dữ liệu trên một bản cài thử nghiệm hoặc thiết bị thử nghiệm, cài/mở lại app và nhập file backup.
- [ ] Xác nhận dữ liệu phục hồi đúng; thử nhập file JSON sai và xác nhận tiến trình hiện tại không bị thay đổi.
- [ ] Kiểm tra khôi phục backup nội bộ khi save chính lỗi trên bản thử nghiệm riêng; không thao tác phá dữ liệu trên save thật.

## Kiểm thử Android/Capacitor

- [ ] Cấp/không cấp quyền thông báo và xác nhận giao diện phản hồi đúng.
- [ ] Tạo nhắc lịch/thông báo, đưa app xuống nền, chờ đến giờ và kiểm tra thông báo.
- [ ] Thử khóa màn hình, mở khóa và khởi động lại thiết bị; kiểm tra app không mất dữ liệu.
- [ ] Kiểm tra timer khi app ở foreground, background và sau khi mở lại.
- [ ] Kiểm tra bàn phím, vùng an toàn, xoay màn hình (nếu hỗ trợ), cuộn và các modal.
- [ ] Kiểm tra không có lỗi nghiêm trọng trong logcat và không có nội dung HTTP mixed content.

## Tiêu chí đạt

- Không crash trong các luồng chính.
- Dữ liệu lưu bền qua đóng/mở app và khởi động lại thiết bị.
- Xuất/nhập backup phục hồi được tiến trình; file sai không ghi đè save hợp lệ.
- Quyền thông báo được xử lý rõ ràng; timer và thông báo hoạt động đúng kỳ vọng.
- Ghi kết quả thực tế, thiết bị, Android version, commit SHA và lỗi còn tồn tại.

## Ký APK phát hành

APK debug từ workflow hiện tại không phải bản phát hành đã ký. Trước khi phát hành cần tạo keystore riêng, lưu keystore và mật khẩu trong GitHub Actions Secrets (không commit keystore/mật khẩu vào repo), cấu hình signing cho release, build `assembleRelease`, kiểm tra chữ ký bằng `apksigner verify` và lưu bản keystore ngoại tuyến an toàn. Chỉ thực hiện sau khi chủ dự án đã tự tạo và sao lưu khóa ký.
