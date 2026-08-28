"""Candidate profile extraction from documents"""
import json
from typing import Dict, Any
from app.models import CandidateProfile, EvidenceItem, JobDescription
from app.llm import LLMService


class ProfileBuilder:
    """Builds structured candidate profiles from resume and transcript"""

    @staticmethod
    def build_profile(
        candidate_id: str,
        candidate_name: str,
        resume_text: str,
        transcript_text: str = "",
    ) -> CandidateProfile:
        """
        Build a structured candidate profile using AI.
        
        Args:
            candidate_id: Unique candidate ID
            candidate_name: Candidate name
            resume_text: Resume text content
            transcript_text: Interview transcript text content
            
        Returns:
            Structured CandidateProfile with evidence
        """
        prompt = f"""You are an Evidence Extraction Specialist. Your job is to extract ONLY facts and evidence from candidate documents.

IMPORTANT RULES:
1. NEVER invent evidence. Only extract what is explicitly stated.
2. For every claim, provide the exact quote from the source.
3. If information is missing or unclear, mark as "insufficient evidence"
4. Distinguish between facts and interpretations
5. Note any contradictions between resume and transcript

RESUME:
{resume_text}

INTERVIEW TRANSCRIPT:
{transcript_text if transcript_text else "No transcript provided"}

Extract evidence in this JSON format:
{{
  "candidate_name": "{candidate_name}",
  "education": ["degree or certification"],
  "years_of_experience": {{"field": years}},
  "technical_skills": ["skill1", "skill2"],
  "relevant_experience": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "ai_llm_experience": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "multi_agent_experience": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "production_experience": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "freight_logistics_experience": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "important_claims": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "interview_evidence": [
    {{"claim": "...", "source": "transcript", "quote": "..."}}
  ],
  "contradictions_or_questionable_claims": [
    {{"issue": "...", "resume_claim": "...", "transcript_claim": "...", "quote1": "...", "quote2": "..."}}
  ]
}}

Return ONLY valid JSON. No explanation."""

        try:
            result = LLMService.call_model_json(prompt)

            # Build profile from extracted evidence
            profile = CandidateProfile(
                candidate_id=candidate_id,
                candidate_name=result.get("candidate_name", candidate_name),
                education=result.get("education", []),
                years_of_experience=result.get("years_of_experience", {}),
                technical_skills=result.get("technical_skills", []),
                relevant_experience=[
                    EvidenceItem(**item)
                    for item in result.get("relevant_experience", [])
                ],
                ai_llm_experience=[
                    EvidenceItem(**item) for item in result.get("ai_llm_experience", [])
                ],
                multi_agent_experience=[
                    EvidenceItem(**item)
                    for item in result.get("multi_agent_experience", [])
                ],
                production_experience=[
                    EvidenceItem(**item)
                    for item in result.get("production_experience", [])
                ],
                freight_logistics_experience=[
                    EvidenceItem(**item)
                    for item in result.get("freight_logistics_experience", [])
                ],
                important_claims=[
                    EvidenceItem(**item) for item in result.get("important_claims", [])
                ],
                interview_evidence=[
                    EvidenceItem(**item)
                    for item in result.get("interview_evidence", [])
                ],
                contradictions=result.get("contradictions_or_questionable_claims", []),
            )

            return profile

        except Exception as e:
            # Return empty profile on error
            return CandidateProfile(
                candidate_id=candidate_id,
                candidate_name=candidate_name,
                education=[],
                years_of_experience={},
                technical_skills=[],
                relevant_experience=[],
                ai_llm_experience=[],
                multi_agent_experience=[],
                production_experience=[],
                freight_logistics_experience=[],
                important_claims=[],
                interview_evidence=[],
                contradictions=[],
            )

    @staticmethod
    def build_job_description(job_text: str) -> JobDescription:
        """
        Extract structured job description from text.
        
        Args:
            job_text: Raw job description text
            
        Returns:
            Structured JobDescription
        """
        prompt = f"""Extract key information from this job description:

{job_text}

Return JSON:
{{
  "company": "...",
  "job_title": "...",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "experience_requirements": ["requirement1"],
  "responsibilities": ["responsibility1"],
  "domain_requirements": ["requirement1"],
  "evaluation_criteria": ["criterion1"]
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt)

            return JobDescription(
                company=result.get("company", "Unknown"),
                job_title=result.get("job_title", "Unknown"),
                required_skills=result.get("required_skills", []),
                preferred_skills=result.get("preferred_skills", []),
                experience_requirements=result.get("experience_requirements", []),
                responsibilities=result.get("responsibilities", []),
                domain_requirements=result.get("domain_requirements", []),
                evaluation_criteria=result.get("evaluation_criteria", []),
                raw_text=job_text,
            )

        except Exception:
            return JobDescription(
                company="Unknown",
                job_title="Unknown",
                raw_text=job_text,
            )
