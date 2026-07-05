"use client";

import { useEffect, useState } from "react";
import type { DetectResponse } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";

export default function DataSummaryCard() {
  const [detection, setDetection] = useState<DetectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("treedecide_detection");
    if (!stored) {
      setError("Tidak ada dataset. Silakan upload terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      setDetection(JSON.parse(stored) as DetectResponse);
    } catch {
      setError("Data deteksi tidak valid. Silakan upload ulang.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingState message="Memuat ringkasan deteksi..." />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!detection) return null;

  const missingMap = Object.fromEntries(
    detection.missing_columns.map((col) => [col.name, col.missing_count])
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Ringkasan Deteksi Otomatis</h2>
      <p className="mt-1 text-sm text-gray-500">
        File: {detection.filename} · {detection.row_count} baris ·{" "}
        {detection.column_count} kolom
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {detection.columns.map((col) => (
          <div
            key={col.name}
            className="rounded-lg border border-gray-100 bg-gray-50 p-4"
          >
            <p className="font-medium text-gray-800">{col.name}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span
                className={`rounded-full px-2 py-0.5 ${
                  col.type === "numeric"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {col.type === "numeric" ? "Numerik" : "Kategorik"}
              </span>
              {missingMap[col.name] !== undefined && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                  Missing: {missingMap[col.name]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-primary-50 p-4 text-sm text-primary-800">
        <strong>Rekomendasi: {detection.recommended_algorithm}</strong>
        <p className="mt-1">{detection.reason}</p>
      </div>
    </div>
  );
}
