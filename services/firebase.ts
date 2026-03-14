// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  Auth,
  User
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(app);

// Persist auth state in localStorage so sessions survive page reloads and redirect flows.
// Fire-and-forget — don't let this block auth operations.
setPersistence(auth, browserLocalPersistence).catch(() => {});

export const googleProvider = new GoogleAuthProvider();
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const isMock = false;

// Export auth functions for easier use
export { signInWithPopup, signOut, onAuthStateChanged, deleteUser } from 'firebase/auth';
export { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
export type { User as FirebaseUser, ConfirmationResult } from 'firebase/auth';

console.log("Firebase initialized successfully - Project: revendre-341ef");