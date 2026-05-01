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
      farm: 0,
      total: 0
    };
    save(data);
  }

  return data[id];
}

function addFarm(id, amount) {
  const data = load();

  if (!data[id]) data[id] = { farm: 0, total: 0 };

  data[id].farm += amount;
  data[id].total += amount;

  save(data);
}

function removeFarm(id, amount) {
  const data = load();

  if (!data[id]) return;

  data[id].farm -= amount;
  if (data[id].farm < 0) data[id].farm = 0;

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
  removeFarm,
  getLeaderboard
};
