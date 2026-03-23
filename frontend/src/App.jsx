import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Layout and Pages (We will create these next)
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: '40px 20px' }}>
        {children}
      </main>
    </>
  );
};

function App() {
  const { getMe, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      getMe(); // Verify token on mount
    }
  }, [token, getMe]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
      <Routes>
        <Route path="/login" element={
          <AuthRoute><Login /></AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute><Register /></AuthRoute>
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/tasks/:id" element={
          <ProtectedRoute>
            <Layout><TaskDetail /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </>
  );
}

export default App;
