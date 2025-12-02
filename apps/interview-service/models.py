from sqlalchemy import Column, String, DateTime, Integer, Boolean, Text, ARRAY, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class InterviewTemplate(Base):
    __tablename__ = "interview_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(Text, nullable=False)
    description = Column(Text)
    difficulty_level = Column(String(50))  # 'Junior', 'Mid-Level', 'Senior', 'All Levels'
    topics = Column(ARRAY(Text))  # ['Data Structures', 'APIs', 'Database']
    estimated_minutes = Column(Integer, default=45)
    total_questions = Column(Integer, default=10)
    icon_slug = Column(Text)  # 'python', 'java', etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "description": self.description,
            "difficulty_level": self.difficulty_level,
            "topics": self.topics,
            "estimated_minutes": self.estimated_minutes,
            "total_questions": self.total_questions,
            "icon_slug": self.icon_slug,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    type = Column(String(50))  # 'behavioral', 'technical', 'coding', 'system_design'
    difficulty = Column(String(20))  # 'easy', 'medium', 'hard'
    tags = Column(ARRAY(Text))  # ['Python', 'List', 'Dictionary']
    starter_code = Column(Text)
    test_cases = Column(JSONB)
    solution_note = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "content": self.content,
            "type": self.type,
            "difficulty": self.difficulty,
            "tags": self.tags,
            "starter_code": self.starter_code,
            "test_cases": self.test_cases,
            "solution_note": self.solution_note,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey('interview_templates.id'))
    
    # Snapshot data
    title_snapshot = Column(Text)
    level_snapshot = Column(Text)
    
    # Status & Progress
    status = Column(String(50), default='in_progress')  # 'in_progress', 'completed', 'cancelled'
    current_stage = Column(Integer, default=1)
    current_question_index = Column(Integer, default=0)
    
    # Results
    overall_score = Column(Integer)  # 0-100
    duration_seconds = Column(Integer, default=0)
    feedback_summary = Column(Text)
    
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ended_at = Column(DateTime)

    template = relationship("InterviewTemplate")

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "template_id": str(self.template_id) if self.template_id else None,
            "title_snapshot": self.title_snapshot,
            "level_snapshot": self.level_snapshot,
            "status": self.status,
            "current_stage": self.current_stage,
            "current_question_index": self.current_question_index,
            "overall_score": self.overall_score,
            "duration_seconds": self.duration_seconds,
            "feedback_summary": self.feedback_summary,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None
        }

class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey('interviews.id'), nullable=False)
    role = Column(String(20))  # 'ai', 'user', 'system'
    content = Column(Text)
    audio_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    interview = relationship("Interview")

    def to_dict(self):
        return {
            "id": str(self.id),
            "interview_id": str(self.interview_id),
            "role": self.role,
            "content": self.content,
            "audio_url": self.audio_url,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class InterviewScore(Base):
    __tablename__ = "interview_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey('interviews.id'), nullable=False)
    metric_name = Column(Text)  # 'Technical', 'Communication', 'Problem Solving'
    score = Column(Integer)  # 0-100
    feedback = Column(Text)

    interview = relationship("Interview")

    def to_dict(self):
        return {
            "id": str(self.id),
            "interview_id": str(self.interview_id),
            "metric_name": self.metric_name,
            "score": self.score,
            "feedback": self.feedback
        }
