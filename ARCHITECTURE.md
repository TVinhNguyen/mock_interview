# Architecture & Technical Details

## 🏛️ Kiến trúc tổng quan

### Mô hình Microservices

Dự án sử dụng **kiến trúc microservices** thuần túy, với mỗi service đảm nhận một nhiệm vụ cụ thể:

```
┌──────────────────────────────────────────────────────────┐
│                      User Browser                         │
│                    (localhost:3000)                       │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP/WebSocket
                        ▼
┌──────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                      │
│  • React Components                                       │
│  • State Management (useState)                            │
│  • Audio Recording (MediaRecorder API)                    │
└───────────────────────┬──────────────────────────────────┘
                        │ REST API
                        ▼
┌──────────────────────────────────────────────────────────┐
│               API Gateway (FastAPI)                       │
│  • Request routing                                        │
│  • Service orchestration                                  │
│  • Error handling                                         │
│  • CORS configuration                                     │
└────────────┬──────────┬──────────┬──────────────┬────────┘
             │          │          │              │
    ┌────────▼───┐  ┌──▼──────┐  ┌▼────────┐  ┌─▼─────────┐
    │ STT Service│  │   LLM   │  │   TTS   │  │  Future   │
    │   (8001)   │  │ Service │  │ Service │  │ Services  │
    │            │  │  (8002) │  │  (8003) │  │           │
    │  Groq      │  │ Gemini  │  │Edge-TTS │  │   ...     │
    │  Whisper   │  │         │  │         │  │           │
    └────────────┘  └─────────┘  └─────────┘  └───────────┘
```

## 🔄 Luồng dữ liệu (Data Flow)

### Flow 1: Bắt đầu phỏng vấn

```
User Click "Start"
    │
    ├──> Frontend: POST /interview/start
    │
    └──> API Gateway: POST /interview/start
         │
         ├──> LLM Service: POST /session/start
         │    • Tạo session mới
         │    • Khởi tạo AI Interviewer
         │    • Trả về câu chào mở đầu
         │
         ├──> TTS Service: POST /synthesize
         │    • Chuyển text → audio
         │    • Trả về file MP3
         │
         └──> Frontend: Hiển thị text + phát audio
```

### Flow 2: Trả lời bằng audio

```
User Record Audio
    │
    ├──> Frontend: Ghi âm (MediaRecorder)
    │    • Start recording
    │    • Stop recording
    │    • Create Blob
    │
    └──> API Gateway: POST /interview/respond-audio
         │
         ├──> STT Service: POST /transcribe
         │    • Upload audio file
         │    • Groq Whisper transcribe
         │    • Trả về text
         │
         ├──> LLM Service: POST /chat
         │    • Gửi user text
         │    • Gemini xử lý và trả lời
         │    • Trả về AI response
         │
         ├──> TTS Service: POST /synthesize
         │    • Chuyển AI text → audio
         │    • Trả về file MP3
         │
         └──> Frontend: 
              • Hiển thị user message
              • Hiển thị AI response
              • Phát audio
```

### Flow 3: Trả lời bằng text

```
User Type & Send
    │
    └──> API Gateway: POST /interview/respond-text
         │
         ├──> LLM Service: POST /chat
         │    • Gửi user text
         │    • Gemini xử lý
         │    • Trả về AI response
         │
         ├──> TTS Service: POST /synthesize
         │    • Text → audio
         │
         └──> Frontend: Hiển thị + phát audio
```

## 🛠️ Chi tiết từng service

### 1. STT Service (Speech-to-Text)

**Technology**: Groq Whisper Large V3

**Responsibilities**:
- Nhận audio file (webm, mp3, m4a, wav)
- Transcribe thành text tiếng Việt
- Trả về text + metadata (duration, language)

**Endpoints**:
- `GET /health` - Health check
- `POST /transcribe` - Transcribe audio

**Dependencies**:
```python
fastapi
uvicorn
groq
python-multipart
```

### 2. LLM Service (AI Interviewer)

**Technology**: Google Gemini 1.5 Flash

**Responsibilities**:
- Quản lý interview sessions
- Đóng vai trò AI Interviewer
- Sinh câu hỏi và đánh giá câu trả lời
- Maintain conversation context

**Endpoints**:
- `GET /health` - Health check
- `POST /session/start` - Bắt đầu session
- `POST /chat` - Gửi message
- `DELETE /session/{id}` - Kết thúc session
- `GET /sessions` - List active sessions

**Session Management**:
- In-memory storage (dict)
- Session ID: unique identifier
- Chat history: maintained per session

### 3. TTS Service (Text-to-Speech)

**Technology**: Microsoft Edge-TTS

**Responsibilities**:
- Chuyển text thành giọng nói
- Hỗ trợ tiếng Việt (Nam/Nữ)
- Quản lý audio files

