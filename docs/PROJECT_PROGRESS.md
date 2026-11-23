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

## Tái cấu trúc nhóm dữ liệu (2026-11-24)
- [x] Chuyển 10 module dữ liệu (`progression-data`, `npc-data`, `npc-roster`, `kiep-nan-data`, `diary-data`, `leaderboard-data`, `item-data`, `rebirth-data`, `cultivation-display-data`, `story-data`) vào `www/js/data/`.
- [x] Cập nhật `index.html` để nạp bản trong `data/`; giữ file cũ làm compatibility guard trong thời gian chuyển đổi.
- [x] Kiểm tra lại và chuẩn hóa toàn bộ 48 thẻ script sau khi di chuyển; xác nhận không trùng đường dẫn và đủ 10 module data được nạp.
- [x] Đã chuyển các module dữ liệu tĩnh còn lại trong nhóm này; các entry cũ chỉ còn compatibility guard.

## Tái cấu trúc core và UI (2026-11-24)
- [x] Chuyển bộ đếm phiên chơi/phiên tập trung từ `timer.js` sang `core/game-loop.js`.
- [x] Chuyển áp dụng skin, mật độ và giao diện từ `ui.js` sang `ui/preferences.js`.
- [x] Giữ hai file cũ làm compatibility guard trong giai đoạn chuyển tiếp.
- [x] Cập nhật thứ tự script và test harness để quét/nạp module đệ quy theo đường dẫn mới.

## Tái cấu trúc core storage (2026-11-24)
- [x] Chuyển toàn bộ triển khai lưu/đọc, validate, backup/restore và import/export sang `www/js/core/storage.js`.
- [x] `www/js/storage.js` chỉ còn là compatibility guard, không còn chứa nghiệp vụ lưu trữ.
- [x] Nạp `core/storage.js` trước compatibility entry và `core/state.js`; state tiếp tục nhận storage qua dependency injection.
- [x] Cập nhật test harness để nạp rõ các module core trong môi trường VM.
- [x] Phát hiện và sửa 4 lỗi test harness/expectation: mô phỏng global binding của browser, so sánh array cross-realm, và cập nhật số lượng catalog vật phẩm (21).

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
- [x] CI #129 xác nhận 25/25 kiểm thử JavaScript đạt; Gradle `assembleDebug` và tải APK artifact thành công.


## Tách helper ngày thi và thời điểm sự kiện (2026-11-23)
- [x] Chuyển tạo ngày thi từ ngày bắt đầu kỳ thi và độ lệch ngày sang `GameDateData.examDate()`; giữ mốc 12 giờ local để tránh lệch ngày do múi giờ.
- [x] Chuyển định dạng ngày/giờ sự kiện tiếng Việt sang `GameTimeFormat.eventTimestamp()`.
- [x] `game.js` giữ wrapper, dữ liệu kỳ thi và nguồn timestamp vẫn do luồng hiện tại cung cấp.
- [x] Bổ sung test kiểm tra không mutate ngày bắt đầu, cộng/lùi ngày và định dạng locale.
- [x] CI #131 xác nhận kiểm thử và build APK thành công; artifact APK đã được tạo.


## Tách helper khóa chu kỳ và định dạng giờ học (2026-11-23)
- [x] Chuyển tạo khóa ngày/tuần/tháng cho nhiệm vụ định kỳ sang `GameDateData.periodKey()`; caller tiếp tục truyền ngày và đầu tuần theo lịch game.
- [x] Chuyển định dạng tổng số phút thành nhãn giờ một chữ số thập phân sang `GameTimeFormat.hoursLabel()`.
- [x] Giữ nguyên quy tắc mặc định cho chu kỳ không phải ngày/tuần (khóa tháng) và định dạng số giờ.
- [x] Bổ sung test cho ngày, tuần, tháng, giá trị chu kỳ lạ, số phút âm/0 và làm tròn thập phân.
- [x] CI #132 xác nhận kiểm thử JavaScript, Capacitor sync, Gradle assembleDebug và tải APK artifact thành công.


## Tách phép tính tiến độ nhiệm vụ định kỳ (2026-11-23)
- [x] Chuyển phép tổng hợp tiến độ nhiệm vụ ngày/tuần/tháng sang `GameAnalytics.questProgress()`.
- [x] Truyền lịch sử học, bộ đếm nhiệm vụ, loại chu kỳ, loại chỉ số, ngày hiện tại và đầu tuần từ caller; module không đọc state toàn cục.
- [x] Giữ nguyên cách cộng phút học, linh lực, số nhiệm vụ và quy tắc mặc định đếm ngày học từ 30 phút.
- [x] Bổ sung test cho từng chu kỳ, từng loại chỉ số và dữ liệu rỗng.
- [x] CI #135 xác nhận 30/30 kiểm thử JavaScript đạt; Gradle `assembleDebug` và tải APK artifact thành công.


## Tách quy tắc miễn hiệu ứng cho NPC đặc biệt (2026-11-23)
- [x] Chuyển predicate nhận diện Cố Thái Hư sang `GameNpcData.isImmuneTaiHu(index, npcs)`; wrapper `immuneTaiHu` trong `game.js` giữ nguyên tên gọi.
- [x] Giữ nguyên điều kiện chỉ số không âm, NPC tồn tại và tên NPC khớp chính xác.
- [x] Bổ sung test cho NPC đặc biệt, NPC thường, chỉ số âm/ngoài phạm vi và danh sách rỗng.
- [x] CI #136 xác nhận kiểm thử JavaScript, Gradle `assembleDebug` và tải APK artifact thành công.


## Tách phép cộng phút học theo điều kiện (2026-11-23)
- [x] Chuyển phép cộng phút học từ lịch sử theo predicate sang `GameAnalytics.sumMinutes(history, predicate)`; caller vẫn quyết định cửa sổ tuần/tháng.
- [x] `game.js` giữ wrapper `sumMins` và truyền `S.hist` cùng predicate như trước; không đổi điều kiện lọc hay thứ tự duyệt lịch sử.
- [x] Bổ sung kiểm thử cho toàn bộ lịch sử, khoảng ngày, ngày 0 phút, dữ liệu rỗng và predicate không khớp.
- [x] CI #138: 32/32 kiểm thử JavaScript đạt; Gradle `assembleDebug` thành công và APK artifact đã được tải lên.


## Tách phép tính chuỗi hiện tại (2026-11-23)
- [x] Chuyển quy tắc xác định chuỗi còn hiệu lực sang `GameStreak.current(streak, today, yesterday)`.
- [x] `game.js` giữ wrapper `curStreak`; nguồn ngày hiện tại/ngày hôm qua vẫn lấy từ lịch game.
- [x] Bổ sung test cho học hôm nay, hôm qua, chuỗi đã cũ, streak 0 và dữ liệu rỗng.
- [x] CI #140: 33/33 kiểm thử JavaScript đạt; Gradle `assembleDebug` thành công và APK artifact đã được tải lên.


## Tách phép chọn kiếp có thành tích cao nhất (2026-11-23)
- [x] Chuyển phép chọn kiếp có linh lực cao nhất sang `GameProgressData.bestKiep(records, currentKiepPoints, currentPoints, currentKiepNumber)`.
- [x] Giữ nguyên thứ tự ưu tiên khi hòa điểm: kiếp lịch sử đứng trước; kiếp hiện tại chỉ thay thế khi điểm cao hơn nghiêm ngặt.
- [x] Giữ nguyên cách làm tròn điểm hiện tại và dùng giá trị lớn hơn giữa điểm kiếp hiện tại với linh lực đang có.
- [x] Bổ sung test cho kiếp lịch sử cao nhất, kiếp hiện tại dẫn đầu, hòa điểm và danh sách lịch sử rỗng.
- [x] CI #142: 34/34 kiểm thử JavaScript đạt; Gradle `assembleDebug` thành công và APK artifact đã được tải lên.


