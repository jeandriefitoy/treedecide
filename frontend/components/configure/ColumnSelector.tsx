"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { selectTarget, trainModel } from "@/lib/api";
import type { DetectResponse } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";

export default function ColumnSelector() {
  const router = useRouter();
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState("");
  const [algorithm, setAlgorithm] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("treedecide_detection");
    if (!stored) return;

    const detection = JSON.parse(stored) as DetectResponse;
    setColumns(detection.columns.map((c) => c.name));
    setAlgorithm(detection.recommended_algorithm);
    setReason(detection.reason);
  }, []);

  const handleTrain = async () => {
    const sessionId = sessionStorage.getItem("treedecide_session");
    if (!sessionId || !targetColumn) {
      setError("Pilih kolom target terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await selectTarget(sessionId, targetColumn);
      setAlgorithm(result.recommended_algorithm);
      setReason(result.reason);
      await trainModel(sessionId);
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Training gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Pilih Kolom Target</h2>
      <p className="mt-1 text-sm text-gray-500">
        Kolom target adalah label klasifikasi yang ingin diprediksi.
      </p>

      <select
        value={targetColumn}
        onChange={(e) => setTargetColumn(e.target.value)}
        className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2"
      >
        <option value="">— Pilih kolom —</option>
        {columns.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      {algorithm && reason && (
        <div className="mt-4 rounded-lg bg-primary-50 p-4 text-sm text-primary-800">
          <strong>Algoritma terpilih: {algorithm}</strong>
          <p className="mt-1">{reason}</p>
        </div>
      )}

      {loading && <LoadingState message="Menjalankan algoritma Decision Tree..." />}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <button
        onClick={handleTrain}
        disabled={!targetColumn || loading}
        className="mt-6 rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
      >
        Jalankan Training →
      </button>
    </div>
  );
}
