"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProcessingStep, StepStatus } from "./types";

function StepIcon({ status }: { status: StepStatus }) {
    if (status === "done") {
        return (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
        );
    }

    if (status === "in-progress") {
        return (
            <span className="relative flex h-6 w-6 items-center justify-center">
                <motion.span
                    className="absolute h-6 w-6 rounded-full bg-emerald-400/40"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </span>
            </span>
        );
    }

    return <div className="h-6 w-6 rounded-full border-2 border-slate-200 bg-white" />;
}

function StepRow({ step }: { step: ProcessingStep }) {
    const isDone = step.status === "done";
    const isActive = step.status === "in-progress";

    let labelClass = "text-slate-400 font-medium";
    if (isDone) labelClass = "text-slate-900 font-medium";
    if (isActive) labelClass = "text-emerald-600 font-semibold";

    return (
        <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-3">
                <StepIcon status={step.status} />
                <span className={`text-sm ${labelClass}`}>{step.label}</span>
            </div>
            {isActive && (
                <span className="text-xs font-medium text-emerald-500">In progress...</span>
            )}
        </div>
    );
}

interface ProcessingStepsCardProps {
    steps: ProcessingStep[];
    progress: number;
}

export function ProcessingStepsCard({ steps, progress }: ProcessingStepsCardProps) {
    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Processing Steps</h2>
                <Badge className="border-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
                    {progress}%
                </Badge>
            </div>

            <Progress value={progress} className="mb-6 h-2" />

            <div className="flex flex-col">
                {steps.map((step) => (
                    <StepRow key={step.id} step={step} />
                ))}
            </div>
        </Card>
    );
}