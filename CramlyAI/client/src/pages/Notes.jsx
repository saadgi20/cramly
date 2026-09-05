import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiBarChart2, FiBookOpen, FiClock, FiFileText, FiGrid, FiHome, FiLayers, FiStar } from "react-icons/fi"
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/SideBar'
import FinalResult from '../components/FinalResult'
import ThemeToggle from '../components/ThemeToggle'
import SavedNotesSearch from '../components/SavedNotesSearch'
import { getNoteById } from '../services/api'

function Notes() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get("mode") || "exam"
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [presetTopic, setPresetTopic] = useState("")
  const notesData = result?.data ?? result
  const stats = useMemo(() => getResultStats(notesData), [notesData])
  const generatorRef = useRef(null)
  const outputRef = useRef(null)
  const summaryRef = useRef(null)
  const initialFormValues = useMemo(() => {
    if (mode === "project") {
      return { examType: "Project Notes" }
    }

    if (mode === "diagram") {
      return { includeDiagram: true }
    }

    return { examType: "General Exam" }
  }, [mode])

  useEffect(() => {
    if (result && loading) {
      setLoading(false)
    }
  }, [result, loading])

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const startFreshTopic = (topic = "") => {
    setResult(null)
    setError("")
    setPresetTopic(topic)
    scrollTo(generatorRef)
  }

  const openSavedNote = async (note) => {
    setLoading(true)
    setError("")

    try {
      const savedNote = await getNoteById(note._id)
      setResult(savedNote.content)
      setTimeout(() => scrollTo(outputRef), 0)
    } catch (error) {
      console.log(error)
      setError("Could not open that saved note.")
      scrollTo(generatorRef)
    } finally {
      setLoading(false)
    }
  }

  const requireResult = (sectionName) => {
    if (result) {
      scrollTo(outputRef)
      return
    }

    setError(`Generate notes first to use ${sectionName}.`)
    scrollTo(generatorRef)
  }

  return (
    <div className='theme-page min-h-screen'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]'>
        <WorkspaceRail navigate={navigate} active="notes" onFresh={() => startFreshTopic()} onToolClick={requireResult} />

        <main className='min-w-0 px-4 py-5 lg:px-6'>
          <TopBar navigate={navigate} onSelectNote={openSavedNote} />

          <section className='mt-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
            <div>
              <p className='theme-muted text-sm'>All Notes / Generate</p>
              <h1 className='theme-title mt-2 text-4xl font-bold'>Build a Study Set</h1>
              <p className='theme-muted mt-2 max-w-2xl text-sm leading-6'>
                Generate structured notes, revision points, diagrams, charts, and important questions from one focused workspace.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              {["Overview", "Notes", "Diagrams", "Practice"].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => item === "Overview" ? scrollTo(summaryRef) : requireResult(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold ${
                    index === 0
                      ? "bg-[#f7dfb1] border-[#efd096] text-[#6d4d1f]"
                      : "bg-[#fffaf1] border-[#e4d3b8] text-[#6f6254]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <MetricCard icon={<FiBookOpen />} label="Sub Topics" value={stats.subTopicCount || "Ready"} detail="Priority mapped" tone="amber" onClick={() => requireResult("Sub Topics")} />
            <MetricCard icon={<FiStar />} label="Questions" value={stats.questionCount || "Auto"} detail="Short + long" tone="lavender" onClick={() => requireResult("Questions")} />
            <MetricCard icon={<FiGrid />} label="Visuals" value={stats.visualCount || "Optional"} detail="Diagrams + charts" tone="mint" onClick={() => requireResult("Visuals")} />
            <MetricCard icon={<FiClock />} label="Revision" value={stats.revisionCount || "5 min"} detail="Quick mode" tone="amber" onClick={() => requireResult("Revision")} />
          </section>

          <section className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(620px,1fr)_320px] 2xl:grid-cols-[minmax(760px,1fr)_340px]'>
            <div className='space-y-6'>
              <motion.div
                ref={generatorRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='theme-shell p-5'
              >
                <div className='mb-5 flex flex-col gap-2 border-b border-[#e5d4b8] pb-4 md:flex-row md:items-center md:justify-between'>
                  <div>
                    <h2 className='theme-title text-2xl font-semibold'>Generator</h2>
                    <p className='theme-muted text-sm'>Topic, level, exam type, and output preferences.</p>
                  </div>
                  <span className='theme-pill w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                    AI Workspace
                  </span>
                </div>
                <TopicForm loading={loading && !result} setResult={setResult} setLoading={setLoading} error={error} setError={setError} initialTopic={presetTopic} initialValues={initialFormValues} />
              </motion.div>

              {loading && !result && (
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="theme-panel p-4 text-center text-[#5b4426] font-medium"
                >
                  Generating exam-focused notes...
                </motion.div>
              )}

              {error && (
                <div className="theme-panel border-red-200 bg-red-50/70 p-4 text-center text-red-600 font-medium">
                  {error}
                </div>
              )}

              {!result && (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="theme-panel flex min-h-72 flex-col items-center justify-center border-dashed p-8 text-center text-[#8b7b68]"
                >
                  <span className="theme-title text-3xl font-semibold">Your generated notes will appear here</span>
                  <p className="theme-muted mt-3 max-w-md text-sm">
                    The output area becomes a structured reading panel with quick revision, PDF export, diagrams, charts, and important questions.
                  </p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  ref={outputRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className='theme-shell p-6'
                >
                  <FinalResult result={notesData} />
                </motion.div>
              )}
            </div>

            <aside className='space-y-6'>
              <div ref={summaryRef}>
                <SummaryPanel stats={stats} hasResult={Boolean(result)} />
              </div>
              {result ? (
                <Sidebar result={notesData} />
              ) : (
                <QuickActions navigate={navigate} onFresh={() => startFreshTopic()} />
              )}
            </aside>
          </section>
        </main>

      </div>
    </div>
  )
}

function WorkspaceRail({ navigate, active, onFresh, onToolClick }) {
  const items = [
    { id: "home", label: "Home", icon: <FiHome />, action: () => navigate("/") },
    { id: "notes", label: "New Notes", icon: <FiFileText />, action: () => navigate("/notes") },
    { id: "history", label: "History", icon: <FiLayers />, action: () => navigate("/history") },
  ]

  return (
    <aside className='hidden min-h-screen border-r border-[#e4d3b8] bg-[#fff7ea]/75 px-5 py-6 lg:block'>
      <button onClick={() => navigate("/")} className='mb-8 text-left'>
        <h2 className='theme-title text-2xl font-bold'>Cramly AI</h2>
        <p className='theme-muted mt-1 text-xs'>Study command center</p>
      </button>

      <button onClick={onFresh} className='theme-button mb-6 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold'>
        + New Notes
      </button>

      <nav className='space-y-2'>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active === item.id
                ? "bg-[#f7dfb1] text-[#6d4d1f]"
                : "text-[#5f5246] hover:bg-[#fffaf1]"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className='mt-8 border-t border-[#e5d4b8] pt-5'>
        <p className='theme-muted mb-3 text-xs font-semibold uppercase tracking-wide'>Study Tools</p>
        {["Notes", "Questions", "Diagrams", "Charts", "PDF Export"].map((tool) => (
          <button key={tool} onClick={() => onToolClick(tool)} className='theme-muted flex w-full items-center gap-2 py-2 text-left text-sm transition hover:text-[#33261d]'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#d99d42]' />
            {tool}
          </button>
        ))}
      </div>
    </aside>
  )
}

function TopBar({ navigate, onSelectNote }) {
  return (
    <div className='theme-header flex flex-col gap-3 px-4 py-4 pt-5 md:flex-row md:items-center md:justify-between'>
      <SavedNotesSearch onSelect={onSelectNote} placeholder='Search saved notes...' />
      <div className='relative z-10 flex gap-2'>
        <ThemeToggle />
        <button onClick={() => navigate("/history")} className='theme-pill rounded-lg px-4 py-2 text-sm font-semibold'>History</button>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, detail, tone, onClick }) {
  const tones = {
    amber: "bg-[#fff3d8] text-[#6d4d1f] border-[#efd096]",
    mint: "bg-[#edf7f0] text-[#28543b] border-[#b7dbc6]",
    lavender: "bg-[#f1edff] text-[#453879] border-[#c9b8f4]",
  }

  return (
    <button onClick={onClick} className='theme-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(91,68,38,0.16)]'>
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${tones[tone]}`}>
        {icon}
      </div>
      <p className='theme-muted text-xs'>{label}</p>
      <p className='mt-1 text-xl font-bold text-[#33261d]'>{value}</p>
      <p className='theme-muted mt-1 text-xs'>{detail}</p>
    </button>
  )
}

function SummaryPanel({ stats, hasResult }) {
  return (
    <div className='theme-panel p-5'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='theme-title text-lg font-semibold'>AI Summary</h3>
        <span className='rounded-full bg-[#fff3d8] px-2 py-1 text-xs text-[#6d4d1f]'>Spark</span>
      </div>
      <p className='theme-muted text-sm leading-6'>
        {hasResult
          ? `Your study set includes ${stats.subTopicCount} sub topics, ${stats.questionCount} questions, and ${stats.revisionCount} quick revision points.`
          : "Generate a topic to unlock a compact summary, quick exam view, priority sections, visuals, and export controls."}
      </p>
    </div>
  )
}

function QuickActions({ navigate, onFresh }) {
  const actions = [
    { label: "Open saved notes", action: () => navigate("/history") },
    { label: "Back to home", action: () => navigate("/") },
    { label: "Start fresh topic", action: onFresh },
  ]

  return (
    <div className='theme-panel p-5'>
      <h3 className='theme-title mb-4 text-lg font-semibold'>Quick Actions</h3>
      <div className='space-y-2'>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className='flex w-full items-center justify-between rounded-lg border border-[#e4d3b8] bg-[#fffaf1] px-3 py-3 text-left text-sm text-[#4b3a2b] transition hover:bg-[#fff3d8]'
          >
            {action.label}
            <span>-&gt;</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RightRail({ navigate, stats, hasResult, onRelatedTopic }) {
  return (
    <aside className='hidden border-l border-[#e4d3b8] bg-[#fff7ea]/65 px-5 py-6 xl:block'>
      <SummaryPanel stats={stats} hasResult={hasResult} />
      <div className='mt-5 theme-panel p-5'>
        <h3 className='theme-title mb-4 text-lg font-semibold'>Study Progress</h3>
        <div className='mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-[#a895e8] bg-[#fffaf1] text-center'>
          <div>
            <p className='text-2xl font-bold text-[#33261d]'>{hasResult ? "75%" : "0%"}</p>
            <p className='theme-muted text-xs'>Prepared</p>
          </div>
        </div>
        <ProgressLine label="Sub topics" value={stats.subTopicCount} />
        <ProgressLine label="Questions" value={stats.questionCount} />
        <ProgressLine label="Revision" value={stats.revisionCount} />
      </div>
      <div className='mt-5 theme-panel p-5'>
        <h3 className='theme-title mb-4 text-lg font-semibold'>Related</h3>
        {["Algorithms", "Exam prep", "Mind maps"].map((item) => (
          <button key={item} onClick={() => onRelatedTopic(item)} className='flex w-full justify-between border-b border-[#e5d4b8] py-3 text-sm text-[#4b3a2b] transition hover:text-[#6d4d1f] last:border-0'>
            {item}
            <span>-&gt;</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

function ProgressLine({ label, value }) {
  return (
    <div className='mb-3 flex items-center justify-between text-sm'>
      <span className='theme-muted'>{label}</span>
      <span className='font-semibold text-[#28543b]'>{value || 0}</span>
    </div>
  )
}

function getResultStats(result) {
  const subTopicCount = Object.values(result?.subTopics ?? {}).reduce((total, topics) => {
    return total + (Array.isArray(topics) ? topics.length : 0)
  }, 0)
  const questionCount = (result?.questions?.short?.length ?? 0) + (result?.questions?.long?.length ?? 0) + (result?.questions?.diagram ? 1 : 0)
  const visualCount = (result?.diagram?.data ? 1 : 0) + (result?.charts?.length ?? 0)
  const revisionCount = result?.revisionPoints?.length ?? 0

  return { subTopicCount, questionCount, visualCount, revisionCount }
}

export default Notes
