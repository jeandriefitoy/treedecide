# TreeDecide Backend

Python FastAPI REST API untuk SPK Decision Tree.

## Struktur Folder

```
backend/
├── app/
│   ├── main.py                 # Entry point FastAPI + CORS
│   ├── core/
│   │   └── config.py           # Settings (upload dir, CORS, dll.)
│   ├── api/
│   │   └── routes/
│   │       ├── upload.py       # POST /api/upload
│   │       ├── detect.py       # POST /api/detect
│   │       ├── train.py        # POST /api/select-target, /api/train
│   │       └── result.py       # GET  /api/result/{id}
│   ├── models/
│   │   └── schemas.py          # Pydantic request/response models
│   ├── services/
│   │   ├── file_parser.py      # Parse CSV/Excel + preview
│   │   ├── column_detector.py  # Deteksi tipe kolom & missing value
│   │   ├── algorithm_selector.py  # Auto pilih ID3 vs C4.5
│   │   └── preprocessor.py     # Imputasi missing value
│   ├── algorithms/
│   │   ├── base.py             # Abstract base + TreeNode
│   │   ├── id3.py              # Implementasi manual ID3
│   │   ├── c45.py              # Implementasi manual C4.5
│   │   └── tree_utils.py       # Helper konversi pohon & akurasi
│   └── storage/
│       └── session_store.py    # In-memory session (prototype)
├── uploads/                    # File upload sementara
├── tests/
│   ├── test_column_detector.py
│   └── test_algorithm_selector.py
├── requirements.txt
└── .env.example
```

## Endpoint API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/upload` | Upload CSV/Excel, return preview |
| POST | `/api/detect` | Upload CSV/Excel, deteksi tipe kolom & missing value |
| POST | `/api/select-target` | Set kolom target klasifikasi |
| POST | `/api/train` | Jalankan algoritma terpilih |
| GET | `/api/result/{id}` | Ambil hasil pohon + aturan IF-THEN |

## Logika Pemilihan Algoritma

| Kondisi | Algoritma |
|---------|-----------|
| Semua kategorik, tanpa missing | **ID3** |
| Ada numerik dan/atau missing | **C4.5** |

## Menjalankan

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API Docs: http://localhost:8000/docs
