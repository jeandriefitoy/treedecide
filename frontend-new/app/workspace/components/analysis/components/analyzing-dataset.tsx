"use client";

import { AlertCircle } from "lucide-react";
import { AnimatedTreeIcon } from "./animated-tree-icon";
import { ProcessingStepsCard } from "./processing-steps";
import { DatasetInfoCard } from "./dataset-info";
import type { ProcessingStep, DatasetInfo } from "./types";

interface AnalyzingDatasetProps {
    steps: ProcessingStep[];
    progress: number;
    datasetInfo: DatasetInfo;
}

export function AnalyzingDataset({ steps, progress, datasetInfo }: AnalyzingDatasetProps) {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10">
            <AnimatedTreeIcon />

            <h1 className="mt-6 text-2xl font-bold text-slate-900">Analyzing Dataset</h1>
            <p className="mt-1 text-sm text-slate-500">
                TreeDecide is preparing your Decision Tree. This may take a few seconds.
            </p>

            <div className="mt-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <ProcessingStepsCard steps={steps} progress={progress} />
                <DatasetInfoCard info={datasetInfo} />
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Please do not close this page while processing.</span>
            </div>
        </div>
    );
}