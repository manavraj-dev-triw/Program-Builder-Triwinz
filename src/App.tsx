import { useMemo, useState } from 'react'
import './App.css'

const navigation = [
  'Home',
  'Discover',
  'Framework',
  'Timeline',
  'Content',
  'Cohort',
  'Decisions',
  'Validate and Export',
  'Settings',
] as const

type Screen = (typeof navigation)[number]

type Question = {
  id: number
  prompt: string
  why: string
  defaultValue: string
}

const keystoneQuestions: Question[] = [
  {
    id: 1,
    prompt: 'What is the fixed start date, and is there a hard end date or customer milestone?',
    why: 'The timeline is backward-planned from the program start and any customer deliverables.',
    defaultValue: 'Starts 2026-11-02; hard end milestone at Week 16 demo',
  },
  {
    id: 2,
    prompt: 'How many hours per week will participants have, and is that time protected?',
    why: 'The weekly load shapes the curriculum, mentor hours, and conflict checks.',
    defaultValue: '18 hours/week, protected time',
  },
  {
    id: 3,
    prompt: 'How many participants, and into how many teams?',
    why: 'Cohort size and team balance affect workload and delivery design.',
    defaultValue: '12 participants, 3 teams of 4',
  },
  {
    id: 4,
    prompt: 'How many mentors, and how many hours per week each?',
    why: 'Mentor capacity is a gating input for delivery and assessment coverage.',
    defaultValue: '4 mentors, 18 hours/week each',
  },
  {
    id: 5,
    prompt: 'List the 10 most common tasks a graduate will do in their first 3 months.',
    why: 'This determines the role-fit competency model and project outcomes.',
    defaultValue: 'Build, debug, ship, review PRs, document, demo, collaborate, triage, support, learn',
  },
]

const assumptions = [
  { area: 'Duration', defaultValue: '16 weeks; adjustable 12 to 24', reason: 'The program blueprint is tuned to a 16-week cohort arc.' },
  { area: 'Weights', defaultValue: 'The 11-domain table from the blueprint', reason: 'Consistent scoring across all weighted domains.' },
  { area: 'Thresholds', defaultValue: 'Ready 75, Conditional 65, core competencies 3 or above', reason: 'Default decision rules match the BMS goals.' },
  { area: 'Rhythm', defaultValue: 'Monday teach, Tuesday build, Wednesday mentor, Thursday project, Friday demo and scoring', reason: 'Creates a stable delivery rhythm for participants.' },
  { area: 'Security', defaultValue: 'Synthetic data only; mandatory server-side authorisation gate', reason: 'Protects participant and decision records.' },
]

const timelineTasks = [
  { task: 'Kickoff and onboarding', start: 1, duration: 2, owner: 'Program team', phase: 'Prep' },
  { task: 'Environment setup', start: 3, duration: 3, owner: 'Mentors', phase: 'Prep' },
  { task: 'Baseline assessment', start: 5, duration: 2, owner: 'Assessors', phase: 'Prep' },
  { task: 'Week 1 fundamentals', start: 7, duration: 5, owner: 'Delivery team', phase: 'Delivery' },
  { task: 'Mini-project 1', start: 12, duration: 3, owner: 'Participants', phase: 'Delivery' },
  { task: 'Week 8 checkpoint', start: 16, duration: 2, owner: 'Assessors', phase: 'Delivery' },
  { task: 'Capstone and defence', start: 29, duration: 4, owner: 'Panel', phase: 'Delivery' },
  { task: 'Post-program review', start: 34, duration: 2, owner: 'Program team', phase: 'Post' },
]

const competencySummary = [
  { name: 'Technical delivery', weight: 14, score: 3.2 },
  { name: 'Data & APIs', weight: 11, score: 3.0 },
  { name: 'Teamwork', weight: 14, score: 3.4 },
  { name: 'Quality mindset', weight: 12, score: 2.8 },
  { name: 'Problem solving', weight: 15, score: 3.1 },
]

