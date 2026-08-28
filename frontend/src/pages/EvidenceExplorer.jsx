export default function EvidenceExplorer({ demoData, demoMode }) {
  const getEvidenceBadge = (type) => {
    const badges = {
      verified: 'bg-emerald-500/20 text-emerald-400',
      questionable: 'bg-orange-500/20 text-orange-400',
      contradiction: 'bg-red-500/20 text-red-400',
      insufficient: 'bg-slate-700/50 text-slate-400',
    }
    return badges[type] || badges.verified
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Evidence Explorer</h2>
        <p className="text-slate-400">
          Every claim with source quotes backing agent conclusions.
        </p>

        {demoMode && demoData ? (
          <div className="space-y-6">
            {demoData.candidates.map((candidate) => (
              <div key={candidate.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">
                  {candidate.name}
                </h3>

                <div className="space-y-3">
                  {/* AI/LLM Evidence */}
                  {candidate.profile.ai_llm_experience.map((evidence, i) => (
                    <div key={`ai-${i}`} className="card p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-300 mb-1">
                            {evidence.claim}
                          </p>
                          <p className="text-xs text-slate-400 mb-2">
                            From {evidence.source}
                          </p>
                          <p className="text-sm text-slate-400 italic border-l-2 border-blue-500/30 pl-3">
                            "{evidence.quote}"
                          </p>
                        </div>
                        <span className="badge badge-success whitespace-nowrap">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Multi-Agent Evidence */}
                  {candidate.profile.multi_agent_experience.map((evidence, i) => (
                    <div key={`ma-${i}`} className="card p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-300 mb-1">
                            {evidence.claim}
                          </p>
                          <p className="text-xs text-slate-400 mb-2">
                            From {evidence.source}
                          </p>
                          <p className="text-sm text-slate-400 italic border-l-2 border-purple-500/30 pl-3">
                            "{evidence.quote}"
                          </p>
                        </div>
                        <span className="badge badge-success whitespace-nowrap">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Contradictions */}
                  {candidate.profile.freight_logistics_experience.length > 0 && (
                    candidate.profile.freight_logistics_experience.map(
                      (evidence, i) => (
                        <div key={`freight-${i}`} className="card p-4 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-300 mb-1">
                                {evidence.claim}
                              </p>
                              <p className="text-xs text-slate-400 mb-2">
                                From {evidence.source}
                              </p>
                              <p className="text-sm text-slate-400 italic border-l-2 border-emerald-500/30 pl-3">
                                "{evidence.quote}"
                              </p>
                            </div>
                            <span className="badge badge-success whitespace-nowrap">
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      )
                    )
                  )}

                  {/* Important Claims */}
                  {candidate.profile.important_claims.map((evidence, i) => (
                    <div key={`claim-${i}`} className="card p-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-300 mb-1">
                            {evidence.claim}
                          </p>
                          <p className="text-xs text-slate-400 mb-2">
                            From {evidence.source}
                          </p>
                          <p className="text-sm text-slate-400 italic border-l-2 border-blue-500/30 pl-3">
                            "{evidence.quote}"
                          </p>
                        </div>
                        <span className="badge badge-info whitespace-nowrap">
                          CLAIM
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-400">
              Evidence will be displayed after candidate evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
