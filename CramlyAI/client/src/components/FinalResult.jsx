import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import MermaidSetup from './MermaidSetup'
import RechartSetUp from './RechartsetUp'
import { downloadPdf } from '../services/api'

const markDownComponent = {
  h1: ({ children }) => (
    <h1 className='theme-title text-2xl font-bold mt-6 mb-4 border-b border-[#e5d4b8] pb-2'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='theme-title text-xl font-semibold mt-7 mb-3'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='theme-title text-lg font-semibold mt-6 mb-2'>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className='break-words text-[#4b3a2b] leading-7 mb-4'>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className='list-disc ml-6 space-y-2 text-[#4b3a2b] mb-5 break-words md:ml-8'>
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className='break-words marker:text-[#d99d42] marker:text-lg leading-7'>{children}</li>
  ),
  strong: ({ children }) => (
    <strong className='font-semibold text-[#33261d]'>{children}</strong>
  ),
}

function FinalResult({ result }) {
  const [quickRevision, setQuickRevision] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const tabRefs = useRef({})

  if (
    !result ||
    !result.subTopics ||
    !result.questions ||
    !Array.isArray(result.questions.short) ||
    !Array.isArray(result.questions.long) ||
    !Array.isArray(result.revisionPoints)
  ) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'visuals', label: 'Visuals' },
    { id: 'practice', label: 'Practice' },
    { id: 'pdf', label: 'PDF' },
  ]

  const tabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const hasDiagram = Boolean(result.diagram?.data)
  const hasCharts = Array.isArray(result.charts) && result.charts.length > 0
  const hasShortQuestions = result.questions.short.length > 0
  const hasLongQuestions = result.questions.long.length > 0
  const hasDiagramQuestion = Boolean(result.questions.diagram)

  const selectTab = (tabId) => {
    setQuickRevision(false)
    setActiveTab(tabId)
    tabRefs.current[tabId]?.focus()
  }

  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()

    let nextIndex = tabIndex

    if (event.key === 'ArrowLeft') {
      nextIndex = tabIndex <= 0 ? tabs.length - 1 : tabIndex - 1
    }

    if (event.key === 'ArrowRight') {
      nextIndex = tabIndex >= tabs.length - 1 ? 0 : tabIndex + 1
    }

    if (event.key === 'Home') {
      nextIndex = 0
    }

    if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    selectTab(tabs[nextIndex].id)
  }

  return (
    <div className='min-w-0 space-y-8 overflow-hidden px-0 py-2 md:px-3'>
      <div className='flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <h2 className='theme-title flex min-w-0 items-center gap-3 text-2xl font-bold md:text-3xl'>
          <span className='text-[#d99d42]'>{String.fromCodePoint(128214)}</span>
          Generated Notes
        </h2>

        <div className='flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end'>
          <button
            onClick={() => setQuickRevision(!quickRevision)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              quickRevision
                ? 'theme-button-mint text-[#1f3f2d]'
                : 'bg-[#edf7f0] text-[#28543b] hover:bg-[#dceee3] border border-[#b7dbc6]'
            }`}
          >
            {quickRevision ? 'Exit Revision Mode' : 'Quick Revision (5 min)'}
          </button>
          <button
            onClick={() => downloadPdf(result)}
            className='theme-button rounded-lg px-4 py-2 text-sm font-medium'
          >
            {String.fromCodePoint(11015, 65039)} Download PDF
          </button>
        </div>
      </div>

      <div
        role='tablist'
        aria-label='Generated study set sections'
        className='flex gap-2 overflow-x-auto border-b border-[#e5d4b8] pb-3'
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            role='tab'
            aria-selected={activeTab === tab.id}
            aria-controls={`study-section-${tab.id}`}
            id={`study-tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            ref={(element) => {
              tabRefs.current[tab.id] = element
            }}
            onClick={() => selectTab(tab.id)}
            onKeyDown={handleTabKeyDown}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d99d42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf1] ${
              activeTab === tab.id
                ? 'bg-[#f7dfb1] border-[#efd096] text-[#6d4d1f]'
                : 'bg-[#fffaf1] border-[#e4d3b8] text-[#6f6254] hover:bg-[#fff3d8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!quickRevision && activeTab === 'overview' && (
        <section
          id='study-section-overview'
          role='tabpanel'
          aria-labelledby='study-tab-overview'
          tabIndex={0}
          className='focus:outline-none'
        >
          <SectionHeader icon={String.fromCodePoint(11088)} title='Sub Topics' color='amber' />

          <div className='grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3'>
            {Object.entries(result.subTopics).map(([star, topics]) => (
              <div key={star} className='theme-card min-w-0 p-4'>
                <p className='text-sm font-semibold text-[#b97927] mb-1'>
                  {star} Priority
                </p>
                <ul className='list-disc ml-5 space-y-1 break-words text-sm text-[#4b3a2b]'>
                  {topics.map((topic, index) => (
                    <li className='break-words' key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className='mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3'>
            <InfoTile label='Exam Importance' value={result.importance || 'General'} />
            <InfoTile label='Revision Points' value={result.revisionPoints.length || 0} />
            <InfoTile label='Practice Items' value={result.questions.short.length + result.questions.long.length + (result.questions.diagram ? 1 : 0)} />
          </div>
        </section>
      )}

      {!quickRevision && activeTab === 'notes' && (
        <section
          id='study-section-notes'
          role='tabpanel'
          aria-labelledby='study-tab-notes'
          tabIndex={0}
          className='focus:outline-none'
        >
          <SectionHeader icon={String.fromCodePoint(128221)} title='Detailed Notes' color='amber' />
          {result.notes ? (
            <div className='theme-panel min-w-0 overflow-x-auto px-4 py-6 md:px-8'>
              <ReactMarkdown components={markDownComponent}>
                {result.notes}
              </ReactMarkdown>
            </div>
          ) : (
            <EmptyState title='No detailed notes available' text='This generated study set did not include a notes body.' />
          )}
        </section>
      )}

      {quickRevision && (
        <section className='min-w-0 rounded-lg bg-gradient-to-r from-[#edf7f0] to-[#fffaf1] border border-[#b7dbc6] p-6'>
          <h3 className='font-bold text-[#28543b] mb-3 text-lg'>
            {String.fromCodePoint(9889)} Exam Quick Revision Points
          </h3>
          <ul className='list-disc ml-6 space-y-2 break-words text-[#33261d]'>
            {result.revisionPoints.map((point, index) => (
              <li className='break-words' key={index}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {!quickRevision && activeTab === 'visuals' && (
        <section
          id='study-section-visuals'
          role='tabpanel'
          aria-labelledby='study-tab-visuals'
          tabIndex={0}
          className='space-y-5 focus:outline-none'
        >
          {hasDiagram ? (
            <div className='theme-card min-w-0 overflow-hidden p-4'>
              <SectionHeader icon={String.fromCodePoint(128202)} title='Diagram' color='mint' />
              <MermaidSetup diagram={result.diagram.data} />
              <p className='mt-3 text-xs text-[#8b7b68] italic'>
                {String.fromCodePoint(8505, 65039)} If you need this diagram for future reference or revision,
                you can save it by taking a screenshot.
              </p>
            </div>
          ) : (
            <EmptyState title='No diagram generated' text='Generate a study set with Include Diagram enabled to see a visual flow here.' />
          )}

          {hasCharts ? (
            <div className='theme-card min-w-0 overflow-hidden p-4'>
              <SectionHeader icon={String.fromCodePoint(128200)} title='Visual Charts' color='amber' />
              <RechartSetUp charts={result.charts} />
              <p className='mt-3 text-xs text-[#8b7b68] italic'>
                {String.fromCodePoint(8505, 65039)} If you need this chart for future reference or revision,
                you can save it by taking a screenshot.
              </p>
            </div>
          ) : (
            <EmptyState title='No charts generated' text='Charts were not requested or were not relevant for this topic.' />
          )}
        </section>
      )}

      {!quickRevision && activeTab === 'practice' && (
      <section
        id='study-section-practice'
        role='tabpanel'
        aria-labelledby='study-tab-practice'
        tabIndex={0}
        className='focus:outline-none'
      >
        <SectionHeader icon={String.fromCodePoint(10067)} title='Important Questions' color='lavender' />

        {hasShortQuestions ? (
          <>
            <p className='font-semibold text-[#33261d] mb-2'>Short Questions:</p>
            <ul className='list-disc ml-6 break-words text-[#4b3a2b] space-y-1 mb-4'>
              {result.questions.short.map((question, index) => (
                <li className='break-words' key={index}>{question}</li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title='No short questions' text='This generated study set did not include short-answer practice.' />
        )}

        {hasLongQuestions ? (
          <>
            <p className='font-semibold text-[#33261d] mb-2'>Long Questions:</p>
            <ul className='list-disc ml-6 break-words text-[#4b3a2b] space-y-1'>
              {result.questions.long.map((question, index) => (
                <li className='break-words' key={index}>{question}</li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title='No long questions' text='This generated study set did not include long-answer practice.' />
        )}

        {hasDiagramQuestion && (
          <>
            <p className='font-semibold text-[#33261d] mt-4 mb-2'>Diagram Question:</p>
            <ul className='list-disc ml-6 break-words text-[#4b3a2b] space-y-1'>
              <li className='break-words'>{result.questions.diagram}</li>
            </ul>
          </>
        )}
      </section>
      )}

      {!quickRevision && activeTab === 'pdf' && (
        <section
          id='study-section-pdf'
          role='tabpanel'
          aria-labelledby='study-tab-pdf'
          tabIndex={0}
          className='focus:outline-none'
        >
          <SectionHeader icon={String.fromCodePoint(11015, 65039)} title='PDF Export' color='mint' />
          <div className='theme-panel min-w-0 p-5'>
            <p className='theme-muted mb-4 text-sm leading-6'>
              Export this generated study set as a clean PDF using the existing download action.
            </p>
            <button
              type='button'
              onClick={() => downloadPdf(result)}
              className='theme-button rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d99d42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf1]'
            >
              {String.fromCodePoint(11015, 65039)} Download PDF
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className='theme-panel min-w-0 p-4'>
      <p className='theme-muted text-xs'>{label}</p>
      <p className='mt-1 break-words text-xl font-bold text-[#33261d]'>{value}</p>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className='theme-panel min-w-0 border-dashed p-5 text-center'>
      <p className='theme-title text-lg font-semibold'>{title}</p>
      <p className='theme-muted mt-2 text-sm leading-6'>{text}</p>
    </div>
  )
}

function SectionHeader({ icon, title, color }) {
  const colors = {
    amber: 'from-[#fff3d8] to-[#fffaf1] text-[#6d4d1f] border border-[#efd096]',
    mint: 'from-[#edf7f0] to-[#fffaf1] text-[#28543b] border border-[#b7dbc6]',
    lavender: 'from-[#f1edff] to-[#fffaf1] text-[#453879] border border-[#c9b8f4]',
  }

  return (
    <div className={`mb-4 min-w-0 px-4 py-3 rounded-md bg-gradient-to-r ${colors[color]} font-semibold flex items-center gap-3`}>
      <span>{icon}</span>
      <span className='break-words'>{title}</span>
    </div>
  )
}

export default FinalResult
