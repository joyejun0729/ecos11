# 🌿 학교 분리수거 AI 도우미 (School EcoSort AI)

> **스마트 카메라 제품 스캔으로 학교 및 일상 속 쓰레기의 재질별 분리배출 방법, 캠퍼스 수거함 지도 및 탄소 절감 리포트를 제공하는 AI 웹 서비스**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.6_Flash-green.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)

---

## 📌 주요 특징 (Key Features)

1. **📷 AI 멀티모달 카메라 스캐너 (`/api/analyze-item`)**
   - 웹 카메라 촬영, 이미지 파일 업로드, 또는 제품명 검색 지원.
   - `@google/genai` (Gemini 3.6 Flash)를 서버 측 프록시에서 호출하여 안전하게 재질 및 분리배출 방법 분석.
   - 구성 부위별(용기, 라벨, 뚜껑 등) 상세 소재 분해 및 배출 수거함 안내.

2. **🏫 우리학교 캠퍼스 분리수거함 지도**
   - 본관, 급식실/매점, 도서관, 과학실, 체육관 등 주요 교내 수거함 위치 핀 표시.
   - 재질 필터(투명페트병, 종이팩, 비닐류, 폐건전지 등)별 맞춤 수거 구역 확인.

3. **💬 AI 분리수거 Q&A 지식iN 멘토 (`/api/chat`)**
   - "기름 묻은 치킨 상자는?", "깨진 유리컵 버리는 법", "우유팩을 말려버려야 하는 이유" 등 학생들의 궁금증에 실시간 답변.

4. **📊 에코 실천 리포트 & 퀴즈**
   - 나의 스캔 기록 및 이산화탄소(CO₂e) 절감량 통계.
   - 스캔 횟수 기반 에코 배치 잠금해제 및 일일 분리배출 퀴즈.

5. **⚡ 오프라인 및 즉시 체험 모드 (Fallback Engine)**
   - API 키 미설정 또는 네트워크 단절 시에도 6가지 대표 샘플(생수병, 과자봉지, 우유팩, 카페컵, 컵라면, 폐건전지)을 1클릭으로 분석 체험 가능.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Express 4, Node.js, `esbuild` (Production bundler)
- **AI Model**: Google Gemini API (`@google/genai` SDK, `gemini-3.6-flash`)
- **Build Tool**: Vite 6, `tsx`

---

## 🚀 시작하기 (Quick Start)

### 1. 저장소 클론 및 패키지 설치

```bash
git clone https://github.com/your-username/school-ecosort-ai.git
cd school-ecosort-ai
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Gemini API 키를 설정합니다:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. 개발 서버 실행

```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속합니다.

### 4. 프로덕션 빌드 및 실행

```bash
npm run build
npm start
```

---

## 📂 프로젝트 구조 (Project Structure)

```
school-ecosort-ai/
├── server.ts              # Express Backend (Gemini API Proxy & Vite Middleware)
├── index.html             # HTML Entry
├── package.json           # Dependencies & Scripts
├── .env.example           # Environment Variable Template
├── README.md              # Project Documentation
└── src/
    ├── main.tsx           # React Mounting Entry
    ├── App.tsx            # Main Layout & Tab Manager
    ├── types.ts           # WasteAnalysisResult & Interfaces
    ├── data/
    │   └── mockData.ts    # Preset Items & Campus Bin Locations
    ├── services/
    │   └── apiService.ts  # Client API Proxy & Fallback Engine
    └── components/
        ├── Header.tsx           # Top Bar & Navigation
        ├── CameraScanner.tsx    # AI Camera & Upload Scanner
        ├── AnalysisResult.tsx   # Material Breakdown View
        ├── CampusBinMap.tsx     # School Map & Location Pins
        ├── EcoChat.tsx          # AI Waste Q&A Chat
        ├── EcoDashboard.tsx     # History, Carbon Stats & Quizzes
        ├── RecyclingGuide.tsx   # Cheatsheet
        └── GithubModal.tsx      # Developer Guide
```

---

## 📄 라이선스 (License)

Apache License 2.0
