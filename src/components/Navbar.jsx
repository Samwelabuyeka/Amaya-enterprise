import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center dark:bg-black dark:text-white">
      <Link href="/" className="text-xl font-bold text-purple-700 dark:text-purple-300">Amaya</Link>
      <div className="space-x-4 flex items-center">
        <Link href="/" className="text-purple-700 dark:text-purple-200 font-medium">Home</Link>
        <Link href="/brands" className="text-purple-700 dark:text-purple-200 font-medium">Brands</Link>
        <Link href="/admin" className="text-purple-700 dark:text-purple-200 font-medium">Admin</Link>
        <Link href="/brand-form" className="text-purple-700 dark:text-purple-200 font-medium">Onboard Brand</Link>
        <Link href="/register" className="text-purple-700 dark:text-purple-200 font-medium">Register</Link>
        {!loading && user ? (
          <>
            <span className="text-sm font-semibold mx-2">{user.displayName || user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
