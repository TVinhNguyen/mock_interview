from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TemplateResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    topics: Optional[List[str]] = None
    estimated_minutes: int = 45
    total_questions: int = 10
    icon_slug: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

class TemplateCreate(BaseModel):
    title: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    topics: Optional[List[str]] = None
    estimated_minutes: int = 45
    total_questions: int = 10
    icon_slug: Optional[str] = None

class InterviewStart(BaseModel):
    template_id: str
    user_id: str

class InterviewResponse(BaseModel):
    id: str
    user_id: str
    template_id: Optional[str] = None
    title_snapshot: Optional[str] = None
    level_snapshot: Optional[str] = None
    status: str
    current_stage: int = 1
    current_question_index: int = 0
    overall_score: Optional[int] = None
    duration_seconds: int = 0
    feedback_summary: Optional[str] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

class MessageCreate(BaseModel):
    interview_id: str
    role: str  # 'ai', 'user', 'system'
    content: str
    audio_url: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    interview_id: str
    role: str
    content: str
    audio_url: Optional[str] = None
    created_at: Optional[datetime] = None

class QuestionResponse(BaseModel):
    id: str
    content: str
    type: str
    difficulty: str
    tags: Optional[List[str]] = None
    starter_code: Optional[str] = None
    created_at: Optional[datetime] = None
