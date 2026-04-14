import React from 'react';

export default function TentangPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Tentang <span className="gradient-text">Gen-Z</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 10, fontSize: '1.05rem' }}>Platform edukasi genetika interaktif berbasis web</p>
      </div>

      {/* Mission */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', borderRadius: 20, padding: '40px', color: 'white', marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>🎯 Visi & Misi</h2>
        <p style={{ lineHeight: 1.9, opacity: 0.9, fontSize: '0.95rem' }}>
          Gen-Z (Gen Zone) hadir sebagai solusi pembelajaran genetika yang inovatif, interaktif, dan bermakna bagi siswa SMA. Kami menggabungkan pendekatan sains modern dengan nilai-nilai islami untuk menciptakan pengalaman belajar yang holistik. Platform ini dirancang untuk memudahkan pemahaman materi genetika melalui simulasi visual, kuis evaluasi, dan konten multimedia yang engaging untuk generasi Z.
        </p>
      </div>

      {/* Goals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 48 }}>
        {[
          { icon: '🧬', title: 'Tujuan Pembelajaran', desc: 'Membantu siswa memahami konsep genetika secara mendalam melalui pendekatan visual dan interaktif yang menyenangkan.' },
          { icon: '🕌', title: 'Integrasi Nilai Islam', desc: 'Menghubungkan konsep sains genetika dengan ayat-ayat Al-Qur\'an dan Hadis untuk pembelajaran yang bermakna.' },
          { icon: '💻', title: 'Teknologi Modern', desc: 'Menggunakan teknologi web terkini untuk menghadirkan pengalaman belajar yang responsif dan mudah diakses.' },
          { icon: '📊', title: 'Evaluasi Terstruktur', desc: 'Menyediakan sistem evaluasi otomatis untuk memantau perkembangan belajar setiap siswa.' },
        ].map(g => (
          <div key={g.title} className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{g.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>{g.title}</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.7 }}>{g.desc}</p>
          </div>
        ))}
      </div>

      {/* Developer */}
      <div style={{ background: 'var(--gray-50)', borderRadius: 20, padding: 40, marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 28, textAlign: 'center' }}>👩‍💻 Profil Pengembang</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: '0 8px 30px rgba(59,130,246,0.35)', flexShrink: 0 }}>👩‍🎓</div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 6 }}>Brillian Nurin Nada</h3>
            <p style={{ color: 'var(--blue-600)', fontWeight: 600, marginBottom: 10 }}>Mahasiswa Pendidikan Biologi — Universitas Sebelas Maret (UNS)</p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: 500 }}>
              Platform Gen-Z dikembangkan sebagai proyek inovasi media pembelajaran interaktif berbasis teknologi web modern. Bertujuan untuk meningkatkan kualitas dan ketercapaian pembelajaran genetika di tingkat SMA melalui pendekatan yang relevan dengan generasi digital.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {['Pendidikan Biologi', 'UNS 2026', 'EdTech'].map(tag => (
                <span key={tag} style={{ background: 'var(--blue-100)', color: 'var(--blue-700)', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem', color: 'var(--gray-500)' }}>Teknologi yang Digunakan</h3>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['⚛️ React', '🟢 Node.js', '🍃 MongoDB', '🔐 JWT Auth', '📱 Responsive'].map(t => (
            <span key={t} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 20, padding: '8px 18px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-700)', boxShadow: 'var(--shadow-sm)' }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 60, padding: '30px', background: 'var(--blue-50)', borderRadius: 16 }}>
        <p style={{ fontStyle: 'italic', color: 'var(--blue-700)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          "Yang telah menciptakan kamu lalu menyempurnakan kejadianmu dan menjadikan (susunan tubuh)mu seimbang, dalam bentuk apa saja yang Dia kehendaki, Dia menyusun tubuhmu."
        </p>
        <p style={{ fontWeight: 700, color: 'var(--blue-500)', marginTop: 10 }}>Q.S. Al-Infitar: 7-8</p>
      </div>
    </div>
  );
}
