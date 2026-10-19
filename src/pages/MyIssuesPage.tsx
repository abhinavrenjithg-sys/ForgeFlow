import React, { useState, useEffect } from 'react';
import { CheckSquare, Kanban, List, Plus } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { IssueListView } from '../components/issues/IssueListView';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Issue, Project, User, IssueStatus } from '../types';

interface MyIssuesPageProps {
  onOpenCreateIssue: () => void;
  onSelectIssue: (issue: Issue) => void;
}

export const MyIssuesPage: React.FC<MyIssuesPageProps> = ({
  onOpenCreateIssue,
  onSelectIssue,
}) => {
  const { user, activeWorkspace } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const slug = activeWorkspace?.slug;

  const loadData = async () => {
    if (!slug) return;
    try {
      const [issuesData, projectsData, membersData] = await Promise.all([
        api.issues.list(slug, { assignee_id: 'me' }),
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

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#84CC16]" />
            <h1 className="text-lg font-bold text-white tracking-tight">My Issues</h1>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Personal triage of work items assigned to {user?.full_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            issues={issues}
            projects={projects}
            onSelectIssue={onSelectIssue}
            onRefreshIssues={loadData}
            members={members}
          />
        ) : (
          <IssueListView
            issues={issues}
            onSelectIssue={onSelectIssue}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
};
