import React from 'react';
import { AlertCircle, ArrowUp, Minus, ArrowDown } from 'lucide-react';
import type { Issue, IssueStatus, IssuePriority } from '../../types';

interface IssueListViewProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onUpdateStatus?: (issueId: string, status: IssueStatus) => void;
}

export const IssueListView: React.FC<IssueListViewProps> = ({
  issues,
  onSelectIssue,
  onUpdateStatus,
}) => {
  const getPriorityBadge = (priority: IssuePriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-medium"><AlertCircle className="w-3 h-3" /> Urgent</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 font-medium"><ArrowUp className="w-3 h-3" /> High</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium"><Minus className="w-3 h-3" /> Medium</span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 font-medium"><ArrowDown className="w-3 h-3" /> Low</span>;
      default:
        return <span className="text-[11px] text-gray-400">None</span>;
    }
  };

  const statusColors: Record<string, string> = {
    backlog: '#64748B',
    todo: '#38BDF8',
    in_progress: '#F59E0B',
    in_review: '#A855F7',
    done: '#10B981',
  };

  if (issues.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-gray-400 border border-dashed border-white/[0.08] rounded-2xl bg-[#0F141E]/40">
        No issues match your current filters.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F141E]/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#141A24] text-[10px] text-gray-400 uppercase font-semibold border-b border-white/[0.06]">
            <tr>
              <th className="px-4 py-3">Identifier</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {issues.map((issue) => (
              <tr
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-mono font-semibold text-[#84CC16]">
                  {issue.sequence_id}
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium text-white max-w-md truncate">
                    {issue.title}
                  </div>
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {issue.labels.map((l) => (
                        <span
                          key={l.id}
                          className="text-[9px] px-1.5 py-0.2 rounded font-medium"
                          style={{
                            backgroundColor: `${l.color_hex}15`,
                            color: l.color_hex,
                          }}
                        >
                          {l.name}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: statusColors[issue.status] || '#64748B' }}
                    />
                    {onUpdateStatus ? (
                      <select
                        aria-label="Change status"
                        value={issue.status}
                        onChange={(e) => onUpdateStatus(issue.id, e.target.value as IssueStatus)}
                        className="bg-transparent text-xs text-gray-200 capitalize focus:outline-none cursor-pointer"
                      >
                        <option value="backlog" className="bg-[#141A24]">Backlog</option>
                        <option value="todo" className="bg-[#141A24]">Todo</option>
                        <option value="in_progress" className="bg-[#141A24]">In Progress</option>
                        <option value="in_review" className="bg-[#141A24]">In Review</option>
                        <option value="done" className="bg-[#141A24]">Done</option>
                      </select>
                    ) : (
                      <span className="capitalize">{issue.status.replace('_', ' ')}</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {getPriorityBadge(issue.priority)}
                </td>

                <td className="px-4 py-3">
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={issue.assignee.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                        alt={issue.assignee.full_name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="truncate max-w-[120px]">{issue.assignee.full_name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                <td className="px-4 py-3 text-gray-400 font-mono text-[11px]">
                  {issue.due_date ? new Date(issue.due_date).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
