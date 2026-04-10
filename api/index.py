import sys
import os

# 將專案根目錄與 backend 目錄加入路徑，確保 Vercel 能找到模組
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, os.path.join(parent_dir, "backend"))

# 從原本的 backend 目錄導入 FastAPI app
try:
    from backend.main import app
except ImportError:
    # 支援在不同目錄結構下的導入
    from main import app

# Vercel 要求的進入點
handler = app
