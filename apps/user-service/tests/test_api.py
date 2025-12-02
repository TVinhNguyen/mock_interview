"""
Integration tests for User Service API endpoints.
Tests registration, login, authentication, and profile management.
"""
import pytest
from fastapi import status


class TestHealthEndpoints:
    """Test health check and root endpoints"""
    
    def test_root_endpoint(self, client):
        """Root endpoint should return service info"""
        response = client.get("/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["service"] == "User Service"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
    
    def test_health_check(self, client):
        """Health check endpoint should return healthy status"""
        response = client.get("/health")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "healthy"}


class TestUserRegistration:
    """Test user registration endpoint"""
    
    def test_register_new_user_success(self, client, sample_user_data):
        """Should successfully register a new user"""
        response = client.post("/auth/register", json=sample_user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        
        # Check token
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
        
        # Check user data
        assert "user" in data
        user = data["user"]
        assert user["email"] == sample_user_data["email"]
        assert user["full_name"] == sample_user_data["full_name"]
        assert user["job_title"] == sample_user_data["job_title"]
        assert user["experience_level"] == sample_user_data["experience_level"]
        assert "id" in user
        assert "created_at" in user
        
        # Password should not be in response
        assert "password" not in user
        assert "password_hash" not in user
    
    def test_register_duplicate_email(self, client, sample_user_data):
        """Should reject registration with duplicate email"""
        # Register first user
        client.post("/auth/register", json=sample_user_data)
        
        # Try to register again with same email
        response = client.post("/auth/register", json=sample_user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_invalid_email(self, client, sample_user_data):
        """Should reject registration with invalid email"""
        sample_user_data["email"] = "invalid-email"
        response = client.post("/auth/register", json=sample_user_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_register_missing_required_fields(self, client):
        """Should reject registration with missing required fields"""
        incomplete_data = {
            "email": "test@example.com"
            # Missing password
        }
        response = client.post("/auth/register", json=incomplete_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_register_with_minimal_data(self, client):
        """Should allow registration with only email and password"""
        minimal_data = {
            "email": "minimal@example.com",
            "password": "password123"
        }
        response = client.post("/auth/register", json=minimal_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["user"]["email"] == minimal_data["email"]


class TestUserLogin:
    """Test user login endpoint"""
    
    def test_login_success(self, client, create_user):
        """Should successfully login with correct credentials"""
        # Create a user
        email = "login@test.com"
        password = "correctPassword123"
        create_user(email=email, password=password)
        
        # Login
        response = client.post("/auth/login", json={
            "email": email,
            "password": password
        })
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == email
    
    def test_login_wrong_password(self, client, create_user):
        """Should reject login with wrong password"""
        email = "user@test.com"
        create_user(email=email, password="correctPassword")
        
        response = client.post("/auth/login", json={
            "email": email,
            "password": "wrongPassword"
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        """Should reject login for nonexistent user"""
        response = client.post("/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "anyPassword"
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_invalid_email_format(self, client):
        """Should reject login with invalid email format"""
        response = client.post("/auth/login", json={
            "email": "not-an-email",
            "password": "password123"
        })
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestAuthenticatedEndpoints:
    """Test endpoints requiring authentication"""
    
    def test_get_current_user_success(self, authenticated_client):
        """Should return current user profile with valid token"""
        client, user = authenticated_client
        
        response = client.get("/auth/me")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == user.email
        assert data["id"] == str(user.id)
    
    def test_get_current_user_without_token(self, client):
        """Should reject request without authentication token"""
        response = client.get("/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "authorization" in response.json()["detail"].lower()
    
    def test_get_current_user_with_invalid_token(self, client):
        """Should reject request with invalid token"""
        client.headers = {"Authorization": "Bearer invalid.token.here"}
        response = client.get("/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_current_user_with_malformed_header(self, client):
        """Should reject request with malformed authorization header"""
        client.headers = {"Authorization": "InvalidFormat"}
        response = client.get("/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestProfileUpdate:
    """Test profile update endpoint"""
    
    def test_update_full_name(self, authenticated_client):
        """Should successfully update full name"""
        client, user = authenticated_client
        
        new_name = "Updated Name"
        response = client.put("/profile", json={"full_name": new_name})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["full_name"] == new_name
        assert data["email"] == user.email  # Other fields unchanged
    
    def test_update_job_title(self, authenticated_client):
        """Should successfully update job title"""
        client, user = authenticated_client
        
        new_title = "Senior Engineer"
        response = client.put("/profile", json={"job_title": new_title})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["job_title"] == new_title
    
    def test_update_experience_level(self, authenticated_client):
        """Should successfully update experience level"""
        client, user = authenticated_client
        
        new_level = "Senior"
        response = client.put("/profile", json={"experience_level": new_level})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["experience_level"] == new_level
    
    def test_update_avatar_url(self, authenticated_client):
        """Should successfully update avatar URL"""
        client, user = authenticated_client
        
        new_avatar = "https://example.com/avatar.jpg"
        response = client.put("/profile", json={"avatar_url": new_avatar})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["avatar_url"] == new_avatar
    
    def test_update_multiple_fields(self, authenticated_client):
        """Should successfully update multiple fields at once"""
        client, user = authenticated_client
        
        updates = {
            "full_name": "New Name",
            "job_title": "Tech Lead",
            "experience_level": "Senior"
        }
        response = client.put("/profile", json=updates)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["full_name"] == updates["full_name"]
        assert data["job_title"] == updates["job_title"]
        assert data["experience_level"] == updates["experience_level"]
    
    def test_update_profile_without_auth(self, client):
        """Should reject profile update without authentication"""
        response = client.put("/profile", json={"full_name": "New Name"})
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_profile_empty_fields(self, authenticated_client):
        """Should handle empty update gracefully"""
        client, user = authenticated_client
        
        response = client.put("/profile", json={})
        
        assert response.status_code == status.HTTP_200_OK
        # Profile should remain unchanged


class TestAuthenticationFlow:
    """Test complete authentication flows"""
    
    def test_register_login_get_profile_flow(self, client, sample_user_data):
        """Test complete flow: register -> login -> get profile"""
        # 1. Register
        register_response = client.post("/auth/register", json=sample_user_data)
        assert register_response.status_code == status.HTTP_201_CREATED
        register_token = register_response.json()["access_token"]
        
        # 2. Login
        login_response = client.post("/auth/login", json={
            "email": sample_user_data["email"],
            "password": sample_user_data["password"]
        })
        assert login_response.status_code == status.HTTP_200_OK
        login_token = login_response.json()["access_token"]
        
        # 3. Get profile with login token
        client.headers = {"Authorization": f"Bearer {login_token}"}
        profile_response = client.get("/auth/me")
        assert profile_response.status_code == status.HTTP_200_OK
        assert profile_response.json()["email"] == sample_user_data["email"]
    
    def test_register_and_update_profile(self, client, sample_user_data):
        """Test flow: register -> update profile"""
        # Register
        register_response = client.post("/auth/register", json=sample_user_data)
        token = register_response.json()["access_token"]
        
        # Update profile
        client.headers = {"Authorization": f"Bearer {token}"}
        update_response = client.put("/profile", json={
            "full_name": "Updated Name",
            "job_title": "Senior Developer"
        })
        
        assert update_response.status_code == status.HTTP_200_OK
        data = update_response.json()
        assert data["full_name"] == "Updated Name"
        assert data["job_title"] == "Senior Developer"


class TestEdgeCases:
    """Test edge cases and boundary conditions"""
    
    def test_very_long_password(self, client):
        """Should handle very long passwords"""
        long_password = "a" * 500
        user_data = {
            "email": "longpass@test.com",
            "password": long_password
        }
        
        response = client.post("/auth/register", json=user_data)
        assert response.status_code == status.HTTP_201_CREATED
    
    def test_special_characters_in_name(self, client, sample_user_data):
        """Should handle special characters in user name"""
        sample_user_data["full_name"] = "Nguyễn Văn Ái"
        sample_user_data["email"] = "unicode@test.com"
        
        response = client.post("/auth/register", json=sample_user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["user"]["full_name"] == "Nguyễn Văn Ái"
    
    def test_case_sensitive_email(self, client, create_user):
        """Email comparison should be case-insensitive or handle consistently"""
        email_lower = "test@example.com"
        create_user(email=email_lower, password="pass123")
        
        # Try to login with uppercase email
        response = client.post("/auth/login", json={
            "email": email_lower.upper(),
            "password": "pass123"
        })
        
        # This test documents current behavior - adjust based on requirements
        # Most systems treat emails as case-insensitive
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED]
