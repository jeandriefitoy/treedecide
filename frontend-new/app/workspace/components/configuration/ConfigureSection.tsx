"use client";

import { useTreeStore } from "@/store/useTreeStore";

import ColumnTypes from "./components/columnTypes";
import DatasetInfo from "./components/datasetInfo";
import DatasetPreview from "./components/datasetPreview";
import DatasetSummary from "./components/datasetSummary";
import TargetColumn from "./components/targetColumn";

interface ConfigureSectionProps {
    onBack: () => void;
    onNext: () => void;
}

export default function ConfigureSection({
    onBack,
    onNext,
}: ConfigureSectionProps) {
    const { dataset } = useTreeStore();

    return (
        <div className="flex flex-col gap-8 w-full">
            <DatasetInfo />

            <div className="flex flex-row w-full items-start gap-8 h-full">
                <DatasetPreview
                    key={dataset?.session_id}
                />
                <DatasetSummary />
            </div>

            <div className="flex flex-row w-full items-start gap-8">
                <ColumnTypes />
                <TargetColumn
                    onBack={onBack}
                    onNext={onNext}
                />
            </div>
        </div>
    );
}