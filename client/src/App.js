import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MateriPage from './pages/MateriPage';
import SimulasiPage from './pages/SimulasiPage';
import QuizPage from './pages/QuizPage';
import TentangPage from './pages/TentangPage';
import { LoginPage, RegisterPage } from './pages/LoginPage';
import DashboardAdmin from './pages/DashboardAdmin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px'}}><div className="loading-spinner"/></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

const Layout = ({ children, noFooter }) => (
  <>
    <Navbar />
    <div className="page">{children}</div>
    {!noFooter && <Footer />}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/materi" element={<Layout><MateriPage /></Layout>} />
      <Route path="/simulasi" element={<Layout><SimulasiPage /></Layout>} />
      <Route path="/quiz" element={<Layout><ProtectedRoute><QuizPage /></ProtectedRoute></Layout>} />
      <Route path="/tentang" element={<Layout><TentangPage /></Layout>} />
      <Route path="/login" element={<Layout noFooter><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout noFooter><RegisterPage /></Layout>} />
      <Route path="/admin" element={<Layout><ProtectedRoute adminOnly><DashboardAdmin /></ProtectedRoute></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
