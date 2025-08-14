const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { parseISO, isValid } = require('date-fns');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(morgan('dev'));

function ensureDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
      console.log('Initialized db.json');
    }
  } catch (e) {
    console.error('Failed to init DB file:', e);
  }
}
ensureDB();

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}
function writeDB(arr) {
  fs.writeFileSync(DB_FILE + '.tmp', JSON.stringify(arr, null, 2));
  fs.renameSync(DB_FILE + '.tmp', DB_FILE);
}

function validateLog(log) {
  const must = ['level','message','resourceId','timestamp','traceId','spanId','commit','metadata'];
  for (const k of must) if (!(k in log)) return `Missing field: ${k}`;
  const okLevels = ['error','warn','info','debug'];
  if (!okLevels.includes(log.level)) return 'level must be one of error|warn|info|debug';
  if (!isValid(parseISO(log.timestamp))) return 'timestamp must be ISO-8601';
  if (typeof log.message !== 'string') return 'message must be string';
  if (typeof log.resourceId !== 'string') return 'resourceId must be string';
  if (typeof log.traceId !== 'string') return 'traceId must be string';
  if (typeof log.spanId !== 'string') return 'spanId must be string';
  if (typeof log.commit !== 'string') return 'commit must be string';
  if (typeof log.metadata !== 'object' || Array.isArray(log.metadata)) return 'metadata must be object';
  return null;
}

app.post('/logs', (req, res) => {
  const err = validateLog(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const db = readDB();
  db.push(req.body);
  writeDB(db);
  res.status(201).json({ ok: true });
});

app.get('/logs', (req, res) => {
  let db = readDB();
  const q = req.query;
  const parseMaybe = (s) => { try { const d = parseISO(s); return isValid(d) ? d : null; } catch { return null; } };

  if (q.level) {
    const set = q.level.split(',').map(s => s.trim());
    db = db.filter(r => set.includes(r.level));
  }
  if (q.message) db = db.filter(r => (r.message || '').toLowerCase().includes(String(q.message).toLowerCase()));
  if (q.resourceId) db = db.filter(r => (r.resourceId || '').toLowerCase().includes(String(q.resourceId).toLowerCase()));
  if (q.traceId) db = db.filter(r => r.traceId === q.traceId);
  if (q.spanId) db = db.filter(r => r.spanId === q.spanId);
  if (q.commit) db = db.filter(r => r.commit === q.commit);
  if (q.timestamp_start) {
    const s = parseMaybe(q.timestamp_start);
    if (s) db = db.filter(r => { const t = parseMaybe(r.timestamp); return t && t >= s; });
  }
  if (q.timestamp_end) {
    const e = parseMaybe(q.timestamp_end);
    if (e) db = db.filter(r => { const t = parseMaybe(r.timestamp); return t && t <= e; });
  }
  db.sort((a,b) => {
    const ta = parseMaybe(a.timestamp), tb = parseMaybe(b.timestamp);
    if (!ta || !tb) return 0;
    return tb - ta;
  });
  res.json(db);
});

app.get('/stats', (_req, res) => {
  const db = readDB();
  const byLevel = { error:0, warn:0, info:0, debug:0 };
  for (const r of db) if (byLevel[r.level] !== undefined) byLevel[r.level]++;
  res.json({ totalLogs: db.length, byLevel });
});

app.get('/', (_req, res) => res.json({ ok: true, message: 'Log API up' }));
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
