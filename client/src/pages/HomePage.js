import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function DNAAnimation() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let frame = 0;
    const pairs = 18;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const spacing = canvas.height / pairs;
      for (let i = 0; i < pairs; i++) {
        const y = i * spacing + spacing / 2;
        const offset = (frame * 0.03) + (i * 0.45);
        const x1 = cx + Math.sin(offset) * 70;
        const x2 = cx + Math.sin(offset + Math.PI) * 70;
        const alpha = 0.18 + Math.abs(Math.sin(offset)) * 0.45;
        ctx.beginPath();
        ctx.moveTo(x1, y); ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(96,165,250,${alpha * 0.6})`;
        ctx.lineWidth = 1.5; ctx.stroke();
        const r1 = 5 + Math.abs(Math.sin(offset)) * 3;
        const r2 = 5 + Math.abs(Math.sin(offset + Math.PI)) * 3;
        ctx.beginPath(); ctx.arc(x1, y, r1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${alpha})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y, r2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${alpha})`; ctx.fill();
      }
      // backbone lines
      ctx.beginPath();
      for (let i = 0; i < pairs; i++) {
        const y = i * spacing + spacing / 2;
        const offset = (frame * 0.03) + (i * 0.45);
        const x1 = cx + Math.sin(offset) * 70;
        if (i === 0) ctx.moveTo(x1, y); else ctx.lineTo(x1, y);
      }
      ctx.strokeStyle = 'rgba(37,99,235,0.3)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < pairs; i++) {
        const y = i * spacing + spacing / 2;
        const offset = (frame * 0.03) + (i * 0.45);
        const x2 = cx + Math.sin(offset + Math.PI) * 70;
        if (i === 0) ctx.moveTo(x2, y); else ctx.lineTo(x2, y);
      }
      ctx.strokeStyle = 'rgba(96,165,250,0.3)'; ctx.lineWidth = 2; ctx.stroke();
      frame++;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }} />;
}

const features = [
  { icon: '🧬', title: 'Materi Interaktif', desc: 'Pelajari substansi genetik, sintesis protein, dan pewarisan sifat dengan konten multimedia yang menarik.' },
  { icon: '🔬', title: 'Lab Virtual', desc: 'Simulasi persilangan Mendel, peta silsilah, dan sintesis protein berbasis drag & drop yang seru.' },
  { icon: '📝', title: 'Evaluasi & Quiz', desc: 'Uji pemahamanmu dengan soal pilihan ganda bertimer dan lihat pembahasannya langsung.' },
  { icon: '📖', title: 'Nilai Islami', desc: 'Setiap materi dilengkapi hikmah dari Al-Qur\'an dan Hadis tentang keajaiban penciptaan.' },
];

