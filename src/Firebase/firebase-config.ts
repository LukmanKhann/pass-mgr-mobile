import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, initializeAuth} from 'firebase/auth';
import type {Persistence} from 'firebase/auth';
// RN persistence helper only exists on the react-native build of @firebase/auth.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getReactNativePersistence = require('@firebase/auth/dist/rn/index.js').getReactNativePersistence as (
  storage: unknown,
) => Persistence;
import {getDatabase} from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_DATABASE_URL
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  databaseURL: FIREBASE_DATABASE_URL,
};

// These values are inlined by react-native-dotenv at Metro transform time from
// .env / .env.<NODE_ENV>. If they are undefined it almost always means Metro
// was started before the env files existed and is serving a stale cache.
const missingEnvKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvKeys.length > 0) {
  throw new Error(
    `Missing Firebase env values: ${missingEnvKeys.join(', ')}.\n` +
      'react-native-dotenv inlines these at build time. Make sure the env ' +
      'file exists (e.g. .env.development) and restart Metro with a cleared ' +
      'cache: npx react-native start --reset-cache',
  );
}

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_REALTIME_DB = getDatabase(app);
