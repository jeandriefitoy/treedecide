import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UploadButton from "@/components/UploadButton";
import { CircleCheck, FileSpreadsheet, Loader2 } from "lucide-react";
import { useTreeStore } from "@/store/useTreeStore";
import { useDataset } from "../../../hooks/useDataset";

export default function DatasetInfo() {
    const { dataset } = useTreeStore();
    const { handleUpload, isLoading } = useDataset();

    if (!dataset) return null;

    const onFileChange = async (file: File) => {
        await handleUpload(file);
    };

    return (
        <Card className="flex flex-row items-center justify-between p-6 w-full shadow-md">
            <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-green-100/50 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="text-green-600" size={26} />
                </div>

                <div className="flex flex-col items-start ">
                    <h2 className="font-semibold text-sm">{dataset.filename}</h2>
                    <p className="text-gray-600 text-xs">CSV/Excel File</p>
                </div>
            </div>

            <div className="flex flex-row gap-8 items-center">
                <div className="flex flex-col items-center ">
                    <h1 className="font-semibold text-lg">{dataset.row_count}</h1>
                    <p className="text-gray-500">Rows</p>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col items-center ">
                    <h1 className="font-semibold text-lg">{dataset.column_count}</h1>
                    <p className="text-gray-500">Columns</p>
                </div>
                <Separator orientation="vertical" />
                <Badge variant={"ghost"} className="bg-green-100/50">
                    <CircleCheck className="text-green-500" />
                    Upload Successfully
                </Badge>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                    <Loader2 className="animate-spin text-primary" size={20} />
                    Processing...
                </div>
            ) : (
                <UploadButton
                    variant="change"
                    onSelect={onFileChange}
                />
            )}
        </Card>
    );
}