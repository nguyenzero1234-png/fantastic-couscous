const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const jsDir = path.join(root, "www", "js");
const window = { dispatchEvent(event) { events.push(event.type); } };
const storageData = new Map();
const events = [];
let failWrites = false;
const localStorage = {
  getItem(key) { return storageData.has(key) ? storageData.get(key) : null; },
  setItem(key, value) { if (failWrites) throw new Error("quota exceeded"); storageData.set(key, String(value)); },
  removeItem(key) { storageData.delete(key); },
  clear() { storageData.clear(); }
};
const context = vm.createContext({ window, localStorage, Event: class Event { constructor(type) { this.type = type; } }, console: { warn() {}, error() {}, info() {} }, Date, Math, Object, Array, Number, String, RegExp, JSON });
function load(name) {
  const source = fs.readFileSync(path.join(jsDir, name), "utf8");
  new vm.Script(source, { filename: name }).runInContext(context);
}
["storage.js", "rewards.js", "streak.js", "analytics.js", "quest-data.js", "schedule-data.js", "pet-data.js", "time-format.js", "date-data.js", "progression-data.js", "noise.js", "text.js", "sect-war.js", "timer.js"].forEach(load);

test("tất cả script JavaScript trong www/js parse được", () => {
  for (const file of fs.readdirSync(jsDir).filter(x => x.endsWith(".js"))) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(path.join(jsDir, file), "utf8"), { filename: file }));
  }
});

test("thứ tự module phụ thuộc được nạp trước game.js", () => {
  const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
  const names = [...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x => x[1]);
  for (const name of ["storage.js", "ui.js", "timer.js", "rewards.js", "streak.js", "analytics.js", "quest-data.js", "schedule-data.js", "pet-data.js", "time-format.js", "date-data.js", "progression-data.js", "noise.js", "text.js", "sect-war.js", "game.js"]) {
    assert.ok(names.includes(name), name + " phải được khai báo");
    assert.ok(names.indexOf(name) < names.indexOf("game.js") || name === "game.js", name + " phải nạp trước game.js");
  }
});

test("rewards giữ nguyên quy tắc hệ số và tiêu hao hiệu ứng", () => {
  const R = window.GameRewards;
  assert.equal(R.modGain(100, { td: .9, balance: 1.1, status: .8 }), 79);
  assert.deepEqual(JSON.parse(JSON.stringify(R.eventGain(100, 2, { td: 1, balance: 1, status: 1 }))), { gain: 150, charges: 1, exhausted: false });
  const fx = [{ n: 2, v: 10 }, { n: 1, v: 30 }];
  const result = R.questCompletionReward(100, 1, 0, 0, fx, { td: 1, balance: 1, status: 1 }, e => e.v === 10);
  assert.equal(result.gain, 110);
  assert.deepEqual(JSON.parse(JSON.stringify(result.effects)), [{ n: 1, v: 10 }, { n: 1, v: 30 }]);
});

test("streak và tâm ma xử lý phù bảo hộ, đứt chuỗi và ngưỡng nhiệm vụ", () => {
  const S = window.GameStreak;
  assert.deepEqual(JSON.parse(JSON.stringify(S.completeDay({ last: "two", twoDaysAgo: "two", yesterday: "y", today: "t", streak: 5, lifeCharm: 1, random: () => .9 }))), {
    streak: { n: 6, last: "t" }, consumeLifeCharm: true, consumeHeartCharm: false, triggerDemon: false,
    extra: " Đã dùng Tục Mệnh Phù — chuỗi được giữ.", log: ""
  });
  assert.equal(S.checkBreak({ last: "today", today: "today", streak: 10, random: () => .1 }), null);
  assert.deepEqual(JSON.parse(JSON.stringify(S.progressCurses({ minutes: 25, tm: true, tmTasks: 1, tma: true, tmaTasks: 2, calmTitle: true }))), {
    tm: false, tmTasks: 0, tma: true, tmaTasks: 2, clearedSelf: true, clearedHeavenly: false, taskBonus: 40
  });
});

