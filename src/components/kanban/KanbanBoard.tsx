import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, AlertTriangle } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import type { Issue, IssueStatus, IssuePriority, Project, User } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface KanbanBoardProps {
  issues: Issue[];
  projects: Project[];
  activeProjectId?: string;
  onSelectIssue: (issue: Issue) => void;
  onRefreshIssues?: () => Promise<void>;
  members?: User[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues: initialIssues,
  projects,
  activeProjectId,
  onSelectIssue,
  members = [],
}) => {
  const { activeWorkspace, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for optimistic drag-and-drop
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync when initialIssues changes
  React.useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  // URL sync filter states
  const priorityFilter = (searchParams.get('priority') as IssuePriority | 'all') || 'all';
  const assigneeFilter = searchParams.get('assignee') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const setFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (activeProjectId && issue.project_id !== activeProjectId) {
        return false;
      }
      if (priorityFilter !== 'all' && issue.priority !== priorityFilter) {
        return false;
      }
      if (assigneeFilter === 'me' && issue.assignee_id !== user?.id) {
        return false;
      }
      if (assigneeFilter === 'unassigned' && issue.assignee_id) {
        return false;
      }
      if (assigneeFilter !== 'all' && assigneeFilter !== 'me' && assigneeFilter !== 'unassigned' && issue.assignee_id !== assigneeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = issue.title.toLowerCase().includes(q);
        const matchesSeq = issue.sequence_id.toLowerCase().includes(q);
        const matchesDesc = issue.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSeq && !matchesDesc) return false;
      }
      return true;
    });
  }, [issues, activeProjectId, priorityFilter, assigneeFilter, searchQuery, user]);

  // Columns definition
  const columns: { status: IssueStatus; title: string; color: string }[] = [
    { status: 'backlog', title: 'Backlog', color: '#64748B' },
    { status: 'todo', title: 'Todo', color: '#38BDF8' },
    { status: 'in_progress', title: 'In Progress', color: '#F59E0B' },
    { status: 'in_review', title: 'In Review', color: '#A855F7' },
    { status: 'done', title: 'Done', color: '#10B981' },
  ];

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggedIssueId(issueId);
    e.dataTransfer.setData('text/plain', issueId);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: IssueStatus) => {
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (!issueId || !activeWorkspace) return;

    const issueToMove = issues.find((i) => i.id === issueId);
    if (!issueToMove || issueToMove.status === targetStatus) return;

    const previousStatus = issueToMove.status;

    // 1. Optimistic Update
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: targetStatus } : i))
    );
    setDraggedIssueId(null);

    // 2. Persist to Backend
    try {
      await api.issues.update(activeWorkspace.slug, issueId, {
        status: targetStatus,
      });
      setErrorMessage(null);
    } catch (err) {
      console.error('Failed to move issue:', err);
      // Rollback on error
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: previousStatus } : i))
      );
      setErrorMessage(`Failed to move ${issueToMove.sequence_id}: ${(err as Error).message}`);
    }
  };

  const handleMoveToStatus = async (issueId: string, newStatus: IssueStatus) => {
    if (!activeWorkspace) return;
    const issueToMove = issues.find((i) => i.id === issueId);
    if (!issueToMove || issueToMove.status === newStatus) return;

    const previousStatus = issueToMove.status;

    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
    );

    try {
      await api.issues.update(activeWorkspace.slug, issueId, { status: newStatus });
      setErrorMessage(null);
    } catch (err) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: previousStatus } : i))
      );
      setErrorMessage(`Failed to update status: ${(err as Error).message}`);
    }
  };

  const handleQuickCreate = async (status: IssueStatus, title: string) => {
    if (!activeWorkspace) return;
    const targetProject = activeProjectId
      ? projects.find((p) => p.id === activeProjectId)
      : projects[0];

    if (!targetProject) {
      setErrorMessage('Please create a project first before adding issues.');
      return;
    }

    try {
      const newIssue = await api.issues.create(activeWorkspace.slug, {
        project_id: targetProject.id,
        title,
        status,
        priority: 'medium',
      });
      setIssues((prev) => [...prev, newIssue]);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(`Failed to create issue: ${(err as Error).message}`);
    }
  };

  const hasActiveFilters = priorityFilter !== 'all' || assigneeFilter !== 'all' || searchQuery !== '';

  return (
    <div className="flex flex-col h-full">
      {/* Filter Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0F141E]/80 border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Filter by keyword..."
              className="bg-[#141A24] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16] w-48"
            />
          </div>

          {/* Priority Filter */}
          <select
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(e) => setFilter('priority', e.target.value)}
            className="bg-[#141A24] text-xs text-gray-300 px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Assignee Filter */}
          <select
            aria-label="Filter by assignee"
            value={assigneeFilter}
            onChange={(e) => setFilter('assignee', e.target.value)}
            className="bg-[#141A24] text-xs text-gray-300 px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
          >
            <option value="all">All Assignees</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-gray-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Counter badge */}
        <div className="text-xs text-gray-400 font-mono">
          Showing <span className="text-white font-semibold">{filteredIssues.length}</span> of {issues.length} issues
        </div>
      </div>

      {/* Error alert toast */}
      {errorMessage && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Columns Horizontal Scroll Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex items-start gap-4 min-w-max">
          {columns.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              color={col.color}
              issues={filteredIssues.filter((i) => i.status === col.status)}
              onSelectIssue={onSelectIssue}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onQuickCreateIssue={handleQuickCreate}
              onMoveToStatus={handleMoveToStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
