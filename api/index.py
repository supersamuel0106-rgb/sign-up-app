import sys
import os

# 將專案根目錄加入路徑
# Vercel 環境中，當前的工作目錄 (.) 即為專案根目錄
# 透過將根目錄加入 sys.path，可以將 backend 當作一個 package 進行導入
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    # 嘗試從 package 導入
    from backend.main import app
except ImportError:
    # 支援不同佈署環境下的動態路徑
    import importlib
    backend_main = importlib.import_module("backend.main")
    app = backend_main.app

# Vercel 要求的進入點
handler = app
