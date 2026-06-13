/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Support Vercel Environment Variables with JSON config file fallback
const metaEnv = (import.meta as any).env || {};

function getEnvValue(envKey: string, fallback: string): string {
  let val = metaEnv[envKey];
  if (typeof val !== 'string') return fallback;
  
  // Trim outer whitespace
  val = val.trim();
  
  // Strip potential double/single quotes pasted by mistake
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.slice(1, -1).trim();
  }
  if (val.startsWith("'") && val.endsWith("'")) {
    val = val.slice(1, -1).trim();
  }
  
  // If the value is empty, literally "undefined", "null", or equals the key name itself (common mistake)
  if (!val || val === 'undefined' || val === 'null' || val === envKey || val.startsWith('${')) {
    return fallback;
  }
  return val;
}

const resolvedConfig = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY', firebaseConfig.apiKey),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET', firebaseConfig.storageBucket),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId),
  appId: getEnvValue('VITE_FIREBASE_APP_ID', firebaseConfig.appId),
  measurementId: getEnvValue('VITE_FIREBASE_MEASUREMENT_ID', firebaseConfig.measurementId) || ""
};

// Print safe diagnostics to DevTools Console to help the user verify
console.log('[Firebase Init] Project ID:', resolvedConfig.projectId);
console.log('[Firebase Init] API Key Prefix:', resolvedConfig.apiKey ? `${resolvedConfig.apiKey.substring(0, 6)}... (Length: ${resolvedConfig.apiKey.length})` : 'MISSING');
console.log('[Firebase Init] API Key source is:', (metaEnv.VITE_FIREBASE_API_KEY ? 'Vercel Env' : 'Local firebase-applet-config.json'));

const app = initializeApp(resolvedConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // If we have a cached Google Access Token, we use it. Otherwise, we fallback to 'local-token' for Email/Password users
      const tokenToUse = cachedAccessToken || localStorage.getItem('google_access_token') || 'local-token';
      if (onAuthSuccess) onAuthSuccess(user, tokenToUse);
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('google_access_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    localStorage.setItem('google_access_token', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const registerWithEmailPassword = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginWithEmailPassword = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || localStorage.getItem('google_access_token');
};

export const logout = async () => {
  await firebaseSignOut(auth);
  cachedAccessToken = null;
  localStorage.removeItem('google_access_token');
};

