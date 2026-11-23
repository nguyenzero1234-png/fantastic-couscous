(function (root) {
  "use strict";

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
    grade, normalizedExamProgress, examScore, npcExamScore, taoTamProgress, examConditions,
    realmIndex, realmName, playerXpAt, bestKiep, activeDays, streakAt
  });
})(typeof window !== "undefined" ? window : globalThis);
