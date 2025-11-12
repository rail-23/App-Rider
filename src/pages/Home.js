import React, { useEffect, useState } from 'react';
import dashboardService from '../application/dashboardService';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCupos: { Manana: 0, Tarde: 0, Noche: 0, total: 0 },
    usersByCategory: {},
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setStats(data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const formatDate = (value) => {
    if (!value) return '-';
    const d = value && value.toDate ? value.toDate() : (value instanceof Date ? value : null);
    if (!d) return '-';
    return d.toLocaleString();
  };

  return (
    <div className="home-page p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        ¡Bienvenido al Panel de Administración!
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Tarjetas de Resumen */}
          <div className="home-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</h3>
                <span className="material-symbols-outlined text-primary">group</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cupos Disponibles</h3>
                <span className="material-symbols-outlined text-primary">event_available</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCupos.total}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                <span>Mañana: {stats.totalCupos.Manana}</span>
                <span>·</span>
                <span>Tarde: {stats.totalCupos.Tarde}</span>
                <span>·</span>
                <span>Noche: {stats.totalCupos.Noche}</span>
              </div>
            </div>

            <div className="home-distrib bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Distribución por Categoría</h3>
                <span className="material-symbols-outlined text-primary">pie_chart</span>
              </div>
              <div className="space-y-3">
                {Object.entries(stats.usersByCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="w-24 sm:w-32 text-sm text-gray-600 dark:text-gray-400 truncate">
                      {category}
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right font-medium text-primary">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usuarios Recientes */}
          <div className="home-recent bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios Recientes</h3>
              <span className="material-symbols-outlined text-primary">history</span>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hide-sm">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {stats.recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {user.Nombre || 'Sin nombre'}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {user.Categoria || 'Sin categoría'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hide-sm">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