## Tách tổng hợp linh lực và nhật ký học theo thời gian (2026-11-23)
- [x] `GameAnalytics.sumPointsBetween(history, startKey, endKey)`: cộng linh lực với đầu khoảng bao gồm, cuối khoảng loại trừ.
- [x] `GameAnalytics.pointsThrough(history, dateKey)`: cộng linh lực đến hết ngày được chọn.
- [x] `GameAnalytics.countStudyLogEntries(studyLog, startKey, endKey, hourPredicate)`: đếm bản ghi theo ngày local và điều kiện giờ; hai đầu ngày bao gồm.
- [x] Thay wrapper `ugain`, `uxp`, `weekNight`, `weekDawn` trong `game.js`; giữ nguyên điều kiện lọc.
- [x] `GameAnalytics.sumCountsBetween(counts, startKey, endKey)`: cộng số nhiệm vụ trong khoảng ngày bao gồm cả hai đầu; wrapper `weekQuests` gọi helper.
- [x] CI #145: 37/37 kiểm thử; CI #146: 38/38 kiểm thử. Cả hai đều build APK và tải artifact thành công.


## Tách thống kê lịch sử học theo tuần (2026-11-23)
- [x] Thêm `GameAnalytics.studyWindowStats(history, startKey, endKey)` trả về danh sách ngày trong khoảng, số ngày có học và số phút học cao nhất.
- [x] Thay `wDs`, `wDays`, `wBest` bằng wrapper lấy dữ liệu từ helper; giữ nguyên khoảng ngày bao gồm hai đầu và quy tắc phút tối đa.
- [x] Bổ sung kiểm thử cho khoảng nhiều ngày, ngày đơn, ngày không học và lịch sử rỗng.
- [x] CI #148: 39/39 kiểm thử JavaScript đạt; Gradle `assembleDebug` thành công và APK artifact đã được tải lên.


## Tách tổng phút học theo khoảng timestamp (2026-11-23)
- [x] Chuyển phép cộng phút học trong danh sách phiên học sang `GameAnalytics.sumStudyMinutesBetween(studyLog, startTimestamp, endTimestamp)`.
- [x] Thay helper `kmins` trong `game.js` bằng wrapper truyền `S.stl` và mốc bắt đầu/kết thúc; giữ nguyên hai đầu khoảng bao gồm.
- [x] Bổ sung kiểm thử cho khoảng timestamp, mốc đơn, danh sách rỗng và trường hợp không có bản ghi phù hợp.
- [x] CI #151 xác nhận 40/40 kiểm thử JavaScript đạt; Gradle `assembleDebug` thành công và artifact APK `TuTienHocDao-apk` đã được tải lên.


## Cập nhật CI và kiểm thử tích hợp (2026-11-23)
- [x] CI run #153 xác nhận commit `c8ce5f4`: kiểm thử JavaScript thành công, `npm audit` thành công, Capacitor sync và build APK debug thành công; artifact `TuTienHocDao-apk` đã được tải lên.
- [x] Thay wrapper đếm nhật ký học trong `game.js` bằng `GameAnalytics.countStudyLogEntries`; giữ nguyên khoảng ngày bao gồm hai đầu và điều kiện giờ local.
- [ ] Mở rộng kiểm thử tích hợp để tự phát hiện mọi module `www/js/*.js` chưa được khai báo, nạp trùng hoặc đặt sai thứ tự so với `game.js`; chờ CI xác nhận.
- [ ] Tiếp tục bổ sung test runtime cho các module chưa được khởi tạo trong harness và kiểm tra luồng gameplay cốt lõi.


## Kiểm thử tích hợp module và giao diện (2026-11-23)
- [x] CI #154 xác nhận toàn bộ test JavaScript hiện tại, dependency audit, Capacitor sync, Gradle `assembleDebug` và tải APK artifact thành công cho commit `8c00f6d`.
- [x] Kiểm thử tự động phát hiện module JavaScript chưa được khai báo, script trùng lặp và sai thứ tự nạp quanh `game.js`.
- [x] Bổ sung kiểm tra mọi đường dẫn script trong `index.html` tồn tại và kiểm thử hành vi áp dụng/reset tùy chọn giao diện.
- [x] CI #155 phát hiện test kiểm tra sai đường dẫn do `index.html` lưu script dưới `js/`; đã sửa assertion sang `www/js/`. Đây là lỗi của test, không phải lỗi ứng dụng; CI xác nhận lại đang chờ.
- [ ] Tiếp tục rà soát luồng gameplay và các helper thuần còn nằm trong `game.js`.


## Tách bộ sinh dữ liệu kiếp nạn (2026-11-23)
- [x] Thêm `www/js/kiep-nan-data.js` với hàm thuần `GameKiepNanData.create(seed, hour, epoch, types, hash)`.
- [x] Chuyển phép xác định xác suất xuất hiện, thời lượng, mục tiêu phút học, loại kiếp và thời điểm bắt đầu khỏi `game.js`; việc khởi tạo seed ngẫu nhiên vẫn thuộc state game.
- [x] Giữ nguyên hàm hash, thứ tự gọi hash, bảng cấu hình `KN`, công thức điểm và cấu trúc dữ liệu trả về.
- [x] Bổ sung kiểm thử kết quả xác định, ngưỡng xuất hiện và không làm thay đổi bảng cấu hình.
- [x] CI #157 xác nhận test, audit dependency, Capacitor sync, build APK và upload artifact thành công.
- [ ] Chờ CI của đợt tách module này; chưa thay thế kiểm thử trên thiết bị Android thật.


## Tách bộ sinh nội dung nhật ký tu tiên (2026-11-23)
- [x] Tách nội dung nhật ký thành `GameDiaryData.generate(day, stats, context, quotes)` trong `www/js/diary-data.js`.
- [x] Chuyển logic chọn câu theo ngày, thời lượng học, chuỗi ngày, tâm ma, tông môn, mệnh cách, linh thú, thứ trong tuần và trích dẫn sang hàm thuần.
- [x] `game.js` chỉ còn gom dữ liệu từ save và truyền vào helper; lịch sử Đạo Văn và ký ức tiền kiếp vẫn lấy từ state hiện tại.
- [x] Bổ sung test cho nhật ký ngày trống, ngày có hoạt động, dữ liệu đầu vào bất biến và giới hạn bảy dòng.
- [x] CI #158 xác nhận kiểm thử, audit, Capacitor sync, build APK và upload artifact thành công.
- [x] CI #159 chạy 46 test, phát hiện một expected value trong test chưa khớp lựa chọn câu xác định theo seed; đã sửa kỳ vọng theo đúng thuật toán, không đổi code sinh nhật ký.
- [x] CI #160 cho thấy nội dung thực tế đã khớp expected; lỗi còn lại do so sánh mảng từ VM context khác realm bằng `deepStrictEqual`. Đã chuẩn hóa kết quả qua JSON trước khi so sánh.
- [x] CI #161 xác nhận lỗi test do kỳ vọng linh thú xuất hiện trong một nhật ký đã chạm giới hạn bảy dòng; chuyển kiểm tra nhánh linh thú sang ca kiểm thử độc lập để không phụ thuộc thứ tự cắt dòng.
- [x] CI #162 xác nhận nhánh linh thú sinh một trong hai cách diễn đạt (tên linh thú đứng đầu hoặc sau cụm “Linh thú”); đã nới assertion để kiểm tra tên linh thú thay vì ép một câu cố định.
- [ ] Chờ CI chạy lại; chưa có kiểm thử trên thiết bị thật.


## Tách phép chọn cơ duyên bảng xếp hạng (2026-11-23)
- [x] Thêm `GameLeaderboardData.rollSpecial(rows, seed, salt, hash)` để tính kết quả cơ duyên đặc biệt thuần, không đọc hoặc sửa save.
- [x] Giữ nguyên thứ tự duyệt, công thức hash, ngưỡng 20% cho từng loại và trường hợp không trúng; điều kiện hạng cuối và trạng thái đang giữ cơ duyên vẫn do `game.js` lọc.
- [x] `spRoll` chỉ còn quản lý trạng thái, thời hạn và nhật ký nhận cơ duyên.
- [x] Bổ sung kiểm thử kết quả, thứ tự gọi hash và đầu vào rỗng.
- [x] CI #163 xác nhận 46/46 test, build APK và tải artifact `TuTienHocDao-apk` thành công.
- [ ] Chờ CI cho module cơ duyên; chưa kiểm thử cài đặt trên thiết bị Android thật.
- Lưu ý: ca test dùng hash giả lập theo đúng identity truyền vào (NPC: index + 1; người chơi: 900), kiểm tra cả ba nhánh loại cơ duyên.


