import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { getNoteById, serverUrl } from '../services/api'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { FiArchive, FiBookOpen, FiClock, FiFileText, FiGrid, FiHome, FiLayers, FiStar } from "react-icons/fi"
import FinalResult from '../components/FinalResult'
import ThemeToggle from '../components/ThemeToggle'
import SavedNotesSearch from '../components/SavedNotesSearch'

function History() {
  const [topics, setTopics] = useState([])
  const navigate = useNavigate()
  const [selectedNote, setSelectedNote] = useState(null)
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const stats = useMemo(() => getHistoryStats(topics, selectedNote), [topics, selectedNote])

  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", { withCredentials: true })
        setTopics(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.log(error)
      }
    }

    myNotes()
  }, [])

  const openNotes = async (noteId) => {
    setLoading(true)
    setActiveNoteId(noteId)

    try {
      const note = await getNoteById(noteId)
      setSelectedNote(note.content)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='theme-page min-h-screen'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]'>
        <WorkspaceRail navigate={navigate} active="history" />

        <main className='min-w-0 px-4 py-5 lg:px-6'>
          <TopBar navigate={navigate} onSelectNote={(note) => openNotes(note._id)} />

          <section className='mt-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
            <div>
              <p className='theme-muted text-sm'>All Notes / Library</p>
              <h1 className='theme-title mt-2 text-4xl font-bold'>Saved Study Library</h1>
              <p className='theme-muted mt-2 max-w-2xl text-sm leading-6'>
                Browse previous study sets, reopen generated notes, and continue revising from one organized library.
              </p>
            </div>
            <button onClick={() => navigate("/notes")} className='theme-button w-fit rounded-lg px-5 py-3 text-sm font-semibold'>
              + New Notes
            </button>
          </section>

          <section className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <MetricCard icon={<FiArchive />} label="Saved Notes" value={stats.totalNotes} detail="In your library" tone="amber" />
            <MetricCard icon={<FiGrid />} label="Diagrams" value={stats.diagramCount} detail="Generated sets" tone="mint" />
            <MetricCard icon={<FiStar />} label="Revision" value={stats.revisionCount} detail="Revision mode" tone="lavender" />
            <MetricCard icon={<FiBookOpen />} label="Selected" value={selectedNote ? "Open" : "None"} detail="Current note" tone="amber" />
          </section>

          <section className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]'>
            <aside className='theme-shell min-w-0 p-5'>
              <div className='mb-4 flex items-center justify-between border-b border-[#e5d4b8] pb-4'>
                <div>
                  <h2 className='theme-title text-2xl font-semibold'>Your Topics</h2>
                  <p className='theme-muted text-sm'>Select a note to preview.</p>
                </div>
                <span className='theme-pill rounded-full px-3 py-1 text-xs font-semibold'>{topics.length}</span>
              </div>

              {topics.length === 0 && (
                <div className='theme-panel p-4 text-sm text-[#6f6254]'>No notes created yet</div>
              )}

              <ul className='space-y-3'>
                {topics.map((t) => (
                  <li
                    key={t._id}
                    onClick={() => openNotes(t._id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      activeNoteId === t._id
                        ? "bg-[#f7dfb1] border-[#d99d42] shadow-[0_0_0_1px_rgba(217,157,66,0.35)]"
                        : "bg-[#fffaf1] border-[#e4d3b8] hover:bg-[#fff3d8]"
                    }`}
                  >
                    <p className='break-words text-sm font-semibold text-[#33261d]'>{t.topic}</p>

                    <div className='mt-3 flex flex-wrap gap-2 text-xs'>
                      {t.classLevel && <span className='rounded-full bg-[#b7dbc6] px-2 py-0.5 text-[#28543b]'>Level: {t.classLevel}</span>}
                      {t.examType && <span className='rounded-full bg-[#c9b8f4] px-2 py-0.5 text-[#453879]'>{t.examType}</span>}
                    </div>

                    <div className='theme-muted mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs'>
                      {t.revisionMode && <span>Revision</span>}
                      {t.includeDiagram && <span>Diagram</span>}
                      {t.includeChart && <span>Chart</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='theme-shell min-h-[75vh] min-w-0 overflow-hidden p-5 lg:p-6'
            >
              {loading && <p className="theme-muted text-center">Loading notes...</p>}
              {!loading && !selectedNote && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#efd096] bg-[#fff3d8] text-[#6d4d1f]'>
                    <FiFileText size={28} />
                  </div>
                  <h2 className='theme-title text-2xl font-semibold'>Select a topic from the library</h2>
                  <p className='theme-muted mt-2 max-w-md text-sm'>
                    Your saved note opens here with the same reading, revision, diagram, and PDF tools.
                  </p>
                </div>
              )}

              {!loading && selectedNote && <FinalResult result={selectedNote} />}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}

function WorkspaceRail({ navigate, active }) {
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

      <button onClick={() => navigate("/notes")} className='theme-button mb-6 w-full rounded-lg px-4 py-3 text-left text-sm font-semibold'>
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
    </aside>
  )
}

function TopBar({ navigate, onSelectNote }) {
  return (
    <div className='theme-header flex flex-col gap-3 px-4 py-4 pt-5 md:flex-row md:items-center md:justify-between'>
      <SavedNotesSearch onSelect={onSelectNote} placeholder='Search saved notes...' />
      <div className='relative z-10 flex gap-2'>
        <ThemeToggle />
        <button onClick={() => navigate("/notes")} className='theme-pill rounded-lg px-4 py-2 text-sm font-semibold'>Generate</button>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, detail, tone }) {
  const tones = {
    amber: "bg-[#fff3d8] text-[#6d4d1f] border-[#efd096]",
    mint: "bg-[#edf7f0] text-[#28543b] border-[#b7dbc6]",
    lavender: "bg-[#f1edff] text-[#453879] border-[#c9b8f4]",
  }

  return (
    <div className='theme-card p-4'>
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${tones[tone]}`}>
        {icon}
      </div>
      <p className='theme-muted text-xs'>{label}</p>
      <p className='mt-1 text-xl font-bold text-[#33261d]'>{value}</p>
      <p className='theme-muted mt-1 text-xs'>{detail}</p>
    </div>
  )
}

function RightRail({ stats, selectedNote, navigate }) {
  return (
    <aside className='hidden border-l border-[#e4d3b8] bg-[#fff7ea]/65 px-5 py-6 xl:block'>
      <div className='theme-panel p-5'>
        <h3 className='theme-title text-lg font-semibold'>Library Summary</h3>
        <p className='theme-muted mt-3 text-sm leading-6'>
          {selectedNote
            ? "This saved note is loaded and ready for revision, download, diagrams, and question practice."
            : `You have ${stats.totalNotes} saved study sets. Select a topic to open its full workspace.`}
        </p>
      </div>

      <div className='mt-5 theme-panel p-5'>
        <h3 className='theme-title mb-4 text-lg font-semibold'>Quick Actions</h3>
        <button onClick={() => navigate("/notes")} className='mb-2 flex w-full items-center justify-between rounded-lg border border-[#e4d3b8] bg-[#fffaf1] px-3 py-3 text-left text-sm text-[#4b3a2b] hover:bg-[#fff3d8]'>
          Generate new notes
          <span>-&gt;</span>
        </button>
        <button onClick={() => navigate("/")} className='flex w-full items-center justify-between rounded-lg border border-[#e4d3b8] bg-[#fffaf1] px-3 py-3 text-left text-sm text-[#4b3a2b] hover:bg-[#fff3d8]'>
          Back to home
          <span>-&gt;</span>
        </button>
      </div>

      <div className='mt-5 theme-panel p-5'>
        <h3 className='theme-title mb-4 text-lg font-semibold'>Study Mix</h3>
        <ProgressLine label="Diagrams" value={stats.diagramCount} />
        <ProgressLine label="Charts" value={stats.chartCount} />
        <ProgressLine label="Revision sets" value={stats.revisionCount} />
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

function getHistoryStats(topics, selectedNote) {
  return {
    totalNotes: topics.length,
    diagramCount: topics.filter((topic) => topic.includeDiagram).length + (selectedNote?.diagram?.data ? 1 : 0),
    chartCount: topics.filter((topic) => topic.includeChart).length + (selectedNote?.charts?.length ?? 0),
    revisionCount: topics.filter((topic) => topic.revisionMode).length + (selectedNote?.revisionPoints?.length ?? 0),
  }
}

export default History
