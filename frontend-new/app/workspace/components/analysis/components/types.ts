export type StepStatus = "done" | "in-progress" | "pending";

export interface ProcessingStep {
    id: string;
    label: string;
    status: StepStatus;
}

export interface DatasetInfo {
    fileName: string;
    rows: number;
    columns: number;
    target: string;
    algorithm: string;
    note?: string;
}