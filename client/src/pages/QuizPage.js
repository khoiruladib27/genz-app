import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function QuizPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState('start'); // start | quiz | result | history
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try { const r = await axios.get('/api/scores/my'); setHistory(r.data); } catch (e) {}
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    if (phase !== 'quiz') return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const startQuiz = async () => {
    setLoading(true); setError('');
    try {
      const r = await axios.get('/api/quiz');
      if (!r.data.length) { setError('Belum ada soal. Minta admin untuk menambahkan soal.'); setLoading(false); return; }
      setQuestions(r.data); setAnswers({}); setCurrent(0); setTimeLeft(r.data.length * 60);
      setPhase('quiz');
    } catch (e) { setError('Gagal memuat soal.'); }
    setLoading(false);
  };

  const handleAnswer = (qId, idx) => setAnswers(a => ({ ...a, [qId]: idx }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = questions.map(q => ({ questionId: q._id, selected: answers[q._id] ?? -1 }));
      const r = await axios.post('/api/quiz/submit', { answers: payload, timeTaken: 600 - timeLeft });
      setResult(r.data); setPhase('result'); fetchHistory();
    } catch (e) { setError('Gagal menyimpan hasil.'); }
    setLoading(false);
  };

  const fmt = s => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const answered = Object.keys(answers).length;
  const pct = questions.length ? (answered / questions.length * 100) : 0;

  const scoreColor = s => s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = s => s >= 80 ? '🏆 Sangat Baik!' : s >= 60 ? '👍 Cukup Baik' : '📚 Perlu Belajar Lagi';

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 5%' }}>
      {/* Start Screen */}
      {phase === 'start' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📝</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8 }}>Evaluasi Genetika</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: 32, fontSize: '1rem' }}>
            Halo, <strong>{user?.name}</strong>! Uji pemahamanmu tentang genetika. Setiap soal bernilai poin.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, maxWidth: 600, margin: '0 auto 36px' }}>
            {[['📋', 'Pilihan Ganda', '4 opsi jawaban'], ['⏱️', 'Bertimer', '60 detik/soal'], ['🎯', 'Auto Grading', 'Langsung dinilai'], ['📖', 'Pembahasan', 'Lihat penjelasan']].map(([icon, title, desc]) => (
              <div key={title} className="card" style={{ padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</div>
                <div style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>{desc}</div>
              </div>
            ))}
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: 16, fontSize: '0.9rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-primary" onClick={startQuiz} disabled={loading} style={{ padding: '14px 40px', fontSize: '1.05rem' }}>
              {loading ? '⏳ Memuat...' : '🚀 Mulai Quiz'}
            </button>
            <button className="btn-outline" onClick={() => setPhase('history')} style={{ padding: '14px 28px' }}>
              📊 Riwayat Nilai
            </button>
          </div>
        </div>
      )}

      {/* Quiz Screen */}
      {phase === 'quiz' && questions.length > 0 && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'white', borderRadius: 16, padding: '16px 24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 600 }}>
              Soal <span style={{ color: 'var(--blue-600)' }}>{current + 1}</span> / {questions.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: timeLeft < 60 ? '#fee2e2' : 'var(--blue-50)', borderRadius: 20, padding: '8px 16px' }}>
              <span style={{ fontSize: '1.1rem' }}>⏱️</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: timeLeft < 60 ? '#ef4444' : 'var(--blue-700)', fontFamily: 'monospace' }}>{fmt(timeLeft)}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 600 }}>
              Dijawab: <span style={{ color: 'var(--green-500)' }}>{answered}</span>/{questions.length}
            </div>
          </div>
          {/* Progress */}
          <div style={{ background: 'var(--gray-200)', borderRadius: 20, height: 6, marginBottom: 28, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--blue-400), var(--blue-600))', borderRadius: 20, transition: 'width 0.4s ease' }} />
          </div>

          {/* Question */}
          <div className="card" style={{ padding: 36, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ background: 'var(--blue-500)', color: 'white', borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: '0.85rem' }}>Q{current + 1}</span>
              {questions[current].category && <span style={{ color: 'var(--blue-500)', fontSize: '0.82rem', background: 'var(--blue-50)', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>{questions[current].category}</span>}
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--gray-800)', marginBottom: 28, fontWeight: 500 }}>{questions[current].question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions[current].options.map((opt, i) => {
                const isSelected = answers[questions[current]._id] === i;
                return (
                  <button key={i} onClick={() => handleAnswer(questions[current]._id, i)} style={{
                    padding: '14px 20px', border: `2px solid ${isSelected ? 'var(--blue-500)' : 'var(--gray-200)'}`,
                    borderRadius: 12, background: isSelected ? 'var(--blue-50)' : 'white',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem',
                    color: isSelected ? 'var(--blue-700)' : 'var(--gray-700)',
                    fontWeight: isSelected ? 700 : 400, display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s', fontFamily: 'Poppins, sans-serif'
                  }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: isSelected ? 'var(--blue-500)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'white' : 'var(--gray-500)', flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <button className="btn-outline" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>← Sebelumnya</button>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {questions.map((q, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{ width: 34, height: 34, border: `2px solid ${i === current ? 'var(--blue-500)' : answers[q._id] !== undefined ? 'var(--green-500)' : 'var(--gray-300)'}`, borderRadius: 8, background: i === current ? 'var(--blue-500)' : answers[q._id] !== undefined ? 'var(--green-100)' : 'white', color: i === current ? 'white' : 'var(--gray-700)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>{i + 1}</button>
              ))}
            </div>
            {current < questions.length - 1 ? (
              <button className="btn-primary" onClick={() => setCurrent(current + 1)}>Selanjutnya →</button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                {loading ? '⏳...' : '✅ Kumpulkan'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result Screen */}
      {phase === 'result' && result && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>{result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '📚'}</div>
            <h2 style={{ fontWeight: 800, fontSize: '2rem', color: scoreColor(result.score) }}>{scoreLabel(result.score)}</h2>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: scoreColor(result.score), margin: '16px 0' }}>{result.score}</div>
            <p style={{ color: 'var(--gray-500)' }}>{result.correct} dari {result.total} soal benar</p>
          </div>

          <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>📖 Pembahasan Soal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            {result.details.map((q, i) => {
              const userAns = answers[q._id] ?? -1;
              const isCorrect = userAns === q.correct_answer;
              return (
                <div key={i} style={{ border: `2px solid ${isCorrect ? '#22c55e' : '#ef4444'}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', background: isCorrect ? '#f0fdf4' : '#fff1f2', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem' }}>{isCorrect ? '✅' : '❌'}</span>
                    <p style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--gray-800)', flex: 1 }}>{i + 1}. {q.question}</p>
                  </div>
                  <div style={{ padding: '12px 20px', background: 'white' }}>
                    {!isCorrect && userAns !== -1 && <p style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: 4 }}>Jawaban kamu: <strong>{q.options[userAns]}</strong></p>}
                    <p style={{ fontSize: '0.85rem', color: '#166534', marginBottom: 8 }}>Jawaban benar: <strong>{q.options[q.correct_answer]}</strong></p>
                    <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #22c55e' }}>
                      <p style={{ fontSize: '0.83rem', color: '#374151', lineHeight: 1.7 }}>💡 {q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setPhase('start')}>🔄 Quiz Lagi</button>
            <button className="btn-outline" onClick={() => setPhase('history')}>📊 Riwayat Nilai</button>
          </div>
        </div>
      )}

      {/* History Screen */}
      {phase === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.6rem' }}>📊 Riwayat Nilai</h2>
            <button className="btn-outline" onClick={() => setPhase('start')}>← Kembali</button>
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
              <p>Belum ada riwayat nilai. Mulai quiz dulu!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map((h, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 14, padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Quiz #{history.length - i}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · {h.totalQuestions} soal</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: scoreColor(h.score) }}>{h.score}</div>
                    <div style={{ fontSize: '0.78rem', color: scoreColor(h.score), fontWeight: 600 }}>{scoreLabel(h.score)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
