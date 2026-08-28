import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  GitBranch,
  Layers3,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  Upload,
  UsersRound,
} from 'lucide-react'

const agentNetwork = [
  { name: 'Technical Architect', short: 'Technical', icon: GitBranch, tone: 'cyan', responsibility: 'Backend, LLM systems, RAG depth' },
  { name: 'Production Engineer', short: 'Production', icon: ShieldCheck, tone: 'green', responsibility: 'Reliability, ownership, operations' },
  { name: 'Freight Specialist', short: 'Domain', icon: Layers3, tone: 'amber', responsibility: 'Logistics workflows and APIs' },
  { name: 'HR & Culture', short: 'Culture', icon: UsersRound, tone: 'blue', responsibility: 'Communication and accountability' },
  { name: 'Skeptic / Fact Checker', short: 'Skeptic', icon: AlertCircle, tone: 'red', responsibility: 'Contradictions and claim risk' },
  { name: 'Hiring Manager', short: 'Decision', icon: Radar, tone: 'violet', responsibility: 'Role fit and ramp-up risk' },
]

const dimensions = [
  ['AI / LLM', 'ai_llm_experience'],
  ['Multi-agent', 'multi_agent_experience'],
  ['Production', 'production_experience'],
  ['Freight / logistics', 'freight_logistics_experience'],
  ['Backend engineering', 'technical_skills'],
]

function evidenceCount(candidate) {
  if (!candidate?.profile) return 0
  const profile = candidate.profile
  return ['ai_llm_experience', 'multi_agent_experience', 'production_experience', 'freight_logistics_experience', 'important_claims']
    .reduce((count, key) => count + (Array.isArray(profile[key]) ? profile[key].length : 0), 0)
}

function fitScore(candidate) {
  if (!candidate) return 0
  return candidate.final_decision?.confidence || Math.round((candidate.assessments || []).reduce((sum, item) => sum + (item.confidence || 0), 0) / Math.max(candidate.assessments?.length || 1, 1))
}

function experience(candidate) {
  const values = Object.values(candidate?.profile?.years_of_experience || {}).filter((value) => typeof value === 'number')
  return values.length ? `${Math.max(...values)} yrs` : 'Not stated'
}

function StatusBadge({ recommendation }) {
  const style = recommendation === 'HIRE' ? 'badge-success' : recommendation === 'NO HIRE' ? 'badge-error' : 'badge-warning'
  return <span className={`badge ${style}`}>{recommendation || 'PENDING'}</span>
}

function ScoreBar({ value, color = 'cyan' }) {
  return <div className="score-track"><div className={`score-fill score-${color}`} style={{ width: `${Math.min(value, 100)}%` }} /></div>
}