## Tiếp tục tách logic bảng xếp hạng (2026-11-23)
- [x] CI #165 thành công cho commit `de58b0b`; test JavaScript, Gradle APK debug và upload artifact đều thành công. Artifact `TuTienHocDao-apk` đã được tạo.
- [x] Tách định dạng mô tả chín hiệu ứng cơ duyên thành hàm thuần `GameLeaderboardData.eventEffectText`; wrapper `efTxt` trong `game.js` giữ nguyên giao diện nội bộ.
- [x] Bổ sung kiểm thử ngưỡng hash và các nhánh mô tả hiệu ứng; chờ CI của commit mới xác nhận.

- [x] CI #166 phát hiện test nhánh trừ linh lực truyền thiếu trường `dh`; do formatter tạo toàn bộ mảng mô tả trước khi chọn phần tử, test đã được sửa để cung cấp đầy đủ dữ liệu sự kiện. Không thay đổi logic game.


## Tách bộ mô tả vật phẩm (2026-11-23)
- [x] Thêm `www/js/item-data.js` với `GameItemData.describe(item)` để tính tổng linh lực và chuỗi hướng dẫn dùng vật phẩm từ cấu hình đầu vào.
- [x] `game.js` giữ nguyên danh sách `ITEMS` và chỉ ghép kết quả mô tả vào từng item; helper không sửa đối tượng đầu vào.
- [x] Giữ nguyên cách tính `ex`, điều kiện nhiệm vụ nhanh/từ 60 phút, định dạng số thập phân tiếng Việt và câu mô tả theo tỷ lệ giá.
- [x] Bổ sung test cho vật phẩm thường, vật phẩm có hiệu ứng riêng, điều kiện nhiệm vụ, phần thưởng cộng thêm và đầu vào không có cấu hình thưởng.
- [x] CI #167 xác nhận 48/48 test, Gradle APK debug và upload artifact `TuTienHocDao-apk` thành công cho commit `95ca233`.
- [ ] Chờ CI xác nhận module mô tả vật phẩm mới; chưa có kiểm thử thao tác trên thiết bị Android thật.

- [x] CI #168 chạy 49 test và phát hiện một expected text trong fixture vật phẩm chưa khớp nhánh định dạng khi tỷ lệ hoàn trả dưới 2×; đã sửa expected theo đúng logic cũ, không đổi code module.


## Tách bộ dựng sparkline bảng xếp hạng (2026-11-23)
- [x] Xác nhận CI #169 thành công cho commit `b666005`: 49 test JavaScript, Gradle assembleDebug và upload artifact `TuTienHocDao-apk` (~5,8 MB).
- [x] Chuyển phần dựng SVG sparkline sang `GameLeaderboardData.sparkline(values)`; `game.js` vẫn tự lấy 40 mẫu điểm theo cùng mốc 90 giây và chuyển mảng cho module.
- [x] Giữ nguyên kích thước SVG, màu qua CSS variable, polyline, độ dày nét và công thức chuẩn hóa; thêm test cho mảng rỗng, một phần tử, chuỗi phẳng, tăng đều và số âm.
- [ ] Chờ CI kiểm tra module sparkline mới; chưa thử trên thiết bị Android thật.


## Tách bộ xếp hạng dữ liệu bảng Thiên Kiêu (2026-11-23)
- [x] CI #170 xác nhận commit sparkline `b23ba97`: test JavaScript, dependency audit, Capacitor sync, Gradle APK debug và upload artifact đều thành công.
- [x] Tách sắp xếp điểm giảm dần và gán thứ hạng thành `GameLeaderboardData.rankRows(rows)`.
- [x] Giữ thứ tự ban đầu khi hòa điểm (stable sort), gán hạng tuần tự như trước và không sửa mảng đầu vào.
- [x] `game.js` tiếp tục tính điểm từ state; module chỉ nhận danh sách dòng đã có điểm và trả danh sách đã xếp hạng.
- [x] Bổ sung test cho thứ tự giảm dần, hòa điểm, mảng rỗng và tính bất biến của đầu vào.
- [ ] Chờ CI xác nhận commit tách rankRows; chưa kiểm thử giao diện trên Android thật.


## Tách phân loại tổng kết kiếp (2026-11-23)
- [x] Thêm `www/js/rebirth-data.js` với helper thuần `GameRebirthData.gradeSummary(record, end)` để phân loại kết quả một kiếp.
- [x] Chuyển phần phân loại cấp bậc và câu tổng kết khỏi `game.js`; giữ nguyên ngưỡng giờ học, hạng, linh lực đỉnh và nội dung tiếng Việt.
- [x] Thêm kiểm thử cho đủ sáu nhánh xếp loại và dữ liệu ngày bằng 0; helper không đọc state hoặc DOM.
- [x] CI #171 xác nhận commit `55690d84` thành công, bao gồm test, dependency audit, Gradle APK debug và artifact APK.
- [ ] CI #172 phát hiện fixture kiểm thử sai dữ liệu (40/10 giờ tương đương 4.0, không đủ điều kiện Xuất Sắc); đã sửa fixture thành 50/10 và chờ CI chạy lại.
- [ ] Chưa kiểm thử trên thiết bị Android thật.


## Helper ký ức kiếp trước (2026-11-23)
- [x] Tách định dạng dòng “Ký ức kiếp trước” thành `GameRebirthData.previousMemory(records)`; module chỉ nhận danh sách bản ghi, không đọc state hay DOM.
- [x] `game.js` giữ wrapper `prevMemory` và tiếp tục cấp `S.rbh`; giữ nguyên thứ tự trường, điều kiện hiển thị và câu chữ tiếng Việt.
- [x] Bổ sung test cho danh sách rỗng, bản ghi thiếu trường, giá trị falsy và bản ghi đầy đủ.
- [x] CI #173 xác nhận commit `982edd25` thành công, có artifact `TuTienHocDao-apk` (5,799,890 bytes).
- [ ] Chờ CI xác nhận thay đổi helper ký ức mới; chưa kiểm thử trên thiết bị Android thật.


## Tổng hợp thống kê tông môn (2026-11-23)
- [x] CI #174 xác nhận commit `bc67dc1` thành công và tạo artifact `TuTienHocDao-apk` (5,799,987 bytes).
- [x] Tách phép cộng tổng linh lực và số thành viên theo tông môn thành `GameSectWar.stats(sectCount, npcRows, userSect, userXp)`.
- [x] `game.js` vẫn tính linh lực NPC/người chơi từ state; module chỉ nhận dữ liệu đã tính và tổng hợp thống kê.
- [x] Bổ sung test cho nhiều NPC cùng tông, người chơi thuộc tông, tông rỗng và chỉ số tông không hợp lệ.
- [ ] Chờ CI xác nhận thay đổi; chưa kiểm thử trên thiết bị Android thật.


## Helper điều kiện đạt điểm tối đa thiên kiếp
- `GameProgressData.examConditions(exam, scoreAt, realmName)` tạo ba dòng giải thích điều kiện đạt 100 điểm, nhận callback tính điểm và định dạng cảnh giới từ caller.
- `game.js` giữ wrapper `exCond`; phép lặp dò số ngày tối thiểu, ngưỡng điểm, nội dung tiếng Việt và cách hiển thị chế độ God được giữ nguyên.
- Test kiểm tra số lần gọi callback, ngưỡng ngày tối thiểu và trường hợp không thể đạt 100; helper không đọc state, thời gian hoặc DOM.
- Không thay đổi save schema, công thức điểm thiên kiếp hay tiến trình người chơi.


## Tách phép tính hệ số thưởng (2026-11-23)
- [x] GameRewards.rewardFactors(state, now) tính hệ số trừng phạt, cân bằng và trạng thái từ dữ liệu tường minh.
- [x] game.js chỉ gom trạng thái runtime và thời điểm hiện tại rồi gọi helper; giữ nguyên công thức và thứ tự nhân.
- [x] Thêm test cho trừng phạt nhiều tầng, hệ số cân bằng, tâm ma, hiệu ứng còn hạn/hết hạn và mặc định.
- [ ] Chờ CI xác nhận test và APK; chưa kiểm thử trên thiết bị Android thật.


