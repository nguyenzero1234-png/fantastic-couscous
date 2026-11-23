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

  root.GameSectWar = Object.freeze({ pairs, flavor, stats });
})(typeof window !== "undefined" ? window : globalThis);
