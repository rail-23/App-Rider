import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../application/authService';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const linkClass = ({isActive}) => `
    flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
    ${isActive 
      ? 'bg-primary text-white shadow-sm' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  `;

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-screen md:w-64 h-[100dvh] bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">Panel Admin</h1>
        <button 
          onClick={onClose} 
          className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        <NavLink to="/" className={linkClass} end onClick={handleLinkClick}>
          <span className="material-symbols-outlined mr-3">home</span> Inicio
        </NavLink>
        <NavLink to="/usuarios" className={linkClass} onClick={handleLinkClick}>
          <span className="material-symbols-outlined mr-3">group</span> Usuarios
        </NavLink>
        <NavLink to="/cupos" className={linkClass} onClick={handleLinkClick}>
          <span className="material-symbols-outlined mr-3">event_available</span> Cupos
        </NavLink>
        <NavLink to="/reportes" className={linkClass} onClick={handleLinkClick}>
          <span className="material-symbols-outlined mr-3">bar_chart</span> Reportes
        </NavLink>
        <NavLink to="/config" className={linkClass} onClick={handleLinkClick}>
          <span className="material-symbols-outlined mr-3">settings</span> Configuración
        </NavLink>
        <button
          onClick={async () => {
            try {
              await authService.signOut();
              navigate('/login');
            } catch (err) {
              console.error('Error signing out', err);
            }
          }}
          className={linkClass({isActive: false})}
          style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <span className="material-symbols-outlined mr-3">logout</span> Cerrar sesión
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
