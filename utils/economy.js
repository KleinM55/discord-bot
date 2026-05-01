const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

/* ---------------- LOAD ---------------- */
function load() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}');
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

/* ---------------- SAVE ---------------- */
function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* ---------------- GET USER ---------------- */
function getUser(id) {
  const data = load();

  if (!data[id]) {
    data[id] = {
      balance: 0,
      total: 0
    };
  }

  if (typeof data[id].balance !== 'number') data[id].balance = 0;
  if (typeof data[id].total !== 'number') data[id].total = 0;

  return data[id];
}

/* ---------------- ADD ---------------- */
function addBalance(id, amount) {
  const data = load();

  if (!data[id]) {
    data[id] = { balance: 0, total: 0 };
  }

  data[id].balance += amount;
  data[id].total += amount;

  save(data);
}

/* ---------------- REMOVE ---------------- */
function removeBalance(id, amount) {
  const data = load();

  if (!data[id]) return;

  data[id].balance -= amount;
  if (data[id].balance < 0) data[id].balance = 0;

  save(data);
}

/* ---------------- WEEKLY COLLECT ---------------- */
function collectWeekly(id) {
  const data = load();

  if (!data[id]) {
    data[id] = { balance: 0, total: 0 };
  }

  const amount = 250;

  data[id].balance += amount;
  data[id].total += amount;

  save(data);

  return amount;
}

/* ---------------- LEADERBOARD ---------------- */
function getLeaderboard() {
  const data = load();

  return Object.entries(data)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
}

module.exports = {
  getUser,
  addBalance,
  removeBalance,
  collectWeekly,
  getLeaderboard
};
