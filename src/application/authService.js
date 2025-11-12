import { auth } from '../firebaseConfig/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

export async function signIn(email, password) {
  if (!email || !password) throw new Error('Email y password son requeridos');
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export default { signIn, signOut, onAuthChange };
