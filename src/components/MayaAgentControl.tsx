import React, { useState } from 'react';

export default function MayaAgentControl({ userId }: { userId: string }) {
  const [task, setTask] = useState('');
  const [log, setLog] = useState<string[]>([]);

  async function startTask() {
    const res = await fetch('/api/agent/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
      body: JSON.stringify({ task }),
    });
    const j = await res.json();
    setLog((s) => [...s, `Started: ${JSON.stringify(j)}`]);
  }

  async function runStep() {
    const step = prompt('Enter step text');
    if (!step) return;
    const res = await fetch('/api/agent/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
      body: JSON.stringify({ step }),
    });
    const j = await res.json();
    setLog((s) => [...s, `Step result: ${JSON.stringify(j)}`]);
  }

  async function reflect() {
    const res = await fetch('/api/agent/reflect', { headers: { 'X-User-Id': userId } });
    const j = await res.json();
    setLog((s) => [...s, `Reflection: ${JSON.stringify(j)}`]);
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-medium">Maya Agent Control</h3>
      <div className="mt-2">
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Describe a task" className="border p-2 w-full" />
        <div className="mt-2 flex gap-2">
          <button onClick={startTask} className="px-3 py-1 bg-indigo-600 text-white rounded">Start</button>
          <button onClick={runStep} className="px-3 py-1 bg-green-600 text-white rounded">Run Step</button>
          <button onClick={reflect} className="px-3 py-1 bg-yellow-500 text-white rounded">Reflect</button>
        </div>
      </div>
      <div className="mt-3 max-h-40 overflow-auto text-xs">
        {log.map((l, i) => (
          <div key={i} className="border-b py-1">{l}</div>
        ))}
      </div>
    </div>
  );
}
