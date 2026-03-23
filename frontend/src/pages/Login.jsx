import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    try {
      await login(username, password);
      // Protected Route will automatically redirect, but just to be safe
      navigate('/');
    } catch (err) {
      // Error is handled by Zustand
    }
  };

  return (
    <div className="auth-container">
      <div className="mac-window auth-card animate-scale-in" style={{ padding: 0 }}>
        {/* macOS Header */}
        <div className="mac-header">
          <span className="mac-dot close"></span>
          <span className="mac-dot minimize"></span>
          <span className="mac-dot maximize"></span>
        </div>

        <div style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#202124', fontWeight: '400', fontFamily: 'Product Sans, Inter, sans-serif' }}>Sign in</h1>
            <p style={{ color: '#5F6368' }}>Use your TaskFlow Account</p>
          </div>

          {error && (
            <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FCE8E6', color: '#D93025', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #FAD2CF' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="google-input-group">
              <input 
                type="text" 
                className="google-input" 
                placeholder=" " 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label className="google-label">Username or Email</label>
            </div>
            
            <div className="google-input-group">
              <input 
                type="password" 
                className="google-input" 
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="google-label">Password</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <Link to="/register" style={{ color: '#1A73E8', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Create account</Link>
              <button type="submit" className="btn btn-google" disabled={isLoading}>
                {isLoading ? <div className="spinner"><span></span></div> : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
