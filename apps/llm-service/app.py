"""
LLM Service - AI Interviewer using Google Gemini
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from typing import Optional, List, Dict

app = FastAPI(title="LLM Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBWVCXHFroQoVAQElYaDKzGIe7jBBPxe6I")
genai.configure(api_key=GEMINI_API_KEY)

# System instruction for AI Interviewer
SYSTEM_INSTRUCTION = """
Bạn là một nhà tuyển dụng IT chuyên nghiệp, khó tính nhưng công tâm.
Nhiệm vụ của bạn là phỏng vấn ứng viên cho vị trí Backend Developer.
- Hãy hỏi từng câu một.
- Đợi ứng viên trả lời xong mới hỏi tiếp hoặc nhận xét.
- Nếu ứng viên trả lời sai, hãy gợi ý nhẹ nhàng.
- Tuyệt đối không đưa ra đáp án ngay lập tức.
- Giọng văn: Ngắn gọn, chuyên nghiệp, tập trung vào chuyên môn.
"""

# Store active chat sessions in memory (in production, use Redis or DB)
chat_sessions: Dict[str, any] = {}


class ChatRequest(BaseModel):
    session_id: str
    message: str
    position: Optional[str] = "Backend Developer"


class StartSessionRequest(BaseModel):
    session_id: str
    position: Optional[str] = "Backend Developer"
    level: Optional[str] = "Junior"


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "llm-service"}


@app.post("/session/start")
async def start_session(request: StartSessionRequest):
    """
    Start a new interview session
    """
    try:
        # Customize system instruction based on position and level
        custom_instruction = f"""
        {SYSTEM_INSTRUCTION}
        
        Vị trí phỏng vấn: {request.position}
        Cấp độ: {request.level}
        
        Hãy bắt đầu bằng câu chào và yêu cầu ứng viên giới thiệu bản thân.
        """
        
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "max_output_tokens": 8192,
        }

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-lite",
            generation_config=generation_config,
            system_instruction=custom_instruction
        )

        chat_session = model.start_chat(history=[])
        chat_sessions[request.session_id] = chat_session

        # Get opening message from AI
        opening_response = chat_session.send_message(
            "Hãy bắt đầu buổi phỏng vấn bằng cách chào ứng viên và yêu cầu họ giới thiệu bản thân."
        )

        return {
            "success": True,
            "session_id": request.session_id,
            "message": opening_response.text,
            "position": request.position,
            "level": request.level
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start session: {str(e)}")


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Send message and get AI response
    """
    try:
        # Check if session exists
        if request.session_id not in chat_sessions:
            raise HTTPException(status_code=404, detail="Session not found. Please start a new session first.")

        chat_session = chat_sessions[request.session_id]
        
        # Send user message and get AI response
        response = chat_session.send_message(request.message)

        return {
            "success": True,
            "session_id": request.session_id,
            "user_message": request.message,
            "ai_response": response.text
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.delete("/session/{session_id}")
async def end_session(session_id: str):
    """
    End an interview session
    """
    if session_id in chat_sessions:
        del chat_sessions[session_id]
        return {"success": True, "message": "Session ended successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")


@app.get("/sessions")
async def list_sessions():
    """
    List active sessions
    """
    return {
        "active_sessions": list(chat_sessions.keys()),
        "count": len(chat_sessions)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
