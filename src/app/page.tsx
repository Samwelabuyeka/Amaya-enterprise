import Link from "next/link";
import { Star, ShoppingBag, Globe, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome to Amaya
          </h1>
          <p className="text-xl md:text-2xl">
            Discover and connect with the most trusted brands across Africa and beyond.
          </p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link
              href="/register"
              className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
            >
              Join as a Brand
            </Link>
            <Link
              href="/products"
              className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-purple-700 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto mt-20 px-6 md:px-12">
        <h2 className="text-3xl font-semibold mb-6 text-center">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Fashion", icon: ShoppingBag },
            { name: "Beauty & Cosmetics", icon: Sparkles },
            { name: "Technology", icon: Globe },
            { name: "Home & Living", icon: Star },
          ].map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="bg-gray-100 p-6 rounded-xl flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <Icon className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-medium">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="bg-gray-50 py-20 mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">Trusted by Top Brands</h2>
          <p className="text-gray-600 mb-10">
            Amaya connects hundreds of global and local brands with buyers, retailers, and resellers.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <img src="/logos/brand1.png" alt="Brand 1" className="h-10" />
            <img src="/logos/brand2.png" alt="Brand 2" className="h-10" />
            <img src="/logos/brand3.png" alt="Brand 3" className="h-10" />
            <img src="/logos/brand4.png" alt="Brand 4" className="h-10" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white py-16 text-center mt-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to grow with Amaya?</h2>
        <p className="mb-6 text-lg">
          Whether you're a brand, retailer, or buyer — Amaya gives you the tools to thrive.
        </p>
        <Link
          href="/register"
          className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
