import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import dashboardService from '../application/dashboardService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const formatToPercentage = (value) => `${(value * 100).toFixed(0)}%`;

const Reportes = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    usersByCategory: {},
    usersByHour: {},
    totalCupos: { Manana: 0, Tarde: 0, Noche: 0 },
    recentUsers: [],
    recentCupos: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7dias');

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Preparar datos para los gráficos con validaciones
  const categoryData = Object.entries(data.usersByCategory || {}).map(([name, value]) => ({
    name: name || 'Sin categoría',
    value: value || 0
  }));

  const cuposData = [
    { name: 'Mañana', value: data.totalCupos?.Manana || 0 },
    { name: 'Tarde', value: data.totalCupos?.Tarde || 0 },
    { name: 'Noche', value: data.totalCupos?.Noche || 0 }
  ];

  const hourlyData = Object.entries(data.usersByHour || {})
    .map(([hour, count]) => ({
      hour: `${hour}:00`,
      usuarios: count || 0
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Reportes y Análisis</h2>
            <select 
              className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7dias">Últimos 7 días</option>
              <option value="30dias">Últimos 30 días</option>
              <option value="90dias">Últimos 90 días</option>
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Gráfico de Distribución de Usuarios por Categoría */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Distribución por Categoría</h3>
              <div className="h-80">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} (${formatToPercentage(percent)})`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de Distribución de Cupos */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Distribución de Cupos</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cuposData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Cantidad de Cupos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gráfico de Actividad por Hora */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Actividad por Hora del Día</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="usuarios" 
                    stroke="#8884d8" 
                    name="Usuarios Activos"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resumen Estadístico */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Total Usuarios</h4>
              <p className="text-2xl font-bold">{data.totalUsers}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Total Cupos</h4>
              <p className="text-2xl font-bold">
                {data.totalCupos.Manana + data.totalCupos.Tarde + data.totalCupos.Noche}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Categoría más común</h4>
              <p className="text-2xl font-bold">
                {Object.entries(data.usersByCategory).length > 0 
                  ? Object.entries(data.usersByCategory).reduce((a, b) => 
                      b[1] > a[1] ? b : a
                    )[0]
                  : 'Sin datos'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Hora más activa</h4>
              <p className="text-2xl font-bold">
                {Object.entries(data.usersByHour).length > 0
                  ? `${Object.entries(data.usersByHour).reduce((a, b) => 
                      b[1] > a[1] ? b : a
                    )[0]}:00`
                  : 'Sin datos'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;