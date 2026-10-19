import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Kanban, List, Sparkles, Plus } from 'lucide-react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { IssueListView } from '../components/issues/IssueListView';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Project, Issue, User, IssueStatus } from '../types';

interface ProjectBoardPageProps {
  onOpenCreateIssue: (projectId?: string) => void;
  onOpenAIPlanner: (projectId?: string) => void;
  onSelectIssue: (issue: Issue) => void;
}

export const ProjectBoardPage: React.FC<ProjectBoardPageProps> = ({
  onOpenCreateIssue,
  onOpenAIPlanner,
  onSelectIssue,
}) => {
  const { activeWorkspace } = useAuth();
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isLoading, setIsLoading] = useState(true);

  const slug = activeWorkspace?.slug;

  const loadData = async () => {
    if (!slug || !projectId) return;
    setIsLoading(true);
    try {
      const [projData, issuesData, membersData] = await Promise.all([
        api.projects.get(slug, projectId),
        api.issues.list(slug, { project_id: projectId }),
        api.workspaces.listMembers(slug),
      ]);
      setProject(projData);
      setIssues(issuesData);
      setMembers(membersData.map((m) => m.user!).filter(Boolean));
    } catch (err) {
      console.error('Failed to load project board:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug, projectId]);

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

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#84CC16] border-t-transparent animate-spin mb-3" />
        <span className="text-xs">Loading project board...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-16 text-center text-xs text-gray-400">
        Project not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Project Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-lime-500/15 text-[#84CC16] border border-lime-500/30">
              {project.identifier}
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {project.name}
            </h1>
          </div>
          {project.description && (
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              {project.description}
            </p>
          )}
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Board / List View Toggle */}
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
            onClick={() => onOpenAIPlanner(project.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-[#84CC16] border border-lime-500/30 text-xs font-medium transition-all"
            title="Decompose new feature into tasks with AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Plan</span>
          </button>

          <button
            onClick={() => onOpenCreateIssue(project.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Issue</span>
          </button>
        </div>
      </div>

      {/* Main Board View or List View */}
      <div className="flex-1 min-h-0">
        {viewMode === 'board' ? (
          <KanbanBoard
            issues={issues}
            projects={[project]}
            activeProjectId={project.id}
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
