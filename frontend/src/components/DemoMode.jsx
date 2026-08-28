import { Play, Loader } from 'lucide-react'

export default function DemoMode({ onLoadDemo, isLoading }) {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Demo Mode</h2>
          <p className="text-slate-400">
            Experience HireMind with pre-loaded sample candidates and evaluations.
          </p>
        </div>

        <div className="card p-8 space-y-4 bg-blue-500/5 border border-blue-500/20">
          <p className="text-sm text-slate-300">
            <strong>Candidate A:</strong> Rohan Malhotra
          </p>
          <p className="text-sm text-slate-300">
            <strong>Candidate B:</strong> Ananya Iyer
          </p>
          <p className="text-sm text-slate-300">
            Recommendation: <span className="text-emerald-400">HIRE</span> /{' '}
            <span className="text-amber-400">BORDERLINE</span>
          </p>
        </div>

        <button
          onClick={onLoadDemo}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-lg font-medium transition-colors"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Loading Demo...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Demo
            </>
          )}
        </button>

        <p className="text-xs text-slate-500">
          Demo responses are simulated. Connect your Gemini API key for real evaluations.
        </p>
      </div>
    </div>
  )
}
