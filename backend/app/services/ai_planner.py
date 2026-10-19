import os
import json
import re
from typing import List, Dict, Any, Optional
import httpx
from backend.app.core.settings import settings
from backend.app.schemas.ai import AITaskPlanResponse, AITaskSuggestion

class AIPlannerService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()

    def generate_plan(self, prompt: str, project_name: str, existing_tasks_context: Optional[str] = None) -> AITaskPlanResponse:
        """
        Interchangeable AI planning engine.
        Attempts real LLM provider if configured and credentials present,
        otherwise safely falls back to high-grade deterministic engineering decomposition.
        """
        # Try real LLM provider if keys provided
        if self.provider == "openai" and settings.OPENAI_API_KEY:
            try:
                return self._call_openai(prompt, project_name, existing_tasks_context)
            except Exception as e:
                # Resilient fallback with logged notice
                plan = self._generate_deterministic_plan(prompt, project_name)
                plan.summary = f"(OpenAI fallback: {str(e)[:60]}...) " + plan.summary
                return plan

        elif self.provider == "gemini" and settings.GEMINI_API_KEY:
            try:
                return self._call_gemini(prompt, project_name, existing_tasks_context)
            except Exception as e:
                plan = self._generate_deterministic_plan(prompt, project_name)
                plan.summary = f"(Gemini fallback: {str(e)[:60]}...) " + plan.summary
                return plan

        # Default: High-fidelity Deterministic Planner
        return self._generate_deterministic_plan(prompt, project_name)

    def _call_openai(self, prompt: str, project_name: str, context: Optional[str]) -> AITaskPlanResponse:
        system_prompt = (
            "You are a principal software engineer and project manager. "
            "Given a project requirement, decompose it into 3 to 6 atomic, actionable engineering tasks. "
            "Output MUST be strict JSON matching this schema: "
            '{"summary": "...", "suggested_tasks": [{"title": "...", "description": "...", "priority": "urgent|high|medium|low", "status": "todo", "labels": ["..."], "subtasks": ["..."], "acceptance_criteria": ["..."], "order_index": 1}]}'
        )
        user_message = f"Project: {project_name}\nRequirement: {prompt}\nContext: {context or 'None'}"

        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.AI_MODEL or "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }

        with httpx.Client(timeout=15.0) as client:
            resp = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            raw_content = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_content)

            tasks = [AITaskSuggestion(**t) for t in parsed.get("suggested_tasks", [])]
            return AITaskPlanResponse(
                summary=parsed.get("summary", f"AI decomposition for {project_name}"),
                suggested_tasks=tasks,
                provider="openai",
                execution_mode="llm_adapter"
            )

    def _call_gemini(self, prompt: str, project_name: str, context: Optional[str]) -> AITaskPlanResponse:
        api_key = settings.GEMINI_API_KEY
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        system_instruction = (
            "You are a technical project architect. Decompose the user's software requirement into structured engineering tasks. "
            "Return valid JSON only."
        )
        req_body = {
            "contents": [{
                "parts": [{"text": f"{system_instruction}\n\nProject: {project_name}\nRequirement: {prompt}"}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        }

        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, json=req_body)
            resp.raise_for_status()
            data = resp.json()
            text_result = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text_result)
            tasks = [AITaskSuggestion(**t) for t in parsed.get("suggested_tasks", [])]
            return AITaskPlanResponse(
                summary=parsed.get("summary", f"Gemini task breakdown for {project_name}"),
                suggested_tasks=tasks,
                provider="gemini",
                execution_mode="llm_adapter"
            )

    def _generate_deterministic_plan(self, prompt: str, project_name: str) -> AITaskPlanResponse:
        """
        Deterministic, intelligent rule-based planner that analyzes input intent keywords
        (auth, database, api, ui, notifications, payments, analytics, search, testing, performance)
        and constructs concrete, production-grade tasks with rigorous acceptance criteria and subtasks.
        """
        p_lower = prompt.lower()
        tasks: List[AITaskSuggestion] = []
        order = 1

        # Check domain indicators
        is_auth = any(k in p_lower for k in ["auth", "login", "register", "signup", "password", "session", "oauth", "jwt"])
        is_db = any(k in p_lower for k in ["database", "schema", "model", "migration", "table", "sql", "postgres", "data"])
        is_api = any(k in p_lower for k in ["api", "endpoint", "rest", "backend", "fastapi", "service", "route"])
        is_ui = any(k in p_lower for k in ["ui", "frontend", "modal", "page", "component", "design", "dark", "theme", "dashboard"])
        is_payment = any(k in p_lower for k in ["payment", "stripe", "billing", "checkout", "subscription", "price", "invoice"])
        is_ai = any(k in p_lower for k in ["ai", "llm", "planner", "model", "prompt", "smart", "generate", "agent"])
        is_notify = any(k in p_lower for k in ["notify", "notification", "email", "alert", "webhook", "push"])

        # 1. Architecture / Data Layer Task
        if is_db or is_auth or is_payment or not (is_ui and not is_api):
            tasks.append(AITaskSuggestion(
                title=f"Design database schema and domain models for {prompt[:40].strip()}",
                description=f"Create normalized relational models, Alembic migrations, foreign key constraints, and workspace isolation indices for: {prompt}.",
                priority="high",
                status="todo",
                labels=["Backend", "Database"],
                subtasks=[
                    "Define SQLAlchemy models with UUID primary keys and timestamps",
                    "Add unique constraints and indexing for workspace tenant queries",
                    "Generate and verify reversible Alembic migration script"
                ],
                acceptance_criteria=[
                    "Migration applies cleanly forward and backward",
                    "Foreign key cascades prevent orphan records",
                    "All queries filtered by workspace_id"
                ],
                order_index=order
            ))
            order += 1

        # 2. API / Backend Services Task
        tasks.append(AITaskSuggestion(
            title=f"Implement REST API endpoints & business service for {prompt[:45].strip()}",
            description=f"Build versioned /api/v1 endpoints with Pydantic v2 validation, RBAC checks, and error envelopes.",
            priority="urgent" if (is_payment or is_auth) else "high",
            status="todo",
            labels=["Backend", "API"],
            subtasks=[
                "Write Pydantic schemas for request validation and response serialization",
                "Implement route handler with transaction management and audit logging",
                "Integrate dependency injection for authentication and workspace permissions"
            ],
            acceptance_criteria=[
                "All routes documented in OpenAPI /docs",
                "Returns 401 on missing auth, 403 on role violation, 422 on invalid schema",
                "Audit event recorded for state-changing mutations"
            ],
            order_index=order
        ))
        order += 1

        # 3. Frontend Component & State Management Task
        tasks.append(AITaskSuggestion(
            title=f"Develop client-side UI & TanStack Query integration for {prompt[:40].strip()}",
            description=f"Create dark-first, accessible interactive components adhering to ForgeFlow design tokens with optimistic mutation states.",
            priority="high",
            status="todo",
            labels=["Frontend", "UI/UX"],
            subtasks=[
                "Build reusable UI components with Tailwind CSS tokens and micro-interactions",
                "Setup TanStack Query hook with cache invalidation and rollback on error",
                "Implement responsive layouts and keyboard navigation accessibility (WCAG AA)"
            ],
            acceptance_criteria=[
                "UI renders cleanly on desktop and mobile viewports",
                "Shows instantaneous optimistic feedback with loading skeleton states",
                "Accessible via keyboard (tab navigation and Enter/Esc handlers)"
            ],
            order_index=order
        ))
        order += 1

        # 4. Specialized Integration (e.g. AI / Notifications / Payments)
        if is_payment:
            tasks.append(AITaskSuggestion(
                title="Integrate secure webhook handling & payment idempotency",
                description="Implement idempotency keys, signature verification, and transaction rollback for billing workflows.",
                priority="urgent",
                status="todo",
                labels=["Security", "Backend"],
                subtasks=[
                    "Verify webhook HMAC signatures against secret key",
                    "Store processed event IDs to prevent duplicate fulfillment",
                    "Send failure notifications on failed payment attempts"
                ],
                acceptance_criteria=[
                    "Replaying identical webhook payload returns 200 without duplicate execution",
                    "Invalid signatures return 400 Bad Request"
                ],
                order_index=order
            ))
            order += 1
        elif is_ai:
            tasks.append(AITaskSuggestion(
                title="Implement interchangeable LLM adapter with schema validation",
                description="Provide safe LLM provider abstraction with timeout management and deterministic fallback.",
                priority="high",
                status="todo",
                labels=["AI", "Architecture"],
                subtasks=[
                    "Implement provider interface for OpenAI/Gemini/Offline modes",
                    "Validate model responses against strict Pydantic models",
                    "Include editable preview in frontend before batch commit"
                ],
                acceptance_criteria=[
                    "Malformed JSON from LLM does not crash API",
                    "Deterministic mode functions with 0 external network dependencies"
                ],
                order_index=order
            ))
            order += 1

        # 5. Quality Assurance & Automated Tests Task
        tasks.append(AITaskSuggestion(
            title=f"Write comprehensive automated tests for {prompt[:35].strip()}",
            description="Create Pytest unit & integration tests covering authorization, error cases, and client-side test assertions.",
            priority="medium",
            status="todo",
            labels=["QA", "Testing"],
            subtasks=[
                "Write Pytest test cases for 200 OK, 401 Unauthorized, and 403 Forbidden paths",
                "Verify cross-workspace data isolation preventing IDOR vulnerabilities",
                "Add client-side component test for user interaction flow"
            ],
            acceptance_criteria=[
                "Test suite executes with 100% pass rate in CI pipeline",
                "Cross-tenant access explicitly returns 403 or 404"
            ],
            order_index=order
        ))

        summary = f"Decomposed requirement '{prompt}' into {len(tasks)} actionable engineering work items for project '{project_name}'."
        return AITaskPlanResponse(
            summary=summary,
            suggested_tasks=tasks,
            provider="deterministic_engine",
            execution_mode="deterministic_engine"
        )

ai_planner = AIPlannerService()
