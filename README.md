# AI Mock Interview - Microservices Architecture

Dự án **AI Mock Interview** giúp bạn luyện tập phỏng vấn với AI sử dụng **kiến trúc microservices** được quản lý bằng **Nx Monorepo**.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3000)
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  FastAPI (Port 8000)
│   (FastAPI)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    ▼         ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐
│  STT   │ │  LLM   │ │  TTS   │
│ Service│ │Service │ │Service │
│  8001  │ │  8002  │ │  8003  │
└────────┘ └────────┘ └────────┘
  Groq      Gemini     Edge-TTS
```

## 📦 Cấu trúc dự án

```
ai-mock-interview/
├── apps/
│   ├── api-gateway/          # API Gateway (FastAPI)
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── stt-service/          # Speech-to-Text (Groq Whisper)
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── llm-service/          # AI Interviewer (Gemini)
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── tts-service/          # Text-to-Speech (Edge-TTS)
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   └── frontend/             # Frontend UI (Next.js)
│       ├── src/
│       ├── Dockerfile
│       └── project.json
│
├── docker-compose.yml        # Docker Compose config
├── .env.example              # Environment variables template
└── nx.json                   # Nx configuration
```

## 🚀 Cài đặt và chạy

### Yêu cầu
- **Node.js** 20+
- **Python** 3.11+
- **Docker** & **Docker Compose** (optional)
- **npm** hoặc **yarn**

### Bước 1: Clone và cài đặt dependencies

```bash
cd ai-mock-interview
npm install
```

### Bước 2: Cấu hình biến môi trường

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa .env với API keys của bạn (đã có sẵn trong file)
```

### Bước 3: Chạy dự án

#### Option 1: Chạy với Docker (Backend only)

```bash
# Build và start backend services (STT, LLM, TTS, Gateway)
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d

# Trong terminal khác, chạy frontend:
npx nx serve frontend

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

#### Option 2: Chạy từng service riêng lẻ (Development)

**Terminal 1 - STT Service:**
```bash
cd apps/stt-service
pip install -r requirements.txt
python app.py
```

**Terminal 2 - LLM Service:**
```bash
cd apps/llm-service
pip install -r requirements.txt
python app.py
```

**Terminal 3 - TTS Service:**
```bash
cd apps/tts-service
pip install -r requirements.txt
python app.py
```

**Terminal 4 - API Gateway:**
```bash
cd apps/api-gateway
pip install -r requirements.txt
python app.py
```

**Terminal 5 - Frontend:**
```bash
npx nx serve frontend
```

## 🔗 Endpoints

### Frontend
- **URL**: http://localhost:3000
- **Mô tả**: Giao diện người dùng

### API Gateway
- **URL**: http://localhost:8000
- **Health Check**: `GET /health`
- **Start Interview**: `POST /interview/start`
- **Respond Audio**: `POST /interview/respond-audio`
- **Respond Text**: `POST /interview/respond-text`
- **End Interview**: `DELETE /interview/{session_id}`

### Services (Internal)
- **STT Service**: http://localhost:8001
- **LLM Service**: http://localhost:8002
- **TTS Service**: http://localhost:8003

## 🛠️ Nx Commands

```bash
# Xem project graph
npx nx graph

# Build frontend
npx nx build frontend

# Serve frontend
npx nx serve frontend

# Lint frontend
npx nx lint frontend

# Test frontend
npx nx test frontend
```

## 📝 API Keys

Dự án sử dụng các API keys sau (đã được cấu hình sẵn):

## 🎯 Tính năng

✅ Speech-to-Text (Groq Whisper)  
✅ AI Interviewer (Google Gemini)  
✅ Text-to-Speech (Microsoft Edge-TTS)  
✅ Giao diện web đơn giản  
✅ Hỗ trợ ghi âm và nhập văn bản  
✅ Session management  
✅ Microservices architecture  
✅ Docker containerization  
✅ Nx Monorepo  

## 📚 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: FastAPI, Python 3.11
- **AI/ML**: Groq Whisper, Google Gemini, Edge-TTS
- **DevOps**: Docker, Docker Compose
- **Monorepo**: Nx

## 🐛 Troubleshooting

### Lỗi kết nối giữa các services
- Kiểm tra tất cả services đã chạy: `docker-compose ps`
- Xem logs: `docker-compose logs -f [service-name]`

### Lỗi API Key
- Kiểm tra file `.env` đã được tạo và có đúng API keys
- Restart services sau khi thay đổi `.env`

### Lỗi CORS
- API Gateway đã cấu hình CORS cho phép tất cả origins
- Nếu vẫn lỗi, kiểm tra `NEXT_PUBLIC_GATEWAY_URL` trong `.env`

---

## 📖 Nx Workspace - Additional Documentation

[Learn more about this workspace setup and its capabilities](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/intro#learn-nx?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
