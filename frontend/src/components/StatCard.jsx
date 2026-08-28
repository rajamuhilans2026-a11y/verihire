export default function StatCard({ label, value }) {
  return (
    <div className="card p-6 border-l-4 border-l-blue-500">
      <p className="text-sm font-medium text-slate-400 mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
    </div>
  )
}
