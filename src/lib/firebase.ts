import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Default config for development/demo purposes
const defaultConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-XXXXXXXXXX",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId,
};

// Check if we're using demo config
const isDemo = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app: any;
let auth: any;
let db: any;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  
  if (isDemo) {
    // For demo mode, create mock objects
    auth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signInWithEmailAndPassword: () => Promise.reject(new Error('Demo mode')),
      createUserWithEmailAndPassword: () => Promise.reject(new Error('Demo mode')),
      signOut: () => Promise.resolve(),
    };
    
    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false }),
          set: () => Promise.resolve(),
        }),
      }),
    };
  } else {
    auth = getAuth(app);
    db = getFirestore(app);
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  }
} catch (error) {
  console.warn('Firebase initialization failed, using demo mode:', error);
  // Fallback to demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error('Demo mode')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Demo mode')),
    signOut: () => Promise.resolve(),
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
      }),
    }),
  };
}

export { auth, db, analytics };
export default app;