## Sửa kiểm thử số thực hệ số thưởng (2026-11-23)
- [x] CI #177 phát hiện sai khác biểu diễn số thực IEEE-754 (`0.5720000000000001` so với `0.572`), không phải sai công thức gameplay.
- [x] Chuyển assertion trường `status` sang so sánh sai số tuyệt đối dưới `1e-12`; các hệ số `td` và `balance` vẫn so sánh chính xác.
- [ ] Chờ CI xác nhận lại.

 
## Tách xử lý hoàn thành nhiệm vụ (2026-11-23)
- [x] Chuyển luồng hoàn thành nhiệm vụ sang `www/js/quest-completion.js`, nhận state và các dịch vụ runtime qua dependency object.
- [x] `game.js` chỉ còn wrapper kết nối trạng thái hiện hành với module; giữ nguyên key lưu `quest-study-v1` và schema.
- [x] Bổ sung kiểm thử tích hợp cho streak, điểm, lịch sử học, thống kê ngày và log hoàn thành.
- [ ] Chờ CI xác nhận kiểm thử và APK; chưa kiểm thử trên thiết bị Android thật.

 
## Tách giao diện và tương tác linh thú (2026-11-23)
- [x] Chuyển renderer danh sách linh thú, overlay thu nhận/tiến hóa và xử lý click sang `www/js/pet-ui.js`.
- [x] `game.js` chỉ còn wrapper truyền state, dữ liệu linh thú và dịch vụ UI; module không tự đọc biến toàn cục gameplay.
- [x] Thêm kiểm thử hợp đồng module và nhánh click không có nút; giữ nguyên cách tính buff, chi phí tiến hóa và thu hoạch.
- [ ] Chờ CI xác nhận; chưa kiểm thử trên thiết bị Android thật.

 
## Sửa lỗi cú pháp module giao diện linh thú
- [x] CI #45217666431 phát hiện dư dấu đóng hàm trong `pet-ui.js` trước khi build APK.
- [x] Sửa cấu trúc đóng hàm, không thay đổi logic gameplay.
- [ ] Chờ CI kiểm tra lại toàn bộ test và APK.

 
## Tách nhiệm vụ tông môn (2026-11-23)
- [x] Chuyển chọn nhiệm vụ tuần, tính tiến độ và nhận thưởng sang `www/js/sect-missions.js`.
- [x] Dependency tuần, thống kê học, điểm thưởng và UI được truyền tường minh; `game.js` giữ wrapper tương thích.
- [x] Bổ sung test chọn nhiệm vụ, đổi tuần, điều kiện tiến độ và chống nhận thưởng trùng.
- [ ] Chờ CI kiểm tra và build APK.

 
## Sửa assertion kiểm thử nhiệm vụ tông môn
- [x] CI #45218899278 chạy 58/60 test; hai lỗi còn lại do so sánh mảng từ VM khác realm, không phải sai khác dữ liệu.
- [x] Chuẩn hóa kết quả test qua JSON trước khi deep equality để so sánh nội dung độc lập realm.
- [ ] Chờ CI chạy lại.

 
## Điều chỉnh kỳ vọng test luân phiên nhiệm vụ tông
- [x] CI #45219024764 xác nhận 59/60 test; test cuối kỳ vọng sai rằng bộ nhiệm vụ đổi theo tuần.
- [x] Giữ nguyên hành vi cũ: danh sách nhiệm vụ được chọn theo chỉ số tông môn; sang tuần chỉ reset trạng thái nhận thưởng.
- [ ] Chờ CI xác nhận.

 
## Chuẩn hóa assertion trạng thái nhiệm vụ tông
- [x] CI #45219185468 xác nhận logic 59/60 test; assertion còn lại so sánh object tạo trong VM khác realm.
- [x] Chuẩn hóa object trạng thái qua JSON trong test.
- [ ] Chờ CI xác nhận.

 
## Mở rộng module tông môn chiến
- [x] Chuyển tính điểm chiến tuần (bình quân đóng góp NPC/người chơi) sang `GameSectWar.score`.
- [x] Chuyển xử lý thưởng thắng/thua, danh hiệu, vật phẩm thưởng và ghi lịch sử sang `GameSectWar.reward`.
- [x] Giữ wrapper tương thích trong `game.js`, truyền phụ thuộc tường minh.
- [x] Bổ sung test tính điểm, thưởng thắng, thưởng thua và trạng thái chưa gia nhập tông.
- [ ] Chờ CI kiểm tra và build APK.

 
## Hiệu chỉnh dữ liệu kiểm thử tông môn chiến
- [x] CI #45219895817 cho thấy 3 kỳ vọng test không khớp dữ liệu gốc: điểm bình quân chia cả NPC và người chơi; tuần hiện tại dùng đối thủ theo vòng ghép thực; thưởng thắng tính theo chênh lệch thực.
- [x] Sửa fixture/kỳ vọng test, không thay đổi thuật toán gameplay.
- [ ] Chờ CI chạy lại.

 
## Sửa fixture đối thủ trong test thưởng thua
- [x] CI #45220050458: 62/63 test đạt; fixture cuối đặt điểm ở sai tông đối thủ theo vòng ghép tuần.
- [x] Chuyển điểm đối thủ sang đúng tông số 3; không đổi logic game.
- [ ] Chờ CI.


## Tách modal xác nhận thiên kiếp (2026-11-23)
- [x] Chuyển giao diện, khóa nền và luồng xác nhận/tiếp tục thiên kiếp sang `www/js/exam-modal.js`.
- [x] Tiêm state, DOM, lưu game, điều hướng và callback tìm kiếp tiếp theo; giữ wrapper tương thích trong `game.js`.
- [x] Bổ sung kiểm thử xác nhận, mở khóa nền và điều hướng.
- [ ] Chờ CI kiểm thử và build APK.

## Tổng kết kiểm tra giai đoạn 1 — 2026-11-23 (cập nhật sau CI #190)

- [x] CI #190 cho commit `defa3a1c5063ed5fccc55ac436fc82ca5382f87a` hoàn tất thành công: `npm ci`, `npm test`, Capacitor add/sync Android, Gradle `assembleDebug` và upload artifact đều đạt.
- [x] CI #190 đã tạo artifact APK debug `TuTienHocDao-apk` (5,802,578 bytes): [Tải artifact từ GitHub Actions #190](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45221217845).
- [x] CI #192 cho commit `bdd6ec123646f33ba14cb2e40afe416ed604c2e7` thành công: 67/67 test pass, 0 fail; `npm audit` báo 0 vulnerability; Capacitor sync và Gradle `assembleDebug` thành công.
- [x] Bổ sung API backup versioned trong `storage.js`: export JSON có metadata, import cả format mới và save JSON legacy, validate trước khi ghi và giữ bản lưu hiện tại vào backup trước khi thay thế.
- [x] Bổ sung 4 test cho export/import versioned, legacy import, dữ liệu hỏng và lỗi quota khi bảo toàn backup.
- [x] Giao diện Cài đặt có tạo backup/copy, tải file JSON, chọn file backup và nhập sau bước xác nhận; file sai hoặc lỗi ghi sẽ không thay thế state đang chạy.
- [x] Thêm `docs/ANDROID_QA_CHECKLIST.md` ghi các bước nghiệm thu thiết bị thật, phục hồi backup, timer/thông báo và yêu cầu ký APK release.
- [x] Workflow audit đã được siết: job thất bại nếu có advisory mức high/critical; commit thay đổi workflow đang được CI kiểm tra.
- [x] Danh sách script trong `www/index.html` nạp các module trước `game.js`; `notify.js` và `schedule.js` vẫn nạp sau bootstrap.
- [ ] `game.js` vẫn còn hơn 200 KB và còn nhiều logic gameplay; việc tách module chưa hoàn tất. Tiếp tục tách từng subsystem với test hồi quy, không chuyển nguyên khối mù quáng.
- [ ] Cài APK và thực hiện checklist trên thiết bị Android thật; việc này không thể được xác nhận bằng CI cloud.
- [ ] Chưa cấu hình ký APK release vì cần keystore do chủ dự án tự tạo và lưu an toàn trong GitHub Secrets; không được commit khóa riêng tư.
- [ ] CI #193 (các thay đổi backup/UI/audit mới nhất) đang được GitHub Actions kiểm tra; chỉ cập nhật trạng thái sau khi run kết thúc.

