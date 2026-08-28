"""Data models for HireMind"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    """An evidence claim with source reference"""
    claim: str
    source: str  # "resume" or "transcript"
    quote: str


class CandidateProfile(BaseModel):
    """Structured candidate profile with extracted evidence"""
    candidate_id: str
    candidate_name: str
    education: List[str] = []
    years_of_experience: Dict[str, int] = {}
    technical_skills: List[str] = []
    relevant_experience: List[EvidenceItem] = []
    ai_llm_experience: List[EvidenceItem] = []
    multi_agent_experience: List[EvidenceItem] = []
    production_experience: List[EvidenceItem] = []
    freight_logistics_experience: List[EvidenceItem] = []
    important_claims: List[EvidenceItem] = []
    interview_evidence: List[EvidenceItem] = []
    contradictions: List[Dict[str, Any]] = []


class JobDescription(BaseModel):
    """Structured job description"""
    company: str
    job_title: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_requirements: List[str] = []
    responsibilities: List[str] = []
    domain_requirements: List[str] = []
    evaluation_criteria: List[str] = []
    raw_text: str = ""


class EvidenceCitation(BaseModel):
    """Citation of evidence used in assessment"""
    claim: str
    source: str
    quote: str
    agent: Optional[str] = None


class DimensionAssessment(BaseModel):
    """Assessment of a specific dimension"""
    dimension: str
    score: float = Field(ge=0, le=100)
    evidence: List[EvidenceCitation] = []
    notes: str = ""


class AgentAssessment(BaseModel):
    """Output from a single agent"""
    agent: str
    overall_assessment: str
    dimensions: List[DimensionAssessment] = []
    strengths: List[str] = []
    concerns: List[str] = []
    evidence_citations: List[EvidenceCitation] = []
    confidence: float = Field(ge=0, le=100)


class DirectResponse(BaseModel):
    """Agent response to another agent during debate"""
    target_agent: str
    response: str


class DebateStatement(BaseModel):
    """Agent statement during debate"""
    agent: str
    direct_responses: List[DirectResponse] = []
    opinion_before: str
    opinion_after: str
    changed_opinion: bool = False
    change_reason: str = ""
    remaining_disagreement: str = ""


class FinalDecision(BaseModel):
    """Final hiring decision"""
    recommendation: str  # "HIRE", "NO HIRE", "BORDERLINE"
    confidence: float = Field(ge=0, le=100)
    reasoning: str
    strongest_evidence: List[EvidenceCitation] = []
    major_concerns: List[str] = []
    unresolved_disagreements: List[str] = []


class EvaluationResult(BaseModel):
    """Complete evaluation result for a candidate"""
    candidate_id: str
    candidate_name: str
    job_title: str
    status: str  # "pending", "extracting", "profiling", "agents", "debate", "decision", "complete"
    profile: Optional[CandidateProfile] = None
    independent_assessments: List[AgentAssessment] = []
    debate_statements: List[DebateStatement] = []
    final_decision: Optional[FinalDecision] = None


class PDFExtractionResult(BaseModel):
    """Result of PDF text extraction"""
    success: bool
    text: str = ""
    pages: int = 0
    source: str = "pdf"  # "pdf" or "ocr"
    error: Optional[str] = None


class CandidateData(BaseModel):
    """Candidate data for upload"""
    name: str
    resume_text: str
    transcript_text: Optional[str] = None


class UploadResponse(BaseModel):
    """Response from file upload"""
    success: bool
    candidate_id: Optional[str] = None
    message: str = ""
