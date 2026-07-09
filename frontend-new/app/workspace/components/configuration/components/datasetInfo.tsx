import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UploadButton from "@/components/UploadButton";
import { CircleCheck, FileChartPieIcon, FileSpreadsheet } from "lucide-react";

export default function DatasetInfo() {
    return (
        <Card className="flex flex-row items-center justify-between p-6 w-full shadow-md">
            <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-green-100/50 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="text-green-600" size={26} />
                </div>

                <div className="flex flex-col items-start ">
                    <h2 className="font-semibold text-sm">Weather_info.csv</h2>
                    <p className="text-gray-600">14.5 KB</p>
                </div>
            </div>

            <div className="flex flex-row gap-8 items-center">
                <div className="flex flex-col items-center ">
                    <h1 className="font-semibold text-lg">146</h1>
                    <p className="text-gray-500">Rows</p>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col items-center ">
                    <h1 className="font-semibold text-lg">6</h1>
                    <p className="text-gray-500">Columns</p>
                </div>
                <Separator orientation="vertical" />
                <Badge variant={"ghost"} className="bg-green-100/50">
                    <CircleCheck className="text-green-500" />
                    Upload Succsesfully
                </Badge>
            </div>

            <UploadButton
                variant="change"
                onSelect={(file) => console.log(file)}
            />
        </Card>
    )
}