test("analytics tổng hợp lịch sử và chỉ số kiếp nạn", () => {
  const A = window.GameAnalytics;
  const H = { "2026-01-01": { m: 60, p: 100 }, "2026-01-02": { m: 30, p: 200 } };
  const C = { "2026-01-01": 2, "2026-01-02": 3 };
  const out = A.summarize(H, C, { today: "2026-01-02", days7: ["2026-01-01", "2026-01-02"], days30: ["2026-01-01", "2026-01-02"] });
  assert.equal(out.mA, 90);
  assert.equal(out.pA, 300);
  assert.equal(out.bp, 200);
  assert.equal(out.bd, "2026-01-02");
  assert.equal(out.sm(["2026-01-01", "2026-01-02"], "m"), 90);
  assert.equal(out.sn(["2026-01-01", "2026-01-02"]), 5);
});

test("quest parser xử lý dữ liệu hợp lệ, giới hạn và hạn chót", () => {
  const Q = window.GameQuestData;
  const now = () => 1700000000000;
  const q = Q.parseBulkLine("Tên nhiệm vụ | 999 | khó | lặp | 1h", { perHour: 200, now, random: () => .5 });
  assert.equal(q.name, "Tên nhiệm vụ");
  assert.equal(q.mins, 480);
  assert.equal(q.diff, 1.5);
  assert.equal(q.pts, 2400);
  assert.equal(q.due, 1700003600000);
  assert.equal(q.repeat, false);
  assert.equal(Q.parseBulkLine("   "), null);
});

test("schedule parser từ chối giờ sai và khung trùng", () => {
  const P = window.GameScheduleData;
  assert.deepEqual(JSON.parse(JSON.stringify(P.parseLine("19:00-19:45 | Ôn bài", []))), { start: 1140, end: 1185, label: "Ôn bài" });
  assert.equal(P.parseLine("19:00-19:45 | Ôn bài", [{ s: "19:30", e: "20:00" }]), null);
  assert.equal(P.parseLine("20:00-19:00 | Sai giờ", []), null);
  assert.deepEqual(JSON.parse(JSON.stringify(P.parseLine("08:00-09:00 | ", []))), { start: 480, end: 540, label: "" });
});

test("storage xác thực dữ liệu và nạp save hợp lệ", () => {
  const G = window.GameStorage;
  assert.equal(G.validSave({ quests: [], points: 0 }), true);
  assert.equal(G.validSave({ quests: {}, points: 0 }), false);
  assert.equal(G.validSave({ quests: [], points: NaN }), false);
  storageData.clear();
  storageData.set("test-save", JSON.stringify({ quests: [{ id: "q1" }], points: 12 }));
  const state = G.load("test-save", { quests: [], points: 0, setting: true });
  assert.equal(state.points, 12);
  assert.equal(state.setting, true);
});

test("storage khôi phục backup khi save chính hỏng", () => {
  storageData.clear(); events.length = 0;
  storageData.set("broken", "{bad json");
  storageData.set("broken.backup", JSON.stringify({ quests: [], points: 77 }));
  const state = window.GameStorage.load("broken", { quests: [], points: 0 });
  assert.equal(state.points, 77);
  assert.ok(events.includes("game-save-recovered"));
});

test("storage sao lưu bản trước và báo lỗi khi không ghi được", () => {
  storageData.clear(); events.length = 0; failWrites = false;
  storageData.set("save", JSON.stringify({ quests: [], points: 10 }));
  assert.equal(window.GameStorage.save("save", { quests: [], points: 20 }), true);
  assert.equal(JSON.parse(storageData.get("save.backup")).points, 10);
  assert.equal(JSON.parse(storageData.get("save")).points, 20);
  failWrites = true;
  assert.equal(window.GameStorage.save("save", { quests: [], points: 30 }), false);
  assert.ok(events.includes("game-save-error"));
  failWrites = false;
});

test("timer đếm phiên và focus theo thời gian giả lập", () => {
  const NativeDate = Date;
  let now = 100000;
  class MockDate extends NativeDate { static now() { return now; } }
  context.Date = MockDate;
  const T = window.GameTimer;
  assert.equal(T.togglePlay(10), true);
  assert.equal(T.isPlaying(), true);
  now += 2500;
  assert.deepEqual(JSON.parse(JSON.stringify(T.tickPlay(10))), { elapsed: 2, remaining: 8, ended: false });
  now += 8000;
  assert.deepEqual(JSON.parse(JSON.stringify(T.tickPlay(8))), { elapsed: 8, remaining: 0, ended: true });
  assert.equal(T.isPlaying(), false);
  assert.equal(T.togglePlay(0), false);
  assert.equal(T.startFocus("quest-1", 5000), true);
  assert.equal(T.startFocus("quest-2", 5000), false);
  now += 1001;
  assert.equal(T.focusRemaining(), 4);
  T.cancelFocus();
  assert.equal(T.activeFocus(), null);
  context.Date = NativeDate;
});

