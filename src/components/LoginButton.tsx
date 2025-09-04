'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInWithGoogle } from '@/lib/firebase/auth';

export default function LoginButton() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        alert(`Welcome, ${user.displayName}`);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert('Login failed.');
    }
  };

  return (
    <button
      onClick={login}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}
