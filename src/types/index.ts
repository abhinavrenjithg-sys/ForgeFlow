export type Role = 'admin' | 'member' | 'viewer';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';
export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type ProjectStatus = 'planned' | 'in_progress' | 'paused' | 'completed' | 'archived';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  current_user_role?: Role;
  members_count?: number;
  projects_count?: number;
}

export interface WorkspaceMembership {
  id: string;
  workspace_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  user?: User;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string;
  description?: string;
  status: ProjectStatus;
  lead_id?: string;
  start_date?: string;
  target_date?: string;
  next_issue_number: number;
  created_at: string;
  updated_at: string;
  lead?: User;
  issues_count?: number;
  completed_issues_count?: number;
}

export interface Cycle {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'upcoming' | 'active' | 'completed';
  created_at: string;
  issues_count?: number;
}

export interface Label {
  id: string;
  workspace_id: string;
  name: string;
  color_hex: string;
  created_at: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface ActivityEvent {
  id: string;
  workspace_id: string;
  issue_id?: string;
  actor_id: string;
  verb: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
  actor?: User;
}

export interface Notification {
  id: string;
  recipient_id: string;
  workspace_id: string;
  issue_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Issue {
  id: string;
  workspace_id: string;
  project_id: string;
  sequence_id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  order: number;
  assignee_id?: string;
  reporter_id?: string;
  cycle_id?: string;
  parent_issue_id?: string;
  due_date?: string;
  estimate_points?: number;
  created_at: string;
  updated_at: string;
  assignee?: User;
  reporter?: User;
  labels: Label[];
  comments_count?: number;
  subtasks_count?: number;
}

export interface AssigneeWorkload {
  user_id?: string;
  full_name: string;
  avatar_url?: string;
  total_issues: number;
  completed_issues: number;
}

export interface ProjectProgress {
  project_id: string;
  name: string;
  identifier: string;
  total_issues: number;
  completed_issues: number;
  completion_rate: number;
}

export interface AnalyticsData {
  total_issues: number;
  open_issues: number;
  completed_issues: number;
  overdue_issues: number;
  completion_rate: number;
  issues_by_status: Record<string, number>;
  issues_by_priority: Record<string, number>;
  workload_by_assignee: AssigneeWorkload[];
  project_progress: ProjectProgress[];
}

export interface AITaskSuggestion {
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  labels: string[];
  subtasks: string[];
  acceptance_criteria: string[];
  order_index: number;
  selected?: boolean;
}

export interface AITaskPlanResponse {
  summary: string;
  suggested_tasks: AITaskSuggestion[];
  provider: string;
  execution_mode: string;
}
