import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Menu, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Notification } from '../../types';

interface TopNavProps {
  breadcrumbs?: { label: string; href?: string }[];
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenCreateIssue: () => void;
  onOpenAIPlanner?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  breadcrumbs = [],
  onOpenMobileSidebar,
  onOpenCommandPalette,
  onOpenCreateIssue,
  onOpenAIPlanner,
}) => {
  const { user, activeWorkspace } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!activeWorkspace) return;
    try {
      const data = await api.notifications.list(activeWorkspace.slug);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [activeWorkspace]);

  const handleMarkAllRead = async () => {
    if (!activeWorkspace) return;
    try {
      await api.notifications.markAllRead(activeWorkspace.slug);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-14 px-4 bg-[#0B0F17]/80 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-gray-400 hover:text-gray-200">
            {activeWorkspace?.name || 'Workspace'}
          </span>
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className={idx === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-gray-400'}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search issues & projects...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/[0.08] text-gray-400 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {onOpenAIPlanner && (
          <button
            onClick={onOpenAIPlanner}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-[#84CC16] border border-lime-500/30 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Plan</span>
          </button>
        )}

        <button
          onClick={onOpenCreateIssue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Issue</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#84CC16] ring-2 ring-[#0B0F17]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#141A24] border border-white/[0.1] rounded-xl shadow-2xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                <span className="text-xs font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#84CC16] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg text-xs border ${
                        n.is_read
                          ? 'bg-transparent border-transparent text-gray-400'
                          : 'bg-white/[0.03] border-white/[0.08] text-white'
                      }`}
                    >
                      <div className="font-medium text-xs text-white">{n.title}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        {new Date(n.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <img
          src={user?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
          alt={user?.full_name}
          className="w-7 h-7 rounded-full bg-white/[0.1] object-cover ring-1 ring-white/[0.1]"
        />
      </div>
    </header>
  );
};
