
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Agregar usuario a Firestore
export async function addUser(userData) {
  const usersCol = collection(db, 'users');
  const ref = await addDoc(usersCol, {
    ...userData,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

export async function fetchUsers() {
  const usersCol = collection(db, 'users');
  const snap = await getDocs(usersCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchCupos() {
  const cuposCol = collection(db, 'cupos');
  const q = query(cuposCol, orderBy('fecha', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ 
    id: d.id, 
    ...d.data(),
    fecha: d.data().fecha?.toDate() // Convertir Timestamp a Date
  }));
}

export async function getCuposByDateRange(startDate, endDate) {
  const cuposCol = collection(db, 'cupos');
  const q = query(
    cuposCol,
    where('fecha', '>=', startDate),
    where('fecha', '<=', endDate),
    orderBy('fecha', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    fecha: d.data().fecha?.toDate()
  }));
}

export async function addCupo({ fecha, Manana = 0, Tarde = 0, Noche = 0 } = {}) {
  const cuposCollection = collection(db, 'cupos');
  const ref = await addDoc(cuposCollection, {
    fecha,
    Manana,
    Tarde,
    Noche,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

export async function removeUser(userId) {
  if (!userId) throw new Error('userId required');
  const d = doc(db, 'users', userId);
  await deleteDoc(d);
  return true;
}


const firestoreRepository = {
  fetchUsers,
  fetchCupos,
  addCupo,
  addUser,
  getCuposByDateRange,
  removeUser,
};

export default firestoreRepository;
