import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import localConfig from "../../firebase-applet-config.json";

// Safe reference to Vite environment variables for TypeScript compiling
const env = (import.meta as any).env || {};

// Read from Environment Variables (preferred on systems like Netlify)
// Fall back to local JSON config values
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || localConfig?.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localConfig?.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || localConfig?.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localConfig?.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig?.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || localConfig?.appId,
};

const databaseId = env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localConfig?.firestoreDatabaseId;

// Verify we have a configuration
if (!firebaseConfig.apiKey) {
  console.warn("Firebase configuration is missing or incomplete! Please declare environment variables or ensure firebase-applet-config.json is present.");
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use custom Firestore database identifier if provided, fallback to default
const db = databaseId 
  ? getFirestore(app, databaseId) 
  : getFirestore(app);

export { app, auth, db };
