"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, CheckCircleIcon, Columns, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTreeStore } from "@/store/useTreeStore";

type ColumnType = "categorical" | "numeric" | "target";

type TypeStyle = {
    badge: string;
    name: string;
    label: string;
    typeText: string;
};

const typeStyles: { [key in ColumnType]: TypeStyle } = {
    categorical: {
        badge: "bg-blue-50 border border-blue-100 py-3 hover:bg-blue-50",
        name: "text-blue-600",
        label: "Categorical",
        typeText: "text-blue-400",
    },
    numeric: {
        badge: "bg-purple-50 border border-purple-100 py-3 hover:bg-purple-50",
        name: "text-purple-600",
        label: "Numeric",
        typeText: "text-purple-400",
    },
    target: {
        badge: "bg-green-50 border border-green-100 py-3 hover:bg-green-50",
        name: "text-green-600",
        label: "Target",
        typeText: "text-green-400",
    },
};

function ColumnBadge({ name, type }: { name: string, type: string }) {
    const style = typeStyles[type as ColumnType] || typeStyles.categorical;
    
    return (
        <Badge
            variant="outline"
            className={`rounded-full px-4 py-1.5 text-sm font-normal gap-1.5 ${style.badge}`}
        >
            <span className={`font-semibold ${style.name}`}>{name}</span>
            <span className="text-muted-foreground">·</span>
            <span className={style.typeText}>{style.label}</span>
        </Badge>
    );
}

export default function ColumnTypes() {
    const { dataset } = useTreeStore();

    if (!dataset) return null;

    const totalMissing = dataset.columns.reduce((sum, col) => sum + (col.missing_count || 0), 0);
    const hasNumeric = dataset.columns.some((col) => col.type === "numeric");

    return (
        <div className="flex flex-col gap-3 w-full">
            <Card className="p-6 shadow-md">
                <div className="flex flex-row gap-4 items-center mb-4">
                    <Columns className="text-green-500" />
                    <h1 className="font-semibold text-lg">Detected Column Types</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                    {dataset.columns.map((col) => (
                        <ColumnBadge key={col.name} name={col.name} type={col.type} />
                    ))}
                </div>
            </Card>

            {totalMissing > 0 ? (
                <Alert variant="destructive" className="w-full bg-red-50">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>{totalMissing} missing values detected</AlertTitle>
                    <AlertDescription>
                        TreeDecide will handle these automatically using the <strong>C4.5 algorithm</strong> — no action required from you.
                    </AlertDescription>
                </Alert>
            ) : hasNumeric ? (
                <Alert className="w-full border-blue-200 bg-blue-50 text-blue-800">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Numeric columns detected</AlertTitle>
                    <AlertDescription>
                        TreeDecide will use the <strong>C4.5 algorithm</strong> to handle numerical splits dynamically.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert className="w-full border-green-200 bg-green-50 text-green-800">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <AlertTitle>Clean categorical dataset</AlertTitle>
                    <AlertDescription>
                        TreeDecide will use the <strong>ID3 algorithm</strong> for optimal processing.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}