from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    SelectTargetRequest,
    SelectTargetResponse,
    SessionRequest,
    TrainResponse,
    TreeNodeSchema,
)
from app.services.algorithm_selector import select_algorithm
from app.services.preprocessor import preprocess
from app.services.id3_service import run_id3_training
from app.storage.session_store import get_session, update_session

import math

from typing import Dict, Any, List, Union
from app.services.c45_service import run_c45_training

router = APIRouter()

def format_d3_tree(raw_tree, branch_value=""):
    """Mengonversi raw dictionary tree menjadi format TreeNodeSchema untuk Frontend"""
    # Leaf case: raw_tree bukan dict, berarti ini class label (hasil akhir)
    if not isinstance(raw_tree, dict):
        label = str(raw_tree)
        name_str = f"{branch_value} ➔ {label}" if branch_value else label
        return {
            "name": name_str,
            "is_leaf": True,
            "class_label": label,
            "attribute": None,
            "children": [],
        }

    # Internal node case
    root_feature = list(raw_tree.keys())[0]
    name_str = f"{branch_value} ➔ {root_feature}" if branch_value else root_feature

    children = []
    for branch, subtree in raw_tree[root_feature].items():
        children.append(format_d3_tree(subtree, str(branch)))

    return {
        "name": name_str,
        "is_leaf": False,
        "attribute": root_feature,
        "class_label": None,
        "children": children,
    }

@router.post("/select-target", response_model=SelectTargetResponse)
async def select_target_column(request: SelectTargetRequest):
    session = get_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session tidak ditemukan")

    if request.target_column not in session.df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Kolom '{request.target_column}' tidak ditemukan",
        )

    algorithm, reason = select_algorithm(
        session.columns_info, exclude_target=request.target_column
    )
    update_session(
        request.session_id,
        target_column=request.target_column,
        selected_algorithm=algorithm,
        selection_reason=reason,
    )

    return SelectTargetResponse(
        session_id=session.session_id,
        target_column=request.target_column,
        recommended_algorithm=algorithm,
        reason=reason,
    )


@router.post("/train", response_model=TrainResponse)
async def train_model(request: SessionRequest):
    session = get_session(request.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session tidak ditemukan")

    if not session.target_column:
        raise HTTPException(
            status_code=400,
            detail="Kolom target belum dipilih. Gunakan /api/select-target terlebih dahulu."
        )

    processed_df = preprocess(session.df, session.target_column)
    
    algorithm_name = session.selected_algorithm or "ID3"
    
    if algorithm_name == "ID3":
        try:
            # Jalankan training ID3
            id3_result = run_id3_training(processed_df, session.target_column)
            raw_tree = id3_result["tree"]
            # Konversi tree mentah ke format D3 untuk UI
            tree_dict = format_d3_tree(raw_tree)
            rules = id3_result["rules"]
        except Exception as e:
             raise HTTPException(status_code=500, detail=f"Error saat training ID3: {str(e)}")
             
    else:
        try:
            # Jalankan training C4.5
            c45_result = run_c45_training(processed_df, session.target_column, session.columns_info)
            raw_tree = c45_result["tree"]
            tree_dict = format_d3_tree(raw_tree)
            rules = c45_result["rules"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saat training C4.5: {str(e)}")

    update_session(request.session_id, tree=tree_dict, rules=rules)

    return TrainResponse(
        session_id=session.session_id,
        algorithm=algorithm_name,
        selection_reason=session.selection_reason or "",
        tree=TreeNodeSchema(**tree_dict),
        rules=rules,
    )
