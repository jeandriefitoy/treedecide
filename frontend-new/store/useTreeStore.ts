import { create } from 'zustand';

interface ColumnInfo {
    name: string;
    type: "categorical" | "numeric";
    missing_count: number;
    missing_pct: number;
    unique_values: number;
}

type DatasetRow = Record<string, unknown>;

interface DatasetResponse {
    session_id: string;
    filename: string;
    row_count: number;
    column_count: number;
    columns: ColumnInfo[];
    preview: DatasetRow[];
}

export interface TreeNode {
    name?: string;
    is_leaf?: boolean;
    class_label?: string;
    children?: TreeNode[];
}

export interface TreeResult {
    session_id: string;
    algorithm: string;
    selection_reason: string;
    tree: TreeNode;
    rules: string[];
    accuracy: number | null;
}

interface TreeStore {
    dataset: DatasetResponse | null;
    targetColumn: string | null;
    treeResult: TreeResult | null; 
    setDataset: (data: DatasetResponse) => void;
    setTargetColumn: (target: string) => void;
    setTreeResult: (result: TreeResult) => void; 
    clearDataset: () => void;
}

export const useTreeStore = create<TreeStore>((set) => ({
    dataset: null,
    targetColumn: null,
    treeResult: null,
    setDataset: (data) => set({ dataset: data }),
    setTargetColumn: (target) => set({ targetColumn: target }),
    setTreeResult: (result) => set({ treeResult: result }),
    clearDataset: () => set({ dataset: null, targetColumn: null, treeResult: null }),
}));