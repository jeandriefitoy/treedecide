"use client";

import { useEffect, useState } from "react";
import { getResult } from "@/lib/api";

export default function AccuracyCard() {
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("treedecide_session");
    if (!sessionId) return;

    getResult(sessionId).then((res) => {
      if (res.accuracy !== undefined) setAccuracy(res.accuracy);
    });
  }, []);

  if (accuracy === null) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Akurasi Model</h2>
      <p className="mt-2 text-3xl font-bold text-primary-600">
        {(accuracy * 100).toFixed(1)}%
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Train/test split (fitur bonus)
      </p>
    </div>
  );
}
