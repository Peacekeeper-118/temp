// services/firebase.ts

// Helper to safely check if global firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && 
         (window as any).firebase && 
         (window as any).firebase.apps;
};

// Helper to safely access process.env
const getEnv = (key: string, fallback: string) => {
  try {
    return (typeof process !== 'undefined' && process.env && process.env[key]) ? process.env[key] : fallback;
  } catch (e) {
    return fallback;
  }
};

// Mock Implementations for Demo Mode
const noopPromise = () => Promise.resolve();
const rejectPromise = () => Promise.reject({ code: 'auth/operation-not-supported-in-this-environment', message: 'Demo Mode' });

const mockAuth = {
  signInWithPopup: rejectPromise,
  // Ensure callback runs to unblock loading state
  onAuthStateChanged: (cb: any) => { 
    if (cb) {
      // Use timeout to simulate async and ensure React has mounted
      setTimeout(() => cb(null), 100); 
    }
    return () => {}; 
  },
  signOut: noopPromise,
  currentUser: null
};

const mockProvider = {};

const mockDb = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: noopPromise,
      update: noopPromise
    }),
    add: () => Promise.resolve({ id: 'mock-id' })
  })
};

const mockStorage = {
  ref: () => ({
    put: noopPromise,
    getDownloadURL: () => Promise.resolve('https://picsum.photos/200')
  })
};

const mockFunctions = {
  httpsCallable: () => () => Promise.resolve({})
};

// Initialize variables with mocks by default to guarantee exports exist
let auth: any = mockAuth;
let googleProvider: any = mockProvider;
let db: any = mockDb;
let storage: any = mockStorage;
let functions: any = mockFunctions;
let isMock = true;

const initializeServices = () => {
  const apiKey = getEnv('FIREBASE_API_KEY', 'mock-key');

  // Only try real firebase if API Key is actually present and not the mock default
  if (isFirebaseAvailable() && apiKey && apiKey !== 'mock-key' && apiKey.length > 10) {
    try {
      const firebase = (window as any).firebase;
      
      const firebaseConfig = {
        apiKey: apiKey,
        authDomain: getEnv('FIREBASE_AUTH_DOMAIN', 'mock-domain'),
        projectId: getEnv('FIREBASE_PROJECT_ID', 'mock-project'),
        storageBucket: getEnv('FIREBASE_STORAGE_BUCKET', 'mock-bucket'),
        messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID', 'mock-sender'),
        appId: getEnv('FIREBASE_APP_ID', 'mock-app-id')
      };

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      
      // Initialize real services
      auth = firebase.auth();
      googleProvider = new firebase.auth.GoogleAuthProvider();
      db = firebase.firestore();
      storage = firebase.storage();
      functions = firebase.functions();
      isMock = false; 
      console.log("Firebase initialized successfully");
    } catch (e) {
      console.warn("Firebase initialization failed, using mocks:", e);
      // Variables remain as mocks
    }
  } else {
      console.log("Running in Demo Mode (Mock Services)");
  }
};

try {
  initializeServices();
} catch (error) {
  console.error("Critical error during service init, falling back to full mock", error);
}

export { auth, googleProvider, db, storage, functions, isMock };
export default isFirebaseAvailable() ? (window as any).firebase : undefined;