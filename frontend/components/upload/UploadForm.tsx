"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { uploadDataset, detectDataset } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";
import FilePreviewTable from "./FilePreviewTable";
import LoadingState from "@/components/ui/LoadingState";

export default function UploadForm() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExt = [".csv", ".xlsx", ".xls"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(file.type) && !validExt.includes(ext)) {
      setError("Format tidak didukung. Gunakan file .csv atau .xlsx");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [result, detection] = await Promise.all([
        uploadDataset(file),
        detectDataset(file),
      ]);
      setUploadResult(result);
      sessionStorage.setItem("treedecide_session", result.session_id);
      sessionStorage.setItem("treedecide_detection", JSON.stringify(detection));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 bg-white"
        }`}
      >
        <p className="text-lg font-medium text-gray-700">
          Drag & drop file CSV/Excel di sini
        </p>
        <p className="mt-1 text-sm text-gray-500">atau</p>
        <label className="mt-4 inline-block cursor-pointer rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700">
          Pilih File
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      </div>

      {loading && <LoadingState message="Mengunggah dan memproses dataset..." />}
      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {uploadResult && (
        <>
          <FilePreviewTable
            preview={uploadResult.preview}
            columns={uploadResult.columns.map((c) => c.name)}
          />
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/configure")}
              className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
            >
              Lanjut ke Konfigurasi →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
