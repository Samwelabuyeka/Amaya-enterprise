import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      // Store user in Firestore with default role 'user'
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white">
      <Navbar />
      <main className="max-w-lg mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Your Amaya Account</h1>
        <form className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg" onSubmit={handleRegister}>
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      </main>
    </div>
  );
};

export default Register;
