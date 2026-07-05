# TreeDecide Frontend

Next.js (App Router) + Tailwind CSS

## Struktur Folder

```
frontend/
├── app/                        # App Router pages
│   ├── layout.tsx              # Root layout + navbar
│   ├── page.tsx                # / — Landing & upload
│   ├── globals.css             # Tailwind imports
│   ├── configure/
│   │   └── page.tsx            # /configure — pilih kolom target
│   └── result/
│       └── page.tsx            # /result — pohon & aturan IF-THEN
├── components/
│   ├── upload/
│   │   ├── UploadForm.tsx      # Drag & drop upload CSV/Excel
│   │   └── FilePreviewTable.tsx
│   ├── configure/
│   │   ├── ColumnSelector.tsx  # Pilih kolom target
│   │   └── DataSummaryCard.tsx # Ringkasan tipe & missing value
│   ├── result/
│   │   ├── AlgorithmBadge.tsx  # Label ID3/C4.5 + alasan
│   │   ├── DecisionTreeViewer.tsx
│   │   ├── RuleList.tsx        # Aturan IF-THEN
│   │   └── AccuracyCard.tsx    # Metrik akurasi (bonus)
│   └── ui/
│       └── LoadingState.tsx
├── lib/
│   ├── api.ts                  # Fetch wrapper ke FastAPI
│   └── types.ts                # TypeScript interfaces
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Menjalankan

```bash
npm install
cp .env.local.example .env.local
npm run dev
```
