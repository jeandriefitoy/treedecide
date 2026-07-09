"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: "Upload" },
  { id: 2, title: "Configure" },
  { id: 3, title: "Analysis" },
];

export default function StepProgress({
  currentStep,
}: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = step.id < currentStep;
          const current = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center",
                index !== steps.length - 1 && "flex-1"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    completed &&
                      "border-primary bg-primary text-primary-foreground",
                    current &&
                      "border-primary bg-background text-primary",
                    !completed &&
                      !current &&
                      "border-muted-foreground/30 bg-muted text-muted-foreground"
                  )}
                >
                  {completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>

                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    (completed || current)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "mx-6 h-0.5 flex-1 rounded-full transition-colors",
                    completed ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}