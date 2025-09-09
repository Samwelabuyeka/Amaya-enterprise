"use client";

import Image from "next/image"; import Link from "next/link"; import { useEffect, useState } from "react"; import { supabase } from "../../lib/supabase";
import SearchBar from "../components/SearchBar";
import MayaFloatingChat from "../components/MayaFloatingChat";

export default function Home() { const [brands, setBrands] = useState<any[]>([]);

useEffect(() => { const fetchBrands = async () => { const { data, error } = await supabase.from("brands").select("*").limit(12); if (!error) setBrands(data || []); }; fetchBrands(); }, []);

return ( <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white"> {/* Hero Section */} <section className="px-6 py-20 text-center bg-gradient-to-br from-black to-gray-900 text-white"> <h1 className="text-5xl font-bold mb-4">Welcome to Amaya Marketplace</h1> <p className="text-xl max-w-2xl mx-auto">Explore, discover, and connect with the world's most authentic and inspiring brands.</p> <Link href="/brands" className="mt-6 inline-block px-6 py-3 bg-white text-black font-medium rounded-xl shadow-lg">Browse Brands</Link> </section>

{/* Search */}
  <section className="py-8 px-4 bg-white dark:bg-black">
    <SearchBar />
  </section>
  <MayaFloatingChat />

{/* Categories */}
  <section className="py-16 px-6 bg-gray-100 dark:bg-zinc-900">
    <h2 className="text-3xl font-semibold mb-8 text-center">Browse by Category</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
      {["Fashion", "Cosmetics", "Agriculture", "Jewelry", "Tech", "Home", "Art", "Other"].map((cat) => (
        <div key={cat} className="bg-white dark:bg-zinc-800 p-4 rounded-lg text-center shadow">
          <p className="font-medium text-lg">{cat}</p>
        </div>
      ))}
    </div>
  </section>

  {/* Featured Brands */}
  <section className="py-16 px-6">
    <h2 className="text-3xl font-semibold text-center mb-10">Featured Brands</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {brands.length > 0 ? (
        brands.map((brand) => (
          <div key={brand.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
            <Image src={brand.logo || "/placeholder.png"} alt={brand.name} width={400} height={240} className="w-full h-40 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{brand.description}</p>
            <Link href={`/brands/${brand.id}`} className="text-indigo-600 mt-3 inline-block">View Brand</Link>
          </div>
        ))
      ) : (
        <p className="text-center col-span-full">No brands available.</p>
      )}
    </div>
  </section>

  {/* Dropshipping Highlight */}
  <section className="py-20 px-6 bg-black text-white text-center">
    <h2 className="text-4xl font-semibold mb-4">Start Dropshipping with Amaya</h2>
    <p className="max-w-xl mx-auto mb-6">Source directly from trusted brands, skip inventory, and scale your e-commerce store faster.</p>
    <Link href="/dropshipping" className="inline-block px-6 py-3 bg-white text-black font-medium rounded-xl">Learn More</Link>
  </section>

  {/* Testimonials */}
  <section className="py-16 px-6 bg-gray-100 dark:bg-zinc-800">
    <h2 className="text-3xl font-semibold text-center mb-8">What Our Users Say</h2>
    <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
          <p className="italic">“Amaya helped us connect to buyers across Africa and Europe. Amazing experience.”</p>
          <p className="mt-4 font-semibold">– Happy Brand Partner</p>
        </div>
      ))}
    </div>
  </section>

  {/* Call to Action */}
  <section className="py-20 px-6 text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
    <h2 className="text-4xl font-bold mb-4">Ready to join the future of global commerce?</h2>
    <p className="mb-6 max-w-xl mx-auto">Whether you're a buyer or a brand, Amaya is your gateway to borderless opportunity.</p>
    <Link href="/register" className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-xl">Join Amaya Now</Link>
  </section>
</main>

); }


