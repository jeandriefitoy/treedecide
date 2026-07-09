"use client";

import { useEffect, useState } from "react";
import type { ProcessingStep } from "./types";

const STEP_LABELS = [
    "Reading Dataset",
    "Detecting Column Types",
    "Checking Missing Values",
    "Selecting Best Algorithm",
    "Building Decision Tree",
    "Generating IF-THEN Rules",
];

export function useSimulatedAnalysis(stepDurationMs = 1400) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const totalSteps = STEP_LABELS.length;

    useEffect(() => {
        if (activeIndex >= totalSteps) return;

        const timeout = setTimeout(() => {
            setActiveIndex((prev) => prev + 1);
        }, stepDurationMs);

        return () => clearTimeout(timeout);
    }, [activeIndex, stepDurationMs, totalSteps]);

    useEffect(() => {
        const target = Math.min(100, Math.round((activeIndex / totalSteps) * 100));

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= target) return prev;
                return Math.min(target, prev + 1);
            });
        }, 12);

        return () => clearInterval(interval);
    }, [activeIndex, totalSteps]);

    const steps: ProcessingStep[] = STEP_LABELS.map((label, index) => {
        let status: ProcessingStep["status"] = "pending";
        if (index < activeIndex) status = "done";
        if (index === activeIndex) status = "in-progress";

        return { id: `step-${index}`, label, status };
    });

    const isComplete = activeIndex >= totalSteps;

    return { steps, progress: isComplete ? 100 : progress, isComplete };
}