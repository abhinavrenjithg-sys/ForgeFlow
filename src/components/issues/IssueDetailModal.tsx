import React, { useState, useEffect } from 'react';
import { X, Trash2, Send, History } from 'lucide-react';
import type { Issue, IssueStatus, IssuePriority, User as UserType, Comment, ActivityEvent, Label } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onUpdateIssue: (updated: Issue) => void;
  onDeleteIssue: (issueId: string) => void;
  members: UserType[];
  availableLabels: Label[];
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onUpdateIssue,
  onDeleteIssue,
  members,
  availableLabels,
}) => {
  const { activeWorkspace } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('todo');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!issue) return;
    setTitle(issue.title);
    setDescription(issue.description || '');
    setStatus(issue.status);
    setPriority(issue.priority);
    setAssigneeId(issue.assignee_id || '');
    setDueDate(issue.due_date || '');
    setSelectedLabelIds(issue.labels ? issue.labels.map((l) => l.id) : []);

    if (activeWorkspace) {
      api.comments.list(activeWorkspace.slug, issue.id).then(setComments).catch(console.error);
      api.activity.getIssue(activeWorkspace.slug, issue.id).then(setActivities).catch(console.error);
    }
  }, [issue, activeWorkspace]);

  if (!issue || !activeWorkspace) return null;

  const handleSaveField = async (patch: Partial<Issue> & { label_ids?: string[] }) => {
    try {
      const updated = await api.issues.update(activeWorkspace.slug, issue.id, patch);
      onUpdateIssue(updated);
      api.activity.getIssue(activeWorkspace.slug, issue.id).then(setActivities).catch(console.error);
    } catch (err) {
      console.error('Failed to update issue', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    try {
      const comment = await api.comments.create(activeWorkspace.slug, issue.id, newComment.trim());
      setComments((prev) => [...prev, comment]);
      setNewComment('');
      api.activity.getIssue(activeWorkspace.slug, issue.id).then(setActivities).catch(console.error);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleLabel = (labelId: string) => {
    const next = selectedLabelIds.includes(labelId)
      ? selectedLabelIds.filter((id) => id !== labelId)
      : [...selectedLabelIds, labelId];
    setSelectedLabelIds(next);
    handleSaveField({ label_ids: next });
  };

  const handleDelete = async () => {
    try {
      await api.issues.delete(activeWorkspace.slug, issue.id);
      onDeleteIssue(issue.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete issue', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl h-full bg-[#141A24] border-l border-white/[0.1] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-lime-500/10 text-[#84CC16] border border-lime-500/20">
              {issue.sequence_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete issue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isConfirmingDelete && (
          <div className="p-3 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between text-xs text-red-300">
            <span>Are you sure you want to permanently delete this issue?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-2 py-1 rounded bg-white/[0.08] text-white hover:bg-white/[0.15]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (title.trim() && title !== issue.title) {
                  handleSaveField({ title: title.trim() });
                }
              }}
              className="w-full bg-transparent text-xl font-semibold text-white border-b border-transparent hover:border-white/[0.1] focus:border-[#84CC16] focus:outline-none pb-1 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#0F141E] border border-white/[0.06]">
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Status
              </label>
              <select
                aria-label="Issue status"
                value={status}
                onChange={(e) => {
                  const val = e.target.value as IssueStatus;
                  setStatus(val);
                  handleSaveField({ status: val });
                }}
                className="w-full bg-[#141A24] text-xs text-white px-2 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Priority
              </label>
              <select
                aria-label="Issue priority"
                value={priority}
                onChange={(e) => {
                  const val = e.target.value as IssuePriority;
                  setPriority(val);
                  handleSaveField({ priority: val });
                }}
                className="w-full bg-[#141A24] text-xs text-white px-2 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Assignee
              </label>
              <select
                aria-label="Issue assignee"
                value={assigneeId}
                onChange={(e) => {
                  const val = e.target.value;
                  setAssigneeId(val);
                  handleSaveField({ assignee_id: val });
                }}
                className="w-full bg-[#141A24] text-xs text-white px-2 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  const val = e.target.value;
                  setDueDate(val);
                  handleSaveField({ due_date: val });
                }}
                className="w-full bg-[#141A24] text-xs text-white px-2 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-2">Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {availableLabels.map((lbl) => {
                const isSelected = selectedLabelIds.includes(lbl.id);
                return (
                  <button
                    key={lbl.id}
                    type="button"
                    onClick={() => handleToggleLabel(lbl.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'border-[#84CC16] text-[#84CC16] bg-lime-500/10 font-medium shadow-sm'
                        : 'border-white/[0.08] text-gray-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    {lbl.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-2">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => {
                if (description !== (issue.description || '')) {
                  handleSaveField({ description });
                }
              }}
              placeholder="Add details, markdown specification, acceptance criteria..."
              className="w-full bg-[#0F141E] text-xs text-white p-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#84CC16] leading-relaxed resize-y"
            />
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-4 mb-4 border-b border-white/[0.06]">
              <button
                onClick={() => setActiveTab('comments')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'comments'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>Discussion ({comments.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'activity'
                    ? 'text-[#84CC16] border-b-2 border-[#84CC16]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Activity History ({activities.length})</span>
              </button>
            </div>

            {activeTab === 'comments' ? (
              <div className="space-y-4">
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="px-3 py-2 bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-lg bg-[#0F141E] border border-white/[0.06]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-white">
                            {c.author?.full_name || 'Member'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No activity recorded for this issue.
                  </div>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs text-gray-300 py-1.5 border-b border-white/[0.04]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#84CC16] mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium text-white">{act.actor?.full_name || 'System'}</span>{' '}
                        <span className="text-gray-400">
                          {act.verb === 'updated_status'
                            ? `moved this issue from ${act.old_value} to ${act.new_value}`
                            : act.verb === 'assigned'
                            ? `assigned this issue to ${act.new_value}`
                            : act.verb === 'updated_priority'
                            ? `changed priority to ${act.new_value}`
                            : act.verb}
                        </span>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {new Date(act.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
