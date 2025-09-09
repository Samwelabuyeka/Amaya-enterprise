import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithGoogle } from "../lib/firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white">
      <Navbar />
      <main className="max-w-lg mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In to Amaya</h1>
        <form className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg" onSubmit={handleLogin}>
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={handleGoogle} className="bg-red-500 text-white px-6 py-2 rounded font-semibold" disabled={loading}>Sign in with Google</button>
        </div>
      </main>
    </div>
  );
};

export default Login;
