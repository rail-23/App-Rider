import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../application/userService';
import repo from '../infrastructure/firestoreRepository';
import CreateCupon from '../components/Cupos/CreateCupon';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

const UsuariosPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cuposSummary, setCuposSummary] = useState({ Manana: 0, Tarde: 0, Noche: 0 });

  const getUsers = async () => {
    try { setLoading(true); setError(null); const u = await userService.getUsers(); setUsers(u); } catch(e){ setError(String(e)); } finally { setLoading(false); }
  };

  useEffect(()=>{ getUsers(); }, []);

  useEffect(()=>{ (async ()=>{ try{ const cupos = await repo.fetchCupos(); let m=0,t=0,n=0; cupos.forEach(c=>{ m+=Number(c.Manana)||0; t+=Number(c.Tarde)||0; n+=Number(c.Noche)||0; }); setCuposSummary({Manana:m,Tarde:t,Noche:n}); }catch(e){}})(); }, []);

  const deleteUser = async (id) => {
    try { await userService.deleteUser(id); getUsers(); MySwal.fire({ icon:'success', title:'Eliminado', timer:1500, showConfirmButton:false }); } catch(e){ MySwal.fire({ icon:'error', title:'Error' }); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Usuarios</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gestiona los usuarios del sistema</p>
            </div>
            <Link 
              to="/create" 
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <span className="material-symbols-outlined mr-2">person_add</span>
              Crear Usuario
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"/>
                <p className="text-gray-500 dark:text-gray-400 mt-3">Cargando usuarios...</p>
              </div>
            ) : error ? (
              <div className="m-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">group_off</span>
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {u.Nombre || 'Sin nombre'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {u.Email || u.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {u.Categoria || 'Usuario'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            Activo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-4">
                            <Link 
                              to={`/edit/${u.id}`} 
                              className="text-primary hover:text-primary-dark transition-colors flex items-center"
                            >
                              <span className="material-symbols-outlined text-sm mr-1">edit</span>
                              Editar
                            </Link>
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                            >
                              <span className="material-symbols-outlined text-sm mr-1">delete</span>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

     

    </div>
  );
};

export default UsuariosPage;
