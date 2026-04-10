import logging
from datetime import datetime, timezone
from supabase import Client
from repository.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

TABLE_NAME = "users"


def insert_user(name: str) -> dict:
    """
    在 Supabase 的 users 資料表中插入一筆新使用者紀錄。

    Args:
        name: 使用者名稱

    Returns:
        插入後的完整使用者資料 (dict)

    Raises:
        Exception: 當 Supabase 操作失敗時
    """
    client: Client = get_supabase_client()

    # NOTE: 使用 UTC 時間儲存，讓前端自行轉換為本地時間顯示
    now_utc = datetime.now(timezone.utc).isoformat()

    payload = {
        "name": name,
        "login_time": now_utc,
    }

    response = client.table(TABLE_NAME).insert(payload).execute()

    if not response.data:
        raise RuntimeError(f"Supabase 插入失敗，回應為空：{response}")

    logger.info("成功新增使用者：%s", name)
    return response.data[0]


def fetch_all_users() -> list[dict]:
    """
    從 Supabase 的 users 資料表取得所有使用者，依登入時間降冪排序。

    Returns:
        使用者資料列表 (list of dict)
    """
    client: Client = get_supabase_client()

    response = (
        client.table(TABLE_NAME)
        .select("*")
        .order("login_time", desc=True)
        .execute()
    )

    logger.info("成功取得 %d 筆使用者資料", len(response.data))
    return response.data
