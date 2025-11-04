const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'monitor');
const DATA_FILE = path.join(DATA_DIR, 'usage.json');

let usage = { graphql: {} };
let dirty = false;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(usage, null, 2));
}

function load() {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    usage = JSON.parse(raw);
  } catch (e) {
    usage = { rest: {}, graphql: {} };
  }
}

function save() {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(usage, null, 2));
    dirty = false;
  } catch (e) {
    console.error('Error saving usage file:', e);
  }
}

function incrementGraphql(opName) {
  const key = opName || 'anonymous';
  usage.graphql[key] = (usage.graphql[key] || 0) + 1;
  dirty = true;
}

function getStats() {
  return usage;
}

setInterval(() => {
  if (dirty) save();
}, 5000);

process.on('exit', () => { if (dirty) save(); });
process.on('SIGINT', () => { if (dirty) save(); process.exit(); });

load();

module.exports = { incrementGraphql, getStats, save };
