import { useState, useEffect } from 'react'
import {
  Activity,
  Archive,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  CircleDot,
  FileSearch,
  Users,
  MessageSquare,
  Scale,
  Settings,
  Menu,
  X,
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import JobDescription from './pages/JobDescription'
import Candidates from './pages/Candidates'
import AgentPanel from './pages/AgentPanel'
import DebateRoom from './pages/DebateRoom'
import FinalDecisions from './pages/FinalDecisions'
import EvidenceExplorer from './pages/EvidenceExplorer'
import CandidateDetail from './pages/CandidateDetail'
import DemoMode from './components/DemoMode'

import { useDemoData } from './hooks/useDemoData'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const {
    demoData,
    loadDemoData,
    isLoading: isDemoLoading,
  } = useDemoData()

  useEffect(() => {
    // Check for demo mode toggle
    if (localStorage.getItem('demoMode') === 'true') {
      setDemoMode(true)
      loadDemoData()
    }
  }, [])

  const handleDemoMode = () => {
    setDemoMode(true)
    localStorage.setItem('demoMode', 'true')
    loadDemoData()
  }

  const navigation = [
    { id: 'dashboard', label: 'Command Center', icon: BarChart3 },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'agents', label: 'Agent Network', icon: BrainCircuit },
    { id: 'debate', label: 'Agent Debate', icon: MessageSquare },
    { id: 'evidence', label: 'Evidence Explorer', icon: FileSearch },
    { id: 'decisions', label: 'Final Decisions', icon: Scale },
  ]

  const pageTitle = navigation.find((item) => item.id === currentPage)?.label || 'Command Center'

  const navigate = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    if (isDemoLoading && demoMode) {
      return (
        <div className="loading-screen">
          <div className="loading-orbit"><Activity /></div>
          <p>Hydrating evaluation workspace...</p>
          <span>Loading evidence graph</span>
        </div>
      )
    }

    if (demoMode && !demoData) {
      return <DemoMode onLoadDemo={loadDemoData} isLoading={isDemoLoading} />
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard demoData={demoData} demoMode={demoMode} onTryDemo={handleDemoMode} onNavigate={navigate} />
      case 'job':
        return <JobDescription demoData={demoData} demoMode={demoMode} />
      case 'candidates':
        return (
          <Candidates
            demoData={demoData}
            demoMode={demoMode}
            onSelectCandidate={(candidate) => {
              setSelectedCandidate(candidate)
              navigate('candidate-detail')
            }}
          />
        )
      case 'candidate-detail':
        return <CandidateDetail demoData={demoData} demoMode={demoMode} candidate={selectedCandidate} />
      case 'agents':
        return <AgentPanel demoData={demoData} demoMode={demoMode} />
      case 'debate':
        return <DebateRoom demoData={demoData} demoMode={demoMode} />
      case 'decisions':
        return <FinalDecisions demoData={demoData} demoMode={demoMode} />
      case 'evidence':
        return <EvidenceExplorer demoData={demoData} demoMode={demoMode} />
      default:
        return <Dashboard demoData={demoData} demoMode={demoMode} onTryDemo={handleDemoMode} onNavigate={navigate} />
    }
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><CircleDot /></div>
          <div>
            <div className="brand-name">HireMind</div>
            <div className="brand-subtitle">Hiring intelligence</div>
          </div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="sidebar-nav">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`nav-item ${currentPage === item.id ? 'nav-item-active' : ''}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {currentPage === item.id && <ChevronRight className="nav-arrow" />}
                </button>
              )
            })}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-panel">
            <div className="status-heading"><span className="status-dot" /> SYSTEM STATUS</div>
            <div className="status-row"><span>Pipeline</span><strong>ONLINE</strong></div>
            <div className="status-row"><span>Gemini engine</span><strong>READY</strong></div>
            <div className="status-row"><span>Evidence store</span><strong>SYNCED</strong></div>
          </div>
          <button className="utility-button" onClick={() => setDemoMode(!demoMode)}>
            <Archive />
            <span>{demoMode ? 'Exit demo mode' : 'Open demo mode'}</span>
          </button>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation">
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="breadcrumb"><span>HireMind</span><ChevronRight /><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="live-pill"><span className="live-dot" /> LIVE ANALYSIS</div>
            {demoMode && <div className="demo-pill">DEMO DATA</div>}
            <button className="icon-button" aria-label="Settings"><Settings /></button>
            <div className="avatar">HM</div>
          </div>
        </header>
        <div className="page-content">{renderPage()}</div>
      </main>
    </div>
  )
}
