const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

function load() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getUser(id) {
  const data = load();

  if (!data[id]) {
    data[id] = {
      balance: 0,
      farm: 0,
      total: 0
    };
    save(data);
  }

  return data[id];
}

function addFarm(id, amount) {
  const data = load();
  if (!data[id]) data[id] = { balance: 0, farm: 0, total: 0 };

  data[id].farm += amount;
  data[id].total += amount;

  save(data);
}

function collectFarm(id) {
  const data = load();
  if (!data[id]) return 0;

  const amount = data[id].farm;

  data[id].balance += amount;
  data[id].farm = 0;

  save(data);

  return amount;
}

function addBalance(id, amount) {
  const data = load();
  if (!data[id]) data[id] = { balance: 0, farm: 0, total: 0 };

  data[id].balance += amount;
  data[id].total += amount;

  save(data);
}

function removeBalance(id, amount) {
  const data = load();
  if (!data[id]) return;

  data[id].balance -= amount;
  if (data[id].balance < 0) data[id].balance = 0;

  save(data);
}

function getLeaderboard() {
  const data = load();

  return Object.entries(data)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
}

module.exports = {
  getUser,
  addFarm,
  collectFarm,
  addBalance,
  removeBalance,
  getLeaderboard
};
