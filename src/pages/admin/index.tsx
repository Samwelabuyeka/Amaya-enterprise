import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import MayaAssistant from "../../maya/MayaAssistant";
import AdminAnalytics from "../../components/AdminAnalytics";
import NotificationToaster from "../../components/NotificationToaster";
import AdminDashboardFeatures from "../../components/AdminDashboardFeatures";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import MayaFloatingChat from "../../components/MayaFloatingChat";
import MayaAgentControl from '../../components/MayaAgentControl';
import { useCallback } from 'react';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">Loading...</div>;
  }
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">Access denied. Admins only.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative">
      <NotificationToaster />
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-extrabold mb-8">Admin Dashboard</h1>
        <AdminAnalytics />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Maya Logs</h2>
            <div className="h-32 overflow-y-auto text-sm text-zinc-400">AI assistant logs and analytics coming soon.</div>
          </div>
          <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
            <ul className="space-y-2">
              <li><a href="/admin/brands" className="text-indigo-400 hover:underline">Manage Brands</a></li>
              <li><a href="/admin/users" className="text-indigo-400 hover:underline">Manage Users</a></li>
              <li><a href="/admin/logs" className="text-indigo-400 hover:underline">View Logs</a></li>
            </ul>
          </div>
        </div>
  <AdminDashboardFeatures />
  <MayaAssistant />
        <div className="mt-8 bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Neuron Manager (Dev)</h2>
          <NeuronManagerPanel />
        </div>
        <div className="mt-6 bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">MPC / Shard Manager</h2>
          <MPCPanel />
        </div>
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    <MayaAgentControl userId={user?.uid} />
    <MayaFloatingChat />
  </div>
      </main>
    </div>
  );
};

  function NeuronManagerPanel() {
    const [status, setStatus] = React.useState<string>('idle');
    const [modules, setModules] = React.useState<any[]>([]);

    const loadModel = useCallback(async () => {
      setStatus('loading model...');
      const model = prompt('Model name (e.g. gpt2)') || 'gpt2';
      const res = await fetch('/api/agent/route-to-neurons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input_text: 'ping', modules: [] }) });
      const j = await res.json();
      setStatus('model pinged');
      return j;
    }, []);

    const createModule = useCallback(async () => {
      const name = prompt('module name') || 'mod';
      const res = await fetch('/api/agent/route-to-neurons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input_text: `create module ${name}`, modules: [] }) });
      const j = await res.json();
      setStatus(JSON.stringify(j));
    }, []);

    const listModules = useCallback(async () => {
      const res = await fetch('/api/agent/route-to-neurons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input_text: 'list_modules', modules: [] }) });
      const j = await res.json();
      setModules(j.modules || []);
      setStatus('fetched modules');
    }, []);

    return (
      <div>
        <div className="flex gap-2">
          <button onClick={loadModel} className="px-3 py-1 bg-indigo-600 rounded">Load Model</button>
          <button onClick={createModule} className="px-3 py-1 bg-green-600 rounded">Create Module</button>
          <button onClick={listModules} className="px-3 py-1 bg-gray-600 rounded">List Modules</button>
        </div>
        <div className="mt-3 text-sm text-zinc-400">Status: {status}</div>
        <div className="mt-3">
          {modules.map((m) => (
            <div key={m.id} className="p-2 border-b">{m.name} — {m.id}</div>
          ))}
        </div>
      </div>
    );
  }

  function MPCPanel() {
    const [res, setRes] = React.useState<string>('');
    const split = async () => {
      const secret = prompt('secret to split');
      if (!secret) return;
      const shares = parseInt(prompt('shares (default 5)') || '5', 10);
      const threshold = parseInt(prompt('threshold (default 3)') || '3', 10);
      const apiKey = prompt('admin key');
      const r = await fetch('/api/agent/mpc/split', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-api-key': apiKey || '' }, body: JSON.stringify({ secret, shares, threshold }) });
      const j = await r.json();
      setRes(JSON.stringify(j));
    };
    const combine = async () => {
      const ids = prompt('shardIds comma separated');
      if (!ids) return;
      const apiKey = prompt('admin key');
      const r = await fetch('/api/agent/mpc/combine', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-api-key': apiKey || '' }, body: JSON.stringify({ shardIds: ids.split(',').map(s=>s.trim()) }) });
      const j = await r.json();
      setRes(JSON.stringify(j));
    };
    return (
      <div>
        <div className="flex gap-2">
          <button onClick={split} className="px-3 py-1 bg-red-600 rounded">Split Secret</button>
          <button onClick={combine} className="px-3 py-1 bg-blue-600 rounded">Combine Shards</button>
        </div>
        <div className="mt-3 text-sm text-zinc-400">Result: {res}</div>
      </div>
    );
  }

export default AdminPanel;
