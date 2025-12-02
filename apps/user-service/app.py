from fastapi import FastAPI, Depends, HTTPException, status, Header, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import uvicorn

from database import get_db, engine, Base
from models import Profile
from schemas import UserRegister, UserLogin, UserResponse, Token, ProfileUpdate
from auth import verify_password, get_password_hash, create_access_token, decode_token

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to verify JWT token
def set_auth_cookie(response: Response, token: str):
    """Set secure HttpOnly cookie for authentication"""
    # Cookie settings tối ưu cho bảo mật
    response.set_cookie(
        key="auth_token",
        value=token,
        max_age=7 * 24 * 60 * 60,  # 7 ngày
        httponly=True,  # Không thể access bằng JavaScript → XSS safe
        secure=False,   # FALSE cho development, TRUE cho production
        samesite="lax", # LAX cho development, STRICT cho production  
        path="/"
    )

async def get_current_user(authorization: Optional[str] = Header(None), request: Request = None, db: Session = Depends(get_db)):
    """Get current user from JWT token - prefer cookie over Authorization header"""
    token = None
    
    # Đọc token từ cookie trước
    if request:
        token = request.cookies.get("auth_token")
    
    # Nếu không có cookie, thử từ Authorization header (fallback)
    if not token and authorization:
        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication scheme"
                )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format"
            )
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required (no token found)"
        )
    
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

@app.get("/")
async def root():
    return {
        "service": "User Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, response: Response, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(Profile).filter(Profile.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = Profile(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        job_title=user_data.job_title,
        experience_level=user_data.experience_level
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    # Set secure HttpOnly cookie
    set_auth_cookie(response, access_token)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**new_user.to_dict())
    }

@app.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(Profile).filter(Profile.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # Set secure HttpOnly cookie
    set_auth_cookie(response, access_token)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.to_dict())
    }

@app.post("/auth/logout")
async def logout(response: Response):
    """Logout user and clear HttpOnly cookie"""
    response.delete_cookie(
        key="auth_token",
        path="/",
        httponly=True,
        secure=False,    # FALSE cho development, TRUE cho production
        samesite="lax"  # LAX cho development, STRICT cho production
    )
    return {"message": "Logged out successfully"}

@app.get("/auth/verify")
async def verify_token(current_user: Profile = Depends(get_current_user)):
    """Verify if token is valid and not expired
    
    Returns:
        200: Token is valid
        401: Token is invalid or expired
    """
    return {
        "valid": True,
        "user_id": str(current_user.id),
        "email": current_user.email
    }

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: Profile = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(**current_user.to_dict())

@app.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url
    if profile_data.job_title is not None:
        current_user.job_title = profile_data.job_title
    if profile_data.experience_level is not None:
        current_user.experience_level = profile_data.experience_level
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(**current_user.to_dict())

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8004, reload=True)
