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
let failBackupWrites = false;
const localStorage = {
  getItem(key) { return storageData.has(key) ? storageData.get(key) : null; },
  setItem(key, value) { if (failWrites || (failBackupWrites && key.endsWith(".backup"))) throw new Error("quota exceeded"); storageData.set(key, String(value)); },
  removeItem(key) { storageData.delete(key); },
  clear() { storageData.clear(); }
};
const context = vm.createContext({ window, document, localStorage, Event: class Event { constructor(type) { this.type = type; } }, console: { warn() {}, error() {}, info() {} }, Date, Math, Object, Array, Number, String, RegExp, JSON });
function load(name) {
  const source = fs.readFileSync(path.join(jsDir, name), "utf8");
  new vm.Script(source, { filename: name }).runInContext(context);
  Object.assign(context, window);
}
const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
const scriptNames = [...html.matchAll(/<script[^>]+src="js\/([^"]+)"/g)].map(x => x[1]);
function listJsFiles(dir, prefix = "") {
  return fs.readdirSync(path.join(jsDir, prefix), { withFileTypes: true }).flatMap(entry => {
    const name = prefix ? prefix + "/" + entry.name : entry.name;
    if (entry.isDirectory()) return listJsFiles(jsDir, name);
    return entry.isFile() && entry.name.endsWith(".js") ? [name] : [];
  });
}
const moduleFiles = listJsFiles(jsDir).filter(file => !["game.js", "notify.js", "schedule.js"].includes(file));
scriptNames.filter(name => moduleFiles.includes(name)).forEach(load);

