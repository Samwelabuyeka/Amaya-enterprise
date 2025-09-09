import React, { useState } from 'react';
import { auth } from '../lib/firebase';

export default function MayaFloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/maya-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, userId: auth.currentUser ? auth.currentUser.uid : null }) });
      const j = await res.json();
      setMessages((m) => [...m, { role: 'maya', text: j.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'maya', text: 'Error contacting Maya.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg cursor-pointer" onClick={() => setOpen(!open)}>
        Maya
      </div>
      {open && (
        <div className="mt-3 w-80 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg shadow-xl p-3">
          <div className="h-48 overflow-y-auto mb-2">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === 'maya' ? 'text-indigo-700' : 'text-right'}`}>
                <div className="inline-block px-3 py-2 rounded bg-zinc-100 dark:bg-zinc-800">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 rounded border" placeholder="Ask Maya..." />
            <button onClick={send} className="bg-indigo-600 text-white px-3 py-1 rounded" disabled={loading}>{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
