# HireMind Setup Guide

Quick setup instructions for getting HireMind running locally.

## 1. Prerequisites

Before you start, ensure you have:

- **Python 3.8 or higher**
  ```bash
  python --version
  ```

- **Node.js 16 or higher** (for npm)
  ```bash
  node --version
  npm --version
  ```

- **Google Gemini API Key**
  - Get it from: https://makersuite.google.com/app/apikey
  - Free tier available

## 2. Environment Setup

1. **Create `.env` file in the project root:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your API key:**
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   ```

   > ⚠️ Never commit `.env` to version control!

## 3. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create Python virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   ✅ Backend running on: `http://localhost:8000`
   📚 API docs: `http://localhost:8000/docs`

## 4. Frontend Setup (In New Terminal)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   ✅ Frontend running on: `http://localhost:3000`

## 5. Using HireMind

### Option A: Try Demo Mode

1. Open `http://localhost:3000` in browser
2. Click **"Try Demo"** button
3. Pre-loaded sample candidates will appear
4. Evaluate as needed

> Demo mode shows simulated AI responses without needing API calls

### Option B: Real Evaluation

1. **Upload Job Description**
   - Navigate to "Job Description" page
   - Upload a PDF file
   - System extracts and structures the job details

2. **Upload Candidates**
   - Navigate to "Candidates" page
   - Upload resume PDF (required)
   - Upload interview transcript PDF (optional)

3. **Run Evaluation**
   - Select a candidate
   - Click evaluate
   - Wait for all 4 agents to complete
   - View results in "Final Decisions" page

## 6. Troubleshooting

### "ModuleNotFoundError" when running backend
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Frontend not connecting to backend
- Check backend is running on `http://localhost:8000`
- Check CORS settings in `app/main.py`
- Clear browser cache and refresh

### "GEMINI_API_KEY not found" error
- Ensure `.env` file exists in project root
- Check API key is correctly set in `.env`
- Backend restart may be needed after `.env` change

### PDF upload fails
- Ensure file is a valid PDF
- Check file size (should be under 10MB)
- Try different PDF if available

### Slow evaluation
- First evaluation takes longer (model loading)
- Each agent call takes 10-30 seconds
- Full pipeline: ~2-3 minutes for 1 candidate

## 7. Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Run Backend in Production
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 8. Project Structure

```
HireMind/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app
│   │   ├── models.py         # Pydantic models
│   │   ├── llm.py           # Gemini API wrapper
│   │   ├── pdf.py           # PDF extraction
│   │   ├── profile.py       # Evidence extraction
│   │   ├── agents.py        # Four agents
│   │   ├── debate.py        # Debate stage
│   │   └── decision.py      # Final decision
│   ├── requirements.txt
│   ├── .gitignore
│   └── .env (not in git)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/          # React hooks
│   │   ├── App.jsx         # Main app
│   │   ├── api.js          # API client
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── .env.example
├── .gitignore
└── README.md
```

## 9. Next Steps

- **Customize Agents** — Modify evaluation criteria in `agents.py`
- **Add Database** — Replace in-memory storage with PostgreSQL
- **Deploy** — Use Docker + cloud platform (Heroku, AWS, etc.)
- **Fine-tune Model** — Experiment with different Gemini models

## 10. Support

For issues:
1. Check the main [README.md](./README.md)
2. Review error messages carefully
3. Check backend logs: Terminal running `uvicorn`
4. Check browser console: DevTools (F12)

---

Happy hiring! 🚀
