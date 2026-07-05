from typing import Literal

from pydantic import BaseModel


class ColumnInfo(BaseModel):
    name: str
    type: Literal["categorical", "numeric"]
    missing_count: int
    missing_pct: float
    unique_values: int


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    row_count: int
    column_count: int
    columns: list[ColumnInfo]
    preview: list[dict]


class SessionRequest(BaseModel):
    session_id: str


class SelectTargetRequest(BaseModel):
    session_id: str
    target_column: str


class ColumnTypeInfo(BaseModel):
    name: str
    type: Literal["categorical", "numeric"]


class MissingColumnInfo(BaseModel):
    name: str
    missing_count: int


class DetectResponse(BaseModel):
    filename: str
    row_count: int
    column_count: int
    columns: list[ColumnTypeInfo]
    missing_columns: list[MissingColumnInfo]
    recommended_algorithm: Literal["ID3", "C4.5"]
    reason: str


class SelectTargetResponse(BaseModel):
    session_id: str
    target_column: str
    recommended_algorithm: Literal["ID3", "C4.5"]
    reason: str


class TreeNodeSchema(BaseModel):
    name: str
    attribute: str | None = None
    children: list["TreeNodeSchema"] | None = None
    is_leaf: bool = False
    class_label: str | None = None


class TrainResponse(BaseModel):
    session_id: str
    algorithm: Literal["ID3", "C4.5"]
    selection_reason: str
    tree: TreeNodeSchema
    rules: list[str]
    accuracy: float | None = None


TreeNodeSchema.model_rebuild()
