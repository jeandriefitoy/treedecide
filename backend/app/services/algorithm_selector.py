def select_algorithm(
    columns_info: list[dict],
    exclude_target: str | None = None,
) -> tuple[str, str]:
    """
    Pilih algoritma Decision Tree berdasarkan karakteristik data.

    - ID3: semua kategorik, tanpa missing value
    - C4.5: ada kolom numerik dan/atau ada missing value
    """
    feature_cols = [
        c for c in columns_info if c["name"] != exclude_target
    ]

    missing = any(c["missing_count"] > 0 for c in feature_cols)
    numeric = any(c["type"] == "numeric" for c in feature_cols)
    numeric_count = sum(1 for c in feature_cols if c["type"] == "numeric")

    if not missing and not numeric:
        return (
            "ID3",
            "Semua kolom fitur bersifat kategorik dan tidak ada missing value. "
            "ID3 dipilih karena sederhana dan sesuai untuk data kategorik murni.",
        )

    reasons = []
    if numeric:
        reasons.append(
            f"Sistem mendeteksi {numeric_count} kolom numerik"
        )
    if missing:
        missing_cols = [c["name"] for c in feature_cols if c["missing_count"] > 0]
        reasons.append(
            f"Ada missing value pada kolom: {', '.join(missing_cols)}"
        )

    reason = " → ".join(reasons) + " → C4.5 dipilih."
    return "C4.5", reason
