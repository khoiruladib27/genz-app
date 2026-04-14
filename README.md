# 🧬 Gen-Z (Gen Zone) — Platform Edukasi Genetika Interaktif

> Platform edukasi genetika berbasis web untuk siswa SMA — interaktif, modern, dan bernilai islami.
> 
> **Brillian Nurin Nada — Universitas Sebelas Maret (UNS) 2026**

---

## 🚀 Cara Menjalankan di Localhost

### Prasyarat
Pastikan sudah terinstall:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** Community → https://www.mongodb.com/try/download/community
- **npm** (sudah termasuk bersama Node.js)

---

### Langkah 1: Install MongoDB dan jalankan

**Windows:**
```bash
# Install MongoDB Community, lalu jalankan:
mongod --dbpath "C:\data\db"
```

**macOS (dengan Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

---

### Langkah 2: Clone / Ekstrak Proyek
```bash
cd genz
```

---

### Langkah 3: Install semua dependensi
```bash
# Di root folder:
npm install

# Install dependensi server:
cd server && npm install && cd ..

# Install dependensi client:
cd client && npm install && cd ..
```

---

### Langkah 4: Jalankan aplikasi

**Terminal 1 — Backend Server:**
```bash
cd server
node index.js
```
Server berjalan di: `http://localhost:5000`

**Terminal 2 — Frontend React:**
```bash
cd client
npm start
```
Frontend berjalan di: `http://localhost:3000`

---

### Langkah 5: Buka di browser
```
http://localhost:3000
```

---

## 🔐 Akun Default (Auto Seed)

| Role  | Email             | Password   |
|-------|-------------------|------------|
| Admin | admin@genz.id     | admin123   |

*Akun admin dan 10 soal quiz akan otomatis dibuat saat server pertama kali dijalankan.*

---

## 📁 Struktur Proyek

```
genz/
├── client/                  # React Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   └── Footer.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── HomePage.js       # Landing page + DNA animation
│       │   ├── MateriPage.js     # 5 materi + glosarium + hikmah
│       │   ├── SimulasiPage.js   # Lab virtual: Mendel, Protein, Pedigree
│       │   ├── QuizPage.js       # Quiz + timer + pembahasan
│       │   ├── TentangPage.js    # About page
│       │   ├── LoginPage.js      # Login & Register
│       │   └── DashboardAdmin.js # Admin panel
│       ├── App.js
│       ├── index.js
│       └── index.css
│
└── server/                  # Node.js + Express Backend
    ├── models/
    │   ├── User.js
    │   ├── Quiz.js
    │   └── Score.js
    ├── routes/
    │   ├── auth.js
    │   ├── quiz.js
    │   └── scores.js
    ├── middleware/
    │   └── auth.js
    ├── .env
    └── index.js
```

---

## ✨ Fitur Lengkap

### 📱 Halaman & Fitur
| Halaman | Fitur |
|---------|-------|
| **Home** | DNA animation, hero section, topik pembelajaran |
| **Materi** | 5 topik + glosarium hover + Jendela Hikmah islami |
| **Simulasi** | Punnett Square, Game Sintesis Protein, Pedigree Chart |
| **Quiz** | Timer, auto grading, riwayat nilai, pembahasan |
| **Tentang** | Profil pengembang, visi misi |
| **Login/Register** | JWT auth, role siswa/guru |
| **Dashboard Admin** | CRUD soal, monitoring siswa, export Excel |

### 🧬 Simulasi Lab Virtual
- **Mendel**: Papan Punnett otomatis untuk tanaman, hewan, manusia (golongan darah, albino)
- **Protein**: Drag & drop transkripsi + translasi interaktif
- **Pedigree**: Chart silsilah hemofilia & albinisme

### 👨‍🏫 Dashboard Guru (Admin)
- Tambah/edit/hapus soal quiz
- Lihat daftar siswa terdaftar
- Monitoring durasi login siswa
- Tabel semua hasil nilai
- Export nilai ke Excel (.xlsx)

---

## ⚙️ Konfigurasi Environment

File: `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/genz_genetika
JWT_SECRET=genz_secret_key_2026_brillian_nurin_nada
NODE_ENV=development
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Styling | Pure CSS + Google Fonts (Poppins) |
| Export | SheetJS (xlsx) |

---

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` — Daftar akun
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout (update durasi)
- `GET /api/auth/me` — Info user aktif

### Quiz
- `GET /api/quiz` — Ambil soal (tanpa kunci jawaban)
- `GET /api/quiz/admin` — Ambil soal + jawaban (admin)
- `POST /api/quiz` — Tambah soal (admin)
- `PUT /api/quiz/:id` — Edit soal (admin)
- `DELETE /api/quiz/:id` — Hapus soal (admin)
- `POST /api/quiz/submit` — Submit jawaban

### Scores
- `GET /api/scores/my` — Riwayat nilai saya
- `GET /api/scores/all` — Semua nilai (admin)
- `GET /api/scores/users` — Daftar siswa (admin)
- `GET /api/scores/export` — Data untuk ekspor Excel

---

## 📖 Kutipan Islami

> "Yang telah menciptakan kamu lalu menyempurnakan kejadianmu dan menjadikan (susunan tubuh)mu seimbang, dalam bentuk apa saja yang Dia kehendaki, Dia menyusun tubuhmu."
> 
> **Q.S. Al-Infitar: 7-8**

---

*© 2026 Gen-Z (Gen Zone) — Brillian Nurin Nada — Universitas Sebelas Maret*
