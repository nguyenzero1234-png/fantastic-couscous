const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const jsDir = path.join(root, "www", "js");
const window = { dispatchEvent(event) { events.push(event.type); } };
const rootAttributes = new Map();
const document = { documentElement: {
  removeAttribute(name) { rootAttributes.delete(name); },
  setAttribute(name, value) { rootAttributes.set(name, value); }
} };
const storageData = new Map();
const events = [];
let failWrites = false;
const localStorage = {
  getItem(key) { return storageData.has(key) ? storageData.get(key) : null; },
  setItem(key, value) { if (failWrites) throw new Error("quota exceeded"); storageData.set(key, String(value)); },
  removeItem(key) { storageData.delete(key); },
  clear() { storageData.clear(); }
};
const context = vm.createContext({ window, document, localStorage, Event: class Event { constructor(type) { this.type = type; } }, console: { warn() {}, error() {}, info() {} }, Date, Math, Object, Array, Number, String, RegExp, JSON });
function load(name) {
  const source = fs.readFileSync(path.join(jsDir, name), "utf8");
  new vm.Script(source, { filename: name }).runInContext(context);
}
const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
const scriptNames = [...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x => x[1]);
const moduleFiles = fs.readdirSync(jsDir)
  .filter(file => file.endsWith(".js") && !["game.js", "notify.js", "schedule.js"].includes(file));
scriptNames.filter(name => moduleFiles.includes(name)).forEach(load);

test("tất cả script JavaScript trong www/js parse được", () => {
  for (const file of fs.readdirSync(jsDir).filter(x => x.endsWith(".js"))) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(path.join(jsDir, file), "utf8"), { filename: file }));
  }
});

test("mọi script được khai báo đều tồn tại trong www và module nạp trước game.js", () => {
  const names = scriptNames;
  const gameIndex = names.indexOf("game.js");
  assert.notEqual(gameIndex, -1, "game.js phải được khai báo");
  assert.equal(new Set(names).size, names.length, "không được nạp trùng script");
  for (const name of names) {
    assert.ok(fs.existsSync(path.join(root, "www", "js", name)), name + " phải tồn tại trong www");
  }
  for (const file of moduleFiles) {
    assert.ok(names.includes(file), file + " phải được khai báo trong index.html");
    assert.ok(names.indexOf(file) < gameIndex, file + " phải nạp trước game.js");
  }
  for (const name of ["notify.js", "schedule.js"]) {
    assert.ok(names.includes(name), name + " phải được khai báo");
    assert.ok(names.indexOf(name) > gameIndex, name + " phải nạp sau game.js");
  }
});

test("GameUI áp dụng tùy chọn giao diện và xóa thuộc tính mặc định", () => {
  const apply = window.GameUI.apply;
  apply({ ui: { skin: "jade", density: "compact", fs: "lg", theme: "dark" } });
  assert.deepEqual(Object.fromEntries(rootAttributes), {
    "data-skin": "jade", "data-density": "compact", "data-fs": "lg", "data-theme": "dark"
  });
  apply({ ui: {} });
  assert.deepEqual(Object.fromEntries(rootAttributes), {});
  apply(null);
  assert.deepEqual(Object.fromEntries(rootAttributes), {});
});

