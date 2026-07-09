"use client";

import { AnalyzingDataset } from "./components/analyzing-dataset";
import { useSimulatedAnalysis } from "./components/use-simulated-analysis";

export default function AnalyzingSection() {
    const { steps, progress } = useSimulatedAnalysis();

    return (
        <AnalyzingDataset
            steps={steps}
            progress={progress}
            datasetInfo={{
                fileName: "weather_dataset.csv",
                rows: 148,
                columns: 6,
                target: "PlayTennis",
                algorithm: "C4.5 (auto)",
                note: "C4.5 selected due to numeric columns and missing values.",
            }}
        />
    );
}