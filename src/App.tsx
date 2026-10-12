import { useMemo, useState } from 'react'
import './App.css'

type Field = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
}

type JourneyStep = {
  id: string
  title: string
  summary: string
  fields: Field[]
}

const journeySteps: JourneyStep[] = [
  {
    id: 'program',
    title: 'Program basics',
    summary: 'Define the purpose, the role, and the intended outcome of the training.',
    fields: [
      { key: 'programName', label: 'Program name', type: 'text', placeholder: 'e.g. Frontend Launch Program' },
      { key: 'targetRole', label: 'Target role', type: 'text', placeholder: 'e.g. Junior full-stack developer' },
      { key: 'objective', label: 'Program objective', type: 'textarea', placeholder: 'What should this program help people become?' },
    ],
  },
  {
    id: 'cohort',
    title: 'Cohort setup',
    summary: 'Set the people, team pattern, and time available to learn.',
    fields: [
      { key: 'cohortSize', label: 'Cohort size', type: 'number', placeholder: '10' },
      { key: 'teamStructure', label: 'Team structure', type: 'text', placeholder: '3 teams of 4' },
      { key: 'weeklyHours', label: 'Weekly participant hours', type: 'number', placeholder: '18' },
      { key: 'deliveryMode', label: 'Delivery mode', type: 'select', options: ['In person', 'Remote', 'Hybrid'] },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery design',
    summary: 'Choose the teaching rhythm, mentor capacity, and milestone shape.',
    fields: [
      { key: 'mentorCount', label: 'Mentor count', type: 'number', placeholder: '4' },
      { key: 'mentorHours', label: 'Mentor hours per week', type: 'number', placeholder: '18' },
      { key: 'sessionLength', label: 'Session length', type: 'text', placeholder: '90 minutes' },
      { key: 'calendarBlockers', label: 'Blocked dates', type: 'textarea', placeholder: 'Public holidays, release freezes, leave windows' },
    ],
  },
  {
    id: 'framework',
    title: 'Competency and gates',
    summary: 'Capture the skills, evidence, and decision gates that define success.',
    fields: [
      { key: 'coreCompetencies', label: 'Core competencies', type: 'textarea', placeholder: 'List the essential capabilities to assess' },
      { key: 'evidenceSources', label: 'Evidence sources', type: 'textarea', placeholder: 'Project, peer review, demo, observation, portfolio' },
      { key: 'gates', label: 'Mandatory gates', type: 'textarea', placeholder: 'Architecture check, capstone, final defence, etc.' },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline',
    summary: 'Map the arc from onboarding through project work and final decisions.',
    fields: [
      { key: 'startDate', label: 'Program start date', type: 'text', placeholder: 'YYYY-MM-DD' },
      { key: 'durationWeeks', label: 'Program length in weeks', type: 'number', placeholder: '16' },
      { key: 'milestones', label: 'Milestones', type: 'textarea', placeholder: 'Baseline, week 8 checkpoint, capstone, final decision' },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment and readiness',
    summary: 'Define how evidence is scored and what it means to be ready.',
    fields: [
      { key: 'readinessThreshold', label: 'Readiness threshold', type: 'text', placeholder: '75%' },
      { key: 'decisionMaker', label: 'Final decision maker', type: 'text', placeholder: 'Program sponsor, hiring panel, review board' },
      { key: 'outcomes', label: 'Readiness outcomes', type: 'textarea', placeholder: 'Ready, conditional, further development, retake' },
    ],
  },
  {
    id: 'review',
    title: 'Review and export',
    summary: 'Check whether your design is ready to generate and ship to stakeholders.',
    fields: [
      { key: 'owner', label: 'Program owner', type: 'text', placeholder: 'Your name or team' },
      { key: 'exportNeeded', label: 'Export format needed', type: 'select', options: ['Decision sheet', 'Program pack', 'Evaluation workbook', 'Full project JSON'] },
      { key: 'notes', label: 'Design notes', type: 'textarea', placeholder: 'Anything else the team should know?' },
    ],
  },
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const step = journeySteps[currentStep]
  const progress = ((currentStep + 1) / journeySteps.length) * 100

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((key) => answers[key]?.trim()).length,
    [answers],
  )

  const completedCount = useMemo(
    () => `${answeredCount} of ${journeySteps.reduce((total, item) => total + item.fields.length, 0)}`,
    [answeredCount],
  )

  const handleFieldChange = (key: string, value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep((value) => value + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((value) => value - 1)
    }
  }

  return (
    <div className="journey-shell">
      <aside className="journey-sidebar">
        <div className="brand-block">
          <div className="brand-mark">PD</div>
          <div>
            <p className="eyebrow light">Design journey</p>
            <h1>Program Builder</h1>
          </div>
        </div>

        <div className="progress-box">
          <div className="progress-label-row">
            <span>Journey progress</span>
            <strong>{Math.round(progress)}%</strong>
          </div>
          <div className="progress-bar-wrap">
            <span className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <small>{completedCount} fields answered</small>
        </div>

        <nav className="step-list" aria-label="Journey steps">
          {journeySteps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === currentStep ? 'step-button active' : 'step-button'}
              onClick={() => setCurrentStep(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.summary}</small>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="journey-main">
        <header className="journey-header">
          <div>
            <p className="eyebrow">Training program design</p>
            <h2>{step.title}</h2>
          </div>
          <button type="button" className="ghost-button">Save draft</button>
        </header>

        <section className="card journey-card">
          <p className="lead">{step.summary}</p>

          <div className="field-grid">
            {step.fields.map((field) => (
              <label key={field.key} className={field.type === 'textarea' ? 'field field-wide' : 'field'}>
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select
                    value={answers[field.key] ?? ''}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                  >
                    <option value="">Select one</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={answers[field.key] ?? ''}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={answers[field.key] ?? ''}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
          </div>
        </section>

        <aside className="summary-card">
          <p className="eyebrow">Live brief</p>
          <ul>
            {journeySteps.map((item) => {
              const matchingValues = item.fields
                .map((field) => answers[field.key])
                .filter((value) => value && value.trim())

              return (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>
                    {matchingValues.length > 0 ? matchingValues.join(' • ') : 'No answers yet'}
                  </span>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="journey-actions">
          <button type="button" className="secondary-button" onClick={previousStep} disabled={currentStep === 0}>
            Back
          </button>
          <button type="button" className="primary-button" onClick={nextStep}>
            {currentStep === journeySteps.length - 1 ? 'Finish design' : 'Next step'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
