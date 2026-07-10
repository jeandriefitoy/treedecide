"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CircleAlert, Play, Loader2 } from "lucide-react";
import { useTreeStore } from "@/store/useTreeStore";
import { TreeService } from "@/services/treeService";

interface TargetColumnProps {
    onBack?: () => void;
    onNext: () => void;
}

export default function TargetColumn({ onNext }: TargetColumnProps) {
    const { dataset, setTargetColumn } = useTreeStore();
    const [target, setTarget] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    if (!dataset) return null;

    const selectedColumn = dataset.columns.find((col) => col.name === target);

    const handleAnalyze = async () => {
        if (!target || !dataset.session_id) return;

        setIsLoading(true);
        try {
            await TreeService.selectTarget(dataset.session_id, target);
            setTargetColumn(target);
            onNext();
        } catch (error) {
            console.error("Gagal memilih target:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <Card className="p-6 flex flex-col gap-4 shadow-md">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-sm font-semibold">Target Column</h1>
                    <p className="text-gray-500 text-sm">Select the column you want the model to predict.</p>
                </div>

                <Select
                    value={target}
                    onValueChange={(value) => setTarget(value ?? "")}
                >
                    <SelectTrigger className="w-full py-5 shadow-sm">
                        <SelectValue placeholder="Select a column..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Dataset Columns</SelectLabel>
                            {dataset.columns.map((col) => (
                                <SelectItem key={col.name} value={col.name}>
                                    {col.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {selectedColumn && (
                    <Alert className="w-full border-green-200 bg-green-50 text-green-800">
                        <CircleAlert className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            This column is <strong>{selectedColumn.type}</strong> with{" "}
                            <strong>{selectedColumn.unique_values || 0}</strong> unique values.
                        </AlertDescription>
                    </Alert>
                )}
            </Card>

            <Button
                variant="default"
                size="lg"
                className="w-full py-6 rounded-xl gap-4 cursor-pointer text-md"
                onClick={handleAnalyze}
                disabled={!target || isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Play fill="currentColor" className="h-5 w-5" />
                )}
                {isLoading ? "Preparing..." : "Analyze Dataset"}
            </Button>
            <p className="text-gray-500 text-xs text-center mt-1">
                Algorithm will be selected automatically based on your data.
            </p>
        </div>
    );
}