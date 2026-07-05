import io
from pathlib import Path

import pandas as pd

SUPPORTED_EXTENSIONS = (".csv", ".xlsx", ".xls")


def get_file_suffix(filename: str) -> str:
    return filename[filename.rfind(".") :].lower()


def validate_file_extension(filename: str) -> str:
    suffix = get_file_suffix(filename)
    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Format file tidak didukung: {suffix}")
    return suffix


def parse_bytes(content: bytes, filename: str) -> pd.DataFrame:
    suffix = validate_file_extension(filename)
    buffer = io.BytesIO(content)

    if suffix == ".csv":
        return pd.read_csv(buffer)
    return pd.read_excel(buffer)


def parse_file(filepath: Path) -> pd.DataFrame:
    return parse_bytes(filepath.read_bytes(), filepath.name)


def get_preview(df: pd.DataFrame, max_rows: int = 10) -> list[dict]:
    preview_df = df.head(max_rows).fillna("—")
    return preview_df.to_dict(orient="records")
