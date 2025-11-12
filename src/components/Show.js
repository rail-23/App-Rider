import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from '../application/userService';
import repo from '../infrastructure/firestoreRepository';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateCupon from './Cupos/CreateCupon';
const MySwal = withReactContent(Swal);

const Show = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cuposSummary, setCuposSummary] = useState({ Manana: 0, Tarde: 0, Noche: 0 });

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getUsers(); }, []);

  useEffect(() => {
    const loadCupos = async () => {
      try {
        const cupos = await repo.fetchCupos();
        let m=0,t=0,n=0;
        cupos.forEach(c=>{ m+=Number(c.Manana)||0; t+=Number(c.Tarde)||0; n+=Number(c.Noche)||0; });
        setCuposSummary({ Manana: m, Tarde: t, Noche: n });
      } catch(e) { console.error('Error cargando cupos', e); }
    };
    loadCupos();
  }, []);

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      getUsers();
      MySwal.fire({ icon: 'success', title: 'Eliminado', text: 'El usuario ha sido eliminado correctamente', timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      MySwal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el usuario' });
    }
  };

  const confirmDelete = (id, nombre) => {
    MySwal.fire({ title: '¿Estás seguro?', text: `¿Deseas eliminar al usuario "${nombre}"?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar' }).then(r => { if (r.isConfirmed) deleteUser(id); });
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-white dark:bg-background-dark flex flex-col border-r border-border-light dark:border-border-dark">
          <div className="p-6">
            <h1 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">Panel Admin</h1>
          </div>
          <nav className="flex-1 px-4 py-2 space-y-2">
            <a className="flex items-center px-4 py-2 text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 rounded-DEFAULT" href="#"><span className="material-symbols-outlined mr-3">home</span>Inicio</a>
            <a className="flex items-center px-4 py-2 text-white bg-primary rounded-DEFAULT" href="#"><span className="material-symbols-outlined mr-3">group</span>Usuarios</a>
            <a className="flex items-center px-4 py-2 text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 rounded-DEFAULT" href="#"><span className="material-symbols-outlined mr-3">event_available</span>Cupos</a>
            <a className="flex items-center px-4 py-2 text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 rounded-DEFAULT" href="#"><span className="material-symbols-outlined mr-3">bar_chart</span>Reportes</a>
            <a className="flex items-center px-4 py-2 text-subtle-light dark:text-subtle-dark hover:bg-primary/10 dark:hover:bg-primary/20 rounded-DEFAULT" href="#"><span className="material-symbols-outlined mr-3">settings</span>Configuración</a>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <header className="mb-8"><h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">Gestión de Usuarios y Cupos</h2></header>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-foreground-light dark:text-foreground-dark">Usuarios</h3>
              <Link to="/create" className="bg-primary text-white font-bold py-2 px-4 rounded-DEFAULT hover:bg-primary/90">Crear Usuario</Link>
            </div>

            <div className="bg-white dark:bg-background-dark shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto p-4">
                {loading ? (
                  <div className="text-center py-8"><div className="spinner mx-auto" /><p className="muted mt-3">Cargando usuarios...</p></div>
                ) : error ? (
                  <div className="p-4 bg-primary text-white rounded">{error}</div>
                ) : users.length === 0 ? (
                  <div className="p-6 text-center muted">No hay usuarios registrados</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-background-light dark:bg-black/20">
                      <tr>
                        <th className="p-4 font-semibold">Nombre</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Rol</th>
                        <th className="p-4 font-semibold">Estado</th>
                        <th className="p-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-border-light dark:border-border-dark">
                          <td className="p-4">{u.Nombre || 'Sin nombre'}</td>
                          <td className="p-4 text-subtle-light dark:text-subtle-dark">{u.Email || u.id}</td>
                          <td className="p-4"><span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">{u.Categoria || 'Usuario'}</span></td>
                          <td className="p-4"><span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm">Activo</span></td>
                          <td className="p-4"><Link className="text-primary hover:underline" to={`/edit/${u.id}`}>Editar</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-foreground-light dark:text-foreground-dark mb-4">Cupos Disponibles</h3>
            <div className="bg-white dark:bg-background-dark shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-background-light dark:bg-black/20">
                    <tr>
                      <th className="p-4 font-semibold">Horario</th>
                      <th className="p-4 font-semibold">Cupos Disponibles</th>
                      <th className="p-4 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <td className="p-4">Mañana</td>
                      <td className="p-4 text-subtle-light dark:text-subtle-dark">{cuposSummary.Manana}</td>
                      <td className="p-4"><a className="text-primary hover:underline" href="#">Editar</a></td>
                    </tr>
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <td className="p-4">Tarde</td>
                      <td className="p-4 text-subtle-light dark:text-subtle-dark">{cuposSummary.Tarde}</td>
                      <td className="p-4"><a className="text-primary hover:underline" href="#">Editar</a></td>
                    </tr>
                    <tr>
                      <td className="p-4">Noche</td>
                      <td className="p-4 text-subtle-light dark:text-subtle-dark">{cuposSummary.Noche}</td>
                      <td className="p-4"><a className="text-primary hover:underline" href="#">Editar</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="card">
              <CreateCupon />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Show;