test("tất cả script JavaScript trong www/js parse được", () => {
  for (const file of listJsFiles(jsDir)) {
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
  assert.ok(names.indexOf("core/storage.js") < names.indexOf("core/state.js"));
  assert.ok(names.indexOf("ui/preferences.js") < names.indexOf("game.js"));
  assert.ok(names.indexOf("core/game-loop.js") < names.indexOf("game.js"));
  assert.ok(names.indexOf("core/state.js") < gameIndex);
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

test("rewards tạo hệ số từ trạng thái tường minh và thời điểm truyền vào", () => {
  const R = window.GameRewards;
  const factors = R.rewardFactors({ tdPenalty: true, tdStacks: 3, balanced: true, balMult: 1.2, tm: true, tma: true, cbUntil: 1500 }, 1000);
  assert.equal(factors.td, 0.85);
  assert.equal(factors.balance, 1.2);
  assert.ok(Math.abs(factors.status - 0.572) < 1e-12);
  assert.deepEqual(JSON.parse(JSON.stringify(R.rewardFactors({ tdPenalty: true, tdStacks: 20, balanced: false, balMult: 1.2, tm: false, tma: false, cbUntil: 1000 }, 1000))), { td: 0.7, balance: 1, status: 1 });
  assert.deepEqual(JSON.parse(JSON.stringify(R.rewardFactors({}, 0))), { td: 1, balance: 1, status: 1 });
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

test("storage dùng mặc định khi cả save và backup đều không tồn tại", () => {
  storageData.clear();
  const defaults = { quests: [], points: 0, theme: "jade" };
  const state = window.GameStorage.load("new-save", defaults);
  assert.deepEqual(JSON.parse(JSON.stringify(state)), defaults);
});

test("storage không nạp backup sai schema và giữ trạng thái mặc định", () => {
  storageData.clear(); events.length = 0;
  storageData.set("invalid", JSON.stringify({ quests: "not-an-array", points: 90 }));
  storageData.set("invalid.backup", JSON.stringify({ quests: [], points: "not-a-number" }));
  const state = window.GameStorage.load("invalid", { quests: [], points: 0 });
  assert.equal(state.points, 0);
  assert.deepEqual(state.quests, []);
  assert.equal(events.includes("game-save-recovered"), false);
});

test("storage vẫn lưu save chính khi không ghi được backup", () => {
  storageData.clear(); failWrites = false; failBackupWrites = true;
  storageData.set("backup-fail", JSON.stringify({ quests: [], points: 5 }));
  assert.equal(window.GameStorage.save("backup-fail", { quests: [], points: 9 }), true);
  assert.equal(JSON.parse(storageData.get("backup-fail")).points, 9);
  assert.equal(storageData.has("backup-fail.backup"), false);
  failBackupWrites = false;
});


test("storage xuất backup có metadata và giữ nguyên dữ liệu", () => {
  const state = { quests: [{ id: "q1" }], points: 42, theme: "jade" };
  const raw = window.GameStorage.exportData(state);
  const backup = JSON.parse(raw);
  assert.equal(backup.app, "tu-tien-hoc-dao");
  assert.equal(backup.formatVersion, 1);
  assert.ok(Number.isFinite(Date.parse(backup.exportedAt)));
  assert.deepEqual(JSON.parse(JSON.stringify(backup.data)), state);
  assert.deepEqual(JSON.parse(JSON.stringify(window.GameStorage.parseBackup(raw))), state);
});

test("storage nhập backup versioned và bảo toàn save cũ vào backup trước", () => {
  storageData.clear();
  const oldState = { quests: [], points: 11 };
  const newState = { quests: [{ id: "imported" }], points: 88 };
  storageData.set("import-save", JSON.stringify(oldState));
  const raw = window.GameStorage.exportData(newState);
  const imported = window.GameStorage.importData("import-save", raw);
  assert.equal(imported.points, 88);
  assert.equal(JSON.parse(storageData.get("import-save")).points, 88);
  assert.equal(JSON.parse(storageData.get("import-save.backup")).points, 11);
});

test("storage nhập được backup JSON legacy và từ chối dữ liệu lỗi mà không sửa save", () => {
  storageData.clear();
  storageData.set("legacy-save", JSON.stringify({ quests: [], points: 7 }));
  const legacy = JSON.stringify({ quests: [{ id: "legacy" }], points: 19 });
  assert.equal(window.GameStorage.importData("legacy-save", legacy).points, 19);
  const before = storageData.get("legacy-save");
  assert.throws(() => window.GameStorage.importData("legacy-save", "{broken"), /JSON|position|property/i);
  assert.throws(() => window.GameStorage.importData("legacy-save", JSON.stringify({ quests: [], points: "bad" })), /invalid/i);
  assert.equal(storageData.get("legacy-save"), before);
});

test("storage từ chối nhập nếu không thể bảo toàn save hiện tại", () => {
  storageData.clear(); failWrites = false; failBackupWrites = true;
  storageData.set("protected-save", JSON.stringify({ quests: [], points: 31 }));
  const raw = window.GameStorage.exportData({ quests: [], points: 99 });
  assert.throws(() => window.GameStorage.importData("protected-save", raw), /quota exceeded/);
  assert.equal(JSON.parse(storageData.get("protected-save")).points, 31);
  failBackupWrites = false;
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
    menh: 60, storyTitles: ["Khai mạch"], prevMemory: null
  }, quotes);
  assert.ok(full[0].includes("2 nhiệm vụ, tu luyện 2 giờ 5 phút, thu 81 linh lực."));
  assert.ok(full.some(x => x.includes("Chuỗi 7 ngày.")));
  assert.ok(full.some(x => x.includes("Dưới cờ Thanh Vân.")));
  assert.ok(full.some(x => x.includes("Đạo Văn: Khai mạch.")));
  assert.equal(full.length, 7);
  const petOnly = D.generate("2026-11-24", { n: 1, m: 30, p: 10 }, {
    isToday: true, streak: 0, petName: "Tiểu Hồ"
  }, quotes);
  assert.ok(petOnly.some(x => x.includes("Tiểu Hồ")));
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


test("cơ duyên bảng xếp hạng chọn kết quả xác định và giữ nguyên thứ tự", () => {
  const L = window.GameLeaderboardData;
  const rows = [
    { n: "NPC A", i: 2, u: 0, rank: 8 },
    { n: "Bạn", i: -1, u: 1, rank: 9 },
    { n: "NPC B", i: 4, u: 0, rank: 10 }
  ];
  const calls = [];
  const hash = (...args) => {
    calls.push(args);
    return ({ 103: 0.1, 1000: 0.35, 105: 0.8 })[args[0]] ?? 0.1;
  };
  const result = L.rollSpecial(rows, 77, 100, hash);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), [
    { row: rows[0], k: 0 },
    { row: rows[1], k: 1 }
  ]);
  assert.equal(calls.length, 3);
  assert.deepEqual(calls.map(x => x.slice(1)), [[140, 77], [140, 77], [140, 77]]);
  assert.deepEqual(JSON.parse(JSON.stringify(L.rollSpecial([], 1, 2, hash))), []);
});


test("cơ duyên bảng xếp hạng giữ nguyên ngưỡng hash và mô tả đủ chín hiệu ứng", () => {
  const L = window.GameLeaderboardData;
  const thresholds = [0, 0.199999, 0.2, 0.399999, 0.4, 0.599999, 0.6];
  const expected = [0, 0, 1, 1, 2, 2, -1];
  thresholds.forEach((value, index) => {
    const result = L.rollSpecial([{ i: 3, u: 0, rank: 1 }], 9, 0, () => value);
    assert.equal(result.length, expected[index] < 0 ? 0 : 1);
    if (result.length) assert.equal(result[0].k, expected[index]);
  });
  const b = { b: 0.1 }, o = { bm: 1, neg: 0 };
  const descriptions = Array.from({ length: 9 }, (_, k) =>
    L.eventEffectText({ i: 0, k, c: 0.5, dh: 2, flat: 700 }, b, o));
  assert.equal(descriptions.length, 9);
  assert.ok(descriptions.every(x => typeof x === "string" && x.length > 0));
  assert.match(descriptions[0], /\+2\.0 giờ học\/ngày/);
  assert.match(descriptions[1], /hiệu suất/);
  assert.match(descriptions[8], /700 linh lực cố định/);
  assert.match(L.eventEffectText({ k: 2, c: 0.5, dh: 2, flat: 700 }, b, { bm: 2, neg: 1 }), /trừ thẳng/);
});


test("item data tạo tổng linh lực và mô tả vật phẩm mà không sửa cấu hình", () => {
  const I = window.GameItemData;
  const cases = [
    [{ id: "ca", c: 100, q: [2, 100, ""] }, { tot: 200, d: "Dùng: 2 nhiệm vụ kế tiếp, mỗi nhiệm vụ +100 linh lực cố định (tổng +200, gấp 2 lần giá)" }],
    [{ id: "fast", c: 800, q: [4, 200, "q"], u: "Tăng tốc" }, { tot: 800, d: "Dùng: Tăng tốc; 4 nhiệm vụ nhanh kế tiếp, mỗi nhiệm vụ +200 linh lực cố định (tổng +800, hoàn lại đủ giá cộng tác dụng riêng)" }],
    [{ id: "long", c: 900, q: [3, 300, "l"], ex: 100, u: "Bảo hộ" }, { tot: 1000, d: "Dùng: Bảo hộ; thêm 3 nhiệm vụ từ 60 phút kế tiếp, mỗi nhiệm vụ +300 linh lực cố định (tổng +1000, hoàn lại đủ giá cộng tác dụng riêng)" }],
    [{ id: "utility", c: 1000, q: [4, 250, ""], u: "Giảm giá" }, { tot: 1000, d: "Dùng: Giảm giá; 4 nhiệm vụ kế tiếp, mỗi nhiệm vụ +250 linh lực cố định (tổng +1000, hoàn lại đủ giá cộng tác dụng riêng)" }]
  ];
  for (const [item, expected] of cases) {
    const before = JSON.stringify(item);
    assert.deepEqual(JSON.parse(JSON.stringify(I.describe(item))), expected);
    assert.equal(JSON.stringify(item), before);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(I.describe({ id: "the", d: "Tự dùng" }))), {});
  assert.deepEqual(JSON.parse(JSON.stringify(I.describe(null))), {});
});


test("leaderboard sparkline tạo SVG ổn định, chuẩn hóa dữ liệu và xử lý chuỗi phẳng", () => {
  const L = window.GameLeaderboardData;
  assert.equal(L.sparkline([]), "");
  assert.equal(L.sparkline([5]), '<svg viewBox="0 0 80 22" width="80" height="22" style="color:var(--mute);flex:none"><polyline fill="none" stroke="currentColor" stroke-width="1.5" points="0.5,20.0"/></svg>');
  assert.equal(L.sparkline([0, 5, 10]), '<svg viewBox="0 0 80 22" width="80" height="22" style="color:var(--mute);flex:none"><polyline fill="none" stroke="currentColor" stroke-width="1.5" points="0.5,20.0 2.5,11.0 4.5,2.0"/></svg>');
  assert.match(L.sparkline([8, 8, 8]), /points="0.5,20.0 2.5,20.0 4.5,20.0"/);
  assert.match(L.sparkline([-10, 0, 10]), /points="0.5,20.0 2.5,11.0 4.5,2.0"/);
});


test("leaderboard rankRows sắp xếp giảm dần, giữ thứ tự hòa điểm và không sửa đầu vào", () => {
  const L = window.GameLeaderboardData;
  const rows = [
    { n: "NPC A", s: 50, i: 0 },
    { n: "Người chơi", s: 80, u: 1 },
    { n: "NPC B", s: 50, i: 1 },
    { n: "NPC C", s: 20, i: 2 }
  ];
  const before = JSON.stringify(rows);
  const ranked = L.rankRows(rows);
  assert.deepEqual(JSON.parse(JSON.stringify(ranked)), [
    { n: "Người chơi", s: 80, u: 1, rank: 1 },
    { n: "NPC A", s: 50, i: 0, rank: 2 },
    { n: "NPC B", s: 50, i: 1, rank: 3 },
    { n: "NPC C", s: 20, i: 2, rank: 4 }
  ]);
  assert.equal(JSON.stringify(rows), before);
  assert.deepEqual(JSON.parse(JSON.stringify(L.rankRows([]))), []);
});

test("rebirth gradeSummary giữ nguyên các ngưỡng xếp loại kiếp", () => {
  const R = window.GameRebirthData;
  const end = 1000;
  const cases = [
    [{ pk: 1000, hrs: 5 * 10, days: 10, rank: 5 }, ["Viên Mãn Xuất Chúng", "Một kiếp trọn vẹn. Hiếm có người đi hết như vậy."]],
    [{ pk: 1000, hrs: 5 * 10, days: 10, rank: 6 }, ["Xuất Sắc", "Một kiếp vững vàng. Không có gì phải hổ thẹn."]],
    [{ pk: 700, hrs: 5 * 10, days: 10, rank: 10 }, ["Xuất Sắc", "Một kiếp vững vàng. Không có gì phải hổ thẹn."]],
    [{ pk: 500, hrs: 3.5 * 10, days: 10, rank: 20 }, ["Giỏi", "Một kiếp đáng nhớ. Thiếu một chút nữa là xong."]],
    [{ pk: 300, hrs: 1 * 10, days: 10, rank: 100 }, ["Trung Bình", "Một kiếp bình thường. Bình thường cũng là đã sống."]],
    [{ pk: 100, hrs: 1 * 10, days: 10, rank: 100 }, ["Yếu", "Một kiếp lơi tay. Kiếp sau còn trang trắng."]]
  ];
  for (const [input, expected] of cases) {
    assert.deepEqual(JSON.parse(JSON.stringify(R.gradeSummary(input, end))), { grade: expected[0], text: expected[1] });
  }
  assert.deepEqual(JSON.parse(JSON.stringify(R.gradeSummary({ pk: 0, hrs: 0, days: 0, rank: 99 }, end))), {
    grade: "Yếu", text: "Một kiếp lơi tay. Kiếp sau còn trang trắng."
  });
});

test("rebirth previousMemory định dạng ký ức kiếp trước và xử lý dữ liệu trống", () => {
  const R = window.GameRebirthData;
  assert.equal(R.previousMemory([]), "");
  assert.equal(R.previousMemory(null), "");
  assert.equal(R.previousMemory([{}]), "");
  assert.equal(R.previousMemory([{ grade: "Xuất Sắc", pk: 1200, rank: 3, sect: "Thanh Vân" }]),
    "Ký ức kiếp trước: kiếp trước đánh giá Xuất Sắc, đỉnh 1200 linh lực, hạng 3, từng thuộc Thanh Vân.");
  assert.equal(R.previousMemory([{ grade: "Giỏi", pk: 0, rank: 0, sect: "" }]),
    "Ký ức kiếp trước: kiếp trước đánh giá Giỏi.");
  assert.equal(R.previousMemory([{ grade: "" }, { pk: 500 }]),
    "Ký ức kiếp trước: đỉnh 500 linh lực.");
});

test("progression examConditions giữ nguyên điều kiện đạt điểm tối đa", () => {
  const P = window.GameProgressData;
  const exam = { a: 0.7, bm: 30, chuan: 1000, ls: 10 };
  const calls = [];
  const scoreAt = (xp, e, days) => { calls.push([xp, days]); return days >= 0.6 ? 100 : 99; };
  assert.deepEqual(JSON.parse(JSON.stringify(P.examConditions(exam, scoreAt, xp => `Cảnh giới ${xp}`))), [
    "70 điểm linh lực (linh lực ≥ 1000, Cảnh giới 1000) + 30 điểm đạo tâm (chuỗi ≥ 10 ngày)",
    "Đạt 100 khi linh lực ≥ 1000 và chuỗi học liên tục ≥ 6 ngày",
    "Chuỗi 5 ngày → +15 điểm đạo tâm · không có chuỗi → +0"
  ]);
  assert.deepEqual(calls, [[10000,0],[10000,0.1],[10000,0.2],[10000,0.3],[10000,0.4],[10000,0.5],[10000,0.6]]);
  assert.equal(P.examConditions({ ...exam, ls: 2 }, () => 99, () => "X")[1], "Không thể đạt 100");
});


test("sect-war stats tổng hợp linh lực và số tu sĩ theo tông môn", () => {
  const W = window.GameSectWar;
  assert.deepEqual(JSON.parse(JSON.stringify(W.stats(3, [
    { sect: 0, xp: 10 }, { sect: 1, xp: 20 }, { sect: 0, xp: 5 },
    { sect: 2, xp: 7 }
  ], 1, 12))), [
    { xp: 15, n: 2 }, { xp: 32, n: 2 }, { xp: 7, n: 1 }
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(W.stats(2, [], null, 999))), [
    { xp: 0, n: 0 }, { xp: 0, n: 0 }
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(W.stats(2, [
    { sect: 0, xp: 4 }, { sect: 9, xp: 100 }, null
  ], 8, 50))), [
    { xp: 4, n: 1 }, { xp: 0, n: 0 }
  ]);
});

test("quest completion module cập nhật streak, curse, điểm, lịch sử và thưởng chuỗi", () => {
  const Q = window.GameQuestCompletion;
  const state = {
    streak: { last: "yesterday", n: 2 }, inv: { the: 0 }, sh: 0, tm: 0, tmTasks: 0, tma: 0, tmaTasks: 0,
    pw: 0, buff: { n: 0, m: 1 }, tb: 0, fx: [], quests: [], chains: [], points: 10,
    hist: {}, cnt: {}, stl: [], tdPenalty: false, tdStacks: 0
  };
  const quest = { id: "q1", name: "Ôn tập", mins: 30, pts: 100, due: 0, chain: null };
  let extra = "";
  const logs = [];
  const daily = { q: 0, m: 0, ni: 0, da: 0, ru: 0, lg: 0, ms: 0, top: 0, t1: 0, mc: 0, tmc: 0 };
  const deps = {
    S: state, today: () => "2026-11-23", dayStr: () => "2026-11-22",
    GameTimer: { activeFocus: () => null, cancelFocus() {} },
    GameStreak: {
      completeDay: () => ({ streak: { n: 3, last: "2026-11-23" }, consumeLifeCharm: false, consumeHeartCharm: false, triggerDemon: false, extra: "", log: "" }),
      progressCurses: () => ({ tm: false, tmTasks: 0, tma: false, tmaTasks: 0, clearedSelf: false, clearedHeavenly: false, taskBonus: 0 })
    },
    KS: () => (state.kiepStats ||= {}), extraGet: () => extra, extraSet: v => { extra = v; },
    vlog: v => logs.push(v), TB: () => ({ cap: 5, flat: 0, mult: 1 }), LS: () => daily,
    petBuff: () => ({}), GameRewards: {
      streakMultiplier: () => 1,
      questCompletionReward: () => ({ gain: 100, effects: [] }),
      chainCompletionReward: () => 0
    },
    eqT: () => false, rewardFactors: () => ({ td: 1, balance: 1, status: 1 }),
    hourNow: () => 12, ITEMS: [], myRk: () => 50, hAdd: (day, points, mins) => {
      const h = state.hist[day] ||= { p: 0, m: 0 }; h.p += points; h.m += mins;
    },
    rname: () => "Luyện Khí", uxp: () => 10, isDone: q => !!q.doneOn
  };
  Q.finish(quest, deps);
  assert.equal(quest.got, 100);
  assert.equal(quest.doneOn, "2026-11-23");
  assert.equal(state.points, 110);
  assert.equal(state.hist["2026-11-23"].p, 100);
  assert.equal(state.hist["2026-11-23"].m, 30);
  assert.equal(state.streak.n, 3);
  assert.equal(daily.q, 1);
  assert.equal(daily.m, 30);
  assert.equal(logs.length, 1);
});

test("GamePetUI tách renderer và xử lý tương tác linh thú", () => {
  assert.equal(typeof window.GamePetUI.render, "function");
  assert.equal(typeof window.GamePetUI.handleClick, "function");
  assert.doesNotThrow(() => window.GamePetUI.handleClick({ target: { closest() { return null; } } }, {}));
});


test("sect missions giữ lựa chọn theo tuần, tiến độ và chỉ nhận thưởng một lần", () => {
  const M = window.GameSectMissions;
  const S = { sect: 0, cnt: { "2026-11-23": 5 }, streak: { n: 3 }, stl: [], sm: null };
  const deps = { weekStart: () => "2026-11-23", sumMins: () => 150, Date };
  const missions = M.list(S, deps);
  assert.deepEqual(JSON.parse(JSON.stringify(missions.map(x => x.id))), ["q5", "st3"]);
  assert.equal(missions.find(x => x.id === "q5").met(), 5);
  assert.equal(missions.find(x => x.id === "st3").met(), 3);
  const calls = [];
  const actions = { ...deps, say: x => calls.push(["say", x]), addPts: x => { calls.push(["points", x]); return x; },
    vlog: x => calls.push(["log", x]), save: () => calls.push(["save"]), render: () => calls.push(["render"]) };
  M.claim(S, "q5", actions);
  M.claim(S, "q5", actions);
  assert.equal(S.sm.got.q5, 1);
  assert.equal(calls.filter(x => x[0] === "points").length, 1);
  assert.equal(calls.filter(x => x[0] === "save").length, 1);
  const nextWeek = M.list(S, { ...deps, weekStart: () => "2026-11-30" });
  assert.deepEqual(JSON.parse(JSON.stringify(nextWeek.map(x => x.id))), ["q5", "st3"]);
  assert.deepEqual(JSON.parse(JSON.stringify(S.sm.got)), {});
});

test("sect missions không khởi tạo nhiệm vụ khi chưa gia nhập tông môn", () => {
  const S = { sect: null, sm: null };
  assert.deepEqual(JSON.parse(JSON.stringify(window.GameSectMissions.list(S, { weekStart: () => "2026-11-23" }))), []);
  assert.equal(S.sm, null);
});


test("sect war score averages NPC and player contribution per member", () => {
  const score = window.GameSectWar.score(3,
    [{ sect: 0, gain: 100 }, { sect: 0, gain: 60 }, { sect: 1, gain: 80 }],
    0, 40, [2, 1, 0]);
  assert.deepEqual(JSON.parse(JSON.stringify(score)), [200 / 3, 80, 0]);
});

test("sect war reward grants victory reward and optional bonus once per settlement call", () => {
  const S = { sect: 0, lb: { week: "2026-11-23" }, points: 10, inv: {} };
  const calls = [];
  const msg = window.GameSectWar.reward({
    state: S, sects: [{ n: "Thanh Vân" }, { n: "Huyền Kiếm" }, { n: "Đan Hà" }, { n: "Vạn Pháp" }, { n: "Cửu U" }, { n: "Bách Thảo" }],
    weekEnd: new Date("2026-11-23T00:00:00").getTime() - 2 * 6048e5,
    scoreWeek: () => [200, 0, 0, 0, 0, 0], modGain: x => x, hasTitle: () => false,
    today: () => "2026-11-23", addHistory: (...x) => calls.push(["history", ...x]),
    log: x => calls.push(["log", x]), random: () => 0
  });
  assert.match(msg, /đại thắng/);
  assert.equal(S.points, 230);
  assert.equal(S.lb.sw, 1);
  assert.equal(S.inv.ca, 1);
  assert.equal(calls.filter(x => x[0] === "history").length, 1);
});

test("sect war reward gives consolation for defeat and safely skips no-sect state", () => {
  const base = { lb: { week: "2026-11-23" }, points: 0, inv: {} };
  const deps = { state: { ...base, sect: 0 }, sects: Array.from({length:6}, (_,i)=>({n:"T"+i})),
    weekEnd: new Date("2026-11-23T00:00:00").getTime() - 2*6048e5,
    scoreWeek: () => [0, 0, 0, 200, 0, 0], modGain: x => x, hasTitle: () => false,
    today: () => "2026-11-23", addHistory: () => {}, log: () => {}, random: () => 1 };
  const msg = window.GameSectWar.reward(deps);
  assert.match(msg, /linh lực an ủi/);
  assert.equal(deps.state.points, 31);
  assert.equal(window.GameSectWar.reward({ state: { sect: null } }), "");
});


test("exam modal xác nhận thiên kiếp, mở khóa nền và điều hướng",()=>{
 const elements={thd:{style:{},hidden:true},exok:{}},body={style:{}},calls=[];
 const state={sem:{res:{e1:{rows:[{u:true,s:90,g:"Giỏi",ok:true}],menhLoss:0,seen:false}}},exLock:"e1"};
 const event={id:"e1",day:3,n:"Kiếp thử",desc:"Mô tả",kind:"Lôi kiếp",need:0,w:1};
 const deps={state,realmLabels:[["Phàm"],["Linh"]],exGod:()=>"",save:()=>calls.push("save"),go:(...x)=>calls.push(["go",...x]),render:()=>calls.push("render"),findNext:()=>null,document:{getElementById:id=>elements[id]},body,setTimeout:fn=>fn()};
 window.GameExamModal.show(deps,event);assert.equal(elements.thd.hidden,false);assert.match(elements.thd.innerHTML,/Thiên Kiếp Giáng Lâm/);assert.equal(body.style.pointerEvents,"none");elements.exok.onclick();
 assert.equal(state.sem.res.e1.seen,true);assert.equal(state.exLock,null);assert.equal(elements.thd.hidden,true);assert.deepEqual(calls,["save",["go","w","x"],"render"]);
});


test("GameStoryData ghi Đạo Văn duy nhất, giới hạn 40 bản ghi và không sửa dòng gốc", () => {
  const M = window.GameStoryData;
  const state = {};
  const lines = ["Dòng một", "Dòng hai"];
  assert.equal(M.append(state, "realm:1", "Trúc Cơ", lines, { realm: 1 }, 123, "2026-11-23"), true);
  assert.equal(M.append(state, "realm:1", "Trúc Cơ", ["Trùng"], null, 456, "2026-11-24"), false);
  assert.deepEqual(JSON.parse(JSON.stringify(state.storyLog[0])), {
    id: "realm:1", title: "Trúc Cơ", lines, at: 123, day: "2026-11-23", realm: 1
  });
  assert.deepEqual(lines, ["Dòng một", "Dòng hai"]);
  for (let i = 0; i < 45; i++) M.append(state, "entry:" + i, "Entry " + i, ["Nội dung"], null, i, "2026-11-23");
  assert.equal(state.storyLog.length, 40);
  assert.equal(state.storyLog[0].id, "entry:5");
  assert.equal(M.realmStory.length, 9);
  assert.equal(M.realmStory[2].t, "Kim Đan");
});


test("GameAudio tắt âm thanh theo state và gắn click âm thanh đúng phần tử", () => {
  const listeners = [];
  const doc = { addEventListener(type, fn, capture) { listeners.push({ type, fn, capture }); } };
  let muted = true, created = 0, tones = 0, clicks = 0;
  const audio = {
    currentTime: 1, sampleRate: 1000, destination: {},
    createOscillator() { tones++; return { frequency: {}, connect() {}, start() {}, stop() {} }; },
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, value: 0 }, connect() {} }; },
    createBuffer() { return { getChannelData() { return new Float32Array(35); } }; },
    createBufferSource() { return { connect() {}, start() {} }; },
    createBiquadFilter() { return { frequency: {}, connect() {} }; }
  };
  class AudioContext { constructor() { created++; Object.assign(this, audio); } }
  const controller = window.GameAudio.create(() => muted, { AudioContext, Math });
  controller.bind(doc);
  controller.sfx(440);
  assert.equal(created, 0);
  muted = false;
  controller.sfx(440);
  assert.equal(created, 1);
  assert.equal(tones, 1);
  assert.equal(listeners.length, 1);
  assert.equal(listeners[0].type, "pointerdown");
  listeners[0].fn({ target: { closest(selector) { clicks++; return selector.includes("button") ? { disabled: false } : null; } } });
  assert.equal(clicks, 1);
});


