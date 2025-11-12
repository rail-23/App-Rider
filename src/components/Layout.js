import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="font-display bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Botón móvil para mostrar/ocultar sidebar */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="flex min-h-screen">
        {/* Overlay para móvil */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar con responsive */}
        <div className={`
          fixed md:static inset-0 md:inset-auto
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          z-40 md:z-0
          ${isSidebarOpen ? 'overflow-auto' : 'overflow-hidden'}
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 min-h-screen w-full">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
