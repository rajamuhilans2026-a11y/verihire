import { GitBranch, ShieldCheck, Truck, UsersRound, AlertCircle, Target } from 'lucide-react'

export default function AgentPanel({ demoData, demoMode }) {
  const agents = [
    { name: 'Technical Architect', lookup: 'Technical', icon: GitBranch, color: 'from-cyan-500/20 to-cyan-500/5', responsibility: 'Python, LLM systems, RAG depth' },
    { name: 'Production Engineer', lookup: 'Production', icon: ShieldCheck, color: 'from-emerald-500/20 to-emerald-500/5', responsibility: 'Reliability and ownership' },
    { name: 'Freight Domain Specialist', lookup: 'Freight', icon: Truck, color: 'from-amber-500/20 to-amber-500/5', responsibility: 'Logistics workflows and APIs' },
    { name: 'HR & Culture Analyst', lookup: 'HR/Culture', icon: UsersRound, color: 'from-blue-500/20 to-blue-500/5', responsibility: 'Communication and accountability' },
    { name: 'Skeptic / Fact Checker', lookup: 'Skeptic', icon: AlertCircle, color: 'from-red-500/20 to-red-500/5', responsibility: 'Contradictions and claim risk' },
    { name: 'Hiring Manager', lookup: 'Hiring Manager', icon: Target, color: 'from-violet-500/20 to-violet-500/5', responsibility: 'Role fit and ramp-up risk' },
  ]

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Independent AI Agents</h2>
        <p className="text-slate-400">
          Four specialized agents evaluate candidates independently without seeing other opinions.
        </p>

        {demoMode && demoData ? (
          <div className="space-y-6">
            {demoData.candidates.map((candidate) => (
              <div key={candidate.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">
                  {candidate.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent, i) => {
                    const assessment = candidate.assessments.find((item) => item.agent === agent.lookup)
                    const Icon = agent.icon
                    return (
                      <div
                        key={i}
                        className={`card p-6 bg-gradient-to-br ${agent?.color}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="agent-card-icon"><Icon /></div>
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <p className="text-xs text-slate-400">{agent.responsibility}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-slate-300 mb-3">
                            {assessment?.overall_assessment || 'Awaiting a candidate-specific assessment from the backend.'}
                          </p>
                        </div>

                        <div className="mb-4 pb-4 border-b border-slate-700">
                          <p className="text-xs font-medium text-slate-400 mb-2">
                            CONFIDENCE
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full transition-all"
                                style={{
                                  width: `${assessment?.confidence || 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-blue-400">
                              {assessment ? `${Math.round(assessment.confidence)}%` : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {assessment?.strengths?.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-emerald-400 mb-1">
                                STRENGTHS
                              </p>
                              <ul className="space-y-1">
                                {assessment.strengths.slice(0, 2).map((s, j) => (
                                  <li key={j} className="text-xs text-slate-300">
                                    ✓ {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {assessment?.concerns?.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-orange-400 mb-1">
                                CONCERNS
                              </p>
                              <ul className="space-y-1">
                                {assessment.concerns.slice(0, 2).map((c, j) => (
                                  <li key={j} className="text-xs text-slate-300">
                                    ⚠ {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map((agent, i) => {
                  const Icon = agent.icon
                  return (
              <div key={i} className={`card p-6 bg-gradient-to-br ${agent.color}`}>
                <div className="flex items-center gap-3 mb-4">
                      <div className="agent-card-icon"><Icon /></div>
                  <div>
                    <h4 className="font-semibold">{agent.name}</h4>
                        <p className="text-xs text-slate-400">{agent.responsibility}</p>
                  </div>
                </div>
              </div>
                  )
                })}
          </div>
        )}
      </div>
    </div>
  )
}
