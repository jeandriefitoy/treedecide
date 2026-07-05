"""Tests for POST /api/detect."""

import io

import pandas as pd
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _make_csv_file(df: pd.DataFrame, filename: str = "data.csv") -> tuple[str, bytes]:
    buffer = io.BytesIO()
    df.to_csv(buffer, index=False)
    return filename, buffer.getvalue()


def test_detect_categorical_dataset_recommends_id3():
    df = pd.DataFrame(
        {
            "outlook": ["sunny", "rain", "overcast"],
            "wind": ["weak", "strong", "weak"],
            "play": ["yes", "no", "yes"],
        }
    )
    filename, content = _make_csv_file(df)

    response = client.post(
        "/api/detect",
        files={"file": (filename, content, "text/csv")},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["filename"] == filename
    assert data["row_count"] == 3
    assert data["column_count"] == 3
    assert len(data["columns"]) == 3
    assert all(col["type"] == "categorical" for col in data["columns"])
    assert data["missing_columns"] == []
    assert data["recommended_algorithm"] == "ID3"
    assert "kategorik" in data["reason"].lower()


def test_detect_numeric_column_recommends_c45():
    df = pd.DataFrame(
        {
            "age": [25, 30, 35],
            "label": ["A", "B", "A"],
        }
    )
    filename, content = _make_csv_file(df)

    response = client.post(
        "/api/detect",
        files={"file": (filename, content, "text/csv")},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["recommended_algorithm"] == "C4.5"
    assert any(col["name"] == "age" and col["type"] == "numeric" for col in data["columns"])
    assert "numerik" in data["reason"].lower()


def test_detect_missing_values():
    df = pd.DataFrame(
        {
            "color": ["red", None, "blue"],
            "size": ["S", "M", "L"],
        }
    )
    filename, content = _make_csv_file(df)

    response = client.post(
        "/api/detect",
        files={"file": (filename, content, "text/csv")},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["recommended_algorithm"] == "C4.5"
    assert data["missing_columns"] == [{"name": "color", "missing_count": 1}]


def test_detect_rejects_unsupported_format():
    response = client.post(
        "/api/detect",
        files={"file": ("data.txt", b"hello", "text/plain")},
    )

    assert response.status_code == 400
