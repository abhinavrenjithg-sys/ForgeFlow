import { describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AITaskPlannerModal } from '../components/ai/AITaskPlannerModal';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    activeWorkspace: { id: 'ws-1', name: 'Forge Labs', slug: 'forge-labs' },
    user: { id: 'user-1', full_name: 'Alex Mercer' },
  }),
  AuthProvider: ({ children }: any) => children,
}));

describe('AITaskPlannerModal Component', () => {
  it('renders modal when open with inspiration templates', () => {
    const handleClose = vi.fn();
    const mockProjects = [
      {
        id: 'proj-1',
        workspace_id: 'ws-1',
        name: 'Forge Core',
        identifier: 'FORGE',
        status: 'in_progress' as const,
        next_issue_number: 1,
        created_at: '',
        updated_at: '',
      },
    ];

    render(
      <AITaskPlannerModal
        isOpen={true}
        onClose={handleClose}
        projects={mockProjects}
      />
    );

    expect(screen.getByText('AI Task Planner')).toBeInTheDocument();
    expect(
      screen.getByText('Decompose product specs into structured, reviewable engineering tasks')
    ).toBeInTheDocument();
    expect(screen.getByText('Generate Tasks with AI')).toBeInTheDocument();
  });
});
