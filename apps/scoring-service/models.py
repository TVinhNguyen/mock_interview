from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class InterviewScore(Base):
    __tablename__ = "interview_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), nullable=False)
    metric_name = Column(Text)  # 'Technical', 'Communication', 'Problem Solving', 'Code Quality'
    score = Column(Integer)  # 0-100
    feedback = Column(Text)

    def to_dict(self):
        return {
            "id": str(self.id),
            "interview_id": str(self.interview_id),
            "metric_name": self.metric_name,
            "score": self.score,
            "feedback": self.feedback
        }
