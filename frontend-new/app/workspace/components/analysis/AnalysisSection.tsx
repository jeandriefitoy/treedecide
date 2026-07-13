"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalyzingDataset } from "./components/analyzing-dataset";
import { useSimulatedAnalysis } from "./components/use-simulated-analysis";
import { useTreeStore } from "@/store/useTreeStore";
import { TreeService } from "@/services/treeService";

// interface AnalysisSectionProps {
//     onBack: () => void;
// }

export default function AnalysisSection() {
    const router = useRouter();
    const { dataset, targetColumn, setTreeResult } = useTreeStore();
    const [isApiDone, setIsApiDone] = useState(false);

    const { steps, progress, isComplete } = useSimulatedAnalysis(isApiDone);

    useEffect(() => {
        const runTraining = async () => {
            if (!dataset?.session_id) return;

            try {
                const resultData = await TreeService.train(dataset.session_id);

                setTreeResult(resultData);

                console.log("Train response:", resultData);
                console.log("Store:", useTreeStore.getState().treeResult);
            } catch (error) {
                console.error("Training gagal:", error);
            } finally {
                setIsApiDone(true);
            }
        };

        runTraining();
    }, [dataset?.session_id, setTreeResult]);

    useEffect(() => {
        if (!isComplete) return;

        const timeout = setTimeout(() => {
            router.push("/result");
        }, 500);

        return () => clearTimeout(timeout);
    }, [isComplete, router]);

    const totalMissing = dataset?.columns.reduce((sum, col) => sum + (col.missing_count || 0), 0) || 0;
    const hasNumeric = dataset?.columns.some((col) => col.type === "numeric");
    const algoName = (totalMissing > 0 || hasNumeric) ? "C4.5" : "ID3";
    const algoNote = algoName === "C4.5"
        ? "C4.5 selected due to numeric columns or missing values."
        : "ID3 selected for clean categorical dataset.";

    return (
        <AnalyzingDataset
            steps={steps}
            progress={progress}
            datasetInfo={{
                fileName: dataset?.filename || "dataset.csv",
                rows: dataset?.row_count || 0,
                columns: dataset?.column_count || 0,
                target: targetColumn || "Unknown",
                algorithm: `${algoName} (Auto)`,
                note: algoNote,
            }}
        />
    );
}