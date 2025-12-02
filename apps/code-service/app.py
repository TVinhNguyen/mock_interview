from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import time

from database import get_db, engine, Base
from models import CodeSubmission
from schemas import CodeExecuteRequest, ExecutionResult, SubmissionResponse
from executor import CodeExecutor

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Code Execution Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize code executor
executor = CodeExecutor(timeout=5)

@app.get("/")
async def root():
    return {
        "service": "Code Execution Service",
        "version": "1.0.0",
        "status": "running",
        "supported_languages": ["python"]  # Will add more later
    }

@app.post("/execute", response_model=ExecutionResult)
async def execute_code(request: CodeExecuteRequest):
    """
    Execute code and return results
    Does NOT save to database - just executes
    """
    start_time = time.time()
    
    # Route to appropriate executor
    if request.language.lower() == "python":
        result = executor.execute_python(request.code, request.test_cases)
    elif request.language.lower() == "javascript":
        result = executor.execute_javascript(request.code)
    elif request.language.lower() == "java":
        result = executor.execute_java(request.code)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language: {request.language}"
        )
    
    execution_time = time.time() - start_time
    result["execution_time"] = round(execution_time, 3)
    
    return ExecutionResult(**result)

@app.post("/submit", response_model=SubmissionResponse)
async def submit_code(
    request: CodeExecuteRequest,
    db: Session = Depends(get_db)
):
    """
    Execute code AND save submission to database
    Use this for actual interview submissions
    """
    if not request.interview_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="interview_id is required for submissions"
        )
    
    # Execute code
    start_time = time.time()
    
    if request.language.lower() == "python":
        exec_result = executor.execute_python(request.code, request.test_cases)
    elif request.language.lower() == "javascript":
        exec_result = executor.execute_javascript(request.code)
    elif request.language.lower() == "java":
        exec_result = executor.execute_java(request.code)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language: {request.language}"
        )
    
    execution_time = time.time() - start_time
    exec_result["execution_time"] = round(execution_time, 3)
    
    # Save to database
    submission = CodeSubmission(
        interview_id=request.interview_id,
        question_id=request.question_id,
        language=request.language,
        code_content=request.code,
        execution_result=exec_result,
        test_results=exec_result.get("test_results")
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return SubmissionResponse(**submission.to_dict())

@app.get("/submissions/{interview_id}")
async def get_interview_submissions(
    interview_id: str,
    db: Session = Depends(get_db)
):
    """Get all code submissions for an interview"""
    submissions = db.query(CodeSubmission).filter(
        CodeSubmission.interview_id == interview_id
    ).order_by(CodeSubmission.created_at.desc()).all()
    
    return [SubmissionResponse(**s.to_dict()) for s in submissions]

@app.get("/submissions/latest/{interview_id}")
async def get_latest_submission(
    interview_id: str,
    question_id: str = None,
    db: Session = Depends(get_db)
):
    """Get latest submission for an interview (optionally filtered by question)"""
    query = db.query(CodeSubmission).filter(
        CodeSubmission.interview_id == interview_id
    )
    
    if question_id:
        query = query.filter(CodeSubmission.question_id == question_id)
    
    submission = query.order_by(CodeSubmission.created_at.desc()).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No submissions found"
        )
    
    return SubmissionResponse(**submission.to_dict())

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8006, reload=True)
