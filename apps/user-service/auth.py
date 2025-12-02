import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash
    
    Bcrypt has a 72-byte password limit. Passwords longer than this are truncated.
    This is a known limitation of bcrypt algorithm.
    """
    # Encode password and truncate to 72 bytes (bcrypt limit)
    password_bytes = plain_password.encode('utf-8')[:72]
    # Hash must be bytes for bcrypt.checkpw
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt
    
    Bcrypt has a 72-byte password limit. Passwords longer than this are truncated.
    This is a known limitation of bcrypt algorithm.
    Returns the hash as a string (UTF-8 decoded).
    """
    # Encode password and truncate to 72 bytes (bcrypt limit)
    password_bytes = password.encode('utf-8')[:72]
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return as string for database storage
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    """Decode JWT token and validate expiry
    
    Returns:
        dict: Token payload if valid
        None: If token is invalid or expired
    """
    try:
        # jwt.decode tự động kiểm tra expiry nếu có 'exp' claim
        # Sẽ raise ExpiredSignatureError nếu token hết hạn
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            options={"verify_exp": True}  # Explicitly verify expiration
        )
        return payload
    except JWTError as e:
        # Log lỗi để debug (có thể là expired, invalid signature, etc.)
        print(f"Token validation failed: {type(e).__name__}: {str(e)}")
        return None
