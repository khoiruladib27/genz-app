import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f2460 0%, #1E3A8A 100%)',
      color: 'white', padding: '50px 5% 30px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Gen<span style={{ color: '#60a5fa' }}>-Z</span></h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Platform edukasi genetika interaktif untuk siswa SMA. Pelajari rahasia pewarisan sifat dengan cara yang menyenangkan.
            </p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Navigasi</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/', 'Home'], ['/materi', 'Materi'], ['/simulasi', 'Simulasi'], ['/quiz', 'Quiz'], ['/tentang', 'Tentang Kami']].map(([to, label]) => (
                <li key={to}><Link to={to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Ayat Inspirasi</h4>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 20, borderLeft: '3px solid #60a5fa' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.8 }}>
                "Yang telah menciptakan kamu lalu menyempurnakan kejadianmu dan menjadikan (susunan tubuh)mu seimbang, dalam bentuk apa saja yang Dia kehendaki, Dia menyusun tubuhmu."
              </p>
              <p style={{ color: '#60a5fa', fontSize: '0.85rem', marginTop: 8, fontWeight: 600 }}>Q.S. Al-Infitar: 7-8</p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
          © 2026 Gen-Z (Gen Zone) — Brillian Nurin Nada — Universitas Sebelas Maret
        </div>
      </div>
    </footer>
  );
}
