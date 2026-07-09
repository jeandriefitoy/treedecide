"use client";

import { Card } from "@/components/ui/card";
import { FileText, Rows3, Columns, Target, Cpu, Info } from "lucide-react";
import type { DatasetInfo } from "./types";

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

export function DatasetInfoCard({ info }: { info: DatasetInfo }) {
    return (
        <Card className="p-6">
            <h2 className="mb-5 font-semibold">Dataset Info</h2>

            <div className="flex flex-col gap-4">
                <InfoRow icon={<FileText className="h-4 w-4" />} label="Dataset" value={info.fileName} />
                <InfoRow icon={<Rows3 className="h-4 w-4" />} label="Rows" value={String(info.rows)} />
                <InfoRow icon={<Columns className="h-4 w-4" />} label="Columns" value={String(info.columns)} />
                <InfoRow icon={<Target className="h-4 w-4" />} label="Target" value={info.target} />
                <InfoRow icon={<Cpu className="h-4 w-4" />} label="Algorithm" value={info.algorithm} />
            </div>

            {info.note && (
                <div className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <p>{info.note}</p>
                </div>
            )}
        </Card>
    );
}