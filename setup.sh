#!/bin/bash
# ========================================
# Gen-Z Quick Start Script (Mac/Linux)
# ========================================
echo "🧬 Gen-Z (Gen Zone) — Setup & Start"
echo "======================================"

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js tidak ditemukan. Install dari: https://nodejs.org"
  exit 1
fi

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️  MongoDB tidak ditemukan di PATH"
  echo "   Install dari: https://www.mongodb.com/try/download/community"
  echo "   Lanjut tanpa auto-start MongoDB..."
else
  echo "✅ MongoDB ditemukan"
fi

echo ""
echo "📦 Installing dependencies..."
npm install 2>/dev/null
cd server && npm install 2>/dev/null && cd ..
cd client && npm install 2>/dev/null && cd ..
echo "✅ Semua dependencies terinstall!"

echo ""
echo "🚀 Cara menjalankan:"
echo "   Terminal 1: cd server && node index.js"
echo "   Terminal 2: cd client && npm start"
echo ""
echo "🌐 Buka: http://localhost:3000"
echo "🔐 Admin: admin@genz.id / admin123"
echo ""
echo "Pastikan MongoDB sudah berjalan terlebih dahulu!"
