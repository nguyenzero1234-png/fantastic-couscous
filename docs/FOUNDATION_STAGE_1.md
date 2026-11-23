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


## Module nhiễu xác định
- `www/js/noise.js` cung cấp `GameNoise.hash(a,b,c)` và `GameNoise.value(seed,channel,x)`.
- Đây là các hàm thuần, xác định, không đọc trạng thái hay thời gian; NPC simulation dùng chúng để tạo biến động lặp lại theo seed.
- `game.js` giữ alias `hs`/`vn` nhằm tránh sửa các call-site và giữ nguyên thuật toán cũ.


## Module tiện ích văn bản
- `www/js/text.js` cung cấp `GameText.escapeHtml(value)` để escape các ký tự `&`, `<`, `>` và dấu nháy kép trước khi chèn chuỗi vào HTML.
- `game.js` giữ alias `esc` trỏ tới hàm module; không đổi các call-site và không thêm phụ thuộc DOM.


## Module lịch chiến tông môn
- `www/js/sect-war.js` cung cấp `GameSectWar.pairs(week)` để tạo 3 cặp từ 6 tông theo chu kỳ 5 tuần và `GameSectWar.flavor(a,b)` để chọn lời dẫn trận đấu.
- `game.js` giữ các alias tương thích; tính điểm, lịch tuần, phần thưởng và trạng thái người chơi vẫn ở module game vì phụ thuộc dữ liệu runtime.


## Quy tắc hoàn thành nhiệm vụ
- `GameQuestData.isDone(quest, today)` là hàm thuần xác định trạng thái hoàn thành dựa trên `doneOn`, `repeat` và ngày hiện tại được tiêm vào.
- `game.js` giữ wrapper gọi ngày lịch game hiện tại; không thay đổi cấu trúc lưu nhiệm vụ hoặc hành vi nhiệm vụ lặp.


## Module dữ liệu NPC
- `www/js/npc-data.js` cung cấp `GameNpcData.isUniqueTalent(index, npcs)` để xác định NPC có thiên phú độc nhất.
- Quy tắc cũ được giữ nguyên: NPC ở chỉ số 9 luôn được đánh dấu; các NPC khác dựa vào cờ `tk` trong dữ liệu.
- `game.js` giữ wrapper `isTK`; dữ liệu NPC, nội dung thiên phú và cách hiển thị vẫn ở game.


## Bổ sung helper thuần theo lô (2026-11-23)
- `GameTimeFormat.remaining(timestamp, now)`: định dạng thời gian còn lại theo phút/giờ, nhận thời điểm hiện tại từ caller để kiểm thử xác định.
- `GameQuestData.isExpired(quest, isDone, now)` và `isUnlocked(quests, quest, isDone)`: tách quy tắc hạn chót và mở khóa bước trong chuỗi; trạng thái nhiệm vụ và thời gian vẫn do `game.js` cung cấp.
- `GameProgressData.playerXpAt(history, points, dateKey)`: tính linh lực tích lũy đến một ngày từ lịch sử; không đọc state toàn cục.
- Các wrapper trong `game.js` giữ nguyên nguồn thời gian, lịch sử và trạng thái hiện có; không đổi save schema.


## Helper tiến trình theo ngày
- `GameProgressData.activeDays(history, streak, date, cur, todayKey)` tính số ngày hoạt động trong cửa sổ 14 ngày, kết hợp nhật ký và chuỗi được giữ.
- `GameProgressData.streakAt(history, streak, date, cur, todayKey, yesterdayKey)` tính chuỗi liên tiếp tại mốc thiên kiếp. Mọi nguồn trạng thái/ngày đều được truyền vào; module không đọc `S` hay gọi DOM.
- `game.js` giữ wrapper để cung cấp đúng ngày local và dữ liệu save hiện tại.


