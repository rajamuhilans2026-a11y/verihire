import { CheckCircle } from 'lucide-react'

export default function EvaluationProgress({ candidate }) {
  const steps = [
    { label: 'Profile Built', completed: true },
    { label: 'Agents Evaluated', completed: true },
    { label: 'Debate Complete', completed: true },
    { label: 'Decision Made', completed: true },
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          candidate.final_decision.recommendation === 'HIRE'
            ? 'bg-emerald-500/20 text-emerald-400'
            : candidate.final_decision.recommendation === 'BORDERLINE'
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-red-500/20 text-red-400'
        }`}>
          {candidate.final_decision.recommendation}
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {step.completed ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-700" />
              )}
              <span className="text-xs font-medium text-slate-400">
                {step.label}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  step.completed ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                style={{ width: step.completed ? '100%' : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        Confidence:{' '}
        <span className="text-slate-300 font-semibold">
          {Math.round(candidate.final_decision.confidence)}%
        </span>
      </p>
    </div>
  )
}