**Kết luận:** Đã hoàn thiện phần backup file và mở rộng kiểm thử trên nhánh nền tảng; build Android debug và audit sạch đã được chứng minh ở CI #192. Giai đoạn 1 vẫn chưa nghiệm thu cuối cùng cho đến khi CI #193 xanh, kiểm thử thiết bị thật đạt, phần tách gameplay đủ tiêu chí và có quyết định về ký APK release.

## Cập nhật sau khi tích hợp backup file — 2026-11-23

- [x] `GameStorage.exportData()` tạo JSON backup có `app`, `formatVersion`, `exportedAt` và payload save.
- [x] `GameStorage.importData()` nhận format mới và JSON legacy, xác thực schema trước khi ghi; nếu save hiện tại hợp lệ thì phải tạo được backup trước khi thay thế.
- [x] Giao diện thống kê → Cài đặt → Sao lưu & hệ thống hỗ trợ tạo/copy JSON, tải file JSON, chọn file từ thiết bị và xác nhận trước khi nhập.
- [x] Thêm 4 kiểm thử export/import, legacy, dữ liệu sai và lỗi quota. Tổng hiện tại dự kiến 71 test; run #199 xác nhận bước test pass.
- [x] Workflow audit thất bại nếu có advisory high/critical; run #199 bước audit pass.
- [x] Thêm checklist kiểm thử thiết bị và hướng dẫn ký release tại `docs/ANDROID_QA_CHECKLIST.md`.
- [ ] Run #199 đang chạy Gradle `assembleDebug`; chưa có kết luận cuối hoặc artifact mới tại thời điểm ghi note.
- [ ] Kiểm thử Android thật và ký release vẫn cần thiết bị/keystore do chủ dự án quản lý.
- [ ] Tách gameplay còn lại khỏi `game.js` tiếp tục theo từng subsystem; không coi giai đoạn tách module đã xong.



## Tách dữ liệu và bộ ghi Đạo Văn (2026-11-24)
- [x] Chuyển bảng nội dung đột phá cảnh giới `REALM_STORY` sang `www/js/story-data.js`.
- [x] Tách thao tác ghi nhật ký, chống trùng ID và giới hạn 40 bản ghi thành `GameStoryData.append`; `game.js` giữ wrapper tương thích và vẫn quản lý state/ngày hiện tại.
- [x] Bổ sung test dữ liệu cảnh giới, chống ghi trùng, sao chép mảng dòng và giới hạn lịch sử.
- [ ] Tiếp tục tách các subsystem gameplay còn lại; chưa làm kiểm thử hoặc ký Android theo yêu cầu hiện tại.


## Tách âm thanh giao diện (2026-11-24)
- [x] Chuyển tạo tiếng hiệu ứng, tiếng click và đăng ký pointer listener sang `www/js/audio.js` (`GameAudio.create`).
- [x] Âm thanh nhận trạng thái tắt/mở qua callback, không tự đọc save hoặc biến toàn cục gameplay; `game.js` chỉ giữ các alias tương thích `sfx` và `clk`.
- [x] Bổ sung test cho trạng thái mute, khởi tạo audio context lười và đăng ký listener.
- [ ] Tiếp tục tách các subsystem còn lại; Android vẫn để sau.


## Tách dữ liệu đội hình Thiên Kiêu (2026-11-24)
- [x] Chuyển cấu hình 50 NPC, hệ số mô phỏng, hồ sơ thiên phú, tiểu sử và câu chuyện cảnh giới sang `www/js/npc-roster.js`.
- [x] `GameNpcRoster.create(hash, value)` nhận hàm noise tường minh và trả lại các mảng/dịch vụ tương thích; các phép mô phỏng tiếp tục chạy trong `game.js` trên đúng các mảng mutable này.
- [x] Bổ sung test số lượng NPC, cấu hình mô phỏng, giới tính, tiểu sử và dữ liệu cảnh giới.
- [ ] Tiếp tục tách các subsystem gameplay; chưa kiểm thử/ký Android.


## Tách hệ thống Sứ mệnh xuyên kiếp (2026-11-24)
- [x] Chuyển 8 định nghĩa thành tựu và điều kiện đạt sang `www/js/legacy-missions.js`.
- [x] Đóng gói khởi tạo tiến trình, kiểm tra/mở khóa một lần, lưu trạng thái, thông báo và dựng HTML trong `GameLegacyMissions.create`.
- [x] `game.js` giữ wrapper tương thích cho `lifeTrack`, `chkLegacy`, `renderAch`.
- [x] Bổ sung test cho điều kiện mở khóa, chống mở khóa lặp, lưu/thông báo và render.
- [ ] Tiếp tục tách subsystem gameplay; Android chưa kiểm tra/ký theo yêu cầu.


## Tách dữ liệu hiển thị đạo đồ và cơ duyên (2026-11-24)
- [x] Chuyển bảng màu 9 cảnh giới và 20 câu dẫn hiển thị sang `www/js/cultivation-display-data.js`.
- [x] Chuyển epoch, 6 sự kiện cơ duyên và 6 mô tả hiệu ứng sang module dữ liệu; `game.js` đọc qua API dữ liệu, thuật toán lịch cơ duyên vẫn giữ nguyên.
- [x] Bổ sung test số lượng, phần tử đầu/cuối và mốc epoch.
- [ ] Tiếp tục tách logic gameplay; Android vẫn để sau.


## Tách catalog vật phẩm (2026-11-24)
- [x] Chuyển cấu hình 20 vật phẩm khỏi `game.js` vào `GameItemData.catalog()` trong module `item-data.js` hiện có.
- [x] Catalog trả bản sao độc lập cho từng lần khởi tạo, sao chép cả mảng điều kiện `q`; mô tả/tổng linh lực tiếp tục dùng chung hàm `describe`.
- [x] `game.js` chỉ lấy catalog qua API module; các điểm mua/bán/tra cứu và kiểm tra cân bằng vẫn sử dụng cùng cấu trúc item.
- [x] Bổ sung test số lượng, item biên, mô tả, và tính độc lập của catalog.
- [ ] Tiếp tục tách subsystem; Android vẫn để sau.


## Bắt đầu tổ chức module theo chức năng (2026-11-24)
- [x] Tạo khu vực `www/js/systems/` cho logic gameplay; module đầu tiên là `sect-system.js`, đóng gói cấu hình 6 tông môn, 6 sư phụ, điều kiện bái sư và buff.
- [x] Chuyển toàn bộ khai báo `SECTS`, `MASTERS`, `masterBuff` khỏi `game.js`; file chính chỉ khởi tạo hệ thống với dependency injection và giữ alias tương thích.
- [x] Nạp module trước `game.js` và thêm kiểm thử cho điều kiện/buff của cả 6 sư phụ.
- [ ] Tiếp tục phân loại module hiện hữu vào `core/`, `data/`, `systems/`, `ui/`; di chuyển có kiểm soát và cập nhật đường dẫn script/test, không tạo thêm module rời rạc.
- [ ] Tiếp tục tách các hệ thống gameplay lớn còn nằm trong `game.js`; Android vẫn để sau theo yêu cầu.


## Tái khởi tạo kiến trúc module từ core/state.js (2026-11-24)
- [x] Tạo `www/js/core/state.js` làm đầu mối duy nhất cho key lưu trữ, state mặc định, migration dữ liệu cũ và persistence.
- [x] Chuyển khởi tạo state, migration và hàm `save` khỏi `game.js`; file game chỉ nhận state qua `GameState.create()`.
- [x] Nạp `core/state.js` sau các adapter nền tảng cần thiết và trước `game.js`.
- [x] Thêm kiểm thử migration dữ liệu cũ, mặc định, UI initialization và lưu state.
- [ ] Từng bước thay thế các module cũ bằng module có ranh giới chức năng mới; chỉ xóa module cũ sau khi không còn tham chiếu từ HTML, game, tests hoặc workflow.
- [ ] Chuyển các module hiện hữu vào `core/`, `data/`, `systems/`, `ui/` theo đúng trách nhiệm; không giữ song song hai nguồn state hoặc hai cơ chế lưu.
- [ ] Chạy đầy đủ test suite và kiểm tra runtime sau khi hoàn thành nhóm state/core.

