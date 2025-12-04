import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { environment } from './environment';

const firebaseConfig = {
  apiKey: "AIzaSyC06I5YRrvSN9ncpbc5xtZ4NR2zJ3BM8T0",
  authDomain: "gcef-ang.firebaseapp.com",
  projectId: "gcef-ang",
  storageBucket: "gcef-ang.firebasestorage.app",
  messagingSenderId: "950447845931",
  appId: "1:950447845931:web:46f29d9b81937caeafb06e",
  measurementId: "G-CQWKE9YW0D"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;