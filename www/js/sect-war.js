(function(root) {
  "use strict";

  const FLAVORS = [
    ["Kiếm khí xung thiên", "Hai tông đọ kiếm đạo, tốc chiến quyết thắng thua."],
    ["Đan lửa đối đầu", "Lò đan đỏ rực, bên nào bền bỉ hơn sẽ thắng."],
    ["Vạn pháp hỗn chiến", "Pháp thuật đầy trời, biến hóa vô cùng."],
    ["Thái Hư ẩn thế", "Cổ tông xuất thế, nền tảng quyết định tất cả."],
    ["Cửu U quỷ ảnh", "Bóng tối len lỏi, bất ngờ quyết định cục diện."],
    ["Bách Thảo đồng tâm", "Y đạo hợp lực, lấy nhu thắng cương."]
  ];

  const pairs = week => {
    const rotation = ((week % 5) + 5) % 5;
    const order = [0, 1, 2, 3, 4].map(k => 1 + (k + rotation) % 5);
    return [[0, order[0]], [order[1], order[4]], [order[2], order[3]]];
  };

  const flavor = (a, b) => FLAVORS[(a * 7 + b * 13) % FLAVORS.length];

  const score = (sectCount, npcRows, userSect, userGain, npcCounts) => {
    const totals = Array.from({ length: sectCount }, () => 0);
    (npcRows || []).forEach(row => {
      if (row && Number.isInteger(row.sect) && totals[row.sect] != null)
        totals[row.sect] += Math.max(0, Number(row.gain) || 0);
    });
    if (userSect != null && totals[userSect] != null)
      totals[userSect] += Math.max(0, Number(userGain) || 0);
    return totals.map((value, sect) => {
      const count = Math.max(0, Number((npcCounts || [])[sect]) || 0) + (userSect === sect ? 1 : 0);
      return count > 0 ? value / count : 0;
    });
  };

  const reward = deps => {
    const S = deps.state;
    if (S.sect == null) return "";
    const start = new Date(S.lb.week + "T00:00:00").getTime();
    const end = start + 7 * 864e5;
    const week = Math.round((start - deps.weekEnd) / 6048e5);
    const scores = deps.scoreWeek(start, end, S.lb.week, new Date(end).toLocaleDateString("sv"));
    const pair = pairs(week).find(item => item.includes(S.sect));
    if (!pair) return "";
    const opponent = pair[0] === S.sect ? pair[1] : pair[0];
    const own = scores[S.sect], other = scores[opponent], diff = own - other;
    const flavorText = flavor(S.sect, opponent);
    if (diff > 0) {
      const base = deps.modGain(150 + Math.min(150, Math.round(diff * 0.35)) + (deps.hasTitle() ? 100 : 0));
      const bonus = diff > 80 && deps.random() < 0.35;
      S.points += base;
      deps.addHistory(deps.today(), base, 0);
      S.lb.sw = (S.lb.sw || 0) + 1;
      let message = " Tông môn chiến: " + deps.sects[S.sect].n + " đại thắng " + deps.sects[opponent].n + " (+" + base + " linh lực)";
      if (bonus) {
        S.inv.ca = (S.inv.ca || 0) + 1;
        message += " · nhận thêm 1 Tỉnh Thần Linh Trà nhờ công trạng lớn.";
      }
      deps.log("Tông môn chiến: " + deps.sects[S.sect].n + " thắng " + deps.sects[opponent].n + " (" + flavorText[0] + "), +" + base + " linh lực" + (bonus ? " +Tỉnh Thần Linh Trà" : ""));
      return message + ".";
    }
    const consolation = deps.modGain(Math.min(40, Math.round(Math.abs(diff) * 0.08) + 15));
    S.points += consolation;
    deps.addHistory(deps.today(), consolation, 0);
    deps.log("Tông môn chiến: " + deps.sects[S.sect].n + " thua " + deps.sects[opponent].n + " (" + flavorText[0] + "), nhận " + consolation + " linh lực an ủi");
    return " Tông môn chiến: " + deps.sects[S.sect].n + " thua " + deps.sects[opponent].n + ". Thiên Đạo ban " + consolation + " linh lực an ủi — thất bại cũng là tu luyện.";
  };

  const stats = (sectCount, npcRows, userSect, userXp) => {
    const result = Array.from({ length: sectCount }, () => ({ xp: 0, n: 0 }));
    (npcRows || []).forEach(row => {
      if (!row || !Number.isInteger(row.sect) || !result[row.sect]) return;
      result[row.sect].xp += row.xp;
      result[row.sect].n++;
    });
    if (userSect != null && result[userSect]) {
      result[userSect].xp += userXp;
      result[userSect].n++;
    }
    return result;
  };

  root.GameSectWar = Object.freeze({ pairs, flavor, stats, score, reward });
})(typeof window !== "undefined" ? window : globalThis);
