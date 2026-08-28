"""FastAPI application for HireMind"""
import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import aiofiles

from app.models import (
    JobDescription,
    CandidateData,
    UploadResponse,
    EvaluationResult,
    PDFExtractionResult,
)
from app.pdf import PDFExtractor
from app.profile import ProfileBuilder
from app.agents import AgentEvaluator
from app.debate import DebateStage
from app.decision import FinalDecisionMaker

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="HireMind API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo (in production, use database)
job_descriptions = {}
candidates = {}
evaluations = {}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "HireMind API"}


@app.post("/api/upload/job")
async def upload_job(file: UploadFile = File(...)):
    """Upload and process job description PDF"""
    try:
        # Save file
        file_id = str(uuid.uuid4())
        file_path = f"uploads/{file_id}.pdf"

        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        # Extract text
        extraction_result = PDFExtractor.extract_text(file_path)

        if not extraction_result.success:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": extraction_result.error or "PDF extraction failed",
                },
            )

        # Build structured job description
        job = ProfileBuilder.build_job_description(extraction_result.text)
        job_descriptions[file_id] = job

        return {
            "success": True,
            "job_id": file_id,
            "company": job.company,
            "job_title": job.job_title,
            "required_skills": job.required_skills,
            "preferred_skills": job.preferred_skills,
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Upload failed: {str(e)}"},
        )


@app.post("/api/upload/candidate")
async def upload_candidate(
    name: str,
    resume: UploadFile = File(...),
    transcript: UploadFile = File(None),
):
    """Upload candidate resume and optional interview transcript"""
    try:
        candidate_id = str(uuid.uuid4())

        # Extract resume
        resume_file_path = f"uploads/{candidate_id}_resume.pdf"
        resume_content = await resume.read()

        async with aiofiles.open(resume_file_path, "wb") as f:
            await f.write(resume_content)

        resume_extraction = PDFExtractor.extract_text(resume_file_path)
        if not resume_extraction.success:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": "Resume extraction failed",
                },
            )

        resume_text = resume_extraction.text

        # Extract transcript if provided
        transcript_text = ""
        if transcript:
            transcript_file_path = f"uploads/{candidate_id}_transcript.pdf"
            transcript_content = await transcript.read()

            async with aiofiles.open(transcript_file_path, "wb") as f:
                await f.write(transcript_content)

            transcript_extraction = PDFExtractor.extract_text(transcript_file_path)
            if transcript_extraction.success:
                transcript_text = transcript_extraction.text

        # Store candidate data
        candidate_data = CandidateData(
            name=name, resume_text=resume_text, transcript_text=transcript_text
        )
        candidates[candidate_id] = candidate_data

        return {
            "success": True,
            "candidate_id": candidate_id,
            "name": name,
            "resume_extracted": bool(resume_text),
            "transcript_extracted": bool(transcript_text),
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Upload failed: {str(e)}"},
        )


@app.post("/api/profile/{candidate_id}")
async def build_profile(candidate_id: str):
    """Build candidate profile from documents"""
    try:
        if candidate_id not in candidates:
            raise HTTPException(status_code=404, detail="Candidate not found")

        candidate_data = candidates[candidate_id]

        # Build profile
        profile = ProfileBuilder.build_profile(
            candidate_id,
            candidate_data.name,
            candidate_data.resume_text,
            candidate_data.transcript_text,
        )

        return profile.dict()

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Profile building failed: {str(e)}"},
        )


@app.post("/api/evaluate/{candidate_id}")
async def evaluate_candidate(candidate_id: str, job_id: str):
    """Run complete evaluation pipeline"""
    try:
        if candidate_id not in candidates:
            raise HTTPException(status_code=404, detail="Candidate not found")

        if job_id not in job_descriptions:
            raise HTTPException(status_code=404, detail="Job not found")

        candidate_data = candidates[candidate_id]
        job = job_descriptions[job_id]

        # Build profile
        profile = ProfileBuilder.build_profile(
            candidate_id,
            candidate_data.name,
            candidate_data.resume_text,
            candidate_data.transcript_text,
        )

        # Create evaluation result
        evaluation = EvaluationResult(
            candidate_id=candidate_id,
            candidate_name=candidate_data.name,
            job_title=job.job_title,
            status="extracting",
            profile=profile,
        )

        # Run independent agents
        evaluation.status = "agents"
        assessments = AgentEvaluator.run_all_agents(profile, job)
        evaluation.independent_assessments = assessments

        # Run debate
        evaluation.status = "debate"
        debate_statements = DebateStage.run_debate(profile, job, assessments)
        evaluation.debate_statements = debate_statements

        # Make final decision
        evaluation.status = "decision"
        final_decision = FinalDecisionMaker.make_decision(
            profile, job, assessments, debate_statements
        )
        evaluation.final_decision = final_decision

        evaluation.status = "complete"
        evaluations[candidate_id] = evaluation

        return evaluation.dict()

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Evaluation failed: {str(e)}"},
        )


@app.get("/api/candidates")
async def list_candidates():
    """List all candidates"""
    candidate_list = []
    for cid, candidate_data in candidates.items():
        evaluation = evaluations.get(cid)
        candidate_list.append(
            {
                "id": cid,
                "name": candidate_data.name,
                "status": evaluation.status if evaluation else "pending",
                "evaluated": cid in evaluations,
            }
        )
    return {"candidates": candidate_list}


@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    """Get candidate details"""
    if candidate_id not in candidates:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate_data = candidates[candidate_id]
    evaluation = evaluations.get(candidate_id)

    return {
        "id": candidate_id,
        "name": candidate_data.name,
        "status": evaluation.status if evaluation else "pending",
        "profile": evaluation.profile.dict() if evaluation and evaluation.profile else None,
    }


@app.get("/api/results/{candidate_id}")
async def get_evaluation_results(candidate_id: str):
    """Get evaluation results"""
    if candidate_id not in evaluations:
        raise HTTPException(status_code=404, detail="No evaluation found")

    evaluation = evaluations[candidate_id]
    return evaluation.dict()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
