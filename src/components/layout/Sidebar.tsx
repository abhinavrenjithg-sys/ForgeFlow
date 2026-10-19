import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, FolderGit2, Layers, Repeat,
  BarChart3, Sparkles, Settings, ChevronDown, Plus, LogOut,
  Hash, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';

interface SidebarProps {
  projects?: Project[];
  onOpenCreateProject?: () => void;
  onOpenAIPlanner?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects = [],
  onOpenCreateProject,
  onOpenAIPlanner,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, workspaces, activeWorkspace, setActiveWorkspace, logout } = useAuth();
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const navigate = useNavigate();
  const slug = activeWorkspace?.slug || 'default';

  const navItems = [
    { label: 'Home', icon: LayoutDashboard, path: `/workspaces/${slug}` },
    { label: 'My Issues', icon: CheckSquare, path: `/workspaces/${slug}/my-issues` },
    { label: 'Projects', icon: FolderGit2, path: `/workspaces/${slug}/projects` },
    { label: 'All Issues', icon: Layers, path: `/workspaces/${slug}/issues` },
    { label: 'Cycles', icon: Repeat, path: `/workspaces/${slug}/cycles` },
    { label: 'Analytics', icon: BarChart3, path: `/workspaces/${slug}/analytics` },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F141E] border-r border-white/[0.08] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#84CC16] to-[#65A30D] flex items-center justify-center shadow-lg shadow-lime-500/10">
              <Sparkles className="w-4 h-4 text-[#0B0F17] fill-current" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm">ForgeFlow</span>
              <span className="block text-[10px] text-gray-400 font-mono">v1.0.0</span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-gray-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-3 pt-3 pb-2 relative">
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded bg-lime-500/20 text-[#84CC16] text-xs font-bold flex items-center justify-center shrink-0">
                {activeWorkspace?.name.charAt(0).toUpperCase() || 'W'}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-white truncate">
                  {activeWorkspace?.name || 'Workspace'}
                </div>
                <div className="text-[10px] text-gray-400 font-mono truncate">
                  {activeWorkspace?.slug}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 py-1 bg-[#141A24] border border-white/[0.1] rounded-lg shadow-2xl z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setIsWorkspaceMenuOpen(false);
                    navigate(`/workspaces/${ws.slug}`);
                  }}
                  className={`w-full px-3 py-1.5 text-xs flex items-center justify-between text-left hover:bg-white/[0.05] ${
                    ws.id === activeWorkspace?.id ? 'text-[#84CC16] font-medium' : 'text-gray-300'
                  }`}
                >
                  <span className="truncate">{ws.name}</span>
                  {ws.id === activeWorkspace?.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 pb-3">
          <button
            onClick={() => {
              if (onOpenAIPlanner) onOpenAIPlanner();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-lime-500/15 to-emerald-500/10 border border-lime-500/30 text-[#84CC16] text-xs font-medium hover:bg-lime-500/20 hover:border-lime-500/40 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Task Planner</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === `/workspaces/${slug}`}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-4">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>Projects</span>
              {onOpenCreateProject && (
                <button
                  onClick={onOpenCreateProject}
                  className="p-0.5 rounded hover:text-white hover:bg-white/[0.08]"
                  title="Create Project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="space-y-0.5 mt-1">
              {projects.length === 0 ? (
                <div className="px-2.5 py-2 text-xs text-gray-400 italic">No projects yet</div>
              ) : (
                projects.map((proj) => (
                  <NavLink
                    key={proj.id}
                    to={`/workspaces/${slug}/projects/${proj.id}`}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isActive
                          ? 'bg-white/[0.08] text-[#84CC16] font-medium'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1 rounded bg-white/[0.05] text-gray-400">
                      {proj.identifier}
                    </span>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/[0.08] space-y-1">
          <NavLink
            to={`/workspaces/${slug}/settings`}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'bg-white/[0.08] text-white font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`
            }
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </NavLink>

          <div className="pt-2 flex items-center justify-between px-2.5 py-2 rounded-lg bg-white/[0.02]">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                alt={user?.full_name}
                className="w-7 h-7 rounded-full bg-white/[0.1] object-cover shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-medium text-white truncate">{user?.full_name}</div>
                <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