test("GameNpcRoster tạo đủ 50 NPC, cấu hình mô phỏng và tiểu sử ổn định", () => {
  const R = window.GameNpcRoster.create((a,b,c) => (a * 17 + b * 13 + c) % 97, () => 0.5);
  assert.equal(R.B.length, 50);
  assert.equal(R.BH.length, 50);
  assert.equal(R.B[0].n, "Miêu Miên Tử");
  assert.equal(R.B[49].n, "Cố Thái Hư");
  assert.ok(R.B.every(x => x.g === "nam" || x.g === "nu"));
  assert.ok(R.BH.every(x => Number.isFinite(x.h) && Number.isFinite(x.lam)));
  assert.equal(typeof R.bio(0), "string");
  assert.match(R.bio(0), /Miêu Miên Tử|đệ tử ngoại môn/);
  assert.equal(R.isTK(0), false);
  assert.equal(R.CDN.length, 9);
  assert.equal(R.STG.length, 9);
  assert.equal(R.NVC_TITLES.length, 9);
});


test("GameLegacyMissions khởi tạo tiến trình xuyên kiếp và mở khóa thành tựu đúng điều kiện", () => {
  const S = { tutDone: true, rb: 1 };
  const saved = [];
  const notices = [];
  const timers = [];
  const M = window.GameLegacyMissions.create({
    S,
    save: () => saved.push(true),
    say: value => notices.push(value),
    now: () => 123456,
    setTimeoutFn: (fn, delay) => timers.push({ fn, delay }),
    formatDate: value => "DATE-" + value
  });
  assert.equal(M.definitions.length, 8);
  assert.equal(M.lifeTrack().q, 0);
  const newly = M.check();
  assert.deepEqual(JSON.parse(JSON.stringify(newly)), ["Sơ Nhập Đạo Đồ"]);
  assert.equal(S.legacy.L1, 123456);
  assert.equal(saved.length, 1);
  assert.equal(timers[0].delay, 250);
  timers[0].fn();
  assert.match(notices[0], /Sơ Nhập Đạo Đồ/);
  assert.deepEqual(JSON.parse(JSON.stringify(M.check())), []);
  assert.equal(saved.length, 1);
  S.life.q = 100;
  S.life.top10 = 1;
  S.life.exOk = 5;
  S.life.sectN = 3;
  S.life.excel = 1;
  S.life.anXa = 1;
  S.rb = 2;
  const unlocked = M.check();
  assert.equal(unlocked.length, 7);
  assert.equal(Object.keys(S.legacy).length, 8);
  assert.match(M.render(), /Sứ mệnh xuyên kiếp/);
  assert.match(M.render(), /DATE-123456/);
});


