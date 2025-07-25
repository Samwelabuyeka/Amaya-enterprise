import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-6 text-center rounded-3xl shadow-lg mt-10">
      <h1 className="text-5xl font-extrabold mb-6">Welcome to Amaya</h1>
      <p className="text-xl max-w-2xl mx-auto">
        Discover, connect, and grow with premium brands across Africa and beyond.
      </p>
      <div className="mt-8">
        <a href="/brands" className="bg-white text-purple-700 font-bold py-3 px-6 rounded-full shadow hover:scale-105 transition">
          Explore Brands
        </a>
      </div>
    </section>
  );
};

export default Hero;
