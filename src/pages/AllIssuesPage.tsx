import React, { useState, useEffect } from 'react';
import { Kanban, List, Plus } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { IssueListView } from '../components/issues/IssueListView';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Project, Issue, User, IssueStatus } from '../types';

interface AllIssuesPageProps {
  onOpenCreateIssue: () => void;
  onOpenAIPlanner?: () => void;
  onSelectIssue: (issue: Issue) => void;
}

export const AllIssuesPage: React.FC<AllIssuesPageProps> = ({
  onOpenCreateIssue,
  onSelectIssue,
}) => {
  const { activeWorkspace } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const slug = activeWorkspace?.slug;

  const loadData = async () => {
    if (!slug) return;
    try {
      const [issuesData, projectsData, membersData] = await Promise.all([
        api.issues.list(slug),
        api.projects.list(slug),
        api.workspaces.listMembers(slug),
      ]);
      setIssues(issuesData);
      setProjects(projectsData);
      setMembers(membersData.map((m) => m.user!).filter(Boolean));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleUpdateStatus = async (issueId: string, status: IssueStatus) => {
    if (!slug) return;
    try {
      await api.issues.update(slug, issueId, { status });
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredByProject = selectedProjectId === 'all'
    ? issues
    : issues.filter((i) => i.project_id === selectedProjectId);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">All Issues</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Cross-project backlog and active sprint triage
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Project selector filter */}
          <select
            aria-label="Filter issues by project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-[#141A24] text-xs text-gray-300 px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.identifier})
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#141A24] p-1 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'board'
                  ? 'bg-white/[0.1] text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white/[0.1] text-white font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => onOpenCreateIssue()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Issue</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'board' ? (
          <KanbanBoard
            issues={filteredByProject}
            projects={projects}
            activeProjectId={selectedProjectId === 'all' ? undefined : selectedProjectId}
            onSelectIssue={onSelectIssue}
            onRefreshIssues={loadData}
            members={members}
          />
        ) : (
          <IssueListView
            issues={filteredByProject}
            onSelectIssue={onSelectIssue}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
};
