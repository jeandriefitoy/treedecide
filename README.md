# TreeDecide

Sistem Pendukung Keputusan (SPK) berbasis Decision Tree — prototype tugas akhir semester.

## Struktur Proyek

```
treedecide/
├── docs/           # Dokumentasi (PRD, dll.)
├── frontend/       # Next.js (App Router) + Tailwind CSS
└── backend/        # Python FastAPI
```

## Fitur Utama

- Upload dataset CSV/Excel
- Auto-deteksi tipe kolom (kategorik/numerik) & missing value
- Auto-pemilihan algoritma: **ID3** (semua kategorik, tanpa missing) atau **C4.5** (numerik/missing)
- Visualisasi pohon keputusan & aturan IF-THEN

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:8000  
API Docs: http://localhost:8000/docs

## Alur Pengguna

1. Upload file di `/`
2. Konfigurasi kolom target di `/configure`
3. Lihat hasil pohon keputusan di `/result`
