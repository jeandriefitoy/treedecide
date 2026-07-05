import uuid
from dataclasses import dataclass, field
from pathlib import Path

import pandas as pd

from app.core.config import settings


@dataclass
class SessionData:
    session_id: str
    filename: str
    filepath: Path
    df: pd.DataFrame
    target_column: str | None = None
    columns_info: list[dict] = field(default_factory=list)
    selected_algorithm: str | None = None
    selection_reason: str | None = None
    tree: dict | None = None
    rules: list[str] = field(default_factory=list)
    accuracy: float | None = None


_sessions: dict[str, SessionData] = {}


def create_session(filename: str, filepath: Path, df: pd.DataFrame) -> SessionData:
    session_id = str(uuid.uuid4())
    session = SessionData(
        session_id=session_id,
        filename=filename,
        filepath=filepath,
        df=df,
    )
    _sessions[session_id] = session
    return session


def get_session(session_id: str) -> SessionData | None:
    return _sessions.get(session_id)


def update_session(session_id: str, **kwargs) -> SessionData | None:
    session = _sessions.get(session_id)
    if session is None:
        return None
    for key, value in kwargs.items():
        setattr(session, key, value)
    return session


def ensure_upload_dir() -> Path:
    upload_path = Path(settings.upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path
