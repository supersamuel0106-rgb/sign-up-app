import sys
import os

# 將專案根目錄與 backend 目錄加入路徑
# 在 Vercel 環境中，'.' 代表專案根目錄
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, "backend"))

try:
    from backend.main import app
except ImportError:
    import importlib
    app = importlib.import_module("backend.main").app

# Vercel 要求的進入點
handler = app
