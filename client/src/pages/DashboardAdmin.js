import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// ─── Constants ────────────────────────────────────────────────────────────────
const QUIZ_CATEGORIES = ['Substansi Genetik', 'Sintesis Protein', 'Pewarisan Sifat', 'Hereditas Manusia', 'Mutasi & Rekayasa Genetika', 'Umum'];
const SECTION_TYPES = [
  { value: 'text', label: '📝 Teks', desc: 'Paragraf teks biasa' },
  { value: 'hikmah', label: '🕌 Hikmah', desc: 'Ayat/hadis islami' },
  { value: 'highlight', label: '💡 Highlight', desc: 'Kotak info berwarna' },
  { value: 'list', label: '📋 Daftar', desc: 'Daftar poin-poin' },
];
const ICONS = ['🧬', '⚗️', '🌱', '👨‍👩‍👧', '🔬', '📖', '🧪', '💊', '🦠', '🐾', '🌿', '🔭'];
const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

const emptyQuiz = { question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '', category: 'Umum' };
const emptySection = { type: 'text', heading: '', content: '', ayat: '', terjemahan: '', sumber: '', color: '#3B82F6' };
const emptyMateri = { title: '', icon: '🧬', order: 0, isPublished: true, videoUrl: '', sections: [{ ...emptySection }] };

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────
function QuizTab({ flash }) {
  const [quizzes, setQuizzes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyQuiz);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try { const r = await axios.get('/api/quiz/admin'); setQuizzes(r.data); } catch (e) {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(emptyQuiz); setEditId(null); setModal(true); };
  const openEdit = (q) => { setForm({ question: q.question, options: [...q.options], correct_answer: q.correct_answer, explanation: q.explanation, category: q.category || 'Umum' }); setEditId(q._id); setModal(true); };

  const save = async () => {
    if (!form.question || form.options.some(o => !o) || !form.explanation) { flash('❌ Lengkapi semua field!'); return; }
    setLoading(true);
    try {
      if (editId) await axios.put(`/api/quiz/${editId}`, form);
      else await axios.post('/api/quiz', form);
      flash(editId ? '✅ Soal diperbarui!' : '✅ Soal ditambahkan!');
      setModal(false); load();
    } catch (e) { flash('❌ Gagal menyimpan soal.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Hapus soal ini?')) return;
    try { await axios.delete(`/api/quiz/${id}`); flash('🗑️ Soal dihapus.'); load(); } catch (e) {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Daftar Soal Quiz ({quizzes.length})</h2>
        <button className="btn-primary" onClick={openAdd}>+ Tambah Soal</button>
      </div>
      {quizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div><p>Belum ada soal.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quizzes.map((q, i) => (
            <div key={q._id} style={{ background: 'white', borderRadius: 14, padding: '20px 24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ background: 'var(--blue-100)', color: 'var(--blue-700)', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>Q{i + 1}</span>
                    <span style={{ background: 'var(--gray-100)', color: 'var(--gray-600)', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600 }}>{q.category}</span>
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--gray-800)', marginBottom: 10, fontSize: '0.92rem', lineHeight: 1.6 }}>{q.question}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ fontSize: '0.8rem', padding: '6px 10px', borderRadius: 8, background: oi === q.correct_answer ? 'var(--green-100)' : 'var(--gray-50)', color: oi === q.correct_answer ? '#166534' : 'var(--gray-600)', fontWeight: oi === q.correct_answer ? 700 : 400, border: oi === q.correct_answer ? '1px solid #86efac' : '1px solid transparent' }}>
                        {String.fromCharCode(65 + oi)}. {opt} {oi === q.correct_answer && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(q)} style={{ padding: '7px 14px', border: '1px solid var(--blue-300)', borderRadius: 8, background: 'var(--blue-50)', color: 'var(--blue-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Poppins' }}>✏️ Edit</button>
                  <button onClick={() => del(q._id)} style={{ padding: '7px 14px', border: '1px solid #fca5a5', borderRadius: 8, background: '#fee2e2', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Poppins' }}>🗑️ Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ModalOverlay onClose={() => setModal(false)}>
          <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 24 }}>{editId ? '✏️ Edit Soal' : '➕ Tambah Soal'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Kategori">
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {QUIZ_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Pertanyaan">
              <textarea className="input-field" rows={4} placeholder="Tulis pertanyaan..." value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} style={{ resize: 'vertical' }} />
            </FormField>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 8 }}>Pilihan Jawaban <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(klik huruf untuk pilih jawaban benar)</span></label>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <button onClick={() => setForm({ ...form, correct_answer: i })} style={{ width: 34, height: 34, border: `2px solid ${form.correct_answer === i ? '#22c55e' : 'var(--gray-300)'}`, borderRadius: 8, background: form.correct_answer === i ? 'var(--green-100)' : 'white', cursor: 'pointer', fontWeight: 700, color: form.correct_answer === i ? '#166534' : 'var(--gray-400)', fontFamily: 'Poppins', fontSize: '0.85rem', flexShrink: 0 }}>{String.fromCharCode(65 + i)}</button>
                  <input className="input-field" placeholder={`Pilihan ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }} style={{ margin: 0 }} />
                </div>
              ))}
            </div>
            <FormField label="Penjelasan / Pembahasan">
              <textarea className="input-field" rows={3} placeholder="Pembahasan jawaban..." value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} style={{ resize: 'vertical' }} />
            </FormField>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={save} disabled={loading} style={{ flex: 1, padding: 13 }}>{loading ? '⏳...' : editId ? '💾 Simpan' : '✅ Tambah'}</button>
              <button className="btn-outline" onClick={() => setModal(false)} style={{ flex: 1, padding: 13 }}>Batal</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── Materi Tab ───────────────────────────────────────────────────────────────
function MateriTab({ flash }) {
  const [materiList, setMateriList] = useState([]);
  const [modal, setModal] = useState(false); // false | 'form' | 'preview'
  const [form, setForm] = useState(emptyMateri);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewMateri, setPreviewMateri] = useState(null);

  const load = useCallback(async () => {
    try { const r = await axios.get('/api/materi?all=true'); setMateriList(r.data); } catch (e) {}
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ ...emptyMateri, sections: [{ ...emptySection }] });
    setEditId(null); setModal('form');
  };
  const openEdit = (m) => {
    setForm({ title: m.title, icon: m.icon, order: m.order, isPublished: m.isPublished, videoUrl: m.videoUrl || '', sections: m.sections.map(s => ({ ...s })) });
    setEditId(m._id); setModal('form');
  };

  const save = async () => {
    if (!form.title) { flash('❌ Judul materi wajib diisi!'); return; }
    if (!form.sections.length) { flash('❌ Tambahkan minimal 1 bagian konten!'); return; }
    setLoading(true);
    try {
      if (editId) await axios.put(`/api/materi/${editId}`, form);
      else await axios.post('/api/materi', form);
      flash(editId ? '✅ Materi diperbarui!' : '✅ Materi ditambahkan!');
      setModal(false); load();
    } catch (e) { flash('❌ Gagal menyimpan materi.'); }
    setLoading(false);
  };

  const del = async (id) => {
    if (!window.confirm('Hapus materi ini? Tindakan ini tidak bisa dibatalkan.')) return;
    try { await axios.delete(`/api/materi/${id}`); flash('🗑️ Materi dihapus.'); load(); } catch (e) {}
  };

  const togglePublish = async (m) => {
    try {
      await axios.put(`/api/materi/${m._id}`, { ...m, isPublished: !m.isPublished });
      flash(m.isPublished ? '🔒 Materi disembunyikan.' : '✅ Materi dipublikasikan.');
      load();
    } catch (e) { flash('❌ Gagal mengubah status.'); }
  };

  // Section helpers
  const addSection = () => setForm(f => ({ ...f, sections: [...f.sections, { ...emptySection }] }));
  const removeSection = (i) => setForm(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));
  const updateSection = (i, field, val) => setForm(f => {
    const secs = [...f.sections];
    secs[i] = { ...secs[i], [field]: val };
    return { ...f, sections: secs };
  });
  const moveSection = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= form.sections.length) return;
    setForm(f => {
      const secs = [...f.sections];
      [secs[i], secs[j]] = [secs[j], secs[i]];
      return { ...f, sections: secs };
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Daftar Materi ({materiList.length})</h2>
        <button className="btn-primary" onClick={openAdd}>+ Tambah Materi</button>
      </div>

      {materiList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-400)' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div><p>Belum ada materi.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {materiList.map((m, i) => (
            <div key={m._id} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: 'var(--shadow-sm)', border: `1px solid ${m.isPublished ? 'var(--gray-100)' : '#fed7aa'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 50, height: 50, background: 'var(--blue-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{m.icon}</div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--gray-800)' }}>{m.title}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 20, background: m.isPublished ? 'var(--green-100)' : '#fed7aa', color: m.isPublished ? '#166534' : '#c2410c', fontWeight: 600 }}>
                        {m.isPublished ? '✅ Publik' : '🔒 Tersembunyi'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                      <span>📑 {m.sections?.length || 0} bagian</span>
                      <span>Urutan: #{m.order || i + 1}</span>
                      {m.videoUrl && <span>🎬 Ada video</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setPreviewMateri(m); setModal('preview'); }} style={{ padding: '7px 12px', border: '1px solid var(--gray-300)', borderRadius: 8, background: 'white', color: 'var(--gray-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins' }}>👁️ Preview</button>
                  <button onClick={() => togglePublish(m)} style={{ padding: '7px 12px', border: `1px solid ${m.isPublished ? '#fed7aa' : '#86efac'}`, borderRadius: 8, background: m.isPublished ? '#fff7ed' : 'var(--green-100)', color: m.isPublished ? '#c2410c' : '#166534', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins' }}>
                    {m.isPublished ? '🔒 Sembunyikan' : '✅ Publikasikan'}
                  </button>
                  <button onClick={() => openEdit(m)} style={{ padding: '7px 12px', border: '1px solid var(--blue-300)', borderRadius: 8, background: 'var(--blue-50)', color: 'var(--blue-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins' }}>✏️ Edit</button>
                  <button onClick={() => del(m._id)} style={{ padding: '7px 12px', border: '1px solid #fca5a5', borderRadius: 8, background: '#fee2e2', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins' }}>🗑️ Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Materi Form Modal */}
      {modal === 'form' && (
        <ModalOverlay onClose={() => setModal(false)} wide>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>{editId ? '✏️ Edit Materi' : '➕ Tambah Materi Baru'}</h3>
            <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-400)', lineHeight: 1 }}>✕</button>
          </div>

          {/* Basic Info */}
          <div style={{ background: 'var(--blue-50)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <h4 style={{ fontWeight: 700, color: 'var(--blue-800)', marginBottom: 16, fontSize: '0.95rem' }}>📋 Informasi Dasar</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Judul Materi" style={{ gridColumn: '1/-1' }}>
                <input className="input-field" placeholder="Contoh: Substansi Genetik" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </FormField>
              <FormField label="Ikon">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ICONS.map(ico => (
                    <button key={ico} onClick={() => setForm({ ...form, icon: ico })} style={{ width: 40, height: 40, border: `2px solid ${form.icon === ico ? 'var(--blue-500)' : 'var(--gray-200)'}`, borderRadius: 10, background: form.icon === ico ? 'var(--blue-50)' : 'white', fontSize: '1.3rem', cursor: 'pointer' }}>{ico}</button>
                  ))}
                </div>
              </FormField>
              <FormField label="Nomor Urutan">
                <input className="input-field" type="number" min="1" placeholder="1" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </FormField>
              <FormField label="URL Video YouTube (opsional)">
                <input className="input-field" placeholder="https://www.youtube.com/watch?v=..." value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} />
              </FormField>
              <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div onClick={() => setForm({ ...form, isPublished: !form.isPublished })} style={{ width: 48, height: 26, background: form.isPublished ? 'var(--blue-500)' : 'var(--gray-300)', borderRadius: 13, position: 'relative', transition: 'all 0.3s', cursor: 'pointer' }}>
                    <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: form.isPublished ? 25 : 3, transition: 'all 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)' }}>{form.isPublished ? '✅ Tampilkan ke siswa' : '🔒 Sembunyikan dari siswa'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sections Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: '0.95rem' }}>📄 Konten Materi ({form.sections.length} bagian)</h4>
              <button onClick={addSection} style={{ padding: '8px 16px', border: '2px dashed var(--blue-300)', borderRadius: 10, background: 'var(--blue-50)', color: 'var(--blue-600)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Poppins' }}>+ Tambah Bagian</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {form.sections.map((sec, i) => (
                <div key={i} style={{ border: '1.5px solid var(--gray-200)', borderRadius: 14, overflow: 'hidden', background: 'white' }}>
                  {/* Section header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--gray-500)', fontSize: '0.82rem', minWidth: 24 }}>#{i + 1}</span>
                    <select value={sec.type} onChange={e => updateSection(i, 'type', e.target.value)} style={{ padding: '6px 10px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: '0.85rem', fontFamily: 'Poppins', background: 'white', color: 'var(--gray-700)', fontWeight: 600 }}>
                      {SECTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>)}
                    </select>
                    <div style={{ flex: 1 }} />
                    <button onClick={() => moveSection(i, -1)} disabled={i === 0} style={{ padding: '4px 8px', border: '1px solid var(--gray-200)', borderRadius: 6, background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1, fontSize: '0.85rem' }}>↑</button>
                    <button onClick={() => moveSection(i, 1)} disabled={i === form.sections.length - 1} style={{ padding: '4px 8px', border: '1px solid var(--gray-200)', borderRadius: 6, background: 'white', cursor: i === form.sections.length - 1 ? 'not-allowed' : 'pointer', opacity: i === form.sections.length - 1 ? 0.4 : 1, fontSize: '0.85rem' }}>↓</button>
                    <button onClick={() => removeSection(i)} style={{ padding: '4px 10px', border: '1px solid #fca5a5', borderRadius: 6, background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Poppins', fontWeight: 600 }}>✕ Hapus</button>
                  </div>

                  {/* Section content fields */}
                  <div style={{ padding: 16 }}>
                    {sec.type === 'hikmah' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FormField label="Ayat Arab (opsional)">
                          <input className="input-field" placeholder="Tulisan arab ayat..." value={sec.ayat} onChange={e => updateSection(i, 'ayat', e.target.value)} style={{ fontFamily: 'serif', fontSize: '1.1rem', textAlign: 'right', direction: 'rtl' }} />
                        </FormField>
                        <FormField label="Terjemahan *">
                          <textarea className="input-field" rows={2} placeholder="Terjemahan ayat/hadis..." value={sec.terjemahan} onChange={e => updateSection(i, 'terjemahan', e.target.value)} style={{ resize: 'vertical' }} />
                        </FormField>
                        <FormField label="Sumber *">
                          <input className="input-field" placeholder="Contoh: Q.S. Al-Infitar: 7-8" value={sec.sumber} onChange={e => updateSection(i, 'sumber', e.target.value)} />
                        </FormField>
                      </div>
                    )}
                    {(sec.type === 'text' || sec.type === 'list') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FormField label="Judul Bagian (opsional)">
                          <input className="input-field" placeholder="Contoh: Pengertian DNA" value={sec.heading} onChange={e => updateSection(i, 'heading', e.target.value)} />
                        </FormField>
                        <FormField label={sec.type === 'list' ? 'Isi (satu poin per baris) *' : 'Isi Teks *'}>
                          <textarea className="input-field" rows={sec.type === 'list' ? 5 : 4} placeholder={sec.type === 'list' ? 'Poin pertama\nPoin kedua\nPoin ketiga' : 'Tulis konten materi di sini...'} value={sec.type === 'list' ? (() => { try { return JSON.parse(sec.content || '[]').join('\n'); } catch { return sec.content; } })() : sec.content}
                            onChange={e => {
                              if (sec.type === 'list') {
                                const lines = e.target.value.split('\n');
                                updateSection(i, 'content', JSON.stringify(lines));
                              } else {
                                updateSection(i, 'content', e.target.value);
                              }
                            }} style={{ resize: 'vertical' }} />
                        </FormField>
                        {sec.type === 'list' && <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: -8 }}>💡 Setiap baris baru = satu poin daftar</p>}
                      </div>
                    )}
                    {sec.type === 'highlight' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <FormField label="Judul Highlight *">
                          <input className="input-field" placeholder="Contoh: Aturan Chargaff" value={sec.heading} onChange={e => updateSection(i, 'heading', e.target.value)} />
                        </FormField>
                        <FormField label="Isi Konten *">
                          <textarea className="input-field" rows={3} placeholder="Isi kotak highlight..." value={sec.content} onChange={e => updateSection(i, 'content', e.target.value)} style={{ resize: 'vertical' }} />
                        </FormField>
                        <FormField label="Warna">
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {COLORS.map(c => (
                              <button key={c} onClick={() => updateSection(i, 'color', c)} style={{ width: 32, height: 32, borderRadius: 8, background: c, border: sec.color === c ? '3px solid var(--gray-800)' : '3px solid transparent', cursor: 'pointer', boxShadow: sec.color === c ? '0 0 0 2px white inset' : 'none' }} />
                            ))}
                          </div>
                        </FormField>
                        <div style={{ background: `${sec.color}15`, border: `2px solid ${sec.color}40`, borderRadius: 10, padding: '12px 16px', borderLeft: `4px solid ${sec.color}` }}>
                          <span style={{ fontSize: '0.8rem', color: sec.color, fontWeight: 600 }}>Preview: {sec.heading || '(judul)'}</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginTop: 4 }}>{sec.content || '(isi konten)'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {form.sections.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed var(--gray-300)', borderRadius: 14, color: 'var(--gray-400)' }}>
                <p>Belum ada bagian konten. Klik "+ Tambah Bagian" di atas.</p>
              </div>
            )}
          </div>

          {/* Save/Cancel */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--gray-200)' }}>
            <button className="btn-primary" onClick={save} disabled={loading} style={{ flex: 1, padding: 14 }}>{loading ? '⏳ Menyimpan...' : editId ? '💾 Simpan Perubahan' : '✅ Simpan Materi Baru'}</button>
            <button className="btn-outline" onClick={() => setModal(false)} style={{ flex: 1, padding: 14 }}>Batal</button>
          </div>
        </ModalOverlay>
      )}

      {/* Preview Modal */}
      {modal === 'preview' && previewMateri && (
        <ModalOverlay onClose={() => setModal(false)} wide>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '2rem' }}>{previewMateri.icon}</span>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Preview: {previewMateri.title}</h3>
            </div>
            <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-400)' }}>✕</button>
          </div>
          <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 24 }}>
            {(previewMateri.sections || []).map((sec, i) => {
              if (sec.type === 'hikmah') return (
                <div key={i} style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac', borderRadius: 12, padding: 18, margin: '12px 0', borderLeft: '4px solid #22c55e' }}>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.82rem', marginBottom: 8 }}>🕌 JENDELA HIKMAH</div>
                  {sec.ayat && <p style={{ fontFamily: 'serif', textAlign: 'right', color: '#14532d', marginBottom: 6 }}>{sec.ayat}</p>}
                  <p style={{ color: '#166534', fontStyle: 'italic', fontSize: '0.9rem' }}>"{sec.terjemahan}"</p>
                  <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.8rem', marginTop: 6 }}>— {sec.sumber}</p>
                </div>
              );
              if (sec.type === 'highlight') return (
                <div key={i} style={{ background: `${sec.color}12`, border: `2px solid ${sec.color}30`, borderRadius: 12, padding: 16, margin: '12px 0', borderLeft: `4px solid ${sec.color}` }}>
                  {sec.heading && <h4 style={{ color: sec.color, fontWeight: 700, marginBottom: 8 }}>{sec.heading}</h4>}
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)' }}>{sec.content}</p>
                </div>
              );
              if (sec.type === 'list') {
                let items = [];
                try { items = JSON.parse(sec.content || '[]'); } catch { items = (sec.content || '').split('\n'); }
                return (
                  <div key={i} style={{ margin: '12px 0' }}>
                    {sec.heading && <h4 style={{ fontWeight: 700, marginBottom: 10 }}>{sec.heading}</h4>}
                    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {items.map((it, j) => <li key={j} style={{ padding: '6px 0', fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--blue-500)', fontWeight: 700 }}>•</span>{it}</li>)}
                    </ul>
                  </div>
                );
              }
              return (
                <div key={i} style={{ margin: '12px 0' }}>
                  {sec.heading && <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{sec.heading}</h4>}
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.8 }}>{sec.content}</p>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={() => { openEdit(previewMateri); }} style={{ flex: 1, padding: 12 }}>✏️ Edit Materi Ini</button>
            <button className="btn-outline" onClick={() => setModal(false)} style={{ flex: 1, padding: 12 }}>Tutup</button>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────
const FormField = ({ label, children, style }) => (
  <div style={style}>
    {label && <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: 7 }}>{label}</label>}
    {children}
  </div>
);

const ModalOverlay = ({ children, onClose, wide }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 2000, padding: '20px', overflowY: 'auto' }}>
    <div style={{ background: 'white', borderRadius: 20, padding: 36, width: '100%', maxWidth: wide ? 820 : 640, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginTop: 20, marginBottom: 20, position: 'relative' }}>
      {children}
    </div>
  </div>
);