const cohortRows = [
  { code: 'DEV-001', name: 'Amina', team: 'Alpha', trend: '+14%', status: 'On track' },
  { code: 'DEV-002', name: 'Ben', team: 'Alpha', trend: '+9%', status: 'Needs attention' },
  { code: 'DEV-003', name: 'Celia', team: 'Bravo', trend: '+18%', status: 'On track' },
  { code: 'DEV-004', name: 'Dara', team: 'Bravo', trend: '+5%', status: 'Watchlist' },
  { code: 'DEV-005', name: 'Ethan', team: 'Charlie', trend: '+12%', status: 'On track' },
]

const validationChecks = [
  { label: 'Weights total 100%', severity: 'Blocking', status: 'Pass' },
  { label: 'Every gate has a decider and test method', severity: 'Blocking', status: 'Pass' },
  { label: 'Core competencies have at least two evidence sources', severity: 'Blocking', status: 'Pass' },
  { label: 'Variants require equivalence review', severity: 'Warning', status: 'Pass' },
  { label: 'Participant load within stated per-week limit', severity: 'Warning', status: 'Review' },
  { label: 'Outcome policy defined for all decision categories', severity: 'Blocking', status: 'Pending' },
]

const exportOptions = [
  { name: 'Decision sheet + assumptions ledger', format: 'Word / PDF' },
  { name: 'Program specification', format: 'Word / PDF' },
  { name: 'Evaluation workbook', format: 'Excel' },
  { name: 'Whole project archive', format: 'JSON (encrypted)' },
]

const lessonModules = [
  { name: 'Curriculum map', state: 'Approved' },
  { name: 'Exercise bank', state: 'Draft' },
  { name: 'Capstone brief', state: 'Review' },
  { name: 'Mentor handbook', state: 'Approved' },
]

const performanceDomains = [
  { name: 'Technical delivery', weight: 0.14, rating: 3 },
  { name: 'System design', weight: 0.12, rating: 3 },
  { name: 'Testing & QA', weight: 0.1, rating: 3 },
  { name: 'Data & APIs', weight: 0.11, rating: 2 },
  { name: 'Product thinking', weight: 0.08, rating: 3 },
  { name: 'Teamwork', weight: 0.14, rating: 2 },
  { name: 'Communication', weight: 0.08, rating: 3 },
  { name: 'Quality mindset', weight: 0.12, rating: 2 },
  { name: 'Problem solving', weight: 0.15, rating: 3 },
  { name: 'Leadership', weight: 0.06, rating: 4 },
  { name: 'Professionalism', weight: 0.1, rating: 3 },
]

const settings = [
  { label: 'AI mode', value: 'Prompt Pack (default)' },
  { label: 'Encryption', value: 'Enabled for participant files' },
  { label: 'Backup reminder', value: '3 days / 20 changes' },
  { label: 'Holiday calendar', value: 'UK public holidays + release freeze' },
]

