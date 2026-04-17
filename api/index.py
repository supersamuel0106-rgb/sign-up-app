import sys
import os

# NOTE: 在 Vercel Serverless Function 中，這個檔案是從專案根目錄執行的
# 必須手動將 backend 目錄加入 sys.path，才能正確匯入 backend 內的模組
_current_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_current_dir)
_backend_dir = os.path.join(_project_root, "backend")

if _project_root not in sys.path:
    sys.path.insert(0, _project_root)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# NOTE: 明確指定 .env 路徑，因為 Vercel 執行時工作目錄不固定
load_dotenv(os.path.join(_backend_dir, ".env"))
load_dotenv(os.path.join(_project_root, ".env"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)

# NOTE: 在 sys.path 設定完畢後才可匯入 backend 子模組
from api.user import router as user_router  # noqa: E402

app = FastAPI(
    title="Scholarly API",
    description="Scholarly 使用者管理後端 API",
    version="1.0.0",
)

# NOTE: 允許 Vercel 生產域名與本地開發來源
frontend_origin = os.getenv("FRONTEND_ORIGIN", "")
allowed_origins = [
    "https://sign-up-app-delta.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_origin and frontend_origin not in allowed_origins:
    allowed_origins.append(frontend_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NOTE: router prefix 設為 /api，讓路由為 /api/users/
# Vercel 會直接把 /api/* 的請求轉發給此 function，路徑完整傳入
app.include_router(user_router, prefix="/api")


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """服務健康狀態檢查端點"""
    return {"status": "ok", "service": "scholarly-api"}


# Vercel 要求的進入點
handler = app
