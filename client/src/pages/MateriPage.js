import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ─── Glossary tooltip ─────────────────────────────────────────────────────────
const glossary = {
  'DNA': 'Asam deoksiribonukleat – molekul pembawa informasi genetik berupa rantai ganda polinukleotida.',
  'RNA': 'Asam ribonukleat – berperan dalam ekspresi gen; terdiri dari mRNA, tRNA, dan rRNA.',
  'Gen': 'Segmen DNA yang mengkode protein atau memiliki fungsi regulatori tertentu.',
  'Kromosom': 'Struktur dalam inti sel yang terdiri dari DNA yang terkondensasi bersama protein histon.',
  'Alel': 'Variasi dari suatu gen yang menempati lokus yang sama pada kromosom homolog.',
  'Genotipe': 'Susunan genetik suatu organisme (mis. AA, Aa, aa).',
  'Fenotipe': 'Sifat yang tampak pada organisme sebagai hasil ekspresi genotipe + lingkungan.',
  'Dominan': 'Alel yang ekspresinya mengalahkan alel lain (ditulis kapital, mis. A).',
  'Resesif': 'Alel yang ekspresinya tersembunyi bila berpasangan dengan alel dominan (ditulis kecil, mis. a).',
  'Kodon': 'Urutan 3 basa nitrogen pada mRNA yang mengkode satu asam amino.',
  'Antikodon': 'Urutan 3 basa pada tRNA yang komplementer dengan kodon mRNA.',
  'Transkripsi': 'Proses pembacaan DNA template untuk menghasilkan molekul mRNA.',
  'Translasi': 'Proses penerjemahan kode mRNA menjadi rantai polipeptida di ribosom.',
  'Mutasi': 'Perubahan permanen pada urutan basa DNA yang dapat diwariskan.',
  'Hemofilia': 'Kelainan genetik X-linked resesif yang menyebabkan darah sulit membeku.',
  'Albinisme': 'Kelainan genetik autosomal resesif yang menyebabkan tidak terbentuknya melanin.',
};

const GlossaryWord = ({ word }) => {
  const [show, setShow] = useState(false);
  const def = glossary[word];
  if (!def) return <span>{word}</span>;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ color: 'var(--blue-600)', borderBottom: '1.5px dashed var(--blue-400)', cursor: 'help', fontWeight: 600 }}
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{word}</span>
      {show && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#1E3A8A', color: 'white', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', width: 260, zIndex: 100, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', marginBottom: 8, lineHeight: 1.5, pointerEvents: 'none' }}>
          <strong style={{ color: '#93c5fd' }}>{word}</strong><br />{def}
          <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, background: '#1E3A8A', rotate: '45deg' }} />
        </div>
      )}
    </span>
  );
};

// ─── Section Renderers ────────────────────────────────────────────────────────
const renderTextWithGlossary = (text) => {
  if (!text) return null;
  const words = Object.keys(glossary);
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1, earliestWord = null;
    for (const w of words) {
      const idx = remaining.indexOf(w);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) { earliest = idx; earliestWord = w; }
    }
    if (earliest === -1) { parts.push(<span key={key++}>{remaining}</span>); break; }
    if (earliest > 0) parts.push(<span key={key++}>{remaining.slice(0, earliest)}</span>);
    parts.push(<GlossaryWord key={key++} word={earliestWord} />);
    remaining = remaining.slice(earliest + earliestWord.length);
  }
  return parts;
};