test("GameCultivationDisplayData giữ nguyên bảng màu cảnh giới và câu dẫn", () => {
  const D = window.GameCultivationDisplayData;
  assert.equal(D.realmColors.length, 9);
  assert.equal(D.realmColors[0], "#7fb8a4");
  assert.equal(D.quotes.length, 20);
  assert.match(D.quotes[0], /Phương Nguyên/);
  assert.match(D.quotes[19], /biến tấu Cầu Ma/);
});

test("GameFortuneData cung cấp đủ dữ liệu cơ duyên theo giờ", () => {
  const D = window.GameFortuneData;
  assert.equal(D.epoch, Date.parse("2026-01-01T00:00:00Z"));
  assert.equal(D.events.length, 6);
  assert.equal(D.effects.length, 6);
  assert.equal(D.events[0][0], "Thiên Cơ Hiện Thế");
  assert.equal(D.effects[5], "cơ hội nhận linh thú");
});


test("GameItemData.catalog tạo catalog vật phẩm đầy đủ, độc lập và có mô tả giá trị", () => {
  const items = window.GameItemData.catalog();
  assert.equal(items.length, 21);
  assert.equal(items[0].id, "ca");
  assert.equal(items[0].tot, 200);
  assert.match(items[0].d, /2 nhiệm vụ/);
  assert.equal(items[19].id, "cl");
  assert.equal(items[20].id, "the");
  assert.equal(items[20].q, undefined);
  assert.equal(items[20].d, "Tự dùng khi lỡ 1 ngày, giữ nguyên chuỗi ngày học");
  items[0].q[0] = 999;
  assert.equal(window.GameItemData.catalog()[0].q[0], 2);
  assert.deepEqual(JSON.parse(JSON.stringify(window.GameItemData.describe({ id: "x", c: 100, q: [2, 60, "q"] }))), {
    tot: 120,
    d: "Dùng: 2 nhiệm vụ nhanh kế tiếp, mỗi nhiệm vụ +60 linh lực cố định (tổng +120, hoàn lại đủ giá cộng tác dụng riêng)"
  });
});


