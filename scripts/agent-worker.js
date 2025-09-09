const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const AGENT_ADMIN_KEY = process.env.AGENT_ADMIN_KEY || '';
const RUN_INTERVAL = parseInt(process.env.AGENT_RUN_INTERVAL || '5000', 10);
if (!AGENT_ADMIN_KEY) {
  console.error('Set AGENT_ADMIN_KEY env var to authorize worker.');
  process.exit(1);
}

async function runOnce() {
  try {
    const res = await fetch('http://localhost:3000/api/agent/run-worker', {
      method: 'POST',
      headers: { 'x-admin-api-key': AGENT_ADMIN_KEY },
    });
    const j = await res.json();
    console.log('run-worker:', j);
  } catch (err) {
    console.error('worker error', err);
  }
}

async function loop() {
  while (true) {
    await runOnce();
    await new Promise((r) => setTimeout(r, RUN_INTERVAL));
  }
}

loop();