test("các module giao diện và tiến trình được khởi tạo trong môi trường tích hợp", () => {
  assert.equal(typeof window.GameUI.apply, "function");
  assert.equal(typeof window.GameProgressData.realmIndex, "function");
  assert.equal(typeof window.GameProgressData.bestKiep, "function");
  assert.equal(typeof window.GameAnalytics.sumStudyMinutesBetween, "function");
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


test("npc data xác định thiên phú độc nhất theo chỉ số và dữ liệu NPC", () => {
  const N = window.GameNpcData;
  const npcs = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, { tk: 1 }, { tk: false }];
  assert.equal(N.isUniqueTalent(9, npcs), true);
  assert.equal(N.isUniqueTalent(10, npcs), true);
  assert.equal(N.isUniqueTalent(11, npcs), false);
  assert.equal(N.isUniqueTalent(8, npcs), false);
  assert.equal(N.isUniqueTalent(-1, npcs), false);
  assert.equal(N.isUniqueTalent(99, npcs), false);
});


test("time format giữ nguyên cách làm tròn thời gian còn lại", () => {
  const T = window.GameTimeFormat;
  assert.equal(T.remaining(60000, 0), "1 phút");
  assert.equal(T.remaining(3600000, 0), "1 giờ 0 phút");
  assert.equal(T.remaining(3660000, 0), "1 giờ 1 phút");
  assert.equal(T.remaining(1, 60000), "0 phút");
  assert.equal(T.remaining(60001, 0), "2 phút");
});

test("quest data xác định hạn chót và khóa chuỗi đúng thứ tự cũ", () => {
  const Q = window.GameQuestData;
  const done = q => !!q.done;
  assert.equal(Q.isExpired({ due: 100 }, done, 101), true);
  assert.equal(Q.isExpired({ due: 100 }, done, 100), false);
  assert.equal(Q.isExpired({ due: 100, done: true }, done, 101), false);
  assert.equal(Q.isExpired({ due: 0 }, done, 101), false);
  const first = { chain: "a", done: true }, second = { chain: "a" }, other = { chain: "b" };
  assert.equal(Q.isUnlocked([first, second, other], second, done), true);
  assert.equal(Q.isUnlocked([first, second, other], other, done), true);
  first.done = false;
  assert.equal(Q.isUnlocked([first, second], second, done), false);
  assert.equal(Q.isUnlocked([first, second], { chain: "a" }, done), false);
  assert.equal(Q.isUnlocked([first, second], { chain: "missing" }, done), true);
});

test("progression data tính linh lực tại mốc ngày như helper cũ", () => {
  const P = window.GameProgressData;
  const history = {
    "2026-11-20": { p: 100 }, "2026-11-22": { p: 200 },
    "2026-11-23": { p: 300 }, "2026-11-24": { p: 400 }
  };
  assert.equal(P.playerXpAt(history, 1200, "2026-11-21"), 300);
  assert.equal(P.playerXpAt(history, 1200, "2026-11-23"), 800);
  assert.equal(P.playerXpAt(history, 500, "2026-11-24"), 500);
  assert.equal(P.playerXpAt({ "2026-11-20": { p: 0 } }, 42, "2026-11-20"), 42);
});


test("progression data tính ngày hoạt động và chuỗi theo nhật ký/streak", () => {
  const P = window.GameProgressData;
  const today = "2026-11-23", yesterday = "2026-11-22";
  const date = new Date(today + "T12:00:00");
  const history = {
    "2026-11-23": { m: 20 }, "2026-11-22": { m: 10 },
    "2026-11-20": { m: 30 }, "2026-11-19": { m: 0 }
  };
  const streak = { last: today, n: 3 };
  assert.equal(P.activeDays(history, streak, date, false, today), 4);
  assert.equal(P.activeDays(history, { last: "", n: 0 }, date, false, today), 3);
  assert.equal(P.activeDays(history, streak, new Date("2026-11-30T12:00:00"), false, today), 4);
  assert.equal(P.streakAt(history, streak, date, false, today, yesterday), 2);
  assert.equal(P.streakAt(history, { last: "", n: 0 }, date, false, today, yesterday), 2);
  assert.equal(P.streakAt(history, streak, date, true, today, yesterday), 3);
  assert.equal(P.streakAt(history, { last: yesterday, n: 5 }, date, true, today, yesterday), 5);
});


test("date data tạo ngày thi tại 12 giờ local và cộng ngày lịch", () => {
  const D = window.GameDateData;
  const start = new Date(2026, 10, 23, 2, 45, 0, 0);
  const result = D.examDate(start, 3);
  assert.equal(result.getFullYear(), 2026);
  assert.equal(result.getMonth(), 10);
  assert.equal(result.getDate(), 26);
  assert.equal(result.getHours(), 12);
  assert.equal(result.getMinutes(), 0);
  assert.equal(start.getDate(), 23);
  assert.equal(start.getHours(), 2);
  assert.equal(D.examDate(start, -2).getDate(), 21);
});

test("time format giữ nguyên định dạng ngày giờ sự kiện tiếng Việt", () => {
  const T = window.GameTimeFormat;
  for (const timestamp of [0, 1799999999000, 1799999999000 + 86400000]) {
    assert.equal(T.eventTimestamp(timestamp), new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
    }));
  }
});


test("date data tạo khóa ngày/tuần/tháng cho nhiệm vụ định kỳ", () => {
  const D = window.GameDateData;
  assert.equal(D.periodKey("d", "2026-11-23", "2026-11-23"), "2026-11-23");
  assert.equal(D.periodKey("w", "2026-11-23", "2026-11-23"), "2026-11-23");
  assert.equal(D.periodKey("m", "2026-11-23", "2026-11-23"), "2026-11");
  assert.equal(D.periodKey("unknown", "2026-01-02", "2025-12-29"), "2026-01");
});