const SectionRenderer = ({ section }) => {
  switch (section.type) {
    case 'hikmah':
      return (
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac', borderRadius: 14, padding: 24, margin: '20px 0', borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: '1.2rem' }}>🕌</span>
            <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase' }}>Jendela Hikmah</span>
          </div>
          {section.ayat && <p style={{ fontFamily: 'serif', fontSize: '1.15rem', color: '#14532d', textAlign: 'right', lineHeight: 2, marginBottom: 10 }}>{section.ayat}</p>}
          <p style={{ color: '#166534', fontSize: '0.92rem', lineHeight: 1.8, fontStyle: 'italic' }}>"{section.terjemahan}"</p>
          <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.82rem', marginTop: 8 }}>— {section.sumber}</p>
        </div>
      );
    case 'text':
      return (
        <div style={{ marginBottom: 20 }}>
          {section.heading && <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 10, color: 'var(--gray-800)' }}>{section.heading}</h3>}
          <p style={{ lineHeight: 1.9, fontSize: '0.95rem', color: 'var(--gray-700)' }}>{renderTextWithGlossary(section.content)}</p>
        </div>
      );
    case 'highlight':
      return (
        <div style={{ background: `${section.color || '#3B82F6'}12`, border: `1.5px solid ${section.color || '#3B82F6'}30`, borderRadius: 14, padding: 20, margin: '16px 0', borderLeft: `4px solid ${section.color || '#3B82F6'}` }}>
          {section.heading && <h4 style={{ fontWeight: 700, color: section.color || '#3B82F6', marginBottom: 10 }}>{section.heading}</h4>}
          <p style={{ fontSize: '0.92rem', color: 'var(--gray-700)', lineHeight: 1.8 }}>{renderTextWithGlossary(section.content)}</p>
        </div>
      );
    case 'list':
      let items = [];
      try { items = JSON.parse(section.content || '[]'); } catch (e) { items = (section.content || '').split('\n').filter(Boolean); }
      return (
        <div style={{ marginBottom: 20 }}>
          {section.heading && <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, color: 'var(--gray-800)' }}>{section.heading}</h3>}
          <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.92rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>
                <span style={{ width: 22, height: 22, background: 'var(--blue-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue-700)', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                {renderTextWithGlossary(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MateriPage() {
  const [materiList, setMateriList] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/materi')
      .then(res => { setMateriList(res.data); setLoading(false); })
      .catch(() => { setError('Gagal memuat materi. Pastikan server berjalan.'); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
      <div className="loading-spinner" />
      <p style={{ color: 'var(--gray-500)' }}>Memuat materi...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 5%' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
      <p style={{ color: '#ef4444', fontSize: '1rem' }}>{error}</p>
    </div>
  );

  if (materiList.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 5%' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
      <p style={{ color: 'var(--gray-500)' }}>Belum ada materi tersedia. Admin belum menambahkan materi.</p>
    </div>
  );

  const currentMateri = materiList[active];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 5%', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0, position: 'sticky', top: 88 }}>
        <div style={{ background: 'white', borderRadius: 18, boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-100)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', padding: '20px 22px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>📚 Daftar Materi</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', marginTop: 4 }}>{materiList.length} topik tersedia</p>
          </div>
          {materiList.map((m, i) => (
            <button key={m._id} onClick={() => setActive(i)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '15px 22px', border: 'none',
              background: active === i ? 'var(--blue-50)' : 'white',
              cursor: 'pointer', textAlign: 'left',
              borderLeft: active === i ? '3px solid var(--blue-500)' : '3px solid transparent',
              transition: 'all 0.2s', borderBottom: '1px solid var(--gray-100)',
              fontFamily: 'Poppins, sans-serif'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: 500 }}>Materi {i + 1}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: active === i ? 700 : 500, color: active === i ? 'var(--blue-700)' : 'var(--gray-700)', lineHeight: 1.3 }}>{m.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: 'white', borderRadius: 18, boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-100)', padding: '40px', minHeight: 600 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ width: 56, height: 56, background: 'var(--blue-50)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {currentMateri.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 500, marginBottom: 2 }}>Materi {active + 1} dari {materiList.length}</div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{currentMateri.title}</h2>
          </div>
        </div>

        {/* Sections */}
        <div>
          {(currentMateri.sections || []).map((section, i) => (
            <SectionRenderer key={i} section={section} />
          ))}
        </div>

        {/* Video */}
        {currentMateri.videoUrl && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>🎬 Video Pembelajaran</h3>
            <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <iframe
                width="100%" height="315"
                src={currentMateri.videoUrl.replace('watch?v=', 'embed/')}
                title={currentMateri.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--gray-100)' }}>
          <button className="btn-outline" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} style={{ opacity: active === 0 ? 0.4 : 1 }}>
            ← Sebelumnya
          </button>
          <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
            {active + 1} / {materiList.length}
          </span>
          <button className="btn-primary" onClick={() => setActive(Math.min(materiList.length - 1, active + 1))} disabled={active === materiList.length - 1} style={{ opacity: active === materiList.length - 1 ? 0.4 : 1 }}>
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  );
}
