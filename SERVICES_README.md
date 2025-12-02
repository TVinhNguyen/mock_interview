# 🚀 Getting Started with Services

## Prerequisites
- Docker & Docker Compose
- Make sure ports 3000, 5432, 8000-8005 are available

## Quick Start

### 1. Setup Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

### 2. Start All Services
```bash
# Build and start all services
docker compose up --build

# Or run in background
docker compose up -d --build
```

### 3. Wait for Services to Start
Check if all services are healthy:
```bash
docker compose ps
```

### 4. Seed Sample Data
```bash
# Install requests library
pip install requests

# Run seed script to create interview templates
python apps/interview-service/seed.py
```

### 5. Verify Services

**PostgreSQL Database**
```bash
# Connect to database
docker exec -it interview-postgres psql -U postgres -d interview_db

# List tables
\dt

# Exit
\q
```

**User Service** (Port 8004)
```bash
curl http://localhost:8004/health
```

**Interview Service** (Port 8005)
```bash
# Get templates
curl http://localhost:8005/templates

# Health check
curl http://localhost:8005/health
```

**Frontend** (Port 3000)
```
http://localhost:3000
```

## 📡 API Endpoints

### User Service (8004)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (requires auth)
- `PUT /profile` - Update profile (requires auth)

### Interview Service (8005)
- `GET /templates` - Get all interview templates
- `POST /interviews/start` - Start new interview
- `GET /interviews/{id}` - Get interview details
- `GET /interviews/user/{user_id}` - Get user's interviews
- `POST /messages` - Add chat message
- `GET /messages/{interview_id}` - Get chat history
- `GET /analytics/user/{user_id}/stats` - Get user stats

## 🧪 Test API with cURL

### Register User
```bash
curl -X POST http://localhost:8004/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "job_title": "Backend Developer",
    "experience_level": "Mid-Level"
  }'
```

### Login
```bash
curl -X POST http://localhost:8004/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Templates
```bash
curl http://localhost:8005/templates
```

### Start Interview
```bash
# Replace {template_id} and {user_id} with actual IDs
curl -X POST http://localhost:8005/interviews/start \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "{template_id}",
    "user_id": "{user_id}"
  }'
```

## 🛠️ Development

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f user-service
docker compose logs -f interview-service
docker compose logs -f postgres
```

### Restart Service
```bash
docker compose restart user-service
docker compose restart interview-service
```

### Stop All Services
```bash
docker compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker compose down -v
```

## 📊 Database Management

### Access PostgreSQL
```bash
docker exec -it interview-postgres psql -U postgres -d interview_db
```

### Useful SQL Commands
```sql
-- List all profiles
SELECT * FROM profiles;

-- List all templates
SELECT * FROM interview_templates;

-- List all interviews
SELECT * FROM interviews;

-- Get user's interview history
SELECT i.*, t.title 
FROM interviews i 
LEFT JOIN interview_templates t ON i.template_id = t.id 
WHERE i.user_id = 'your-user-id';
```

## 🐛 Troubleshooting

### Service won't start
```bash
# Check logs
docker compose logs [service-name]

# Rebuild specific service
docker compose up --build [service-name]
```

### Database connection error
```bash
# Make sure postgres is healthy
docker compose ps postgres

# Check postgres logs
docker compose logs postgres
```

### Port already in use
```bash
# Find process using port
lsof -i :8004

# Kill process
kill -9 [PID]
```

## 📝 Next Steps

1. ✅ Setup PostgreSQL Database
2. ✅ Create User Service (Auth)
3. ✅ Create Interview Service
4. 🔄 Update API Gateway to route to new services
5. 🔄 Create Code Execution Service
6. 🔄 Create Scoring Service
7. 🔄 Connect Frontend to APIs
8. 🔄 Add authentication flow to Frontend

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │ :3000
│  (Next.js)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Gateway │ :8000
└──────┬──────┘
       │
       ├──────→ User Service      :8004
       ├──────→ Interview Service :8005
       ├──────→ STT Service       :8001
       ├──────→ LLM Service       :8002
       └──────→ TTS Service       :8003
       
       All services connect to PostgreSQL :5432
```
