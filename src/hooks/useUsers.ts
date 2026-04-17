import { useState, useEffect, useCallback } from 'react';

/**
 * 使用者資料結構，對應後端 UserResponse Schema
 */
export interface UserData {
  id: string;
  name: string;
  login_time: string;
}

// NOTE: 後端 API 的 base URL
// 開發時優先讀取環境變數，若無則依環境判斷：
// 生產環境 (Vercel) 前端與後端共用同一域名，/api/* 由 vercel.json routes 直接轉發
// 本地開發預設指向本機 FastAPI 伺服器 (8000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ?? (import.meta.env.PROD ? '' : 'http://localhost:8000');

interface UseUsersReturn {
  users: UserData[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  addUser: (name: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

/**
 * 管理使用者資料的 Custom Hook。
 * 封裝與後端 API 的所有溝通邏輯，提供資料、狀態與操作方法。
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`);
      if (!response.ok) {
        throw new Error(`取得使用者列表失敗（HTTP ${response.status}）`);
      }
      const data: UserData[] = await response.json();
      setUsers(data);
    } catch (err) {
      let message = err instanceof Error ? err.message : '未知錯誤';
      // NOTE: 處理常規的連線失敗錯誤，提示使用者檢查伺服器
      if (message === 'Failed to fetch' || message.includes('NetworkError')) {
        message = '連線失敗：請確保後端伺服器 (FastAPI) 已啟動並在埠號 8000 運行。';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化時自動載入所有使用者
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  /**
   * 新增使用者登入紀錄，成功後更新本地列表。
   * @param name 使用者名稱
   * @returns 是否成功
   */
  const addUser = useCallback(async (name: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail ?? `建立使用者失敗（HTTP ${response.status}）`);
      }

      const newUser: UserData = await response.json();
      // NOTE: 將新使用者插入列表最前方，保持最新登入在頂部的視覺體驗
      setUsers((prev) => [newUser, ...prev]);
      return true;
    } catch (err) {
      let message = err instanceof Error ? err.message : '未知錯誤';
      if (message === 'Failed to fetch' || message.includes('NetworkError')) {
        message = '連線失敗：請確保後端伺服器 (FastAPI) 已啟動。';
      }
      setError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { users, isLoading, isSubmitting, error, addUser, refreshUsers };
}