test("time format định dạng số giờ từ phút với một chữ số thập phân", () => {
  const T = window.GameTimeFormat;
  assert.equal(T.hoursLabel(0), "0.0 giờ");
  assert.equal(T.hoursLabel(30), "0.5 giờ");
  assert.equal(T.hoursLabel(60), "1.0 giờ");
  assert.equal(T.hoursLabel(125), "2.1 giờ");
  assert.equal(T.hoursLabel(-30), "-0.5 giờ");
});


test("analytics tính tiến độ nhiệm vụ theo ngày, tuần, tháng và loại chỉ số", () => {
  const A = window.GameAnalytics;
  const history = {
    "2026-11-23": { m: 45, p: 100 },
    "2026-11-22": { m: 20, p: 50 },
    "2026-11-16": { m: 60, p: 120 },
    "2026-10-31": { m: 90, p: 200 }
  };
  const counts = { "2026-11-23": 2, "2026-11-22": 1, "2026-11-16": 3 };
  const today = "2026-11-23", week = "2026-11-23";
  assert.equal(A.questProgress(history, counts, { per: "d", met: "m" }, today, week), 45);
  assert.equal(A.questProgress(history, counts, { per: "w", met: "p" }, today, week), 100);
  assert.equal(A.questProgress(history, counts, { per: "m", met: "c" }, today, week), 6);
  assert.equal(A.questProgress(history, counts, { per: "m", met: "other" }, today, week), 2);
  assert.equal(A.questProgress({}, {}, { per: "d", met: "m" }, today, week), 0);
});


test("npc data nhận diện đúng Cố Thái Hư được miễn hiệu ứng", () => {
  const N = window.GameNpcData;
  const npcs = [{ n: "Tu sĩ A" }, { n: "Cố Thái Hư" }, { n: "Tu sĩ B" }];
  assert.equal(N.isImmuneTaiHu(1, npcs), true);
  assert.equal(N.isImmuneTaiHu(0, npcs), false);
  assert.equal(N.isImmuneTaiHu(2, npcs), false);
  assert.equal(N.isImmuneTaiHu(-1, npcs), false);
  assert.equal(N.isImmuneTaiHu(8, npcs), false);
  assert.equal(N.isImmuneTaiHu(0, []), false);
});


test("analytics sumMinutes giữ nguyên phép cộng lịch sử theo predicate", () => {
  const A = window.GameAnalytics;
  const H = {
    "2026-11-20": { m: 45 },
    "2026-11-21": { m: 0 },
    "2026-11-22": { m: 90 },
    "2026-11-23": { m: 30 }
  };
  assert.equal(A.sumMinutes(H, () => true), 165);
  assert.equal(A.sumMinutes(H, key => key >= "2026-11-22"), 120);
  assert.equal(A.sumMinutes(H, key => key === "2026-11-21"), 0);
  assert.equal(A.sumMinutes({}, () => true), 0);
  assert.equal(A.sumMinutes(H, () => false), 0);
});


test("streak current chỉ trả chuỗi khi lần học cuối là hôm nay hoặc hôm qua", () => {
  const S = window.GameStreak;
  assert.equal(S.current({ last: "2026-11-23", n: 7 }, "2026-11-23", "2026-11-22"), 7);
  assert.equal(S.current({ last: "2026-11-22", n: 4 }, "2026-11-23", "2026-11-22"), 4);
  assert.equal(S.current({ last: "2026-11-21", n: 9 }, "2026-11-23", "2026-11-22"), 0);
  assert.equal(S.current({ last: "", n: 0 }, "2026-11-23", "2026-11-22"), 0);
  assert.equal(S.current(null, "2026-11-23", "2026-11-22"), 0);
});


test("progression data chọn kiếp có linh lực cao nhất, giữ quy tắc hòa điểm", () => {
  const P = window.GameProgressData;
  const history = [{ n: 1, pk: 500 }, { n: 2, pk: 800 }, { n: 3, pk: 700 }];
  assert.deepEqual(JSON.parse(JSON.stringify(P.bestKiep(history, 600, 750, 4))), { n: 2, pk: 800 });
  assert.deepEqual(JSON.parse(JSON.stringify(P.bestKiep(history, 900, 850, 4))), { n: 4, pk: 900, cur: 1 });
  assert.deepEqual(JSON.parse(JSON.stringify(P.bestKiep(history, 800, 750, 4))), { n: 2, pk: 800 });
  assert.deepEqual(JSON.parse(JSON.stringify(P.bestKiep([], 0, 125, 1))), { n: 1, pk: 125, cur: 1 });
  assert.deepEqual(JSON.parse(JSON.stringify(P.bestKiep([{ n: 1, pk: 400 }, { n: 2, pk: 400 }], 0, 0, 3))), { n: 1, pk: 400 });
});


