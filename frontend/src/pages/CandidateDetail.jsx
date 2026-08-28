export default function CandidateDetail({ demoData, demoMode }) {
  if (!demoMode || !demoData) {
    return (
      <div className="p-6">
        <div className="card p-12 text-center">
          <p className="text-slate-400">Select a candidate to view details</p>
        </div>
      </div>
    )
  }

  const candidate = demoData.candidates[0] // Demo: show first candidate

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{candidate.name}</h2>
        <p className="text-slate-400">
          Detailed candidate profile and evaluation results.
        </p>

        {/* Overview */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Education</p>
              <p className="text-slate-300 font-medium">
                {candidate.profile.education[0]?.split(',')[0]}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Experience</p>
              <p className="text-slate-300 font-medium">
                {Math.max(
                  ...Object.values(candidate.profile.years_of_experience)
                )}{' '}
                years
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">
                Skills Count
              </p>
              <p className="text-slate-300 font-medium">
                {candidate.profile.technical_skills.length}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">Status</p>
              <p className="text-emerald-400 font-medium">Evaluated</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.profile.technical_skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Sections */}
        {candidate.profile.ai_llm_experience.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">AI/LLM Experience</h3>
            <div className="space-y-3">
              {candidate.profile.ai_llm_experience.map((exp, i) => (
                <div key={i} className="pb-3 border-b border-slate-700 last:border-0">
                  <p className="font-medium text-slate-300 mb-1">{exp.claim}</p>
                  <p className="text-sm text-slate-400 italic">"{exp.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {candidate.profile.multi_agent_experience.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Multi-Agent Experience</h3>
            <div className="space-y-3">
              {candidate.profile.multi_agent_experience.map((exp, i) => (
                <div key={i} className="pb-3 border-b border-slate-700 last:border-0">
                  <p className="font-medium text-slate-300 mb-1">{exp.claim}</p>
                  <p className="text-sm text-slate-400 italic">"{exp.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {candidate.profile.production_experience.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Production Experience</h3>
            <div className="space-y-3">
              {candidate.profile.production_experience.map((exp, i) => (
                <div key={i} className="pb-3 border-b border-slate-700 last:border-0">
                  <p className="font-medium text-slate-300 mb-1">{exp.claim}</p>
                  <p className="text-sm text-slate-400 italic">"{exp.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
