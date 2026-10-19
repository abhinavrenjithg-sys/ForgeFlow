import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare, AlertCircle, TrendingUp, FolderGit2,
  Sparkles, Plus, History, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Issue, Project, ActivityEvent, AnalyticsData } from '../types';

interface DashboardPageProps {
  onOpenCreateIssue: () => void;
  onOpenAIPlanner: () => void;
  onSelectIssue: (issue: Issue) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCreateIssue,
  onOpenAIPlanner,
  onSelectIssue,
}) => {
  const { user, activeWorkspace } = useAuth();
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const slug = activeWorkspace?.slug;

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      api.issues.list(slug, { assignee_id: 'me' }),
      api.projects.list(slug),
      api.activity.getWorkspace(slug),
      api.analytics.get(slug),
    ])
      .then(([issuesData, projectsData, activityData, analyticsData]) => {
        setMyIssues(issuesData);
        setProjects(projectsData);
        setActivities(activityData.slice(0, 8));
        setAnalytics(analyticsData);
      })
      .catch(console.error);
  }, [slug]);

  if (!activeWorkspace) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141A24] via-[#141A24] to-lime-500/10 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#84CC16] tracking-wider uppercase">
            Workspace Overview
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Welcome back, {user?.full_name.split(' ')[0]}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Tracking execution in <strong className="text-gray-200">{activeWorkspace.name}</strong>. Here is your current engineering workload.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIPlanner}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 text-[#84CC16] border border-lime-500/30 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Task Planner</span>
          </button>
          <button
            onClick={onOpenCreateIssue}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Issue</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>My Open Tasks</span>
            <CheckSquare className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {myIssues.filter((i) => i.status !== 'done').length}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Assigned directly to you</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-orange-400 mb-1">
            <span>High / Urgent Priority</span>
            <AlertCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400 tracking-tight">
            {myIssues.filter((i) => i.priority === 'urgent' || i.priority === 'high').length}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Critical path items</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-blue-400 mb-1">
            <span>Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {projects.length}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">In this workspace</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-[#84CC16] mb-1">
            <span>Workspace Completion</span>
            <TrendingUp className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="text-2xl font-bold text-[#84CC16] tracking-tight">
            {analytics?.completion_rate || 0}%
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {analytics?.completed_issues || 0} of {analytics?.total_issues || 0} done
          </div>
        </div>
      </div>

      {/* Two Column Layout: Assigned to Me & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Assigned to Me ({myIssues.length})
            </h3>
            <Link
              to={`/workspaces/${slug}/my-issues`}
              className="text-xs text-[#84CC16] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {myIssues.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-white/[0.08] rounded-2xl bg-[#0F141E]/40">
                You have no assigned tasks in this workspace right now.
              </div>
            ) : (
              myIssues.slice(0, 6).map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="p-3.5 rounded-xl bg-[#141A24] hover:bg-[#19212E] border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#84CC16] shrink-0">
                      {issue.sequence_id}
                    </span>
                    <span className="text-xs font-medium text-white truncate">
                      {issue.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-gray-300 capitalize font-mono">
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        issue.priority === 'urgent'
                          ? 'bg-red-500/15 text-red-400'
                          : issue.priority === 'high'
                          ? 'bg-orange-500/15 text-orange-400'
                          : 'bg-white/[0.05] text-gray-400'
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Workspace Activity</span>
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#141A24] border border-white/[0.08] space-y-3">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No recent activity recorded
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="text-xs pb-3 border-b border-white/[0.04] last:border-none last:pb-0">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <img
                      src={act.actor?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt={act.actor?.full_name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{act.actor?.full_name || 'System'}</span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    {act.verb === 'updated_status' ? (
                      <span>
                        moved issue to <strong className="text-[#84CC16] capitalize">{act.new_value}</strong>
                      </span>
                    ) : act.verb === 'created' ? (
                      <span>created new issue</span>
                    ) : act.verb === 'commented' ? (
                      <span>commented on issue</span>
                    ) : act.verb === 'assigned' ? (
                      <span>assigned issue to {act.new_value}</span>
                    ) : (
                      <span>{act.verb}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-1">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
