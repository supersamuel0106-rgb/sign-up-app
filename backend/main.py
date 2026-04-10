import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.user import router as user_router

# NOTE: 在 main 最頂層載入 .env，確保所有子模組都能讀到環境變數
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Scholarly API",
    description="Scholarly 使用者管理後端 API",
    version="1.0.0",
)

# NOTE: 從環境變數讀取前端來源，支援多個來源與預設值
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
allowed_origins = [
    frontend_origin,
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載所有路由
app.include_router(user_router, prefix="/api")


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """服務健康狀態檢查端點"""
    return {"status": "ok", "service": "scholarly-api"}
