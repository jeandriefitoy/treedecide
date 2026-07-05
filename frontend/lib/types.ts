export type ColumnType = "categorical" | "numeric";

export interface ColumnInfo {
  name: string;
  type: ColumnType;
  missing_count: number;
  missing_pct: number;
  unique_values: number;
}

export interface UploadResponse {
  session_id: string;
  filename: string;
  row_count: number;
  column_count: number;
  columns: ColumnInfo[];
  preview: Record<string, unknown>[];
}

export interface ColumnTypeInfo {
  name: string;
  type: ColumnType;
}

export interface MissingColumnInfo {
  name: string;
  missing_count: number;
}

export interface DetectResponse {
  filename: string;
  row_count: number;
  column_count: number;
  columns: ColumnTypeInfo[];
  missing_columns: MissingColumnInfo[];
  recommended_algorithm: "ID3" | "C4.5";
  reason: string;
}

export interface SelectTargetResponse {
  session_id: string;
  target_column: string;
  recommended_algorithm: "ID3" | "C4.5";
  reason: string;
}

export interface TreeNode {
  name: string;
  attribute?: string;
  children?: TreeNode[];
  is_leaf?: boolean;
  class_label?: string;
}

export interface TrainResponse {
  session_id: string;
  algorithm: "ID3" | "C4.5";
  selection_reason: string;
  tree: TreeNode;
  rules: string[];
  accuracy?: number;
}

export interface ApiError {
  detail: string;
}