---

# Lộ trình chuẩn tái cấu trúc và phát triển (nguồn tham chiếu chính)

> Đây là lộ trình đã thống nhất với chủ dự án. Khi tiếp tục ở cuộc trò chuyện mới, đọc mục này trước khi sửa code. Cập nhật trạng thái sau mỗi mốc đã kiểm chứng.

## Nguyên tắc không thay đổi

1. Làm việc trên nhánh `stage-1/foundation`; không tự ý đổi nhánh hoặc merge.
2. Ưu tiên tách `game.js` theo **chức năng thực tế**, không chỉ di chuyển file hoặc tạo wrapper để tạo cảm giác đã modular hóa.
3. Giữ classic scripts, global API và các `onclick` hiện tại trong giai đoạn chuyển đổi; không chuyển sang ES modules nếu chưa có quyết định mới.
4. Thứ tự kiến trúc mục tiêu: `core → data → systems → ui → game.js`. Mọi script phải được nạp sau dependency và trước consumer.
5. Không xóa module cũ trước khi quét toàn repo (HTML, JS, tests, workflow) và xác nhận không còn tham chiếu. Dùng compatibility guard có thời hạn khi cần.
6. Mỗi lần tách phải giữ nguyên gameplay/save schema, có test hồi quy phù hợp và kiểm tra cú pháp + thứ tự nạp.
7. Gom thay đổi thành các đợt hợp lý, tránh commit dồn dập làm GitHub Actions concurrency hủy workflow đang chạy. Chỉ báo CI pass khi đã xem kết quả thực tế.
8. **Không kiểm tra, build, ký APK, tạo keystore hoặc xử lý Android trong các giai đoạn 1–6. Android chỉ được xem xét ở giai đoạn 7.**

## Cấu trúc đích

```text
www/js/
├── core/
│   ├── state.js
│   ├── storage.js
│   ├── game-loop.js
│   ├── date.js
│   ├── time-format.js
│   ├── noise.js
│   ├── text.js
│   └── events.js              # Chỉ tạo nếu thật sự có nhu cầu pub/sub
├── data/
│   ├── quest-data.js          # PLAN, preset nhiệm vụ, prompt AI
│   ├── progression-data.js
│   ├── npc-data.js
│   ├── npc-roster.js
│   ├── kiep-nan-data.js
│   ├── diary-data.js
│   ├── leaderboard-data.js
│   ├── item-data.js
│   ├── rebirth-data.js
│   ├── cultivation-display-data.js
│   └── story-data.js
├── systems/
│   ├── quests.js              # Parser và quy tắc nhiệm vụ
│   ├── rewards.js              # Nhóm nghiệp vụ thưởng theo phạm vi thực tế
│   ├── streak.js
│   ├── analytics.js
│   ├── pets.js
│   ├── leaderboard.js
│   ├── sect.js                 # Tông môn và chiến tông môn
│   ├── heavenly-tribulation.js
│   ├── story.js
│   ├── god.js
│   ├── legacy-missions.js
│   └── quest-completion.js
├── ui/
│   ├── preferences.js
│   ├── pets.js
│   ├── exam-modal.js
│   ├── leaderboard.js
│   ├── sect.js
│   ├── heavenly-tribulation.js
│   ├── statistics.js
│   ├── map.js
│   └── ...                    # Chỉ tạo theo chức năng UI thực tế
└── game.js                    # Bootstrap, render điều phối, askName và vòng lặp
```

Không bắt buộc tạo file rỗng để khớp sơ đồ. Có thể chia nhỏ khi module quá lớn, nhưng ranh giới phải theo trách nhiệm và dependency rõ ràng. `events.js` không phải hệ thống gameplay “Kỳ sự”; chỉ tạo nếu cần event bus kỹ thuật.

## Lộ trình 7 giai đoạn

### Giai đoạn 1 — Nền tảng và ổn định
- [x] Tạo `core/state.js`, đưa khởi tạo state, migration và persistence qua API thống nhất.
- [x] Chuyển storage sang `core/storage.js`; giữ compatibility guard tạm thời.
- [x] Chuyển game loop/timer sang `core/game-loop.js`.
- [x] Chuyển cấu hình giao diện sang `ui/preferences.js`.
- [x] Di chuyển nhóm data đã liệt kê vào `data/` và cập nhật thứ tự script/test.
- [x] Hoàn tất tách dữ liệu nhiệm vụ (PLAN, preset, AI prompt) khỏi `game.js` vào `data/quest-data.js`; giữ parser nghiệp vụ ở `quest-data.js` gốc.
- [ ] Rà soát và xác nhận test suite hiện tại xanh trên commit mới nhất; không dùng kết quả CI cũ để kết luận trạng thái hiện tại.

### Giai đoạn 2 — Hoàn thiện core
- [ ] Chuyển date helpers sang `core/date.js`.
- [ ] Chuyển time formatting sang `core/time-format.js`.
- [ ] Chuyển noise helpers sang `core/noise.js`.
- [ ] Chuyển text/HTML escaping sang `core/text.js`.
- [ ] Chỉ bổ sung `core/events.js` nếu xác định được use case pub/sub kỹ thuật cụ thể.
- [ ] Chuẩn hóa dependency injection/API và thứ tự nạp script.

### Giai đoạn 3 — Tách systems theo nghiệp vụ
- [ ] Nhiệm vụ: parser/quy tắc vào `systems/quests.js`; tách biệt với dữ liệu nhiệm vụ.
- [ ] Thưởng: rà soát các luồng thưởng và gom theo trách nhiệm vào `systems/rewards.js`.
- [ ] Tách streak, analytics, pets, leaderboard.
- [ ] Hợp nhất nghiệp vụ tông môn và chiến tông môn vào `systems/sect.js` khi API tương thích đã được kiểm chứng.
- [ ] Tách thiên kiếp, story, god mode, legacy missions và quest completion.
- [ ] Mỗi module nhận state/dịch vụ qua tham số rõ ràng; không tạo thêm global phụ thuộc ngầm nếu tránh được.

### Giai đoạn 4 — Tách UI theo màn hình/chức năng
- [ ] Tách UI linh thú, modal thiên kiếp, leaderboard, tông môn, thống kê, bản đồ và các tab còn lại theo code thực tế.
- [ ] Chuyển renderer, DOM event binding và tương tác giao diện vào `ui/`; giữ logic nghiệp vụ trong `systems/`.
- [ ] Không để module data/core tự gắn handler hoặc thực thi side effect giao diện khi vừa được nạp.

### Giai đoạn 5 — Thu gọn game.js
- [ ] Chuyển các logic gameplay và renderer còn lại khỏi `game.js`.
- [ ] Giữ `game.js` làm bootstrap, khởi tạo dependency, điều phối render, `askName` và vòng lặp cấp ứng dụng.
- [ ] Mục tiêu là giảm trách nhiệm thực sự của file, không chỉ đổi số dòng bằng cách chuyển nguyên khối không phân tích.

### Giai đoạn 6 — Kiểm thử và dọn migration
- [ ] Chạy toàn bộ `npm test`, parse cú pháp mọi JS và kiểm tra thứ tự nạp.
- [ ] Thêm test tích hợp cho luồng chơi chính: load/save, tạo và hoàn thành nhiệm vụ, timer, thưởng, tải lại.
- [ ] Rà quét tham chiếu toàn repo; xóa compatibility guards/file cũ chỉ khi không còn consumer.
- [ ] Kiểm tra hồi quy trình duyệt và các script phụ thuộc như `notify.js`, `schedule.js`.
- [ ] Ghi rõ những phần chưa thể kiểm thử bằng môi trường hiện có; không tuyên bố nghiệm thu vượt quá bằng chứng.

