"""
API Gateway - Orchestrates all microservices
"""
import os
import httpx
from fastapi import FastAPI, File, UploadFile, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response, JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

app = FastAPI(title="AI Mock Interview - API Gateway", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Microservices URLs
STT_SERVICE_URL = os.getenv("STT_SERVICE_URL", "http://stt-service:8001")
LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://llm-service:8002")
TTS_SERVICE_URL = os.getenv("TTS_SERVICE_URL", "http://tts-service:8003")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8004")
INTERVIEW_SERVICE_URL = os.getenv("INTERVIEW_SERVICE_URL", "http://interview-service:8005")
CODE_SERVICE_URL = os.getenv("CODE_SERVICE_URL", "http://code-service:8006")
SCORING_SERVICE_URL = os.getenv("SCORING_SERVICE_URL", "http://scoring-service:8007")


class StartInterviewRequest(BaseModel):
    session_id: str
    position: Optional[str] = "Backend Developer"
    level: Optional[str] = "Junior"


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/health")
async def health_check():
    """Health check for all services"""
    async with httpx.AsyncClient() as client:
        services_status = {}
        
        services = {
            "stt": STT_SERVICE_URL,
            "llm": LLM_SERVICE_URL,
            "tts": TTS_SERVICE_URL,
            "user": USER_SERVICE_URL,
            "interview": INTERVIEW_SERVICE_URL,
            "code": CODE_SERVICE_URL,
            "scoring": SCORING_SERVICE_URL
        }
        
        for name, url in services.items():
            try:
                health_check = await client.get(f"{url}/health", timeout=5.0)
                services_status[name] = health_check.json()
            except:
                services_status[name] = {"status": "unhealthy"}
        
        try:
            llm_health = await client.get(f"{LLM_SERVICE_URL}/health", timeout=5.0)
            services_status["llm"] = llm_health.json()
        except:
            services_status["llm"] = {"status": "unhealthy"}
        
        try:
            tts_health = await client.get(f"{TTS_SERVICE_URL}/health", timeout=5.0)
            services_status["tts"] = tts_health.json()
        except:
            services_status["tts"] = {"status": "unhealthy"}
    
    return {
        "gateway": "healthy",
        "services": services_status
    }


@app.post("/interview/start")
async def start_interview(request: StartInterviewRequest):
    """
    Start a new interview session
    Returns the AI's opening message
    """
    async with httpx.AsyncClient() as client:
        try:
            # Start LLM session
            response = await client.post(
                f"{LLM_SERVICE_URL}/session/start",
                json={
                    "session_id": request.session_id,
                    "position": request.position,
                    "level": request.level
                },
                timeout=30.0
            )
            llm_data = response.json()
            
            # Convert AI greeting to speech
            tts_response = await client.post(
                f"{TTS_SERVICE_URL}/synthesize",
                json={"text": llm_data["message"]},
                timeout=30.0
            )
            tts_data = tts_response.json()
            
            return {
                "success": True,
                "session_id": request.session_id,
                "ai_message": llm_data["message"],
                "audio_url": tts_data['audio_url'].replace('/audio/', '/proxy/audio/')
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")


@app.post("/interview/respond-audio")
async def respond_with_audio(
    session_id: str,
    audio: UploadFile = File(...)
):
    """
    Complete interview flow:
    1. Transcribe user's audio (STT)
    2. Get AI response (LLM)
    3. Convert AI response to speech (TTS)
    """
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            # Step 1: Transcribe audio
            files = {"file": (audio.filename, await audio.read(), audio.content_type)}
            stt_response = await client.post(
                f"{STT_SERVICE_URL}/transcribe",
                files=files
            )
            stt_data = stt_response.json()
            user_text = stt_data["text"]
            
            # Step 2: Get AI response
            llm_response = await client.post(
                f"{LLM_SERVICE_URL}/chat",
                json={
                    "session_id": session_id,
                    "message": user_text
                }
            )
            llm_data = llm_response.json()
            ai_text = llm_data["ai_response"]
            
            # Step 3: Convert to speech
            tts_response = await client.post(
                f"{TTS_SERVICE_URL}/synthesize",
                json={"text": ai_text}
            )
            tts_data = tts_response.json()
            
            return {
                "success": True,
                "session_id": session_id,
                "user_message": user_text,
                "ai_message": ai_text,
                "audio_url": tts_data['audio_url'].replace('/audio/', '/proxy/audio/')
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Interview flow failed: {str(e)}")


@app.post("/interview/respond-text")
async def respond_with_text(request: ChatRequest):
    """
    Text-only interview flow (no audio):
    1. Send user text to LLM
    2. Get AI response
    3. Convert to speech
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Get AI response
            llm_response = await client.post(
                f"{LLM_SERVICE_URL}/chat",
                json={
                    "session_id": request.session_id,
                    "message": request.message
                }
            )
            llm_data = llm_response.json()
            ai_text = llm_data["ai_response"]
            
            # Convert to speech
            tts_response = await client.post(
                f"{TTS_SERVICE_URL}/synthesize",
                json={"text": ai_text}
            )
            tts_data = tts_response.json()
            
            return {
                "success": True,
                "session_id": request.session_id,
                "user_message": request.message,
                "ai_message": ai_text,
                "audio_url": tts_data['audio_url'].replace('/audio/', '/proxy/audio/')
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Interview flow failed: {str(e)}")


@app.get("/proxy/audio/{filename}")
async def proxy_audio(filename: str):
    """
    Proxy audio files from TTS service to frontend
    This is needed because frontend cannot access internal Docker network
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{TTS_SERVICE_URL}/audio/{filename}",
                timeout=10.0
            )
            return Response(
                content=response.content,
                media_type="audio/mpeg",
                headers={"Content-Disposition": f"inline; filename={filename}"}
            )
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Audio file not found: {str(e)}")


@app.delete("/interview/{session_id}")
async def end_interview(session_id: str):
    """
    End interview session
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(
                f"{LLM_SERVICE_URL}/session/{session_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to end interview: {str(e)}")


# ==================== USER SERVICE ROUTES ====================

@app.post("/auth/register")
async def register(request: Request):
    """Register new user"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{USER_SERVICE_URL}/auth/register",
                json=body,
                timeout=10.0
            )
            return response.json()
        except httpx.HTTPStatusError as e:
            return JSONResponse(status_code=e.response.status_code, content=e.response.json())
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
async def login(request: Request):
    """Login user"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{USER_SERVICE_URL}/auth/login",
                json=body,
                timeout=10.0
            )
            return response.json()
        except httpx.HTTPStatusError as e:
            return JSONResponse(status_code=e.response.status_code, content=e.response.json())
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/auth/me")
async def get_current_user(authorization: str = Header(None)):
    """Get current user"""
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.get(
                f"{USER_SERVICE_URL}/auth/me",
                headers=headers,
                timeout=10.0
            )
            return response.json()
        except httpx.HTTPStatusError as e:
            return JSONResponse(status_code=e.response.status_code, content=e.response.json())
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.put("/profile")
async def update_profile(request: Request, authorization: str = Header(None)):
    """Update user profile"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.put(
                f"{USER_SERVICE_URL}/profile",
                json=body,
                headers=headers,
                timeout=10.0
            )
            return response.json()
        except httpx.HTTPStatusError as e:
            return JSONResponse(status_code=e.response.status_code, content=e.response.json())
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==================== INTERVIEW SERVICE ROUTES ====================

