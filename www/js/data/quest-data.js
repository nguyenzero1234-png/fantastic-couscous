/* Dữ liệu mẫu, kế hoạch học tập và prompt AI. Không chứa parser hay logic gameplay. */
(function(global){
 "use strict";
 const PN={en:"Tiếng Anh học kì",code:"Lập trình học kì",nckh:"NCKH học kì"};

 const PLAN={
 en:["Kiểm tra trình độ, đặt mục tiêu IELTS hoặc TOEIC|60","Nghe: shadowing 1 bài TED-Ed|60","Từ vựng học thuật: 50 từ và đặt câu|60","Đọc 2 bài báo công nghệ, tóm tắt 5 câu|75","Viết đoạn văn 150 từ về chủ đề CS|75","Nói: ghi âm tự giới thiệu 2 phút|60","Ngữ pháp: các thì và câu điều kiện, 30 câu|60","Ôn giữa kì: tự làm mini test|90","Nghe podcast công nghệ, ghi ý chính|60","Viết email học thuật và CV tiếng Anh|75","Đọc 1 bài báo khoa học, tóm tắt abstract|90","Nói: thuyết trình 5 phút về một dự án|90","Viết bài luận 250 từ|90","Mock test đủ 4 kỹ năng|120","Tổng kết: sửa lỗi sai, viết nhật ký tiến bộ|60"],
 code:["Cài môi trường, Git, tạo repo đầu tiên|60","Ôn cú pháp C++ hoặc Python: 10 bài cơ bản|90","Cấu trúc dữ liệu: mảng, stack, queue|90","Danh sách liên kết: tự cài đặt|90","Cây nhị phân và các cách duyệt|90","Giải thuật sắp xếp, so sánh độ phức tạp|90","Đồ thị: BFS và DFS|90","Ôn giữa kì: 5 bài LeetCode Easy|120","OOP: thiết kế lớp cho mini project|90","Mini project: khung chương trình, chức năng 1|120","Mini project: chức năng 2 và viết test|120","Quy hoạch động: 5 bài kinh điển|120","Mini project: hoàn thiện, viết README|120","Code review và tối ưu mã nguồn|90","Tổng kết: đẩy lên GitHub, viết bài học kinh nghiệm|60"],
 nckh:["Chọn chủ đề, đọc 3 bài tổng quan|90","Tìm 10 tài liệu, quản lý bằng Zotero|75","Xác định câu hỏi nghiên cứu và giả thuyết|75","Viết tổng quan tài liệu (1 trang)|90","Thiết kế phương pháp và dữ liệu|90","Viết đề cương, gửi giảng viên|120","Thu thập và chuẩn bị dữ liệu|120","Chạy thí nghiệm đầu tiên|120","Phân tích kết quả, vẽ biểu đồ|90","Viết phần Phương pháp và Kết quả|120","Viết phần Giới thiệu và Thảo luận|120","Viết abstract tiếng Anh|75","Làm slide báo cáo|90","Tập báo cáo, xin phản hồi|90","Nộp bài hoặc hội nghị sinh viên, rút kinh nghiệm|60"]
};

 const AI_PROMPT=`Bạn là gia sư lập kế hoạch học. Tạo bộ nhiệm vụ học cho tôi.

THÔNG TIN CỦA TÔI
- Mục tiêu và hạn chót: [điền]
- Trình độ hiện tại / điểm yếu: [điền]
- Tài liệu đang có: [điền]
- Phạm vi: [1 ngày / 1 tuần]
- Thời gian học mỗi ngày: [vd. 3 giờ]
- Phiên tập trung tối đa: [vd. 45 phút]
- Số nhiệm vụ: [vd. 8]

ĐỊNH DẠNG (mỗi dòng một nhiệm vụ):
Tên nhiệm vụ | phút | độ khó | lặp | hạn

QUY TẮC
1. Chỉ in các dòng trong MỘT khối code, không đánh số, không gạch đầu dòng, không giải thích.
2. Tên tối đa 80 ký tự, bắt đầu bằng động từ, có kết quả đo được (vd. "Nghe Part 2 đề 3, chép 10 câu sai", không viết "Ôn nghe"). Nhiều môn thì thêm tiền tố [Nghe], [Code].
3. phút: số nguyên 5-480, chia hết cho 5, phần lớn 25-50, tối đa 90.
4. độ khó: chỉ 1, 1.15 hoặc 1.3 (khoảng 50% / 35% / tối đa 15%), đánh giá trung thực theo trình độ tôi.
5. lặp: 1 chỉ cho thói quen ngắn hằng ngày (từ vựng, flashcard), còn lại 0.
6. hạn: để trống (không dùng 1, 3, homnay).
7. Thứ tự dòng = thứ tự nên làm: khởi động dễ, việc khó ở giữa, ôn lại/kiểm tra cuối. Xen một nhiệm vụ ôn nội dung cũ, không dồn cùng một kỹ năng liền nhau.
8. Tổng phút không vượt thời gian học mỗi ngày của tôi.

Ví dụ:
[Từ vựng] Học 30 từ Unit 4 bằng flashcard | 25 | 1 | 1
[Nghe] Nghe Part 2 đề 3, chép 10 câu sai | 40 | 1.15 | 0
`;

 const CHAIN_PROMPT=`Bạn là gia sư thiết kế lộ trình học theo chuỗi bước tuần tự. Tạo một chuỗi cho tôi.

THÔNG TIN CỦA TÔI
- Mục tiêu cuối: [điền]
- Hạn chót: [điền]
- Trình độ hiện tại: [điền]
- Tài liệu / công cụ: [điền]
- Thời gian mỗi tuần: [vd. 6 giờ]
- Số bước: [vd. 12]

ĐỊNH DẠNG
Dòng 1: TÊN CHUỖI: <tên ngắn, tối đa 60 ký tự>
Các dòng sau, mỗi dòng một bước: Tên bước | phút

QUY TẮC
1. Chỉ in đúng định dạng trong MỘT khối code, không giải thích, không đánh số.
2. 2 đến 15 bước, làm LẦN LƯỢT: bước sau dùng kết quả bước trước (nền tảng, vận dụng, kiểm tra).
3. Mỗi bước có đầu ra kiểm tra được (vd. "Đọc 3 bài báo, ghi 5 ý mỗi bài", không viết "Tìm hiểu tài liệu").
4. phút mỗi bước 20-90 (tối đa 480). Nếu mỗi bước là một tuần thì phút là tổng cả tuần, không vượt 480.
5. Có bước kiểm tra nhỏ (đề thử, tự trình bày) ở khoảng 1/3 và 2/3 chuỗi, bước tổng kết ở cuối.
6. Không thêm bước cho đủ số lượng. Bước đầu dưới 30 phút để dễ bắt đầu.

Ví dụ:
TÊN CHUỖI: Viết báo cáo NCKH
Đọc 3 bài báo đầu, ghi 5 ý chính mỗi bài | 60
Lập dàn ý chi tiết 3 cấp | 45
`;

 const SCHED_PROMPT=`Bạn là gia sư lập thời khóa biểu học trong ngày. Xếp lịch cho tôi.

THÔNG TIN CỦA TÔI
- Ngày: [hôm nay / thứ ...]
- Việc cố định: [vd. 07:30-11:30 đi học, 12:00-13:00 ăn trưa]
- Khoảng rảnh có thể học: [vd. 14:00-17:30 và 19:00-22:00]
- Giờ tập trung tốt nhất: [vd. 19:00-21:00]
- Phiên tập trung tối đa: [vd. 45 phút]
- Việc cần học (tên | phút):
[dán danh sách nhiệm vụ, lấy bằng nút "Xuất nhiệm vụ hiện có"]

ĐỊNH DẠNG (mỗi dòng một khung): HH:MM-HH:MM | Tên việc

QUY TẮC
1. Chỉ in các dòng lịch trong MỘT khối code, sắp theo giờ tăng dần, không giải thích.
2. Giờ 24h, phút chia hết cho 5, các khung không trùng nhau.
3. Mỗi khung học tối đa 120 phút (nên 25-50). Chừa 10 phút nghỉ giữa hai khung học, không cần ghi dòng riêng.
4. Việc khó nhất vào giờ tập trung tốt nhất, việc nhẹ/ôn lại vào lúc mệt.
5. Không xếp học sau 22:00 và không đè lên việc cố định.
6. Giữ nguyên tên việc đúng như danh sách tôi đưa.
7. Không đủ thời gian thì bỏ việc ưu tiên thấp nhất, không nén thời gian. Ghi lý do ở một dòng cuối bắt đầu bằng "# ".
8. Cuối ngày có khung 10-15 phút "Tổng kết và chuẩn bị ngày mai".

Ví dụ:
19:00-19:45 | Học 30 từ Unit 4 bằng flashcard
19:55-20:40 | Nghe Part 2 đề 3, chép 10 câu sai
`;

 const PRESET_MIX=`# Bộ kết hợp: VSTEP + Lập trình + NCKH + môn khác (có thể sửa trước khi Nhập)
# --- VSTEP / tiếng Anh ---
VSTEP Listening · 1 đoạn Part 1–2 | 30 | 1.15 | 0
VSTEP Reading · 1 passage + ghi chú từ | 40 | 1.15 | 0
VSTEP Writing · outline 1 bài Task | 35 | 1.3 | 0
VSTEP Speaking · thu âm 2 câu hỏi | 25 | 1.15 | 0
Ôn grammar VSTEP (thì / mệnh đề) | 25 | 1 | 1
Từ vựng academic 20 từ | 20 | 1 | 1
# --- Lập trình ---
Code · giải 2 bài dễ (warmup) | 40 | 1 | 0
Code · 1 bài vừa / thuật toán | 60 | 1.3 | 0
Đọc code / review PR hoặc bài mẫu | 30 | 1.15 | 0
Luyện debug 1 bug thật hoặc mock | 35 | 1.15 | 0
Viết / cập nhật README hoặc note kỹ thuật | 25 | 1 | 0
# --- NCKH ---
NCKH · đọc 1 paper / chương tài liệu | 45 | 1.15 | 0
NCKH · tóm tắt + 3 ý đóng góp | 30 | 1.3 | 0
NCKH · chỉnh method / thí nghiệm | 50 | 1.3 | 0
NCKH · viết 1 đoạn Introduction hoặc Related Work | 40 | 1.3 | 0
NCKH · cập nhật slide / poster tiến độ | 25 | 1 | 0
# --- Môn khác / nền tảng ---
Toán / xác suất ôn công thức cốt lõi | 35 | 1.15 | 0
Môn chuyên ngành · đọc giáo trình 1 mục | 40 | 1.15 | 0
Môn chuyên ngành · làm 5–10 bài tập | 45 | 1.3 | 0
Ôn nhanh lịch sử / lý thuyết (flashcard) | 20 | 1 | 1
Tổng kết ngày: ghi 5 dòng học được | 15 | 1 | 1`;

 const DEF_Q=`Khởi động: ôn lại ghi chú hôm qua | 15 | 1 | 1
Học từ vựng 20 từ bằng flashcard | 20 | 1 | 1
Đọc 1 mục tài liệu, ghi 5 ý chính | 40 | 1.15 | 0
Làm 5-10 bài tập, đánh dấu câu sai | 45 | 1.15 | 0
Giải 1 bài khó (code/đề) | 60 | 1.3 | 0
Sửa lại các câu sai và ghi nguyên nhân | 30 | 1.15 | 0
Tổng kết ngày: ghi 5 dòng học được | 15 | 1 | 1`;

 const DEF_C=[["Ôn thi một chương",["Đọc lướt chương, ghi mục lục ý chính | 30","Lập sơ đồ tư duy các khái niệm chính | 40","Học thuộc công thức/định nghĩa bằng flashcard | 35","Làm 10 bài tập cơ bản | 45","Làm 5 bài khó, ghi lại chỗ sai | 60","Tự làm đề thử có bấm giờ | 60"]],
["Viết một bài báo cáo",["Chọn đề tài, liệt kê 3 câu hỏi cần trả lời | 30","Đọc 3 tài liệu, ghi 5 ý chính mỗi tài liệu | 60","Lập dàn ý 3 cấp | 40","Viết phần mở đầu | 40","Viết phần nội dung chính | 90","Viết kết luận và danh mục tài liệu | 40","Đọc lại, sửa lỗi và định dạng | 45"]],
["Học một chủ đề mới",["Xem tổng quan chủ đề, ghi 5 từ khóa | 25","Đọc/xem tài liệu nền tảng, ghi chú | 45","Làm ví dụ mẫu theo hướng dẫn | 45","Tự làm một bài không nhìn đáp án | 45","Tóm tắt lại bằng lời của mình | 25"]]];

 const DEF_S=`07:40-07:55 | Khởi động: ôn lại ghi chú hôm qua
08:00-08:20 | Học từ vựng 20 từ bằng flashcard
08:30-09:10 | Đọc 1 mục tài liệu, ghi 5 ý chính
14:00-14:45 | Làm 5-10 bài tập, đánh dấu câu sai
15:00-16:00 | Giải 1 bài khó (code/đề)
19:30-20:00 | Sửa lại các câu sai và ghi nguyên nhân
20:10-20:25 | Tổng kết ngày: ghi 5 dòng học được`;
 global.GameQuestTemplates=Object.freeze({PN,PLAN,AI_PROMPT,CHAIN_PROMPT,SCHED_PROMPT,PRESET_MIX,DEF_Q,DEF_C,DEF_S});
})(window);
