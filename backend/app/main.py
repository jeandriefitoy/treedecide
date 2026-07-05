from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import detect, result, train, upload
from app.core.config import settings

app = FastAPI(
    title="TreeDecide API",
    description="SPK Decision Tree — auto ID3/C4.5 selection",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(detect.router, prefix="/api", tags=["detect"])
app.include_router(train.router, prefix="/api", tags=["train"])
app.include_router(result.router, prefix="/api", tags=["result"])


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "treedecide-api"}
