import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { CreateIssueModal } from './components/issues/CreateIssueModal';
import { IssueDetailModal } from './components/issues/IssueDetailModal';
import { AITaskPlannerModal } from './components/ai/AITaskPlannerModal';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { ProjectBoardPage } from './pages/ProjectBoardPage';
import { AllIssuesPage } from './pages/AllIssuesPage';
import { MyIssuesPage } from './pages/MyIssuesPage';
import { CyclesPage } from './pages/CyclesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

import { api } from './services/api';
import type { Project, Issue, User, Label } from './types';

const queryClient = new QueryClient();

// Protected Layout Container
const AppShell: React.FC = () => {
  const { user, activeWorkspace, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [activeProjectIdForModal, setActiveProjectIdForModal] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  const slug = activeWorkspace?.slug;

  const loadGlobalWorkspaceData = async () => {
    if (!slug) return;
    try {
      const [projs, mems, lbls] = await Promise.all([
        api.projects.list(slug),
        api.workspaces.listMembers(slug),
        api.labels.list(slug),
      ]);
      setProjects(projs);
      setMembers(mems.map((m) => m.user!).filter(Boolean));
      setLabels(lbls);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGlobalWorkspaceData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-gray-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#84CC16] border-t-transparent animate-spin mb-2" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!activeWorkspace) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center text-center p-4">
        <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-[#84CC16] flex items-center justify-center mb-3">
          ⚡
        </div>
        <h2 className="text-base font-semibold text-white mb-1">Setting up workspace...</h2>
        <p className="text-xs text-gray-400">Please wait while your workspace is being initialized.</p>
      </div>
    );
  }

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes('/projects/')) {
      const pId = path.split('/projects/')[1]?.split('/')[0];
      const found = projects.find((p) => p.id === pId);
      return [
        { label: 'Projects', href: `/workspaces/${slug}/projects` },
        { label: found ? found.name : 'Board' },
      ];
    }
    if (path.includes('/projects')) return [{ label: 'Projects' }];
    if (path.includes('/my-issues')) return [{ label: 'My Issues' }];
    if (path.includes('/issues')) return [{ label: 'All Issues' }];
    if (path.includes('/cycles')) return [{ label: 'Cycles' }];
    if (path.includes('/analytics')) return [{ label: 'Analytics' }];
    if (path.includes('/settings')) return [{ label: 'Settings' }];
    return [{ label: 'Dashboard' }];
  };

  const handleOpenCreateIssue = (projId?: string) => {
    setActiveProjectIdForModal(projId);
    setIsCreateIssueOpen(true);
  };

  const handleOpenAIPlanner = (projId?: string) => {
    setActiveProjectIdForModal(projId);
    setIsAIPlannerOpen(true);
  };

  const handleIssueCreated = () => {
    loadGlobalWorkspaceData();
  };

  const handleProjectCreated = (proj: Project) => {
    setProjects((prev) => [...prev, proj]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-200 flex flex-col">
      <Sidebar
        projects={projects}
        onOpenCreateProject={() => navigate(`/workspaces/${slug}/projects`)}
        onOpenAIPlanner={() => handleOpenAIPlanner()}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        <TopNav
          breadcrumbs={getBreadcrumbs()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenCreateIssue={() => handleOpenCreateIssue()}
          onOpenAIPlanner={() => handleOpenAIPlanner()}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  onOpenCreateIssue={() => handleOpenCreateIssue()}
                  onOpenAIPlanner={() => handleOpenAIPlanner()}
                  onSelectIssue={(i) => setSelectedIssue(i)}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <ProjectsListPage
                  projects={projects}
                  onProjectCreated={handleProjectCreated}
                />
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <ProjectBoardPage
                  onOpenCreateIssue={handleOpenCreateIssue}
                  onOpenAIPlanner={handleOpenAIPlanner}
                  onSelectIssue={(i) => setSelectedIssue(i)}
                />
              }
            />
            <Route
              path="/issues"
              element={
                <AllIssuesPage
                  onOpenCreateIssue={() => handleOpenCreateIssue()}
                  onOpenAIPlanner={() => handleOpenAIPlanner()}
                  onSelectIssue={(i) => setSelectedIssue(i)}
                />
              }
            />
            <Route
              path="/my-issues"
              element={
                <MyIssuesPage
                  onOpenCreateIssue={() => handleOpenCreateIssue()}
                  onSelectIssue={(i) => setSelectedIssue(i)}
                />
              }
            />
            <Route path="/cycles" element={<CyclesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to={`/workspaces/${slug}`} replace />} />
          </Routes>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreateIssue={() => handleOpenCreateIssue()}
        onOpenAIPlanner={() => handleOpenAIPlanner()}
        onSelectIssue={(i) => setSelectedIssue(i)}
      />

      <CreateIssueModal
        isOpen={isCreateIssueOpen}
        onClose={() => setIsCreateIssueOpen(false)}
        projects={projects}
        defaultProjectId={activeProjectIdForModal}
        members={members}
        availableLabels={labels}
        onIssueCreated={handleIssueCreated}
      />

      <AITaskPlannerModal
        isOpen={isAIPlannerOpen}
        onClose={() => setIsAIPlannerOpen(false)}
        projects={projects}
        defaultProjectId={activeProjectIdForModal}
        onTasksCommitted={() => {
          loadGlobalWorkspaceData();
        }}
      />

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdateIssue={(updated) => {
          setSelectedIssue(updated);
          loadGlobalWorkspaceData();
        }}
        onDeleteIssue={() => {
          setSelectedIssue(null);
          loadGlobalWorkspaceData();
        }}
        members={members}
        availableLabels={labels}
      />
    </div>
  );
};

const RootRedirect: React.FC = () => {
  const { user, activeWorkspace, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (activeWorkspace) {
    return <Navigate to={`/workspaces/${activeWorkspace.slug}`} replace />;
  }
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/workspaces/:slug/*" element={<AppShell />} />
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
