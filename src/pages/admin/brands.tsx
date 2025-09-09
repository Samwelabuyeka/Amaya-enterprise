import React from "react";
import Navbar from "../../components/Navbar";

const ManageBrands = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Manage Brands</h1>
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
          <form className="space-y-4">
            <input className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" placeholder="Brand Name" />
            <input className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" placeholder="Logo URL" />
            <textarea className="w-full p-2 rounded bg-zinc-800 border border-zinc-700" placeholder="Description" />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold">Add Brand</button>
          </form>
        </div>
        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Existing Brands</h2>
          <div className="text-zinc-400">Brand list and management coming soon.</div>
        </div>
      </main>
    </div>
  );
};

export default ManageBrands;
