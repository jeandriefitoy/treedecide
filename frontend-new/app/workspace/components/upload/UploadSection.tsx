"use client";

import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import UploadButton from "@/components/UploadButton";

interface FileUploadProps {
    onNext: () => void;
}

export default function FileUpload({
    onNext,
}: FileUploadProps) {
    return (
        <Card className="w-full max-w-5xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle>
                        Upload Dataset
                    </CardTitle>

                    <CardDescription>
                        Upload your dataset in CSV or Excel format to begin
                        the analysis process.
                    </CardDescription>
                </div>

                <UploadButton
                    variant="default"
                    onSelect={(file) => console.log(file)}
                    />
            </CardHeader>

            <CardContent>
                <div
                    className="
                        flex
                        h-72
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border-2
                        border-dashed
                        border-border
                        bg-muted/30
                        transition-colors
                        hover:bg-muted/50
                    "
                >
                    <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />

                    <h3 className="text-lg font-semibold">
                        Drag & Drop your dataset
                    </h3>

                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Drop your CSV or Excel file here, or click the
                        <span className="font-medium text-primary">
                            {" "}
                            Browse File{" "}
                        </span>
                        button above.
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground">
                        Supported formats: CSV (.csv), Excel (.xlsx)
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={onNext}>
                        Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}