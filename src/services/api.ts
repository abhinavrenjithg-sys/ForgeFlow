import type {
  User, Workspace, WorkspaceMembership, Project, Cycle,
  Issue, Label, Comment, ActivityEvent, Notification,
  AnalyticsData, AITaskPlanResponse, AITaskSuggestion
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('forgeflow_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorDetail = `Request failed with status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    register: (data: { email: string; full_name: string; password: string }) =>
      request<{ access_token: string; token_type: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request<User>('/auth/me'),
  },

  // Workspaces
  workspaces: {
    list: () => request<Workspace[]>('/workspaces'),
    create: (data: { name: string; slug: string; description?: string }) =>
      request<Workspace>('/workspaces', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (slug: string) => request<Workspace>(`/workspaces/${slug}`),
    update: (slug: string, data: { name?: string; description?: string }) =>
      request<Workspace>(`/workspaces/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    listMembers: (slug: string) => request<WorkspaceMembership[]>(`/workspaces/${slug}/members`),
    addMember: (slug: string, data: { email: string; role: string }) =>
      request<WorkspaceMembership>(`/workspaces/${slug}/members`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Projects
  projects: {
    list: (slug: string) => request<Project[]>(`/workspaces/${slug}/projects`),
    create: (slug: string, data: { name: string; identifier: string; description?: string; status?: string; target_date?: string }) =>
      request<Project>(`/workspaces/${slug}/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (slug: string, projectId: string) => request<Project>(`/workspaces/${slug}/projects/${projectId}`),
    update: (slug: string, projectId: string, data: Partial<Project>) =>
      request<Project>(`/workspaces/${slug}/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (slug: string, projectId: string) =>
      request<void>(`/workspaces/${slug}/projects/${projectId}`, {
        method: 'DELETE',
      }),
    listCycles: (slug: string, projectId: string) =>
      request<Cycle[]>(`/workspaces/${slug}/projects/${projectId}/cycles`),
    createCycle: (slug: string, projectId: string, data: { name: string; description?: string; start_date?: string; end_date?: string }) =>
      request<Cycle>(`/workspaces/${slug}/projects/${projectId}/cycles`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Issues
  issues: {
    list: (slug: string, params?: Record<string, string | undefined>) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val) query.append(key, val);
        });
      }
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<Issue[]>(`/workspaces/${slug}/issues${qs}`);
    },
    create: (slug: string, data: { project_id: string; title: string; description?: string; status?: string; priority?: string; assignee_id?: string; due_date?: string; label_ids?: string[] }) =>
      request<Issue>(`/workspaces/${slug}/issues`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (slug: string, issueId: string) => request<Issue>(`/workspaces/${slug}/issues/${issueId}`),
    update: (slug: string, issueId: string, data: Partial<Issue> & { label_ids?: string[] }) =>
      request<Issue>(`/workspaces/${slug}/issues/${issueId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (slug: string, issueId: string) =>
      request<void>(`/workspaces/${slug}/issues/${issueId}`, {
        method: 'DELETE',
      }),
  },

  // Comments
  comments: {
    list: (slug: string, issueId: string) =>
      request<Comment[]>(`/workspaces/${slug}/issues/${issueId}/comments`),
    create: (slug: string, issueId: string, content: string) =>
      request<Comment>(`/workspaces/${slug}/issues/${issueId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },

  // Labels
  labels: {
    list: (slug: string) => request<Label[]>(`/workspaces/${slug}/labels`),
    create: (slug: string, data: { name: string; color_hex: string }) =>
      request<Label>(`/workspaces/${slug}/labels`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Activity
  activity: {
    getWorkspace: (slug: string) => request<ActivityEvent[]>(`/workspaces/${slug}/activity`),
    getIssue: (slug: string, issueId: string) =>
      request<ActivityEvent[]>(`/workspaces/${slug}/activity/issue/${issueId}`),
  },

  // Notifications
  notifications: {
    list: (slug: string) => request<Notification[]>(`/workspaces/${slug}/notifications`),
    markRead: (slug: string, notificationId: string) =>
      request<Notification>(`/workspaces/${slug}/notifications/${notificationId}/read`, {
        method: 'PATCH',
      }),
    markAllRead: (slug: string) =>
      request<{ message: string }>(`/workspaces/${slug}/notifications/mark-all-read`, {
        method: 'POST',
      }),
  },

  // Analytics
  analytics: {
    get: (slug: string) => request<AnalyticsData>(`/workspaces/${slug}/analytics`),
  },

  // AI Task Planner
  ai: {
    plan: (slug: string, data: { project_id: string; prompt: string }) =>
      request<AITaskPlanResponse>(`/workspaces/${slug}/ai/plan`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    commit: (slug: string, data: { project_id: string; tasks: Partial<AITaskSuggestion>[] }) =>
      request<{ created_count: number; message: string; created_issue_ids: string[] }>(`/workspaces/${slug}/ai/plan/commit`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
