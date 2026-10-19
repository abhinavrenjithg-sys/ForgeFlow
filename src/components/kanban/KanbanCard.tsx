import React from 'react';
import { AlertCircle, ArrowUp, Minus, ArrowDown, Calendar } from 'lucide-react';
import type { Issue, IssueStatus } from '../../types';

interface KanbanCardProps {
  issue: Issue;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, issueId: string) => void;
  onMoveToStatus?: (issueId: string, newStatus: IssueStatus) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  issue,
  onClick,
  onDragStart,
  onMoveToStatus,
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'high':
        return <ArrowUp className="w-3.5 h-3.5 text-orange-400" />;
      case 'medium':
        return <Minus className="w-3.5 h-3.5 text-amber-400" />;
      case 'low':
        return <ArrowDown className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Minus className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const isOverdue = issue.due_date && new Date(issue.due_date) < new Date() && issue.status !== 'done';

  const statuses: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      onClick={onClick}
      className="group relative bg-[#141A24] hover:bg-[#19212E] border border-white/[0.08] hover:border-white/[0.18] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-semibold text-gray-400 group-hover:text-[#84CC16] transition-colors">
            {issue.sequence_id}
          </span>
          <div title={`Priority: ${issue.priority}`}>
            {getPriorityIcon(issue.priority)}
          </div>
        </div>

        {onMoveToStatus && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <select
              aria-label="Move issue status"
              value={issue.status}
              onChange={(e) => onMoveToStatus(issue.id, e.target.value as IssueStatus)}
              className="bg-[#0B0F17] text-[10px] text-gray-300 rounded px-1.5 py-0.5 border border-white/[0.1] focus:outline-none focus:border-lime-500 cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Move: {st}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <h4 className="text-xs font-medium text-gray-100 group-hover:text-white line-clamp-2 leading-relaxed mb-2.5">
        {issue.title}
      </h4>

      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {issue.labels.map((lbl) => (
            <span
              key={lbl.id}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-white/[0.06]"
              style={{
                backgroundColor: `${lbl.color_hex}15`,
                color: lbl.color_hex,
              }}
            >
              {lbl.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[11px] text-gray-400">
        <div className="flex items-center gap-2">
          {issue.due_date && (
            <div
              className={`flex items-center gap-1 text-[10px] ${
                isOverdue ? 'text-red-400 font-medium' : 'text-gray-400'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{new Date(issue.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {issue.comments_count ? (
            <span className="text-[10px] text-gray-400 font-mono">
              💬 {issue.comments_count}
            </span>
          ) : null}
        </div>

        {issue.assignee ? (
          <img
            src={issue.assignee.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
            alt={issue.assignee.full_name}
            title={`Assigned to ${issue.assignee.full_name}`}
            className="w-5 h-5 rounded-full ring-1 ring-white/[0.1] object-cover"
          />
        ) : (
          <div
            title="Unassigned"
            className="w-5 h-5 rounded-full border border-dashed border-white/[0.2] flex items-center justify-center text-[10px] text-gray-400"
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
};
