"use client";

import { useEffect, useMemo, useState } from "react";
import { getResult } from "@/lib/api";
import LoadingState from "@/components/ui/LoadingState";

interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

interface ParsedRule {
  raw: string;
  conditions: Condition[];
  outcome: string;
}

function parseRule(rule: string): ParsedRule {
  const match = rule.match(/^IF\s+(.*?)\s+THEN\s+(.*)$/i);
  if (!match) return { raw: rule, conditions: [], outcome: rule };
  const [, condsStr, outcome] = match;
  const conditions = condsStr.split(/\s+AND\s+/i).map((cond) => {
    const m = cond.match(/^(.+?)\s*(<=|>=|<|>|=)\s*(.+)$/);
    if (!m) return { attribute: cond, operator: "", value: "" };
    return {
      attribute: m[1].trim(),
      operator: m[2],
      value: m[3].replace(/'/g, "").trim(),
    };
  });
  return { raw: rule, conditions, outcome: outcome.trim() };
}

const OUTCOME_COLORS = [
  { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
];

export default function RuleList() {
  const [rules, setRules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sessionId = sessionStorage.getItem("treedecide_session");
    if (!sessionId) {
      setLoading(false);
      return;
    }
    getResult(sessionId)
      .then((res) => setRules(res.rules))
      .finally(() => setLoading(false));
  }, []);

  const parsedRules = useMemo(() => rules.map(parseRule), [rules]);

  // Assign warna berbeda untuk tiap outcome unik, otomatis (tidak hardcode label)
  const outcomeColorMap = useMemo(() => {
    const map: Record<string, (typeof OUTCOME_COLORS)[number]> = {};
    let i = 0;
    parsedRules.forEach((r) => {
      if (!map[r.outcome]) {
        map[r.outcome] = OUTCOME_COLORS[i % OUTCOME_COLORS.length];
        i++;
      }
    });
    return map;
  }, [parsedRules]);

  const grouped = useMemo(() => {
    const filtered = parsedRules.filter((r) =>
      r.raw.toLowerCase().includes(search.toLowerCase())
    );
    const groups: Record<string, ParsedRule[]> = {};
    filtered.forEach((r) => {
      groups[r.outcome] = groups[r.outcome] ?? [];
      groups[r.outcome].push(r);
    });
    return groups;
  }, [parsedRules, search]);

  if (loading) return <LoadingState message="Memuat aturan IF-THEN..." />;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Aturan IF-THEN</h2>
        <span className="text-sm text-gray-500">{rules.length} aturan</span>
      </div>

      {rules.length === 0 ? (
        <p className="mt-4 text-gray-500">Belum ada aturan.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Cari aturan (misal: Kelembaban, Ya, Hujan)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />

          <div className="mt-4 space-y-4">
            {Object.entries(grouped).map(([outcome, rulesInGroup]) => {
              const color = outcomeColorMap[outcome] ?? OUTCOME_COLORS[0];
              return (
                <details key={outcome} open className="group">
                  <summary className="mb-2 flex cursor-pointer list-none items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${color.bg} ${color.text} ${color.border}`}>
                      THEN {outcome}
                    </span>
                    <span className="text-xs text-gray-400">{rulesInGroup.length} aturan</span>
                  </summary>

                  <div className="space-y-2 pl-6">
                    {rulesInGroup.map((rule, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2.5 text-sm"
                      >
                        {rule.conditions.map((cond, j) => (
                          <span key={j} className="flex items-center gap-1.5">
                            {j > 0 && (
                              <span className="text-xs font-semibold text-gray-400">AND</span>
                            )}
                            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-700">
                              <span className="font-semibold text-gray-900">{cond.attribute}</span>{" "}
                              <span className="text-primary-600">{cond.operator}</span> {cond.value}
                            </span>
                          </span>
                        ))}
                        <span className="mx-1 text-gray-400">→</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color.bg} ${color.text}`}>
                          {outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}