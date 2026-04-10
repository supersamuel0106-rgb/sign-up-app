import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useUsers } from './hooks/useUsers';

type Screen = 'login' | 'list';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [username, setUsername] = useState('');
  const { users, isLoading, isSubmitting, error, addUser, refreshUsers } = useUsers();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const success = await addUser(username.trim());
    if (success) {
      setUsername('');
      setCurrentScreen('list');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative overflow-hidden">
      {/* Progress Aura */}
      <div className="fixed top-0 left-0 w-full aura-bar z-[60]" />

      {/* Background Decoration */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-surface-container rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-surface-container-high rounded-full blur-[100px] opacity-30 pointer-events-none" />

      <AnimatePresence mode="wait">
        {currentScreen === 'login' ? (
          <motion.main
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md px-8 py-12 z-10 flex flex-col items-center text-center"
          >
            <header className="mb-12">
              <div className="w-20 h-20 signature-gradient rounded-[24px] flex items-center justify-center mb-6 mx-auto shadow-[0px_12px_32px_rgba(47,79,221,0.2)]">
                <GraduationCap className="text-white w-10 h-10" />
              </div>
              <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-on-surface">Scholarly</h1>
            </header>

            <section className="w-full bg-surface-container-low rounded-[32px] p-8 shadow-sm">
              <h2 className="font-headline font-bold text-2xl text-on-surface mb-8 text-left">歡迎回來</h2>

              {/* 全域錯誤提示 */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="login-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="font-medium text-sm text-on-surface-variant px-1" htmlFor="username">
                    名稱
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                      <User size={20} />
                    </div>
                    <input
                      className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all duration-200 text-lg outline-none"
                      id="username"
                      placeholder="請輸入名稱"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <button
                  className="w-full signature-gradient text-white font-headline font-bold text-lg py-5 rounded-xl shadow-[0px_12px_32px_rgba(47,79,221,0.15)] active:scale-[0.98] transition-transform duration-200 mt-4 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isSubmitting || !username.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      登入中...
                    </>
                  ) : (
                    '登入'
                  )}
                </button>
              </form>
            </section>
          </motion.main>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-screen flex flex-col z-10"
          >
            <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50">
              <div className="flex items-center w-full px-6 py-4">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="hover:bg-surface-container-low transition-colors active:scale-95 duration-200 p-2 rounded-full text-primary"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <h1 className="text-xl font-bold tracking-tighter text-primary font-headline">Scholarly</h1>
                </div>
                {/* 重新整理按鈕 */}
                <button
                  onClick={refreshUsers}
                  disabled={isLoading}
                  className="p-2 rounded-full text-primary hover:bg-surface-container-low transition-colors active:scale-95 duration-200 disabled:opacity-50"
                  aria-label="重新整理"
                >
                  <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="px-6 pb-4 flex justify-between items-center">
                <span className="font-headline font-bold text-on-surface text-xl">用戶列表</span>
                <div className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-bold">
                  {users.length} 位用戶
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-4">
              {/* 錯誤提示 */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="list-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-6">
                <h2 className="text-primary font-bold tracking-tight text-xs uppercase font-headline mb-4">活躍用戶</h2>

                {/* 載入中骨架 */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 animate-pulse"
                      >
                        <div className="w-12 h-12 rounded-full bg-surface-container-high" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-surface-container-high rounded w-1/3" />
                          <div className="h-3 bg-surface-container-high rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.length === 0 ? (
                      <div className="text-center py-12 text-on-surface-variant">目前沒有登入的用戶</div>
                    ) : (
                      users.map((user) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={user.id}
                          className="group bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 hover:bg-surface-container-high transition-all active:scale-[0.98] duration-200 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-full signature-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-on-surface text-lg">{user.name}</p>
                            <p className="text-on-surface-variant text-sm">登入時間：{user.login_time}</p>
                          </div>
                          <ChevronRight className="text-outline group-hover:text-primary transition-colors" size={20} />
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
