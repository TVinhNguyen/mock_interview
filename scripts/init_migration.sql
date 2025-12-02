-- ============================================
-- MOCK INTERVIEW PLATFORM - DATABASE MIGRATION
-- ============================================
-- Version: 1.0
-- Created: 2025-12-01
-- Description: Initial database schema setup
-- ============================================

-- Enable UUID extension (Required for UUID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: PROFILES (User Information)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  experience_level TEXT CHECK (experience_level IN ('Intern', 'Junior', 'Mid-Level', 'Senior')),
  total_interviews INT DEFAULT 0,
  avg_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.profiles IS 'User profile information and authentication data';
COMMENT ON COLUMN public.profiles.experience_level IS 'User experience level: Intern, Junior, Mid-Level, Senior';
COMMENT ON COLUMN public.profiles.total_interviews IS 'Total number of interviews completed';
COMMENT ON COLUMN public.profiles.avg_score IS 'Average score across all interviews';

-- ============================================
-- TABLE 2: INTERVIEW_TEMPLATES (Interview Categories)
-- ============================================
CREATE TABLE IF NOT EXISTS public.interview_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('Junior', 'Mid-Level', 'Senior', 'All Levels')),
  topics TEXT[],
  estimated_minutes INT DEFAULT 45,
  total_questions INT DEFAULT 10,
  icon_slug TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.interview_templates IS 'Predefined interview templates displayed on dashboard';
COMMENT ON COLUMN public.interview_templates.topics IS 'Array of topics covered (e.g., Data Structures, APIs, Database)';
COMMENT ON COLUMN public.interview_templates.icon_slug IS 'Icon identifier (e.g., python, java, react)';

-- ============================================
-- TABLE 3: QUESTIONS (Question Bank)
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('behavioral', 'technical', 'coding', 'system_design')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[],
  starter_code TEXT,
  test_cases JSONB,
  solution_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.questions IS 'Question bank for interviews';
COMMENT ON COLUMN public.questions.type IS 'Question type: behavioral, technical, coding, system_design';
COMMENT ON COLUMN public.questions.test_cases IS 'JSON object containing test cases for coding questions';
COMMENT ON COLUMN public.questions.starter_code IS 'Initial code template for coding questions';

-- ============================================
-- TABLE 4: TEMPLATE_QUESTIONS (Many-to-Many Relationship)
-- ============================================
CREATE TABLE IF NOT EXISTS public.template_questions (
  template_id UUID REFERENCES public.interview_templates(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  order_index INT,
  PRIMARY KEY (template_id, question_id)
);

COMMENT ON TABLE public.template_questions IS 'Junction table linking templates to questions';
COMMENT ON COLUMN public.template_questions.order_index IS 'Question order within the template';

-- ============================================
-- TABLE 5: INTERVIEWS (Interview Sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.interview_templates(id),
  title_snapshot TEXT,
  level_snapshot TEXT,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'cancelled')) DEFAULT 'in_progress',
  current_stage INT DEFAULT 1,
  current_question_index INT DEFAULT 0,
  overall_score INT,
  duration_seconds INT DEFAULT 0,
  feedback_summary TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE public.interviews IS 'Active and completed interview sessions';
COMMENT ON COLUMN public.interviews.title_snapshot IS 'Template title at interview start (snapshot)';
COMMENT ON COLUMN public.interviews.level_snapshot IS 'Difficulty level at interview start (snapshot)';
COMMENT ON COLUMN public.interviews.status IS 'Interview status: in_progress, completed, cancelled';
COMMENT ON COLUMN public.interviews.current_stage IS 'Current interview stage/phase';
COMMENT ON COLUMN public.interviews.overall_score IS 'Final score 0-100';

-- ============================================
-- TABLE 6: INTERVIEW_MESSAGES (Chat Log)
-- ============================================
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('ai', 'user', 'system')),
  content TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.interview_messages IS 'Chat messages between AI and user during interview';
COMMENT ON COLUMN public.interview_messages.role IS 'Message sender: ai, user, or system';
COMMENT ON COLUMN public.interview_messages.audio_url IS 'URL to audio file if message has voice';

-- ============================================
-- TABLE 7: CODE_SUBMISSIONS (Code Submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.code_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id),
  language TEXT,
  code_content TEXT,
  execution_result JSONB,
  test_results JSONB,
  ai_review JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

