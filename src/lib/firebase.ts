// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCH0O60-xxFymCMdeBCUpKOQ67BV5CbCwE",
  authDomain: "amaya-2da6f.firebaseapp.com",
  projectId: "amaya-2da6f",
  storageBucket: "amaya-2da6f.appspot.com",
  messagingSenderId: "1001359297903",
  appId: "1:1001359297903:web:0f48021c7f95098480ec9a",
  measurementId: "G-869BZCW5BK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
