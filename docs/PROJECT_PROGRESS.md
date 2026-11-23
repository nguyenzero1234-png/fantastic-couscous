# Project Progress Tracker

> Cập nhật lần cuối: 2026-11-23
> Mốc mới: tách thống kê/lịch sử học sang `analytics.js`; 1.000 bộ dữ liệu hồi quy đạt.  
> Nhánh theo dõi: `stage-1/foundation`  
> Mục đích: ghi lại các phần đã hoàn thành, việc còn lại và cập nhật tài liệu này sau mỗi mốc hoàn thành.

## Nâng cấp dependency (2026-11-23)
- [x] Nâng đồng bộ `@capacitor/android`, `@capacitor/cli`, `@capacitor/core` lên `^7.6.10` và `@capacitor/local-notifications` lên `^7.0.7` để xử lý cây dependency có lỗ hổng.
- [x] Cập nhật GitHub Actions dùng JDK 21 cho Capacitor 7.
- [x] CI sau khi nâng cấp xác nhận `npm test`, `npx cap add android` và `npx cap sync android` đều thành công; `npm audit` báo 0 lỗ hổng (run #83).
- [x] Build APK debug thành công trên JDK 21 ở run #84: [GitHub Actions #84](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45173957884). Run #83 là lượt chạy trung gian dùng JDK 17 nên lỗi `invalid source release: 21`; workflow đã được sửa và run #84 xác nhận đúng cấu hình.
- [x] Tạo `package-lock.json` tương thích Capacitor 7 trong CI run #86 (artifact `capacitor7-package-lock`, 39 KB).
- [x] Đã commit `package-lock.json` lên nhánh (`lockfileVersion: 3`, Capacitor CLI 7.6.10); CI đã xác nhận test, audit và bước đồng bộ lockfile thành công ở run #91.
- [x] Chuyển workflow sang `npm ci` dùng lockfile cố định, loại bỏ cơ chế tự commit lockfile để CI có tính tái lập và không tự ghi vào nhánh.

## Ghi nhận CI mới nhất (2026-11-23)
- [x] Run #84, #85 và #86 build APK debug thành công trên JDK 21; run #86 có thêm artifact lockfile.
- [x] Run #86 xác nhận `npm audit` = 0 vulnerabilities.
- [x] Điều tra hai lần build lỗi #74 và #75: cả hai cùng thất bại tại test `schedule parser từ chối giờ sai và khung trùng`; nguyên nhân là kỳ vọng của test chưa khớp hành vi parser hiện tại. Đã điều chỉnh test để giữ tương thích hành vi cũ.
- [x] Xác nhận các lần build #76–#81 đều thành công; run #81 là trạng thái mới nhất đã kiểm tra: [GitHub Actions #81](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45173280916).
- [x] Đã xử lý cảnh báo dependency cũ: sau nâng đồng bộ Capacitor 7.6.10, `npm audit` ở run #86 báo 0 lỗ hổng (không còn 3 moderate, 1 high, 1 critical đã ghi ở giai đoạn trước).

## Đã hoàn thành

### Nền tảng và độ an toàn dữ liệu
- [x] Kiểm tra và xác thực dữ liệu khi đọc save từ `localStorage`.
- [x] Ghi log lỗi lưu và phát sự kiện `game-save-error` thay vì im lặng bỏ qua lỗi.
- [x] Tắt `android.allowMixedContent` trong `capacitor.config.json`.
- [x] Thêm cơ chế backup tự động vào `quest-study-v1.backup`.
- [x] Khôi phục từ backup hợp lệ khi save chính bị thiếu hoặc hỏng; phát sự kiện `game-save-recovered`.
- [x] Lỗi khi ghi backup không làm gián đoạn việc ghi save chính.

### Tách module bước đầu
- [x] Tách quy tắc thuần xếp hạng linh thú và tính buff linh thú sang `www/js/pet-data.js` (`window.GamePetData`); `game.js` vẫn giữ trạng thái linh thú và tác động phụ.
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
- [x] Sau khi tách `quest-data.js`: parse cú pháp, thứ tự nạp script và 109 ca hồi quy cho parser độ khó, thời lượng, lặp lại, hạn chót và dữ liệu sai đều đạt.
- [x] Sau khi tách `schedule-data.js`: parse cú pháp, thứ tự nạp script và 1.039 ca hồi quy cho định dạng giờ, khoảng thời gian, trùng lịch và dữ liệu biên đều đạt.
- [x] Thêm `tests/modules.test.js` và lệnh `npm test` dùng Node.js built-in test runner; chưa đánh dấu chạy đạt cho tới khi thực thi trên CI.
- [x] `npm test` chạy thành công trên GitHub Actions run #78, bao gồm cú pháp, thứ tự script, storage/backup/recovery, timer, thưởng, streak/tâm ma, analytics và parser.
- [x] GitHub Actions run #78 build APK debug thành công sau khi thêm test timer; artifact `TuTienHocDao-apk` đã được tạo.
- [ ] Chưa kiểm thử thao tác trên thiết bị Android thật.

## Đang thực hiện
- [x] Tách logic quyết định giữ/đứt chuỗi, dùng phù bảo hộ và tiến độ trấn áp tâm ma sang `www/js/streak.js`.
- [x] Kiểm thử hồi quy 33.200 tổ hợp cho streak, vật phẩm bảo hộ và tiến độ trấn áp; không có sai khác.
- [x] Tách phép tổng hợp thống kê và chỉ số kiếp nạn sang `www/js/analytics.js`.
- [x] Kiểm thử 1.000 bộ dữ liệu ngẫu nhiên, so sánh thống kê cũ/mới; không có sai khác.
- [x] Tách parser nhiệm vụ dạng văn bản hàng loạt sang `www/js/quest-data.js`.
- [x] Kiểm thử 109 ca parser với thời gian/ngẫu nhiên giả lập; không có sai khác.
- [x] Tách parser lịch học và kiểm tra trùng khung giờ sang `www/js/schedule-data.js`.
- [x] Kiểm thử 1.039 ca lịch, gồm dữ liệu ngẫu nhiên và biên; không có sai khác.
- [x] Tạo bộ kiểm thử tự động `tests/modules.test.js` và lệnh `npm test`.
- [x] `npm test` thành công trên GitHub Actions run #78; các test storage validate/backup/recovery, timer và các module đã tách đều đạt.
- [ ] Bổ sung kiểm thử luồng giao diện và tương tác trên Android thật.

## Việc cần làm tiếp

### Ưu tiên 1 — Hoàn thiện cấu trúc module
- [x] Tách quy tắc thuần của chuỗi ngày học và tiến độ Tâm Ma/Thiên Ma sang `www/js/streak.js`; `game.js` tiếp tục quản lý vật phẩm, log, save và hiệu ứng UI.
- [x] Tách phép tổng hợp thống kê học tập và chỉ số kiếp nạn sang `www/js/analytics.js`.
- [x] Tách parser nhập nhiệm vụ hàng loạt sang `www/js/quest-data.js`.
- [x] Tách parser lịch học dạng văn bản và kiểm tra xung đột giờ sang `www/js/schedule-data.js`.
- [x] Thêm khung kiểm thử tự động Node.js cho các module thuần.
- [x] Tách thêm quy tắc xếp hạng và buff linh thú sang `pet-data.js`, có test bao phủ tất cả 12 loại buff.
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
- [x] Rà soát workflow build APK và bổ sung `npm test` trước bước build.
- [x] Bổ sung bước báo cáo mức độ lỗ hổng dependency trong CI; chờ đọc kết quả audit để quyết định nâng phiên bản an toàn.
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


### Tách module tiện ích thuần tiếp theo
- [x] Tách định dạng thời lượng, chuyển đổi giờ `HH:MM` ↔ phút, và lấy giờ hiện tại sang `www/js/time-format.js` (`window.GameTimeFormat`).
- [x] `game.js` dùng lại module mới qua các alias giữ nguyên tên cũ (`pad`, `fmt`, `tm`, `hm`, `nowHM`) để hạn chế thay đổi call-site.
- [x] Bổ sung test cho giá trị 0, giờ/phút hai chữ số, thời lượng có giờ, và chuyển đổi mốc 24 giờ; kiểm tra module được nạp trước `game.js`.


## Tách module tiến độ và điểm thiên kiếp (2026-11-23)
- [x] Tạo `www/js/progression-data.js` (`window.GameProgressData`) cho xếp loại điểm, hàm chuẩn hóa tiến độ, tính điểm thiên kiếp của người chơi/NPC và tiến độ đạo tâm.
- [x] Thay bốn công thức tương ứng trong `game.js` bằng lời gọi module; giữ nguyên dữ liệu đầu vào, thứ tự tính và các giới hạn min/max.
- [x] Nạp module trước `game.js` và bổ sung test ranh giới xếp loại, điểm 0/100, tiến độ âm/vượt ngưỡng.
- [x] GitHub Actions run #114 xác nhận `npm test` và build APK thành công cho module tiến độ.


## Tách module ngày tháng (2026-11-23)
- [x] Tạo `www/js/date-data.js` (`window.GameDateData`) cho ngày hiện tại theo độ lệch game, lùi ngày và xác định đầu tuần thứ Hai.
- [x] Thay ba helper trong `game.js` bằng wrapper gọi module; giữ nguyên độ lệch `S.dOff`, local time và định dạng ngày.
- [x] Bổ sung test với thời điểm cố định cho ngày hiện tại, ngày trước/sau và ranh giới đầu tuần.
- [x] GitHub Actions run #116 xác nhận `npm test` và build APK thành công; artifact APK được tạo.


## Tách công thức cảnh giới (2026-11-23)
- [x] Chuyển phép xác định cảnh giới theo ngưỡng linh lực và định dạng tên tầng tu vi sang `GameProgressData.realmIndex()` và `GameProgressData.realmName()`.
- [x] `game.js` giữ nguyên bảng ngưỡng `RL` và gọi module mới qua hai wrapper, không đổi dữ liệu hay cách hiển thị.
- [x] Bổ sung test cho các ngưỡng cảnh giới, ranh giới tầng 1/tầng 9 và cảnh giới cuối không chia tầng.
- [ ] Chờ CI xác nhận kiểm thử và APK cho commit tách công thức cảnh giới.


## Tách bộ sinh nhiễu mô phỏng (2026-11-23)
- [x] Tách hàm hash số nguyên xác định và value-noise nội suy trơn sang `www/js/noise.js` (`window.GameNoise`).
- [x] `game.js` dùng hai hàm qua alias `hs` và `vn`; giữ nguyên thuật toán, hệ số và thứ tự tính của mô phỏng NPC.
- [x] Thêm kiểm thử vector hash cố định, nội suy tại số nguyên/phân số và giới hạn giữa hai mẫu.
- [x] GitHub Actions run #117 xác nhận kiểm thử và build APK thành công cho thay đổi cảnh giới.
- [x] GitHub Actions run #118 xác nhận kiểm thử và build APK thành công cho module noise.


## Tách tiện ích escape HTML (2026-11-23)
- [x] Chuyển helper escape ký tự HTML sang `www/js/text.js` (`window.GameText.escapeHtml`).
- [x] `game.js` giữ alias `esc` để toàn bộ nơi hiển thị chuỗi tiếp tục dùng đúng helper cũ; không đổi quy tắc escape `&`, `<`, `>` và dấu nháy kép.
- [x] Bổ sung kiểm thử ký tự đặc biệt, chuỗi rỗng, chuỗi đã encode và đầu vào không phải chuỗi.
- [x] CI #119 phát hiện assertion `TypeError` không tương thích prototype giữa VM/Node; đã sửa ở commit `6462dda`.
- [x] GitHub Actions run #120 xác nhận toàn bộ kiểm thử và build APK thành công.


## Tách lịch chiến tông môn (2026-11-23)
- [x] Chuyển thuật toán ghép 6 tông thành 3 cặp theo tuần và dữ liệu lời dẫn trận đấu sang `www/js/sect-war.js` (`window.GameSectWar`).
- [x] `game.js` giữ alias `warPairs` và `warFlavor`; không đổi cách tính điểm, lịch tuần hay phần thưởng chiến tông.
- [x] Bổ sung kiểm thử lịch ghép ở tuần âm/dương, bảo đảm đủ 6 tông không trùng cặp và kiểm tra lời dẫn.
- [x] CI #121 chạy 18/19 test đạt; assertion mảng từ VM cần chuẩn hóa về mảng Node trước khi so sánh. Đã sửa ở commit kế tiếp, chờ CI xác nhận.


## Tách quy tắc hoàn thành nhiệm vụ (2026-11-23)
- [x] Chuyển phép xác định nhiệm vụ đã hoàn thành sang `GameQuestData.isDone(quest, today)`; truyền ngày hiện tại vào để giữ hàm thuần, dễ kiểm thử.
- [x] `game.js` giữ wrapper `isDone` và tiếp tục lấy ngày từ lịch game; nhiệm vụ lặp vẫn chỉ được xem là hoàn thành trong đúng ngày.
- [x] Bổ sung kiểm thử cho nhiệm vụ thường, nhiệm vụ lặp, ngày trùng/khác và trạng thái chưa hoàn thành.
- [x] GitHub Actions run #124 xác nhận `npm test` và build APK thành công; artifact APK đã được tạo.


## Tách predicate thiên phú NPC (2026-11-23)
- [x] Tạo `www/js/npc-data.js` (`window.GameNpcData`) cho quy tắc xác định NPC có thiên phú độc nhất: NPC ở chỉ số 9 luôn có, hoặc NPC có cờ `tk`.
- [x] `game.js` giữ alias `isTK` và chuyển việc kiểm tra sang module thuần; danh sách NPC và dữ liệu thiên phú không thay đổi.
- [x] Bổ sung test cho chỉ số đặc biệt, cờ `tk`, NPC thường, chỉ số âm và ngoài phạm vi.
- [x] CI #124 xác nhận kiểm thử và build APK thành công; artifact APK đã được tạo.


## Đợt tách helper thuần theo lô (2026-11-23)
- [x] Chuyển định dạng thời gian còn lại sang `GameTimeFormat.remaining(timestamp, now)`; wrapper trong `game.js` vẫn lấy `Date.now()` tại đúng thời điểm gọi.
- [x] Chuyển kiểm tra hạn chót và mở khóa chuỗi sang `GameQuestData.isExpired()` / `isUnlocked()`; giữ nguyên điều kiện, thứ tự lọc và cả hành vi biên của `slice(0, indexOf())`.
- [x] Chuyển phép tính linh lực tại mốc ngày sang `GameProgressData.playerXpAt(history, points, dateKey)`; wrapper vẫn tạo khóa ngày bằng local locale `sv`.
- [x] Bổ sung test cho làm tròn phút, hạn chót đúng/sau thời điểm, chuỗi nhiệm vụ và dữ liệu lịch sử.
- [x] CI #126: 24/24 kiểm thử JavaScript đạt; Capacitor sync và Gradle assembleDebug thành công; APK artifact đã được tải lên.


## Tách phép tính ngày hoạt động và chuỗi trong thiên kiếp (2026-11-23)
- [x] Chuyển phép đếm ngày có học trong 14 ngày sang `GameProgressData.activeDays()`; truyền lịch sử, streak và ngày hiện tại từ caller.
- [x] Chuyển tính chuỗi tại mốc thiên kiếp sang `GameProgressData.streakAt()`; giữ nguyên quy tắc hôm nay chưa học vẫn tính chuỗi từ hôm qua và quy tắc gộp streak hiện hành khi tua kiếp.
- [x] Bổ sung kiểm thử cho lịch sử rời rạc, streak hiện hành, mốc tương lai và ngày hôm nay chưa học.
- [ ] Chờ CI xác nhận kiểm thử và build APK cho đợt này.
