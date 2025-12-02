# Database Migration Guide

## 📋 Tổng Quan

File migration này tạo database schema hoàn chỉnh cho Mock Interview Platform với 8 bảng chính.

## 🗃️ Cấu Trúc Database

### 1. **profiles** - Thông tin người dùng
- `id` (UUID) - Primary key
- `email` (TEXT) - Unique, indexed
- `password_hash` (TEXT) - Mật khẩu đã hash
- `full_name`, `avatar_url`, `job_title` - Thông tin cá nhân
- `experience_level` - Intern | Junior | Mid-Level | Senior
- `total_interviews` (INT) - Số lần phỏng vấn
- `avg_score` (FLOAT) - Điểm trung bình
- `created_at`, `updated_at` - Timestamps

### 2. **interview_templates** - Mẫu phỏng vấn
- Template cho từng loại phỏng vấn (Python, React, Algorithm, System Design)
- `topics` (TEXT[]) - Array các chủ đề
- `difficulty_level` - Junior | Mid-Level | Senior | All Levels
- `estimated_minutes` - Thời gian dự kiến

### 3. **questions** - Ngân hàng câu hỏi
- `type` - behavioral | technical | coding | system_design
- `difficulty` - easy | medium | hard
- `starter_code` - Code mẫu ban đầu
- `test_cases` (JSONB) - Test cases cho coding questions

### 4. **template_questions** - Liên kết template-questions
- Junction table (many-to-many)
- `order_index` - Thứ tự câu hỏi

### 5. **interviews** - Phiên phỏng vấn
- `status` - in_progress | completed | cancelled
- `current_stage`, `current_question_index` - Tracking tiến trình
- `overall_score` - Điểm tổng (0-100)
- `duration_seconds` - Thời gian thực tế

### 6. **interview_messages** - Chat log
- `role` - ai | user | system
- `content` - Nội dung tin nhắn
- `audio_url` - Link file audio (nếu có)

### 7. **code_submissions** - Code đã submit
- `execution_result` (JSONB) - Kết quả chạy code
- `test_results` (JSONB) - Kết quả test
- `ai_review` (JSONB) - AI review code

### 8. **interview_scores** - Điểm chi tiết
- `metric_name` - Code Quality | Communication | Problem Solving | Technical Depth
- `score` (INT) - 0-100
- `feedback` - Nhận xét chi tiết

## 🚀 Cách Sử Dụng

### Option 1: Docker Compose (Khuyến nghị)

```bash
# Stop containers nếu đang chạy
docker compose down

# Xóa volume cũ để reset database
docker volume rm mock_interview_postgres-data

# Start lại - migration sẽ tự động chạy
docker compose up -d postgres

# Check logs
docker compose logs postgres
```

### Option 2: Manual Migration Script

```bash
# Chạy migration script
./scripts/run_migration.sh

# Hoặc với custom config
DB_HOST=localhost DB_PORT=5432 DB_USER=postgres ./scripts/run_migration.sh
```

### Option 3: Direct SQL

```bash
# Connect và chạy trực tiếp
psql -U postgres -d interview_db -f scripts/init_migration.sql
```

## ✅ Verification

Sau khi chạy migration, verify bằng cách:

```sql
-- Kiểm tra số lượng tables
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: 8 tables

-- Kiểm tra indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename;
-- Expected: 13+ indexes

-- Kiểm tra initial data
SELECT * FROM interview_templates;
-- Expected: 4 template mẫu
```

## 🔄 Updates So Với db.txt Cũ

### ✅ Đã Thêm:
1. **code_submissions**:
   - `execution_result` (JSONB)
   - `test_results` (JSONB)

2. **Indexes mới**:
   - `idx_interviews_template_id`
   - `idx_interviews_status`
   - `idx_interviews_started_at`
   - `idx_code_submissions_question_id`
   - `idx_interview_scores_metric`
   - `idx_templates_active`
   - `idx_templates_difficulty`
   - `idx_questions_type`
   - `idx_questions_difficulty`

3. **Features mới**:
   - Auto-update trigger cho `profiles.updated_at`
   - Table comments (documentation)
   - Initial seed data (4 templates)
   - Verification queries

## 📊 Initial Seed Data

Migration tự động tạo 4 interview templates:
1. **Python Backend Developer** - Mid-Level, 60 min
2. **Frontend React Developer** - Mid-Level, 60 min
3. **Data Structures & Algorithms** - All Levels, 45 min
4. **System Design Interview** - Senior, 90 min

## 🔧 Troubleshooting

### Database đã tồn tại?
```sql
DROP DATABASE IF EXISTS interview_db;
CREATE DATABASE interview_db;
```

### Reset toàn bộ?
```bash
docker compose down -v
docker compose up -d
```

### Check connection?
```bash
docker exec -it interview-postgres psql -U postgres -d interview_db -c '\dt'
```

## 📝 Notes

- Migration sử dụng `IF NOT EXISTS` - an toàn khi chạy nhiều lần
- Tất cả timestamps dùng UTC timezone
- Foreign keys có `ON DELETE CASCADE` để tự động cleanup
- UUID tự động generate cho tất cả tables
