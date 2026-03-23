import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CheckSquare } from 'lucide-react';
import useAuthStore from '../stores/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass" style={{ padding: '16px 24px', margin: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>
        <CheckSquare color="var(--primary)" size={28} />
        TaskFlow Mini
      </Link>
      
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Hello, <strong>{user.username}</strong></span>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
