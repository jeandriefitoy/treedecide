"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, ChartColumnBig, Columns, Hash, Rows, Tag } from "lucide-react";
import { useTreeStore } from "@/store/useTreeStore";

export default function DatasetSummary(){
    const { dataset } = useTreeStore();

    if (!dataset) return null;

    const numericCount = dataset.columns.filter((col) => col.type === "numeric").length;
    const categoricalCount = dataset.columns.filter((col) => col.type === "categorical").length;
    
    const totalMissing = dataset.columns.reduce((sum, col) => sum + (col.missing_count || 0), 0);

    return (
        <Card className="p-6 flex flex-col gap-3 w-full max-w-sm shadow-md">
            <div className="flex flex-row gap-3 items-center mb-3">
                <ChartColumnBig className="text-green-500" />
                <h1 className="text-lg font-semibold">Dataset Summary</h1>
            </div>

            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Rows className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Total Rows</h1>
                </div>
                <h1 className="text-lg font-semibold">{dataset.row_count}</h1>
            </div>
            
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Columns className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Total Columns</h1>
                </div>
                <h1 className="text-lg font-semibold">{dataset.column_count}</h1>
            </div>
            
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Hash className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Numeric Columns</h1>
                </div>
                <h1 className="text-lg font-semibold">{numericCount}</h1>
            </div>
            
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Tag className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Categorical Columns</h1>
                </div>
                <h1 className="text-lg font-semibold">{categoricalCount}</h1>
            </div>
            
            <div className="w-full flex flex-row items-center justify-between py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <AlertCircle className={totalMissing > 0 ? "text-red-500" : "text-green-500"} size={22}/>
                    <h1 className="text-gray-500 text-sm">Missing Values</h1>
                </div>
                <h1 className={`text-lg font-semibold ${totalMissing > 0 ? "text-red-500" : "text-green-500"}`}>
                    {totalMissing}
                </h1>
            </div>
        </Card>
    )
}