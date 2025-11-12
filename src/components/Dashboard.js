import React, { useEffect, useState } from "react";
import dashboardService from '../application/dashboardService';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersByCategory, setUsersByCategory] = useState({});
  const [usersByHour, setUsersByHour] = useState({});
  const [totalCupos, setTotalCupos] = useState({ Manana: 0, Tarde: 0, Noche: 0, total: 0 });
  const [recentCupos, setRecentCupos] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDashboardData();
        setTotalUsers(data.totalUsers);
        setUsersByCategory(data.usersByCategory);
        setUsersByHour(data.usersByHour);
        setTotalCupos(data.totalCupos);
        setRecentUsers(data.recentUsers);
        setRecentCupos(data.recentCupos);
      } catch (err) {
        console.error('Error en dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (value) => {
    if (!value) return '-';
    const d = value && value.toDate ? value.toDate() : (value instanceof Date ? value : null);
    if (!d) return '-';
    return d.toLocaleString();
  };

  return (
    <section className="dashboard-container">
      <header className="p-4 md:p-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Visión general de usuarios y cupos</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total usuarios</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalUsers}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Total cupos</div>
              <div className="metric-value">{totalCupos.total}</div>
              <div className="metric-small">M:{totalCupos.Manana} · T:{totalCupos.Tarde} · N:{totalCupos.Noche}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Usuarios por categoría</div>
              <div className="metric-list">
                {Object.keys(usersByCategory).length === 0 ? (
                  <div className="muted">Sin datos</div>
                ) : Object.entries(usersByCategory).map(([k,v]) => (
                  <div key={k} className="metric-list-item">{k}: <span className="metric-count">{v}</span></div>
                ))}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Usuarios por hora</div>
              <div className="metric-list">
                {Object.keys(usersByHour).length === 0 ? (
                  <div className="muted">No hay timestamps</div>
                ) : Object.entries(usersByHour).map(([h,c]) => (
                  <div key={h} className="metric-list-item">{h}:00 <span className="metric-count">{c}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="lists-row">
            <div className="list-card">
              <h4>Últimos usuarios</h4>
              <div className="list-body">
                {recentUsers.length === 0 ? (
                  <div className="muted">Sin usuarios recientes</div>
                ) : recentUsers.map(u => (
                  <div key={u.id} className="list-item">
                    <div className="list-item-main">{u.Nombre || 'N/A'}</div>
                    <div className="list-item-sub">ID: {u.id} · {formatDate(u.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="list-card">
              <h4>Últimos cupos</h4>
              <div className="list-body">
                {recentCupos.length === 0 ? (
                  <div className="muted">Sin cupos recientes</div>
                ) : recentCupos.map(c => (
                  <div key={c.id} className="list-item">
                    <div className="list-item-main">M:{c.Manana} · T:{c.Tarde} · N:{c.Noche}</div>
                    <div className="list-item-sub">ID: {c.id} · {formatDate(c.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Dashboard;