test("pet data giữ nguyên thứ hạng và buff của từng linh thú", () => {
  const P = window.GamePetData;
  assert.equal(P.rank({ n: "Linh thú", ranks: ["Ấu", "Trưởng", "Thánh"] }, 2), "Trưởng");
  assert.equal(P.rank({ n: "Linh thú", ranks: ["Ấu", "Trưởng"] }, 99), "Trưởng");
  assert.equal(P.rank({ n: "Linh thú", ranks: ["Ấu", "Trưởng"] }, 0), "Ấu");
  assert.equal(P.rank({ n: "Tên gốc" }, 3), "Tên gốc");
  const expected = {
    hq: { fq: 3 }, kl: { fl: 8 }, ct: { kp: 8 }, hg: { dc: 8 },
    bh: { fr: 6, ft: 6 }, tt: { dr: .06 }, tn: { f1: 10 }, pg: { fs: 3 },
    ko: { fm: 6 }, dm: { fn: 6 }, ty: { rf: 6 }, mm: { mn: 3 }
  };
  for (const [id, buff] of Object.entries(expected)) {
    assert.deepEqual(JSON.parse(JSON.stringify(P.buff({ [id]: { lv: 3 } }, id))), buff, id);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(P.buff({}, "hq"))), {});
  assert.deepEqual(JSON.parse(JSON.stringify(P.buff({ hq: { lv: 3 } }, null))), {});
});

test("time format giữ nguyên cách hiển thị thời lượng và giờ", () => {
  const T = window.GameTimeFormat;
  assert.equal(T.pad(0), "00");
  assert.equal(T.pad(7), "07");
  assert.equal(T.pad(123), "123");
  assert.equal(T.formatDuration(0), "00:00");
  assert.equal(T.formatDuration(65), "01:05");
  assert.equal(T.formatDuration(3661), "1:01:01");
  assert.equal(T.formatDuration(86400), "24:00:00");
  assert.equal(T.toMinutes("00:00"), 0);
  assert.equal(T.toMinutes("07:35"), 455);
  assert.equal(T.toClock(0), "00:00");
  assert.equal(T.toClock(455), "07:35");
  assert.equal(T.toClock(1440), "24:00");
  assert.match(T.currentClock(), /^\d{2}:\d{2}$/);
});


test("progression data giữ nguyên xếp loại, điểm thiên kiếp và tiến độ đạo tâm", () => {
  const P = window.GameProgressData;
  assert.deepEqual([49, 50, 64, 65, 79, 80, 89, 90, 100].map(P.grade),
    ["Yếu", "Trung bình", "Trung bình", "Khá", "Khá", "Giỏi", "Giỏi", "Xuất sắc", "Xuất sắc"]);
  const exam = { chuan: 100, a: 0.8, bm: 12, ls: 10 };
  const ratio = (1 - Math.exp(-1.6)) / (1 - Math.exp(-1.6));
  assert.equal(P.normalizedExamProgress(100, exam), ratio);
  assert.equal(P.examScore(100, exam, 2), 92);
  assert.equal(P.examScore(0, exam, -2), 0);
  assert.equal(P.npcExamScore(100, exam), 100);
  assert.equal(P.npcExamScore(0, exam), 0);
  assert.equal(P.taoTamProgress(-5, exam), 0);
  assert.equal(P.taoTamProgress(5, exam), 0.5);
  assert.equal(P.taoTamProgress(20, exam), 1);
});

test("progression data tính cảnh giới và tầng tu vi đúng các mốc", () => {
  const P = window.GameProgressData;
  const realms = [["Luyện Khí", 0], ["Trúc Cơ", 20000], ["Kim Đan", 42000], ["Chân Tiên", 200000]];
  assert.equal(P.realmIndex(0, realms), 0);
  assert.equal(P.realmIndex(19999, realms), 0);
  assert.equal(P.realmIndex(20000, realms), 1);
  assert.equal(P.realmIndex(42000, realms), 2);
  assert.equal(P.realmIndex(199999, realms), 2);
  assert.equal(P.realmIndex(200000, realms), 3);
  assert.equal(P.realmName(0, realms), "Luyện Khí tầng 1");
  assert.equal(P.realmName(20000, realms), "Trúc Cơ tầng 1");
  assert.equal(P.realmName(41999, realms), "Trúc Cơ tầng 9");
  assert.equal(P.realmName(200000, realms), "Chân Tiên");
});

