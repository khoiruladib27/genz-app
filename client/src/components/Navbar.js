import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/materi', label: 'Materi' },
    { to: '/simulasi', label: 'Simulasi' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/tentang', label: 'Tentang Kami' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 30px rgba(59,130,246,0.12)' : 'none' }}>
      <Link to="/" className="navbar-logo">Gen<span>-Z</span></Link>
      
      <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
        {links.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={location.pathname === l.to ? 'active' : ''} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          </li>
        ))}
        {user?.role === 'admin' && (
          <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Dashboard</Link></li>
        )}
      </ul>

      <div className="navbar-actions">
        {user ? (
          <>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 500 }}>
              👋 {user.name.split(' ')[0]}
            </span>
            <button className="btn-outline" onClick={handleLogout} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Login</button></Link>
            <Link to="/register"><button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Daftar</button></Link>
          </>
        )}
      </div>

      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
        <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : '' }} />
        <span style={{ opacity: mobileOpen ? 0 : 1 }} />
        <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : '' }} />
      </button>
    </nav>
  );
}