test("GameSectSystem đóng gói tông môn, điều kiện bái sư và buff theo state", () => {
  const state = { sect: 0, master: 0, streak: { n: 3 }, tm: false };
  let realm = 1, life = { q: 8, it: 3, ni: 5 }, exams = [];
  const M = window.GameSectSystem.create({ state, realmIndex: () => realm, lifeStats: () => life, examResults: () => exams });
  assert.equal(M.sects.length, 6);
  assert.equal(M.masters.length, 6);
  assert.equal(M.sects[0].n, "Thiên Kiếm Tông");
  assert.equal(M.masters[0].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { fl: 8 });
  state.master = null;
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), {});
  state.master = 1; state.sect = 1;
  assert.equal(M.masters[1].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { itemBonus: 10 });
  state.sect = 2; state.master = 2; life.q = 15;
  assert.equal(M.masters[2].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { mult: 1.05 });
  state.sect = 3; state.master = 3; state.streak.n = 7;
  assert.equal(M.masters[3].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { dc: 15 });
  state.sect = 4; state.master = 4;
  assert.equal(M.masters[4].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { fn: 12 });
  state.sect = 5; state.master = 5; exams = [{ rows: [{ u: true, g: "Khá" }] }];
  assert.equal(M.masters[5].ok(), true);
  assert.deepEqual(JSON.parse(JSON.stringify(M.masterBuff())), { ft: 8 });
  exams = [];
  assert.equal(M.masters[5].ok(), false);
});


