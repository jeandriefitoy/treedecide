# TreeDecide — Product Requirements Document (PRD) + Tech Spec

**Jenis Sistem:** Sistem Pendukung Keputusan (SPK) berbasis Decision Tree
**Tujuan:** Prototype tugas akhir semester
**Status:** Draft v1.0

---

## 1. Overview Sistem

TreeDecide adalah prototype Sistem Pendukung Keputusan (SPK) berbasis web yang membantu pengguna melakukan klasifikasi data menggunakan algoritma Decision Tree. Pengguna cukup mengunggah dataset dalam format CSV atau Excel, dan sistem akan secara otomatis:

1. Mendeteksi karakteristik data (tipe kolom, ada/tidaknya missing value)
2. Memilih algoritma Decision Tree yang paling sesuai (ID3 atau C4.5)
3. Menjalankan algoritma tersebut
4. Menampilkan hasil berupa pohon keputusan, aturan IF-THEN, dan alasan pemilihan algoritma

Fokus utama prototype ini adalah **fungsi inti berjalan dengan baik**, bukan fitur lengkap layaknya sistem produksi. Tidak ada kebutuhan akun/login, riwayat multi-user, atau deployment skala besar.

### Masalah yang Diselesaikan
Pengguna awam sulit menentukan algoritma Decision Tree mana yang cocok untuk datanya (kategorik saja vs campuran, ada missing value atau tidak). TreeDecide mengotomatiskan keputusan ini sekaligus menjalankan algoritmanya.

### Algoritma yang Digunakan
| Kondisi Data | Algoritma Terpilih | Alasan |
|---|---|---|
| Semua kategorik, tidak ada missing value | **ID3** | Sederhana, cepat, sesuai materi presentasi kelompok |
| Ada kolom numerik dan/atau ada missing value | **C4.5** | Bisa menangani data numerik & missing value, ID3 tidak bisa |

> Catatan akademik: implementasi ID3 dan C4.5 sebaiknya dibuat manual (bukan memakai `sklearn.tree.DecisionTreeClassifier`, karena itu implementasi CART), agar sesuai dengan algoritma yang dipresentasikan dan bisa dijelaskan langkah demi langkah (perhitungan entropy, information gain, gain ratio).

---

## 2. Fitur Utama (Functional Requirements)

| # | Fitur | Prioritas | Deskripsi |
|---|---|---|---|
| F1 | Upload dataset (CSV/Excel) | Wajib | Pengguna mengunggah file `.csv` / `.xlsx` |
| F2 | Auto deteksi tipe kolom | Wajib | Sistem membaca setiap kolom, menandai kategorik atau numerik |
| F3 | Auto deteksi missing value | Wajib | Sistem mengecek ada/tidaknya nilai kosong per kolom |
| F4 | Deteksi & pemilihan kolom target | Wajib | Pengguna memilih (atau sistem menyarankan) kolom label/target klasifikasi |
| F5 | Auto pemilihan algoritma | Wajib | Berdasarkan hasil F2 & F3, sistem memilih ID3 atau C4.5 secara otomatis + menampilkan alasannya |
| F6 | Preprocessing otomatis | Wajib | Handle missing value dasar sebelum training (mis. mode/imputasi sederhana untuk C4.5) |
| F7 | Jalankan algoritma & training model | Wajib | Sistem menjalankan algoritma terpilih pada data yang diunggah |
| F8 | Visualisasi pohon keputusan | Wajib | Menampilkan struktur pohon secara visual (graf/tree diagram) |
| F9 | Ekstraksi aturan IF-THEN | Wajib | Menampilkan hasil pohon dalam bentuk aturan tekstual |
| F10 | Notifikasi transparansi sistem | Bonus | Pesan seperti: "Sistem mendeteksi 2 kolom numerik → C4.5 dipilih" |
| F11 | Perbandingan ID3 vs C4.5 | Bonus | Menjalankan kedua algoritma dan membandingkan hasil/akurasi |
| F12 | Metrik akurasi (train/test split) | Bonus | Menampilkan akurasi model bila diperlukan |

---

## 3. Alur Sistem (User Flow)

```
[1] User membuka halaman utama
        ↓
[2] User upload file CSV/Excel
        ↓
[3] Sistem membaca & menampilkan preview data (beberapa baris awal)
        ↓
[4] User memilih/konfirmasi kolom target (label klasifikasi)
        ↓
[5] Sistem menjalankan auto-detection:
    - Tipe tiap kolom (kategorik/numerik)
    - Ada/tidaknya missing value
        ↓
[6] Sistem menentukan algoritma:
    - Semua kategorik + tanpa missing value → ID3
    - Ada numerik / ada missing value       → C4.5
        ↓
[7] Sistem menampilkan notifikasi keputusan algoritma + alasan
        ↓
[8] Sistem menjalankan preprocessing (jika perlu) lalu training
        ↓
[9] Sistem menampilkan hasil:
    - Visualisasi pohon keputusan
    - Aturan IF-THEN
    - (Opsional) Akurasi, perbandingan algoritma
        ↓
[10] User dapat mengunduh hasil / mengulang dengan dataset lain
```

---

## 4. Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| Frontend | **Next.js** (React) | Halaman upload, preview data, visualisasi hasil |
| Styling | Tailwind CSS | Mempercepat pengembangan UI |
| Backend | **Python** — FastAPI | REST API untuk upload, preprocessing, training, prediksi |
| Data Handling | Pandas | Membaca CSV/Excel, deteksi tipe kolom & missing value |
| Algoritma | Implementasi manual ID3 & C4.5 (Python) | Sesuai kebutuhan akademik, bukan library black-box |
| Visualisasi Pohon | Graphviz atau library JS (mis. `react-d3-tree`) | Bisa digenerate di backend (gambar) atau dirender di frontend (interaktif) |
| Komunikasi FE-BE | REST API (JSON) | Next.js fetch ke endpoint FastAPI |
| File Upload | `python-multipart` (FastAPI) | Untuk handle upload CSV/Excel |
| Excel Parsing | `openpyxl` | Untuk membaca file `.xlsx` |

### Rekomendasi Endpoint API (FastAPI)
```
POST /api/upload          → Upload file, return preview + info kolom
POST /api/detect          → Jalankan auto-detection tipe data & missing value
POST /api/select-target   → Set kolom target
POST /api/train           → Jalankan algoritma terpilih, return hasil pohon + rules
GET  /api/result/{id}     → Ambil hasil training (jika disimpan sementara)
```

---

## 5. Struktur Halaman/Komponen

### Halaman (Next.js Pages/Routes)
1. **`/` — Landing / Upload Page**
   - Komponen: `UploadForm`, `FilePreviewTable`
2. **`/configure` — Konfigurasi Kolom Target**
   - Komponen: `ColumnSelector`, `DataSummaryCard` (menampilkan tipe kolom, missing value)
3. **`/result` — Hasil Klasifikasi**
   - Komponen: `AlgorithmBadge` (menunjukkan ID3/C4.5 terpilih + alasan), `DecisionTreeViewer`, `RuleList` (aturan IF-THEN), `AccuracyCard` (opsional)

### Komponen Reusable
- `UploadForm` — drag & drop / pilih file CSV/Excel
- `FilePreviewTable` — tabel preview beberapa baris data
- `DataSummaryCard` — ringkasan tipe kolom & missing value
- `AlgorithmBadge` — label algoritma terpilih + tooltip alasan
- `DecisionTreeViewer` — visualisasi pohon keputusan
- `RuleList` — daftar aturan IF-THEN hasil ekstraksi pohon
- `LoadingState` — indikator saat proses training berjalan