function App() {
  const [activeView, setActiveView] = useState<Screen>('Discover')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'Starts 2026-11-02; hard end at Week 16 demo',
    2: '18 hours/week; protected time',
    3: '12 participants; 3 teams of 4',
    4: '4 mentors; 18 hours/week each',
  })

  const currentQuestion = keystoneQuestions[questionIndex]

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  )

  const totalScore = useMemo(() => {
    const weighted = performanceDomains.reduce((sum, item) => {
      const contribution = ((item.rating / 4) * 100) * item.weight
      return sum + contribution
    }, 0)

    return Number(weighted.toFixed(2))
  }, [])

  const decisionStatus = totalScore >= 75 ? 'Ready' : totalScore >= 65 ? 'Conditionally ready' : 'Further development required'

  const handleAnswer = (mode: 'Answer' | 'Use default' | 'Unknown' | 'Skip') => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: `${mode}: ${currentQuestion.defaultValue}`,
    }))

    if (questionIndex < keystoneQuestions.length - 1) {
      setQuestionIndex((index) => index + 1)
      return
    }

    setActiveView('Framework')
  }

  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Project workspace</p>
                  <h2>Program blueprint status</h2>
                </div>
                <button className="primary-button" type="button">New snapshot</button>
              </div>
              <div className="overview-grid">
                <div className="metric-box">
                  <span>Project health</span>
                  <strong>94%</strong>
                  <small>Ready for cohort planning</small>
                </div>
                <div className="metric-box">
                  <span>Keystone answers</span>
                  <strong>{answeredCount}/15</strong>
                  <small>Below the target maximum</small>
                </div>
                <div className="metric-box">
                  <span>Export readiness</span>
                  <strong>7/9</strong>
                  <small>Outcome policy pending</small>
                </div>
                <div className="metric-box">
                  <span>Last backup</span>
                  <strong>Today</strong>
                  <small>Autosaved locally</small>
                </div>
              </div>
            </section>

            <section className="card">
              <p className="eyebrow">Saved projects</p>
              <h3>BMS Developer Program</h3>
              <ul className="list-plain">
                <li>Seed template: BMS Full-Stack Developer Program</li>
                <li>Format: Browser-only static app</li>
                <li>Encrypted cohort files: Enabled</li>
              </ul>
            </section>

            <section className="card">
              <p className="eyebrow">Recent actions</p>
              <ul className="timeline-list">
                <li><span>09:10</span> Decision sheet regenerated</li>
                <li><span>09:36</span> Assessment workbook exported</li>
                <li><span>10:02</span> Mentor capacity conflict flagged</li>
              </ul>
            </section>
          </div>
        )

      case 'Discover':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Discovery funnel</p>
                  <h2>Keystone question {currentQuestion.id} of {keystoneQuestions.length}</h2>
                </div>
                <span className="badge subtle">Impact ranking applied</span>
              </div>

              <div className="question-card">
                <h3>{currentQuestion.prompt}</h3>
                <p className="muted">Why this matters: {currentQuestion.why}</p>
                <div className="default-callout">
                  Suggested default: <strong>{currentQuestion.defaultValue}</strong>
                </div>
                <div className="button-row">
                  <button type="button" className="primary-button" onClick={() => handleAnswer('Answer')}>Answer</button>
                  <button type="button" className="secondary-button" onClick={() => handleAnswer('Use default')}>Use default</button>
                  <button type="button" className="secondary-button" onClick={() => handleAnswer('Unknown')}>Unknown</button>
                  <button type="button" className="secondary-button" onClick={() => handleAnswer('Skip')}>Skip</button>
                </div>
              </div>
            </section>

            <section className="card">
              <p className="eyebrow">Assumptions ledger</p>
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Default</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.map((row) => (
                    <tr key={row.area}>
                      <td>{row.area}</td>
                      <td>{row.defaultValue}</td>
                      <td>{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card">
              <p className="eyebrow">Decision sheet</p>
              <ul className="decision-list">
                {keystoneQuestions.slice(0, 5).map((question) => (
                  <li key={question.id}>
                    <span>Q{question.id}</span>
                    <strong>{question.prompt}</strong>
                    <em>{answers[question.id] ?? 'Unanswered'}</em>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )

      case 'Framework':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Competency model</p>
                  <h2>11 weighted domains</h2>
                </div>
                <span className="badge success">Core weights total 100%</span>
              </div>
              <div className="competency-grid">
                {competencySummary.map((item) => (
                  <div key={item.name} className="mini-card">
                    <div className="mini-card-header">
                      <strong>{item.name}</strong>
                      <span>{item.weight}%</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${Math.min((item.score / 4) * 100, 100)}%` }} />
                    </div>
                    <small>Current score: {item.score}/4</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <p className="eyebrow">Gate builder</p>
              <ul className="list-plain">
                <li>Gate A — Technical defence and architecture review</li>
                <li>Gate B — Team contribution and code quality</li>
                <li>Gate C — Ethics and security safety check</li>
                <li>Gate D — Capstone demonstration and evidence</li>
              </ul>
            </section>

            <section className="card">
              <p className="eyebrow">Coverage matrix</p>
              <ul className="list-plain">
                <li>Each core competency has at least two evidence sources</li>
                <li>Exercise, project, defence, peer, and observation coverage active</li>
                <li>Two warning flags resolved in adjacent run</li>
              </ul>
            </section>
          </div>
        )

      case 'Timeline':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Timeline planner</p>
                  <h2>Backward-planned delivery calendar</h2>
                </div>
                <span className="badge subtle">Critical path highlighted</span>
              </div>
              <div className="gantt-chart">
                {timelineTasks.map((task) => (
                  <div key={task.task} className="gantt-row">
                    <span className="task-label">{task.task}</span>
                    <div className="gantt-track">
                      <span
                        className="gantt-bar"
                        style={{ left: `${(task.start - 1) * 10}%`, width: `${task.duration * 10}%` }}
                      >
                        {task.phase}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <p className="eyebrow">Conflict checks</p>
              <ul className="list-plain">
                <li>Mentor load within stated hours</li>
                <li>Participant load within project limit</li>
                <li>Capstone gate scheduled before evidence collection</li>
                <li>Public holiday placeholders pre-loaded</li>
              </ul>
            </section>
          </div>
        )

      case 'Content':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Content generation</p>
                  <h2>Prompt pack and review queue</h2>
                </div>
                <button className="primary-button" type="button">Generate prompt pack</button>
              </div>
              <div className="content-list">
                {lessonModules.map((item) => (
                  <div key={item.name} className="list-row">
                    <strong>{item.name}</strong>
                    <span className={item.state === 'Approved' ? 'badge success' : 'badge subtle'}>{item.state}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )

      case 'Cohort':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Cohort tracking</p>
                  <h2>Participants and readiness trends</h2>
                </div>
                <button className="primary-button" type="button">Bulk import CSV</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Trend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortRows.map((participant) => (
                    <tr key={participant.code}>
                      <td>{participant.code}</td>
                      <td>{participant.name}</td>
                      <td>{participant.team}</td>
                      <td>{participant.trend}</td>
                      <td>{participant.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )

      case 'Decisions':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Readiness decisions</p>
                  <h2>Scoring and outcome policy</h2>
                </div>
                <span className="badge success">Outcome policy required before finalisation</span>
              </div>
              <div className="decision-grid">
                <div className="metric-box neutral">
                  <span>Overall score</span>
                  <strong>{totalScore}</strong>
                </div>
                <div className="metric-box amber">
                  <span>Decision status</span>
                  <strong>{decisionStatus}</strong>
                </div>
                <div className="metric-box good">
                  <span>Blocking gates</span>
                  <strong>2 passed / 1 pending</strong>
                </div>
                <div className="metric-box alert">
                  <span>Reassessment</span>
                  <strong>Due 2026-11-18</strong>
                </div>
              </div>

              <div className="score-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Weight</th>
                      <th>Rating</th>
                      <th>Weighted impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceDomains.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.weight * 100}%</td>
                        <td>{item.rating}/4</td>
                        <td>{(((item.rating / 4) * 100) * item.weight).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )

      case 'Validate and Export':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Validation</p>
                  <h2>Blocking checks and export readiness</h2>
                </div>
                <button className="primary-button" type="button">Export package</button>
              </div>
              <ul className="validation-list">
                {validationChecks.map((item) => (
                  <li key={item.label}>
                    <span className={item.severity === 'Blocking' ? 'severity blocking' : 'severity warning'}>{item.severity}</span>
                    <strong>{item.label}</strong>
                    <em>{item.status}</em>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card">
              <p className="eyebrow">Export formats</p>
              <ul className="list-plain">
                {exportOptions.map((item) => (
                  <li key={item.name}>
                    {item.name} <span>{item.format}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )

      case 'Settings':
        return (
          <div className="section-grid">
            <section className="card card-wide">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Settings</p>
                  <h2>Program defaults and security</h2>
                </div>
              </div>
              <div className="settings-grid">
                {settings.map((item) => (
                  <div key={item.label} className="mini-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">TP</div>
          <div>
            <p className="eyebrow light">Program Factory</p>
            <h1>Training Design</h1>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item}
              type="button"
              className={activeView === item ? 'nav-button active' : 'nav-button'}
              onClick={() => setActiveView(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow light">Validation</p>
          <strong>3 blocking</strong>
          <small>2 stale outputs</small>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">BMS Full-Stack Developer Program</p>
            <h2>Program plan factory</h2>
          </div>

          <div className="status-group">
            <span className="badge success">Saved</span>
            <span className="badge subtle">Last backup: Today</span>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}

export default App
