from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import DetectResponse
from app.services.detect_service import run_detection
from app.services.file_parser import parse_bytes, validate_file_extension

router = APIRouter()


@router.post("/detect", response_model=DetectResponse)
async def detect_dataset(file: UploadFile = File(...)):
    """
    Terima file CSV/Excel, deteksi tipe kolom & missing value,
    lalu rekomendasikan algoritma ID3 atau C4.5.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nama file kosong")

    try:
        validate_file_extension(file.filename)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="File kosong")

    try:
        df = parse_bytes(content, file.filename)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file: {exc}") from exc

    if df.empty:
        raise HTTPException(status_code=400, detail="Dataset tidak memiliki baris data")

    if len(df.columns) == 0:
        raise HTTPException(status_code=400, detail="Dataset tidak memiliki kolom")

    result = run_detection(df, file.filename)
    return DetectResponse(**result)