test("analytics cộng linh lực trong khoảng ngày có đầu bao gồm, cuối loại trừ", () => {
  const A = window.GameAnalytics;
  const H = {
    "2026-11-20": { p: 10 }, "2026-11-21": { p: 20 },
    "2026-11-22": { p: 0 }, "2026-11-23": { p: 40 },
    "2026-11-24": { p: 80 }
  };
  assert.equal(A.sumPointsBetween(H, "2026-11-21", "2026-11-24"), 60);
  assert.equal(A.sumPointsBetween(H, "2026-11-20", "2026-11-21"), 10);
  assert.equal(A.sumPointsBetween(H, "2026-11-24", "2026-11-24"), 0);
  assert.equal(A.sumPointsBetween({}, "2026-11-20", "2026-11-24"), 0);
});

test("analytics cộng linh lực đến hết ngày được chọn", () => {
  const A = window.GameAnalytics;
  const H = {
    "2026-11-20": { p: 10 }, "2026-11-21": { p: 20 },
    "2026-11-22": { p: 0 }, "2026-11-23": { p: 40 },
    "2026-11-24": { p: 80 }
  };
  assert.equal(A.pointsThrough(H, "2026-11-22"), 30);
  assert.equal(A.pointsThrough(H, "2026-11-24"), 150);
  assert.equal(A.pointsThrough(H, "2026-11-19"), 0);
  assert.equal(A.pointsThrough({}, "2026-11-24"), 0);
});


test("analytics đếm nhật ký theo khoảng ngày và điều kiện giờ local", () => {
  const A = window.GameAnalytics;
  const log = [
    [new Date(2026, 10, 22, 23, 0).getTime(), 10],
    [new Date(2026, 10, 23, 4, 30).getTime(), 10],
    [new Date(2026, 10, 23, 6, 59).getTime(), 10],
    [new Date(2026, 10, 23, 7, 0).getTime(), 10],
    [new Date(2026, 10, 24, 1, 0).getTime(), 10],
    [new Date(2026, 10, 25, 23, 0).getTime(), 10]
  ];
  const start = new Date(2026, 10, 23, 12).toLocaleDateString("sv");
  const end = new Date(2026, 10, 24, 12).toLocaleDateString("sv");
  assert.equal(A.countStudyLogEntries(log, start, end, h => h >= 22 || h < 5), 2);
  assert.equal(A.countStudyLogEntries(log, start, end, h => h < 7), 3);
  assert.equal(A.countStudyLogEntries(log, start, end, h => h === 7), 1);
  assert.equal(A.countStudyLogEntries([], start, end, () => true), 0);
});


test("analytics cộng số nhiệm vụ theo khoảng ngày với cả hai đầu bao gồm", () => {
  const A = window.GameAnalytics;
  const C = {
    "2026-11-20": 2, "2026-11-21": 0,
    "2026-11-22": 3, "2026-11-23": 4,
    "2026-11-24": 5
  };
  assert.equal(A.sumCountsBetween(C, "2026-11-21", "2026-11-23"), 7);
  assert.equal(A.sumCountsBetween(C, "2026-11-20", "2026-11-20"), 2);
  assert.equal(A.sumCountsBetween(C, "2026-11-24", "2026-11-24"), 5);
  assert.equal(A.sumCountsBetween(C, "2026-11-25", "2026-11-30"), 0);
  assert.equal(A.sumCountsBetween({}, "2026-11-20", "2026-11-24"), 0);
});


test("analytics tổng hợp ngày học và phút cao nhất trong cửa sổ ngày", () => {
  const A = window.GameAnalytics;
  const H = {
    "2026-11-20": { m: 30 }, "2026-11-21": { m: 0 },
    "2026-11-22": { m: 120 }, "2026-11-23": { m: 45 },
    "2026-11-24": { m: 240 }
  };
  assert.deepEqual(JSON.parse(JSON.stringify(A.studyWindowStats(H, "2026-11-21", "2026-11-23"))), {
    days: ["2026-11-21", "2026-11-22", "2026-11-23"],
    daysWithStudy: 2,
    bestMinutes: 120
  });
  assert.deepEqual(JSON.parse(JSON.stringify(A.studyWindowStats(H, "2026-11-24", "2026-11-24"))), {
    days: ["2026-11-24"], daysWithStudy: 1, bestMinutes: 240
  });
  assert.deepEqual(JSON.parse(JSON.stringify(A.studyWindowStats({}, "2026-11-20", "2026-11-24"))), {
    days: [], daysWithStudy: 0, bestMinutes: 0
  });
});


