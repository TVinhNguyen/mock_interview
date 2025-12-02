"""
Tests for database models (models.py).
Tests model creation, validation, and serialization.
"""
import pytest
from datetime import datetime
import uuid

from models import Profile


class TestProfileModel:
    """Test Profile model"""
    
    def test_create_profile_with_all_fields(self, test_db):
        """Should create profile with all fields"""
        profile = Profile(
            email="test@example.com",
            password_hash="hashed_password_123",
            full_name="Test User",
            job_title="Software Engineer",
            experience_level="Mid-Level",
            avatar_url="https://example.com/avatar.jpg"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        assert profile.id is not None
        assert isinstance(profile.id, uuid.UUID)
        assert profile.email == "test@example.com"
        assert profile.full_name == "Test User"
        assert profile.created_at is not None
        assert isinstance(profile.created_at, datetime)
    
    def test_create_profile_with_minimal_fields(self, test_db):
        """Should create profile with only required fields"""
        profile = Profile(
            email="minimal@example.com",
            password_hash="hashed_password"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        assert profile.id is not None
        assert profile.email == "minimal@example.com"
        assert profile.password_hash == "hashed_password"
        assert profile.full_name is None
        assert profile.job_title is None
        assert profile.experience_level is None
    
    def test_profile_unique_email_constraint(self, test_db):
        """Should enforce unique email constraint"""
        email = "unique@example.com"
        
        profile1 = Profile(email=email, password_hash="hash1")
        test_db.add(profile1)
        test_db.commit()
        
        # Try to create another profile with same email
        profile2 = Profile(email=email, password_hash="hash2")
        test_db.add(profile2)
        
        with pytest.raises(Exception):  # SQLAlchemy IntegrityError
            test_db.commit()
    
    def test_profile_id_is_uuid(self, test_db):
        """Profile ID should be UUID type"""
        profile = Profile(
            email="uuid@example.com",
            password_hash="hash"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        assert isinstance(profile.id, uuid.UUID)
        assert len(str(profile.id)) == 36  # UUID string length
    
    def test_profile_auto_generate_id(self, test_db):
        """Should auto-generate UUID on creation"""
        profile = Profile(
            email="autoid@example.com",
            password_hash="hash"
        )
        
        # ID should be None before adding to DB
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        # ID should be generated after commit
        assert profile.id is not None
    
    def test_profile_created_at_auto_set(self, test_db):
        """Should auto-set created_at timestamp"""
        before = datetime.utcnow()
        
        profile = Profile(
            email="timestamp@example.com",
            password_hash="hash"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        after = datetime.utcnow()
        
        assert profile.created_at is not None
        assert before <= profile.created_at <= after


class TestProfileToDict:
    """Test Profile.to_dict() method"""
    
    def test_to_dict_includes_all_fields(self, test_db):
        """to_dict should include all profile fields"""
        profile = Profile(
            email="dict@example.com",
            password_hash="secret_hash",
            full_name="Dict User",
            job_title="Developer",
            experience_level="Junior",
            avatar_url="https://example.com/avatar.jpg"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        profile_dict = profile.to_dict()
        
        assert "id" in profile_dict
        assert "email" in profile_dict
        assert "full_name" in profile_dict
        assert "job_title" in profile_dict
        assert "experience_level" in profile_dict
        assert "avatar_url" in profile_dict
        assert "created_at" in profile_dict
    
    def test_to_dict_excludes_password_hash(self, test_db):
        """to_dict should NOT include password_hash"""
        profile = Profile(
            email="secure@example.com",
            password_hash="secret_hash_123"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        profile_dict = profile.to_dict()
        
        assert "password_hash" not in profile_dict
        assert "password" not in profile_dict
    
    def test_to_dict_id_is_string(self, test_db):
        """to_dict should convert UUID id to string"""
        profile = Profile(
            email="stringid@example.com",
            password_hash="hash"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        profile_dict = profile.to_dict()
        
        assert isinstance(profile_dict["id"], str)
        # Should be valid UUID string
        uuid.UUID(profile_dict["id"])
    
    def test_to_dict_created_at_is_iso_format(self, test_db):
        """to_dict should format created_at as ISO string"""
        profile = Profile(
            email="isodate@example.com",
            password_hash="hash"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        profile_dict = profile.to_dict()
        
        assert isinstance(profile_dict["created_at"], str)
        # Should be parseable as ISO format
        datetime.fromisoformat(profile_dict["created_at"].replace('Z', '+00:00'))
    
    def test_to_dict_with_null_fields(self, test_db):
        """to_dict should handle null optional fields"""
        profile = Profile(
            email="nullfields@example.com",
            password_hash="hash"
        )
        
        test_db.add(profile)
        test_db.commit()
        test_db.refresh(profile)
        
        profile_dict = profile.to_dict()
        
        assert profile_dict["full_name"] is None
        assert profile_dict["avatar_url"] is None
        assert profile_dict["job_title"] is None
        assert profile_dict["experience_level"] is None


class TestProfileQueries:
    """Test querying Profile models"""
    
    def test_query_profile_by_email(self, test_db, create_user):
        """Should query profile by email"""
        email = "query@example.com"
        created_user = create_user(email=email)
        
        queried_user = test_db.query(Profile).filter(Profile.email == email).first()
        
        assert queried_user is not None
        assert queried_user.id == created_user.id
        assert queried_user.email == email
    
    def test_query_profile_by_id(self, test_db, create_user):
        """Should query profile by UUID id"""
        user = create_user()
        user_id = user.id
        
        queried_user = test_db.query(Profile).filter(Profile.id == user_id).first()
        
        assert queried_user is not None
        assert queried_user.id == user_id
    
    def test_query_nonexistent_profile(self, test_db):
        """Should return None for nonexistent profile"""
        result = test_db.query(Profile).filter(Profile.email == "nonexistent@test.com").first()
        
        assert result is None
    
    def test_query_multiple_profiles(self, test_db, multiple_users):
        """Should query multiple profiles"""
        all_users = test_db.query(Profile).all()
        
        assert len(all_users) >= 3
        assert all(isinstance(user, Profile) for user in all_users)
