import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// 🔹 Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXRHrrDblEnfCH4Ig8nmbDVE6rwxw2-_Q",
  authDomain: "driveup-cc3b2.firebaseapp.com",
  projectId: "driveup-cc3b2",
  storageBucket: "driveup-cc3b2.firebasestorage.app",
  messagingSenderId: "336566517167",
  appId: "1:336566517167:web:4e499030b8bd73a210c35a",
  measurementId: "G-JWTK80MMYX",
};

// ✅ Initialize Firebase Only Once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.useDeviceLanguage();

// ✅ Setup reCAPTCHA v2 properly
const setupRecaptchaVerifier = () => {
  if (window.recaptchaVerifier) {
    console.log("♻️ Clearing existing reCAPTCHA instance...");
    window.recaptchaVerifier.clear(); // ✅ Ensure a fresh instance
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible", // 🔹 Use invisible reCAPTCHA
      callback: (response) => {
        console.log("✅ reCAPTCHA verified:", response);
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired. User must re-verify.");
      },
    }
  );

  window.recaptchaVerifier.render();
};

export {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  setupRecaptchaVerifier,
  RecaptchaVerifier,
};
