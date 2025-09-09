import React from "react";
import Navbar from "../../components/Navbar";

const Logs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">System & Maya Logs</h1>
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Maya Assistant Logs</h2>
          <div className="text-zinc-400">AI assistant logs and analytics coming soon.</div>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">System Logs</h2>
          <div className="text-zinc-400">System logs and activity coming soon.</div>
        </div>
      </main>
    </div>
  );
};

export default Logs;
