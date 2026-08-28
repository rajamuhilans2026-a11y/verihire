"""Independent AI agents for candidate evaluation"""
import json
from typing import List, Dict, Any
from app.models import (
    CandidateProfile,
    JobDescription,
    AgentAssessment,
    DimensionAssessment,
    EvidenceCitation,
)
from app.llm import LLMService


class AgentEvaluator:
    """Manages independent agent evaluations"""

    @staticmethod
    def technical_agent(
        profile: CandidateProfile, job: JobDescription
    ) -> AgentAssessment:
        """
        Technical Agent - Evaluates Python/backend, AI/LLM, RAG, vector search,
        multi-agent systems, production engineering
        """
        prompt = f"""You are the Technical Agent. Evaluate this candidate's technical capabilities.

JOB: {job.job_title} at {job.company}
REQUIRED: {', '.join(job.required_skills)}

CANDIDATE: {profile.candidate_name}

Technical Experience:
- Skills: {', '.join(profile.technical_skills)}
- AI/LLM Experience: {len(profile.ai_llm_experience)} evidence items
- Multi-Agent Experience: {len(profile.multi_agent_experience)} evidence items
- Production Experience: {len(profile.production_experience)} evidence items

Key Evidence:
{json.dumps([e.dict() for e in profile.ai_llm_experience[:3]], indent=2)}
{json.dumps([e.dict() for e in profile.production_experience[:3]], indent=2)}

Evaluate:
1. Python/backend skills strength (0-100)
2. AI/LLM knowledge depth (0-100)
3. RAG and vector search understanding (0-100)
4. Multi-agent systems experience (0-100)
5. Production engineering maturity (0-100)

Return JSON:
{{
  "agent": "Technical",
  "overall_assessment": "Summary of technical capabilities",
  "dimensions": [
    {{"dimension": "Python/Backend", "score": 0, "evidence": [], "notes": "..."}}
  ],
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1"],
  "evidence_citations": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "confidence": 85
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)
            return AgentAssessment(
                agent=result.get("agent", "Technical"),
                overall_assessment=result.get("overall_assessment", ""),
                dimensions=[
                    DimensionAssessment(**d) for d in result.get("dimensions", [])
                ],
                strengths=result.get("strengths", []),
                concerns=result.get("concerns", []),
                evidence_citations=[
                    EvidenceCitation(**e)
                    for e in result.get("evidence_citations", [])
                ],
                confidence=float(result.get("confidence", 0)),
            )
        except Exception as e:
            return AgentAssessment(
                agent="Technical",
                overall_assessment=f"Error: {str(e)}",
                confidence=0,
            )

    @staticmethod
    def hr_agent(
        profile: CandidateProfile, job: JobDescription
    ) -> AgentAssessment:
        """
        HR/Culture Agent - Evaluates communication, teamwork, accountability,
        honesty, adaptability, ownership
        """
        prompt = f"""You are the HR/Culture Agent. Evaluate this candidate's soft skills and cultural fit.

JOB: {job.job_title} at {job.company}

CANDIDATE: {profile.candidate_name}

Interview Evidence:
{json.dumps([e.dict() for e in profile.interview_evidence[:5]], indent=2)}

Education: {', '.join(profile.education)}

Evaluate:
1. Communication clarity (0-100)
2. Teamwork and collaboration (0-100)
3. Accountability and ownership (0-100)
4. Honesty and transparency (0-100)
5. Adaptability (0-100)

