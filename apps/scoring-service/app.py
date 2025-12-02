from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import httpx
import os

from database import get_db, engine, Base
from models import InterviewScore
from schemas import ScoreRequest, ScoringResponse, MetricScore
from analyzers import CodeQualityAnalyzer, CommunicationAnalyzer, ProblemSolvingAnalyzer

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scoring Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize analyzers
code_analyzer = CodeQualityAnalyzer()
comm_analyzer = CommunicationAnalyzer()
problem_analyzer = ProblemSolvingAnalyzer()

# Service URLs
INTERVIEW_SERVICE_URL = os.getenv("INTERVIEW_SERVICE_URL", "http://interview-service:8005")

@app.get("/")
async def root():
    return {
        "service": "Scoring Service",
        "version": "1.0.0",
        "status": "running",
        "metrics": ["code_quality", "communication", "problem_solving", "technical_depth"]
    }

@app.post("/score", response_model=ScoringResponse)
async def score_interview(
    request: ScoreRequest,
    db: Session = Depends(get_db)
):
    """
    Comprehensive scoring of an interview
    Analyzes code quality, communication, and problem-solving
    """
    metrics = []
    
    # 1. Code Quality Analysis
    if request.code:
        code_analysis = code_analyzer.analyze(
            request.code,
            request.language or "python",
            request.test_results
        )
        
        code_score = InterviewScore(
            interview_id=request.interview_id,
            metric_name="Code Quality",
            score=code_analysis.get("score", 70),
            feedback=f"Strengths: {', '.join(code_analysis.get('strengths', []))}. " +
                    f"Suggestions: {', '.join(code_analysis.get('suggestions', []))}"
        )
        db.add(code_score)
        
        metrics.append(MetricScore(
            metric_name="Code Quality",
            score=code_analysis.get("score", 70),
            feedback=code_score.feedback
        ))
    
    # 2. Communication Analysis
    if request.messages and len(request.messages) > 0:
        comm_analysis = comm_analyzer.analyze(request.messages)
        
        comm_score = InterviewScore(
            interview_id=request.interview_id,
            metric_name="Communication",
            score=comm_analysis.get("score", 70),
            feedback=comm_analysis.get("feedback", "Good communication")
        )
        db.add(comm_score)
        
        metrics.append(MetricScore(
            metric_name="Communication",
            score=comm_analysis.get("score", 70),
            feedback=comm_score.feedback
        ))
    
    # 3. Problem Solving Analysis
    if request.code or request.messages:
        problem_analysis = problem_analyzer.analyze(
            request.code or "",
            request.messages or [],
            request.test_results
        )
        
        problem_score = InterviewScore(
            interview_id=request.interview_id,
            metric_name="Problem Solving",
            score=problem_analysis.get("score", 70),
            feedback=problem_analysis.get("feedback", "Good problem-solving approach")
        )
        db.add(problem_score)
        
        metrics.append(MetricScore(
            metric_name="Problem Solving",
            score=problem_analysis.get("score", 70),
            feedback=problem_score.feedback
        ))
    
    # 4. Technical Depth (based on conversation complexity)
    if request.messages:
        user_messages = [m for m in request.messages if m.get('role') == 'user']
        avg_length = sum(len(m.get('content', '')) for m in user_messages) / max(len(user_messages), 1)
        
        # Longer, detailed responses = higher technical depth
        tech_score = min(int(50 + (avg_length / 10)), 95)
        
        tech_depth = InterviewScore(
            interview_id=request.interview_id,
            metric_name="Technical Depth",
            score=tech_score,
            feedback=f"Average response length: {int(avg_length)} characters. " +
                    ("Detailed technical discussions." if tech_score > 75 else "Consider more detailed explanations.")
        )
        db.add(tech_depth)
        
        metrics.append(MetricScore(
            metric_name="Technical Depth",
            score=tech_score,
            feedback=tech_depth.feedback
        ))
    
    # Calculate overall score (weighted average)
    if metrics:
        weights = {
            "Code Quality": 0.35,
            "Communication": 0.25,
            "Problem Solving": 0.30,
            "Technical Depth": 0.10
        }
        
        total_weight = 0
        weighted_sum = 0
        
        for metric in metrics:
            weight = weights.get(metric.metric_name, 0.25)
            weighted_sum += metric.score * weight
            total_weight += weight
        
        overall_score = int(weighted_sum / total_weight) if total_weight > 0 else 70
    else:
        overall_score = 70
    
    # Commit all scores
    db.commit()
    
    # Generate summary
    if overall_score >= 85:
        summary = "Excellent performance! Strong technical skills and communication."
    elif overall_score >= 70:
        summary = "Good performance with room for improvement in some areas."
    elif overall_score >= 55:
        summary = "Fair performance. Focus on code quality and problem-solving skills."
    else:
        summary = "Needs improvement. Practice more technical interviews."
    
    return ScoringResponse(
        interview_id=request.interview_id,
        overall_score=overall_score,
        metrics=metrics,
        summary=summary
    )

@app.get("/scores/{interview_id}")
async def get_interview_scores(
    interview_id: str,
    db: Session = Depends(get_db)
):
    """Get all scores for an interview"""
    scores = db.query(InterviewScore).filter(
        InterviewScore.interview_id == interview_id
    ).all()
    
    if not scores:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No scores found for this interview"
        )
    
    metrics = [
        MetricScore(
            metric_name=s.metric_name,
            score=s.score,
            feedback=s.feedback
        ) for s in scores
    ]
    
    # Calculate overall
    overall = int(sum(s.score for s in scores) / len(scores))
    
    return {
        "interview_id": interview_id,
        "overall_score": overall,
        "metrics": metrics
    }

@app.post("/quick-score")
async def quick_score(code: str, language: str = "python"):
    """Quick code quality check without saving to database"""
    analysis = code_analyzer.analyze(code, language)
    return {
        "score": analysis.get("score", 70),
        "analysis": analysis
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    gemini_status = "configured" if os.getenv("GEMINI_API_KEY") else "not configured"
    return {
        "status": "healthy",
        "gemini_ai": gemini_status
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8007, reload=True)
