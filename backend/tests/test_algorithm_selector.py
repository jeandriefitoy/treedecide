"""Tests for algorithm auto-selection logic."""

from app.services.algorithm_selector import select_algorithm


def test_select_id3_for_pure_categorical():
    columns = [
        {"name": "outlook", "type": "categorical", "missing_count": 0},
        {"name": "wind", "type": "categorical", "missing_count": 0},
        {"name": "play", "type": "categorical", "missing_count": 0},
    ]
    algo, reason = select_algorithm(columns, exclude_target="play")
    assert algo == "ID3"
    assert "kategorik" in reason.lower()


def test_select_c45_for_numeric():
    columns = [
        {"name": "age", "type": "numeric", "missing_count": 0},
        {"name": "label", "type": "categorical", "missing_count": 0},
    ]
    algo, reason = select_algorithm(columns, exclude_target="label")
    assert algo == "C4.5"
    assert "numerik" in reason.lower()


def test_select_c45_for_missing_values():
    columns = [
        {"name": "color", "type": "categorical", "missing_count": 2},
        {"name": "label", "type": "categorical", "missing_count": 0},
    ]
    algo, _ = select_algorithm(columns, exclude_target="label")
    assert algo == "C4.5"
