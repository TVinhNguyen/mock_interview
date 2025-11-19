"""
API Gateway - Orchestrates all microservices
"""
import os
import httpx
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional

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
STT_SERVICE_URL = os.getenv("STT_SERVICE_URL", "http://localhost:8001")
LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://localhost:8002")
TTS_SERVICE_URL = os.getenv("TTS_SERVICE_URL", "http://localhost:8003")


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
        
        try:
            stt_health = await client.get(f"{STT_SERVICE_URL}/health", timeout=5.0)
            services_status["stt"] = stt_health.json()
        except:
            services_status["stt"] = {"status": "unhealthy"}
        
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
