import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import authService from './application/authService';
import UsuariosPage from './pages/UsuariosPage';
import CuposPage from './pages/CuposPage';
import Reportes from './pages/Reportes';
import Settings from './pages/Settings';
import Create from './components/Create';
import Edit from './components/Edit';

import './presentation/styles/base.css';
import './presentation/styles/home.css';
import './presentation/styles/login.css';
import './presentation/styles/cupos.css';
import './presentation/styles/reportes.css';
import './presentation/styles/usuarios.css';
import './presentation/styles/settings.css';



function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((u) => {
      setUser(u);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  function RequireAuth({ children }) {
    // while checking auth state, show simple spinner
    if (user === undefined) {
      return (
        <div style={{ padding: 40 }}>
          <div className="spinner" />
        </div>
      );
    }
    return user ? children : <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Home />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="cupos" element={<CuposPage />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="config" element={<Settings />} />
            <Route path="create" element={<Create />} />
            <Route path="edit/:id" element={<Edit />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
