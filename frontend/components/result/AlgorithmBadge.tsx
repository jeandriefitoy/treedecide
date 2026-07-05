"use client";

import { useEffect, useState } from "react";
import { getResult } from "@/lib/api";
import LoadingState from "@/components/ui/LoadingState";

export default function AlgorithmBadge() {
  const [algorithm, setAlgorithm] = useState<"ID3" | "C4.5" | null>(null);
  const [reason, setReason] = useState<string>("Menunggu hasil training...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("treedecide_session");
    if (!sessionId) {
      setLoading(false);
      return;
    }
    getResult(sessionId)
      .then((res) => {
        setAlgorithm(res.algorithm);
        setReason(res.selection_reason);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Memuat algoritma terpilih..." />;

  const current = algorithm ?? "ID3";
  const isId3 = current === "ID3";

  return (
    <div
      className={`rounded-xl border p-6 ${
        isId3 ? "border-purple-200 bg-purple-50" : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            isId3 ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {current}
        </span>
        <span className="font-semibold text-gray-800">
          Algoritma Decision Tree Terpilih
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">{reason}</p>
    </div>
  );
}