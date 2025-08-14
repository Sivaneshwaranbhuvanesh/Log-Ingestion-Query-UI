const fetch = require('node-fetch');
const API = process.env.API || 'http://localhost:4000';
const levels = ['error','warn','info','debug'];
const resources = ['server-web','worker-1','db-main','proxy-edge'];
const commits = ['a1b2c3d','e4f5g6h','1a2b3c4','deadbeef','c0ffee'];
const messages = [
  'Service started OK',
  'User auth failed',
  'Connection timeout to DB',
  'Cache miss',
  'High memory usage',
  'Background job finished',
  'Upstream 502',
  'Retry in 5s',
  'Feature flag toggled',
  'Deployment done'
];
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
async function run() {
  const now = Date.now();
  for (let i=0;i<15;i++) {
    const ts = new Date(now - i*30*60*1000).toISOString();
    const log = {
      level: pick(levels),
      message: pick(messages),
      resourceId: pick(resources),
      timestamp: ts,
      traceId: 'trace-' + (100+i),
      spanId: 'span-' + (200+i),
      commit: pick(commits),
      metadata: { host: '10.0.0.' + (20+i), attempt: i % 3 }
    };
    const r = await fetch(API + '/logs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(log) });
    if (!r.ok) console.error('Failed:', await r.text());
  }
  console.log('Seed complete');
}
run().catch(console.error);
