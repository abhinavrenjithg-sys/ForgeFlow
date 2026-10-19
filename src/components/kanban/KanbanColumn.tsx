import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import type { Issue, IssueStatus } from '../../types';

interface KanbanColumnProps {
  status: IssueStatus;
  title: string;
  color: string;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onDragStart: (e: React.DragEvent, issueId: string) => void;
  onDrop: (e: React.DragEvent, targetStatus: IssueStatus) => void;
  onQuickCreateIssue?: (status: IssueStatus, title: string) => Promise<void>;
  onMoveToStatus?: (issueId: string, newStatus: IssueStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  color,
  issues,
  onSelectIssue,
  onDragStart,
  onDrop,
  onQuickCreateIssue,
  onMoveToStatus,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDropInternal = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, status);
  };

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineTitle.trim() || !onQuickCreateIssue) return;
    setIsSubmitting(true);
    try {
      await onQuickCreateIssue(status, inlineTitle.trim());
      setInlineTitle('');
      setIsAddingInline(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropInternal}
      className={`flex flex-col w-80 shrink-0 bg-[#0F141E]/60 border rounded-2xl transition-all duration-150 max-h-[calc(100vh-12rem)] ${
        isDragOver
          ? 'border-[#84CC16]/60 bg-[#141A24]/90 ring-1 ring-[#84CC16]/30'
          : 'border-white/[0.08]'
      }`}
    >
      <div className="p-3.5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            {title}
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 font-medium">
            {issues.length}
          </span>
        </div>

        {onQuickCreateIssue && (
          <button
            onClick={() => setIsAddingInline(true)}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            title={`Add issue to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {isAddingInline && (
        <form onSubmit={handleInlineSubmit} className="p-2 border-b border-white/[0.06] bg-[#141A24]">
          <input
            type="text"
            value={inlineTitle}
            onChange={(e) => setInlineTitle(e.target.value)}
            placeholder="Issue title..."
            className="w-full bg-[#0B0F17] text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/[0.12] focus:outline-none focus:border-[#84CC16]"
            autoFocus
          />
          <div className="flex items-center justify-end gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddingInline(false);
                setInlineTitle('');
              }}
              className="p-1 rounded text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !inlineTitle.trim()}
              className="px-2.5 py-1 bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] rounded text-xs font-semibold disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {issues.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-white/[0.06] rounded-xl">
            Drop issues here
          </div>
        ) : (
          issues.map((issue) => (
            <KanbanCard
              key={issue.id}
              issue={issue}
              onClick={() => onSelectIssue(issue)}
              onDragStart={onDragStart}
              onMoveToStatus={onMoveToStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};
