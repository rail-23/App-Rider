// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB7mJEf4GgixzKdvrDEvohDsHlpmfxJMlU",
  authDomain: "app-rider-d690b.firebaseapp.com",
  projectId: "app-rider-d690b",
  storageBucket: "app-rider-d690b.firebasestorage.app",
  messagingSenderId: "46281312457",
  appId: "1:46281312457:web:d4b9cd7aa30a4d160ba518"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y exportar
export const db = getFirestore(app);

// Inicializar Auth y exportar
export const auth = getAuth(app);

// Exportar la app también por si la necesitas
export default app;