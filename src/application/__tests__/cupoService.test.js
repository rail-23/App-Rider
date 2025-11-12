import repo from '../../infrastructure/firestoreRepository';
import { createCupo } from '../cupoService';

jest.mock('../../infrastructure/firestoreRepository');

describe('cupoService.createCupo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lanza error si falta la fecha', async () => {
    await expect(createCupo({})).rejects.toThrow('La fecha es requerida');
  });

  it('crea un cupo llamando al repositorio', async () => {
    const fakeResult = { id: 'abc123' };
    repo.addCupo.mockResolvedValueOnce(fakeResult);

    const result = await createCupo({ fecha: '2025-10-30', Manana: 1, Tarde: 2 });

    expect(repo.addCupo).toHaveBeenCalledTimes(1);
    const arg = repo.addCupo.mock.calls[0][0];
    expect(arg).toHaveProperty('fecha');
    expect(arg).toHaveProperty('Manana', 1);
    expect(result).toEqual(fakeResult);
  });
});
