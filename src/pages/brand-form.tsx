import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { db, storage, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BrandForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let logoUrl = "";
      if (logo) {
        const logoRef = ref(storage, `brand-logos/${Date.now()}-${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }
      await addDoc(collection(db, "brands"), {
        name,
        description,
        logo: logoUrl,
        createdBy: auth.currentUser ? auth.currentUser.uid : null,
        createdAt: serverTimestamp(),
        status: "pending"
      });
      setName("");
      setDescription("");
      setLogo(null);
      alert("Brand submitted for review!");
    } catch (err: any) {
      setError(err.message || "Failed to submit brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white">
      <Navbar />
      <main className="max-w-lg mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Onboard Your Brand</h1>
        <form className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Brand Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" type="file" accept="image/*" onChange={e => setLogo(e.target.files?.[0] || null)} />
          <textarea className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Brand Description" value={description} onChange={e => setDescription(e.target.value)} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold" disabled={loading}>{loading ? "Submitting..." : "Submit Brand"}</button>
        </form>
      </main>
    </div>
  );
};

export default BrandForm;
