import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanCard } from '../components/kanban/KanbanCard';
import type { Issue } from '../types';

const mockIssue: Issue = {
  id: 'test-issue-1',
  workspace_id: 'ws-1',
  project_id: 'proj-1',
  sequence_id: 'FORGE-42',
  title: 'Setup Redis connection pooling',
  description: 'Prevent connection starvation under high load',
  status: 'todo',
  priority: 'urgent',
  order: 1000.0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  labels: [
    { id: 'lbl-1', workspace_id: 'ws-1', name: 'Backend', color_hex: '#84CC16', created_at: '' }
  ],
  comments_count: 2
};

describe('KanbanCard Component', () => {
  it('renders sequence ID, title, and labels', () => {
    const handleClick = vi.fn();
    const handleDragStart = vi.fn();

    render(
      <KanbanCard
        issue={mockIssue}
        onClick={handleClick}
        onDragStart={handleDragStart}
      />
    );

    expect(screen.getByText('FORGE-42')).toBeInTheDocument();
    expect(screen.getByText('Setup Redis connection pooling')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('triggers onClick when the card is clicked', () => {
    const handleClick = vi.fn();
    const handleDragStart = vi.fn();

    render(
      <KanbanCard
        issue={mockIssue}
        onClick={handleClick}
        onDragStart={handleDragStart}
      />
    );

    fireEvent.click(screen.getByText('Setup Redis connection pooling'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('provides accessible keyboard status transition', () => {
    const handleMove = vi.fn();

    render(
      <KanbanCard
        issue={mockIssue}
        onClick={vi.fn()}
        onDragStart={vi.fn()}
        onMoveToStatus={handleMove}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'in_progress' } });
    expect(handleMove).toHaveBeenCalledWith('test-issue-1', 'in_progress');
  });
});
