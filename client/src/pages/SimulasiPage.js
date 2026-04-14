import React, { useState } from 'react';

// ─── Punnett Square ───────────────────────────────────────────────────────────
function buildPunnett(p1, p2) {
  const gametes = g => {
    const alleles = g.split('');
    if (alleles.length === 2) return [alleles[0], alleles[1]];
    return [g];
  };
  const g1 = gametes(p1), g2 = gametes(p2);
  const results = [];
  for (const a of g1) for (const b of g2) {
    const combo = [a, b].sort((x, y) => x === x.toUpperCase() ? -1 : 1).join('');
    results.push(combo);
  }
  return results;
}

const bloodGroups = {
  'IAIA': 'A', 'IAIO': 'A', 'IBIB': 'B', 'IBIO': 'B', 'IAIB': 'AB', 'ii': 'O'
};

function MendelSim() {
  const [tab, setTab] = useState('tanaman');
  const [p1, setP1] = useState('Aa');
  const [p2, setP2] = useState('Aa');
  const [results, setResults] = useState(null);

  const presets = {
    tanaman: [
      { label: 'Kacang Ercis – Tinggi × Pendek', p1: 'Tt', p2: 'tt', trait: 'tinggi batang', d: 'Tinggi (T)', r: 'Pendek (t)' },
      { label: 'Kacang Ercis – Warna Biji', p1: 'Gg', p2: 'Gg', trait: 'warna biji', d: 'Kuning (G)', r: 'Hijau (g)' },
      { label: 'Mirabilis jalapa – Bunga', p1: 'Mm', p2: 'Mm', trait: 'warna bunga', d: 'Merah (M)', r: 'Putih (m)' },
    ],
    hewan: [
      { label: 'Marmot – Warna Bulu', p1: 'Bb', p2: 'Bb', trait: 'warna bulu', d: 'Hitam (B)', r: 'Putih (b)' },
      { label: 'Ayam – Jenis Bulu', p1: 'Ff', p2: 'ff', trait: 'jenis bulu', d: 'Berbulu (F)', r: 'Tidak (f)' },
    ],
    manusia: [
      { label: 'Golongan Darah – A × B', p1: 'IAIO', p2: 'IBIO', trait: 'golongan darah', blood: true },
      { label: 'Albinisme – Karier × Karier', p1: 'Aa', p2: 'Aa', trait: 'albinisme', d: 'Normal (A)', r: 'Albino (aa)' },
    ]
  };

  const simulate = () => {
    const res = buildPunnett(p1, p2);
    const counts = {};
    res.forEach(r => { counts[r] = (counts[r] || 0) + 1; });
    setResults({ combinations: res, counts, total: res.length });
  };

  const getEmoji = (geno) => {
    const g = geno.toUpperCase();
    const hasUpper = geno.split('').some(c => c === c.toUpperCase() && c !== c.toLowerCase());
    return hasUpper ? '🟢' : '⚪';
  };

  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 20 }}>🌱 Simulasi Persilangan Mendel</h3>
      {/* Tab */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--gray-100)', borderRadius: 12, padding: 4 }}>
        {['tanaman', 'hewan', 'manusia'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: 10, cursor: 'pointer',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? 'var(--blue-700)' : 'var(--gray-500)',
            fontWeight: tab === t ? 700 : 500, fontSize: '0.9rem',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s', fontFamily: 'Poppins, sans-serif', textTransform: 'capitalize'
          }}>{t === 'tanaman' ? '🌿' : tab === 'hewan' ? '🐾' : '👥'} {t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {/* Presets */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {presets[tab].map((p, i) => (
          <button key={i} onClick={() => { setP1(p.p1); setP2(p.p2); setResults(null); }} style={{
            padding: '8px 14px', border: '1px solid var(--blue-300)', borderRadius: 20,
            background: 'var(--blue-50)', color: 'var(--blue-700)', fontSize: '0.82rem',
            cursor: 'pointer', fontWeight: 500, fontFamily: 'Poppins, sans-serif'
          }}>{p.label}</button>
        ))}
      </div>
      {/* Input */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[['Genotipe Induk ♀', p1, setP1], ['Genotipe Induk ♂', p2, setP2]].map(([label, val, set]) => (
          <div key={label}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>{label}</label>
            <select className="input-field" value={val} onChange={e => { set(e.target.value); setResults(null); }}>
              {['AA', 'Aa', 'aa', 'Bb', 'Bb', 'BB', 'bb', 'Tt', 'TT', 'tt', 'Gg', 'Gg', 'GG', 'gg', 'Ff', 'ff', 'Mm', 'Mm', 'IAIA', 'IAIO', 'IBIB', 'IBIO', 'IAIB', 'ii'].filter((v, i, a) => a.indexOf(v) === i).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button className="btn-primary" onClick={simulate} style={{ marginBottom: 28 }}>🔬 Simulasikan</button>

      {results && (
        <div style={{ animation: 'fadeInUp 0.4s ease' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Papan Punnett: {p1} × {p2}</h4>
          {/* Punnett Table */}
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ borderCollapse: 'collapse', minWidth: 300 }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 20px', background: 'var(--blue-500)', color: 'white', borderRadius: 8 }}>×</th>
                  {p2.split('').map((a, i) => <th key={i} style={{ padding: '12px 20px', background: 'var(--blue-400)', color: 'white', fontFamily: 'monospace' }}>{a}</th>)}
                </tr>
              </thead>
              <tbody>
                {p1.split('').map((a, ri) => (
                  <tr key={ri}>
                    <td style={{ padding: '12px 20px', background: 'var(--blue-400)', color: 'white', fontWeight: 700, fontFamily: 'monospace' }}>{a}</td>
                    {p2.split('').map((b, ci) => {
                      const combo = [a, b].sort((x, y) => x === x.toUpperCase() && x !== x.toLowerCase() ? -1 : 1).join('');
                      const isBlood = Object.keys(bloodGroups).includes(combo);
                      return (
                        <td key={ci} style={{ padding: '14px 20px', textAlign: 'center', background: ri % 2 === 0 && ci % 2 === 0 ? 'var(--blue-50)' : 'white', border: '2px solid var(--blue-100)', fontFamily: 'monospace', fontWeight: 700, color: 'var(--blue-700)', fontSize: '1rem' }}>
                          {combo} {isBlood ? `(Gol. ${bloodGroups[combo] || '?'})` : getEmoji(combo)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ratio */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            {Object.entries(results.counts).map(([geno, count]) => (
              <div key={geno} style={{ background: 'white', border: '2px solid var(--blue-200)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-700)' }}>{geno}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{count}/{results.total}</div>
                <div style={{ fontWeight: 700, color: 'var(--blue-500)', fontSize: '1rem' }}>{Math.round(count / results.total * 100)}%</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--green-100)', border: '1px solid var(--green-500)', borderRadius: 12, padding: '14px 20px', fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>
            ✅ Rasio Genotipe: {Object.entries(results.counts).map(([g, c]) => `${c} ${g}`).join(' : ')}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Protein Synthesis Game ───────────────────────────────────────────────────
const dnaBases = ['T', 'A', 'G', 'C', 'T', 'A', 'A', 'G', 'C'];
const correctMRNA = { 'T': 'A', 'A': 'U', 'G': 'C', 'C': 'G' };
const codonTable = { 'AUG': 'Met (Start)', 'UAA': 'Stop', 'GCU': 'Ala', 'CGU': 'Arg', 'UUU': 'Phe', 'AAA': 'Lys' };

function ProteinGame() {
  const [stage, setStage] = useState(1);
  const [mrnaBases, setMrnaBases] = useState(Array(dnaBases.length).fill(null));
  const [shake, setShake] = useState(null);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(null);
  const options = ['A', 'U', 'G', 'C'];

  const handleDrop = (idx, base) => {
    const correct = correctMRNA[dnaBases[idx]];
    if (base !== correct) {
      setShake(idx);
      setTimeout(() => setShake(null), 500);
      return;
    }
    const updated = [...mrnaBases];
    updated[idx] = base;
    setMrnaBases(updated);
    if (updated.every(b => b !== null)) setTimeout(() => setStage(2), 600);
  };

  const mrnaCodons = [];
  const mStr = mrnaBases.join('');
  for (let i = 0; i < mStr.length - 2; i += 3) mrnaCodons.push(mStr.slice(i, i + 3));

  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>🎮 Game Sintesis Protein</h3>
      <p style={{ color: 'var(--gray-500)', marginBottom: 24, fontSize: '0.9rem' }}>Drag & drop basa nitrogen yang tepat untuk membentuk protein!</p>

      {/* Stage indicator */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'var(--gray-100)', borderRadius: 12, overflow: 'hidden' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ flex: 1, padding: '12px', textAlign: 'center', background: stage >= s ? 'var(--blue-500)' : 'transparent', color: stage >= s ? 'white' : 'var(--gray-400)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
            Stage {s}: {s === 1 ? 'Transkripsi' : 'Translasi'}
          </div>
        ))}
      </div>

      {stage === 1 && (
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: 20 }}>
            Pasangkan basa mRNA yang benar untuk setiap basa DNA. Seret kartu basa ke kotak yang sesuai!
          </p>
          {/* DNA strand */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>DNA Template (3'→5'):</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {dnaBases.map((b, i) => (
                <div key={i} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blue-100)', border: '2px solid var(--blue-300)', borderRadius: 10, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-800)' }}>{b}</div>
              ))}
            </div>
          </div>
          {/* mRNA drop targets */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>mRNA (5'→3') — Letakkan basa di sini:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {mrnaBases.map((b, i) => (
                <div key={i}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleDrop(i, dragging); }}
                  style={{
                    width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: b ? '#dcfce7' : 'white',
                    border: `2px dashed ${b ? '#22c55e' : shake === i ? '#ef4444' : 'var(--gray-300)'}`,
                    borderRadius: 10, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem',
                    color: '#166534', cursor: 'pointer',
                    animation: shake === i ? 'bounce 0.4s ease' : 'none',
                    transition: 'all 0.2s'
                  }}>{b || '?'}</div>
              ))}
            </div>
          </div>
          {/* Base options */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>Kartu Basa mRNA — Seret ke atas:</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {options.map(base => (
                <div key={base} draggable onDragStart={() => setDragging(base)}
                  style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))', borderRadius: 12, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.2rem', color: 'white', cursor: 'grab', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', userSelect: 'none', transition: 'transform 0.15s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >{base}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stage === 2 && (
        <div>
          <div style={{ background: '#dcfce7', border: '1px solid #22c55e', borderRadius: 12, padding: '12px 18px', marginBottom: 24, color: '#166534', fontWeight: 600 }}>
            ✅ Transkripsi selesai! mRNA: <span style={{ fontFamily: 'monospace', fontSize: '1.05rem' }}>{mrnaBases.join('')}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: 20 }}>Tahap translasi: Setiap 3 basa mRNA (kodon) mengkode satu asam amino.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            {mrnaCodons.map((codon, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ background: 'var(--blue-500)', color: 'white', borderRadius: 10, padding: '10px 16px', fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', marginBottom: 6 }}>{codon}</div>
                <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '6px 10px', fontSize: '0.8rem', fontWeight: 600, color: codonTable[codon] === 'Stop' ? '#ef4444' : '#166534' }}>{codonTable[codon] || 'Asam Amino'}</div>
              </div>
            ))}
          </div>
          {!done ? (
            <button className="btn-primary" onClick={() => setDone(true)}>🎉 Selesaikan Translasi</button>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', borderRadius: 16, padding: 28, textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏆</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>Selamat! Protein Berhasil Dibuat!</h3>
              <p style={{ opacity: 0.85, fontSize: '0.95rem' }}>Kamu berhasil menyelesaikan proses sintesis protein dari transkripsi hingga translasi!</p>
              <button className="btn-primary" onClick={() => { setStage(1); setMrnaBases(Array(dnaBases.length).fill(null)); setDone(false); }} style={{ marginTop: 16, background: 'white', color: 'var(--blue-700)' }}>🔄 Main Lagi</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pedigree Chart ───────────────────────────────────────────────────────────
function PedigreeChart() {
  const [trait, setTrait] = useState('hemofilia');
  const scenarios = {
    hemofilia: {
      title: 'Hemofilia (X-linked Resesif)',
      desc: 'Ibu karier (XHXh) × Ayah normal (XHY)',
      legend: [['Normal ♂', 'Kotak putih'], ['Sakit ♂', 'Kotak biru gelap'], ['Normal ♀', 'Lingkaran putih'], ['Karier ♀', 'Lingkaran setengah biru']],
      members: [
        { id: 'g1f', type: 'female', status: 'carrier', label: 'Nenek\n(XHXh)', x: 80, y: 40 },
        { id: 'g1m', type: 'male', status: 'normal', label: 'Kakek\n(XHY)', x: 220, y: 40 },
        { id: 'p1f', type: 'female', status: 'carrier', label: 'Ibu\n(XHXh)', x: 80, y: 160 },
        { id: 'p1m', type: 'male', status: 'normal', label: 'Ayah\n(XHY)', x: 220, y: 160 },
        { id: 'c1', type: 'male', status: 'affected', label: 'Anak ♂\n(XhY)', x: 40, y: 290 },
        { id: 'c2', type: 'male', status: 'normal', label: 'Anak ♂\n(XHY)', x: 140, y: 290 },
        { id: 'c3', type: 'female', status: 'carrier', label: 'Anak ♀\n(XHXh)', x: 220, y: 290 },
        { id: 'c4', type: 'female', status: 'normal', label: 'Anak ♀\n(XHXH)', x: 310, y: 290 },
      ]
    },
    albino: {
      title: 'Albinisme (Autosomal Resesif)',
      desc: 'Kedua orang tua karier (Aa × Aa)',
      legend: [['Normal', 'Putih'], ['Karier', 'Abu-abu'], ['Albino', 'Merah muda']],
      members: [
        { id: 'p1f', type: 'female', status: 'carrier', label: 'Ibu\n(Aa)', x: 80, y: 40 },
        { id: 'p1m', type: 'male', status: 'carrier', label: 'Ayah\n(Aa)', x: 220, y: 40 },
        { id: 'c1', type: 'female', status: 'normal', label: 'Anak\n(AA)', x: 40, y: 180 },
        { id: 'c2', type: 'male', status: 'carrier', label: 'Anak\n(Aa)', x: 140, y: 180 },
        { id: 'c3', type: 'female', status: 'carrier', label: 'Anak\n(Aa)', x: 230, y: 180 },
        { id: 'c4', type: 'male', status: 'affected', label: 'Anak\n(aa)', x: 320, y: 180 },
      ]
    }
  };
  const sc = scenarios[trait];
  const colors = { normal: 'white', carrier: '#bfdbfe', affected: '#1E3A8A' };
  const textColor = { normal: '#374151', carrier: '#1e40af', affected: 'white' };

  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 16 }}>🧬 Peta Silsilah (Pedigree Chart)</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {Object.keys(scenarios).map(k => (
          <button key={k} onClick={() => setTrait(k)} style={{ padding: '8px 18px', border: '2px solid var(--blue-300)', borderRadius: 20, background: trait === k ? 'var(--blue-500)' : 'var(--blue-50)', color: trait === k ? 'white' : 'var(--blue-700)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', transition: 'all 0.2s' }}>
            {k === 'hemofilia' ? '🩸 Hemofilia' : '⚪ Albinisme'}
          </button>
        ))}
      </div>
      <div style={{ background: 'var(--blue-50)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
        <strong style={{ color: 'var(--blue-800)' }}>{sc.title}</strong>
        <p style={{ color: 'var(--blue-600)', fontSize: '0.88rem', marginTop: 4 }}>{sc.desc}</p>
      </div>
      <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
        <svg width="400" height="380" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Connecting lines - couple line */}
          {sc.members.filter(m => m.id.startsWith('p') || m.id.startsWith('g')).length >= 2 && (
            <>
              <line x1="110" y1={sc.members.find(m => m.id.includes('f') && (m.id.startsWith('p') || m.id.startsWith('g')))?.y + 24 || 64} x2="190" y2={sc.members.find(m => m.id.includes('f') && (m.id.startsWith('p') || m.id.startsWith('g')))?.y + 24 || 64} stroke="#94a3b8" strokeWidth="2" />
            </>
          )}
          {sc.members.map(m => {
            const size = 44;
            const cx = m.x + size / 2, cy = m.y + size / 2;
            return (
              <g key={m.id}>
                {m.type === 'male' ? (
                  <rect x={m.x} y={m.y} width={size} height={size} rx="6" fill={colors[m.status]} stroke={m.status === 'affected' ? '#1e3a8a' : '#3B82F6'} strokeWidth="2.5" />
                ) : (
                  <circle cx={cx} cy={cy} r={size / 2} fill={colors[m.status]} stroke={m.status === 'affected' ? '#1e3a8a' : '#3B82F6'} strokeWidth="2.5" />
                )}
                {m.label.split('\n').map((line, li) => (
                  <text key={li} x={cx} y={m.y + size + 14 + li * 14} textAnchor="middle" fontSize="10" fill="#475569" fontWeight={li === 0 ? '600' : '400'}>{line}</text>
                ))}
              </g>
            );
          })}
          {/* Parent to child lines */}
          <line x1="150" y1={trait === 'hemofilia' ? 184 : 64} x2="150" y2={trait === 'hemofilia' ? 240 : 130} stroke="#94a3b8" strokeWidth="2" />
          <line x1="40" y1="240" x2="350" y2="240" stroke="#94a3b8" strokeWidth="2" strokeDasharray={trait === 'hemofilia' ? '0' : '4'} />
          {[40, 140, 230, 320].slice(0, sc.members.filter(m => m.id.startsWith('c')).length).map((x, i) => (
            <line key={i} x1={x + 22} y1="240" x2={x + 22} y2={trait === 'hemofilia' ? 290 : 180} stroke="#94a3b8" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
          <div style={{ width: 18, height: 18, background: 'white', border: '2px solid #3B82F6', borderRadius: 3 }} />
          <span>Normal ♂</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
          <div style={{ width: 18, height: 18, background: '#1E3A8A', border: '2px solid #1E3A8A', borderRadius: 3 }} />
          <span>Sakit ♂</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
          <div style={{ width: 18, height: 18, background: 'white', border: '2px solid #3B82F6', borderRadius: '50%' }} />
          <span>Normal ♀</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
          <div style={{ width: 18, height: 18, background: '#bfdbfe', border: '2px solid #3B82F6', borderRadius: '50%' }} />
          <span>Karier ♀</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main SimulasiPage ────────────────────────────────────────────────────────
export default function SimulasiPage() {
  const [activeTab, setActiveTab] = useState('mendel');
  const tabs = [
    { id: 'mendel', label: '🌱 Simulasi Mendel', comp: <MendelSim /> },
    { id: 'protein', label: '⚗️ Sintesis Protein', comp: <ProteinGame /> },
    { id: 'pedigree', label: '🧬 Peta Silsilah', comp: <PedigreeChart /> },
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Laboratorium <span className="gradient-text">Virtual</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 8 }}>Eksplorasi genetika secara interaktif — simulasi, drag & drop, dan visualisasi</p>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--gray-100)', borderRadius: 14, padding: 4, marginBottom: 32 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '12px 8px', border: 'none', borderRadius: 12, cursor: 'pointer',
            background: activeTab === t.id ? 'white' : 'transparent',
            color: activeTab === t.id ? 'var(--blue-700)' : 'var(--gray-500)',
            fontWeight: activeTab === t.id ? 700 : 500, fontSize: '0.88rem',
            boxShadow: activeTab === t.id ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.25s', fontFamily: 'Poppins, sans-serif'
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-md)', border: '1px solid var(--gray-100)', padding: 36 }}>
        {tabs.find(t => t.id === activeTab)?.comp}
      </div>
    </div>
  );
}
