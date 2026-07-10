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

export function useSimulatedAnalysis(isApiDone: boolean, stepDurationMs = 1200) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const totalSteps = STEP_LABELS.length;

    useEffect(() => {
        if (activeIndex >= totalSteps) return;

        if (activeIndex === totalSteps - 1 && !isApiDone) {
            return;
        }

        const currentDelay = (activeIndex === totalSteps - 1 && isApiDone) ? 400 : stepDurationMs;

        const timeout = setTimeout(() => {
            setActiveIndex((prev) => prev + 1);
        }, currentDelay);

        return () => clearTimeout(timeout);
    }, [activeIndex, stepDurationMs, totalSteps, isApiDone]);

    useEffect(() => {
        let target = Math.round(((activeIndex + 1) / (totalSteps + 1)) * 100);

        if (!isApiDone) {
            target = Math.min(95, target);
        } else if (activeIndex >= totalSteps) {
            target = 100;
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= target) return prev;
                return Math.min(target, prev + 1);
            });
        }, 15);

        return () => clearInterval(interval);
    }, [activeIndex, totalSteps, isApiDone]);

    const steps: ProcessingStep[] = STEP_LABELS.map((label, index) => {
        let status: ProcessingStep["status"] = "pending";
        if (index < activeIndex) status = "done";
        if (index === activeIndex) status = "in-progress";

        return { id: `step-${index}`, label, status };
    });

    const isComplete = activeIndex >= totalSteps && isApiDone && progress === 100;

    return { steps, progress, isComplete };
}