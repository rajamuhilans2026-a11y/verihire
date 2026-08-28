export default function FinalDecisions({ demoData, demoMode }) {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Final Hiring Decisions</h2>

        {demoMode && demoData ? (
          <div className="space-y-6">
            {demoData.candidates.map((candidate) => {
              const decision = candidate.final_decision
              const isHire = decision.recommendation === 'HIRE'
              const isBorderline = decision.recommendation === 'BORDERLINE'

              return (
                <div key={candidate.id} className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300">
                    {candidate.name}
                  </h3>

                  <div
                    className={`card p-8 text-center ${
                      isHire
                        ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20'
                        : isBorderline
                          ? 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20'
                          : 'bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-400 mb-2">
                      RECOMMENDATION
                    </p>
                    <p
                      className={`text-5xl font-black mb-4 ${
                        isHire
                          ? 'text-emerald-400'
                          : isBorderline
                            ? 'text-amber-400'
                            : 'text-red-400'
                      }`}
                    >
                      {decision.recommendation}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-slate-300">Confidence</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {Math.round(decision.confidence)}%
                      </p>
                    </div>
                  </div>

                  <div className="card p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-2">
                        REASONING
                      </p>
                      <p className="text-slate-300">{decision.reasoning}</p>
                    </div>

                    {decision.major_concerns.length > 0 && (
                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm font-medium text-orange-400 mb-2">
                          MAJOR CONCERNS
                        </p>
                        <ul className="space-y-2">
                          {decision.major_concerns.map((concern, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-slate-300 text-sm"
                            >
                              <span className="text-orange-400">⚠</span>
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {decision.unresolved_disagreements.length > 0 && (
                      <div className="pt-4 border-t border-slate-700">
                        <p className="text-sm font-medium text-slate-400 mb-2">
                          UNRESOLVED DISAGREEMENTS
                        </p>
                        <ul className="space-y-2">
                          {decision.unresolved_disagreements.map((d, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-slate-300 text-sm"
                            >
                              <span className="text-slate-500">?</span>
                              {d}
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
        ) : (
          <div className="card p-12 text-center">
            <p className="text-slate-400">Decisions will appear after evaluation.</p>
          </div>
        )}
      </div>
    </div>
  )
}
