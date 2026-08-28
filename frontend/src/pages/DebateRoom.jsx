export default function DebateRoom({ demoData, demoMode }) {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Agent Debate</h2>
        <p className="text-slate-400">
          Agents review each other's assessments and can challenge conclusions.
        </p>

        {demoMode && demoData ? (
          <div className="space-y-6">
            {demoData.candidates.map((candidate) => (
              <div key={candidate.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">
                  {candidate.name}
                </h3>

                <div className="space-y-4">
                  {candidate.debate.map((statement, i) => (
                    <div key={i} className="card p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {statement.agent} Agent
                          </h4>
                          <p className="text-sm text-slate-400">
                            {statement.changed_opinion
                              ? '✓ Opinion changed'
                              : '○ Maintained position'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statement.changed_opinion
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-700/50 text-slate-400'
                          }`}
                        >
                          {statement.changed_opinion ? 'Changed' : 'Stable'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-2">
                              OPINION BEFORE
                            </p>
                            <p className="text-sm text-slate-300">
                              {statement.opinion_before}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-400 mb-2">
                              OPINION AFTER
                            </p>
                            <p className="text-sm text-slate-300">
                              {statement.opinion_after}
                            </p>
                          </div>
                        </div>

                        {statement.changed_opinion && (
                          <div className="pt-4 border-t border-slate-700">
                            <p className="text-xs font-medium text-slate-400 mb-1">
                              REASON FOR CHANGE
                            </p>
                            <p className="text-sm text-slate-300">
                              {statement.change_reason}
                            </p>
                          </div>
                        )}

                        {statement.remaining_disagreement && (
                          <div className="pt-4 border-t border-slate-700">
                            <p className="text-xs font-medium text-orange-400 mb-1">
                              REMAINING DISAGREEMENT
                            </p>
                            <p className="text-sm text-slate-300">
                              {statement.remaining_disagreement}
                            </p>
                          </div>
                        )}
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
              Debate will appear after initial agent assessments.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
