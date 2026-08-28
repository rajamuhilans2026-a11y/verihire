import { useState } from 'react'

export const useDemoData = () => {
  const [demoData, setDemoData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadDemoData = async () => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockData = {
      job: {
        company: 'TechCorp AI',
        job_title: 'AI Engineer — Agentic Systems',
        required_skills: ['Python', 'FastAPI', 'LangGraph', 'RAG', 'Vector Databases'],
        preferred_skills: ['CrewAI', 'Freight Operations', 'Production ML'],
        experience_requirements: ['3+ years Python', '2+ years ML/LLM'],
        responsibilities: [
          'Design and implement multi-agent orchestration systems',
          'Optimize RAG pipelines for production scale',
          'Mentor junior engineers on agentic patterns',
        ],
        domain_requirements: ['Freight/Logistics preferred'],
        evaluation_criteria: ['Technical depth', 'Production maturity', 'Team fit'],
        raw_text: 'Full job description would go here...',
      },
      candidates: [
        {
          id: '1',
          name: 'Rohan Malhotra',
          status: 'Evaluated',
          profile: {
            education: ['B.S. Computer Science, IIT Delhi'],
            years_of_experience: { Python: 4, 'LLM/AI': 2, 'Agentic Systems': 1 },
            technical_skills: [
              'Python',
              'FastAPI',
              'LangGraph',
              'CrewAI',
              'RAG',
              'Vector Databases',
            ],
            ai_llm_experience: [
              {
                claim: 'Built RAG system with LangGraph',
                source: 'resume',
                quote: 'Implemented advanced RAG pipeline using LangGraph for knowledge retrieval',
              },
            ],
            multi_agent_experience: [
              {
                claim: '2 years with multi-agent orchestration',
                source: 'transcript',
                quote: 'Led development of multi-agent freight optimization system',
              },
            ],
            production_experience: [
              {
                claim: 'Deployed 3 production ML systems',
                source: 'resume',
                quote: 'Deployed and maintained 3 production-scale ML systems serving 100k+ requests/day',
              },
            ],
            freight_logistics_experience: [
              {
                claim: '1 year in freight operations',
                source: 'resume',
                quote: 'Optimized freight routing system, reduced costs by 15%',
              },
            ],
          },
          assessments: [
            {
              agent: 'Technical',
              overall_assessment:
                'Strong Python and ML/LLM foundation. Demonstrated RAG and multi-agent experience.',
              confidence: 87,
              strengths: ['RAG expertise', 'Production experience', 'Agentic systems'],
              concerns: ['Limited CrewAI experience'],
            },
            {
              agent: 'HR/Culture',
              overall_assessment: 'Excellent communicator, strong team player, high ownership.',
              confidence: 85,
              strengths: ['Communication', 'Teamwork', 'Accountability'],
              concerns: [],
            },
            {
              agent: 'Hiring Manager',
              overall_assessment:
                'Good fit for role. Freight experience is valuable. Ramp-up time estimated 3-4 weeks.',
              confidence: 82,
              strengths: ['Domain experience', 'Production maturity'],
              concerns: ['New to freight at scale'],
            },
            {
              agent: 'Skeptic',
              overall_assessment:
                'Generally credible profile. Some claims lack detail but resume/transcript align well.',
              confidence: 78,
              strengths: ['Consistent story', 'Verifiable achievements'],
              concerns: ['Cost reduction claim lacks specifics'],
            },
          ],
          debate: [
            {
              agent: 'Technical',
              opinion_before: 'Strong technical fit',
              opinion_after: 'Confirmed strong fit after debate',
              changed_opinion: false,
              remaining_disagreement: 'None',
            },
            {
              agent: 'Skeptic',
              opinion_before: 'Generally credible',
              opinion_after: 'Maintained skepticism on specific metrics',
              changed_opinion: false,
              remaining_disagreement: 'Cost reduction metrics need clarification',
            },
          ],
          final_decision: {
            recommendation: 'HIRE',
            confidence: 84,
            reasoning:
              'Candidate demonstrates strong technical foundation with relevant multi-agent and freight experience. All critical requirements met. Team fit confirmed.',
            major_concerns: [],
            unresolved_disagreements: [],
          },
        },
        {
          id: '2',
          name: 'Ananya Iyer',
          status: 'Evaluated',
          profile: {
            education: ['B.Tech Information Technology, BITS Pilani'],
            years_of_experience: { Python: 6, 'LLM/AI': 3, 'Agentic Systems': 0 },
            technical_skills: [
              'Python',
              'FastAPI',
              'RAG',
              'LangChain',
              'Chroma',
              'Production ML',
            ],
            ai_llm_experience: [
              {
                claim: '3 years with LLM systems',
                source: 'resume',
                quote: 'Led development of LLM-powered customer service platform',
              },
            ],
            multi_agent_experience: [],
            production_experience: [
              {
                claim: '6 years production experience',
                source: 'resume',
                quote: 'Senior engineer with 6 years delivering production systems',
              },
            ],
            freight_logistics_experience: [],
          },
          assessments: [
            {
              agent: 'Technical',
              overall_assessment:
                'Solid production ML engineer. LLM experience but no multi-agent systems background.',
              confidence: 72,
              strengths: ['Production experience', 'RAG knowledge'],
              concerns: ['No multi-agent experience', 'LLM stack different'],
            },
            {
              agent: 'HR/Culture',
              overall_assessment: 'Strong communicator, proven leadership, excellent adaptability.',
              confidence: 89,
              strengths: ['Leadership', 'Adaptability', 'Communication'],
              concerns: [],
            },
            {
              agent: 'Hiring Manager',
              overall_assessment:
                'Borderline. Has production skills but missing domain and agentic systems expertise.',
              confidence: 65,
              strengths: ['Production maturity', 'Leadership'],
              concerns: ['No freight experience', 'No agentic systems background'],
            },
            {
              agent: 'Skeptic',
              overall_assessment:
                'Profile lacks specific agentic systems evidence. Claims are credible but role-specific gaps exist.',
              confidence: 70,
              strengths: [],
              concerns: [
                'No multi-agent system mention',
                'No freight/logistics experience',
              ],
            },
          ],
          debate: [
            {
              agent: 'Technical',
              opinion_before:
                'Concerned about agentic systems gap',
              opinion_after:
                'Somewhat reassured by RAG expertise but gap remains',
              changed_opinion: false,
              remaining_disagreement: 'Multi-agent learning curve significant',
            },
            {
              agent: 'HR/Culture',
              opinion_before: 'Strong culture fit',
              opinion_after: 'Confirmed excellent soft skills',
              changed_opinion: false,
              remaining_disagreement: 'None',
            },
          ],
          final_decision: {
            recommendation: 'BORDERLINE',
            confidence: 72,
            reasoning:
              'Candidate has strong production and soft skills but lacks multi-agent systems and domain experience. Could succeed with strong onboarding, but higher risk than preferred.',
            major_concerns: [
              'No demonstrated multi-agent systems experience',
              'No freight/logistics background',
            ],
            unresolved_disagreements: [
              'Can technical skills transfer quickly enough to agentic systems?',
            ],
          },
        },
      ],
    }

    setDemoData(mockData)
    setIsLoading(false)
  }

  return {
    demoData,
    loadDemoData,
    isLoading,
  }
}
