"""
TTS Service - Text-to-Speech using Edge-TTS
"""
import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import edge_tts
import uuid

app = FastAPI(title="TTS Service", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory for audio files
TEMP_DIR = "temp_audio"
os.makedirs(TEMP_DIR, exist_ok=True)


class TTSRequest(BaseModel):
    text: str
    voice: str = "vi-VN-NamMinhNeural"  # Default: Male Vietnamese voice
    # Other options: "vi-VN-HoaiMyNeural" (Female)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "tts-service"}


@app.get("/voices")
async def list_voices():
    """
    List available Vietnamese voices
    """
    voices = await edge_tts.list_voices()
    vietnamese_voices = [
        {
            "name": voice["ShortName"],
            "gender": voice["Gender"],
            "locale": voice["Locale"]
        }
        for voice in voices if voice["Locale"].startswith("vi-")
    ]
    return {"voices": vietnamese_voices}


@app.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """
    Convert text to speech
    Returns: audio file URL
    """
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        output_file = os.path.join(TEMP_DIR, f"{file_id}.mp3")

        # Create TTS
        communicate = edge_tts.Communicate(request.text, request.voice)
        await communicate.save(output_file)

        return {
            "success": True,
            "file_id": file_id,
            "audio_url": f"/audio/{file_id}",
            "voice": request.voice
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")


@app.get("/audio/{file_id}")
async def get_audio(file_id: str):
    """
    Download generated audio file
    """
    file_path = os.path.join(TEMP_DIR, f"{file_id}.mp3")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=f"speech_{file_id}.mp3"
    )


@app.delete("/audio/{file_id}")
async def delete_audio(file_id: str):
    """
    Delete audio file after use
    """
    file_path = os.path.join(TEMP_DIR, f"{file_id}.mp3")
    
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"success": True, "message": "Audio file deleted"}
    else:
        raise HTTPException(status_code=404, detail="Audio file not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
