"""Multi-agent debate stage"""
import json
from typing import List
from app.models import (
    AgentAssessment,
    DebateStatement,
    DirectResponse,
    CandidateProfile,
    JobDescription,
)
from app.llm import LLMService


class DebateStage:
    """Manages the debate between agents"""

    @staticmethod
    def run_debate(
        profile: CandidateProfile,
        job: JobDescription,
        assessments: List[AgentAssessment],
    ) -> List[DebateStatement]:
        """
        Run debate stage where agents see each other's assessments
        and can challenge conclusions.
        
        Args:
            profile: Candidate profile
            job: Job description
            assessments: Independent assessments from all four agents
            
        Returns:
            List of debate statements from each agent
        """
        debate_statements = []

        # Prepare summaries of other agents' assessments
        agent_summaries = {}
        for assessment in assessments:
            agent_summaries[assessment.agent] = {
                "overall": assessment.overall_assessment,
                "strengths": assessment.strengths,
                "concerns": assessment.concerns,
                "confidence": assessment.confidence,
            }

        # Each agent gets to respond to others
        agents_to_debate = [a.agent for a in assessments]
        for agent_name in agents_to_debate:
            statement = DebateStage._agent_debate_response(
                agent_name, profile, job, assessments, agent_summaries
            )
            debate_statements.append(statement)

        return debate_statements

    @staticmethod
    def _agent_debate_response(
        agent_name: str,
        profile: CandidateProfile,
        job: JobDescription,
        assessments: List[AgentAssessment],
        agent_summaries: dict,
    ) -> DebateStatement:
        """Generate debate response from a single agent"""

        current_assessment = next(
            (a for a in assessments if a.agent == agent_name), None
        )
        if not current_assessment:
            return DebateStatement(
                agent=agent_name,
                opinion_before="",
                opinion_after="Error: assessment not found",
                changed_opinion=False,
            )

        opinion_before = current_assessment.overall_assessment

        # Build prompt for agent to respond to others
        other_agents = [a for a in agent_summaries if a != agent_name]

        prompt = f"""You are the {agent_name} Agent. Review other agents' assessments and respond.

CANDIDATE: {profile.candidate_name}
ROLE: {job.job_title} at {job.company}

YOUR INITIAL ASSESSMENT:
{opinion_before}

OTHER AGENTS' ASSESSMENTS:
"""

        for other_agent in other_agents:
            summary = agent_summaries[other_agent]
            prompt += f"""
{other_agent} Agent:
- Overall: {summary['overall']}
- Strengths: {', '.join(summary['strengths'])}
- Concerns: {', '.join(summary['concerns'])}
- Confidence: {summary['confidence']}%

"""

        prompt += """
DEBATE TASK:
1. Address at least 2 specific points from other agents
2. Agree or disagree with their assessments
3. Challenge their evidence if needed
4. State if your opinion changed and why
5. Identify any remaining disagreements

Return JSON:
{
  "direct_responses": [
    {"target_agent": "Technical", "response": "I agree/disagree because..."},
    {"target_agent": "HR/Culture", "response": "..."}
  ],
  "opinion_before": "Original assessment",
  "opinion_after": "Updated assessment or same",
  "changed_opinion": false,
  "change_reason": "Why opinion changed or 'No change'",
  "remaining_disagreement": "Any unresolved disagreement with others"
}

Return ONLY valid JSON."""

        try:
            result = LLMService.call_model_json(prompt, max_retries=2)

            direct_responses = [
                DirectResponse(**dr) for dr in result.get("direct_responses", [])
            ]

            return DebateStatement(
                agent=agent_name,
                direct_responses=direct_responses,
                opinion_before=result.get("opinion_before", opinion_before),
                opinion_after=result.get("opinion_after", opinion_before),
                changed_opinion=result.get("changed_opinion", False),
                change_reason=result.get("change_reason", ""),
                remaining_disagreement=result.get("remaining_disagreement", ""),
            )

        except Exception as e:
            return DebateStatement(
                agent=agent_name,
                opinion_before=opinion_before,
                opinion_after=f"Error in debate: {str(e)}",
                changed_opinion=False,
            )
