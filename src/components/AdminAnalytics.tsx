import React from "react";

const AdminAnalytics = () => {
  // Placeholder for real-time analytics (replace with live data later)
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
        <span className="text-3xl font-bold">1,245</span>
        <span className="mt-2 text-lg">Brands</span>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
        <span className="text-3xl font-bold">8,900</span>
        <span className="mt-2 text-lg">Active Users</span>
      </div>
      <div className="bg-gradient-to-br from-yellow-400 to-orange-600 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
        <span className="text-3xl font-bold">$1.2M</span>
        <span className="mt-2 text-lg">Revenue</span>
      </div>
      <div className="bg-gradient-to-br from-pink-500 to-fuchsia-700 text-white rounded-xl p-6 shadow-lg flex flex-col items-center">
        <span className="text-3xl font-bold">2,340</span>
        <span className="mt-2 text-lg">Transactions</span>
      </div>
    </div>
  );
};

export default AdminAnalytics;
