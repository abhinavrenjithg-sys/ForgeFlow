import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Project, User, Label, IssueStatus, IssuePriority, Issue } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId?: string;
  members: User[];
  availableLabels: Label[];
  onIssueCreated: (issue: Issue) => void;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  members,
  availableLabels,
  onIssueCreated,
}) => {
  const { activeWorkspace } = useAuth();
  const [projectId, setProjectId] = useState<string>(
    defaultProjectId || (projects[0]?.id ?? '')
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('todo');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !projectId || !title.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const issue = await api.issues.create(activeWorkspace.slug, {
        project_id: projectId,
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assignee_id: assigneeId || undefined,
        due_date: dueDate || undefined,
        label_ids: selectedLabelIds,
      });
      onIssueCreated(issue);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLabel = (id: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#141A24] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#84CC16]" />
            <h3 className="text-sm font-semibold text-white">Create Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Project</label>
            <select
              aria-label="Target project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.identifier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Implement OAuth callback handler"
              className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background context or acceptance criteria..."
              className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Status</label>
              <select
                aria-label="Initial status"
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full bg-[#0F141E] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Priority</label>
              <select
                aria-label="Initial priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full bg-[#0F141E] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Assignee</label>
              <select
                aria-label="Initial assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-[#0F141E] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
            />
          </div>

          {availableLabels.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1.5">Labels</label>
              <div className="flex flex-wrap gap-1.5">
                {availableLabels.map((lbl) => {
                  const isChecked = selectedLabelIds.includes(lbl.id);
                  return (
                    <button
                      key={lbl.id}
                      type="button"
                      onClick={() => handleToggleLabel(lbl.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        isChecked
                          ? 'border-[#84CC16] text-[#84CC16] bg-lime-500/10 font-medium'
                          : 'border-white/[0.08] text-gray-400 hover:text-white bg-white/[0.02]'
                      }`}
                    >
                      {lbl.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
