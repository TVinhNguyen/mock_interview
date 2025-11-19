# Quick Start Guide

## 🚀 Chạy nhanh với Docker

```powershell
# Di chuyển vào thư mục dự án
cd ai-mock-interview

# Chạy tất cả services
docker-compose up --build
```

Sau khi tất cả services khởi động, truy cập:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🛠️ Chạy Development Mode (không dùng Docker)

### Cài đặt Python packages cho từng service

```powershell
# Service 1: STT
cd apps/stt-service
pip install -r requirements.txt

# Service 2: LLM  
cd ..\llm-service
pip install -r requirements.txt

# Service 3: TTS
cd ..\tts-service
pip install -r requirements.txt

# Service 4: API Gateway
cd ..\api-gateway
pip install -r requirements.txt
```

### Chạy các services (mở 5 terminal)

**Terminal 1 - STT Service:**
```powershell
cd apps/stt-service
python app.py
# Running on http://localhost:8001
```

**Terminal 2 - LLM Service:**
```powershell
cd apps/llm-service
python app.py
# Running on http://localhost:8002
```

**Terminal 3 - TTS Service:**
```powershell
cd apps/tts-service
python app.py
# Running on http://localhost:8003
```

**Terminal 4 - API Gateway:**
```powershell
cd apps/api-gateway
python app.py
# Running on http://localhost:8000
```

**Terminal 5 - Frontend:**
```powershell
npx nx serve frontend
# Running on http://localhost:3000
```

## 🧪 Test từng service

### Test STT Service
```powershell
# Health check
curl http://localhost:8001/health

# Upload audio file để test
# (Cần có file audio.m4a trong thư mục)
```

### Test LLM Service
```powershell
# Health check
curl http://localhost:8002/health

# Start session
curl -X POST http://localhost:8002/session/start `
  -H "Content-Type: application/json" `
  -d '{"session_id": "test123", "position": "Backend Developer", "level": "Junior"}'
```

### Test TTS Service
```powershell
# Health check
curl http://localhost:8003/health

# List voices
curl http://localhost:8003/voices

# Synthesize speech
curl -X POST http://localhost:8003/synthesize `
  -H "Content-Type: application/json" `
  -d '{"text": "Xin chào, đây là test"}'
```

### Test API Gateway
```powershell
# Health check tất cả services
curl http://localhost:8000/health
```

## 📱 Sử dụng Frontend

1. Mở trình duyệt: http://localhost:3000
2. Click "🚀 Bắt đầu phỏng vấn"
3. AI sẽ chào và yêu cầu bạn tự giới thiệu
4. Bạn có thể:
   - **Ghi âm**: Click "🎤 Ghi âm trả lời" → Nói → Click "⏹️ Dừng ghi âm"
   - **Nhập văn bản**: Gõ câu trả lời → Click "📤 Gửi"
5. AI sẽ phản hồi bằng text và audio

## 🔧 Lệnh Nx hữu ích

```powershell
# Xem cấu trúc project graph
npx nx graph

# Build frontend
npx nx build frontend

# Lint frontend
npx nx lint frontend

# Test frontend
npx nx test frontend

# Reset cache
npx nx reset
```

## 🐳 Docker Commands

```powershell
# Build lại images
docker-compose build

# Start services
docker-compose up

# Start services ở background
docker-compose up -d

# Xem logs
docker-compose logs -f

# Xem logs của 1 service cụ thể
docker-compose logs -f api-gateway

# Stop services
docker-compose down

# Stop và xóa volumes
docker-compose down -v

# Restart một service
docker-compose restart llm-service
```

## 🎯 Workflow phát triển

1. **Thay đổi code** trong các service
2. **Test local** bằng cách chạy service riêng lẻ
3. **Build Docker** khi cần test integration
4. **Commit changes** với Git

## ⚠️ Common Issues

### Port đã được sử dụng
```powershell
# Windows: Tìm process đang dùng port
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Python dependencies lỗi
```powershell
# Tạo virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install lại requirements
pip install -r requirements.txt
```

### Docker build lỗi
```powershell
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

**Happy Coding! 🚀**
