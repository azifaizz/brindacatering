import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if the config object has a project ID and it hasn't been initialized already
export const app = (firebaseConfig.projectId && getApps().length === 0) 
  ? initializeApp(firebaseConfig) 
  : getApps().length > 0 ? getApps()[0] : null;

// Initialize Firestore
export const db = app ? getFirestore(app) : null;

// Initialize Auth
export const auth = app ? getAuth(app) : null;

// Initialize Storage
export const storage = app ? getStorage(app) : null;

// Initialize Analytics (only if supported in the environment, e.g. not during SSR)
export const analytics = app ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;
