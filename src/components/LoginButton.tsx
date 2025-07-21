'use client';

import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCH0O60-xxFymCMdeBCUpKOQ67BV5CbCwE",
  authDomain: "amaya-2da6f.firebaseapp.com",
  projectId: "amaya-2da6f",
  storageBucket: "amaya-2da6f.appspot.com",
  messagingSenderId: "1001359297903",
  appId: "1:1001359297903:web:0f48021c7f95098480ec9a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LoginButton() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert(`Welcome, ${user.displayName}`);
      }
    });
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Login failed.");
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