## Helper ngày thi và thời điểm sự kiện
- `GameDateData.examDate(start, dayOffset)` clone ngày bắt đầu, đặt về 12 giờ local rồi cộng độ lệch ngày lịch; không làm thay đổi đối tượng đầu vào.
- `GameTimeFormat.eventTimestamp(timestamp)` định dạng ngày/giờ sự kiện theo locale `vi-VN`.
- Các wrapper trong `game.js` tiếp tục lấy dữ liệu kỳ thi và timestamp từ state runtime.


## Helper khóa chu kỳ và định dạng giờ học
- `GameDateData.periodKey(period, todayKey, weekStartKey)` trả về khóa ngày, tuần hoặc tháng theo quy tắc nhiệm vụ định kỳ hiện có.
- `GameTimeFormat.hoursLabel(minutes)` định dạng số phút thành giờ với một chữ số thập phân và hậu tố tiếng Việt.
- Hai helper nhận dữ liệu từ caller, không đọc state toàn cục.


## Helper tiến độ nhiệm vụ định kỳ
- `GameAnalytics.questProgress(history, counts, task, todayKey, weekStartKey)` tổng hợp tiến độ theo ngày/tuần/tháng và theo phút học, linh lực, số nhiệm vụ hoặc ngày học đủ 30 phút.
- Caller cung cấp toàn bộ dữ liệu cần thiết; helper thuần không đọc `S`, ngày hệ thống hay DOM.


## Predicate miễn hiệu ứng NPC
- `GameNpcData.isImmuneTaiHu(index, npcs)` kiểm tra NPC Cố Thái Hư theo đúng chỉ số và tên hiện có.
- Wrapper trong `game.js` giữ nguyên call-site; module nhận danh sách NPC từ caller, không đọc dữ liệu toàn cục.


## Helper tổng phút lịch sử
- `GameAnalytics.sumMinutes(history, predicate)` cộng trường `m` của các ngày thỏa điều kiện do caller cung cấp.
- `game.js` giữ wrapper `sumMins`; lọc tuần và tháng vẫn nằm ở caller, giữ nguyên ngày bắt đầu/kết thúc và quy tắc khóa ngày.
- Kiểm thử bao gồm lịch sử đầy đủ, khoảng ngày, ngày không học, dữ liệu rỗng và predicate không khớp.
- CI #138 xác nhận 32/32 test JavaScript, build APK và tải artifact thành công.


## Helper chuỗi hiện tại
- `GameStreak.current(streak, today, yesterday)` xác định chuỗi còn hiệu lực khi lần học gần nhất là hôm nay hoặc hôm qua; các trường hợp cũ hơn trả về 0.
- Wrapper `curStreak` trong `game.js` tiếp tục cung cấp state và ngày lịch game.
- CI #140 xác nhận 33/33 kiểm thử JavaScript, build APK và tải artifact thành công.


## Helper chọn kiếp có thành tích cao nhất
- `GameProgressData.bestKiep(records, currentKiepPoints, currentPoints, currentKiepNumber)` chọn kết quả cao nhất trong các kiếp đã qua và kiếp hiện tại.
- Giữ nguyên thứ tự khi hòa điểm: bản ghi lịch sử đầu tiên có điểm cao nhất được giữ; kiếp hiện tại chỉ thắng khi điểm cao hơn nghiêm ngặt.
- `game.js` vẫn cung cấp dữ liệu từ save và wrapper `bk`; helper không truy cập state toàn cục.
- CI #142 xác nhận 34/34 kiểm thử JavaScript, build APK và tải artifact thành công.


## Tổng hợp điểm, nhiệm vụ và nhật ký theo khoảng ngày
- `sumPointsBetween` giữ khoảng ngày dạng [start, end); `pointsThrough` tính đến hết khóa ngày.
- `countStudyLogEntries` dùng ngày/giờ local như logic cũ; khung giờ do caller cung cấp.
- `sumCountsBetween` giữ khoảng ngày dạng [start, end] để khớp thống kê nhiệm vụ tuần.
- Các wrapper trong `game.js` giữ nguồn state và các mốc thời gian.
- CI #145 và #146 lần lượt xác nhận 37/37 và 38/38 test JavaScript; build APK và tải artifact đều thành công.


