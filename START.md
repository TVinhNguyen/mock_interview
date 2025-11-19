# 🚀 Hướng dẫn chạy nhanh - AI Mock Interview

## Cách đơn giản nhất (Khuyến nghị)

### Bước 1: Chạy Backend Services với Docker

Mở **PowerShell** và chạy:

```powershell
cd d:\VS\Project\pbl\interview\ai-mock-interview

# Chạy tất cả backend services (STT, LLM, TTS, API Gateway)
docker-compose up -d
```

✅ Sau khi chạy xong, bạn sẽ có:
- **API Gateway**: http://localhost:8000
- **STT Service**: http://localhost:8001
- **LLM Service**: http://localhost:8002
- **TTS Service**: http://localhost:8003

### Bước 2: Chạy Frontend (Next.js)

Mở **PowerShell terminal mới** và chạy:

```powershell
cd d:\VS\Project\pbl\interview\ai-mock-interview

# Chạy frontend
npx nx serve frontend
```

✅ Frontend sẽ chạy tại: **http://localhost:3000**

### Bước 3: Sử dụng

1. Mở trình duyệt: **http://localhost:3000**
2. Click **"🚀 Bắt đầu phỏng vấn"**
3. Trả lời bằng:
   - **Ghi âm**: Click "🎤 Ghi âm trả lời" → Nói → "⏹️ Dừng"
   - **Văn bản**: Gõ câu trả lời → Click "📤 Gửi"

---

## ⏹️ Dừng ứng dụng

```powershell
# Dừng backend services
docker-compose down

# Dừng frontend: Nhấn Ctrl+C trong terminal đang chạy frontend
```

---

## 🔍 Kiểm tra services

```powershell
# Xem các services đang chạy
docker-compose ps

# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của 1 service cụ thể
docker-compose logs -f api-gateway
docker-compose logs -f llm-service
```

---

## 🐛 Troubleshooting

### Lỗi: Port đã được sử dụng

```powershell
# Kiểm tra port đang được dùng
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :8002
netstat -ano | findstr :8003

# Dừng tất cả containers
docker-compose down
```

### Lỗi: Không kết nối được với backend

### Rebuild services

```powershell
# Rebuild tất cả
docker-compose up --build

# Rebuild 1 service cụ thể
docker-compose up --build llm-service
```

---

## 📊 Architecture

```
Browser (Port 3000)
    ↓
Frontend (Next.js) - Local
    ↓
API Gateway (Port 8000) - Docker
    ↓
├─→ STT Service (Port 8001) - Docker
├─→ LLM Service (Port 8002) - Docker
└─→ TTS Service (Port 8003) - Docker
```

---

**Happy Interviewing! 🎤🤖**
