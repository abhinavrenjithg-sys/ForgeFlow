from pydantic import BaseModel, Field
from typing import List, Optional

class AITaskPlanRequest(BaseModel):
    project_id: str
    prompt: str = Field(..., min_length=5, max_length=2000, description="Natural language product requirement or feature brief")

class AITaskSuggestion(BaseModel):
    title: str
    description: str
    priority: str = "medium"
    status: str = "todo"
    labels: List[str] = []
    subtasks: List[str] = []
    acceptance_criteria: List[str] = []
    order_index: int = 1

class AITaskPlanResponse(BaseModel):
    summary: str
    suggested_tasks: List[AITaskSuggestion]
    provider: str
    execution_mode: str  # "deterministic_engine" | "llm_adapter"

class AICommitTaskItem(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"
    status: str = "todo"
    labels: Optional[List[str]] = []
    subtasks: Optional[List[str]] = []
    acceptance_criteria: Optional[List[str]] = []

class AICommitTasksRequest(BaseModel):
    project_id: str
    tasks: List[AICommitTaskItem]

class AICommitTasksResponse(BaseModel):
    created_count: int
    message: str
    created_issue_ids: List[str]
