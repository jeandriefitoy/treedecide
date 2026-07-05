import pandas as pd

from app.services.algorithm_selector import select_algorithm
from app.services.column_detector import analyze_columns, get_missing_columns


def run_detection(
    df: pd.DataFrame,
    filename: str,
    exclude_target: str | None = None,
) -> dict:
    columns_info = analyze_columns(df)
    algorithm, reason = select_algorithm(columns_info, exclude_target=exclude_target)

    return {
        "filename": filename,
        "row_count": len(df),
        "column_count": len(df.columns),
        "columns": [
            {"name": col["name"], "type": col["type"]} for col in columns_info
        ],
        "missing_columns": get_missing_columns(columns_info),
        "recommended_algorithm": algorithm,
        "reason": reason,
    }
