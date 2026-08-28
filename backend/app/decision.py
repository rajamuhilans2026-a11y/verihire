"""Final hiring decision stage"""
import json
from typing import List
from app.models import (
    FinalDecision,
    EvidenceCitation,
    AgentAssessment,
    DebateStatement,
    CandidateProfile,
    JobDescription,
)
from app.llm import LLMService


class FinalDecisionMaker:
    """Makes final hiring decision based on all evidence"""

    @staticmethod
    def make_decision(
        profile: CandidateProfile,
        job: JobDescription,
        assessments: List[AgentAssessment],
        debate_statements: List[DebateStatement],
    ) -> FinalDecision:
        """
        Make final HIRE/NO HIRE/BORDERLINE decision.
        
        Does NOT simply average scores - considers evidence strength,
        job relevance, confidence, disagreements, contradictions.
        """

        # Prepare decision context
        strengths_summary = []
        concerns_summary = []
        disagreements = []

        for assessment in assessments:
            strengths_summary.extend(assessment.strengths)
            concerns_summary.extend(assessment.concerns)

        for debate in debate_statements:
            if debate.remaining_disagreement:
                disagreements.append(f"{debate.agent}: {debate.remaining_disagreement}")

        # Build decision prompt
        prompt = f"""You are making a FINAL HIRING DECISION for {job.job_title} at {job.company}.

CANDIDATE: {profile.candidate_name}

ROLE REQUIREMENTS:
- Title: {job.job_title}
- Required Skills: {', '.join(job.required_skills)}
- Preferred Skills: {', '.join(job.preferred_skills)}
- Domain: {', '.join(job.domain_requirements)}

CANDIDATE BACKGROUND:
- Experience: {json.dumps(profile.years_of_experience)}
- Education: {', '.join(profile.education)}
- AI/LLM Experience: {"Yes" if profile.ai_llm_experience else "No"}
- Multi-Agent Experience: {"Yes" if profile.multi_agent_experience else "No"}
- Production Experience: {"Yes" if profile.production_experience else "No"}
- Freight/Logistics Experience: {"Yes" if profile.freight_logistics_experience else "No"}
- Contradictions Found: {len(profile.contradictions)}

AGENT ASSESSMENTS SUMMARY:
"""
        for assessment in assessments:
            prompt += f"""
{assessment.agent} Agent (Confidence: {assessment.confidence}%):
- Assessment: {assessment.overall_assessment}
- Strengths: {', '.join(assessment.strengths)}
- Concerns: {', '.join(assessment.concerns)}
"""

        prompt += f"""

STRENGTHS CONSENSUS:
{', '.join(set(strengths_summary))}

CONCERNS CONSENSUS:
{', '.join(set(concerns_summary))}

AGENT DISAGREEMENTS:
{chr(10).join(disagreements) if disagreements else "None"}

DECISION CRITERIA:
1. Does candidate have REQUIRED skills? (Critical)
2. Production experience quality? (High)
3. Domain fit for freight/agentic systems? (High)
4. Team fit and communication? (Medium)
5. Ramp-up time reasonable? (Medium)
6. Major risks or red flags? (Critical)

DECISION RULES:
- HIRE: Strong fit, all critical criteria met, high confidence
- NO HIRE: Missing required skills, major concerns, low confidence
- BORDERLINE: Meets minimum requirements but has concerns OR strong but unusual profile

Return JSON:
{{
  "recommendation": "HIRE|NO HIRE|BORDERLINE",
  "confidence": 0-100,
  "reasoning": "Concise reasoning for this decision",
  "strongest_evidence": [
    {{"claim": "...", "source": "resume|transcript", "quote": "..."}}
  ],
  "major_concerns": ["concern1", "concern2"],
  "unresolved_disagreements": ["disagreement1"]
}}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)

            strongest_evidence = [
                EvidenceCitation(**e)
                for e in result.get("strongest_evidence", [])
            ]

            recommendation = result.get("recommendation", "BORDERLINE")
            if recommendation not in ["HIRE", "NO HIRE", "BORDERLINE"]:
                recommendation = "BORDERLINE"

            return FinalDecision(
                recommendation=recommendation,
                confidence=float(result.get("confidence", 50)),
                reasoning=result.get("reasoning", ""),
                strongest_evidence=strongest_evidence,
                major_concerns=result.get("major_concerns", []),
                unresolved_disagreements=result.get(
                    "unresolved_disagreements", []
                ),
            )

        except Exception as e:
            return FinalDecision(
                recommendation="BORDERLINE",
                confidence=0,
                reasoning=f"Error in final decision: {str(e)}",
                strongest_evidence=[],
                major_concerns=["Decision process failed"],
                unresolved_disagreements=[],
            )
