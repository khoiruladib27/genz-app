import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || err || 'Login gagal.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '2rem', fontWeight: 800, color: 'var(--blue-700)' }}>Gen<span style={{ color: 'var(--blue-400)' }}>-Z</span></Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 12, color: 'var(--gray-800)' }}>Masuk ke Akun</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 6 }}>Lanjutkan perjalanan belajar genetikamu</p>
        </div>
        <div style={{ background: 'white', borderRadius: 20, padding: '36px', boxShadow: '0 8px 40px rgba(59,130,246,0.12)', border: '1px solid var(--gray-100)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Email</label>
              <input className="input-field" type="email" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 12, background: '#fee2e2', borderRadius: 8, padding: '8px 12px', marginTop: 12 }}>⚠️ {error}</div>}
            
            {/* Demo hint */}
            <div style={{ background: 'var(--blue-50)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, marginTop: 12 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--blue-700)', fontWeight: 600 }}>💡 Demo Admin: admin@genz.id / admin123</p>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
              {loading ? '⏳ Masuk...' : '🚀 Masuk'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--gray-500)' }}>
            Belum punya akun? <Link to="/register" style={{ color: 'var(--blue-600)', fontWeight: 700, textDecoration: 'none' }}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Password tidak cocok.'); return; }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '2rem', fontWeight: 800, color: 'var(--blue-700)' }}>Gen<span style={{ color: 'var(--blue-400)' }}>-Z</span></Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 12 }}>Buat Akun Baru</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: 6 }}>Bergabung dan mulai belajar genetika!</p>
        </div>
        <div style={{ background: 'white', borderRadius: 20, padding: '36px', boxShadow: '0 8px 40px rgba(59,130,246,0.12)', border: '1px solid var(--gray-100)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Nama Lengkap</label>
                <input className="input-field" placeholder="Nama kamu" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Email</label>
                <input className="input-field" type="email" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Konfirmasi Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 10 }}>Daftar sebagai:</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['student', '👩‍🎓 Siswa'], ['admin', '👩‍🏫 Guru/Admin']].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setForm({ ...form, role: val })} style={{ flex: 1, padding: '12px', border: `2px solid ${form.role === val ? 'var(--blue-500)' : 'var(--gray-200)'}`, borderRadius: 12, background: form.role === val ? 'var(--blue-50)' : 'white', color: form.role === val ? 'var(--blue-700)' : 'var(--gray-500)', fontWeight: form.role === val ? 700 : 500, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'Poppins, sans-serif' }}>{label}</button>
                ))}
              </div>
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16, background: '#fee2e2', borderRadius: 8, padding: '8px 12px' }}>⚠️ {error}</div>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              {loading ? '⏳ Mendaftar...' : '✨ Daftar Sekarang'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: 'var(--gray-500)' }}>
            Sudah punya akun? <Link to="/login" style={{ color: 'var(--blue-600)', fontWeight: 700, textDecoration: 'none' }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