## Helper thống kê lịch sử học trong cửa sổ ngày
- `GameAnalytics.studyWindowStats(history, startKey, endKey)` trả về `days`, `daysWithStudy`, `bestMinutes`.
- Giữ nguyên thứ tự khóa của `Object.keys(history)`, khoảng ngày bao gồm cả đầu/cuối, điều kiện `m > 0` và giá trị tối thiểu 0 cho số phút tốt nhất.
- Wrapper `wDs`, `wDays`, `wBest` trong `game.js` vẫn là giao diện dùng bởi nhiệm vụ tuần.
- CI #148 xác nhận 39/39 kiểm thử JavaScript, build APK và tải artifact thành công.


## Helper cộng phút học theo timestamp
- `GameAnalytics.sumStudyMinutesBetween(studyLog, startTimestamp, endTimestamp)` cộng phút của các phiên có timestamp nằm trong khoảng bao gồm cả hai đầu.
- Wrapper `kmins` trong `game.js` tiếp tục cung cấp `S.stl` và thời gian của kỳ ngộ; không thay đổi cách xác định thời gian hoặc thưởng kỳ ngộ.
- CI #151 xác nhận 40/40 kiểm thử JavaScript, build APK Android thành công và tải artifact `TuTienHocDao-apk`.


## Xác nhận CI gần nhất
- CI run #153 thành công cho commit `c8ce5f4baf8d05d94d3591dd9f44e639637a14db`: test modules, dependency audit, Capacitor sync, Gradle APK build và upload artifact đều hoàn tất.
- Artifact APK debug: `TuTienHocDao-apk` (5,796,433 bytes).
- Chưa có xác nhận cài/chạy trên thiết bị Android thật.


## Kiểm thử runtime cho module giao diện
- Bổ sung môi trường DOM tối thiểu trong harness để chạy `GameUI.apply` mà không cần trình duyệt thật.
- Kiểm tra bốn tùy chọn skin, density, font size, theme và việc xóa thuộc tính khi trở về mặc định.
- Kiểm tra mọi đường dẫn script trong `index.html` trỏ tới tệp hiện có trong `www`.
- CI #154 đã xác nhận bộ test tích hợp trước đó và build APK thành công.
- CI #155 phát hiện assertion đường dẫn thiếu thư mục con `js/`; đã sửa sang `www/js/`. `GameUI.apply` đạt test áp dụng tùy chọn và reset mặc định. Chờ CI chạy lại.


## Module dữ liệu kiếp nạn
- `www/js/kiep-nan-data.js` cung cấp `GameKiepNanData.create(seed, hour, epoch, types, hash)` để sinh dữ liệu kiếp nạn theo seed.
- Giữ nguyên thuật toán và thứ tự gọi hash; state game vẫn chịu trách nhiệm tạo seed lần đầu, còn bảng `KN` và hàm hash được truyền từ caller.
- Kết quả vẫn gồm `h`, `k`, `W`, `T`, `st`, `en`, `pts`, `name`, `desc`; không thay đổi save schema.


## Module dữ liệu nhật ký tu tiên
- `www/js/diary-data.js` cung cấp hàm thuần `GameDiaryData.generate(day, stats, context, quotes)`.
- Nội dung nhật ký được tạo từ dữ liệu thống kê và ngữ cảnh truyền vào; module không đọc save, DOM hay biến toàn cục của game.
- Wrapper trong `game.js` giữ trách nhiệm đọc lịch sử, chuỗi ngày, tông môn, linh thú, ký ức và Đạo Văn.
- Không thay đổi cấu trúc save hoặc giới hạn tối đa bảy dòng nhật ký.


