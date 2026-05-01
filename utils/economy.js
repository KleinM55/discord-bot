const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

/* ---------------- LOAD ---------------- */
function load() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    save(data);
  }

  return data[id];
}

/* ---------------- ADD BALANCE ---------------- */
function addBalance(id, amount) {
  const data = load();

  if (!data[id]) {
    data[id] = { balance: 0, total: 0 };
  }

  data[id].balance += amount;
  data[id].total += amount;

  save(data);
}

/* ---------------- REMOVE BALANCE ---------------- */
function removeBalance(id, amount) {
  const data = load();

  if (!data[id]) return;

  data[id].balance -= amount;

  if (data[id].balance < 0) {
    data[id].balance = 0;
  }

  save(data);
}

/* ---------------- WEEKLY COLLECT (+250) ---------------- */
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

/* ---------------- EXPORTS ---------------- */
module.exports = {
  getUser,
  addBalance,
  removeBalance,
  collectWeekly,
  getLeaderboard
};
