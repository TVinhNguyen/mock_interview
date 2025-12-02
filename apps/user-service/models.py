from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(Text, nullable=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(Text, nullable=True)
    job_title = Column(Text, nullable=True)
    experience_level = Column(String(50), nullable=True)  # 'Intern', 'Junior', 'Mid-Level', 'Senior'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "full_name": self.full_name,
            "email": self.email,
            "avatar_url": self.avatar_url,
            "job_title": self.job_title,
            "experience_level": self.experience_level,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
