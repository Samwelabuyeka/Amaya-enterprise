import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Amaya Marketplace</h2>
        <p className="text-gray-600">Explore and connect with global brands.</p>
      </main>
    </div>
  );
};

export default Home;
