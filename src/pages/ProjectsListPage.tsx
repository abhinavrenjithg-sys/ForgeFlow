import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Project } from '../types';

interface ProjectsListPageProps {
  projects: Project[];
  onProjectCreated: (project: Project) => void;
}

export const ProjectsListPage: React.FC<ProjectsListPageProps> = ({
  projects,
  onProjectCreated,
}) => {
  const { activeWorkspace } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = activeWorkspace?.slug;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !name.trim() || !identifier.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await api.projects.create(slug, {
        name: name.trim(),
        identifier: identifier.toUpperCase().trim(),
        description: description.trim() || undefined,
      });
      onProjectCreated(created);
      setIsCreateOpen(false);
      setName('');
      setIdentifier('');
      setDescription('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Projects</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Organize workstreams, repositories, and cross-functional teams
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-gray-400 border border-dashed border-white/[0.08] rounded-2xl bg-[#0F141E]/50">
            No projects in this workspace yet. Click "New Project" to get started.
          </div>
        ) : (
          projects.map((proj) => (
            <Link
              key={proj.id}
              to={`/workspaces/${slug}/projects/${proj.id}`}
              className="p-5 rounded-2xl bg-[#141A24] hover:bg-[#19212E] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-lime-500/10 text-[#84CC16] border border-lime-500/20">
                    {proj.identifier}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-gray-400 capitalize">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-[#84CC16] transition-colors mb-1.5">
                  {proj.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span>{proj.issues_count || 0} issues</span>
                <span className="flex items-center gap-1 text-[#84CC16] group-hover:translate-x-0.5 transition-transform">
                  <span>Open board</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-[#141A24] border border-white/[0.12] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-semibold text-white">Create New Project</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!identifier) {
                      setIdentifier(e.target.value.slice(0, 4).toUpperCase());
                    }
                  }}
                  placeholder="e.g., Billing Service"
                  className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Identifier (Prefix for issue keys)
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="e.g., BILL"
                  className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals and domain scope..."
                  className="w-full bg-[#0F141E] text-xs text-white p-2.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                />
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
                  disabled={isSubmitting || !name.trim() || !identifier.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
