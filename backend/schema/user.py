from pydantic import BaseModel, Field
from datetime import datetime


class UserCreate(BaseModel):
    """使用者登入請求 Schema"""
    name: str = Field(..., min_length=1, max_length=100, description="使用者名稱")


class UserResponse(BaseModel):
    """使用者回應 Schema"""
    id: str = Field(..., description="Supabase 生成的 UUID")
    name: str = Field(..., description="使用者名稱")
    login_time: str = Field(..., description="登入時間（格式化為 HH:MM）")