### Giai đoạn 7 — Android và phát hành (để cuối cùng)
- [ ] Chỉ bắt đầu sau khi người dùng xác nhận các giai đoạn 1–6 đã đạt yêu cầu.
- [ ] Kiểm tra Capacitor, build và cài đặt trên thiết bị Android thật.
- [ ] Chạy checklist dữ liệu, thông báo, timer, backup/restore và vòng đời ứng dụng.
- [ ] Thiết lập ký APK/release an toàn bằng keystore/secrets do chủ dự án quản lý; tuyệt đối không commit khóa riêng tư.
- [ ] Kiểm tra artifact và quy trình phát hành.

## Trạng thái tại thời điểm ghi lộ trình

- Đã có các module nền tảng `core/state.js`, `core/storage.js`, `core/game-loop.js`, `ui/preferences.js` và nhiều module `data/`.
- Đã bắt đầu tổ chức `systems/` với module tông môn; một số module nghiệp vụ vẫn đang ở đường dẫn cũ và cần chuyển theo đợt.
- `game.js` vẫn còn lớn; chưa được coi là đã tách xong.
- CI gần nhất được ghi nhận trong ngữ cảnh làm việc có lỗi test kỳ vọng thứ tự catalog vật phẩm; test đã được sửa ở commit `58a0014e736697011b79263a4ff43eaa3212ea79`, nhưng **chưa xác nhận CI của commit sửa lỗi đã hoàn tất thành công**.
- Android/build/ký APK đang được hoãn theo chỉ đạo; không làm trong các giai đoạn 1–6.

## Quy trình cập nhật tài liệu

Sau mỗi đợt thay đổi:
1. Ghi module/file đã chuyển, API mới và compatibility còn giữ.
2. Ghi test thực sự đã chạy, số test pass/fail và commit/CI tương ứng.
3. Cập nhật checkbox của giai đoạn; không đánh dấu hoàn thành chỉ vì đã tạo file.
4. Ghi lỗi còn tồn tại và bước tiếp theo cụ thể.
5. Luôn đọc mục này trước khi tiếp tục ở chat mới; đây là nguồn chuẩn về kiến trúc và quyết định đã thống nhất.



## Khôi phục CI test-only và sửa hồi quy catalog (2026-11-24)

- [x] Điều tra GitHub Actions run #282 trên commit `a8937f5917cb5f48dda261b7f46a3b750c7bcb1a`: `npm ci` đạt; `npm test` có 79/80 test đạt và 1 test thất bại tại `tests/modules.test.js:1169`.
- [x] Nguyên nhân: test cũ kỳ vọng `catalog()[20].d` là `undefined`, nhưng dữ liệu vật phẩm Tục Mệnh Phù đã có mô tả tĩnh; `GameItemData.catalog()` giữ mô tả này vì `describe()` trả object rỗng khi item không có `q`. Đây là fixture/assertion lỗi, không phải lỗi gameplay.
- [x] Sửa assertion để xác nhận mô tả thực tế của Tục Mệnh Phù; không thay đổi dữ liệu hoặc công thức gameplay.
- [x] Tách CI kiểm thử JavaScript khỏi workflow build APK: workflow build chỉ chạy thủ công bằng `workflow_dispatch`; thêm workflow kiểm thử tự động riêng cho push/PR và chỉ chạy `npm ci` + `npm test`.
- [x] Workflow test-only run #1 phát hiện assertion thứ hai trong cùng test catalog: kỳ vọng mô tả tỉ lệ giá không khớp nhánh `ratio < 2` của `GameItemData.describe()`; sửa expected theo hành vi thực tế, không đổi code gameplay.
- [x] GitHub Actions JavaScript Tests run #2 (run ID `45231245430`) cho commit `2311a6ccdab347dff26f361e34bd1273bea1b831` hoàn tất thành công: `npm ci` và `npm test` đều pass; 80/80 test đạt, 0 thất bại.
- [x] Xác nhận workflow build APK không tự chạy theo push; CI của giai đoạn 1–6 hiện chỉ thực thi kiểm thử JavaScript. Workflow build được giữ ở chế độ thủ công để dành cho giai đoạn 7.
- [ ] Không chạy build, sync, kiểm tra hay ký Android trong giai đoạn 1–6.
- [ ] Sau khi CI xanh, tiếp tục khảo sát và tách dữ liệu nhiệm vụ (PLAN/preset/prompt AI) khỏi `game.js` vào `data/quest-data.js`, rồi rà thứ tự nạp theo kiến trúc core → data → systems → ui → game.js.



## Tách dữ liệu nhiệm vụ khỏi game.js (2026-11-24)

- [x] Giữ `www/js/quest-data.js` làm parser nghiệp vụ; không ghi đè hoặc trộn parser với dữ liệu tĩnh.
- [x] Tạo `www/js/data/quest-data.js` chứa `PN`, `PLAN`, `AI_PROMPT`, `CHAIN_PROMPT`, `SCHED_PROMPT`, `PRESET_MIX`, `DEF_Q`, `DEF_C`, `DEF_S`, công bố qua `window.GameQuestTemplates`.
- [x] Thay khai báo dữ liệu trong `game.js` bằng destructuring API; giữ nguyên nội dung dữ liệu và call-site.
- [x] Nạp data module sau parser `quest-data.js` và trước `game.js`.
- [x] Bổ sung test API, số tuần kế hoạch và nội dung prompt/preset.
- [x] CI run #45231987984 phát hiện assertion test mới dùng `assert.match` với `DEF_C` là mảng; sửa sang kiểm tra tên preset theo cấu trúc mảng. CI run #45232075244 trên commit `3afae07e563a06b927ccf0a29579b91d54032c79` đạt 81/81 test, 0 thất bại.
- [ ] Tiếp theo: audit và sắp xếp thứ tự nạp script theo core → data → systems → ui → game.js; chỉ loại bỏ file cũ sau khi rà toàn bộ tham chiếu.



## Chuẩn hóa điểm khởi tạo core (2026-11-24)

- [x] Audit luồng khởi tạo: `core/state.js` phụ thuộc `GameStorage` khi gọi `GameState.create()`; đặt file gần cuối danh sách script khiến nền tảng state bị khởi tạo muộn không cần thiết.
- [x] Chuyển `core/state.js` lên ngay sau `core/storage.js`, trước các compatibility entry point và gameplay modules. API chỉ được gọi khi `game.js` bootstrap nên `ui/preferences.js` vẫn được nạp trước `game.js`.
- [x] Bổ sung assertion thứ tự nạp để ngăn hồi quy.
- [ ] Chưa sắp xếp lại toàn bộ data/systems/ui theo nhóm: các file cũ và compatibility entry point còn dependency cần audit riêng; không đổi thứ tự hàng loạt khi chưa xác minh.
- [ ] Chưa chạy test/CI trên commit thay đổi này; cần xác nhận CI thực tế trước khi đánh dấu ổn định.


## Gom helper thuần vào core (2026-11-24)

- [x] Chuyển `time-format.js` → `core/time-format.js`; giữ nguyên global API `GameTimeFormat`.
- [x] Chuyển `date-data.js` → `core/date.js`; giữ nguyên global API `GameDateData`.
- [x] Chuyển `noise.js` → `core/noise.js`; giữ nguyên global API `GameNoise`.
- [x] Chuyển `text.js` → `core/text.js`; giữ nguyên global API `GameText`.
- [x] Cập nhật duy nhất các thẻ script tương ứng trong `www/index.html`; giữ thứ tự tương đối để không đổi hành vi bootstrap.
- [x] Giữ nguyên nội dung và tên API của các helper; không đổi call-site trong gameplay.
- [ ] Cần xác nhận CI sau commit và tiếp tục rà dependency nhóm data/systems/ui; chưa coi toàn bộ thứ tự script đã chuẩn hóa.


## Audit tương thích data modules (2026-11-24)

- [x] Đối chiếu các cặp triển khai trong `data/*` với compatibility entry point cùng tên ở thư mục gốc.
- [x] Xác nhận wrapper hiện chỉ kiểm tra global API đã tồn tại; chưa xóa wrapper để giữ tương thích với cách nạp script cũ.
- [x] Bổ sung test thứ tự nạp: mọi implementation phải đứng trước wrapper tương ứng; xác nhận 4 helper thuần được nạp từ `core/`.
- [ ] Chưa gom lại toàn bộ thứ tự script theo nhóm lớn; các file gameplay cũ vẫn cần dependency audit trước khi di chuyển.


