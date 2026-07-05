from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.models.schemas import ColumnInfo, UploadResponse
from app.services.column_detector import analyze_columns
from app.services.file_parser import get_preview, parse_file
from app.storage.session_store import create_session, ensure_upload_dir

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nama file kosong")

    suffix = file.filename[file.filename.rfind(".") :].lower()
    if suffix not in (".csv", ".xlsx", ".xls"):
        raise HTTPException(
            status_code=400,
            detail="Format tidak didukung. Gunakan .csv atau .xlsx",
        )

    upload_dir = ensure_upload_dir()
    filepath = upload_dir / file.filename

    content = await file.read()
    filepath.write_bytes(content)

    try:
        df = parse_file(filepath)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file: {exc}")

    session = create_session(file.filename, filepath, df)
    columns_info = analyze_columns(df)
    session.columns_info = columns_info

    return UploadResponse(
        session_id=session.session_id,
        filename=session.filename,
        row_count=len(df),
        column_count=len(df.columns),
        columns=[ColumnInfo(**c) for c in columns_info],
        preview=get_preview(df, settings.max_preview_rows),
    )
