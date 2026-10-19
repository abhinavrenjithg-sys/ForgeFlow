import React, { useState, useEffect } from 'react';
import { Plus, Calendar, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Project, Cycle } from '../types';

export const CyclesPage: React.FC = () => {
  const { activeWorkspace } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cycles, setCycles] = useState<{ cycle: Cycle; project: Project }[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const slug = activeWorkspace?.slug;

  const loadData = async () => {
    if (!slug) return;
    try {
      const projs = await api.projects.list(slug);
      setProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
      }

      const allCycles: { cycle: Cycle; project: Project }[] = [];
      for (const p of projs) {
        const cList = await api.projects.listCycles(slug, p.id);
        cList.forEach((c) => allCycles.push({ cycle: c, project: p }));
      }
      setCycles(allCycles);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [slug]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !selectedProjectId || !name.trim()) return;

    try {
      await api.projects.createCycle(slug, selectedProjectId, {
        name: name.trim(),
        description: description.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setIsCreateOpen(false);
      setName('');
      setDescription('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Cycles / Sprints</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Timebox engineering delivery into focused iterations
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Cycle</span>
        </button>
      </div>

      <div className="space-y-3">
        {cycles.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 border border-dashed border-white/[0.08] rounded-2xl bg-[#0F141E]/50">
            No active or planned cycles in this workspace. Create a cycle to track your sprint velocity.
          </div>
        ) : (
          cycles.map(({ cycle, project }) => (
            <div
              key={cycle.id}
              className="p-5 rounded-2xl bg-[#141A24] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#84CC16]">
                    {project.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${
                      cycle.status === 'active'
                        ? 'bg-lime-500/15 text-[#84CC16] border border-lime-500/30'
                        : 'bg-white/[0.06] text-gray-400'
                    }`}
                  >
                    {cycle.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white">{cycle.name}</h3>
                {cycle.description && (
                  <p className="text-xs text-gray-400 mt-1">{cycle.description}</p>
                )}

                {(cycle.start_date || cycle.end_date) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {cycle.start_date || 'TBD'} &rarr; {cycle.end_date || 'TBD'}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right sm:border-l sm:border-white/[0.06] sm:pl-6">
                <div className="text-2xl font-bold text-white font-mono">
                  {cycle.issues_count || 0}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Issues in Cycle
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Cycle Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-[#141A24] border border-white/[0.12] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Create New Cycle</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Project
                </label>
                <select
                  aria-label="Cycle project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
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
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Cycle Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sprint 15: Auth & Security"
                  className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals for this timebox..."
                  className="w-full bg-[#0F141E] text-xs text-white p-2.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0F141E] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0F141E] text-xs text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold"
                >
                  Create Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
