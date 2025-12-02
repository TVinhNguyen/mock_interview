"""
Pytest configuration and fixtures for user-service tests.
Provides test database setup, FastAPI test client, and common fixtures.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from datetime import timedelta

from app import app, get_current_user
from database import Base, get_db
from models import Profile
from auth import get_password_hash, create_access_token


# Use PostgreSQL test database (same as production)
SQLALCHEMY_TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres123@postgres-test:5432/interview_test_db"
)

@pytest.fixture(scope="function")
def test_db():
    """Create a fresh test database for each test function"""
    engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
    
    # Drop and recreate all tables for isolation
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Clean up after test
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture(scope="function")
def client(test_db):
    """Create a FastAPI test client with test database"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_user_data():
    """Sample user registration data"""
    return {
        "email": "test@example.com",
        "password": "SecurePass123!",
        "full_name": "Test User",
        "job_title": "Software Engineer",
        "experience_level": "Mid-Level"
    }


@pytest.fixture
def create_user(test_db):
    """Factory fixture to create users in test database"""
    def _create_user(email="user@test.com", password="password123", **kwargs):
        user = Profile(
            email=email,
            password_hash=get_password_hash(password),
            full_name=kwargs.get("full_name", "Test User"),
            job_title=kwargs.get("job_title", "Developer"),
            experience_level=kwargs.get("experience_level", "Junior")
        )
        test_db.add(user)
        test_db.commit()
        test_db.refresh(user)
        return user
    
    return _create_user


@pytest.fixture
def authenticated_client(client, create_user):
    """Create an authenticated test client with a logged-in user"""
    user = create_user(email="auth@test.com", password="testpass123")
    token = create_access_token(data={"sub": str(user.id)})
    
    # Add authorization header to client
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    
    return client, user


@pytest.fixture
def auth_headers(create_user):
    """Generate authentication headers for a test user"""
    def _auth_headers(user=None):
        if user is None:
            user = create_user()
        token = create_access_token(data={"sub": str(user.id)})
        return {"Authorization": f"Bearer {token}"}
    
    return _auth_headers


@pytest.fixture
def multiple_users(test_db):
    """Create multiple test users"""
    users = []
    for i in range(3):
        user = Profile(
            email=f"user{i}@test.com",
            password_hash=get_password_hash(f"password{i}"),
            full_name=f"User {i}",
            job_title=f"Engineer {i}",
            experience_level=["Intern", "Junior", "Mid-Level"][i]
        )
        test_db.add(user)
        users.append(user)
    
    test_db.commit()
    for user in users:
        test_db.refresh(user)
    
    return users
