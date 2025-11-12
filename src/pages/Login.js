import React, { useState } from 'react';
import logo from '../presentation/pages/turbo.png';
import { useNavigate } from 'react-router-dom';
import authService from '../application/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.signIn(email, password);
      // on success redirect to home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error en el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-center">
        <img src={logo} alt="logo" className="login-logo" />
        <div className="login-card">
          <div className="login-hero">
            <h2 className="login-title">Bienvenido</h2>
            <p className="login-sub">Inicia sesión para acceder al panel</p>
          </div>

          <div className="login-body">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                />
              </div>

              <div className="form-row">
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <div className="actions">
                <button className="btn-gradient" type="submit" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
