import pandas as pd


def preprocess(df: pd.DataFrame, target_column: str) -> pd.DataFrame:
    """
    Preprocessing dasar sebelum training:
    - Imputasi missing value (mode untuk kategorik, median untuk numerik)
    - Drop baris dengan target kosong
    """
    processed = df.copy()
    processed = processed.dropna(subset=[target_column])

    for col in processed.columns:
        if col == target_column:
            continue
        if processed[col].isna().any():
            if pd.api.types.is_numeric_dtype(processed[col]):
                processed[col] = processed[col].fillna(processed[col].median())
            else:
                mode = processed[col].mode()
                fill_value = mode.iloc[0] if not mode.empty else "unknown"
                processed[col] = processed[col].fillna(fill_value)

    return processed
