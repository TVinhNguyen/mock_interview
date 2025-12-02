"""
Unit tests for authentication functions (auth.py).
Tests password hashing, JWT token creation/validation, and token expiry.
"""
import pytest
from datetime import timedelta, datetime
from jose import jwt

from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)


class TestPasswordHashing:
    """Test password hashing and verification"""
    
    def test_password_hash_is_different_from_plain(self):
        """Hashed password should not equal plain password"""
        plain_password = "mySecurePassword123"
        hashed = get_password_hash(plain_password)
        
        assert hashed != plain_password
        assert len(hashed) > 0
    
    def test_same_password_produces_different_hashes(self):
        """Same password should produce different hashes (bcrypt salt)"""
        password = "testPassword"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        assert hash1 != hash2  # Different salts
    
    def test_verify_correct_password(self):
        """Verify password should return True for correct password"""
        password = "correctPassword123"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) is True
    
    def test_verify_incorrect_password(self):
        """Verify password should return False for incorrect password"""
        password = "correctPassword"
        wrong_password = "wrongPassword"
        hashed = get_password_hash(password)
        
        assert verify_password(wrong_password, hashed) is False
    
    def test_verify_empty_password(self):
        """Verify should handle empty passwords"""
        password = "test"
        hashed = get_password_hash(password)
        
        assert verify_password("", hashed) is False


class TestJWTTokenCreation:
    """Test JWT token creation"""
    
    def test_create_token_with_default_expiry(self):
        """Token should be created with default expiry"""
        data = {"sub": "user123"}
        token = create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_create_token_with_custom_expiry(self):
        """Token should accept custom expiry delta"""
        data = {"sub": "user456"}
        custom_delta = timedelta(minutes=15)
        token = create_access_token(data, expires_delta=custom_delta)
        
        assert token is not None
        
        # Decode and verify expiry
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert "exp" in payload
    
    def test_token_contains_provided_data(self):
        """Token payload should contain provided data"""
        data = {"sub": "user789", "email": "test@example.com"}
        token = create_access_token(data)
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == "user789"
        assert payload["email"] == "test@example.com"
    
    def test_token_has_expiry_claim(self):
        """Token should have 'exp' claim"""
        data = {"sub": "user000"}
        token = create_access_token(data)
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert "exp" in payload
        assert isinstance(payload["exp"], (int, float))


class TestJWTTokenDecoding:
    """Test JWT token decoding and validation"""
    
    def test_decode_valid_token(self):
        """Should successfully decode a valid token"""
        data = {"sub": "user123", "role": "admin"}
        token = create_access_token(data)
        
        payload = decode_token(token)
        
        assert payload is not None
        assert payload["sub"] == "user123"
        assert payload["role"] == "admin"
    
    def test_decode_invalid_token(self):
        """Should return None for invalid token"""
        invalid_token = "invalid.token.here"
        
        payload = decode_token(invalid_token)
        
        assert payload is None
    
    def test_decode_expired_token(self):
        """Should return None for expired token"""
        data = {"sub": "user456"}
        # Create token that expires immediately
        token = create_access_token(data, expires_delta=timedelta(seconds=-1))
        
        payload = decode_token(token)
        
        assert payload is None
    
    def test_decode_token_with_wrong_secret(self):
        """Token signed with different secret should fail"""
        data = {"sub": "user789"}
        # Create token with different secret
        wrong_token = jwt.encode(data, "wrong-secret-key", algorithm=ALGORITHM)
        
        payload = decode_token(wrong_token)
        
        assert payload is None
    
    def test_decode_token_missing_claims(self):
        """Should decode token even if missing optional claims"""
        data = {"sub": "user111"}
        token = create_access_token(data)
        
        payload = decode_token(token)
        
        assert payload is not None
        assert "sub" in payload


class TestTokenExpiry:
    """Test token expiration behavior"""
    
    def test_token_expiry_is_future(self):
        """Token expiry should be in the future"""
        data = {"sub": "user222"}
        token = create_access_token(data)
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp_timestamp = payload["exp"]
        
        # Convert to datetime for comparison
        if isinstance(exp_timestamp, datetime):
            exp_time = exp_timestamp
        else:
            exp_time = datetime.fromtimestamp(exp_timestamp)
        
        assert exp_time > datetime.utcnow()
    
    def test_custom_expiry_delta(self):
        """Custom expiry delta should be respected"""
        data = {"sub": "user333"}
        custom_minutes = 30
        token = create_access_token(data, expires_delta=timedelta(minutes=custom_minutes))
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        assert "exp" in payload
        # Verify it's approximately correct (within 1 minute tolerance)
        exp_timestamp = payload["exp"]
        if isinstance(exp_timestamp, datetime):
            exp_time = exp_timestamp
        else:
            exp_time = datetime.fromtimestamp(exp_timestamp)
        
        expected_exp = datetime.utcnow() + timedelta(minutes=custom_minutes)
        time_diff = abs((exp_time - expected_exp).total_seconds())
        
        assert time_diff < 60  # Within 1 minute
