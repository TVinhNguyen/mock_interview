from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import uvicorn

from database import get_db, engine, Base
from models import InterviewTemplate, Question, Interview, InterviewMessage, InterviewScore
from schemas import (
    TemplateResponse, TemplateCreate, InterviewStart, InterviewResponse,
    MessageCreate, MessageResponse, QuestionResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Interview Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Interview Service",
        "version": "1.0.0",
        "status": "running"
    }

# ==================== TEMPLATES ====================

@app.get("/templates", response_model=List[TemplateResponse])
async def get_templates(
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Get all active interview templates for Dashboard"""
    templates = db.query(InterviewTemplate).filter(
        InterviewTemplate.is_active == is_active
    ).all()
    
    return [TemplateResponse(**template.to_dict()) for template in templates]

@app.post("/templates", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template_data: TemplateCreate,
    db: Session = Depends(get_db)
):
    """Create a new interview template (Admin only)"""
    new_template = InterviewTemplate(
        title=template_data.title,
        description=template_data.description,
        difficulty_level=template_data.difficulty_level,
        topics=template_data.topics,
        estimated_minutes=template_data.estimated_minutes,
        total_questions=template_data.total_questions,
        icon_slug=template_data.icon_slug
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    return TemplateResponse(**new_template.to_dict())

@app.get("/templates/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str, db: Session = Depends(get_db)):
    """Get a specific template by ID"""
    template = db.query(InterviewTemplate).filter(
        InterviewTemplate.id == template_id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    return TemplateResponse(**template.to_dict())

# ==================== INTERVIEWS ====================

@app.post("/interviews/start", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
async def start_interview(
    interview_data: InterviewStart,
    db: Session = Depends(get_db)
):
    """Start a new interview session"""
    # Get template
    template = db.query(InterviewTemplate).filter(
        InterviewTemplate.id == interview_data.template_id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found"
        )
    
    # Create interview
    new_interview = Interview(
        user_id=interview_data.user_id,
        template_id=interview_data.template_id,
        title_snapshot=template.title,
        level_snapshot=template.difficulty_level,
        status='in_progress'
    )
    
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)
    
    return InterviewResponse(**new_interview.to_dict())

@app.get("/interviews/{interview_id}", response_model=InterviewResponse)
async def get_interview(interview_id: str, db: Session = Depends(get_db)):
    """Get interview details"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    return InterviewResponse(**interview.to_dict())

@app.get("/interviews/user/{user_id}", response_model=List[InterviewResponse])
async def get_user_interviews(user_id: str, db: Session = Depends(get_db)):
    """Get all interviews for a user"""
    interviews = db.query(Interview).filter(
        Interview.user_id == user_id
    ).order_by(Interview.started_at.desc()).all()
    
    return [InterviewResponse(**interview.to_dict()) for interview in interviews]

@app.put("/interviews/{interview_id}/complete")
async def complete_interview(
    interview_id: str,
    overall_score: int,
    feedback_summary: str = None,
    db: Session = Depends(get_db)
):
    """Mark interview as completed"""
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    interview.status = 'completed'
    interview.overall_score = overall_score
    interview.feedback_summary = feedback_summary
    interview.ended_at = datetime.utcnow()
    
    db.commit()
    db.refresh(interview)
    
    return InterviewResponse(**interview.to_dict())

# ==================== MESSAGES ====================

@app.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db)
):
    """Add a message to interview chat log"""
    new_message = InterviewMessage(
        interview_id=message_data.interview_id,
        role=message_data.role,
        content=message_data.content,
        audio_url=message_data.audio_url
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return MessageResponse(**new_message.to_dict())

@app.get("/messages/{interview_id}", response_model=List[MessageResponse])
async def get_interview_messages(interview_id: str, db: Session = Depends(get_db)):
    """Get all messages for an interview"""
    messages = db.query(InterviewMessage).filter(
        InterviewMessage.interview_id == interview_id
    ).order_by(InterviewMessage.created_at.asc()).all()
    
    return [MessageResponse(**message.to_dict()) for message in messages]

# ==================== QUESTIONS ====================

@app.get("/questions", response_model=List[QuestionResponse])
async def get_questions(
    type: str = None,
    difficulty: str = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get questions (filtered by type/difficulty)"""
    query = db.query(Question)
    
    if type:
        query = query.filter(Question.type == type)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    
    questions = query.limit(limit).all()
    
    return [QuestionResponse(**q.to_dict()) for q in questions]

# ==================== ANALYTICS ====================

@app.get("/analytics/user/{user_id}/stats")
async def get_user_stats(user_id: str, db: Session = Depends(get_db)):
    """Get user statistics for Dashboard"""
    from sqlalchemy import func
    
    # Total sessions
    total_sessions = db.query(func.count(Interview.id)).filter(
        Interview.user_id == user_id
    ).scalar()
    
    # Average score
    avg_score = db.query(func.avg(Interview.overall_score)).filter(
        Interview.user_id == user_id,
        Interview.status == 'completed'
    ).scalar()
    
    # Total practice time (in hours)
    total_seconds = db.query(func.sum(Interview.duration_seconds)).filter(
        Interview.user_id == user_id
    ).scalar() or 0
    
    total_hours = round(total_seconds / 3600, 1)
    
    # Recent sessions
    recent_sessions = db.query(Interview).filter(
        Interview.user_id == user_id,
        Interview.status == 'completed'
    ).order_by(Interview.ended_at.desc()).limit(3).all()
    
    return {
        "total_sessions": total_sessions or 0,
        "average_score": round(avg_score or 0),
        "practice_time_hours": total_hours,
        "recent_sessions": [
            {
                "id": str(s.id),
                "title": s.title_snapshot,
                "score": s.overall_score,
                "date": s.ended_at.isoformat() if s.ended_at else None
            } for s in recent_sessions
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8005, reload=True)