Return JSON:
{{
  "agent": "HR/Culture",
  "overall_assessment": "Summary of soft skills and cultural fit",
  "dimensions": [
    {{"dimension": "Communication", "score": 0, "evidence": [], "notes": "..."}}
  ],
  "strengths": ["strength1"],
  "concerns": ["concern1"],
  "evidence_citations": [
    {{"claim": "...", "source": "transcript", "quote": "..."}}
  ],
  "confidence": 80
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)
            return AgentAssessment(
                agent=result.get("agent", "HR/Culture"),
                overall_assessment=result.get("overall_assessment", ""),
                dimensions=[
                    DimensionAssessment(**d) for d in result.get("dimensions", [])
                ],
                strengths=result.get("strengths", []),
                concerns=result.get("concerns", []),
                evidence_citations=[
                    EvidenceCitation(**e)
                    for e in result.get("evidence_citations", [])
                ],
                confidence=float(result.get("confidence", 0)),
            )
        except Exception as e:
            return AgentAssessment(
                agent="HR/Culture",
                overall_assessment=f"Error: {str(e)}",
                confidence=0,
            )

    @staticmethod
    def hiring_manager_agent(
        profile: CandidateProfile, job: JobDescription
    ) -> AgentAssessment:
        """
        Hiring Manager Agent - Evaluates role-specific fit for
        AI Engineer — Agentic Systems (Freight Operations)
        """
        prompt = f"""You are the Hiring Manager for the {job.job_title} role at {job.company}.

Role Requirements:
{json.dumps(job.dict(), indent=2)}

CANDIDATE: {profile.candidate_name}

Experience Summary:
- Years in field: {json.dumps(profile.years_of_experience)}
- Production experience: {len(profile.production_experience)} items
- Freight/Logistics experience: {len(profile.freight_logistics_experience)} items
- Multi-agent systems: {len(profile.multi_agent_experience)} items

Key Evidence:
{json.dumps([e.dict() for e in profile.freight_logistics_experience[:3]], indent=2)}

Evaluate:
1. Job fit (0-100)
2. Production ownership capability (0-100)
3. Ramp-up time estimate (0-100, higher = faster ramp)
4. Domain knowledge for freight/operations (0-100)
5. Overall hiring recommendation confidence (0-100)

Return JSON:
{{
  "agent": "Hiring Manager",
  "overall_assessment": "Role-specific evaluation",
  "dimensions": [
    {{"dimension": "Job Fit", "score": 0, "evidence": [], "notes": "..."}}
  ],
  "strengths": ["strength1"],
  "concerns": ["concern1"],
  "evidence_citations": [],
  "confidence": 75
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)
            return AgentAssessment(
                agent=result.get("agent", "Hiring Manager"),
                overall_assessment=result.get("overall_assessment", ""),
                dimensions=[
                    DimensionAssessment(**d) for d in result.get("dimensions", [])
                ],
                strengths=result.get("strengths", []),
                concerns=result.get("concerns", []),
                evidence_citations=[
                    EvidenceCitation(**e)
                    for e in result.get("evidence_citations", [])
                ],
                confidence=float(result.get("confidence", 0)),
            )
        except Exception as e:
            return AgentAssessment(
                agent="Hiring Manager",
                overall_assessment=f"Error: {str(e)}",
                confidence=0,
            )

    @staticmethod
    def skeptic_agent(
        profile: CandidateProfile, job: JobDescription
    ) -> AgentAssessment:
        """
        Skeptic Agent - Adversarial reviewer looking for contradictions,
        exaggerations, unsupported claims, gaps, and risks
        """
        prompt = f"""You are the Skeptic Agent. Challenge claims, find gaps, identify red flags.

CANDIDATE: {profile.candidate_name}

Resume vs Interview:
- Resume claims: {len(profile.important_claims)} major claims
- Interview evidence: {len(profile.interview_evidence)} items
- Contradictions found: {len(profile.contradictions)}

Key contradictions:
{json.dumps(profile.contradictions[:5], indent=2)}

Evidence gaps:
{json.dumps([e.dict() for e in profile.important_claims[:3]], indent=2)}

Evaluate:
1. Claim reliability and evidence backing (0-100, lower = more skepticism)
2. Resume vs interview consistency (0-100)
3. Exaggeration risk (0-100, lower = more exaggeration)
4. Critical gaps in required experience (0-100)
5. Overall hiring risk assessment (0-100, lower = higher risk)

Return JSON:
{{
  "agent": "Skeptic",
  "overall_assessment": "Challenge summary: key doubts and red flags",
  "dimensions": [
    {{"dimension": "Evidence Reliability", "score": 0, "evidence": [], "notes": "..."}}
  ],
  "strengths": ["what's actually well-supported"],
  "concerns": ["doubt1", "gap1", "red_flag1"],
  "evidence_citations": [],
  "confidence": 80
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)
            return AgentAssessment(
                agent=result.get("agent", "Skeptic"),
                overall_assessment=result.get("overall_assessment", ""),
                dimensions=[
                    DimensionAssessment(**d) for d in result.get("dimensions", [])
                ],
                strengths=result.get("strengths", []),
                concerns=result.get("concerns", []),
                evidence_citations=[
                    EvidenceCitation(**e)
                    for e in result.get("evidence_citations", [])
                ],
                confidence=float(result.get("confidence", 0)),
            )
        except Exception as e:
            return AgentAssessment(
                agent="Skeptic",
                overall_assessment=f"Error: {str(e)}",
                confidence=0,
            )

    @staticmethod
    def run_all_agents(
        profile: CandidateProfile, job: JobDescription
    ) -> List[AgentAssessment]:
        """Run all four independent agents"""
        assessments = [
            AgentEvaluator.technical_agent(profile, job),
            AgentEvaluator.hr_agent(profile, job),
            AgentEvaluator.hiring_manager_agent(profile, job),
            AgentEvaluator.skeptic_agent(profile, job),
        ]
        return assessments
