from pydantic import BaseModel
from typing import Dict, List, Optional

class AssigneeWorkload(BaseModel):
    user_id: Optional[str] = None
    full_name: str
    avatar_url: Optional[str] = None
    total_issues: int
    completed_issues: int

class ProjectProgress(BaseModel):
    project_id: str
    name: str
    identifier: str
    total_issues: int
    completed_issues: int
    completion_rate: float

class AnalyticsResponse(BaseModel):
    total_issues: int
    open_issues: int
    completed_issues: int
    overdue_issues: int
    completion_rate: float
    issues_by_status: Dict[str, int]
    issues_by_priority: Dict[str, int]
    workload_by_assignee: List[AssigneeWorkload]
    project_progress: List[ProjectProgress]
