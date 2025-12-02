"""
LLM Service - AI Interviewer using Google Gemini
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from typing import Optional, List, Dict, Any

app = FastAPI(title="LLM Service", version="1.0.0")

# Class để quản lý trạng thái của một buổi phỏng vấn
class InterviewSession:
    def __init__(self, model):
        self.chat = model.start_chat(history=[])
        self.current_stage = 1       # Đang ở giai đoạn mấy (1-5)
        self.question_count = 0      # Đã hỏi mấy câu trong giai đoạn này
        self.max_questions_per_stage = 5

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
Bạn là một Senior Technical Lead đang phỏng vấn ứng viên cho vị trí Backend Developer.

QUY TRÌNH PHỎNG VẤN (5 Giai đoạn):
1. Khởi động & Giới thiệu.
2. Deep Dive (Kỹ thuật chuyên sâu).
3. Problem Solving (Tư duy giải quyết vấn đề).
4. Culture Fit (Điểm mạnh/yếu).
5. Kết thúc.

QUY TẮC QUAN TRỌNG (BẮT BUỘC TUÂN THỦ):
1. **Xử lý khi ứng viên "Không biết" / Junior:** 
   - Nếu ứng viên nói "không có kinh nghiệm", "chưa gặp bao giờ", hoặc "em là sinh viên": TUYỆT ĐỐI KHÔNG hỏi lại câu cũ.
   - HÃY HẠ ĐỘ KHÓ NGAY LẬP TỨC. Chuyển sang hỏi kiến thức cơ bản (Ví dụ: thay vì hỏi Memory Leak, hãy hỏi về sự khác nhau giữa GET và POST, hoặc Primary Key là gì).

2. **Xử lý khi bị Trolling / Lạc đề:**
   - Nếu ứng viên nói nhảm (VD: "Subscribe kênh youtube", "Hát một bài"), hãy nhắc nhở lịch sự: "Chúng ta đang trong buổi phỏng vấn, vui lòng tập trung vào câu hỏi."
   - Nếu vẫn tiếp tục, hãy chủ động KẾT THÚC phỏng vấn sớm.

3. **Cơ chế Chuyển Giai Đoạn:**
   - Khi nhận được chỉ thị [HỆ THỐNG - CHUYỂN GIAI ĐOẠN]: Hãy BỎ QUA câu hỏi cũ chưa được trả lời.
   - Bắt đầu ngay giai đoạn mới bằng một câu dẫn dắt tự nhiên (Không được in từ khóa "CHUYỂN GIAI ĐOẠN" ra màn hình cho ứng viên thấy).

4. **Phong cách giao tiếp:**
   - Ngắn gọn, súc tích.
   - Nếu ứng viên trả lời sơ sài, hãy hỏi thêm: "Bạn có thể nói rõ hơn về...".
   - Không lặp lại câu hỏi y hệt câu trước.

MỤC TIÊU: Đánh giá đúng trình độ thực tế, không ép ứng viên trả lời những thứ họ không biết.
"""

# Store active chat sessions in memory (in production, use Redis or DB)
sessions: Dict[str, InterviewSession] = {}


def get_topic_name(stage: int) -> str:
    """Get the topic name for a specific stage"""
    topics = {
        1: "Giới thiệu bản thân & Dự án đã làm",
        2: "Kiến thức Kỹ thuật chuyên sâu (Hỏi sâu vào ngôn ngữ họ dùng)",
        3: "Tư duy giải quyết vấn đề (Hỏi về Bug hoặc thuật toán)",
        4: "Văn hóa & Điểm mạnh yếu",
        5: "Kết thúc phỏng vấn"
    }
    return topics.get(stage, "Phỏng vấn")


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

        # Create new session wrapper
        session = InterviewSession(model)
        sessions[request.session_id] = session

        # Get opening message from AI
        opening_response = session.chat.send_message(
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
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new session first.")

    session = sessions[request.session_id] # Lấy session ra
    
    # 1. Tăng biến đếm câu hỏi
    session.question_count += 1
    
    # 2. Kiểm tra logic chuyển giai đoạn
    system_note = ""
    
    # LOGIC CHUYỂN GIAI ĐOẠN
    if session.question_count > session.max_questions_per_stage:
        session.current_stage += 1
        session.question_count = 1 # Reset counter
        
        if session.current_stage > 5:
            return {"ai_response": "Cảm ơn bạn đã tham gia phỏng vấn. Chúng tôi sẽ phản hồi kết quả sớm. Chào bạn!", "is_finished": True}
            
        # Prompt ép AI đổi chủ đề mà không lặp lại
        system_note = f"""
        [SYSTEM COMMAND - QUAN TRỌNG]
        Giai đoạn cũ đã hết giờ. BẮT BUỘC chuyển sang Giai đoạn {session.current_stage}.
        Chủ đề mới: {get_topic_name(session.current_stage)}.
        TUYỆT ĐỐI KHÔNG nhắc lại câu hỏi cũ. Hãy bắt đầu chủ đề mới ngay.
        """
    else:
        # Prompt nhắc trạng thái bình thường
        system_note = f"""
        [SYSTEM INFO]
        Giai đoạn hiện tại: {session.current_stage} ({get_topic_name(session.current_stage)}).
        Câu hỏi thứ: {session.question_count}/5.
        Nếu ứng viên trả lời "Không biết", hãy hỏi câu dễ hơn.
        """

    # Ghép Prompt: Đưa System Note lên đầu để AI ưu tiên xử lý lệnh
    full_prompt = f"{system_note}\n\nUser trả lời: \"{request.message}\""

    try:
        response = session.chat.send_message(full_prompt)
        return {
            "success": True,
            "session_id": request.session_id,
            "current_stage": session.current_stage,
            "question_count": session.question_count,
            "user_message": request.message,
            "ai_response": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.delete("/session/{session_id}")
async def end_session(session_id: str):
    """
    End an interview session
    """
    if session_id in sessions:
        del sessions[session_id]
        return {"success": True, "message": "Session ended successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")


@app.get("/sessions")
async def list_sessions():
    """
    List active sessions
    """
    return {
        "active_sessions": list(sessions.keys()),
        "count": len(sessions)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
