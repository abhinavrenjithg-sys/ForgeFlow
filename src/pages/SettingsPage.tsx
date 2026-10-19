import React, { useState, useEffect } from 'react';
import { Settings, Users, UserPlus, Bot, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { WorkspaceMembership, Role } from '../types';

export const SettingsPage: React.FC = () => {
  const { activeWorkspace, user, refreshWorkspaces } = useAuth();
  const [members, setMembers] = useState<WorkspaceMembership[]>([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<Role>('member');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const slug = activeWorkspace?.slug;
  const isAdmin = activeWorkspace?.current_user_role === 'admin' || activeWorkspace?.owner_id === user?.id;

  const loadMembers = async () => {
    if (!slug) return;
    try {
      const data = await api.workspaces.listMembers(slug);
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeWorkspace) {
      setWorkspaceName(activeWorkspace.name);
      setDescription(activeWorkspace.description || '');
      loadMembers();
    }
  }, [activeWorkspace]);

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !workspaceName.trim()) return;

    setIsSaving(true);
    setStatusMsg(null);
    try {
      await api.workspaces.update(slug, {
        name: workspaceName.trim(),
        description: description.trim() || undefined,
      });
      await refreshWorkspaces();
      setStatusMsg({ text: 'Workspace settings saved successfully!' });
    } catch (err) {
      setStatusMsg({ text: (err as Error).message, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !newMemberEmail.trim()) return;

    setIsAddingMember(true);
    setStatusMsg(null);
    try {
      await api.workspaces.addMember(slug, {
        email: newMemberEmail.trim(),
        role: newMemberRole,
      });
      setNewMemberEmail('');
      loadMembers();
      setStatusMsg({ text: `Invited ${newMemberEmail} to workspace.` });
    } catch (err) {
      setStatusMsg({ text: (err as Error).message, isError: true });
    } finally {
      setIsAddingMember(false);
    }
  };

  if (!activeWorkspace) return null;

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="pb-3 border-b border-white/[0.08]">
        <h1 className="text-lg font-bold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage workspace profile, team members, roles, and AI planner configuration
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            statusMsg.isError
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {statusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="p-6 rounded-2xl bg-[#141A24] border border-white/[0.08] space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Settings className="w-4 h-4 text-[#84CC16]" />
          <h2 className="text-sm font-semibold text-white">General Information</h2>
        </div>

        <form onSubmit={handleSaveWorkspace} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                disabled={!isAdmin}
                className="w-full bg-[#0F141E] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16] disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 font-medium block mb-1">
                Workspace Slug (Unique identifier)
              </label>
              <input
                type="text"
                value={activeWorkspace.slug}
                disabled
                className="w-full bg-[#0F141E] text-xs text-gray-400 px-3 py-2 rounded-lg border border-white/[0.08] font-mono cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 font-medium block mb-1">
              Description / Mission
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isAdmin}
              placeholder="What does your team build?"
              className="w-full bg-[#0F141E] text-xs text-white p-2.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16] disabled:opacity-50"
            />
          </div>

          {isAdmin && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shadow-md shadow-lime-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Team Members & Roles */}
      <div className="p-6 rounded-2xl bg-[#141A24] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#84CC16]" />
            <h2 className="text-sm font-semibold text-white">Team Members & Access Control</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {members.length} members
          </span>
        </div>

        {/* Add Member Input */}
        {isAdmin && (
          <form onSubmit={handleAddMember} className="p-3.5 rounded-xl bg-[#0F141E] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Teammate's registered email address..."
                className="w-full bg-[#141A24] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
                required
              />
            </div>

            <div className="w-full sm:w-36">
              <select
                aria-label="Member role"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as Role)}
                className="w-full bg-[#141A24] text-xs text-white px-2.5 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-[#84CC16]"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAddingMember || !newMemberEmail.trim()}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#A3E635] text-[#0B0F17] text-xs font-semibold shrink-0 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </form>
        )}

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-semibold text-gray-400 border-b border-white/[0.06]">
              <tr>
                <th className="pb-2">User</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {members.map((m) => (
                <tr key={m.id} className="py-2.5">
                  <td className="py-3 flex items-center gap-2.5">
                    <img
                      src={m.user?.avatar_url || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}
                      alt={m.user?.full_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-medium">{m.user?.full_name}</div>
                      <div className="text-[10px] text-gray-400">{m.user?.email}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                        m.role === 'admin'
                          ? 'bg-lime-500/15 text-[#84CC16] border border-lime-500/30'
                          : 'bg-white/[0.06] text-gray-300'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 text-[11px] text-gray-400 font-mono">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Task Planner Engine Status */}
      <div className="p-6 rounded-2xl bg-[#141A24] border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <Bot className="w-4 h-4 text-[#84CC16]" />
          <h2 className="text-sm font-semibold text-white">AI Engine Configuration</h2>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          ForgeFlow includes an interchangeable AI provider adapter. It automatically runs in a deterministic high-fidelity demonstration mode without requiring paid API keys, and seamlessly delegates to OpenAI or Google Gemini if environment variables (`OPENAI_API_KEY`, `GEMINI_API_KEY`) are provided in `.env`.
        </p>
        <div className="p-3 rounded-xl bg-[#0F141E] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">Current AI Execution Engine:</span>
          <span className="text-[#84CC16] font-semibold">Active & Ready (Zero-cost Deterministic + LLM Adapter)</span>
        </div>
      </div>
    </div>
  );
};
