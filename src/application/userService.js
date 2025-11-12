
import repo from '../infrastructure/firestoreRepository';
import { auth } from '../firebaseConfig/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Crear usuario en Auth y Firestore
export async function createUser({ email, password, ...userData }) {
  // Crear usuario en Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = userCredential.user;
  // Guardar datos adicionales en Firestore
  const userToSave = { ...userData, email, uid };
  await repo.addUser(userToSave);
  return userToSave;
}

export async function getUsers() {
  return await repo.fetchUsers();
}

export async function deleteUser(userId) {
  return await repo.removeUser(userId);
}


const userService = { getUsers, deleteUser, createUser };
export default userService;
