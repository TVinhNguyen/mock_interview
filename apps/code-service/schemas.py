from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CodeExecuteRequest(BaseModel):
    code: str
    language: str  # 'python', 'javascript', 'java'
    test_cases: Optional[List[Dict[str, Any]]] = None
    interview_id: Optional[str] = None
    question_id: Optional[str] = None

class ExecutionResult(BaseModel):
    status: str  # 'success', 'error', 'timeout'
    output: str
    errors: str = ""
    test_results: Optional[Dict[str, Any]] = None
    execution_time: float = 0

class SubmissionResponse(BaseModel):
    id: str
    interview_id: str
    question_id: Optional[str] = None
    language: str
    code_content: str
    execution_result: Optional[Dict[str, Any]] = None
    test_results: Optional[Dict[str, Any]] = None
    ai_review: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
