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

## Bổ sung nghiệm thu đợt B — timer và thông báo

- [ ] Trên bản cài thử nghiệm, bắt đầu học, đưa app xuống nền hoặc khóa màn hình, mở lại trước khi hết giờ; kiểm tra thời gian còn lại đúng.
- [ ] Đóng app trong phiên học, mở lại sau khi hết giờ; kiểm tra hoàn thành và thưởng đúng một lần kể cả sau nhiều lần mở lại.
- [ ] Bắt đầu học hợp lệ sát hạn nhiệm vụ và sát nửa đêm; đối chiếu thưởng/ngày ghi nhận khi mở lại sau hạn hoặc qua ngày.
- [ ] Thử hoàn thành thủ công, hủy học, xóa nhiệm vụ/chuỗi đang học và luân hồi; kiểm tra phiên cũ không phát thưởng hoặc thông báo lần nữa.
- [ ] Chạy học và chơi đồng thời, đóng/mở app; kiểm tra số giây chơi còn lại, dừng chơi và mua thêm thời gian khi đang chạy.
- [ ] Đổi giờ thiết bị lùi rồi tiến trên bản thử nghiệm; kiểm tra thời gian đã tiêu không được hoàn lại, phiên hết hạn được xử lý nhất quán.
- [ ] Từ chối rồi cấp lại quyền thông báo, kiểm tra trạng thái giao diện và lịch nhắc được khôi phục; hủy/dừng phiên để kiểm tra thông báo cũ không còn.
- [ ] Kiểm tra giao thông báo khi màn hình khóa, app chạy nền, đóng app và với chế độ tiết kiệm pin; ghi rõ giới hạn theo thiết bị/Android.

## Tiêu chí đạt


- Không crash trong các luồng chính.
- Dữ liệu lưu bền qua đóng/mở app và khởi động lại thiết bị.
- Xuất/nhập backup phục hồi được tiến trình; file sai không ghi đè save hợp lệ.
- Quyền thông báo được xử lý rõ ràng; timer và thông báo hoạt động đúng kỳ vọng.
- Ghi kết quả thực tế, thiết bị, Android version, commit SHA và lỗi còn tồn tại.

## Ký APK phát hành

APK debug từ workflow hiện tại không phải bản phát hành đã ký. Trước khi phát hành cần tạo keystore riêng, lưu keystore và mật khẩu trong GitHub Actions Secrets (không commit keystore/mật khẩu vào repo), cấu hình signing cho release, build `assembleRelease`, kiểm tra chữ ký bằng `apksigner verify` và lưu bản keystore ngoại tuyến an toàn. Chỉ thực hiện sau khi chủ dự án đã tự tạo và sao lưu khóa ký.
