import { Card } from "@/components/ui/card";
import { AlertCircle, ChartColumnBig, Columns, Hash, Rows, Tag } from "lucide-react";

export default function DatasetSummary(){
    return (
        <Card className="p-6 flex gap-3 w-lg shadow-md ">
            <div className="flex flex-row gap-3 items-center mb-3">
                <ChartColumnBig className="text-green-500" />
                <h1 className="text-lg font-semibold">Dataset Summary</h1>
            </div>

            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Rows className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Total Rows</h1>
                </div>
                <h1 className="text-lg font-semibold">146</h1>
            </div>
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Columns className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Total Columns</h1>
                </div>
                <h1 className="text-lg font-semibold">6</h1>
            </div>
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Hash className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Numeric Columns</h1>
                </div>
                <h1 className="text-lg font-semibold">146</h1>
            </div>
            <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <Tag className="text-gray-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Categorical Column</h1>
                </div>
                <h1 className="text-lg font-semibold">146</h1>
            </div>
            <div className="w-full flex flex-row items-center justify-between py-3 px-2">
                <div className="flex flex-row gap-3 items-center">
                    <AlertCircle className="text-red-500" size={22}/>
                    <h1 className="text-gray-500 text-sm">Missing Values</h1>
                </div>
                <h1 className="text-lg font-semibold text-red-500">146</h1>
            </div>
        </Card>
    )
}