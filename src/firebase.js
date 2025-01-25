import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJuiFTg8QChfY7Q2uPj_cRHQlQ5eVjM1I",
  authDomain: "fin-gamify-web.firebaseapp.com",
  projectId: "fin-gamify-web",
  storageBucket: "fin-gamify-web.firebasestorage.app",
  messagingSenderId: "931680432191",
  appId: "1:931680432191:web:7db62d26dec4144cbe888a",
  measurementId: "G-YVHMKY3TDY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);