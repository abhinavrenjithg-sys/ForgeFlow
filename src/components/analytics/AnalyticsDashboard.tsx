import React from 'react';
import {
  BarChart3, CheckCircle2, Clock, AlertTriangle, TrendingUp,
  FolderGit2, Layers
} from 'lucide-react';
import type { AnalyticsData } from '../../types';

interface AnalyticsDashboardProps {
  data: AnalyticsData | null;
  isLoading: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#84CC16] border-t-transparent animate-spin mb-3" />
        <span className="text-xs">Calculating workspace metrics...</span>
      </div>
    );
  }

  if (!data || data.total_issues === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/[0.08] rounded-2xl bg-[#0F141E]/50">
        <BarChart3 className="w-10 h-10 text-gray-400 mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">No Data Available Yet</h3>
        <p className="text-xs text-gray-400 max-w-sm">
          Create projects and issues or run the AI Task Planner to start viewing real velocity, status breakdowns, and team workload.
        </p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    backlog: '#64748B',
    todo: '#38BDF8',
    in_progress: '#F59E0B',
    in_review: '#A855F7',
    done: '#10B981',
    cancelled: '#EF4444',
  };

  const priorityColors: Record<string, string> = {
    urgent: '#EF4444',
    high: '#F97316',
    medium: '#EAB308',
    low: '#38BDF8',
    none: '#64748B',
  };

  return (
    <div className="space-y-6">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Total Issues</span>
            <Layers className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.total_issues}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Across all projects</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-blue-400 mb-2">
            <span>Open Issues</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {data.open_issues}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Pending resolution</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            {data.completed_issues}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Shipped & closed</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-red-400 mb-2">
            <span>Overdue</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 tracking-tight">
            {data.overdue_issues}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Past target date</div>
        </div>

        <div className="p-4 rounded-xl bg-[#141A24] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#84CC16] mb-2">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="text-2xl font-bold text-[#84CC16] tracking-tight">
            {data.completion_rate}%
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#84CC16] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, data.completion_rate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Status Distribution & Priority Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="p-5 rounded-2xl bg-[#141A24] border border-white/[0.08]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Issues by Workflow Status
          </h3>
          <div className="space-y-3">
            {Object.entries(data.issues_by_status).map(([st, count]) => {
              const percent = data.total_issues > 0 ? Math.round((count / data.total_issues) * 100) : 0;
              return (
                <div key={st}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="capitalize text-gray-300 font-medium">
                      {st.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-gray-400">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: statusColors[st] || '#84CC16',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-5 rounded-2xl bg-[#141A24] border border-white/[0.08]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Issues by Priority Level
          </h3>
          <div className="space-y-3">
            {Object.entries(data.issues_by_priority).map(([prio, count]) => {
              const percent = data.total_issues > 0 ? Math.round((count / data.total_issues) * 100) : 0;
              return (
                <div key={prio}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="capitalize text-gray-300 font-medium">
                      {prio}
                    </span>
                    <span className="font-mono text-gray-400">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: priorityColors[prio] || '#64748B',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Project Velocity & Team Workload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Project Progress */}
        <div className="p-5 rounded-2xl bg-[#141A24] border border-white/[0.08]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Project Delivery Progress
          </h3>
          <div className="space-y-4">
            {data.project_progress.length === 0 ? (
              <div className="text-xs text-gray-400 py-4 text-center">No projects tracked</div>
            ) : (
              data.project_progress.map((p) => (
                <div key={p.project_id} className="p-3 rounded-xl bg-[#0F141E] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#84CC16]" />
                      <span className="text-xs font-medium text-white">{p.name}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-white/[0.06] text-gray-400">
                        {p.identifier}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">
                      {p.completion_rate}%
                    </span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#84CC16] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, p.completion_rate)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-mono">
                    <span>{p.completed_issues} completed</span>
                    <span>{p.total_issues} total</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workload by Assignee */}
        <div className="p-5 rounded-2xl bg-[#141A24] border border-white/[0.08]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
            Team Workload Distribution
          </h3>
          <div className="space-y-3">
            {data.workload_by_assignee.length === 0 ? (
              <div className="text-xs text-gray-400 py-4 text-center">No assigned work items</div>
            ) : (
              data.workload_by_assignee.map((w, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F141E] border border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={w.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt={w.full_name}
                      className="w-7 h-7 rounded-full bg-white/[0.1] object-cover"
                    />
                    <div>
                      <div className="text-xs font-medium text-white">{w.full_name}</div>
                      <div className="text-[10px] text-gray-400">
                        {w.completed_issues} / {w.total_issues} issues completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[#84CC16]">
                      {w.total_issues}
                    </span>
                    <span className="text-[10px] text-gray-400 block">assigned</span>
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
