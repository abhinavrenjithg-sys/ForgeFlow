import React, { useState } from 'react';
import {
  Sparkles, X, Check, CheckSquare, Square, ChevronDown,
  ChevronRight, AlertCircle, Bot
} from 'lucide-react';
import type { Project, AITaskSuggestion, AITaskPlanResponse, IssuePriority } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AITaskPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId?: string;
  onTasksCommitted?: (createdCount: number) => void;
}

export const AITaskPlannerModal: React.FC<AITaskPlannerModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  onTasksCommitted,
}) => {
  const { activeWorkspace } = useAuth();
  const [projectId, setProjectId] = useState<string>(
    defaultProjectId || (projects[0]?.id ?? '')
  );
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [planResponse, setPlanResponse] = useState<AITaskPlanResponse | null>(null);
  const [tasks, setTasks] = useState<AITaskSuggestion[]>([]);
  const [expandedTaskIndices, setExpandedTaskIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const quickTemplates = [
    'OAuth2 authentication with Google and GitHub session management',
    'Stripe webhook handling with idempotency keys and error recovery',
    'Real-time WebSocket event streaming and collaborative activity feed',
    'Customer NPS feedback collection modal with rating breakdown',
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeWorkspace || !projectId || !prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const resp = await api.ai.plan(activeWorkspace.slug, {
        project_id: projectId,
        prompt: prompt.trim(),
      });
      setPlanResponse(resp);
      const withSelection = resp.suggested_tasks.map((t) => ({ ...t, selected: true }));
      setTasks(withSelection);
      setExpandedTaskIndices([0]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSelectAll = () => {
    const allSelected = tasks.every((t) => t.selected);
    setTasks((prev) => prev.map((t) => ({ ...t, selected: !allSelected })));
  };

  const handleToggleTaskSelection = (index: number) => {
    setTasks((prev) =>
      prev.map((t, idx) => (idx === index ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleUpdateTaskField = (index: number, field: keyof AITaskSuggestion, value: any) => {
    setTasks((prev) =>
      prev.map((t, idx) => (idx === index ? { ...t, [field]: value } : t))
    );
  };

  const toggleExpand = (index: number) => {
    setExpandedTaskIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCommit = async () => {
    if (!activeWorkspace || !projectId) return;
    const selectedTasks = tasks.filter((t) => t.selected);
    if (selectedTasks.length === 0) {
      setError('Please select at least one task to commit.');
      return;
    }

    setIsCommitting(true);
    setError(null);
    try {
      const resp = await api.ai.commit(activeWorkspace.slug, {
        project_id: projectId,
        tasks: selectedTasks.map((t) => ({
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          labels: t.labels,
          subtasks: t.subtasks,
          acceptance_criteria: t.acceptance_criteria,
        })),
      });

      setSuccessMessage(resp.message);
      if (onTasksCommitted) {
        onTasksCommitted(resp.created_count);
      }
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setPlanResponse(null);
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCommitting(false);
    }
  };

  const selectedCount = tasks.filter((t) => t.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-[#141A24] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0F141E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-[#84CC16]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Task Planner</h3>
              <span className="text-[11px] text-gray-400">
                Decompose product specs into structured, reviewable engineering tasks
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#0F141E] border border-white/[0.06] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="w-full sm:w-64">
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
                  Target Project
                </label>
                <select
                  aria-label="Target project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#141A24] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.identifier})
                    </option>
                  ))}
                </select>
              </div>

              {planResponse && (
                <div className="text-[11px] text-gray-400 font-mono bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>
                    Provider: <strong className="text-white">{planResponse.provider}</strong> ({planResponse.execution_mode})
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">
                Feature Brief or Requirement
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to build (e.g. 'Build user authentication with email verification, password reset, and rate limiting')..."
                className="w-full bg-[#141A24] text-xs text-white p-3 rounded-xl border border-white/[0.08] focus:outline-none focus:border-[#84CC16] leading-relaxed"
              />
            </div>

            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1.5">
                Quick inspiration templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(tmpl)}
                    className="text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors text-left"
                  >
                    + {tmpl.split(' ').slice(0, 4).join(' ')}...
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isGenerating ? 'Generating Structured Plan...' : 'Generate Tasks with AI'}</span>
              </button>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Proposed Engineering Tasks ({tasks.length})
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Review and edit tasks before committing to the project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-xs text-[#84CC16] hover:underline"
                >
                  {tasks.every((t) => t.selected) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task, idx) => {
                  const isExpanded = expandedTaskIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        task.selected
                          ? 'bg-[#0F141E] border-white/[0.12]'
                          : 'bg-[#0F141E]/40 border-white/[0.04] opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTaskSelection(idx)}
                          className="mt-0.5 text-[#84CC16] hover:opacity-80"
                        >
                          {task.selected ? (
                            <CheckSquare className="w-4 h-4 fill-lime-500/20" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => handleUpdateTaskField(idx, 'title', e.target.value)}
                              className="bg-transparent text-xs font-semibold text-white border-b border-transparent hover:border-white/[0.1] focus:border-[#84CC16] focus:outline-none flex-1 py-0.5"
                            />

                            <div className="flex items-center gap-2">
                              <select
                                aria-label="Task priority"
                                value={task.priority}
                                onChange={(e) => handleUpdateTaskField(idx, 'priority', e.target.value as IssuePriority)}
                                className="bg-[#141A24] text-[11px] text-gray-300 px-2 py-1 rounded border border-white/[0.08]"
                              >
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => toggleExpand(idx)}
                                className="p-1 rounded text-gray-400 hover:text-white"
                              >
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={isExpanded ? 3 : 1}
                            value={task.description}
                            onChange={(e) => handleUpdateTaskField(idx, 'description', e.target.value)}
                            className="w-full bg-[#141A24] text-xs text-gray-300 p-2 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#84CC16] leading-relaxed resize-y"
                          />

                          {isExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/[0.04] text-xs">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                                  Subtasks
                                </span>
                                <ul className="space-y-1 text-gray-300">
                                  {task.subtasks.map((st, sidx) => (
                                    <li key={sidx} className="flex items-center gap-1.5 text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500/50" />
                                      <span>{st}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                                  Acceptance Criteria
                                </span>
                                <ul className="space-y-1 text-gray-300">
                                  {task.acceptance_criteria.map((ac, aidx) => (
                                    <li key={aidx} className="flex items-center gap-1.5 text-[11px]">
                                      <Check className="w-3 h-3 text-[#84CC16] shrink-0" />
                                      <span>{ac}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0F141E] flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {tasks.length > 0 && (
              <span>
                <strong className="text-white">{selectedCount}</strong> of {tasks.length} tasks selected for creation
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel
            </button>

            {tasks.length > 0 && (
              <button
                type="button"
                onClick={handleCommit}
                disabled={isCommitting || selectedCount === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isCommitting
                    ? 'Creating Issues in Database...'
                    : `Commit ${selectedCount} Tasks to Project`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
