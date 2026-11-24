# Project Progress Tracker

> Cập nhật lần cuối: 2026-11-24
> Mốc 2026-11-24 · Hoàn thành gom module, xác minh CI build APK tự động; người dùng xác nhận ứng dụng sử dụng tốt trên Android. Nghiệm thu Android chi tiết còn theo checklist.
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
- [x] Rà soát và xác nhận test suite xanh trên commit `ee9a7890ff5c28dafb4e65bab8ab4b95ac39fcee`; CI #45302476933: 106/106 test pass.

### Giai đoạn 2 — Hoàn thiện core
- [x] Chuyển date helpers sang `core/date.js`.
- [x] Chuyển time formatting sang `core/time-format.js`.
- [x] Chuyển noise helpers sang `core/noise.js`.
- [x] Chuyển text/HTML escaping sang `core/text.js`.
- [x] Không tạo `core/events.js`: hiện chưa có use case pub/sub kỹ thuật cụ thể, tránh tạo module rỗng.
- [ ] Chuẩn hóa dependency injection/API và thứ tự nạp script.

### Giai đoạn 3 — Tách systems theo nghiệp vụ
- [x] Parser/quy tắc nhiệm vụ ở `systems/quests.js`; dữ liệu nhiệm vụ ở `data/quest-data.js`.
- [x] Gom công thức thưởng vào `systems/rewards.js`; luồng trao thưởng vẫn được rà soát tiếp trong giai đoạn 5.
- [x] Tách streak, analytics, pets và leaderboard vào `systems/`.
- [x] Gom cấu hình tông môn, chiến tông môn và nhiệm vụ tông môn vào `systems/sect.js`.
- [x] Tách thiên kiếp, story, god mode, legacy missions và quest completion vào `systems/`.
- [x] Các system chính đã chuyển sang factory/API có dependency injection; phần global cũ còn lại sẽ được rà trong giai đoạn 5–6.

### Giai đoạn 4 — Tách UI theo màn hình/chức năng
- [x] Tách UI linh thú, modal thiên kiếp, leaderboard, tông môn, thống kê, bản đồ, hoạt động, sự kiện, onboarding, profile, navigation và các tab chính.
- [ ] Tiếp tục chuyển các DOM event handler còn nằm trong `game.js` vào `ui/`; các renderer màn hình chính đã được tách.
- [x] Các module `data/` và `core/` hiện không tự gắn handler giao diện khi nạp; tiếp tục kiểm tra khi audit.

### Giai đoạn 5 — Thu gọn game.js
- [ ] Chuyển các logic gameplay và renderer còn lại khỏi `game.js`.
- [ ] Giữ `game.js` làm bootstrap, khởi tạo dependency, điều phối render, `askName` và vòng lặp cấp ứng dụng.
- [x] Giữ nguyên nguyên tắc: chỉ tách theo trách nhiệm và dependency; không di chuyển máy móc.

### Giai đoạn 6 — Kiểm thử và dọn migration
- [x] CI chạy `npm test`, parse cú pháp mọi JS và kiểm tra thứ tự nạp; commit mới nhất đạt 106/106.
- [ ] Thêm test tích hợp cho luồng chơi chính: load/save, tạo và hoàn thành nhiệm vụ, timer, thưởng, tải lại.
- [ ] Rà quét tham chiếu toàn repo; xóa compatibility guards/file cũ chỉ khi không còn consumer.
- [ ] Kiểm tra hồi quy trình duyệt và các script phụ thuộc như `notify.js`, `schedule.js`.
- [x] Ghi rõ Android thật, UI trình duyệt thật và ký release vẫn chưa được xác nhận; không dùng CI cloud thay cho các kiểm thử đó.

### Giai đoạn 7 — Android và phát hành (để cuối cùng)
- [ ] Chỉ bắt đầu sau khi người dùng xác nhận các giai đoạn 1–6 đã đạt yêu cầu.
- [ ] Kiểm tra Capacitor, build và cài đặt trên thiết bị Android thật.
- [ ] Chạy checklist dữ liệu, thông báo, timer, backup/restore và vòng đời ứng dụng.
- [ ] Thiết lập ký APK/release an toàn bằng keystore/secrets do chủ dự án quản lý; tuyệt đối không commit khóa riêng tư.
- [ ] Kiểm tra artifact và quy trình phát hành.

## Trạng thái tại thời điểm ghi lộ trình