test("analytics cộng phút học trong khoảng timestamp, bao gồm cả hai đầu", () => {
  const A = window.GameAnalytics;
  const log = [
    [1000, 15], [2000, 30], [3000, 45], [4000, 60]
  ];
  assert.equal(A.sumStudyMinutesBetween(log, 2000, 3000), 75);
  assert.equal(A.sumStudyMinutesBetween(log, 1000, 1000), 15);
  assert.equal(A.sumStudyMinutesBetween(log, 3500, 3999), 0);
  assert.equal(A.sumStudyMinutesBetween([], 0, 5000), 0);
  assert.equal(A.sumStudyMinutesBetween(null, 0, 5000), 0);
});


test("kiếp nạn data giữ nguyên phép sinh sự kiện xác định theo seed", () => {
  const K = window.GameKiepNanData;
  const types = [
    ["A", "Mô tả A", 1], ["B", "Mô tả B", 1], ["C", "Mô tả C", 1],
    ["D", "Mô tả D", 1.5], ["E", "Mô tả E", 1], ["F", "Mô tả F", 1]
  ];
  const hash = (seed, channel, hour) => channel === 90
    ? 0.9
    : ({ 91: 0.1, 92: 0.3, 93: 0.5, 94: 0.7 }[channel] ?? 0.1);
  const event = K.create(123, 10, 1000000, types, hash);
  assert.deepEqual(JSON.parse(JSON.stringify(event)), {
    h: 10, k: 3, W: 3, T: 45, st: 1000000 + 10.7 * 3600000,
    en: 1000000 + 10.7 * 3600000 + 3 * 3600000,
    pts: Math.round(45 * 0.8 * (1 + (8 - 3) / 8) * 1.5),
    name: "D", desc: "Mô tả D"
  });
  assert.equal(K.create(123, 10, 1000000, types, () => 0.87), null);
  assert.equal(K.create(123, 10, 1000000, types, () => 0.88).h, 10);
});

test("kiếp nạn data không sửa bảng cấu hình và truyền hash từ caller", () => {
  const K = window.GameKiepNanData;
  const types = [["A", "A desc", 2], ["B", "B desc", 1]];
  const before = JSON.stringify(types);
  const calls = [];
  const hash = (...args) => { calls.push(args); return args[1] === 90 ? 0.99 : 0.2; };
  K.create(77, 4, 500, types, hash);
  assert.equal(JSON.stringify(types), before);
  assert.ok(calls.length >= 1);
  assert.ok(calls.every(args => args[0] === 77 && args[2] === 4));
});


test("nhật ký tu tiên sinh nội dung xác định từ dữ liệu được truyền vào", () => {
  const D = window.GameDiaryData;
  const quotes = ["Đạo tâm bất động — lời chú thích", "Một bước cũng là đường."];
  const empty = D.generate("2026-11-23", { n: 0, m: 0, p: 0 }, {
    isToday: true, streak: 4
  }, quotes);
  assert.deepEqual(JSON.parse(JSON.stringify(empty)), [
    "Một ngày không ngồi xuống. Sổ vẫn mở, chờ.",
    "Chuỗi đang giữ từ hôm trước. Hôm nay còn chưa viết tiếp.",
    "Trích: Một bước cũng là đường."
  ]);
  const full = D.generate("2026-11-23", { n: 2, m: 125, p: 80.6 }, {
    isToday: true, streak: 7, tm: true, sectName: "Thanh Vân",
    menh: 60, petName: "Tiểu Hồ", storyTitles: ["Khai mạch"], prevMemory: null
  }, quotes);
  assert.ok(full[0].includes("2 nhiệm vụ, tu luyện 2 giờ 5 phút, thu 81 linh lực."));
  assert.ok(full.some(x => x.includes("Chuỗi 7 ngày.")));
  assert.ok(full.some(x => x.includes("Dưới cờ Thanh Vân.")));
  assert.ok(full.some(x => x.includes("Linh thú Tiểu Hồ")));
  assert.ok(full.some(x => x.includes("Đạo Văn: Khai mạch.")));
  assert.equal(full.length, 7);
});

test("nhật ký tu tiên không sửa dữ liệu đầu vào và giới hạn bảy dòng", () => {
  const D = window.GameDiaryData;
  const stats = { n: 1, m: 30, p: 10 };
  const context = { isToday: false, streak: 20, storyTitles: ["A", "B"] };
  const before = JSON.stringify([stats, context]);
  const result = D.generate("2026-11-20", stats, context, ["Một câu."]);
  assert.equal(JSON.stringify([stats, context]), before);
  assert.ok(result.length <= 7);
  assert.ok(result.some(x => x === "Đạo Văn: A · B."));
});
