import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-purple-700">Amaya</h1>
      <div className="space-x-4">
        <button className="text-purple-700 font-medium">Home</button>
        <button className="text-purple-700 font-medium">Brands</button>
        <button className="text-purple-700 font-medium">Admin</button>
      </div>
    </nav>
  );
};

export default Navbar;
