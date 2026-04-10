import logging
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# NOTE: 在 module 層級建立單例 Supabase client，避免重複建立連線
_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """
    取得 Supabase client 單例。
    若尚未初始化則嘗試建立，若環境變數未設定則拋出例外。
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise RuntimeError("SUPABASE_URL 或 SUPABASE_KEY 環境變數未設定，請檢查 backend/.env 檔案")

    _supabase_client = create_client(url, key)
    logger.info("Supabase client 初始化成功")
    return _supabase_client
