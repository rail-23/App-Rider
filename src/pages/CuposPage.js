import React, { useEffect, useState } from 'react';
import repo from '../infrastructure/firestoreRepository';
import CreateCupon from '../components/Cupos/CreateCupon';

const diasSemana = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const CuposPage = () => {
  const [cuposPorDia, setCuposPorDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadCupos = async () => {
    try {
      setLoading(true);
      const cupos = await repo.fetchCupos();
      
      // Agrupar cupos por día
      const cuposAgrupados = cupos.reduce((acc, cupo) => {
        if (!cupo.fecha) return acc;
        
        const fecha = cupo.fecha instanceof Date ? cupo.fecha : cupo.fecha.toDate();
        const dia = fecha.getDay();
        const fechaStr = fecha.toISOString().split('T')[0];
        
        if (!acc[fechaStr]) {
          acc[fechaStr] = {
            fecha: fecha,
            dia: dia,
            Manana: Number(cupo.Manana) || 0,
            Tarde: Number(cupo.Tarde) || 0,
            Noche: Number(cupo.Noche) || 0
          };
        } else {
          acc[fechaStr].Manana += Number(cupo.Manana) || 0;
          acc[fechaStr].Tarde += Number(cupo.Tarde) || 0;
          acc[fechaStr].Noche += Number(cupo.Noche) || 0;
        }
        return acc;
      }, {});

      const cuposOrdenados = Object.values(cuposAgrupados).sort((a, b) => a.fecha - b.fecha);
      setCuposPorDia(cuposOrdenados);
    } catch (error) {
      console.error('Error cargando cupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCupos();
  }, []);

  const totalCupos = cuposPorDia.reduce((acc, dia) => ({
    Manana: acc.Manana + dia.Manana,
    Tarde: acc.Tarde + dia.Tarde,
    Noche: acc.Noche + dia.Noche
  }), { Manana: 0, Tarde: 0, Noche: 0 });

  const renderHorario = (valor, icon, horario) => (
    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">{icon}</span>
        <span className="text-sm font-medium">{horario}</span>
      </div>
      <span className="font-bold text-primary">{valor}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Cupos Disponibles</h2>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span className="material-symbols-outlined mr-2">today</span>
          Ir a hoy
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Resumen total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mañana</h3>
                <span className="material-symbols-outlined text-primary">wb_sunny</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCupos.Manana}</p>
              <p className="text-xs text-gray-500 mt-1">6:00 AM - 2:00 PM</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tarde</h3>
                <span className="material-symbols-outlined text-primary">wb_twilight</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCupos.Tarde}</p>
              <p className="text-xs text-gray-500 mt-1">2:00 PM - 10:00 PM</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Noche</h3>
                <span className="material-symbols-outlined text-primary">dark_mode</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCupos.Noche}</p>
              <p className="text-xs text-gray-500 mt-1">10:00 PM - 6:00 AM</p>
            </div>
          </div>

          {/* Cupos por día */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cupos por día</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {cuposPorDia.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                  <p>No hay cupos registrados</p>
                </div>
              ) : (
                cuposPorDia.map((cupo, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {diasSemana[cupo.dia]}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {cupo.fecha.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {renderHorario(cupo.Manana, 'wb_sunny', 'Mañana')}
                      {renderHorario(cupo.Tarde, 'wb_twilight', 'Tarde')}
                      {renderHorario(cupo.Noche, 'dark_mode', 'Noche')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formulario de creación de cupos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <CreateCupon onSuccess={loadCupos} />
          </div>
        </>
      )}
    </div>
  );
};

export default CuposPage;