test("date data giữ nguyên ngày địa phương, bù ngày và đầu tuần thứ Hai", () => {
  const D = window.GameDateData;
  const base = new Date(2026, 10, 23, 12, 0, 0, 0).getTime(); // Thứ Hai
  const day = new Date(base).toLocaleDateString("sv");
  const yesterday = new Date(base - 864e5).toLocaleDateString("sv");
  assert.equal(D.today(0, base), day);
  assert.equal(D.today(1, base), new Date(base + 864e5).toLocaleDateString("sv"));
  assert.equal(D.dayOffset(0, 1, base), yesterday);
  assert.equal(D.dayOffset(0, 0, base), day);
  assert.equal(D.weekStart(0, base), day);
  assert.equal(D.weekStart(0, base + 2 * 864e5), day);
  assert.equal(D.weekStart(0, base - 864e5), new Date(base - 7 * 864e5).toLocaleDateString("sv"));
});


test("noise hash ổn định và value noise nội suy trơn", () => {
  const N = window.GameNoise;
  assert.equal(N.hash(0, 0, 0), -1);
  assert.ok(Math.abs(N.hash(1, 2, 3) - 0.38220274294312184) < 1e-15);
  assert.ok(Math.abs(N.hash(10, 20, 30) - (-0.15957781885740763)) < 1e-15);
  assert.ok(Math.abs(N.value(42, 7, 2.25) - 0.3028273971845228) < 1e-15);
  assert.equal(N.value(42, 7, 2), N.hash(42, 7, 2));
  assert.equal(N.value(42, 7, 3), N.hash(42, 7, 3));
  assert.equal(N.value(42, 7, -2), N.hash(42, 7, -2));
  assert.ok(N.value(42, 7, 2.5) >= Math.min(N.hash(42, 7, 2), N.hash(42, 7, 3)));
  assert.ok(N.value(42, 7, 2.5) <= Math.max(N.hash(42, 7, 2), N.hash(42, 7, 3)));
});


test("text utilities escape HTML như helper cũ", () => {
  const E = window.GameText.escapeHtml;
  assert.equal(E("A&B <C> \"D\""), "A&amp;B &lt;C&gt; &quot;D&quot;");
  assert.equal(E("không có ký tự đặc biệt"), "không có ký tự đặc biệt");
  assert.equal(E("&lt;"), "&amp;lt;");
  assert.equal(E(""), "");
  assert.throws(() => E(null), /replace/);
});


test("sect war giữ nguyên lịch ghép cặp và lời dẫn chiến tông môn", () => {
  const W = window.GameSectWar;
  for (let week = -25; week <= 25; week++) {
    const pairs = W.pairs(week);
    assert.equal(pairs.length, 3);
    assert.deepEqual(Array.from(pairs, x => Array.from(x)), [[0, 1 + (((week % 5) + 5) % 5)], [1 + (((week % 5) + 5 + 1) % 5), 1 + (((week % 5) + 5 + 4) % 5)], [1 + (((week % 5) + 5 + 2) % 5), 1 + (((week % 5) + 5 + 3) % 5)]]);
    assert.deepEqual([...new Set(pairs.flat())].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5]);
    assert.ok(pairs.every(pair => pair.length === 2 && pair[0] !== pair[1]));
  }
  assert.deepEqual(Array.from(W.flavor(0, 0)), ["Kiếm khí xung thiên", "Hai tông đọ kiếm đạo, tốc chiến quyết thắng thua."]);
  assert.deepEqual(Array.from(W.flavor(2, 3)), ["Bách Thảo đồng tâm", "Y đạo hợp lực, lấy nhu thắng cương."]);
  assert.equal(W.flavor(2, 3), W.flavor(2, 3));
});


test("quest data xác định hoàn thành một lần và nhiệm vụ lặp theo ngày", () => {
  const done = window.GameQuestData.isDone;
  assert.equal(done({ doneOn: null, repeat: false }, "2026-11-23"), false);
  assert.equal(done({ doneOn: "2026-11-22", repeat: false }, "2026-11-23"), true);
  assert.equal(done({ doneOn: "2026-11-22", repeat: true }, "2026-11-23"), false);
  assert.equal(done({ doneOn: "2026-11-23", repeat: true }, "2026-11-23"), true);
  assert.equal(done({ doneOn: "", repeat: true }, "2026-11-23"), false);
});