**Endpoints**:
- `GET /health` - Health check
- `GET /voices` - List available voices
- `POST /synthesize` - Text → Audio
- `GET /audio/{id}` - Download audio
- `DELETE /audio/{id}` - Delete audio

**Voices**:
- `vi-VN-NamMinhNeural` (Male)
- `vi-VN-HoaiMyNeural` (Female)

### 4. API Gateway

**Technology**: FastAPI + httpx

**Responsibilities**:
- Điểm vào duy nhất cho Frontend
- Route requests đến các services
- Orchestrate multi-service flows
- Handle errors gracefully
- CORS configuration

**Orchestration Examples**:

```python
# Start interview = LLM + TTS
async def start_interview():
    llm_response = await call_llm_service()
    tts_response = await call_tts_service(llm_response.text)
    return combined_response

# Respond audio = STT + LLM + TTS
async def respond_audio():
    stt_text = await call_stt_service(audio)
    llm_response = await call_llm_service(stt_text)
    tts_audio = await call_tts_service(llm_response.text)
    return combined_response
```

### 5. Frontend (Next.js)

**Technology**: Next.js 15, React, TypeScript

**Features**:
- Audio recording (MediaRecorder API)
- Text input fallback
- Real-time message display
- Audio playback
- Session management

**State Management**:
```typescript
useState: messages, isRecording, isProcessing, currentAudio
useRef: mediaRecorder, audioChunks, audioElement
```

## 🐳 Docker Configuration

### Network

Tất cả services chạy trong cùng một Docker network: `interview-network`

**Benefits**:
- Services có thể gọi nhau bằng service name
- Isolated from external network
- Easy service discovery

### Environment Variables

```yaml
# API Gateway
STT_SERVICE_URL=http://stt-service:8001
LLM_SERVICE_URL=http://llm-service:8002
TTS_SERVICE_URL=http://tts-service:8003

# Services
GROQ_API_KEY=${GROQ_API_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY}

# Frontend
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
```

### Volumes

```yaml
volumes:
  tts-audio:  # Persist TTS generated audio files
```

## 📊 Nx Monorepo Structure

```
ai-mock-interview/
├── apps/
│   ├── api-gateway/       # Python FastAPI
│   ├── stt-service/       # Python FastAPI
│   ├── llm-service/       # Python FastAPI
│   ├── tts-service/       # Python FastAPI
│   └── frontend/          # Next.js
├── libs/                  # (Future: Shared libraries)
├── tools/                 # (Future: Custom scripts)
└── nx.json               # Nx configuration
```

**Benefits of Nx**:
- ✅ Code organization
- ✅ Task orchestration (`nx serve`, `nx build`)
- ✅ Dependency graph visualization (`nx graph`)
- ✅ Cacheable operations
- ✅ Extensible with plugins

## 🔐 Security Considerations

### Current Implementation

⚠️ **Development Mode** - Not production-ready

**Issues**:
- API keys in environment variables (OK for dev)
- In-memory session storage (lost on restart)
- No authentication/authorization
- CORS allows all origins
- No rate limiting

### Production Recommendations

```python
# 1. Use secrets management
- Azure Key Vault
- AWS Secrets Manager
- HashiCorp Vault

# 2. Add authentication
- JWT tokens
- OAuth2
- API keys per user

# 3. Session storage
- Redis
- PostgreSQL
- MongoDB

# 4. Rate limiting
- Redis-based rate limiter
- API Gateway rate limits

# 5. CORS restriction
allow_origins=["https://yourdomain.com"]

# 6. HTTPS/TLS
- Use reverse proxy (Nginx)
- SSL certificates
```

## 🚀 Deployment Options

### Option 1: Docker Compose (Simple)
```bash
docker-compose up -d
```

### Option 2: Kubernetes (Scalable)
```yaml
# Deploy each service as a Deployment
# Use Services for internal communication
# Ingress for external access
```

### Option 3: Cloud Native
- **Frontend**: Vercel, Netlify
- **Services**: AWS Lambda, Google Cloud Run
- **Gateway**: AWS API Gateway, Kong

## 📈 Monitoring & Observability

### Suggested Stack

```yaml
Metrics: Prometheus + Grafana
Logs: ELK Stack (Elasticsearch, Logstash, Kibana)
Tracing: Jaeger, OpenTelemetry
Health Checks: Built-in FastAPI /health endpoints
```

### Implementation

```python
# Add to each service
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)
```

## 🔄 Future Enhancements

1. **Real-time Features**
   - WebSocket for live audio streaming
   - Real-time transcription

2. **Advanced Features**
   - Multi-language support
   - Interview recording & replay
   - Performance analytics
   - Custom interview templates

3. **Infrastructure**
   - CI/CD pipeline (GitHub Actions)
   - Auto-scaling
   - Load balancing
   - Database integration

4. **AI Improvements**
   - Fine-tuned models
   - Sentiment analysis
   - Automatic scoring

---

**Built with ❤️ using Microservices Architecture**
