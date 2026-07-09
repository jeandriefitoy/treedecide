// import { Button } from "@/components/ui/button";
import ColumnTypes from "./components/columnTypes";
import DatasetInfo from "./components/datasetInfo";
import DatasetPreview from "./components/datasetPreview";
import DatasetSummary from "./components/datasetSummary";
import TargetColumn from "./components/targetColumn";
// import { ArrowLeft } from "lucide-react";

interface ConfigureSectionProps {
    // onBack: () => void;
    onNext: () => void;
}

export default function ConfigureSection({
    // onBack,
    onNext,
}: ConfigureSectionProps) {
    return (
        <div className="flex flex-col gap-8 w-full">
            {/* <Button variant="ghost" onClick={onBack} className="items-start mr-auto items-center">
                <ArrowLeft />
                Back
            </Button> */}
            <DatasetInfo />
            <div className="flex flex-row w-full items-start gap-8 h-full">
                <DatasetPreview />
                <DatasetSummary />
            </div>

            <div className="flex flex-row w-full items-start gap-8">
                <ColumnTypes />
                <TargetColumn
                    // onBack={onBack}
                    onNext={onNext}
                />
            </div>
        </div>
    )
}