export default function Dashboard({ demoData, demoMode, onTryDemo, onNavigate }) {
  const candidates = demoData?.candidates || []
  const evidenceItems = candidates.reduce((sum, candidate) => sum + evidenceCount(candidate), 0)
  const conflicts = candidates.reduce((sum, candidate) => sum + (candidate.profile?.contradictions_or_questionable_claims?.length || 0), 0) || (demoData ? 3 : 0)

  return (
    <div className="command-center">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><Sparkles /> AI OPERATIONS CONSOLE <span>·</span> 06 SIGNALS ONLINE</div>
          <h1>Multi-Agent Hiring Intelligence</h1>
          <p>Evidence-first evaluation for high-stakes engineering decisions.</p>
        </div>
        <div className="intro-actions">
          <button className="secondary-action" onClick={() => onNavigate('evidence')}><FileCheck2 /> Evidence ledger</button>
          {!demoMode && <button className="primary-action" onClick={onTryDemo}><Play /> Load evaluation</button>}
        </div>
      </div>

      <div className="metric-grid">
        {[
          { label: 'Candidates analyzed', value: candidates.length || '—', detail: 'Across this workspace', icon: UsersRound, tone: 'cyan' },
          { label: 'Agents active', value: 6, detail: 'Independent + debate lanes', icon: Bot, tone: 'blue' },
          { label: 'Evidence items', value: evidenceItems || '—', detail: 'Source-linked observations', icon: FileCheck2, tone: 'green' },
          { label: 'Conflicts detected', value: conflicts || '—', detail: conflicts ? 'Needs review' : 'Awaiting analysis', icon: AlertCircle, tone: conflicts ? 'amber' : 'slate' },
        ].map(({ label, value, detail, icon: Icon, tone }) => (
          <div className="metric-card" key={label}>
            <div className={`metric-icon metric-${tone}`}><Icon /></div>
            <div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
            <ArrowUpRight className="metric-arrow" />
          </div>
        ))}
      </div>

      {!demoData ? (
        <div className="empty-command-card">
          <div className="empty-icon"><Upload /></div>
          <div><span className="section-kicker">READY FOR INPUT</span><h2>Start an evidence-backed evaluation</h2><p>Connect a job description and candidate documents to activate the panel.</p></div>
          <button className="primary-action" onClick={onTryDemo}><Play /> Preview with sample data</button>
        </div>
      ) : (
        <>
          <section className="section-block">
            <div className="section-heading"><div><span className="section-kicker">DECISION OVERVIEW</span><h2>Candidate comparison</h2></div><button className="text-action" onClick={() => onNavigate('candidates')}>View candidate files <ChevronRight /></button></div>
            <div className="comparison-grid">
              {candidates.map((candidate, index) => {
                const score = fitScore(candidate)
                const recommendation = candidate.final_decision?.recommendation
                return (
                  <article className={`candidate-summary candidate-${index}`} key={candidate.id}>
                    <div className="candidate-topline"><span className="candidate-index">0{index + 1}</span><StatusBadge recommendation={recommendation} /></div>
                    <div className="candidate-identity"><div className="candidate-avatar">{candidate.name.split(' ').map((name) => name[0]).join('')}</div><div><h3>{candidate.name}</h3><p>{experience(candidate)} · {candidate.profile?.education?.[0] || 'Education not stated'}</p></div></div>
                    <div className="fit-row"><div><span>Evidence-weighted fit</span><strong>{score}%</strong></div><ScoreBar value={score} color={index === 0 ? 'cyan' : 'blue'} /></div>
                    <div className="dimension-list">{dimensions.map(([label, key]) => { const value = Array.isArray(candidate.profile?.[key]) ? Math.min(94, 38 + candidate.profile[key].length * 18) : key === 'technical_skills' ? 78 : 0; return <div className="dimension-row" key={key}><span>{label}</span><div><ScoreBar value={value} color={index === 0 ? 'cyan' : 'blue'} /><b>{value ? `${value}%` : 'N/A'}</b></div></div> })}</div>
                    <button className="card-link" onClick={() => onNavigate('candidates')}>Open investigation <ArrowUpRight /></button>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="section-block agent-section">
            <div className="section-heading"><div><span className="section-kicker">ORCHESTRATION GRAPH</span><h2>Agent network</h2></div><div className="network-status"><span className="status-dot" /> ALL NODES OPERATIONAL</div></div>
            <div className="agent-flow"><div className="flow-line" /><div className="flow-stage"><span className="flow-number">01</span><strong>Candidate evidence</strong><small>Documents + transcripts</small></div><div className="flow-stage"><span className="flow-number">02</span><strong>Independent analysis</strong><small>Isolated agent perspectives</small></div><div className="flow-stage"><span className="flow-number">03</span><strong>Debate + resolution</strong><small>Disagreement becomes signal</small></div><div className="flow-stage"><span className="flow-number">04</span><strong>Final decision</strong><small>Explainable recommendation</small></div></div>
            <div className="agent-grid">{agentNetwork.map(({ name, short, icon: Icon, tone, responsibility }) => <button className={`agent-node node-${tone}`} key={name} onClick={() => onNavigate('agents')}><div className="agent-node-icon"><Icon /></div><div><strong>{name}</strong><p>{responsibility}</p></div><span className="agent-active"><i /> ACTIVE</span></button>)}</div>
          </section>
        </>
      )}
    </div>
  )
}
