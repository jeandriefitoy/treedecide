import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, Columns } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ColumnType = "categorical" | "numeric" | "target";

interface ColumnInfo {
    name: string;
    type: ColumnType;
}

const columns: ColumnInfo[] = [
    { name: "Outlook", type: "categorical" },
    { name: "Temperature", type: "numeric" },
    { name: "Humidity", type: "numeric" },
    { name: "Wind", type: "categorical" },
    { name: "PlayTennis", type: "target" },
];

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

function ColumnBadge({ name, type }: ColumnInfo) {
    const style = typeStyles[type];
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
    return (
        <div className="flex flex-col gap-3 w-full">
            <Card className="p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                    <Columns className="text-green-500" />
                    <h1 className="font-semibold text-lg">Detected Column Types</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                    {columns.map((col) => (
                        <ColumnBadge key={col.name} name={col.name} type={col.type} />
                    ))}
                </div>
            </Card>

            <Alert variant="destructive" className="w-full">
                <AlertCircleIcon />
                <AlertTitle>3 missing values detected</AlertTitle>
                <AlertDescription>
                    TreeDecide will handle these automatically using the C4.5 algorithm — no action required from you.
                </AlertDescription>
            </Alert>
        </div>
    );
}