const topics = [
  { num: '01', title: 'Substansi Genetik', desc: 'DNA, RNA, kromosom, gen, dan kode genetik', color: '#3B82F6' },
  { num: '02', title: 'Sintesis Protein', desc: 'Transkripsi, translasi, dan ekspresi gen', color: '#8B5CF6' },
  { num: '03', title: 'Pewarisan Sifat', desc: 'Hukum Mendel I & II, uji silang', color: '#06B6D4' },
  { num: '04', title: 'Hereditas Manusia', desc: 'Golongan darah, kelainan genetik, pedigree', color: '#10B981' },
  { num: '05', title: 'Mutasi & Rekayasa', desc: 'Mutasi gen, kromosom, bioteknologi modern', color: '#F59E0B' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0f2460 0%, #1E3A8A 45%, #2563eb 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <DNAAnimation />
        {/* Blobs */}
        <div style={{ position:'absolute', top:'10%', right:'8%', width:300, height:300, borderRadius:'50%', background:'rgba(96,165,250,0.08)', filter:'blur(40px)' }} />
        <div style={{ position:'absolute', bottom:'15%', left:'5%', width:250, height:250, borderRadius:'50%', background:'rgba(59,130,246,0.1)', filter:'blur(30px)' }} />
        
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 20px', maxWidth:800 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:50, padding:'8px 20px', marginBottom:28, backdropFilter:'blur(10px)' }}>
            <span style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.9)', fontWeight:500 }}>🧬 Platform Edukasi Genetika untuk Gen Z</span>
          </div>
          <h1 style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:20, letterSpacing:'-1px' }}>
            Gen<span style={{ color:'#60a5fa' }}>-Z</span><br/>
            <span style={{ fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:600, color:'rgba(255,255,255,0.85)' }}>Gen Zone</span>
          </h1>
          <p style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(255,255,255,0.8)', marginBottom:40, lineHeight:1.7, maxWidth:600, margin:'0 auto 40px' }}>
            Pelajari rahasia pewarisan sifat dari sudut pandang Sains dan Islam. Interaktif, menyenangkan, dan bermakna.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/materi">
              <button className="btn-primary" style={{ padding:'16px 36px', fontSize:'1.05rem', background:'white', color:'#1E3A8A', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
                🚀 Mulai Eksplorasi
              </button>
            </Link>
            <Link to="/simulasi">
              <button className="btn-outline" style={{ padding:'16px 32px', fontSize:'1.05rem', color:'white', borderColor:'rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)' }}>
                🔬 Coba Simulasi
              </button>
            </Link>
          </div>
          <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:60, flexWrap:'wrap' }}>
            {[['5+', 'Topik Materi'], ['10+', 'Soal Quiz'], ['3', 'Jenis Simulasi']].map(([n, l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'2rem', fontWeight:800, color:'#60a5fa' }}>{n}</div>
                <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.7)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top, white, transparent)' }} />
      </section>

      {/* Features */}
      <section style={{ padding:'100px 5%', background:'white' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <span style={{ color:'var(--blue-500)', fontWeight:600, fontSize:'0.9rem', letterSpacing:2, textTransform:'uppercase' }}>Fitur Unggulan</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, marginTop:8, letterSpacing:'-0.5px' }}>
              Belajar Genetika <span className="gradient-text">Lebih Asyik</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:28 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding:32, textAlign:'center', animationDelay:`${i*0.1}s` }}>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontWeight:700, marginBottom:10, fontSize:'1.1rem' }}>{f.title}</h3>
                <p style={{ color:'var(--gray-600)', fontSize:'0.9rem', lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section style={{ padding:'80px 5%', background:'var(--gray-50)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, letterSpacing:'-0.5px' }}>
              Topik <span className="gradient-text">Pembelajaran</span>
            </h2>
            <p style={{ color:'var(--gray-600)', marginTop:12 }}>5 topik utama genetika untuk SMA Kelas XII IPA</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {topics.map((t, i) => (
              <Link key={i} to="/materi" style={{ textDecoration:'none' }}>
                <div style={{ background:'white', borderRadius:16, padding:'24px 32px', display:'flex', alignItems:'center', gap:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid var(--gray-100)', transition:'all 0.3s', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateX(8px)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(59,130,246,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'; }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:`${t.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:'1.3rem', fontWeight:800, color:t.color }}>{t.num}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <h3 style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--gray-800)' }}>{t.title}</h3>
                    <p style={{ color:'var(--gray-500)', fontSize:'0.88rem', marginTop:4 }}>{t.desc}</p>
                  </div>
                  <span style={{ color:t.color, fontSize:'1.3rem' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'100px 5%', background:'linear-gradient(135deg, #1E3A8A 0%, #2563eb 100%)', textAlign:'center' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, color:'white', marginBottom:16 }}>
            Siap Menjadi Ahli Genetika? 🧬
          </h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'1.1rem', marginBottom:36, lineHeight:1.7 }}>
            Bergabunglah sekarang dan mulai perjalanan belajar genetika yang interaktif dan menyenangkan!
          </p>
          <Link to="/register">
            <button className="btn-primary" style={{ background:'white', color:'#1E3A8A', padding:'16px 40px', fontSize:'1.1rem', boxShadow:'0 8px 30px rgba(0,0,0,0.2)' }}>
              Daftar Gratis Sekarang ✨
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