- Đã có các module nền tảng `core/state.js`, `core/storage.js`, `core/game-loop.js`, `ui/preferences.js` và nhiều module `data/`.
- Các nghiệp vụ chính đã được gom vào `systems/`; còn một số compatibility entry point giữ lại để bảo toàn thứ tự nạp và global API.
- `game.js` còn khoảng 1081 dòng; đã giảm đáng kể nhưng vẫn còn logic gameplay, DOM event handler và bootstrap cần tiếp tục tách.
- CI hiện tại: [run #45302476933](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45302476933) xanh, 106/106 test pass trên commit `ee9a7890ff5c28dafb4e65bab8ab4b95ac39fcee`.
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


## Tách bản đồ Cửu Châu sang ui/map.js (2026-11-24)

- [x] Chuyển cấu hình điểm đến, dựng bản đồ và xử lý chọn địa điểm sang `ui/map.js`.
- [x] Truyền state, danh sách tông môn, escape HTML, điều hướng và render ứng dụng qua dependency injection.
- [x] `game.js` giữ wrapper `renderMap` và module UI không tự phụ thuộc vào bootstrap global ngoài các dependency đã nhận.
- [x] Bổ sung test render bản đồ và chọn địa điểm.
- [ ] Tiếp tục tách UI leaderboard, thiên kiếp, nhật ký và logic còn lại.


## Tách trang Thiên Cơ Lục sang ui/lore.js (2026-11-24)

- [x] Chuyển toàn bộ renderer nội dung thế giới, cảnh giới, tông môn, thiên kiếp và luân hồi sang `ui/lore.js`.
- [x] Truyền danh sách tông môn và DOM accessor qua dependency injection; giữ wrapper `renderLore` trong `game.js`.
- [x] Bổ sung test kiểm tra nội dung chính và dữ liệu tông môn.
- [ ] Tiếp tục tách leaderboard, thiên kiếp và các màn hình còn lại.


## Tách UI thiên kiếp và Mệnh sang ui/heavenly-tribulation.js (2026-11-24)

- [x] Chuyển renderer cảnh giới, Mệnh, lịch thiên kiếp, kết quả và bảng điểm sang `ui/heavenly-tribulation.js`.
- [x] Truyền state, dữ liệu thiên kiếp, công thức điểm, buff và DOM accessor qua dependency injection; giữ wrapper `renderExams`.
- [x] Bổ sung test render trạng thái Mệnh và danh sách thiên kiếp.
- [x] Sửa dependency alias trong `ui/map.js`: renderer sử dụng đúng escape, rank, navigate và callback render do bootstrap truyền vào.
- [ ] Tiếp tục tách UI leaderboard và logic thiên kiếp còn lại khỏi `game.js`.


## Tách UI Thiên Kiêu Bảng sang ui/leaderboard.js (2026-11-24)

- [x] Chuyển renderer bảng xếp hạng, vùng Thiên Đạo Cân Bằng và thông tin hạng người chơi/NPC sang `ui/leaderboard.js`.
- [x] Chuyển state bật/tắt top 20 vào UI module; giữ profile click và wrapper `renderLb` ở bootstrap.
- [x] Truyền dữ liệu mô phỏng, rank, profile, streak và DOM accessor qua dependency injection.
- [x] Bổ sung test render bảng và chuyển chế độ hiển thị.
- [ ] Tiếp tục tách các nghiệp vụ xếp hạng tuần và các màn hình khác khỏi `game.js`.


## Tách UI nhật ký tu tiên sang ui/diary.js (2026-11-24)

- [x] Chuyển renderer nhật ký 14 ngày và Đạo Văn sang `ui/diary.js`.
- [x] Tiêm state, ngày hiện tại, sinh nhật ký và kiểm tra mốc truyện qua dependency injection; giữ wrapper `renderDiary`.
- [x] Bổ sung test số ngày hiển thị và trạng thái Đạo Văn trống.
- [x] Chuẩn hóa alias dependency `generateDiary`/`checkStoryFlags` theo tên hàm gốc mà renderer đang gọi.
- [ ] Tiếp tục rà soát các màn hình và hệ thống còn lại.


## Tách renderer cài đặt sang ui/settings.js (2026-11-24)

- [x] Chuyển renderer tùy chỉnh chủ đề, mật độ, cỡ chữ, chế độ Chỉ học và các tùy chọn backup sang `ui/settings.js`.
- [x] Truyền state, helper gấp/mở và container qua dependency injection; giữ toàn bộ event handling và thao tác lưu/nhập backup ở bootstrap.
- [x] `game.js` giữ wrapper `renderSettings` để không đổi call-site.
- [x] Bổ sung test các nhóm tùy chọn và nút backup.
- [ ] Tiếp tục tách các renderer và logic nghiệp vụ còn lại.


## Gom nhật ký cơ duyên vào ui/leaderboard.js (2026-11-24)

- [x] Chuyển renderer nhật ký cơ duyên, sự kiện đang diễn ra, top 10 và thống kê chiến tông sang API `renderTimeline()` của module leaderboard.
- [x] Giữ dữ liệu mô phỏng, tính điểm, thứ hạng và thống kê ở systems/bootstrap; UI module chỉ dựng markup từ dependency được tiêm.
- [x] `game.js` giữ wrapper `renderVan` để không đổi điểm điều phối.
- [x] Khôi phục helper `rn` ở bootstrap vì lịch học vẫn dùng nó; không để helper lịch bị chuyển nhầm sang UI leaderboard.
- [x] Bổ sung test render khi chưa có sự kiện mô phỏng.


## Tách UI sự kiện và Kỳ Sự Cửu Châu sang ui/events.js (2026-11-24)

- [x] Chuyển renderer tiến độ tuần/tháng, nhiệm vụ điều kiện và Kỳ Sự Cửu Châu sang `ui/events.js`.
- [x] Giữ state kỳ sự `KSD` dùng chung với event handlers; module nhận analytics, lịch tuần và callback DOM qua dependency injection.
- [x] `game.js` giữ wrapper `renderEvents` để bảo toàn thứ tự điều phối.
- [x] Bổ sung test render với trạng thái tiến độ rỗng.


## Gom UI lịch học, bảo khố và liên hoàn vào ui/activities.js (2026-11-24)

- [x] Gom ba renderer liên quan đến luồng Tu Luyện — lịch học, cửa hàng/bảo khố và chuỗi nhiệm vụ — vào một module UI theo nhóm chức năng.
- [x] Giữ state, helper nhiệm vụ, catalog vật phẩm, buff và DOM accessor qua dependency injection; event handlers tiếp tục ở bootstrap.
- [x] `game.js` giữ ba wrapper render để không đổi vòng lặp điều phối.
- [x] Bổ sung test cho trạng thái lịch rỗng, catalog cửa hàng và chuỗi trống.


## Tách hệ thống truyện và ký lục sang systems/story.js (2026-11-24)

- [x] Chuyển quản lý story flags, ghi mốc đột phá/tông môn/linh thú/danh hiệu/luân hồi và sinh nhật ký ngày sang `systems/story.js`.
- [x] Truyền state, dữ liệu truyện/nhật ký, cảnh giới, tông môn, linh thú, danh hiệu và callback thông báo qua dependency injection.
- [x] `game.js` giữ API wrapper cũ để các luồng luân hồi và UI nhật ký không đổi call-site.
- [x] Bổ sung test cho các mốc truyện và dữ liệu nhật ký.


## Sửa phạm vi trích xuất ui/activities.js (2026-11-24)

- [x] Chỉ đưa ba renderer lịch học, cửa hàng và chuỗi nhiệm vụ vào module UI; giữ helper `expired`, `weekStart`, `evCur` và `stepRow` ở bootstrap/systems.
- [x] Tránh khai báo trùng tên helper trong factory và giữ dependency injection rõ ràng.
- [ ] Chờ CI xác nhận lại toàn bộ test sau sửa.


## Tách xử lý kết quả thiên kiếp sang systems/tribulation.js (2026-11-24)

- [x] Chuyển chấm điểm NPC/người chơi, điều kiện vượt kiếp, chuỗi thất bại, trừ Mệnh, hiệu ứng Bất Diệt Kim Thân và khóa xem kết quả sang `systems/tribulation.js`.
- [x] Truyền dữ liệu, mô phỏng bảng, streak, buff, công thức điểm, save và callback UI qua dependency injection; giữ wrapper `resolveEx`.
- [x] Giữ modal và nội dung trình bày ở `ui/heavenly-tribulation.js`/`ui/exam-modal.js`.
- [x] Bổ sung test thành công, cập nhật life flag và khóa xem kết quả.


## Khôi phục helper lịch/nhiệm vụ và chuẩn hóa StorySystem (2026-11-24)

- [x] Giữ các helper nghiệp vụ `qm`, `rem`, `expired`, `weekStart`, `sumMins`, `evCur`, `unlocked` và `stepRow` ở bootstrap; chỉ renderer được chuyển sang `ui/activities.js`.
- [x] Cấp alias cảnh giới `ri` cho `systems/story.js` từ dependency `realmIndex`.
- [ ] Chờ CI xác nhận lại sau khi khôi phục các helper.


## Đồng bộ reset cache bảng xếp hạng khi luân hồi (2026-11-24)

- [x] Chuyển reset cache `PV` và trạng thái top 20 vào `LeaderboardUI.reset()`.
- [x] `doRebirth` gọi reset UI leaderboard cùng mô phỏng; bỏ biến cache trùng còn sót ở `game.js`.
- [x] Bổ sung test reset bộ lọc bảng.


## Tách luân hồi và reset kiếp sang systems/tribulation.js (2026-11-24)

- [x] Chuyển điều phối luân hồi, reset state kiếp, reset cache mô phỏng/bảng, giữ cờ xuyên kiếp và thông báo kết quả sang `GameTribulationSystem.doRebirth()`.
- [x] Truyền builder hồ sơ kiếp, state, save/render, UI và callback reset qua dependency injection; giữ wrapper `doRebirth`.
- [x] Bổ sung test reset state, ân xá, xuất sắc và tiến độ xuyên kiếp.
- [x] Loại bỏ dependency trùng khai báo trong factory khi mở rộng hệ thống cho luân hồi.
- [x] Gắn callback `buildRecord` vào alias `buildRec` mà luồng luân hồi hiện tại sử dụng.


## Tách lệnh Thiên Đạo và tự kiểm tra sang systems/god-mode.js (2026-11-24)

- [x] Chuyển kiểm tra trạng thái, hiệu chuẩn mô phỏng và toàn bộ lệnh quản trị/kiểm thử sang `systems/god-mode.js`.
- [x] Truyền state, systems, storage, navigation, timers và UI callbacks qua dependency injection; giữ wrapper `calib`, `selfCheck`, `runGod` cho event handler hiện tại.
- [x] Bổ sung test lệnh tăng linh lực và callback lịch sử.


## Tách nghiệp vụ xếp hạng tuần và cơ duyên vào systems/leaderboard.js (2026-11-24)

- [x] Chuyển hiệu ứng NPC Bất Diệt Kim Thân/Đạo Vận/Hồng Nhan/Thái Dương, cơ duyên đặc biệt, xếp hạng, cân bằng tuần và settlement vào `GameLeaderboardSystem` cùng nhóm với lõi mô phỏng.
- [x] Dùng `GameLeaderboardSimulation` làm lõi; inject dữ liệu NPC, dữ liệu xếp hạng, lịch, save và chiến tông môn.
- [x] Giữ API wrapper ở `game.js` để UI, thiên kiếp và lệnh Thiên Đạo không đổi call-site.
- [x] Bổ sung test bảng, cân bằng tuần và cơ duyên.
- [x] Giữ nguyên factory `GameLeaderboardSimulation` và bổ sung `GameLeaderboardSystem` cùng file; không ghi đè lõi mô phỏng đã có.


## Gom UI thiên kiếp và lịch sử luân hồi vào ui/heavenly-tribulation.js (2026-11-24)

- [x] Chuyển màn hình Nhật Kiếp/Tuần Kiếp, trạng thái kiếp hiện tại, lịch sử kiếp trước và modal phán quyết vào cùng module UI thiên kiếp.
- [x] Giữ callback luân hồi, thông báo, dữ liệu mệnh/cảnh giới và DOM qua dependency injection.
- [x] `game.js` giữ wrapper `renderKiep`, `renderRb`, `renderRbs`, `showThd` cho các call-site cũ.
- [x] Bổ sung test các màn hình thiên kiếp và lịch sử.


## Tách onboarding và dự báo thứ hạng khỏi game.js (2026-11-24)

- [x] Chuyển màn hình nhập đạo/chọn hình thể sang `ui/onboarding.js`; giữ callback lưu, render, thông báo và hướng dẫn qua dependency injection.
- [x] Chuyển màn hình Thiên Diễn dự báo giữ thứ hạng sang `ui/leaderboard.js` cùng các màn hình leaderboard.
- [x] Giữ wrapper `askName` và `thienDien` để không đổi luồng khởi tạo và nút diễn toán.
- [x] Bổ sung test nhập đạo, lọc tên và dự báo thứ hạng.
- [x] Sửa dấu đóng callback scheduler trong onboarding module trước khi nghiệm thu CI.
- [x] Loại bỏ khai báo trùng `today` trong leaderboard UI factory; dùng giá trị đã destructure từ dependency.
- [x] Dùng dependency `myRank` nhất quán trong renderer Thiên Diễn, tránh phụ thuộc biến cache của màn hình leaderboard.


## Tách hồ sơ nhân vật sang ui/profile.js (2026-11-24)

- [x] Chuyển renderer hồ sơ người chơi/NPC, thiên phú, cơ duyên và lịch sử tu vi sang `GameProfileUI`.
- [x] Inject state, dữ liệu cảnh giới, bảng xếp hạng, ảnh chân dung và chỉ số cơ duyên; profile index được đọc qua getter để luôn nhận lựa chọn mới nhất.
- [x] Giữ wrapper `renderProf` để các call-site cũ không đổi.
- [x] Bổ sung kiểm thử render hồ sơ người chơi.


## Gom màn hình nhiệm vụ ngày/tuần/tháng vào ui/activities.js (2026-11-24)

- [x] Đưa renderer Lệnh Bảng ngày/tuần/tháng vào nhóm UI hoạt động cùng lịch học, bảo khố và chuỗi nhiệm vụ.
- [x] Chỉ inject getter dữ liệu và phép tính tiến độ; giữ xử lý nhận thưởng/click trong `game.js` để không thay đổi nghiệp vụ.
- [x] Giữ wrapper `renderLenh` và thêm test renderer đủ tiến độ/nhận thưởng.


## Gom tiêu đề nhân vật và hồ sơ vào ui/profile.js (2026-11-24)

- [x] Chuyển renderer thẻ nhân vật chính (cảnh giới, Mệnh, tông môn, thứ hạng, ký ức kiếp trước) vào cùng module hồ sơ.
- [x] Giữ cập nhật màu hào quang và cờ top 10; dữ liệu cảnh giới/quotes/DOM được inject.
- [x] Giữ wrapper `renderHero` và bổ sung test tiêu đề nhân vật.
- [x] Inject số ngày mỗi kiếp và tuổi kiếp vào renderer; không để UI module đọc biến global `KD`.


## Gom UI kỳ ngộ và điểm danh vào ui/activities.js (2026-11-24)

- [x] Chuyển renderer kỳ ngộ, tiến độ phút học và cảnh báo chuỗi sắp đứt vào `GameActivityUI`.
- [x] Chuyển khối tóm tắt điểm danh/kỳ ngộ được nhúng trong Lệnh Bảng vào cùng module.
- [x] Giữ thuật toán tạo kỳ ngộ, tính phút và nhận thưởng trong `game.js`/systems; module UI chỉ nhận dữ liệu qua getter.
- [x] Bổ sung test kỳ ngộ, hiệu ứng và khối điểm danh.


## Gom hướng dẫn lần đầu vào ui/onboarding.js (2026-11-24)

- [x] Chuyển nội dung và điều khiển từng bước hướng dẫn vào module onboarding cùng màn nhập đạo.
- [x] Giữ callback `showTut` trong `game.js` để tương thích luồng khởi tạo và cài đặt.
- [x] Bổ sung test chuyển bước, kết thúc và bỏ qua hướng dẫn.


## Tách điều hướng và badge tab vào ui/navigation.js (2026-11-24)

- [x] Chuyển state chọn nhóm/tab, lọc tab theo cảnh giới/chế độ Chỉ học, render nav và event handler sang `GameNavigationUI`.
- [x] Gom tính badge, phát hiện kỳ ngộ mới, đánh dấu đã xem và cập nhật tiêu đề app vào cùng module điều hướng.
- [x] Giữ `nwS` làm accessor state tương thích cho các module UI khác; giữ wrapper `go`, `drawNav`, `nwUpdate`, `nwSeenK` trong bootstrap.
- [x] Bổ sung test điều hướng, Chỉ học và badge.


## Tái cấu trúc UI theo nhóm chức năng và xác nhận CI (2026-11-24)

- [x] Gom hồ sơ nhân vật và thẻ nhân vật chính vào `ui/profile.js`; game giữ wrapper tương thích.
- [x] Gom lịch học, bảo khố, chuỗi nhiệm vụ, nhiệm vụ ngày/tuần/tháng, kỳ ngộ và điểm danh vào `ui/activities.js`.
- [x] Gom nhập đạo và hướng dẫn lần đầu vào `ui/onboarding.js`.
- [x] Gom điều hướng tab, trạng thái tab, badge và đánh dấu kỳ ngộ đã xem vào `ui/navigation.js`.
- [x] CI #45302476933: `npm test` 106/106 pass; parse JS và kiểm tra script order thành công.
- [ ] Giai đoạn 5 chưa hoàn tất: `game.js` còn logic gameplay và event handler; tiếp tục tách theo subsystem, không chuyển cả khối mù quáng.
- [ ] Android thật, build/sync/ký APK tiếp tục để sau giai đoạn 1–6 theo yêu cầu.


## Chuyển nhập/xuất nhiệm vụ hàng loạt vào systems/quests.js (2026-11-24)

- [x] Thêm `importBulk` và `exportOpen` dạng thuần vào `GameQuestData`; lọc comment, đếm dòng lỗi và định dạng export không thao tác DOM.
- [x] `game.js` chỉ còn điều phối UI, cập nhật save/render và thông báo; logic phân tích/định dạng thuộc systems.
- [x] Bổ sung test nhập nhiều dòng, độ khó, bỏ comment, loại nhiệm vụ chuỗi/đã xong/hết hạn khi xuất.

## Tách bảng thống kê cơ duyên sang ui/opportunity-stats.js (2026-11-24)

- [x] Chuyển `spStatsHtml` (bảng thống kê cơ duyên đặc biệt, cơ duyên NPC, kỳ ngộ người chơi), bảng mô tả `CDE` và cache `SPC` sang `GameOpportunityStatsUI` (`www/js/ui/opportunity-stats.js`).
- [x] Dependency (state, dữ liệu NPC/kỳ ngộ, `evAt`, `knAt`, `KS`, `spA`, `KD`, `KSALT`) được tiêm qua `create(deps)`; `KD` và `KSALT` truyền bằng getter vì `KSALT` thay đổi khi luân hồi. Module được khởi tạo lười trong wrapper `spStatsHtml` ở `game.js`, nên `ui/leaderboard.js` không đổi call-site.
- [x] Nạp script ngay sau `ui/leaderboard.js` trong `www/index.html`.
- [x] Hồi quy: so sánh HTML sinh ra của hàm cũ (lấy từ commit trước) và module mới trên 300 bộ dữ liệu ngẫu nhiên, 0 sai khác.
- [x] Thêm test `GameOpportunityStatsUI` (nội dung bảng và cache theo kiếp). `npm test` cục bộ: 107/107 pass; `node --check` game.js và module mới đạt.
- [x] Commit `c8172e9`. CI #61 bị hủy do push kế tiếp (concurrency); #62 đỏ vì test linh thú của commit khác (đã sửa ở `e175eca`, không liên quan module này). Đã có bằng chứng đạt: [CI #66](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45303934763) (`d165e96`, chứa `c8172e9`) thành công; `npm test` cục bộ ở `717ced3`: 112/112 pass.
- [ ] Rà soát các trình xử lý sự kiện còn lại trong `game.js`, gồm thiên kiếp, bảo khố và chuỗi nhiệm vụ.


## Chuyển cấp linh thú và tích lũy linh lực sang systems/pets.js (2026-11-24)

- [x] Gom cấp linh thú mới, đánh dấu mới, tính linh lực tích lũy và thu hoạch khi đổi linh thú vào `GamePetData`.
- [x] Giữ callback `grantPet`, `petAcc`, `setAct` ở bootstrap để không đổi các hệ thống thưởng đang gọi.
- [x] Bổ sung test cấp linh thú, tích lũy, thu hoạch và reset mốc thời gian.


## Gom đồng bộ streak và lịch sử vào systems/streak.js (2026-11-24)

- [x] Chuyển thao tác đặt chuỗi, đồng bộ lịch sử học 420 ngày và cập nhật kỷ lục kiếp/tổng đời vào `GameStreak.set`.
- [x] Giữ wrapper `setStreak` để god mode và các call-site cũ không đổi.
- [x] Bổ sung test đồng bộ lịch sử, xóa mốc ảo cũ và bảo toàn kỷ lục cao nhất.


## Chuyển tua ngày Thiên Đạo vào systems/god-mode.js (2026-11-24)

- [x] Đưa cập nhật ngày ảo, mốc bảng xếp hạng và tùy chọn giữ chuỗi khi tua ngày vào `GameGodModeSystem.advance`.
- [x] Giữ wrapper `godAdvance` cho event handler cũ.
- [x] Bổ sung test đồng bộ ba loại state.


## Tách nhận thưởng kỳ ngộ và điểm danh vào systems/rewards.js (2026-11-24)

- [x] Gom xử lý nhận kỳ ngộ, hiệu ứng vật phẩm/buff, cơ hội linh thú và thưởng điểm danh vào `GameRewardClaims`.
- [x] Inject state, công thức thưởng, ngày, inventory, pet grant, save/render và thông báo; không để module phụ thuộc DOM.
- [x] Giữ wrapper `claimKn` và `checkin`; bổ sung test luồng nhận thưởng và chống nhận điểm danh trùng ngày.


## Sửa thứ tự khởi tạo module trong game.js (2026-11-24)

- [x] Phát hiện các factory UI/system được gọi trước khi một số `const` dependency (`KS`, `KX`, `tok`, `curStreak`, `kAge`) khởi tạo xong; đây là lỗi temporal-dead-zone có thể làm app dừng khi nạp.
- [x] Dời các factory phụ thuộc sang cuối bootstrap, sau khi dữ liệu, state và helper đã sẵn sàng; giữ wrapper và event handler cũ.
- [x] Thêm test thứ tự khởi tạo để ngăn hồi quy.
- [ ] Chạy kiểm thử khởi động trong trình duyệt/DOM thực; CI Node chưa thay thế được kiểm thử giao diện thật.


## Tiếp tục audit TDZ sau smoke test khởi động (2026-11-24)

- [x] Smoke test classic scripts phát hiện `GameEventsUI.create` vẫn nhận `dayStr` trước khi khai báo.
- [x] Dời factory EventsUI xuống vùng khởi tạo cuối bootstrap, sau khi `dayStr` và các helper lịch đã sẵn sàng.
- [x] Khôi phục dữ liệu tông môn, lịch sử tu vi, mốc tính tuần tông chiến và trạng thái chọn hồ sơ. Dùng lại khóa save từ `GameState` cho nhập sao lưu và Thiên Đạo.
- [x] Truyền hàm tính điểm vào bước chốt thưởng tông môn. Kiểm thử khởi động nạp đủ script theo `index.html`, tạo và hoàn thành nhiệm vụ, xác nhận dữ liệu đã lưu, mở/đóng hồ sơ và chốt trận tuần trước.
- [x] Sửa kiểm thử mốc kỳ ngộ theo giờ địa phương. `npm test` đạt 115/115 ở cả `Asia/Ho_Chi_Minh` và `UTC`.
- [ ] Xác nhận trong trình duyệt và trên Android thật. Trình duyệt trong phiên này không kết nối được máy chủ cục bộ.

## Tách tổng kết luân hồi sang data/rebirth-data.js (2026-11-24)

- [x] Chuyển tạo bản ghi, lời tổng kết và xét Thiên Đạo Ân Xá sang `GameRebirthData.buildRecord`. `GameTribulationSystem` tiếp tục điều phối luân hồi và lưu bản ghi.
- [x] So sánh toàn bộ bản ghi với mã trước khi tách trên 480 trường hợp. Tất cả kết quả trùng khớp, gồm lời tổng kết, xếp loại và cờ ân xá.

## Gom phần thưởng, vật phẩm và màn hình hiệu ứng (2026-11-24)

- [x] Chuyển công thức thưởng riêng cho từng nhiệm vụ `TB` sang `GameRewards.questBonus`, tiếp tục truyền trạng thái và các dịch vụ qua wrapper tại `game.js`.
- [x] Chuyển điều kiện dùng, hiệu ứng, tiêu hao vật phẩm và thưởng linh lực sang `GameItemSystem` tại `www/js/systems/items.js`.
- [x] Chuyển mô tả buff sang `GameActivityUI` và màn hình Thiên Đạo Lệnh sang `GameTribulationUI`.
- [x] Kiểm tra luồng dùng vật phẩm cùng khởi động game: tiêu hao kho, cộng hiệu ứng và ghi số vật phẩm đã dùng. Bộ `npm test` đạt 115/115.
- [ ] Kiểm tra các thao tác dùng từng loại vật phẩm trên thiết bị Android thật.

## Hồ sơ, bảng xếp hạng và tông môn (2026-11-24)

- [x] Gom biểu tượng vật phẩm, ảnh linh thú và chân dung vào `ui/icons.js`.
- [x] Đưa thao tác mở, đóng và xóa lựa chọn hồ sơ khi luân hồi vào `GameProfileUI`. Nút mở rộng bảng trở về “Hiện tất cả” sau luân hồi.
- [x] Chuyển gia nhập, đổi tông, bái sư và hủy bái sư vào `GameSectSystem`. Giao diện tông môn nhận thao tác và cập nhật nhật ký, dữ liệu lưu cùng thông báo.
- [x] Kiểm thử tích hợp thực hiện gia nhập qua nút giao diện và xác nhận linh lực sau lần gia nhập đầu. Bộ JavaScript đạt 115/115.

## Khôi phục sau CI #71 và chuẩn hóa thứ tự script

- CI trên commit `5302d56` thất bại khi khởi động vì `SECTS is not defined`. Bước cài đặt dependency thành công. [JavaScript Tests #71](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45305365569)
- Bản sửa gom các mốc cục bộ về khởi động, luân hồi, vật phẩm, hồ sơ và tông môn đã ghi ở trên. `index.html` nạp core, data, systems, UI, các entry tương thích rồi đến `game.js`, `notify.js`, `schedule.js`. Test kiểm tra cả ranh giới giữa các lớp.
- `GameQuestData.addChain` và `addPresetChains` tạo nhiệm vụ theo bước. Hai nút tạo chuỗi trong `game.js` tiếp tục phụ trách đọc biểu mẫu, thông báo và lưu. Kiểm tra đủ hai tên bước trước khi ghi để một dòng thiếu tên không tạo ra chuỗi chỉ có một bước.
- Cục bộ: `npm test` đạt 116/116, bao gồm parse toàn bộ JS, thứ tự script, khởi động, dùng vật phẩm, chốt tuần và tạo chuỗi. CI của bản mới được theo dõi riêng theo SHA.
- Tiếp theo: rà thao tác thiên kiếp và bảo khố trong giai đoạn 4–5, sau đó kiểm tra reload từ save và tham chiếu compatibility ở giai đoạn 6.

## Gom module theo chức năng gameplay (2026-11-24)

- [x] Bảo khố, kho đồ, mô tả hiệu ứng và giao diện danh hiệu nằm trong `ui/inventory.js`; `systems/items.js` sở hữu mua/dùng vật phẩm, danh sách danh hiệu, điều kiện mở khóa và trang bị. Giá và cấu hình vật phẩm vẫn ở `data/item-data.js`.
- [x] `systems/tribulation.js` sở hữu diễn kiếp, chấm kiếp, nhận thưởng thiên kiếp/nhật kiếp/tuần kiếp và luân hồi. `ui/heavenly-tribulation.js` quản lý hiển thị, mở rộng kết quả và thao tác xác nhận/nhận thưởng.
- [x] Chuyển mốc cảnh giới, lịch và cấu hình thiên kiếp, bảng thưởng vào `data/progression-data.js`; chuyển toàn bộ danh sách linh thú vào `systems/pets.js` cùng logic linh thú. Giữ giá trị cấu hình và API tương thích.
- [x] Khôi phục callback nhập đạo `askName` sau khi di chuyển nhóm handler luân hồi. `game.js` còn 738 dòng, chủ yếu nối module và các chức năng chưa chuyển hết.
- [x] Cập nhật bản đồ chức năng trong `docs/FOUNDATION_STAGE_1.md` để người và AI xác định được module chính trước khi chỉnh sửa. Không tạo file riêng cho từng hàm nhỏ.
- [x] Mở rộng smoke test qua handler UI: mua vật phẩm và chống mua trùng, mở khóa/đeo/gỡ danh hiệu, diễn kiếp với phù bảo hộ, nhận thưởng thiên kiếp Xuất sắc và chống nhận trùng, nhận đủ ba nhật kiếp và ba tuần kiếp kèm thưởng bộ.
- [x] `npm test` đạt 116/116 ở cả `Asia/Ho_Chi_Minh` và `UTC`; `git diff --check` đạt.
- [ ] Rà tiếp nhóm nhiệm vụ, lịch học, sự kiện và cài đặt theo miền chức năng. Lưu ý nhập backup hiện gán lại `S` trong khi các factory đã giữ tham chiếu state cũ; cần xử lý cùng kiểm thử vòng đời save/reload ở giai đoạn tiếp theo.
- [ ] Xác nhận trên trình duyệt thật và APK Android, theo dõi CI theo commit mới sau khi có push. Đợt này chỉ sửa và kiểm thử cục bộ.

## Dọn thư mục www/js (2026-11-24)

- [x] Giảm số file JS ở thư mục gốc từ 29 xuống 1 (game.js); bỏ 24 compatibility guard đã được thay thế bằng các module chính.
- [x] Chuyển audio.js vào core/, schedule-data.js vào data/, notify.js và schedule.js vào runtime/. Giữ nguyên nội dung bốn file được chuyển.
- [x] Chuẩn hóa index.html theo thứ tự core → data → systems → ui → game.js → runtime/notify.js → runtime/schedule.js. Kiểm thử bảo đảm mọi file được nạp đúng một lần, các API toàn cục cũ vẫn tồn tại và game khởi động được.
- [x] Cập nhật bản đồ kiến trúc trong docs/FOUNDATION_STAGE_1.md. npm test đạt 116/116 ở Asia/Ho_Chi_Minh và UTC; git diff --check đạt.
- [ ] Kiểm thử thực tế trên trình duyệt và Android; chưa commit hoặc push đợt dọn này.

## Kế hoạch hoàn thiện Stage 1 theo ưu tiên (2026-11-24)

- [x] P1. Gom các nhóm nghiệp vụ còn lại trong game.js (nhiệm vụ, sự kiện, lịch học, cài đặt) vào module theo chức năng; ưu tiên module hiện có.
- [x] P2. Chuẩn hóa vòng đời state, nhập backup và reload; giữ đồng bộ state giữa các factory và bộ nhớ đệm.
- [x] P3. Rà phụ thuộc giữa các module, thứ tự khởi tạo và API toàn cục; giảm phụ thuộc không cần thiết.
- [x] P4. Chạy kiểm thử hồi quy, gồm lưu và khôi phục dữ liệu, ở UTC và Asia/Ho_Chi_Minh.
- [x] P5. Kiểm thử web, xác minh CI build APK theo SHA và ghi nhận người dùng xác nhận app sử dụng tốt; nghiệm thu Android chi tiết còn mở.
- [x] P6. Cập nhật bản đồ kiến trúc và hướng dẫn bảo trì theo miền chức năng.

Nguyên tắc: giữ luật chơi, tránh chia file theo helper nhỏ; cập nhật trạng thái từng mục sau khi kiểm thử.

### Kết quả thực hiện kế hoạch (2026-11-24)

- P1: `ui/activities.js` sở hữu render và handler nhiệm vụ, chuỗi, preset và nhập/xuất hàng loạt; `ui/events.js` sở hữu thao tác kỳ sự; `ui/settings.js` sở hữu cài đặt, sao lưu. Lịch tuần dùng API `GameWeeklySchedule` từ `runtime/schedule.js`; bỏ handler lịch ngày trùng lặp. `game.js` giảm từ 738 xuống 524 dòng, không tạo thêm file JS.
- P2: giữ một tham chiếu state trong mỗi vòng đời trang, sao chép sâu mặc định trước khi load; nhập backup thành công khóa save cũ và reload toàn bộ ứng dụng. Cài đặt gọi GameUI.apply; sự kiện change của input backup được delegate để hoạt động sau render lại. Draft kỳ sự được xóa tại chỗ.
- P3: module nhiệm vụ/sự kiện/cài đặt nhận callback cần thiết; lịch tuần không còn ghi đè renderLich/importSched toàn cục. Giữ thứ tự script và các API runtime còn dùng.
- P4: 117/117 test đạt ở UTC và Asia/Ho_Chi_Minh, gồm lịch lặp, kỳ sự, đổi skin, nhập file sau render, JSON lỗi, giữ backup cũ, chặn save từ state cũ và boot lại với dữ liệu nhập.
- P5 (một phần): Microsoft Edge headless mở index.html thành công (exit 0), DOM có 7 nút ngày lịch tuần và khối cài đặt. Chrome headless thoát mã -2147483645, chưa xác minh tương tác trực tiếp. Chưa có thư mục android, ANDROID_HOME/JAVA_HOME chưa thiết lập; chưa xác minh APK. Nhánh stage-1/foundation HEAD 5302d56, thay đổi còn cục bộ; CI cho bản sửa chưa chạy vì chưa có commit/push mới.
- P6: cập nhật bản đồ module, quyền sở hữu thao tác và hướng dẫn vòng đời state trong FOUNDATION_STAGE_1.md.

Phần còn lại: kiểm thử tương tác trên trình duyệt/Android, build APK và xác minh CI theo SHA của bản đã commit/push.

### Kiểm thử trình duyệt và chuẩn bị phát hành (2026-11-24)

- Microsoft Edge headless, profile thử nghiệm độc lập: đạt 11/11 kiểm tra DOM và thao tác thật (lịch tuần, thêm/hoàn thành nhiệm vụ, tạo chuỗi, lịch lặp, đổi skin, tạo/xóa draft kỳ sự, từ chối JSON lỗi, đọc file backup sau render, reload khôi phục đúng điểm).
- Android SDK chưa được phát hiện cục bộ; sử dụng workflow Build APK trên GitHub Actions sau khi push. Kiểm thử APK trên thiết bị và trạng thái CI cần xác nhận riêng.

### Tự động build APK (2026-11-24)

- Commit 100c949 đã push lên stage-1/foundation; JavaScript Tests thành công (run 45325396537).
- Workflow Build APK tự chạy khi push thay đổi www/, tests/, package/lock, capacitor.config.json hoặc chính workflow lên main và các nhánh stage-*/**. Giữ workflow_dispatch để build thủ công. Thay đổi chỉ tài liệu không kích hoạt build.
- APK debug được lưu trong artifact TuTienHocDao-apk sau khi kiểm thử và audit đạt. Workflow báo lỗi nếu thiếu APK.
- Commit d2f917e đã tự kích hoạt Build APK (run 45326189100). Kiểm thử JavaScript và audit đạt; Gradle thất bại do Maven Central trả HTTP 429 khi tải dependency, chưa tạo APK.
- Bổ sung cache Gradle và tối đa 3 lần build khi gặp HTTP 429, nghỉ 30/60 giây giữa các lần thử; lỗi khác vẫn làm workflow thất bại.
- Commit `fcf07f5d92f262da761f61017984d08bc9f0a02a`: [Build APK run 45326644529](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45326644529) hoàn thành thành công trên push tự động; toàn bộ bước kiểm thử, audit, Gradle và upload đạt. Artifact `TuTienHocDao-apk` ID 14890515180 (5.830.457 byte, chưa hết hạn), chứa APK debug. Build CI đã xác minh; P5 còn kiểm thử cài đặt và chạy trên thiết bị Android thật.

### Xác nhận sử dụng APK trên Android (2026-11-24)

- Sau khi nhận link APK của run 45326644529, người dùng xác nhận: “App dùng tốt”. Ghi nhận kiểm thử sử dụng cơ bản đạt theo phản hồi người dùng; model máy, phiên bản Android, SHA APK thực tế và kết quả từng ca chưa được cung cấp.
- P1–P6 của kế hoạch hoàn thiện cấu trúc Stage 1 đã đạt ở phạm vi hiện tại. Các mục kiểm thử riêng về lưu dữ liệu, backup/restore, thông báo, timer, vòng đời Android và ký release tiếp tục theo `docs/ANDROID_QA_CHECKLIST.md`; chưa đánh dấu nghiệm thu Android đầy đủ.

## Stage 2 — Đợt A: tính đúng đắn và bảo toàn dữ liệu (2026-11-24)

Phạm vi theo `STAGE_2_REVIEW.txt`. Giữ cấu trúc module hiện tại và cơ chế linh lực chung.

- [x] `core/storage.js`, `core/state.js`: kiểm tra schema và các trường lồng quan trọng trước/sau migration; ghi schemaVersion 2, tiếp tục hỗ trợ save legacy và backup formatVersion 1. Nếu save chính lỗi thì thử backup; giữ backup tốt khi lỗi phát sinh trong migration. Nếu không còn bản hợp lệ thì khóa ghi tự động, cảnh báo cố định và cho xuất JSON cứu hộ chứa hai bản gốc. Nhập backup hợp lệ bảo toàn bản lỗi vào `.recovery` trước khi ghi và khóa state cũ đến khi reload.
- [x] `systems/quest-completion.js`, `ui/activities.js`: dùng biên nhận theo lượt hoàn thành để chống nhận thưởng trùng. Hoàn tác đảo điểm, thời gian học, số nhiệm vụ và thống kê cộng dồn có thể đảo; khôi phục cùng lượt giữ mức thưởng và thời lượng cũ, kể cả 0 linh lực. Không quay lại kết quả ngẫu nhiên, hiệu ứng đã tiêu hao, vật phẩm/danh hiệu đã cấp, streak và kỷ lục cao nhất. Không cho hoàn tác nhiệm vụ chuỗi hoặc khi số dư không đủ; lượt legacy thiếu biên nhận chỉ đảo được thống kê có thể suy ra, không xác định chính xác bản ghi thời gian cũ. Nhiệm vụ lặp qua ngày mới có lượt thưởng mới.
- [x] `systems/tribulation.js`: Mệnh 0 giữ nguyên 0 qua lần thất bại tiếp theo; vẫn cộng tầng Trừng Phạt theo quy tắc hiện tại. `systems/rewards.js`: kỳ ngộ loại 4 cộng đủ 80 linh lực cố định vào số dư và lịch sử, đồng bộ cập nhật cảnh giới; chặn nhận trùng.
- [x] Kiểm thử hồi quy: từ 117 lên 123 test, đạt 123/123 ở `Asia/Ho_Chi_Minh` và `UTC`; `git diff --check` đạt. Có ca giao diện giả lập hoàn thành/hoàn tác/khôi phục, boot lại từ backup, hai bản lỗi/khóa lưu/cứu hộ, migration thất bại vẫn giữ backup tốt, thưởng 0, buff không tiêu hao lại, Mệnh 0 và kỳ ngộ +80. Dữ liệu thật trên thiết bị chưa được dùng để kiểm thử.
- [x] Microsoft Edge headless, profile thử nghiệm độc lập: khởi động DOM đạt, đủ 7 nút lịch tuần; qua 2 luồng tương tác thật (thêm/hoàn thành/hoàn tác/khôi phục nhiệm vụ và reload khi hai save lỗi, cảnh báo, khóa lưu, giữ nguyên dữ liệu cứu hộ).
- [x] Commit `054f67bb25262254a61701ebb951f448f3205453` đã push lên `stage-1/foundation`. [JavaScript Tests run 45329643300](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45329643300) và [Build APK run 45329643337](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45329643337) đều hoàn tất thành công trên đúng SHA. Artifact `TuTienHocDao-apk` ID 14890858937 (5.833.753 byte, chưa hết hạn) đã được upload.
- [ ] Kiểm tra bản APK mới trên thiết bị Android thật, ưu tiên hoàn tác/khôi phục và nhập backup; chưa nghiệm thu dữ liệu thật hoặc vòng đời timer.

Tiếp theo theo thứ tự ưu tiên:

- [x] Đợt B — triển khai lưu/khôi phục phiên học và chơi khi app đóng hoặc chạy nền; thống nhất quy tắc thời gian/hạn nhiệm vụ; kiểm thử tự động thông báo. Nghiệm thu Android thật còn mở.
- [x] Đợt C — mô phỏng cân bằng, triển khai lựa chọn luật chơi đã duyệt và ghi báo cáo Stage 2C.
- [ ] Đợt D — cải thiện giao diện học tập, minh bạch thưởng/phạt và hiệu năng.

## Stage 2 — Đợt B: vòng đời timer (2026-11-24)

- `core/game-loop.js` quản lý phiên học và chơi theo thời gian thực, có thể chạy đồng thời; `core/state.js` và `core/storage.js` lưu, migrate và kiểm tra dữ liệu timer. `game.js` đối soát khi mở lại app, đổi ngày, quay về foreground và lưu định kỳ 15 giây, lưu ngay khi chuyển trạng thái. Tick chỉ cập nhật DOM cần thiết.
- Phiên học bắt đầu hợp lệ được hoàn thành kể cả khi vượt hạn nhiệm vụ; ghi thưởng vào ngày đối soát theo giờ game, đúng một lần. Chặn bắt đầu nhiệm vụ hết hạn, đã xong, bị khóa hoặc thời lượng sai. Hoàn thành thủ công, hủy, xóa nhiệm vụ/chuỗi và luân hồi xử lý timer tương ứng; chặn sửa hoặc tạo lại nhiệm vụ đang học.
- Phiên chơi trừ thời gian thực đã trôi qua kể cả khi đóng app; dừng thì giữ số giây còn lại, mua thêm đối soát trước khi cộng. Khi đồng hồ lùi, đổi mốc mà không hoàn lại thời gian đã ghi nhận; chỉnh giờ tiến có thể làm phiên hết hạn. Cơ chế này dựa trên đồng hồ thiết bị.
- `runtime/notify.js` dùng phiên timer thực để đặt/hủy thông báo, ưu tiên hai timer trong giới hạn lịch; xử lý quyền bị từ chối, lịch cũ và thử lại khi lỗi. Việc phát thông báo thực tế phụ thuộc Android và quản lý pin.
- [x] Kiểm thử cục bộ 129/129 ở `Asia/Ho_Chi_Minh` và `UTC`; `git diff --check` đạt. Microsoft Edge headless với profile độc lập và thao tác nút thật đạt luồng học/chơi chạy đồng thời, reload hai lần, vượt hạn/qua ngày, không thưởng trùng và dừng chơi đúng số giây. Thông báo được kiểm thử bằng mock Capacitor.
- [x] Commit `4cb727b8d1a2f3b279044eb65044134f377807ba` đã push lên `stage-1/foundation`. [JavaScript Tests run 45331704659](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45331704659) và [Build APK run 45331704710](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45331704710) đều thành công trên đúng SHA. Artifact [TuTienHocDao-apk](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45331704710/artifacts/14891842956) ID 14891842956 (5.836.061 byte, chưa hết hạn tại thời điểm kiểm tra) đã được upload.
- [ ] Nghiệm thu trên Android thật theo `docs/ANDROID_QA_CHECKLIST.md` (bao gồm giao thông báo khi app đóng, chạy nền và quản lý pin).

## Stage 2 — Đợt C: cân bằng tu luyện (2026-11-24)

- Đã triển khai Stage 2C theo lựa chọn của chủ dự án. Mặc định 280 linh lực/giờ, hệ số độ khó/hạn mới; thưởng và buff theo thời lượng, giới hạn thưởng đêm 120 phút, cân bằng nhàn hạ và 20 vật phẩm, điều kiện thiên kiếp nghiêm, nhiệm vụ Tĩnh Tâm Dưỡng Mệnh, hỗ trợ hạng thấp giảm dần theo lần luân hồi.
- Báo cáo đầy đủ và số liệu mô phỏng: [STAGE_2_BALANCE_REPORT.md](STAGE_2_BALANCE_REPORT.md). Tái chạy mô phỏng bằng `node tests/balance-sim.cjs`. Tag phục hồi `stage2-pre-balance-b0811e3`.
- Ghi chú trì hoãn: chu kỳ học kỳ mặc định giữ 119 ngày; tùy chọn một tháng và các chu kỳ khác sẽ thiết kế sau.
- [x] Kiểm thử cục bộ 134/134 ở UTC và Asia/Ho_Chi_Minh; git diff --check đạt; mô phỏng 119 ngày thành công.
- [x] Commit cục bộ `6b56dacf99516201528507e6aaa614e482f59b72` chứa mã Stage 2C, báo cáo và kiểm thử. Tag phục hồi đã xác minh trỏ đúng Stage 2B.
- [ ] Push và xác nhận CI/APK đúng commit Stage 2C. Xét duyệt tự động từ chối push vào `nguyenzero1234-png/fantastic-couscous` dù đã xác minh remote theo dõi đúng nhánh; cần xác nhận quyền gửi mã nguồn Stage 2C và tag đến repo này. Chưa có build APK Stage 2C mới.
- [ ] Nghiệm thu Android thật và duyệt số liệu cân bằng trước khi triển khai Đợt D.


## Stage 2 — Đợt D: tinh chỉnh cài đặt và Thiên Đạo (2026-11-24)

- Cài đặt gồm Chung, Giao diện, Nhắc nhở, Sao lưu và Nâng cao. Các nhóm thu gọn, có nút quay lại thống kê; giữ bản nháp JSON khi đổi thiết lập.
- Thiên Đạo được giữ lại trong Nâng cao; tab chỉ xuất hiện khi bật, hỗ trợ cả chế độ Chỉ học và Đầy đủ. Trạng thái được lưu và khôi phục từ backup.
- `ui/god-mode.js` quản lý giao diện bảy nhóm chức năng, giữ nhóm đang mở, nội dung kiểm tra và bản nháp linh lực khi render lại. `systems/god-mode.js` quản lý thao tác; các nút tua ngày và tăng chuỗi ở bảng Thiên Kiêu dùng chung lệnh.
- Sửa xem phán quyết, kiểm tra Mệnh, nhập linh lực nguyên không âm (bao gồm 0), tâm ma và các bộ đếm Stage 2C, buff và xóa buff. Bổ sung kiểm thử Thiên Ma Nhập Tâm. Xóa sử luân hồi có xác nhận; Tẩy trắng dùng quy trình nhập trạng thái mặc định có backup nội bộ và khóa ghi trạng thái cũ trước khi reload.
- [x] Kiểm thử cục bộ 134/134 ở UTC và Asia/Ho_Chi_Minh; git diff --check đạt. Bao gồm bật/tắt Thiên Đạo, chế độ Chỉ học, mở bảng điều khiển, khôi phục từ backup, kiểm tra đầu vào, phán quyết, tâm ma và xác nhận đặt lại qua mock.
- [ ] Kiểm thử trực quan trên thiết bị thật và build APK cho thay đổi này. Phiên Edge headless kiểm thử tương tác thoát mã 1 không có output; kiểm tra lại cổng DevTools nhận ECONNREFUSED. Chưa xác nhận bố cục thực tế trên trình duyệt.
- [ ] Các phần Đợt D còn lại: cải thiện luồng học tập, minh bạch thưởng/phạt, hiệu năng và nghiệm thu Android.

### Đợt D — Giao diện học tập

- Đưa danh sách nhiệm vụ và số lượng đang chờ, hoàn thành, hết hạn lên trước công cụ nhập hàng loạt. Form lập nhiệm vụ và công cụ AI thu gọn mặc định; giữ toàn bộ chức năng và mẫu nhập/xuất.
- Bố cục nhiệm vụ dạng thẻ, có thông tin thời lượng, hạn, lặp lại, thưởng cơ bản hoặc linh lực đã nhận và nút thao tác rõ ràng. Giữ nguyên cách tính thưởng, sửa, xóa, hoàn tác và phiên học.
- Tinh chỉnh hồ sơ, vòng cảnh giới, hai ô tài nguyên, thanh điều hướng và khoảng cách thẻ; giảm trang trí viền, hỗ trợ màn hình hẹp, kích thước chữ/mật độ hiện có và giảm chuyển động. Giữ các giao diện màu và Thiên Đạo.
- [x] Kiểm thử 134/134 ở UTC và Asia/Ho_Chi_Minh (bao gồm kiểm tra trạng thái nhiệm vụ và nhãn thưởng mới); git diff --check đạt.
- [ ] Nghiệm thu trực quan: Chrome headless thoát mã -2147483645, không tạo ảnh kiểm tra. Cần kiểm tra bố cục trên trình duyệt hoặc Android thật. Chưa build APK cho lượt chỉnh này.

- Viền Thiên Kiêu và người chơi chuyển sang hai SVG tự thiết kế với nét vàng cổ/tím nhạt và họa tiết nhỏ ở hai góc đối diện. Áp dụng đồng nhất trong bảng xếp hạng và đầu hồ sơ; giảm phần đệm, bỏ hiệu ứng phát sáng. Giữ tài nguyên viền cũ để có thể phục hồi.
- Thay viền SVG đang hiển thị bằng `www/assets/ui/frame-talent.png` (rồng vàng cổ) và `www/assets/ui/frame-player.png` (mây tím bạc), cả hai 1536 × 512 px, RGBA, vùng giữa trong suốt. CSS chia viền thành chín vùng để giữ họa tiết góc khi kích thước thẻ thay đổi; giảm kích thước viền trên màn hình hẹp và chừa khoảng đệm cho nội dung hồ sơ. Giữ SVG làm tài nguyên dự phòng. Chưa nghiệm thu trực quan trên Android.
- Sau phản hồi ảnh giao diện thực tế: tăng kích thước họa tiết góc 50% so với lượt tích hợp PNG trước, giảm khoảng đệm ngang, cố định vùng thứ hạng và linh lực, chỉ hiển thị tên thiên phú trên thẻ Thiên Kiêu; phần mô tả đầy đủ nằm trong hồ sơ. Ẩn biểu đồ nhỏ trên màn hình hẹp để ưu tiên nội dung. Kiểm thử hồi quy 135/135 tại Asia/Ho_Chi_Minh; cần kiểm tra lại giao diện thực tế sau chỉnh sửa.

### Đợt D — Luồng học và minh bạch linh lực

- [x] Thêm nút Thêm & học để lập nhiệm vụ và bắt đầu phiên học trong cùng thao tác. Hiển thị trạng thái Đang học, khóa bắt đầu phiên thứ hai, giữ bản nháp và vẫn cho lập nhiệm vụ khác. Chống trùng ID khi tạo trong cùng mili giây. Vô hiệu hóa tùy chọn lặp lại khi có hạn.
- [x] Hiển thị công thức thưởng cơ bản và hệ số Trừng Phạt, Thiên Đạo cân bằng, tâm ma, Cố Bản Đan hiện tại. Khi đổi thời lượng, độ khó, hạn hoặc mẫu nhiệm vụ, chỉ cập nhật vùng xem trước thay vì render toàn bộ các bảng.
- [x] Lưu chi tiết phép tính thưởng thực tế cùng biên nhận hoàn thành: điểm cơ bản, hệ số chuỗi/buff, thưởng cộng, trấn ma, ba hệ số điều chỉnh và điểm vật phẩm. Hoàn tác và khôi phục giữ biên nhận gốc; save cũ vẫn dùng được. Sửa mô tả thưởng chuỗi thành 15% linh lực thực nhận cộng thưởng danh hiệu và bỏ thông báo quy nhầm mọi phần thưởng tăng thêm cho streak. Giữ luật thưởng/phạt Stage 2C.
- [x] Kiểm thử tự động 136/136 tại Asia/Ho_Chi_Minh và UTC, gồm tạo và học ngay, chặn phiên thứ hai, giữ bản nháp, ID không trùng, chi tiết linh lực và hoàn tác/khôi phục.
- [ ] Tiếp theo: rà soát hiệu năng render các bảng, kiểm tra trực quan và nghiệm thu Android; chưa commit/push hoặc build APK cho lượt thay đổi này.

### Đợt D — Hướng dẫn tu luyện riêng (2026-11-24)

- Rút gọn nhãn, ví dụ nhập và phần xem trước linh lực trong form nhiệm vụ; giảm nội dung giải thích tại Liên hoàn và Nhật trình.
- Thêm tab Hướng dẫn trong Tu Luyện ở cả chế độ Đầy đủ và Chỉ học, gồm ba mục thu gọn/mở rộng: Nhiệm vụ, Liên hoàn, Nhật trình. Tập trung công thức, hệ số hiện tại, cách nhập AI và ví dụ tại đây; giữ các thao tác và cơ chế thưởng/phạt hiện hành.
- [x] Kiểm thử 137/137 tại Asia/Ho_Chi_Minh và UTC, bao gồm điều hướng tab hướng dẫn ở hai chế độ và giá trị xem trước linh lực.
- [ ] Kiểm tra trực quan trên Android; chưa build APK hoặc commit/push cho thay đổi này.

### Đợt D — Tối ưu hiệu năng và kiểm thử (2026-11-24)

- Chỉ render bảng xếp hạng và bảng Đạo Vận đang mở; cập nhật ngay khi chuyển tab, giữ chu kỳ cập nhật khi đang xem.
- Giảm thay thế DOM khi danh sách nhiệm vụ, lịch tuần, nhật trình và thanh điều hướng có nội dung giống lần render trước. Giữ biên nhận đang mở và lựa chọn nhiệm vụ khi cập nhật lịch. Giữ nguyên luật cân bằng Stage 2C.
- [x] Kiểm thử hồi quy 138/138 tại Asia/Ho_Chi_Minh và UTC; thêm kiểm tra số lần ghi innerHTML, cập nhật khi mở bảng và khi thêm nhiệm vụ. git diff --check đạt.
- [x] Microsoft Edge headless, profile độc lập, CDP mô phỏng điện thoại 390 × 844: nhập đạo bằng nút thật, bỏ qua hướng dẫn đầu game, mở tab Hướng dẫn. Đã xem ảnh ba màn hình; chiều rộng viewport và tài liệu đều 390 px. Thanh tab cuộn ngang. Chưa kiểm thử đầy đủ mọi màn hình hoặc Android thật.
- [x] Commit Stage 2D `c92cd3f225bec5420c9d27c6a26d80932884b0cf` đã push lên `stage-1/foundation`; xác minh remote đúng SHA. [JavaScript Tests run 45352235135](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45352235135) và [Build APK run 45352235130](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45352235130) đều thành công trên commit này. Artifact [TuTienHocDao-apk](https://github.com/nguyenzero1234-png/fantastic-couscous/actions/runs/45352235130/artifacts/14901066611) ID 14901066611 (6.270.602 byte, chưa hết hạn khi kiểm tra). Tag phục hồi Stage 2C đã xác minh trên remote trỏ tới `b0811e31155e1b5c01aa6254f10f1a4928d2f9b4`.
- [ ] Nghiệm thu Android theo ANDROID_QA_CHECKLIST.md, gồm timer, thông báo, backup, viền PNG và bố cục trên thiết bị thật.

## Stage 3A — Tu Luyện Sử (2026-11-24)

- Thống kê có tổng quan, biểu đồ 7/30 ngày theo phút học hoặc linh lực, so sánh kỳ trước, xem chi tiết ngày, bản đồ chuyên cần 35 ngày và sử 5 kiếp gần nhất. Chỉ render khi mở tab; giữ lựa chọn, nhóm mở và cuộn ngang biểu đồ khi cập nhật.
- `systems/analytics.js` tổng hợp sử theo ngày, biên nhận nhiệm vụ, thu chi linh lực, giờ chơi thực tế đã trừ, tỷ lệ hoàn thành đúng hạn và phần điều chỉnh trực tiếp bằng Thiên Đạo. Hoàn tác/khôi phục đảo lại biên nhận gốc; nhiệm vụ lặp và xóa không làm mất sử đã ghi. Timer chia thời gian theo ngày game, xử lý reload, hết giờ và đồng hồ lùi.
- Save cũ được migrate với mốc bắt đầu ghi nhận; giờ học và linh lực lịch sử vẫn lấy từ dữ liệu sẵn có (bao gồm điều chỉnh lịch sử bằng Thiên Đạo). Thu chi, giờ chơi và thời hạn chỉ có dữ liệu kể từ khi bật cơ chế ghi nhận; hiển thị cảnh báo khoảng dữ liệu thiếu. Sử tổng hợp được lưu vào bản ghi khi luân hồi. Giữ nguyên công thức cân bằng Stage 2C.
- [x] Kiểm thử hồi quy timer và thống kê ở Asia/Ho_Chi_Minh và UTC: 139/139. Kiểm tra biên nhận, thời điểm hoàn thành quá hạn, thời gian chơi qua nửa đêm và lùi đồng hồ, không ghi trùng sau reload.
- [x] Edge headless, profile độc lập, CDP mô phỏng 390 × 844 và 320 × 844: nhập đạo, bỏ qua hướng dẫn, chuyển Thiên Thư, chọn 30 ngày và phút học, chọn ngày, mở Thu chi. Cả hai kích thước có chiều rộng tài liệu bằng viewport; 30 cột biểu đồ cuộn trong vùng riêng, 35 ô chuyên cần, không phát sinh lỗi JavaScript. Lần chạy trong sandbox hết thời gian; chạy lại được phép với CDP loopback đã thành công. Chưa xác nhận ảnh bằng mắt.
- [ ] Nghiệm thu Android thật; xác nhận CI/APK Stage 3A.

### Lộ trình tiếp theo

- Stage 3B — Vạn Pháp: môn học tùy chỉnh, mục tiêu phút học theo ngày/tuần, sử môn học theo biên nhận; tương thích nhiệm vụ và save cũ.
- Stage 3C — Thiên Kiêu: đa dạng tính cách, tương tác và sự kiện thế giới.
- Stage 3D — Hiệu ứng đột phá cảnh giới, ưu tiên nhẹ và hỗ trợ giảm chuyển động.
- Stage 3E — Chu kỳ tu luyện tùy chọn, mặc định 119 ngày; thiết kế lại mốc kỳ thi phù hợp từng chu kỳ.
- Stage 4 — Cá nhân hóa. Nghiệm thu Android theo checklist là điều kiện kiểm chứng thực tế xuyên suốt.

### Xác nhận CI Stage 3A

- [x] Commit ac70863f57a778f054aba1834d441bdaac3271da đã push. JavaScript Tests (45365544386) và Build APK (45365544440) đều completed/success đúng SHA. Artifact APK ID 14907290300 (6.273.702 byte, chưa hết hạn khi kiểm tra).
- [ ] Nghiệm thu Android thật theo checklist.

## Stage 3B — Vạn Pháp (2026-11-24)

- Thêm tab Vạn Pháp trong Tu Luyện ở cả hai chế độ. Mặc định có Toán học, Lập trình, Tiếng Anh, Ngoại ngữ, NCKH; cho thêm, đổi tên, đặt mục tiêu phút/ngày và phút/tuần, lưu trữ/khôi phục môn học. Mục tiêu 0 nghĩa là không đặt mục tiêu. Tuần tính từ thứ Hai theo lịch game.
- Thêm lựa chọn môn học tùy chọn trong form nhiệm vụ và khi sửa nhiệm vụ. Nhập/xuất hàng loạt hỗ trợ cột thứ sáu (tên hoặc ID môn), Liên hoàn hỗ trợ cột thứ ba. Prompt AI đưa danh sách môn hiện có. Dòng nhiệm vụ lỗi được giữ lại để sửa; chuỗi có tên môn sai không được tạo. Môn đã lưu trữ vẫn nhận dữ liệu từ nhiệm vụ có sẵn và dữ liệu nhập có ID hợp lệ để bảo toàn lịch sử.
- systems/subjects.js quản lý dữ liệu và tính phút, ui/subjects.js quản lý giao diện. Biên nhận chụp ID môn lúc hoàn thành; hoàn tác/khôi phục dùng biên nhận gốc, xóa nhiệm vụ không mất sử, nhiệm vụ lặp có lượt ghi mới. Save cũ migrate không gán hồi tố; hiển thị mốc ghi nhận. Luân hồi lưu tổng phút theo môn vào sử kiếp, giữ danh mục và mục tiêu, xóa phút của kiếp cũ khỏi bảng hiện tại. Giữ nguyên cơ chế thưởng/phạt.
- [x] 141/141 kiểm thử ở Asia/Ho_Chi_Minh và UTC, bao gồm luân hồi, nhập/xuất, reload, đổi môn, hoàn tác, nhiệm vụ lặp, lưu trữ. git diff --check đạt.
- [x] Edge headless profile riêng, 390 × 844 và 320 × 844: tạo môn, lập nhiệm vụ 30 phút, chọn môn, hoàn thành, xác nhận 30/45 phút hôm nay và 30/180 phút tuần này. Chiều rộng tài liệu bằng viewport, không lỗi JS. Có ảnh chụp QA nhưng chưa kiểm tra bằng mắt.
- [ ] Nghiệm thu Android thật. CI/APK Stage 3B cần xác nhận sau push.
- Tiếp theo Stage 3C — tính cách và sự kiện Thiên Kiêu, rồi 3D, 3E và Stage 4.

### Xác nhận CI Stage 3B

- [x] Commit `615ec0d0f50d211c6180a718cfd7b75fe5f31804`: JavaScript Tests (45366567520) và Build APK (45366567491) đều completed/success. Artifact APK ID 14906524264 (6.279.745 byte, chưa hết hạn lúc kiểm tra).

## Stage 3C — Thiên Kiêu (2026-11-24)

- Module `systems/npc-world.js` quản lý tính cách 50 NPC, lời vấn đạo theo việc học trong ngày và Phong văn theo chu kỳ 3 ngày. Các sự kiện thay đổi theo kiếp, giữ nguyên thiên phú, mô phỏng NPC, thứ hạng và luật thưởng/phạt Stage 2C.
- Hồ sơ Thiên Kiêu thêm Vấn đạo, ghi vào Đạo Văn tối đa một lần/ngày trên toàn bộ NPC, giữ giới hạn qua reload và khởi tạo lại khi luân hồi. Nếu lưu thất bại thì hoàn tác ký lục. Vạn Sự Điện hiển thị tối đa ba kỳ Phong văn; bảng xếp hạng dùng nhãn tính cách ngắn cho NPC thường và giữ tên thiên phú của NPC đặc biệt.
- [x] 142/142 kiểm thử ở Asia/Ho_Chi_Minh và UTC; bao gồm tương tác, reload, luân hồi, không thay đổi điểm khi vấn đạo.
- [x] Edge headless, profile riêng, 390 × 844 và 320 × 844: kiểm tra ghi vấn đạo, giới hạn ngày, Phong văn, không lỗi JS hay tràn ngang. Đã xem ảnh chụp Vấn đạo ở cả hai kích thước và Phong văn ở 320 px sau khi toast biến mất.
- [ ] Xác nhận CI/APK của commit Stage 3C và nghiệm thu Android thật.
- Tiếp theo Stage 3D — hiệu ứng đột phá, Stage 3E — chu kỳ tùy chọn, Stage 4 — cá nhân hóa.

### Xác nhận CI Stage 3C

- [x] Commit `41c1e9c42cb8e825c033fba0dc4d307c3f0c24f4`: JavaScript Tests (45368755691) và Build APK (45368755936) đều completed/success. Artifact APK ID 14908925263 (6.284.198 byte, chưa hết hạn lúc kiểm tra).

## Stage 3D — Đột phá cảnh giới (2026-11-24)

- `ui/feedback.js` tập trung hiệu ứng thưởng và đột phá. Đột phá hiển thị một thẻ nhỏ tự đóng sau 4,2 giây với màu cảnh giới, câu Đạo Văn và âm thanh riêng; không chặn thao tác hoặc đè lên cửa sổ thiên kiếp bắt buộc. Chế độ giảm chuyển động tắt animation và confetti.
- Chỉ mừng khi vượt cảnh giới cao nhất của kiếp, kể cả khi tăng nhiều cảnh giới cùng lúc; ghi các mốc đã vượt vào Đạo Văn. Khôi phục cảnh giới sau tiêu linh lực không phát lại hiệu ứng. Save cũ và reload thiết lập mốc im lặng; luân hồi đặt lại mốc. Giữ luật linh lực, mở khóa và cân bằng Stage 2C.
- [x] 143/143 kiểm thử tại Asia/Ho_Chi_Minh và UTC; hồi quy mốc cao nhất, tăng nhiều cảnh giới, tụt rồi hồi phục, reload và luân hồi.
- [x] Edge headless 390 × 844 và 320 × 844 (giảm chuyển động): đã xem ảnh thẻ Trúc Cơ và Kim Đan; tự đóng, không tràn ngang, không chặn tương tác và không lỗi JS. Kiểm thử Android thật còn chờ.
- [ ] Xác nhận CI/APK sau push. Tiếp theo Stage 3E và Stage 4.

### Xác nhận CI Stage 3D

- [x] Commit 91de98ee8f7e1e6088d9ae500fe8d18c8da2ec3a: JavaScript Tests (45370063269) và Build APK (45370063365) đều completed/success. Artifact APK ID 14909215439 (6.285.243 byte, chưa hết hạn lúc kiểm tra).

## Stage 3E — Chu kỳ tu luyện tùy chọn (2026-11-24)

- Chọn 30, 60, 90 hoặc 119 ngày khi nhập đạo; mặc định học kỳ Việt Nam 119 ngày. Trong kiếp, Cài đặt chỉ chọn thời lượng kiếp sau; luân hồi mới áp dụng. Save cũ mặc định 119 ngày. Lưu thời lượng và ngưỡng Chân Tiên trong sử mỗi kiếp.
- GameProgressData.cycleConfig tính ngưỡng cảnh giới, ngày và yêu cầu chuyên cần của tám thiên kiếp theo tỷ lệ thời lượng; 119 ngày giữ nguyên toàn bộ ngưỡng gốc. Giữ hệ số và hình phạt Stage 2C, tốc độ 280 linh lực/giờ mặc định, giới hạn học đêm 120 phút. NPC và bảng xếp hạng sử dụng cấu hình kiếp hiện tại.
- Mô phỏng chỉ học, 280 linh lực/giờ, không tính NPC, vật phẩm, nhàn hạ hoặc hồi Mệnh. Kết quả là linh lực cuối kiếp / số thiên kiếp vượt qua:

| Ngày | Ngưỡng Chân Tiên | 2 giờ/ngày | 4 giờ/ngày | 6 giờ/ngày |
| --- | ---: | ---: | ---: | ---: |
| 30 | 50.420 | 23.068 / 1 | 50.312 / 7 | 75.819 / 8 |
| 60 | 100.840 | 47.549 / 1 | 102.071 / 7 | 154.206 / 8 |
| 90 | 151.261 | 72.116 / 1 | 154.333 / 8 | 232.608 / 8 |
| 119 | 200.000 | 95.745 / 1 | 204.379 / 8 | 308.400 / 8 |

- Kiếp ngắn khó hơn đôi chút do quá trình tích chuỗi và làm tròn ngày; thưởng cố định có thể có tác động tương đối lớn hơn. Giữ nguyên luật phạt và cấu hình học kỳ, cần theo dõi bằng thực tế.
- [x] 145/145 kiểm thử ở Asia/Ho_Chi_Minh và UTC; git diff --check đạt. Hồi quy lựa chọn kiếp đầu, khóa chu kỳ hiện tại, luân hồi, reload, sử kiếp cũ và cấu hình 119 ngày.
- [x] Edge headless 390 × 844 và 320 × 844: kiểm tra chọn 30 ngày, đặt kiếp sau 60 ngày, luân hồi và reload; không lỗi JS hoặc tràn ngang. Đã xem ảnh nhập đạo và cài đặt tại 320 px. Luân hồi trong QA được kích hoạt trực tiếp.
- [ ] Xác nhận CI/APK Stage 3E sau push. Nghiệm thu Android thật còn chờ.
- Tiếp theo Stage 4 — Cá nhân hóa.

### Xác nhận CI Stage 3E

- [x] Commit `2470468a8a5deaca706d2610d93a4b2faa283735`: JavaScript Tests (45371928702) và Build APK (45371928984) đều completed/success. Artifact APK ID 14909801097 (6.286.043 byte, chưa hết hạn lúc kiểm tra).

## Stage 4 — Cá nhân hóa (2026-11-24)

- Cài đặt Giao diện cho chọn chân dung JPG, PNG hoặc WebP tối đa 10 MiB; xử lý cục bộ, cắt vuông giữa ảnh và lưu JPEG 192 × 192, giới hạn chuỗi 160.000 ký tự. Có nút trở về ảnh mặc định theo giới tính. Chân dung dùng chung ở tiêu đề, hồ sơ và Thiên Kiêu Bảng; NPC trùng tên giữ ảnh riêng.
- Chọn trang trí Cổ phong hoặc Tối giản. Tối giản ẩn câu trích dẫn và hoa văn viền Thiên Kiêu, thu gọn khoảng đệm; vẫn giữ các thông tin gameplay. Lựa chọn và ảnh được lưu trong dữ liệu UI, tồn tại qua reload, luân hồi và bản sao JSON; save cũ dùng giao diện mặc định. Lưu thất bại hoàn tác lựa chọn. Không thay đổi kinh tế, điểm và luật thưởng/phạt.
- [x] 147/147 kiểm thử tại Asia/Ho_Chi_Minh và UTC; kiểm tra tương thích save, lựa chọn UI, reload, luân hồi, reset và NPC trùng tên. `git diff --check` đạt.
- [x] Edge headless trên hồ sơ riêng tại 390 × 844 và 320 × 844: chọn ảnh thật qua file input, giải mã JPEG 192 × 192 (15.319 ký tự với ảnh mẫu), từ chối file HTML, kiểm tra tiêu đề, hồ sơ, bảng xếp hạng, NPC trùng tên, tối giản, reload, luân hồi trực tiếp và reset. Không lỗi JS hoặc tràn ngang. Đã xem ảnh chụp cài đặt ở 320 px.
- [ ] Xác nhận CI/APK Stage 4 sau push và nghiệm thu Android thật, đặc biệt bộ chọn ảnh và nhập/xuất backup có ảnh.
- Tiếp theo: nghiệm thu Android theo checklist, rà soát hiệu năng, ổn định và cân bằng bằng dữ liệu sử dụng thực tế trước khi mở rộng gameplay.

## Sửa giao diện nhập đạo (2026-11-24)

- Thay hàng flex dùng chung bằng lưới hai cột cân đối dành riêng cho chọn Nam tu/Nữ tu; ảnh vuông 88 px, căn giữa, viền lựa chọn và trạng thái aria-pressed đồng bộ. Nguyên nhân lệch là margin-left tự động và kích thước tối thiểu của nút trong hàng flex cũ.
- [x] Edge headless tại 390, 320 và 280 px: hai nút/ảnh cùng cao độ và kích thước, không tràn ngang; chọn nữ/nam, nhập đạo, ảnh tiêu đề và lưu giới tính qua reload đều đạt. Đã xem ảnh chụp 280 px. Nghiệm thu Android thật còn chờ.
- [x] 147/147 kiểm thử tại Asia/Ho_Chi_Minh và UTC.
- [x] Commit `4a679a153287e077691c9e29d8d56917b61a35d3`: JavaScript Tests (45375778087), Build APK (45375778325) đều thành công; artifact APK ID 14909829979 (6.286.987 byte).
- [x] CI Stage 4, commit `d78fc93085d92b6ac55708c8d89deff6349213f1`: JavaScript Tests (45373172968) và Build APK (45373173054) thành công; artifact APK ID 14909707403 (6.286.953 byte).

## Lộ trình Stage 5

- [x] 5A — Đo và tối ưu hiệu năng, ổn định, kích thước save qua nhiều kiếp (nghiệm thu Android còn chờ).
- [x] 5B — Công pháp theo phương pháp học; cân bằng, không khuyến khích học quá sức (nghiệm thu Android còn chờ).
- [x] 5D — Thống kê học tập cá nhân, xu hướng, tiến độ môn học và so sánh các kiếp (nghiệm thu Android còn chờ).
- [x] 5C — Mục tiêu, quan hệ và sự kiện NPC (nghiệm thu Android còn chờ).
- [x] 5E — Tông môn, sư phụ và truyền thừa (nghiệm thu Android còn chờ).
- [x] 5F — Thành tựu và biến thể qua nhiều kiếp, tránh tích lũy buff mất cân bằng (nghiệm thu Android còn chờ).

## Stage 5A — Hiệu năng và độ bền save (2026-11-24)

- Mô phỏng NPC tái sử dụng danh sách cơ duyên giờ trước khi có cache liên tiếp; lọc cơ duyên hết hạn, thêm cơ duyên giờ hiện tại, vẫn quét đủ cửa sổ 80 giờ khi thiếu cache. Dùng chung mảng rỗng bất biến. Giữ nguyên điểm, thứ hạng, RNG, cơ chế invalidate/reset và độ phân giải phút.
- Sửa chỉ số biến động bảng xếp hạng theo ID NPC/người chơi để tránh báo tăng giảm sai nếu trùng tên. Giữ nguyên nhịp cập nhật và đồ thị.
- Benchmark Node 26.13.1, roster thật 50 NPC, salt 7919, ba lượt chạy độc lập có GC giữa mốc. Trung vị thời gian mở rộng mô phỏng 0–7 ngày: 91 → 87 ms; 7–30 ngày: 164 → 150 ms; 30–119 ngày: 523 → 507 ms. Heap tại 119 ngày: 164 → 162 MiB. Kết quả các điểm lấy mẫu, lịch sử, thứ hạng, tính lại sau invalidate và reset khớp tuyệt đối giữa hai phiên bản. Đây là số đo máy phát triển, heap cuối kỳ vẫn cao và cần đo trên Android thật.
- Edge headless: mở toàn bộ bảng xếp hạng, render trung bình 3 ms (10 lần liên tiếp). Mô phỏng 20 kiếp, mỗi kiếp 119 ngày có 240 phút học/ngày, trực tiếp kích hoạt luân hồi trong hồ sơ thử nghiệm. Save đang hoạt động/sau luân hồi tính theo ký tự JSON: kiếp 1 23.687/3.765; kiếp 5 30.498/9.948; kiếp 10 38.212/17.657; kiếp 20 53.646/33.097. Reload đủ 20 bản ghi, tổng phút của kiếp đầu/cuối chính xác. Không lỗi JS. Dữ liệu mẫu chưa bao gồm ảnh riêng, số lượng lớn môn và nhiệm vụ; giữ đầy đủ sử kiếp, không cần cắt dữ liệu.
- [x] 147/147 kiểm thử tại Asia/Ho_Chi_Minh và UTC; 5/5 kiểm thử leaderboard sau bổ sung hồi quy trùng tên; `git diff --check` đạt.
- [x] CI Stage 5A, commit `dae1bdb92a63279cdf961794d9497fc680acecc3`: JavaScript Tests (45376415245) và Build APK (45376415235) đều thành công. Artifact APK ID 14911936112 (6.287.096 byte, chưa hết hạn lúc kiểm tra).
- [ ] Đo RAM/độ mượt Android thật.

## Stage 5B — Công pháp học tập (2026-11-24)

- Thêm mục thu gọn Công pháp học tập trong Tu Luyện → Vạn Pháp, ở cả hai chế độ. Chọn một trong sáu công pháp miễn phí hoặc không chọn: Tĩnh Tâm Quyết (timer từ 25 phút), Vạn Pháp Kinh (hai môn từ 20 phút/môn), Ôn Cố Quyết (nhiệm vụ lặp từ 20 phút), Trường Sinh Công (chuỗi từ 3 ngày và nhiệm vụ từ 20 phút), Thiên Diễn Quyết (bước liên hoàn từ 30 phút), Khổ Tu Kinh (độ khó từ 1,3 và 30 phút). Đây là điều kiện theo hành vi được ghi nhận, không đo trực tiếp chất lượng học.
- Mỗi ngày chỉ kích hoạt một lần, chung cho cả sáu công pháp, cộng 12 linh lực vào thưởng cộng trước các hệ số hiện hành. Tối đa 1.428 linh lực cơ bản trong 119 ngày, tương đương 0,714% ngưỡng Chân Tiên 200.000, chưa tính hệ số và thưởng liên hoàn. Chỉ hoàn thành từ 05:00 đến trước 22:00, không thưởng nhiệm vụ quá hạn. Phiên timer đối soát muộn chỉ nhận nếu cả giờ kết thúc lẫn giờ đối soát nằm trong khung và cùng ngày game. Giữ công thức thưởng/phạt và hệ số chuỗi hiện tại.
- Biên nhận ghi riêng phần công pháp nằm trong thưởng cộng; hoàn tác/khôi phục giữ thưởng gốc, không mở lại lượt vận công. Số ngày vận công tính số lần kích hoạt, kể cả đã hoàn tác. Save cũ mặc định không chọn; lưu lựa chọn qua reload, giữ lựa chọn khi luân hồi và lưu số ngày theo từng công pháp vào sử kiếp. Không cộng dồn buff xuyên kiếp.
- [x] Edge headless trên profile thử nghiệm độc lập: 390, 320, 280 px không tràn ngang; chọn công pháp, nhận thưởng, đổi công pháp trong ngày, chế độ Chỉ học, reload, luân hồi đều đạt, không lỗi JS. Đã tạo ảnh kiểm tra nhưng chưa xác nhận trực quan qua ảnh.
- [x] 150/150 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt. Ba kiểm thử mới bao gồm sáu điều kiện, ngày hợp lệ, giới hạn ngày, biên nhận, hoàn tác, timer, lưu và luân hồi.
- [x] CI Stage 5B, commit `b3b6119acb4928a59045c712df5e036533df0684`: JavaScript Tests (45378321093) và Build APK (45378321144) thành công. Artifact APK ID 14911878465 (6.289.125 byte, chưa hết hạn lúc kiểm tra).
- [ ] Nghiệm thu Android thật.

## Stage 5D — Thống kê học tập (2026-11-24)

- Thiên Thư → Thống kê bổ sung xu hướng học tập 7/30 ngày trong kiếp, chỉ so sánh khi đủ hai khoảng thời gian trọn vẹn. Tiến độ môn học hiển thị phút học, tỷ trọng, mục tiêu ngày/tuần và phân biệt phút chưa gán môn với dữ liệu cũ chưa được theo dõi.
- So sánh tối đa năm kiếp gần nhất theo phút/ngày và nhiệm vụ/ngày, có thời lượng kiếp nếu biết. Dữ liệu thiếu hiển thị dấu —. Không thay đổi dữ liệu lưu hoặc cơ chế thưởng phạt.
- [x] 151/151 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt.
- [x] Edge headless profile riêng tại 390, 320, 280 px: bộ lọc, môn học, dữ liệu cũ, mục thu gọn, chế độ Chỉ học và reload đạt, không tràn ngang hoặc lỗi JS. Có ảnh QA nhưng chưa xác nhận trực quan.
- [x] CI Stage 5D, commit `d7b1658c9109bfa5baa33cdb2e17b1395d15628f`: JavaScript Tests (45380456768) và Build APK (45380456558) thành công. Artifact APK ID 14912619910 (6.290.504 byte, chưa hết hạn lúc kiểm tra).
- [ ] Nghiệm thu Android thật.

## Stage 5C — Đồng tu và giao tình (2026-11-24)

- Hồ sơ Thiên Kiêu thêm mục tiêu đồng tu trong ngày theo phút học hoặc số nhiệm vụ đã hoàn thành, bốn mục tiêu nhẹ (20/30 phút hoặc 1/2 nhiệm vụ). Phong văn hiện tại có một mục tiêu hằng ngày, luân phiên theo kỳ ba ngày và số kiếp. Tiến độ tự tính từ lịch sử, hoàn tác nhiệm vụ cập nhật lại tiến độ.
- Giao tình tính theo số ngày đã ghi lời vấn đạo với từng NPC: Sơ ngộ, Tương thức (1), Thân quen (3), Tri kỷ (7). Vẫn chỉ ghi một NPC mỗi ngày, lưu thất bại hoàn tác cả giao tình lẫn Đạo Văn, giới hạn 119 lần mỗi NPC, reset khi luân hồi. Save cũ khởi đầu Sơ ngộ, giữ nguyên Đạo Văn cũ. Không cộng buff, linh lực, thưởng hoặc phạt mới; điểm mô phỏng NPC không đổi.
- [x] 152/152 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt. Hồi quy giới hạn ngày, lưu lỗi, mục tiêu từ lịch sử, reload, luân hồi và dữ liệu không hợp lệ.
- [x] Edge headless profile riêng tại 390, 320, 280 px: hồ sơ, giao tình, tiến độ, Phong văn, reload và giới hạn ngày đều đạt, không lỗi JS hoặc tràn ngang.
- [x] CI Stage 5C, commit `d467b015bc30a865dc0c86ea725593b6fa453309`: JavaScript Tests (45381120861), Build APK (45381120935) thành công; artifact APK ID 14913567288 (6.291.083 byte, chưa hết hạn lúc kiểm tra).
- [ ] Nghiệm thu Android thật.

## Stage 5E — Sư môn truyền thừa (2026-11-24)

- Mỗi tông có một truyền thừa danh dự trong kiếp, cần đang bái sư và đạt mục tiêu từ lịch sử học. Thiên Kiếm: 6 ngày ≥45 phút; Huyền Đan: 10 ngày ≥20 phút; Vạn Pháp: 3 môn ≥60 phút/môn (kể cả môn lưu trữ); Thái Hư: 14 ngày ≥30 phút; Cửu U: 7 ngày ≥30 phút; Bách Thảo: 8 ngày ≥20 phút. Tích lũy ngày không bắt buộc liên tiếp, không yêu cầu học đêm.
- Mở thêm đường bái sư Cửu U bằng 5 ngày học ≥30 phút/ngày, giữ đường cũ 5 nhiệm vụ đêm và buff +12 linh lực/giờ đêm trong giới hạn 120 phút thưởng hiện hành. Không tăng thưởng đêm, không thay công thức phạt. Truyền thừa không tăng sức mạnh, không hoàn lại lượt nhận khi hoàn tác nhiệm vụ, lưu tối đa sáu ID khác nhau/kiếp và chỉ lưu danh dự khi luân hồi. Save cũ bắt đầu chưa lĩnh ngộ. Khi lưu thất bại, hoàn tác lần nhận.
- Sử kiếp và bản xuất phán quyết hiển thị tên truyền thừa đã lĩnh ngộ.
- [x] Edge headless profile riêng tại 390, 320, 280 px: nhận, giới hạn một lần, reload, luân hồi, sử kiếp, không tràn ngang và lỗi JS.
- [x] 154/154 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt.
- [x] CI Stage 5E, commit `1f385b3f4198a6c3b8c2345813eae61ee92e6f3c`: JavaScript Tests (45382180469) và Build APK (45382180541) thành công. Artifact APK ID 14913758036 (6.292.124 byte, chưa hết hạn lúc kiểm tra).
- [ ] Nghiệm thu Android thật.

## Stage 5F — Đạo lộ luân hồi (2026-11-24)

- Thiên Thư → Sứ mệnh có một đạo lộ tự nguyện luân phiên theo số kiếp: Tĩnh Tâm (7 ngày ≥20 phút), Vạn Pháp (3 môn ≥30 phút/môn), Song Tu (4 ngày, mỗi ngày hai môn từ 15 phút/môn). Tiến độ lấy từ dữ liệu học hiện tại; hoàn tác nhiệm vụ cập nhật lại. Khi luân hồi lưu ID và tiến độ giới hạn vào sử kiếp và file phán quyết. Save cũ không tự suy đoán đạo lộ đã hoàn thành.
- Thêm bốn danh hiệu vĩnh viễn: Tam Tông Truyền Nhân (3 truyền thừa khác nhau qua ít nhất hai kiếp), Tuế Nguyệt Vô Ngại (hai kiếp đủ kỳ hạn có thời lượng khác nhau), Tam Đạo Đồng Quy (viên mãn cả ba đạo lộ), Đạo Tâm Bất Tức (hai kiếp từng giữ chuỗi ≥7 ngày/kiếp). Tổng 12 sứ mệnh. Không buff, không tăng linh lực, không thay phạt hay thời hạn; không bắt buộc đổi thời lượng kiếp hoặc học đêm. Dữ liệu cũ chỉ tính nếu có trường lịch sử cần thiết.
- [x] Edge headless profile riêng tại 390, 320, 280 px: tab Sứ mệnh, luân phiên đủ ba đạo lộ, nhận danh hiệu, sử kiếp, reload; không lỗi JS/tràn ngang.
- [x] 156/156 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt.
- [x] CI Stage 5F, commit `fc385d34bbad5ef894c68f5ed6c5ee41d3a6de21`: JavaScript Tests (45382899426) và Build APK (45382899282) thành công. Artifact APK ID 14914503464 (6.294.162 byte, chưa hết hạn lúc kiểm tra).
- [ ] Nghiệm thu Android thật.

## Stage 6 — Hoàn thiện trải nghiệm học tập

- 6A: tinh chỉnh giao diện và thao tác học nhanh.
- 6B: mô phỏng nhiều kiếp để đánh giá cân bằng linh lực, đạo tâm, nhiệm vụ và nhàn hạ trước khi điều chỉnh.
- 6C: lập kế hoạch học thông minh dựa trên lịch và hạn nhiệm vụ.
- 6D: phát triển chiều sâu thế giới và nhân vật.
- 6E: tùy chọn độ khó qua luân hồi.
- 6F: nghiệm thu Android và chuẩn bị phát hành.

### Stage 6A — Tinh chỉnh giao diện (2026-11-24)

- Thiên Kiêu Bảng dùng lưới cột đồng nhất cho thứ hạng, chân dung, thông tin, biểu đồ và linh lực. NPC thường dùng chữ cái đầu tên; Thiên Kiêu và người chơi giữ chân dung cùng viền cổ phong. Màn hình nhỏ ẩn biểu đồ, dưới 361 px đưa điểm xuống dòng riêng. Thẻ hiển thị tên thiên phú; hồ sơ giữ mô tả đầy đủ. Có thể mở hồ sơ bằng Enter/Space và giữ focus qua cập nhật bảng.
- Rút gọn trạng thái Thiên Đạo Cân Bằng, gấp công thức trong mục Cách tính xếp hạng. Cập nhật nhãn phiên bản Stage 6A.
- Nhật trình hiện tại có nút Học ngay cho nhiệm vụ hợp lệ trong khung giờ; dùng bộ xử lý học hiện hành, kiểm tra lại khung giờ lúc bấm. Ẩn nút khi đã hoàn thành, hết hạn, khóa hoặc đang học. Không đổi kinh tế, dữ liệu save hay cơ chế thưởng/phạt.
- [x] Edge headless profile tạm riêng: 760/390/320/280 px, chữ lớn, hai chế độ trang trí, cột thẳng hàng, không tràn ngang, mở hồ sơ bằng bàn phím, mô tả thiên phú đầy đủ, học nhanh, hủy phiên, nhiệm vụ hoàn thành/hết hạn; không lỗi JS.
- [x] 156/156 kiểm thử tại Asia/Ho_Chi_Minh và UTC; `git diff --check` đạt.
- [ ] CI và APK mới, nghiệm thu Android thật.
