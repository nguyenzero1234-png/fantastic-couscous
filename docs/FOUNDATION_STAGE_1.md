# Giai đoạn 1 — Nền tảng ổn định

Phạm vi của nhánh `stage-1/foundation`: giảm rủi ro mất dữ liệu và chuẩn bị nền cho các lần tách module tiếp theo, không thay đổi luật chơi hay cấu trúc dữ liệu đang dùng.

## Thay đổi trong đợt này

- Kiểm tra dữ liệu lưu trước khi gộp vào trạng thái mặc định: JSON phải là object, có `quests` dạng mảng và `points` dạng số. Dữ liệu lỗi không được nạp đè trạng thái mặc định.
- Không còn nuốt im lặng lỗi ghi `localStorage`; ghi log rõ ràng và phát sự kiện `game-save-error` để giao diện có thể hiển thị cảnh báo ở bước tiếp theo.
- Tạo bản sao lưu tự động của bản lưu hợp lệ trước lần ghi tiếp theo; nếu bản lưu chính hỏng, game thử khôi phục từ `quest-study-v1.backup` và phát sự kiện `game-save-recovered`.
- Lỗi tạo bản sao lưu không chặn lần lưu chính; bản sao lưu chỉ chứa một phiên bản gần nhất, không thay thế chức năng xuất dữ liệu thủ công.
- Tắt `android.allowMixedContent`; ứng dụng không nên cho phép tải nội dung HTTP không an toàn trong WebView khi các tài nguyên hiện tại dùng HTTPS/local.
- Giữ nguyên khóa lưu `quest-study-v1` và định dạng dữ liệu hiện tại để tránh làm mất tương thích với tiến trình cũ.
- Tách toàn bộ phần đọc/ghi `localStorage`, kiểm tra save và backup/restore sang `www/js/storage.js` (`window.GameStorage`). `game.js` gọi `GameStorage.load()` khi khởi tạo và `GameStorage.save()` khi lưu.
- Nạp `storage.js` trước `game.js` trong `index.html`. Các script vẫn dùng classic script và API toàn cục nhỏ để không phá tương thích với `notify.js` và `schedule.js`.
- Tách `ui.js`, `timer.js`, `rewards.js`, `streak.js`, `analytics.js`, `quest-data.js` và `schedule-data.js`; các module mới vẫn dùng classic script và được nạp trước `game.js`.
- Thêm bộ kiểm thử Node.js built-in tại `tests/modules.test.js`, chạy bằng `npm test`; hiện có test cú pháp script, thứ tự nạp, công thức thưởng, streak/tâm ma, thống kê và parser nhiệm vụ/lịch học.

## Kiến trúc mục tiêu

```text
www/js/
  core/
    state.js       # khởi tạo, kiểm tra và nâng cấp schema
    storage.js     # đọc/ghi, backup/restore
  features/
    quests.js
    schedule.js
    cultivation.js
    pets.js
    sect.js
    events.js
  ui/
    render.js
    settings.js
  game.js          # điểm vào/điều phối tạm thời
```

Đây là bước tách module đầu tiên, tập trung vào ranh giới lưu trữ có ít phụ thuộc nhất. Phần gameplay vẫn ở `game.js` (~242 KB); chưa chuyển hàng loạt các hàm vì file đang chứa nhiều hàm dùng chung toàn cục và thứ tự nạp script có ý nghĩa. Tiếp theo nên tách từng miền chức năng sau khi có kiểm thử hồi quy.

## Kiểm thử cần chạy trước khi nhập nhánh

1. Mở bản web và APK, xác nhận tiến trình cũ vẫn nạp.
2. Tạo nhiệm vụ, hoàn thành một phiên học, tải lại trang và xác nhận dữ liệu còn nguyên.
3. Xuất dữ liệu ở Cài đặt → Sao lưu & hệ thống; nhập lại bản xuất trên bản thử nghiệm.
4. Thử dữ liệu JSON sai định dạng trên bản thử nghiệm và xác nhận dữ liệu hiện tại không bị ghi đè.
5. Kiểm tra thông báo Capacitor và các tài nguyên mạng trên Android sau khi tắt mixed content.

## Giới hạn

Đây là hardening bước đầu, chưa phải hệ thống backup tự động. Lưu trữ vẫn nằm trên thiết bị/trình duyệt; xóa dữ liệu ứng dụng vẫn có thể làm mất tiến trình. Build APK trên commit trước của nhánh đã thành công qua GitHub Actions. Commit tách module này sẽ kích hoạt build mới; build thành công cũng chưa thay thế kiểm thử thao tác trên thiết bị thật.


## Module `pet-data.js`
- `window.GamePetData.rank(pet, level)`: chọn danh hiệu theo cấp linh thú, giữ nguyên quy tắc chặn cấp và tên dự phòng.
- `window.GamePetData.buff(pets, active)`: tính buff thuần cho 12 loại linh thú; `game.js` vẫn giữ trạng thái và side effects.
- Script được nạp trước `game.js`; bộ test Node kiểm tra thứ hạng, đủ 12 loại buff và trường hợp không có linh thú.


## Module `time-format.js`
- `window.GameTimeFormat.pad(n)`: đệm số về ít nhất hai chữ số.
- `formatDuration(seconds)`: giữ định dạng thời lượng `MM:SS` hoặc `H:MM:SS`.
- `toMinutes(value)` và `toClock(minutes)`: chuyển đổi chuỗi giờ `HH:MM` và tổng phút.
- `currentClock()`: đọc giờ/phút hiện tại theo local time.
- `game.js` giữ nguyên tên helper cũ qua alias để không phải sửa các call-site.


## Module tiến độ
- `www/js/progression-data.js` chứa các phép tính thuần: xếp loại điểm, chuẩn hóa tiến độ thiên kiếp, điểm người chơi/NPC và tiến độ đạo tâm. Module không đọc/ghi trạng thái game hoặc thao tác DOM.


## Module ngày tháng
- `www/js/date-data.js` cung cấp các hàm có thể kiểm thử với thời điểm đầu vào: ngày hiện tại theo độ lệch ngày trong game, lùi số ngày và ngày đầu tuần (thứ Hai).
- `game.js` chỉ giữ các wrapper gắn với trạng thái `S.dOff`; phép tính ngày được chuyển sang module độc lập, vẫn dùng local time và định dạng `sv` như trước.


## Công thức cảnh giới
- `GameProgressData.realmIndex(xp, realms)`: tìm cảnh giới có ngưỡng linh lực cao nhất không vượt quá XP.
- `GameProgressData.realmName(xp, realms)`: định dạng tên cảnh giới và tầng 1–9; cảnh giới cuối không chia tầng.
- `game.js` tiếp tục sở hữu bảng ngưỡng `RL`, chỉ chuyển phép tính thuần sang module; không thay đổi save schema hoặc luật chơi.