COMMENT ON TABLE public.code_submissions IS 'User code submissions during interviews';
COMMENT ON COLUMN public.code_submissions.execution_result IS 'JSON: {status, output, errors}';
COMMENT ON COLUMN public.code_submissions.test_results IS 'JSON: {passed, failed, details}';
COMMENT ON COLUMN public.code_submissions.ai_review IS 'JSON: {score, bugs, suggestions}';

-- ============================================
-- TABLE 8: INTERVIEW_SCORES (Detailed Scoring)
-- ============================================
CREATE TABLE IF NOT EXISTS public.interview_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT,
  score INT,
  feedback TEXT
);

COMMENT ON TABLE public.interview_scores IS 'Detailed scoring metrics for interview performance';
COMMENT ON COLUMN public.interview_scores.metric_name IS 'Metric name: Code Quality, Communication, Problem Solving, Technical Depth';
COMMENT ON COLUMN public.interview_scores.score IS 'Score 0-100 for this metric';

-- ============================================
-- INDEXES (Performance Optimization)
-- ============================================
-- Tối ưu hóa: Chỉ giữ lại các indexes thực sự cần thiết
-- Loại bỏ 4 indexes ít được sử dụng để giảm overhead khi INSERT/UPDATE

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
-- REMOVED: idx_profiles_experience - Ít khi filter theo experience_level

-- Interview indexes (Most critical - heavily queried)
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_template_id ON public.interviews(template_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_started_at ON public.interviews(started_at DESC);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_interview_messages_interview_id ON public.interview_messages(interview_id);
-- REMOVED: idx_interview_messages_created_at - Messages luôn được query theo interview_id

-- Code submission indexes
CREATE INDEX IF NOT EXISTS idx_code_submissions_interview_id ON public.code_submissions(interview_id);
-- REMOVED: idx_code_submissions_question_id - Ít khi query code theo question_id riêng

-- Score indexes
CREATE INDEX IF NOT EXISTS idx_interview_scores_interview_id ON public.interview_scores(interview_id);
-- REMOVED: idx_interview_scores_metric - Scores luôn được query theo interview_id

-- Template indexes
CREATE INDEX IF NOT EXISTS idx_templates_active ON public.interview_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_difficulty ON public.interview_templates(difficulty_level);

-- Question indexes
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);

-- ============================================
-- FUNCTIONS (Auto-update timestamps)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA (Optional Seed)
-- ============================================

-- Insert default interview templates
INSERT INTO public.interview_templates (title, description, difficulty_level, topics, estimated_minutes, total_questions, icon_slug, is_active)
VALUES 
  ('Python Backend Developer', 'Full stack Python interview focusing on FastAPI, databases, and APIs', 'Mid-Level', ARRAY['Python', 'FastAPI', 'PostgreSQL', 'REST API'], 60, 12, 'python', true),
  ('Frontend React Developer', 'Modern React development with hooks, state management, and TypeScript', 'Mid-Level', ARRAY['React', 'TypeScript', 'Next.js', 'TailwindCSS'], 60, 10, 'react', true),
  ('Data Structures & Algorithms', 'Core CS fundamentals - arrays, trees, graphs, sorting, searching', 'All Levels', ARRAY['Algorithms', 'Data Structures', 'Problem Solving'], 45, 8, 'algorithm', true),
  ('System Design Interview', 'Design scalable systems - databases, caching, load balancing', 'Senior', ARRAY['System Design', 'Architecture', 'Scalability'], 90, 5, 'system', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify all tables created
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'profiles',
        'interview_templates',
        'questions',
        'template_questions',
        'interviews',
        'interview_messages',
        'code_submissions',
        'interview_scores'
    );
    
    RAISE NOTICE 'Created % tables successfully', table_count;
END $$;

-- Show summary
SELECT 
    'profiles' as table_name, 
    COUNT(*) as row_count 
FROM public.profiles
UNION ALL
SELECT 'interview_templates', COUNT(*) FROM public.interview_templates
UNION ALL
SELECT 'questions', COUNT(*) FROM public.questions
UNION ALL
SELECT 'interviews', COUNT(*) FROM public.interviews;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