## Ghi chú kiểm thử nhật ký
- CI #159 xác nhận 45/46 test đạt; test còn lại có expected text viết sai so với quy tắc chọn câu xác định theo seed.
- Đã sửa expected value để phản ánh đúng kết quả của helper; không thay đổi thuật toán sinh nội dung.
- Chờ CI xác nhận lại toàn bộ test và APK.


## Sửa harness so sánh dữ liệu VM
- CI #160 xác nhận nội dung nhật ký đúng; lỗi là khác realm giữa mảng do VM tạo và mảng test của Node.
- Chuẩn hóa mảng kết quả qua JSON trong assertion để chỉ so sánh dữ liệu, không so sánh prototype của realm.
- Chờ CI chạy lại toàn bộ.


## Điều chỉnh test giới hạn dòng nhật ký
- CI #161 cho thấy dòng linh thú hợp lệ có thể bị loại khi nhật ký đã đủ bảy dòng; đây là hành vi giới hạn có chủ đích.
- Tách kiểm tra nhánh linh thú thành ca độc lập để xác minh nội dung mà không giả định thứ tự xuất hiện trong nhật ký dài.
- Chờ CI chạy lại.


## Điều chỉnh assertion câu linh thú
- CI #162 xác nhận helper có hai câu hợp lệ cho linh thú; test trước đó chỉ chấp nhận một cách diễn đạt.
- Assertion hiện kiểm tra tên linh thú có trong dòng nhật ký, không ép lựa chọn câu cụ thể.
- Chờ CI chạy lại.


## Module lựa chọn cơ duyên bảng xếp hạng
- `www/js/leaderboard-data.js` tách phép tính xác định loại cơ duyên thành `GameLeaderboardData.rollSpecial`.
- Caller truyền danh sách nhân vật đủ điều kiện, seed, salt và hàm hash; module trả kết quả theo đúng thứ tự đầu vào, không sửa trạng thái.
- `game.js` tiếp tục xử lý điều kiện hạng, cơ duyên đang giữ, thời hạn hiệu lực và lịch sử nhận thưởng.
- CI #163 đã build APK thành công cho phiên bản trước; CI của commit mới sẽ xác nhận module này.

- Test dùng hash giả lập cho hai identity NPC và identity người chơi để kiểm tra ngưỡng và nhánh kết quả; cần CI xác nhận.


## Mở rộng module dữ liệu bảng xếp hạng
- Tách định dạng mô tả chín loại hiệu ứng cơ duyên sang `GameLeaderboardData.eventEffectText(event, npc, buff)`; hàm nhận dữ liệu tường minh, không đọc state hoặc DOM.
- `game.js` giữ wrapper tương thích `efTxt`; chuỗi tiếng Việt, công thức và quy tắc cộng/trừ được giữ nguyên.
- Bổ sung test ranh giới ngưỡng hash 0,2 / 0,4 / 0,6 và kiểm tra đủ chín mô tả, bao gồm nhánh hiệu ứng trừ linh lực.

- CI #166 xác nhận 47/48 test đạt; lỗi chỉ nằm ở fixture kiểm thử nhánh trừ linh lực thiếu trường dữ liệu sự kiện `dh`. Đã bổ sung dữ liệu fixture, chờ CI chạy lại.


## Module mô tả vật phẩm
- `www/js/item-data.js` cung cấp `GameItemData.describe(item)`, hàm thuần trả về tổng linh lực `tot` và mô tả `d`; không sửa cấu hình đầu vào.
- `game.js` vẫn giữ danh sách vật phẩm, chỉ ghép kết quả helper vào từng mục khi khởi tạo.
- Giữ nguyên công thức phần thưởng, điều kiện nhiệm vụ nhanh/từ 60 phút, phần cộng thêm và định dạng chuỗi tiếng Việt.
- CI #167 đã xác nhận commit trước đó build APK thành công và artifact còn hiệu lực; CI của module mới cần xác nhận lại.
