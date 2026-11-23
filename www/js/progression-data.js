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

  root.GameProgressData = Object.freeze({
    grade, normalizedExamProgress, examScore, npcExamScore, taoTamProgress
  });
})(typeof window !== "undefined" ? window : globalThis);
