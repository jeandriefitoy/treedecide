import pandas as pd


def detect_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    return "categorical"


def analyze_columns(df: pd.DataFrame) -> list[dict]:
    results = []
    for col in df.columns:
        series = df[col]
        missing_count = int(series.isna().sum())
        missing_pct = (missing_count / len(df) * 100) if len(df) > 0 else 0.0
        results.append(
            {
                "name": str(col),
                "type": detect_column_type(series),
                "missing_count": missing_count,
                "missing_pct": round(missing_pct, 2),
                "unique_values": int(series.nunique(dropna=True)),
            }
        )
    return results


def has_missing_values(columns_info: list[dict]) -> bool:
    return any(col["missing_count"] > 0 for col in columns_info)


def has_numeric_columns(columns_info: list[dict]) -> bool:
    return any(col["type"] == "numeric" for col in columns_info)


def all_categorical(columns_info: list[dict]) -> bool:
    return all(col["type"] == "categorical" for col in columns_info)


def get_missing_columns(columns_info: list[dict]) -> list[dict]:
    return [
        {"name": col["name"], "missing_count": col["missing_count"]}
        for col in columns_info
        if col["missing_count"] > 0
    ]
