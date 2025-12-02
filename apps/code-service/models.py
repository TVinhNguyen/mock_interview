from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), nullable=False)
    question_id = Column(UUID(as_uuid=True), nullable=True)
    language = Column(String(50), nullable=False)  # 'python', 'javascript', 'java'
    code_content = Column(Text, nullable=False)
    
    # Execution results
    execution_result = Column(JSONB)  # { "status": "success", "output": "...", "errors": "..." }
    test_results = Column(JSONB)  # { "passed": 5, "failed": 2, "details": [...] }
    
    # AI Review
    ai_review = Column(JSONB)  # { "score": 80, "bugs": ["line 5"], "suggestions": [...] }
    
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "interview_id": str(self.interview_id),
            "question_id": str(self.question_id) if self.question_id else None,
            "language": self.language,
            "code_content": self.code_content,
            "execution_result": self.execution_result,
            "test_results": self.test_results,
            "ai_review": self.ai_review,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
