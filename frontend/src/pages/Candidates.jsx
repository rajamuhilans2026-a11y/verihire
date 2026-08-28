export default function Candidates({ demoData, demoMode, onSelectCandidate }) {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Candidates</h2>

        {demoMode && demoData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoData.candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => onSelectCandidate(candidate)}
                className="card card-hover p-6 cursor-pointer text-left w-full"
              >
                <h3 className="text-xl font-semibold mb-4">{candidate.name}</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Education</span>
                    <span className="text-slate-300">
                      {candidate.profile.education[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-slate-300">
                      {Math.max(
                        ...Object.values(candidate.profile.years_of_experience)
                      )}{' '}
                      years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI/LLM</span>
                    <span className="text-slate-300">
                      {candidate.profile.ai_llm_experience.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Multi-Agent</span>
                    <span className="text-slate-300">
                      {candidate.profile.multi_agent_experience.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Production</span>
                    <span className="text-slate-300">
                      {candidate.profile.production_experience.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Freight/Logistics</span>
                    <span className="text-slate-300">
                      {candidate.profile.freight_logistics_experience.length > 0
                        ? '✓'
                        : '○'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    candidate.final_decision.recommendation === 'HIRE'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : candidate.final_decision.recommendation === 'NO HIRE'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {candidate.final_decision.recommendation}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-400">No candidates uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
