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
  apiKey: "AIzaSyChSaZ59CfZ8XbYWygSvnly4lXZaPzeO20",
  authDomain: "revendre-341ef.firebaseapp.com",
  projectId: "revendre-341ef",
  storageBucket: "revendre-341ef.firebasestorage.app",
  messagingSenderId: "524420025693",
  appId: "1:524420025693:web:b41588d6a649ad4f3fecb4"
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