import sys
import os

# 將專案根目錄加入路徑，確保 Vercel 能找到 backend 模組
# Vercel 環境中，當前的工作目錄 (.) 即為專案根目錄
sys.path.append(os.path.curdir)
sys.path.append(os.path.join(os.path.curdir, "backend"))

try:
    from backend.main import app
except ImportError:
    from main import app

# Vercel 要求的進入點
handler = app