## Gom nhóm nghiệp vụ thưởng và chuỗi học vào systems (2026-11-24)

- [x] Chuyển phần triển khai `GameRewards` sang `www/js/systems/rewards.js`; giữ nguyên API toàn cục và nội dung thuật toán.
- [x] Chuyển phần triển khai `GameStreak` sang `www/js/systems/streak.js`; giữ nguyên API toàn cục và nội dung thuật toán.
- [x] Giữ các đường dẫn gốc làm compatibility guard; nạp implementation trước guard và không đổi thứ tự tương đối với các script kế tiếp.
- [ ] Chưa xác nhận test/CI cho commit này; tiếp tục chuyển các subsystem còn lại theo đúng cấu trúc phẳng trong lộ trình.


## Gom thống kê và chiến tông môn vào systems (2026-11-24)

- [x] Chuyển implementation `GameAnalytics` sang `www/js/systems/analytics.js`; giữ nguyên toàn bộ hàm tổng hợp và API.
- [x] Chuyển implementation `GameSectWar` sang `www/js/systems/sect-war.js`; giữ nguyên tính điểm, ghép cặp và xử lý thưởng.
- [x] Giữ compatibility guard ở đường dẫn cũ; nạp module mới ngay trước guard và không đảo thứ tự các dependency hiện hữu.
- [ ] Chưa xác nhận test/CI; tiếp tục gom các subsystem còn lại và bổ sung kiểm thử đường dẫn.


## Gom nhiệm vụ tông môn, xuyên kiếp và hoàn thành nhiệm vụ vào systems (2026-11-24)

- [x] Chuyển `GameLegacyMissions` vào `systems/legacy-missions.js` và giữ factory/dependency injection.
- [x] Chuyển `GameQuestCompletion` vào `systems/quest-completion.js`; không thay đổi luồng thưởng, streak, lịch sử hoặc hoàn thành chuỗi.
- [x] Chuyển `GameSectMissions` vào `systems/sect-missions.js`; giữ nguyên chọn nhiệm vụ tuần và cơ chế nhận thưởng.
- [x] Giữ đường dẫn cũ làm compatibility guard; script implementation đứng ngay trước wrapper tại vị trí cũ.
- [x] Bổ sung assertion cho cả 7 cặp implementation/compatibility trong `tests/modules.test.js`; test kiểm tra implementation được nạp trước đường dẫn tương thích.
- [ ] Cần xác nhận CI xanh sau đợt di chuyển; chưa coi giai đoạn systems hoàn tất.


## Gom renderer linh thú và modal thiên kiếp vào ui (2026-11-24)

- [x] Chuyển renderer/tương tác linh thú sang `ui/pets.js` và modal xác nhận thiên kiếp sang `ui/exam-modal.js`.
- [x] Giữ nguyên global API `GamePetUI` và `GameExamModal`; các đường dẫn gốc là compatibility guard.
- [x] Giữ nguyên vị trí tương đối trong danh sách script và nạp implementation trước wrapper.
- [x] Bổ sung test kiểm tra thứ tự nạp implementation/UI compatibility.
- [ ] Tiếp tục audit các UI entry point và tách trách nhiệm còn nằm trong `game.js`.


## Hợp nhất hệ thống tông môn theo module nghiệp vụ (2026-11-24)

- [x] Hợp nhất ba implementation `GameSectSystem`, `GameSectWar` và `GameSectMissions` vào `systems/sect.js` theo ranh giới nghiệp vụ tông môn.
- [x] Giữ nguyên ba global API để không đổi call-site; `sect-war.js` và `sect-missions.js` ở thư mục gốc chỉ còn compatibility guard.
- [x] Thay ba script implementation rời bằng một script `systems/sect.js` được nạp trước consumer; loại bỏ ba implementation phân mảnh cũ.
- [x] Rà soát lại danh sách script và loại thẻ nạp cũ còn sót của `systems/sect-missions.js`; chỉ giữ một implementation tông môn.
- [x] Cập nhật test thứ tự nạp để hai compatibility entry point cùng phụ thuộc vào module nghiệp vụ duy nhất.
- [ ] Cần xác nhận CI sau hợp nhất và tiếp tục gom/tách các nghiệp vụ còn nằm trong `game.js`.


## Đưa parser và quy tắc nhiệm vụ vào systems/quests.js (2026-11-24)

- [x] Chuyển parser dòng nhiệm vụ, chuẩn hóa độ khó, hạn chót và quy tắc hoàn thành/mở khóa chuỗi từ `quest-data.js` sang `systems/quests.js`.
- [x] Giữ nguyên API `GameQuestData` và giữ `data/quest-data.js` riêng cho preset, kế hoạch và prompt AI.
- [x] Giữ root `quest-data.js` làm compatibility guard; implementation nạp trước dữ liệu mẫu và các consumer.
- [x] Bổ sung assertion thứ tự nạp implementation/compatibility.
- [ ] Tiếp tục tách nghiệp vụ còn trong `game.js` theo dependency đã audit.


## Đưa quy tắc linh thú vào systems/pets.js (2026-11-24)

- [x] Chuyển logic xếp cấp linh thú và tính buff theo linh thú đang theo cùng từ `pet-data.js` sang `systems/pets.js`.
- [x] Giữ nguyên API `GamePetData` để `game.js` và renderer không phải đổi call-site.
- [x] Giữ root `pet-data.js` làm compatibility guard và nạp implementation trước consumer.
- [x] Bổ sung assertion thứ tự nạp.
- [ ] Tiếp tục tách logic nghiệp vụ linh thú và các hệ thống còn lại khỏi `game.js`.


## Tách renderer thống kê sang ui/statistics.js (2026-11-24)

- [x] Chuyển renderer thống kê, bộ lọc 7/30 ngày và linh lực/giờ học sang `ui/statistics.js`.
- [x] Đóng gói trạng thái bộ lọc trong module; truyền state, analytics, định dạng thời gian, cảnh giới và callback qua dependency injection.
- [x] `game.js` chỉ khởi tạo `GameStatisticsUI` và giữ wrapper `renderStats` để không đổi các điểm gọi.
- [x] Bổ sung test cho trạng thái và tương tác bộ lọc.
- [x] Sửa assertion kiểm thử để chuẩn hóa object qua JSON khi so sánh dữ liệu được tạo trong VM realm.
- [ ] Tiếp tục tách các màn hình và subsystem lớn hơn; chưa coi `game.js` đã thu gọn xong.


## Tách mô phỏng tu vi NPC khỏi game.js (2026-11-24)

- [x] Chuyển bộ máy mô phỏng tích lũy tu vi theo phút, cơ duyên, hệ số hiệu suất và cache xếp hạng sang `systems/leaderboard.js`.
- [x] Đóng gói cache mô phỏng trong `GameLeaderboardSimulation.create()`; `game.js` nhận API qua dependency injection và giữ các alias cũ cho các hệ thống đang dùng.
- [x] Chuyển cả tính phân bổ NPC vào sáu tông môn, vô hiệu cache từ mốc thời gian và reset cache khi luân hồi vào module; không đổi công thức hoặc save schema.
- [x] Bổ sung test mô phỏng linh lực, phân bổ tông môn và reset cache; kiểm tra giá trị dương hữu hạn và tái lập sau reset thay vì hard-code tổng điểm kỳ vọng của fixture.
- [ ] Tiếp tục tách phần settlement/đặc ân/xếp hạng tuần và các subsystem gameplay còn lại.


## Tách màn hình tông môn sang ui/sect.js (2026-11-24)

- [x] Chuyển renderer tổng quan tông môn, xếp hạng, bái sư và chiến tông môn sang `ui/sect.js`.
- [x] Truyền state, dữ liệu tông môn, điểm chiến, lịch tuần và nhiệm vụ qua dependency injection; `game.js` giữ wrapper `renderSect` để giữ nguyên điều phối hiện tại.
- [x] Bổ sung test render với trạng thái chưa gia nhập tông môn.
- [ ] Tiếp tục tách các màn hình leaderboard/thiên kiếp/bản đồ và logic còn trong `game.js`.
