import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    
    try {
      await register(username, email, password);
      // After successful registration, route to login
      navigate('/login');
    } catch (err) {
      // Error handled in store
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
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#202124', fontWeight: '400', fontFamily: 'Product Sans, Inter, sans-serif' }}>Create a TaskFlow Account</h1>
            <p style={{ color: '#5F6368' }}>Enter your details to register</p>
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
              <label className="google-label">Username</label>
            </div>

            <div className="google-input-group">
              <input 
                type="email" 
                className="google-input" 
                placeholder=" " 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="google-label">Email Address</label>
            </div>
            
            <div className="google-input-group">
              <input 
                type="password" 
                className="google-input" 
                placeholder=" " 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label className="google-label">Password</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <Link to="/login" style={{ color: '#1A73E8', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Sign in instead</Link>
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

export default Register;