// ─── Students Tab ─────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/scores/users').then(r => setStudents(r.data)).catch(() => {});
    axios.get('/api/scores/all').then(r => setScores(r.data)).catch(() => {});
  }, []);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const scoreColor = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Daftar Siswa ({students.length})</h2>
        <input className="input-field" placeholder="🔍 Cari nama/email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)' }}>
              {['#', 'Nama', 'Email', 'Terdaftar', 'Durasi Login', 'Nilai Terakhir'].map(h => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', color: 'white', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const ss = scores.filter(sc => sc.user_id?._id === s._id || sc.user_id === s._id);
              const last = ss[0]?.score;
              const dur = s.loginSessions?.reduce((a, sess) => a + (sess.duration || 0), 0) || 0;
              return (
                <tr key={s._id} style={{ background: i % 2 === 0 ? 'white' : 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '11px 16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>{i + 1}</td>
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--gray-800)' }}>{s.name}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--gray-500)', fontSize: '0.85rem' }}>{s.email}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--gray-500)', fontSize: '0.82rem' }}>{new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--gray-600)', fontSize: '0.85rem' }}>{dur > 0 ? `${dur} mnt` : '-'}</td>
                  <td style={{ padding: '11px 16px' }}>{last !== undefined ? <span style={{ fontWeight: 700, color: scoreColor(last), background: last >= 80 ? 'var(--green-100)' : last >= 60 ? '#fef3c7' : '#fee2e2', padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem' }}>{last}</span> : <span style={{ color: 'var(--gray-400)', fontSize: '0.82rem' }}>Belum quiz</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Scores Tab ───────────────────────────────────────────────────────────────
function ScoresTab() {
  const [scores, setScores] = useState([]);
  useEffect(() => { axios.get('/api/scores/all').then(r => setScores(r.data)).catch(() => {}); }, []);
  const scoreColor = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Semua Hasil Quiz ({scores.length})</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)' }}>
              {['#', 'Nama Siswa', 'Nilai', 'Benar/Total', 'Waktu', 'Tanggal'].map(h => (
                <th key={h} style={{ padding: '13px 16px', textAlign: 'left', color: 'white', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scores.map((sc, i) => (
              <tr key={sc._id} style={{ background: i % 2 === 0 ? 'white' : 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '11px 16px', color: 'var(--gray-400)', fontSize: '0.85rem' }}>{i + 1}</td>
                <td style={{ padding: '11px 16px', fontWeight: 600 }}>{sc.user_id?.name || 'N/A'}<br /><span style={{ fontWeight: 400, fontSize: '0.76rem', color: 'var(--gray-400)' }}>{sc.user_id?.email}</span></td>
                <td style={{ padding: '11px 16px' }}><span style={{ fontWeight: 800, fontSize: '1.1rem', color: scoreColor(sc.score) }}>{sc.score}</span></td>
                <td style={{ padding: '11px 16px', color: 'var(--gray-600)', fontSize: '0.85rem' }}>{sc.answers?.filter(a => a.correct).length}/{sc.totalQuestions}</td>
                <td style={{ padding: '11px 16px', color: 'var(--gray-500)', fontSize: '0.82rem' }}>{sc.timeTaken ? `${sc.timeTaken}s` : '-'}</td>
                <td style={{ padding: '11px 16px', color: 'var(--gray-500)', fontSize: '0.82rem' }}>{new Date(sc.date).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const [tab, setTab] = useState('materi');
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState({ quiz: 0, materi: 0, students: 0, scores: 0 });

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  useEffect(() => {
    Promise.all([
      axios.get('/api/quiz/admin').catch(() => ({ data: [] })),
      axios.get('/api/materi?all=true').catch(() => ({ data: [] })),
      axios.get('/api/scores/users').catch(() => ({ data: [] })),
      axios.get('/api/scores/all').catch(() => ({ data: [] })),
    ]).then(([q, m, s, sc]) => setStats({ quiz: q.data.length, materi: m.data.length, students: s.data.length, scores: sc.data.length }));
  }, [tab]);

  const exportExcel = async () => {
    try {
      const r = await axios.get('/api/scores/export');
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(r.data);
      XLSX.utils.book_append_sheet(wb, ws, 'Nilai Siswa');
      XLSX.writeFile(wb, `GenZ_Nilai_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`);
      flash('✅ Data berhasil diekspor ke Excel!');
    } catch (e) { flash('❌ Gagal ekspor.'); }
  };

  const tabs = [
    { id: 'materi', label: '📚 Kelola Materi' },
    { id: 'quiz', label: '📋 Kelola Soal' },
    { id: 'students', label: '👥 Data Siswa' },
    { id: 'scores', label: '📊 Nilai' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 5%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard <span className="gradient-text">Admin</span></h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginTop: 4 }}>Kelola materi, soal, dan pantau siswa</p>
        </div>
        <button className="btn-primary" onClick={exportExcel} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>📥 Export Excel</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📚', label: 'Total Materi', value: stats.materi, color: '#10B981' },
          { icon: '📋', label: 'Total Soal', value: stats.quiz, color: '#3B82F6' },
          { icon: '👥', label: 'Total Siswa', value: stats.students, color: '#8B5CF6' },
          { icon: '📊', label: 'Total Quiz', value: stats.scores, color: '#06B6D4' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: '18px 20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Flash */}
      {msg && (
        <div style={{ background: msg.startsWith('✅') ? 'var(--green-100)' : '#fee2e2', border: `1px solid ${msg.startsWith('✅') ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: '12px 18px', marginBottom: 20, color: msg.startsWith('✅') ? '#166534' : '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--gray-100)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '11px 6px', border: 'none', borderRadius: 10, cursor: 'pointer', background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? 'var(--blue-700)' : 'var(--gray-500)', fontWeight: tab === t.id ? 700 : 500, fontSize: '0.85rem', boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s', fontFamily: 'Poppins' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'materi' && <MateriTab flash={flash} />}
      {tab === 'quiz' && <QuizTab flash={flash} />}
      {tab === 'students' && <StudentsTab />}
      {tab === 'scores' && <ScoresTab />}
    </div>
  );
}
