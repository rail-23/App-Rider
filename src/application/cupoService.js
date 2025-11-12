import repo from '../infrastructure/firestoreRepository';
import { Cupo } from '../domain';

export async function createCupo({ fecha, Manana = 0, Tarde = 0, Noche = 0 } = {}) {
  // Usar la entidad de dominio para validación y normalización
  const cupo = new Cupo({ fecha, Manana, Tarde, Noche });

  // Persistir usando el repositorio; toPlainObject genera un objeto simple
  const result = await repo.addCupo(cupo.toPlainObject());
  return result;
}

export async function getCuposByDateRange(startDate, endDate) {
  // Mantener la salida como la del repositorio para no romper la UI
  return await repo.getCuposByDateRange(startDate, endDate);
}

export default { createCupo, getCuposByDateRange };