test("GameState tạo state mặc định, migration dữ liệu cũ và lưu đúng key", () => {
  const calls=[];
  const old={quests:[{id:"q1"}],points:12,perHour:90,lb:{bal:[1]},fb:{n:2,v:5},menh:null,ui:null};
  const storage={load:(key,defaults)=>{calls.push(["load",key,defaults]);return old;},save:(key,state)=>calls.push(["save",key,state])};
  const ui=[];
  const prior=window.GameUI;
  window.GameUI={apply:state=>ui.push(state)};
  const M=window.GameState.create({storage});
  assert.equal(M.key,"quest-study-v1");
  assert.equal(M.state,old);
  assert.equal(M.state.perHour,200);
  assert.equal(M.state.ph200,1);
  assert.equal(M.state.menh,100);
  assert.equal(M.state.tdPenalty,false);
  assert.equal(M.state.failStreak,0);
  assert.equal(M.state.tdStacks,0);
  assert.deepEqual(JSON.parse(JSON.stringify(M.state.dailyBought)),{});
  assert.equal(M.state._balCleared,1);
  assert.equal(M.state.bal,0);
  assert.deepEqual(JSON.parse(JSON.stringify(M.state.lb.bal)),Array(50).fill(0));
  assert.deepEqual(JSON.parse(JSON.stringify(M.state.fx)),[{n:2,v:5,t:""}]);
  assert.equal(M.state.fb,undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(ui)),[JSON.parse(JSON.stringify(old))]);
  M.save();
  assert.equal(calls[1][0],"save");
  assert.equal(calls[1][1],"quest-study-v1");
  assert.equal(calls[1][2],old);
  window.GameUI=prior;
});


test("GameQuestTemplates chứa dữ liệu nhiệm vụ, kế hoạch và prompt AI tách khỏi game.js", () => {
  const D = window.GameQuestTemplates;
  assert.ok(D);
  assert.deepEqual(Object.keys(D), ["PN", "PLAN", "AI_PROMPT", "CHAIN_PROMPT", "SCHED_PROMPT", "PRESET_MIX", "DEF_Q", "DEF_C", "DEF_S"]);
  assert.deepEqual(Object.keys(D.PN), ["en", "code", "nckh"]);
  assert.equal(D.PLAN.en.length, 15);
  assert.equal(D.PLAN.code.length, 15);
  assert.equal(D.PLAN.nckh.length, 15);
  assert.match(D.AI_PROMPT, /Bạn là gia sư lập kế hoạch học/);
  assert.match(D.CHAIN_PROMPT, /TÊN CHUỖI/);
  assert.match(D.SCHED_PROMPT, /HH:MM-HH:MM/);
  assert.match(D.PRESET_MIX, /VSTEP Listening/);
  assert.match(D.DEF_Q, /Khởi động/);
  assert.match(D.DEF_C, /Ôn thi một chương/);
  assert.match(D.DEF_S, /07:40-07:55/);
});
