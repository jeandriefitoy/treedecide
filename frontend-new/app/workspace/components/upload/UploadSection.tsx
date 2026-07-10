"use client";

import { useState, useCallback } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadButton from "@/components/UploadButton";
import { useDataset } from "../../hooks/useDataset";
import { useTreeStore } from "@/store/useTreeStore";

interface FileUploadProps {
    onNext: () => void;
}

export default function FileUpload({ onNext }: FileUploadProps) {
    const { handleUpload, isLoading } = useDataset();
    const { dataset } = useTreeStore();
    const [isDragging, setIsDragging] = useState(false);

    const processFile = useCallback(
        async (file: File) => {
            const result = await handleUpload(file);

            if (result) {
                onNext();
            }
        },
        [handleUpload, onNext]
    );

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await processFile(file);
        }
    }, [processFile]);

    return (
        <Card className="w-full max-w-5xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle>Upload Dataset</CardTitle>
                    <CardDescription>
                        Upload your dataset in CSV or Excel format to begin the analysis process.
                    </CardDescription>
                </div>

                <UploadButton
                    variant="default"
                    onSelect={processFile}
                />
            </CardHeader>

            <CardContent>
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`
                        flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:bg-muted/50'}
                        ${isLoading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mb-4 h-12 w-12 text-primary animate-spin" />
                            <h3 className="text-lg font-semibold">Uploading & Analyzing...</h3>
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Please wait while we process your dataset.
                            </p>
                        </>
                    ) : (
                        <>
                            <UploadCloud className={`mb-4 h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <h3 className="text-lg font-semibold">
                                {isDragging ? 'Drop file here!' : 'Drag & Drop your dataset'}
                            </h3>
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Drop your CSV or Excel file here, or click the
                                <span className="font-medium text-primary"> Browse File </span>
                                button above.
                            </p>
                            <p className="mt-4 text-xs text-muted-foreground">
                                Supported formats: CSV (.csv), Excel (.xlsx)
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={() => {
                            if (dataset) onNext();
                        }}
                        disabled={isLoading || !dataset}
                    >
                        {isLoading ? "Processing..." : "Continue"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}