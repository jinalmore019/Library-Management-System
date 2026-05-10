import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Book, Users, Layers, Bookmark, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Importing Pages
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Categories from './pages/Categories';
import Issues from './pages/Issues';
import Login from './pages/Login';

const Sidebar = ({ setAuthStatus }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuthStatus(false);
    navigate('/login');
  };

  return (
    <div className="glass-panel" style={{ width: '260px', margin: '2rem 0 2rem 2rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem', padding: '0 1rem' }}>
        <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
          <Book color="white" size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>LMS Pro</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarItem to="/books" icon={<Book size={20} />} label="Books" />
        <SidebarItem to="/students" icon={<Users size={20} />} label="Students" />
        <SidebarItem to="/categories" icon={<Layers size={20} />} label="Categories" />
        <SidebarItem to="/issues" icon={<Bookmark size={20} />} label="Issues" />
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            width: '100%', background: 'transparent', border: 'none', color: 'var(--error)',
            cursor: 'pointer', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      style={({ isActive }) => ({
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px',
        borderRadius: '8px',
        color: isActive ? 'white' : 'var(--text-secondary)',
        background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
        borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? '600' : '500'
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('auth'));

  useEffect(() => {
    // Listen for 401 unauthorized errors from api.js
    const handleAuthError = () => setIsAuth(false);
    window.addEventListener('auth_error', handleAuthError);
    return () => window.removeEventListener('auth_error', handleAuthError);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          !isAuth ? <Login setAuthStatus={setIsAuth} /> : <Navigate to="/" replace />
        } />

        {/* Protected Routes inside the Layout */}
        <Route path="/*" element={
          <ProtectedRoute isAuth={isAuth}>
            <div className="app-container">
              <Sidebar setAuthStatus={setIsAuth} />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/issues" element={<Issues />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;