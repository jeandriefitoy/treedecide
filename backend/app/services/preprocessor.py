import pandas as pd

def remove_identifier_columns(
    df: pd.DataFrame,
    target_column: str,
) -> tuple[pd.DataFrame, list[str]]:
    """
    Menghapus kolom yang diduga sebagai identifier.

    Kriteria:
    - Nama kolom mengandung kata ID, kode, nomor, dll.
    - ATAU hampir semua nilainya unik (>95%).
    """

    processed = df.copy()
    dropped_columns = []

    identifier_keywords = [
        "id",
        "kode",
        "code",
        "nomor",
        "no",
        "uuid",
        "nik",
        "nip",
        "email",
        "username",
    ]

    total_rows = len(processed)

    for column in processed.columns:
        if column == target_column:
            continue

        column_lower = column.lower()

        has_identifier_name = any(
            keyword in column_lower
            for keyword in identifier_keywords
        )

        unique_ratio = (
            processed[column].nunique(dropna=True) / total_rows
            if total_rows > 0
            else 0
        )

        has_high_uniqueness = unique_ratio >= 0.95

        if has_identifier_name or has_high_uniqueness:
            dropped_columns.append(column)

    processed = processed.drop(columns=dropped_columns)

    return processed, dropped_columns


def preprocess(df: pd.DataFrame, target_column: str) -> pd.DataFrame:
    """
    Preprocessing dasar sebelum training:
    - Drop baris dengan target kosong
    - Drop identifier
    - Imputasi missing value
    """
    processed = df.copy()
    processed = processed.dropna(subset=[target_column])

    processed, dropped_columns = remove_identifier_columns(
        processed,
        target_column,
    )

    if dropped_columns:
        print(f"[Preprocessor] Identifier columns removed: {dropped_columns}")

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
