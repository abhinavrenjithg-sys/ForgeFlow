import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Plus, FolderGit2, CheckSquare, BarChart3, Settings, Hash, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Issue, Project } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateIssue: () => void;
  onOpenAIPlanner: () => void;
  onSelectIssue?: (issue: Issue) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCreateIssue,
  onOpenAIPlanner,
  onSelectIssue,
}) => {
  const { activeWorkspace } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!isOpen || !activeWorkspace) return;
    setQuery('');

    Promise.all([
      api.projects.list(activeWorkspace.slug),
      api.issues.list(activeWorkspace.slug),
    ]).then(([projData, issueData]) => {
      setProjects(projData);
      setIssues(issueData);
    }).catch(console.error);
  }, [isOpen, activeWorkspace]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slug = activeWorkspace?.slug || 'default';
  const q = query.toLowerCase().trim();

  const navigationItems = [
    { type: 'nav', id: 'home', label: 'Go to Home / Dashboard', icon: CheckSquare, action: () => navigate(`/workspaces/${slug}`) },
    { type: 'nav', id: 'projects', label: 'Go to Projects', icon: FolderGit2, action: () => navigate(`/workspaces/${slug}/projects`) },
    { type: 'nav', id: 'all-issues', label: 'Go to All Issues', icon: Hash, action: () => navigate(`/workspaces/${slug}/issues`) },
    { type: 'nav', id: 'my-issues', label: 'Go to My Issues', icon: CheckSquare, action: () => navigate(`/workspaces/${slug}/my-issues`) },
    { type: 'nav', id: 'analytics', label: 'Go to Analytics Dashboard', icon: BarChart3, action: () => navigate(`/workspaces/${slug}/analytics`) },
    { type: 'nav', id: 'settings', label: 'Go to Settings', icon: Settings, action: () => navigate(`/workspaces/${slug}/settings`) },
  ].filter(item => !q || item.label.toLowerCase().includes(q));

  const actionItems = [
    { type: 'action', id: 'new-issue', label: 'Create New Issue', icon: Plus, action: () => { onClose(); onOpenCreateIssue(); } },
    { type: 'action', id: 'ai-plan', label: 'Open AI Task Planner', icon: Sparkles, action: () => { onClose(); onOpenAIPlanner(); } },
  ].filter(item => !q || item.label.toLowerCase().includes(q));

  const filteredIssues = issues.filter(
    (i) =>
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.sequence_id.toLowerCase().includes(q)
  ).slice(0, 5);

  const filteredProjects = projects.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.identifier.toLowerCase().includes(q)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#141A24] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search issues..."
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-gray-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {actionItems.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </div>
              {actionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-200 hover:bg-white/[0.08] hover:text-[#84CC16] text-left transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[#84CC16]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {filteredIssues.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Issues
              </div>
              {filteredIssues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => {
                    onClose();
                    if (onSelectIssue) onSelectIssue(issue);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-200 hover:bg-white/[0.08] text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[11px] text-[#84CC16] shrink-0 font-semibold">
                      {issue.sequence_id}
                    </span>
                    <span className="truncate text-white">{issue.title}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-400 uppercase">
                    {issue.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Projects
              </div>
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onClose();
                    navigate(`/workspaces/${slug}/projects/${p.id}`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-200 hover:bg-white/[0.08] text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className="w-4 h-4 text-gray-400" />
                    <span className="truncate text-white">{p.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">
                    {p.identifier}
                  </span>
                </button>
              ))}
            </div>
          )}

          {navigationItems.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Navigation
              </div>
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    item.action();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-200 hover:bg-white/[0.08] text-left transition-colors"
                >
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#0F141E] flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
