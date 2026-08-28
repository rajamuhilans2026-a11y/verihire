import { Upload } from 'lucide-react'

export default function JobDescription({ demoData, demoMode }) {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Job Description</h2>

        {demoMode && demoData ? (
          <div className="card p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-400">Company</label>
                <p className="text-lg font-semibold">{demoData.job.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400">Job Title</label>
                <p className="text-lg font-semibold">{demoData.job.job_title}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {demoData.job.required_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">
                Preferred Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {demoData.job.preferred_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">
                Experience Requirements
              </label>
              <ul className="space-y-2">
                {demoData.job.experience_requirements.map((req, i) => (
                  <li key={i} className="flex gap-3 text-slate-300">
                    <span className="text-blue-400">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">
                Key Responsibilities
              </label>
              <ul className="space-y-2">
                {demoData.job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-3 text-slate-300">
                    <span className="text-blue-400">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="card p-12 border-2 border-dashed border-slate-700 text-center space-y-4">
            <Upload className="w-12 h-12 mx-auto text-slate-400" />
            <div>
              <p className="text-slate-300 mb-2">
                Upload a job description PDF to get started
              </p>
              <p className="text-sm text-slate-500">
                The system will extract and structure key information
              </p>
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors inline-block">
              Upload PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
