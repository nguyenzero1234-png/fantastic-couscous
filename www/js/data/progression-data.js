(function (root) {
  "use strict";

  const RL=[["Luyện Khí",0],["Trúc Cơ",20000],["Kim Đan",42000],["Nguyên Anh",66000],["Hóa Thần",92000],["Luyện Hư",118000],["Hợp Thể",145000],["Đại Thừa",172000],["Chân Tiên",200000]];
  const END=200000,KD=119;/* END = ngưỡng vào Chân Tiên (không có trần: linh lực tăng đến hết kiếp). Kiếp chỉ kết thúc khi hết KD ngày */

  // Thiên kiếp gắn với ngày trong kiếp (0..KD-1), không phụ thuộc học kỳ
  const EX=[
   {id:"tl",n:"Trúc Cơ Lôi Kiếp",kind:"Lôi kiếp khai môn · viên mãn Luyện Khí, thăng Trúc Cơ",day:13,need:0,chuan:20000,w:0.5,a:.8,bm:20,ls:5,desc:"Tầng mây đầu tiên nổ sấm. Luyện Khí viên mãn thì lôi quang tẩy thể, dựng nền Trúc Cơ; ai chưa vững sẽ bị lôi đánh tan đạo tâm."},
   {id:"ho",n:"Kết Đan Hỏa Kiếp",kind:"Kiếp nạn lửa · viên mãn Trúc Cơ, thăng Kim Đan",day:24,need:1,chuan:42000,w:0.75,a:.8,bm:20,ls:10,desc:"Thiên hỏa giáng xuống, đốt sạch tạp niệm để kim đan thành hình. Cần đạo tâm bền và thân thể chịu được nhiệt. Thất bại để lại vết thương trên Mệnh."},
   {id:"gk",n:"Anh Biến Lôi Kiếp",kind:"Lôi kiếp phá đan hóa anh · viên mãn Kim Đan, thăng Nguyên Anh",day:36,need:2,chuan:66000,w:1,a:.78,bm:22,ls:16,desc:"Chín đạo lôi quang xoáy quanh thân, phá đan để nguyên anh xuất khiếu. Chỉ ai đã kết Kim Đan vững mới đứng được giữa trời giông."},
   {id:"tm",n:"Hóa Thần Tâm Ma Kiếp",kind:"Kiếp nạn tâm ma · viên mãn Nguyên Anh, thăng Hóa Thần",day:48,need:3,chuan:92000,w:1.25,a:.76,bm:24,ls:28,desc:"Không có sấm sét bên ngoài — chỉ có ma trong lòng. Muốn hóa thần phải vượt qua ký ức, hối hận, tham sân hiện hình. Đạo tâm yếu sẽ bị nuốt chửng."},
   {id:"hb",n:"Luyện Hư Hàn Băng Kiếp",kind:"Kiếp nạn băng giá · viên mãn Hóa Thần, thăng Luyện Hư",day:61,need:4,chuan:118000,w:1.5,a:.75,bm:25,ls:40,desc:"Thiên địa đóng băng khi Hóa Thần viên mãn muốn luyện hư nhập thực. Linh lực phải đủ dày để không bị đóng thành băng tượng."},
   {id:"ck1",n:"Hợp Thể Cửu Trọng Lôi Kiếp",kind:"Đại lôi kiếp · viên mãn Luyện Hư, thăng Hợp Thể",day:75,need:5,chuan:145000,w:1.75,a:.73,bm:27,ls:55,desc:"Chín tầng lôi kiếp liên hoàn, mỗi tầng mạnh hơn tầng trước. Chỉ Luyện Hư viên mãn mới dám nghênh chiến để hợp nhất cùng thiên địa."},
   {id:"ck2",n:"Đại Thừa Hỗn Nguyên Kiếp",kind:"Đại thiên kiếp · viên mãn Hợp Thể, thăng Đại Thừa",day:88,need:6,chuan:172000,w:2,a:.72,bm:28,ls:70,desc:"Hỗn nguyên chi khí giáng xuống, phân rõ viên mãn và nửa đường. Hợp Thể viên mãn mới đủ tư cách bước vào Đại Thừa."},
   {id:"pt",n:"Phi Thăng Kiếp",kind:"Thiên kiếp phi thăng · viên mãn Đại Thừa, thăng Chân Tiên",day:100,need:7,chuan:200000,w:2.5,a:.7,bm:30,ls:85,desc:"Chín mươi chín đạo thiên lôi, ba nghìn hỏa tai, tâm ma hiện hình cùng lúc. Chỉ Đại Thừa viên mãn với đạo tâm bất đoạn suốt cả kiếp mới bước qua được cổng trời thành Chân Tiên."}
  ];
  const RW={"Xuất sắc":200,"Giỏi":140,"Khá":90,"Trung bình":40,"Yếu":0};

  const grade = score => score >= 90 ? "Xuất sắc"
    : score >= 80 ? "Giỏi"
    : score >= 65 ? "Khá"
    : score >= 50 ? "Trung bình" : "Yếu";

  const normalizedExamProgress = (xp, exam) => {
    const ratio = xp / exam.chuan;
    return Math.min(1, (1 - Math.exp(-1.6 * ratio)) / (1 - Math.exp(-1.6)));
  };

  const examScore = (xp, exam, days) => Math.min(100, Math.round(
    exam.a * 100 * normalizedExamProgress(xp, exam)
      + exam.bm * Math.min(1, Math.max(0, days))
  ));

  const npcExamScore = (xp, exam) => Math.min(100, Math.round(
    100 * normalizedExamProgress(xp, exam)
  ));

  const taoTamProgress = (streak, exam) =>
    Math.min(1, Math.max(0, streak / exam.ls));

  const realmIndex = (xp, realms) => {
    let index = 0;
    realms.forEach((realm, i) => { if (xp >= realm[1]) index = i; });
    return index;
  };

  const realmName = (xp, realms) => {
    const index = realmIndex(xp, realms);
    const lower = realms[index][1];
    const upper = realms[index + 1] ? realms[index + 1][1] : lower + 1;
    if (!realms[index + 1]) return realms[index][0];
    return realms[index][0] + " tầng " + Math.min(9, Math.floor((xp - lower) / (upper - lower) * 9) + 1);
  };

  const playerXpAt = (history, points, dateKey) => {
    let total = 0, upto = 0;
    for (const key in history) { const value = history[key].p || 0; total += value; if (key <= dateKey) upto += value; }
    if (upto >= total) return points;
    return upto + Math.max(0, points - total);
  };


  const bestKiep = (records, currentKiepPoints, currentPoints, currentKiepNumber) => {
    let best = null;
    (records || []).forEach(record => {
      if (!best || record.pk > best.pk) best = { n: record.n, pk: record.pk };
    });
    const current = Math.round(Math.max(currentKiepPoints, currentPoints));
    if (!best || current > best.pk) best = { n: currentKiepNumber, pk: current, cur: 1 };
    return best;
  };

  const activeDays = (history, streak, dateValue, cur, todayKey) => {
    const td = new Date(todayKey + "T12:00:00");
    const date = new Date(cur || dateValue > td ? td : dateValue);
    const st = streak, seen = new Set();
    if (st && st.n > 0 && st.last) {
      const last = new Date(st.last + "T12:00:00");
      for (let i = 0; i < Math.min(st.n, 14); i++) {
        const day = new Date(last); day.setDate(day.getDate() - i);
        seen.add(day.toLocaleDateString("sv"));
      }
    }
    let count = 0;
    for (let j = 0; j < 14; j++) {
      const day = new Date(date); day.setDate(day.getDate() - j);
      const key = day.toLocaleDateString("sv"), entry = history[key];
      if ((entry && entry.m > 0) || seen.has(key)) count++;
    }
    return count;
  };

  const streakAt = (history, streak, dateValue, cur, todayKey, yesterdayKey) => {
    const td = new Date(todayKey + "T12:00:00");
    const date = new Date(cur || dateValue > td ? td : dateValue);
    const key = value => value.toLocaleDateString("sv");
    const has = value => { const entry = history[key(value)]; return !!(entry && entry.m > 0); };
    const day = new Date(date);
    if (!has(day)) day.setDate(day.getDate() - 1);
    let count = 0;
    while (count < 400 && has(day)) { count++; day.setDate(day.getDate() - 1); }
    const st = streak;
    if (cur && st && st.n > 0 && st.last && (st.last === todayKey || st.last === yesterdayKey)) count = Math.max(count, st.n);
    return count;
  };

  const examConditions = (exam, scoreAt, realmName) => {
    let days = 0;
    while (days <= exam.ls && scoreAt(exam.chuan * 10, exam, days / exam.ls) < 100) days++;
    return [
      `${exam.a * 100} điểm linh lực (linh lực ≥ ${exam.chuan}, ${realmName(exam.chuan)}) + ${exam.bm} điểm đạo tâm (chuỗi ≥ ${exam.ls} ngày)`,
      days > exam.ls ? "Không thể đạt 100" : `Đạt 100 khi linh lực ≥ ${exam.chuan} và chuỗi học liên tục ≥ ${days} ngày`,
      `Chuỗi ${Math.round(exam.ls / 2)} ngày → +${Math.round(exam.bm / 2)} điểm đạo tâm · không có chuỗi → +0`
    ];
  };

  root.GameProgressData = Object.freeze({
    RL, END, KD, EX, RW,
    grade, normalizedExamProgress, examScore, npcExamScore, taoTamProgress, examConditions,
    realmIndex, realmName, playerXpAt, bestKiep, activeDays, streakAt
  });
})(typeof window !== "undefined" ? window : globalThis);
