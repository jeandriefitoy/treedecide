"use client";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";

import StepProgress from "./components/StepProgress";
import UploadSection from "./components/upload/UploadSection";
import ConfigureSection from "./components/configuration/ConfigureSection";
// import AnalysisSection from "./components/analysis/AnalysisSection";

export default function Workspace() {
    const [currentStep, setCurrentStep] = useState(1);

    if (currentStep === 3) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                {/* <AnalysisSection onBack={() => setCurrentStep(2)} /> */}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-8">
            <div className="flex items-center justify-between gap-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold">
                        Workspace
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Upload your dataset and configure the classification target before analysis.
                    </p>
                </div>

                <div className="w-full max-w-xl">
                    <StepProgress currentStep={currentStep} />
                </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-center">
                    {currentStep === 1 && (
                        <UploadSection
                            onNext={() => setCurrentStep(2)}
                        />
                    )}
                </div>

                {currentStep === 2 && (
                    <ConfigureSection
                        // onBack={() => setCurrentStep(1)}
                        onNext={() => setCurrentStep(3)}
                    />
                )}
            </div>
        </div>
    );
}