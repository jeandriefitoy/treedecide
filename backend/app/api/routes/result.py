from fastapi import APIRouter, HTTPException

from app.models.schemas import TrainResponse, TreeNodeSchema
from app.storage.session_store import get_session

router = APIRouter()


@router.get("/result/{session_id}", response_model=TrainResponse)
async def get_result(session_id: str):
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session tidak ditemukan")

    if session.tree is None:
        raise HTTPException(
            status_code=404,
            detail="Hasil training belum tersedia. Jalankan /api/train terlebih dahulu.",
        )

    return TrainResponse(
        session_id=session.session_id,
        algorithm=session.selected_algorithm or "ID3",
        selection_reason=session.selection_reason or "",
        tree=TreeNodeSchema(**session.tree),
        rules=session.rules,
        accuracy=session.accuracy,
    )