@app.get("/templates")
async def get_templates():
    """Get interview templates"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{INTERVIEW_SERVICE_URL}/templates", timeout=10.0)
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/interviews/start")
async def start_interview_session(request: Request):
    """Start interview"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{INTERVIEW_SERVICE_URL}/interviews/start",
                json=body,
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/interviews/{interview_id}")
async def get_interview_details(interview_id: str):
    """Get interview details"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{INTERVIEW_SERVICE_URL}/interviews/{interview_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/interviews/user/{user_id}")
async def get_user_interviews(user_id: str):
    """Get user's interviews"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{INTERVIEW_SERVICE_URL}/interviews/user/{user_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get user statistics for dashboard"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{INTERVIEW_SERVICE_URL}/analytics/user/{user_id}/stats",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/messages")
async def create_message(request: Request):
    """Add message to interview"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{INTERVIEW_SERVICE_URL}/messages",
                json=body,
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{interview_id}")
async def get_messages(interview_id: str):
    """Get interview messages"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{INTERVIEW_SERVICE_URL}/messages/{interview_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==================== CODE EXECUTION SERVICE ROUTES ====================

@app.post("/code/execute")
async def execute_code(request: Request):
    """Execute code"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{CODE_SERVICE_URL}/execute",
                json=body,
                timeout=30.0  # Longer timeout for code execution
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/code/submit")
async def submit_code(request: Request):
    """Submit code for interview"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{CODE_SERVICE_URL}/submit",
                json=body,
                timeout=30.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/code/submissions/{interview_id}")
async def get_submissions(interview_id: str):
    """Get code submissions"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{CODE_SERVICE_URL}/submissions/{interview_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ==================== SCORING SERVICE ROUTES ====================

@app.post("/score")
async def score_interview(request: Request):
    """Score an interview"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{SCORING_SERVICE_URL}/score",
                json=body,
                timeout=60.0  # Longer timeout for AI scoring
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/scores/{interview_id}")
async def get_scores(interview_id: str):
    """Get interview scores"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{SCORING_SERVICE_URL}/scores/{interview_id}",
                timeout=10.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/quick-score")
async def quick_score_code(request: Request):
    """Quick code quality check"""
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            response = await client.post(
                f"{SCORING_SERVICE_URL}/quick-score",
                params=body,
                timeout=30.0
            )
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

