require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/scores', require('./routes/scores'));
app.use('/api/materi', require('./routes/materi'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Gen-Z Server Running' }));

const seedData = async () => {
  const Quiz = require('./models/Quiz');
  const User = require('./models/User');
  const Materi = require('./models/Materi');

  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({ name: 'Admin Guru', email: 'admin@genz.id', password: 'admin123', role: 'admin' });
    console.log('✅ Admin seeded: admin@genz.id / admin123');
  }

  const quizCount = await Quiz.countDocuments();
  if (quizCount === 0) {
    await Quiz.insertMany([
      { question: 'DNA tersusun atas rantai polinukleotida. Urutan basa nitrogen pada DNA yang benar adalah...', options: ['Adenin, Guanin, Sitosin, Urasil', 'Adenin, Guanin, Sitosin, Timin', 'Adenin, Urasil, Sitosin, Timin', 'Adenin, Guanin, Urasil, Timin'], correct_answer: 1, explanation: 'DNA mengandung basa nitrogen Adenin (A), Guanin (G), Sitosin (C), dan Timin (T). Urasil hanya ditemukan pada RNA.', category: 'Substansi Genetik' },
      { question: 'Proses sintesis protein yang terjadi di ribosom disebut...', options: ['Transkripsi', 'Translasi', 'Replikasi', 'Duplikasi'], correct_answer: 1, explanation: 'Translasi adalah proses pembacaan kode pada mRNA oleh ribosom untuk membentuk rantai polipeptida (protein).', category: 'Sintesis Protein' },
      { question: 'Hukum Mendel I menyatakan bahwa pada saat pembentukan gamet, pasangan alel akan...', options: ['Bergabung menjadi satu', 'Memisah secara bebas', 'Saling mempengaruhi', 'Tetap berpasangan'], correct_answer: 1, explanation: 'Hukum Segregasi: pasangan alel memisah secara bebas sehingga setiap gamet hanya membawa satu alel dari tiap pasangan.', category: 'Pewarisan Sifat' },
      { question: 'Seseorang dengan golongan darah AB memiliki genotipe...', options: ['IAIA', 'IBIB', 'IAIB', 'ii'], correct_answer: 2, explanation: 'Golongan darah AB bergenotipe IAIB (kodominan).', category: 'Hereditas Manusia' },
      { question: 'Albinisme merupakan kelainan genetik yang disebabkan oleh...', options: ['Gen dominan autosomal', 'Gen resesif autosomal', 'Gen dominan X-linked', 'Gen resesif X-linked'], correct_answer: 1, explanation: 'Albinisme disebabkan gen resesif autosomal (aa). Individu tidak mampu memproduksi melanin.', category: 'Mutasi & Rekayasa Genetika' },
      { question: 'Pasangan basa pada transkripsi DNA ke mRNA yang benar adalah...', options: ['A-T, T-A, G-C, C-G', 'A-U, T-A, G-C, C-G', 'A-U, T-A, G-U, C-G', 'A-T, T-U, G-C, C-G'], correct_answer: 1, explanation: 'Transkripsi: A→U, T→A, G→C, C→G. Timin digantikan Urasil pada RNA.', category: 'Sintesis Protein' },
      { question: 'Persilangan Uu × uu menghasilkan rasio fenotipe...', options: ['3 ungu : 1 putih', '1 ungu : 1 putih', 'Semua ungu', 'Semua putih'], correct_answer: 1, explanation: 'Testcross Uu × uu menghasilkan Uu (ungu) dan uu (putih) dengan rasio 1:1.', category: 'Pewarisan Sifat' },
      { question: 'Hemofilia lebih banyak diderita laki-laki karena...', options: ['Gen hemofilia di kromosom Y', 'Gen hemofilia di kromosom X bersifat resesif', 'Gen hemofilia di autosom bersifat dominan', 'Gen hemofilia hanya dari ayah'], correct_answer: 1, explanation: 'Gen hemofilia X-linked resesif. Laki-laki (XhY) langsung menderita, perempuan bisa jadi karier.', category: 'Hereditas Manusia' },
      { question: 'Mutasi akibat perubahan jumlah kromosom disebut...', options: ['Mutasi gen', 'Mutasi kromosom numerik (aneuploidi)', 'Mutasi titik', 'Mutasi transisi'], correct_answer: 1, explanation: 'Aneuploidi adalah perubahan jumlah kromosom. Contoh: Sindrom Down (trisomi 21).', category: 'Mutasi & Rekayasa Genetika' },
      { question: 'Kodon start pada mRNA yang mengkode Metionin adalah...', options: ['UGA', 'UAA', 'AUG', 'UAG'], correct_answer: 2, explanation: 'AUG adalah kodon start (Metionin). UGA, UAA, UAG adalah kodon stop.', category: 'Sintesis Protein' }
    ]);
    console.log('✅ 10 soal quiz berhasil di-seed');
  }

  const materiCount = await Materi.countDocuments();
  if (materiCount === 0) {
    await Materi.insertMany([
      {
        title: 'Substansi Genetik', icon: '🧬', order: 1, isPublished: true, videoUrl: '',
        sections: [
          { type: 'hikmah', ayat: 'وَفِيٓ أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ', terjemahan: 'Dan pada dirimu sendiri. Maka apakah kamu tidak memperhatikan?', sumber: 'Q.S. Adz-Dzariyat: 21' },
          { type: 'text', heading: 'Pengertian DNA', content: 'DNA (Deoxyribonucleic Acid) adalah molekul pembawa informasi hereditas berbentuk double helix. Terdiri dari dua rantai polinukleotida yang terikat oleh pasangan basa nitrogen. Berperan sebagai cetak biru kehidupan dan ditemukan di inti sel.' },
          { type: 'list', heading: 'Komponen Nukleotida DNA', content: JSON.stringify(['Gula deoksiribosa (C₅H₁₀O₄)', 'Gugus fosfat (PO₄³⁻)', 'Basa purin: Adenin (A) dan Guanin (G)', 'Basa pirimidin: Sitosin (C) dan Timin (T)']) },
          { type: 'highlight', heading: 'Aturan Chargaff', content: 'A berpasangan dengan T (2 ikatan hidrogen). G berpasangan dengan C (3 ikatan hidrogen). Proporsi A=T dan G=C selalu sama dalam suatu organisme.', color: '#3B82F6' },
          { type: 'text', heading: 'Perbedaan DNA dan RNA', content: 'RNA berbeda dari DNA: berupa rantai tunggal, menggunakan gula ribosa, dan mengandung Urasil (U) pengganti Timin. Tiga jenis RNA: mRNA (pembawa pesan), tRNA (transfer asam amino), rRNA (komponen ribosom).' }
        ]
      },
      {
        title: 'Sintesis Protein', icon: '⚗️', order: 2, isPublished: true, videoUrl: '',
        sections: [
          { type: 'hikmah', terjemahan: 'Sesungguhnya Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya.', sumber: 'Q.S. At-Tin: 4' },
          { type: 'text', heading: 'Transkripsi', content: 'Transkripsi terjadi di inti sel. RNA polimerase membaca template DNA (3\'→5\') dan mensintesis mRNA (5\'→3\'). Pasangan basa: T→A, A→U, G→C, C→G.' },
          { type: 'text', heading: 'Translasi', content: 'Translasi terjadi di ribosom. mRNA dibaca per 3 basa (kodon). Setiap kodon dipasangkan antikodon tRNA yang membawa asam amino spesifik. Dimulai AUG (start), berakhir UAA/UAG/UGA (stop).' },
          { type: 'highlight', heading: 'Dogma Sentral Biologi Molekuler', content: 'DNA → (Transkripsi) → mRNA → (Translasi) → Protein. Dikemukakan Francis Crick, 1958.', color: '#8B5CF6' },
          { type: 'list', heading: 'Kodon Penting', content: JSON.stringify(['AUG = Start (Metionin)', 'UGA, UAA, UAG = Stop', 'UUU/UUC = Fenilalanin', 'GCU/GCC/GCA/GCG = Alanin']) }
        ]
      },
      {
        title: 'Prinsip Pewarisan Sifat', icon: '🌱', order: 3, isPublished: true, videoUrl: '',
        sections: [
          { type: 'hikmah', terjemahan: 'Dan Kami jadikan dari air segala sesuatu yang hidup. Maka mengapakah mereka tiada juga beriman?', sumber: 'Q.S. Al-Anbiya: 30' },
          { type: 'text', heading: 'Hukum Mendel I – Segregasi', content: 'Pada pembentukan gamet, pasangan alel memisah secara bebas sehingga setiap gamet hanya membawa satu alel dari tiap pasangan gen. Berlaku untuk persilangan monohibrid (satu pasang sifat beda).' },
          { type: 'text', heading: 'Hukum Mendel II – Asortasi Bebas', content: 'Pemisahan pasangan alel satu gen tidak mempengaruhi pemisahan alel gen lain (untuk gen non-linked). Berlaku untuk persilangan dihibrid (dua pasang sifat beda).' },
          { type: 'list', heading: 'Terminologi Penting', content: JSON.stringify(['Genotipe: susunan alel (AA, Aa, aa)', 'Fenotipe: sifat yang tampak', 'Dominan: alel yang menutupi (huruf kapital)', 'Resesif: alel yang tertutupi (huruf kecil)', 'Homozigot: AA atau aa', 'Heterozigot: Aa']) },
          { type: 'highlight', heading: 'Contoh Testcross', content: 'Uu × uu → 50% Uu (Ungu) : 50% uu (Putih). Testcross digunakan untuk menentukan apakah individu dominan bersifat homozigot atau heterozigot.', color: '#06B6D4' }
        ]
      },
      {
        title: 'Hereditas pada Manusia', icon: '👨‍👩‍👧', order: 4, isPublished: true, videoUrl: '',
        sections: [
          { type: 'hikmah', terjemahan: 'Yang telah menciptakan kamu lalu menyempurnakan kejadianmu dan menjadikan susunan tubuhmu seimbang.', sumber: 'Q.S. Al-Infitar: 7' },
          { type: 'text', heading: 'Golongan Darah ABO', content: 'Golongan darah ditentukan gen I dengan 3 alel: IA, IB, i. Golongan A (IAIA/IAIO), B (IBIB/IBIO), AB (IAIB — kodominan), O (ii — resesif). Ditemukan Karl Landsteiner (1901).' },
          { type: 'text', heading: 'Albinisme', content: 'Disebabkan gen resesif autosomal (aa). Tidak dapat memproduksi melanin. Kulit, rambut, mata sangat pucat. Kedua orang tua minimal karier (Aa).' },
          { type: 'text', heading: 'Hemofilia', content: 'Darah sulit membeku (defisiensi faktor VIII/IX). Gen X-linked resesif (Xh). Laki-laki (XhY) langsung menderita. Perempuan (XHXh) berstatus karier.' },
          { type: 'highlight', heading: 'Buta Warna', content: 'Gen resesif X-linked (Xc). Tidak dapat membedakan merah-hijau. Lebih sering laki-laki (XcY). Diturunkan dari ibu karier ke anak laki-laki.', color: '#10B981' }
        ]
      },
      {
        title: 'Mutasi & Rekayasa Genetika', icon: '🔬', order: 5, isPublished: true, videoUrl: '',
        sections: [
          { type: 'hikmah', terjemahan: 'Dan Allah mengetahui apa yang kamu sembunyikan dan apa yang kamu tampakkan.', sumber: 'Q.S. An-Nahl: 19' },
          { type: 'text', heading: 'Mutasi Gen (Mutasi Titik)', content: 'Perubahan pada urutan basa DNA. Jenis: Substitusi (penggantian basa), Insersi (penambahan basa), Delesi (penghilangan basa). Insersi dan delesi menyebabkan frameshift mutation yang mengubah seluruh urutan baca kodon berikutnya.' },
          { type: 'text', heading: 'Mutasi Kromosom', content: 'Perubahan struktur atau jumlah kromosom. Aneuploidi: Trisomi 21 (Sindrom Down), Sindrom Klinefelter (XXY), Sindrom Turner (XO). Euploidi: penggandaan seluruh set kromosom (poliploid).' },
          { type: 'list', heading: 'Rekayasa Genetika Modern', content: JSON.stringify(['CRISPR-Cas9: pengeditan gen presisi tinggi', 'PCR: amplifikasi/perbanyakan DNA', 'Kloning: reproduksi organisme identik', 'GMO: tanaman/hewan hasil rekayasa gen', 'Terapi Gen: penyisipan gen normal ke sel sakit']) },
          { type: 'highlight', heading: 'Faktor Mutagen', content: 'Fisik: radiasi UV, sinar X, sinar gamma. Kimia: kolkisin, EMS, benzena, aflatoksin. Biologis: virus tertentu yang mengintegrasikan DNA ke dalam genom inang.', color: '#F59E0B' }
        ]
      }
    ]);
    console.log('✅ 5 materi awal berhasil di-seed');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB terhubung');
    await seedData();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server berjalan di http://192.168.1.11:${PORT}`);});
  })
  .catch(err => {
    console.error('❌ MongoDB gagal terhubung:', err.message);
    console.log('\n💡 Pastikan MongoDB sudah berjalan: mongod --dbpath /data/db');
    process.exit(1);
  });
