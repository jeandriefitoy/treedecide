"""Tests for column type detection."""

from app.services.column_detector import (
    all_categorical,
    analyze_columns,
    has_missing_values,
    has_numeric_columns,
)
import pandas as pd


def test_analyze_categorical_columns():
    df = pd.DataFrame({"color": ["red", "blue", "red"], "size": ["S", "M", "L"]})
    info = analyze_columns(df)
    assert all(col["type"] == "categorical" for col in info)
    assert not has_missing_values(info)
    assert not has_numeric_columns(info)
    assert all_categorical(info)


def test_analyze_numeric_column():
    df = pd.DataFrame({"age": [25, 30, None], "label": ["A", "B", "A"]})
    info = analyze_columns(df)
    assert has_numeric_columns(info)
    assert has_missing_values(info)
