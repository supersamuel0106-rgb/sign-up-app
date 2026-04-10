import logging
from datetime import datetime, timezone
from schema.user import UserCreate, UserResponse
from repository import user as user_repo

logger = logging.getLogger(__name__)


def _format_login_time(login_time_str: str) -> str:
    """
    將 ISO 格式的 UTC 時間字串轉換為本地台灣時間的 HH:MM 字串。
    Supabase 儲存的是 UTC，此處轉為 UTC+8 顯示。
    """
    try:
        dt = datetime.fromisoformat(login_time_str.replace("Z", "+00:00"))
        # 轉換為 UTC+8 台灣時間
        from datetime import timedelta
        tw_offset = timedelta(hours=8)
        dt_tw = dt.astimezone(timezone(tw_offset))
        return dt_tw.strftime("%H:%M")
    except Exception:
        # HACK: 若格式解析失敗，直接回傳目前台灣時間，避免介面崩潰
        return datetime.now().strftime("%H:%M")


def create_user(payload: UserCreate) -> UserResponse:
    """
    建立新的使用者並回傳格式化後的使用者資料。

    Args:
        payload: UserCreate 物件（含 name 欄位）

    Returns:
        UserResponse 物件
    """
    raw = user_repo.insert_user(name=payload.name)

    return UserResponse(
        id=raw["id"],
        name=raw["name"],
        login_time=_format_login_time(raw["login_time"]),
    )


def list_users() -> list[UserResponse]:
    """
    取得所有使用者的列表，並格式化登入時間。

    Returns:
        UserResponse 列表
    """
    raw_list = user_repo.fetch_all_users()

    return [
        UserResponse(
            id=item["id"],
            name=item["name"],
            login_time=_format_login_time(item["login_time"]),
        )
        for item in raw_list
    ]
