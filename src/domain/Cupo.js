// Entidad de dominio: Cupo
// Representa un registro de cupo con validaciones mínimas
export default class Cupo {
  constructor({ fecha, Manana = 0, Tarde = 0, Noche = 0, createdAt = new Date() } = {}) {
    if (!fecha) throw new Error('La fecha es requerida');

    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
    this.Manana = Number(Manana) || 0;
    this.Tarde = Number(Tarde) || 0;
    this.Noche = Number(Noche) || 0;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  // Convierte la entidad a un objeto plano listo para persistir
  toPlainObject() {
    return {
      fecha: this.fecha,
      Manana: this.Manana,
      Tarde: this.Tarde,
      Noche: this.Noche,
      createdAt: this.createdAt,
    };
  }

  // Fabrica una entidad Cupo desde un objeto devuelto por el repositorio
  static fromRepo(obj = {}) {
    if (!obj) return null;
    return new Cupo({
      fecha: obj.fecha || obj.fechaCupo || obj.date,
      Manana: obj.Manana ?? obj.manana ?? 0,
      Tarde: obj.Tarde ?? obj.tarde ?? 0,
      Noche: obj.Noche ?? obj.noche ?? 0,
      createdAt: obj.createdAt || new Date(),
    });
  }
}
