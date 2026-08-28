# HireMind — Multi-Agent AI Hiring Intelligence System

A demonstration project for evidence-based, AI-powered hiring using multiple independent agents, adversarial debate, and explainable decision-making.

## 🎯 Project Overview

HireMind evaluates job candidates through a sophisticated multi-stage process:

1. **Evidence Extraction** — AI analyzes resumes and transcripts to extract factual claims with source quotes
2. **Independent Agent Evaluation** — Four specialized agents evaluate independently without seeing each other's opinions:
   - **Technical Agent** — Evaluates Python, ML/LLM, RAG, vector search, multi-agent systems, production engineering
   - **HR/Culture Agent** — Evaluates communication, teamwork, accountability, honesty, adaptability
   - **Hiring Manager Agent** — Evaluates role-specific fit for the AI Engineer position
   - **Skeptic Agent** — Adversarially challenges claims, looks for gaps, identifies risks
3. **Agent Debate** — Agents review each other's assessments and can challenge conclusions
4. **Final Decision** — A meta-agent makes the final HIRE / NO HIRE / BORDERLINE decision based on evidence strength, not just averages

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│                   Dark Dashboard UI                     │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│               Backend (FastAPI + Python)                │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ PDF Extract │  │ Profile Build │  │ Evidence Ex.  │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Independent Agents (No Cross-Talk)        │  │
│  │  Technical │ HR/Culture │ Hiring Manager │ Skeptic  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Agent Debate (See Each Other's Opinions)     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Final Decision (Evidence Strength Analysis)     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│            Google Gemini API (LLM Backbone)            │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp ../.env.example ../.env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   Server runs on `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🎮 Using the Application

### Demo Mode
Click **Try Demo** on the homepage to load sample candidates and see the full evaluation pipeline with simulated AI responses.

### Real Evaluation

1. **Upload Job Description**
   - Go to "Job Description" page
   - Upload a PDF with the job description
   - System extracts company, title, skills, requirements

2. **Upload Candidates**
   - Go to "Candidates" page
   - Upload resume PDF (required)
   - Upload interview transcript PDF (optional)
   - Candidate profile is built automatically

3. **Run Evaluation**
   - Select candidate to evaluate
   - System runs all four agents independently
   - Debate phase begins
   - Final decision is generated

4. **Review Results**
   - **Dashboard** — Overview of evaluations
   - **Agent Panel** — Individual agent assessments
   - **Debate Room** — Agent disagreements and opinion changes
   - **Final Decisions** — Hiring recommendations
   - **Evidence Explorer** — All claims with source quotes

## 📊 Key Features

### Multi-Agent Architecture
- Agents are truly independent — they don't see other agents' opinions until debate
- Each agent has specialized evaluation criteria
- Debate creates a real multi-agent deliberation system

### Evidence Grounding
- Every important claim includes exact source quote
- Evidence trail: Claim → Source → Quote
- Candidates distinguished: facts vs. interpretations vs. assumptions

### Explainability
- No black-box AI decisions
- Clear reasoning for HIRE/NO HIRE/BORDERLINE
- Unresolved disagreements are explicit
- Risk factors highlighted

### Production Quality
- Error handling for missing files, corrupt PDFs, API failures
- JSON validation and safe extraction
- Retry logic with exponential backoff
- Token efficiency (avoids sending full documents repeatedly)

## 🔌 API Endpoints

### Health & Status
```
GET  /api/health              # System status
```

### File Upload
```
POST /api/upload/job          # Upload job description PDF
POST /api/upload/candidate    # Upload candidate resume + transcript
```

### Processing
```
POST /api/profile/{candidate_id}       # Build structured profile
POST /api/evaluate/{candidate_id}      # Run full evaluation pipeline
```

### Results
```
GET  /api/candidates                   # List all candidates
GET  /api/candidates/{candidate_id}    # Get candidate details
GET  /api/results/{candidate_id}       # Get evaluation results
```

## 📝 Data Structures

### Candidate Profile
```json
{
  "candidate_id": "uuid",
  "candidate_name": "Name",
  "education": ["degrees"],
  "years_of_experience": {"field": years},
  "technical_skills": ["skill1", "skill2"],
  "ai_llm_experience": [{"claim": "...", "source": "resume", "quote": "..."}],
  "multi_agent_experience": [...],
  "production_experience": [...],
  "freight_logistics_experience": [...],
  "contradictions": [...]
}
```

### Agent Assessment
```json
{
  "agent": "Technical",
  "overall_assessment": "Assessment summary",
  "dimensions": [{"dimension": "...", "score": 85, "notes": "..."}],
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1"],
  "evidence_citations": [{"claim": "...", "quote": "...", "source": "resume"}],
  "confidence": 87
}
```

### Final Decision
```json
{
  "recommendation": "HIRE|NO HIRE|BORDERLINE",
  "confidence": 85,
  "reasoning": "Candidate demonstrates...",
  "strongest_evidence": [...],
  "major_concerns": [...],
  "unresolved_disagreements": [...]
}
```

## 🎨 UI Components

### Pages
- **Dashboard** — Overview and CTA for new evaluations
- **Job Description** — View/edit extracted job details
- **Candidates** — Upload and view candidate cards
- **Agent Panel** — View individual agent assessments
- **Debate Room** — See agent disagreements and opinion changes
- **Final Decisions** — Final hiring recommendations
- **Evidence Explorer** — Browse all evidence with quotes

### Design
- **Dark Theme** — Professional dark dashboard (Slate 950)
- **Glassmorphism** — Subtle borders and backgrounds
- **Responsive** — Works on desktop and tablet
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation

## 🔐 Security

- **No API key exposure** — API keys stay on backend only
- **File validation** — Only PDF files accepted, size limits enforced
- **Sanitized output** — Filenames sanitized, paths not exposed
- **Safe JSON parsing** — Validates all LLM responses
- **No credential logging** — API keys never logged

## ⚠️ Limitations & Future Improvements

### Current Limitations
- In-memory candidate storage (use database in production)
- No user authentication (add if multi-user)
- OCR fallback not implemented (handle gracefully)
- No scheduling/batch evaluation

### Future Enhancements
- PostgreSQL backend with persistent storage
- User accounts and evaluation history
- Batch evaluation of multiple candidates
- Export reports (PDF/CSV)
- Integrated video interview analysis
- Custom agent definitions
- Fine-tuned evaluation models

## 📚 Technology Stack

### Frontend
- **React 18** — Component framework
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **Axios** — HTTP client

### Backend
- **FastAPI** — Modern Python web framework
- **Pydantic** — Data validation
- **PyMuPDF** — PDF extraction
- **Google GenAI SDK** — LLM access
- **Python-dotenv** — Environment configuration

### AI
- **Google Gemini** — Multi-turn LLM
- Configurable model (default: `gemini-2.0-flash`)

## 🧪 Testing

### Demo Mode
Built-in demo mode loads sample candidates and simulated responses without needing Gemini API.

### Manual Testing
1. Set up both backend and frontend
2. Set `GEMINI_API_KEY` in `.env`
3. Upload sample resume PDFs
4. Verify all four agents produce assessments
5. Check debate stage shows opinion changes
6. Verify final decision reasoning

## 📖 Environment Variables

Create `.env` file in project root:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Do NOT commit `.env` file. Use `.env.example` as template.

## 📄 License

This is a demonstration project for the Prompt Engineering / AI Application Building Competition.

## 👨‍💼 Competition Goals

HireMind demonstrates:

1. **Multi-Agent Reasoning** — Four independent agents with specialized roles
2. **Adversarial Debate** — Agents challenge each other, creating genuine deliberation
3. **Evidence Grounding** — Every conclusion traces back to source material
4. **Explainability** — Decisions are transparent and justified, not black-box
5. **Production Quality** — Error handling, reliability, and real-world considerations
6. **Architecture Clarity** — Clear separation of stages: Extract → Evaluate → Debate → Decide

The application proves that AI hiring can be both sophisticated AND trustworthy through evidence-based reasoning and genuine multi-agent collaboration.

---

**Built with**: Python + FastAPI + React + Vite + Google Gemini API
