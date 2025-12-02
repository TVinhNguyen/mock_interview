from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ScoreRequest(BaseModel):
    interview_id: str
    code: Optional[str] = None
    language: Optional[str] = "python"
    test_results: Optional[Dict[str, Any]] = None
    messages: Optional[List[Dict[str, str]]] = None

class MetricScore(BaseModel):
    metric_name: str
    score: int  # 0-100
    feedback: str

class ScoringResponse(BaseModel):
    interview_id: str
    overall_score: int
    metrics: List[MetricScore]
    summary: str
