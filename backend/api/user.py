import logging
from fastapi import APIRouter, HTTPException, status
from schema.user import UserCreate, UserResponse
from service import user as user_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse], summary="取得所有使用者")
async def get_users() -> list[UserResponse]:
    """
    取得所有已登入使用者的列表，依最新登入時間降冪排序。
    """
    try:
        return user_service.list_users()
    except Exception as e:
        logger.error("取得使用者列表失敗：%s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="取得使用者列表失敗，請稍後再試",
        )


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="新增使用者")
async def create_user(payload: UserCreate) -> UserResponse:
    """
    建立一筆新的使用者登入紀錄，並回傳格式化後的使用者資料。
    """
    try:
        return user_service.create_user(payload)
    except Exception as e:
        logger.error("建立使用者失敗：%s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="建立使用者失敗，請稍後再試",
        )
