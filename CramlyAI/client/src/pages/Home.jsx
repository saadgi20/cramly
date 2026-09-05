import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className='theme-page overflow-hidden'>
      <Navbar />

      <section className='max-w-7xl mx-auto px-8 pt-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ rotateX: 4, rotateY: -4 }}
            className="transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              className="theme-title text-5xl lg:text-6xl font-bold leading-tight"
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 8px 22px rgba(91,68,38,0.14)",
              }}
            >
              Create Smart <br /> Study Notes
            </motion.h1>

            <motion.p
              whileHover={{ y: -2 }}
              className='theme-muted mt-6 max-w-xl text-lg leading-8'
              style={{ transform: "translateZ(40px)" }}
            >
              Generate exam-focused notes, project documentation, flow diagrams,
              and revision-ready content in a calm workspace built for studying.
            </motion.p>
          </motion.div>

          <motion.button
            onClick={() => navigate("/notes")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className='theme-button mt-10 px-10 py-3 rounded-lg flex items-center gap-3 font-semibold text-lg'
          >
            Generate -&gt;
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            y: -10,
            rotateX: 6,
            rotateY: -6,
            scale: 1.03,
          }}
          className='transform-gpu'
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className='theme-shell overflow-hidden p-5'>
            <CramlyWorkspacePreview />
          </div>
        </motion.div>
      </section>

      <section className='max-w-6xl mx-auto px-8 py-28 grid grid-cols-1 md:grid-cols-4 gap-8'>
        <Feature
          icon="N"
          title="AI-Powered Notes"
          des="Generate intelligent, context-aware notes that adapt to your learning style and needs."
          onClick={() => navigate("/notes/new?mode=exam")}
        />
        <Feature
          icon="Q"
          title="Project Notes"
          des="Structured, ready-to-use content tailored for assignments and projects."
          onClick={() => navigate("/notes/new?mode=project")}
        />
        <Feature
          icon="D"
          title="Diagrams"
          des="Turn confusion into clarity with instant visual breakdowns."
          accent="lavender"
          onClick={() => navigate("/notes/new?mode=diagram")}
        />
        <Feature
          icon="PDF"
          title="PDF Download"
          des="Export clean, print-ready PDFs in one click."
          accent="mint"
          onClick={() => navigate("/history")}
        />
      </section>

      <Footer />
    </div>
  )
}

function CramlyWorkspacePreview() {
  return (
    <div className='relative min-h-[420px] overflow-hidden rounded-xl border border-[#e4d3b8] bg-[#fffaf1] p-5' style={{ transform: "translateZ(35px)" }}>
      <div className='mb-5 flex items-center justify-between border-b border-[#e5d4b8] pb-4'>
        <div>
          <p className='theme-muted text-xs font-semibold uppercase tracking-wide'>Cramly Workspace</p>
          <h3 className='theme-title mt-1 text-xl font-semibold'>Topic to study set</h3>
        </div>
        <span className='theme-pill rounded-full px-3 py-1 text-xs font-semibold'>AI ready</span>
      </div>

      <div className='grid gap-4 lg:grid-cols-[0.9fr_1.1fr]'>
        <div className='space-y-3'>
          <PreviewStep label='Topic' value='Operating Systems' />
          <div className='theme-card p-4'>
            <p className='theme-muted text-xs'>AI planning</p>
            <div className='mt-3 space-y-2'>
              <div className='h-2 w-3/4 rounded-full bg-[#f7dfb1]' />
              <div className='h-2 w-full rounded-full bg-[#edf7f0]' />
              <div className='h-2 w-2/3 rounded-full bg-[#f1edff]' />
            </div>
          </div>
          <PreviewStep label='Output' value='Notes + visuals + practice' />
        </div>

        <div className='space-y-4'>
          <div className='theme-panel p-4'>
            <div className='mb-3 flex items-center justify-between'>
              <h4 className='theme-title text-sm font-semibold'>Generated notes</h4>
              <span className='theme-muted text-xs'>Structured</span>
            </div>
            <div className='space-y-2'>
              <div className='h-2 rounded-full bg-[#fff3d8]' />
              <div className='h-2 w-5/6 rounded-full bg-[#fff3d8]' />
              <div className='h-2 w-2/3 rounded-full bg-[#fff3d8]' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='theme-card p-3'>
              <p className='theme-muted text-xs'>Priorities</p>
              <ul className='mt-2 space-y-1 text-xs text-[#4b3a2b]'>
                <li>Kernel</li>
                <li>Scheduling</li>
                <li>Memory</li>
              </ul>
            </div>
            <div className='theme-card p-3'>
              <p className='theme-muted text-xs'>Diagram</p>
              <div className='mt-3 flex items-center gap-2'>
                <span className='h-8 w-8 rounded-full border border-[#efd096] bg-[#fff3d8]' />
                <span className='h-px flex-1 bg-[#d99d42]' />
                <span className='h-8 w-8 rounded-md border border-[#b7dbc6] bg-[#edf7f0]' />
              </div>
            </div>
          </div>

          <div className='theme-panel p-4'>
            <p className='theme-muted text-xs'>Practice questions</p>
            <div className='mt-3 space-y-2 text-xs text-[#4b3a2b]'>
              <p>1. Explain process scheduling.</p>
              <p>2. Compare paging and segmentation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewStep({ label, value }) {
  return (
    <div className='theme-panel p-4'>
      <p className='theme-muted text-xs'>{label}</p>
      <p className='theme-title mt-1 text-sm font-semibold'>{value}</p>
    </div>
  )
}

function Feature({ icon, title, des, accent = "paper", onClick }) {
  const accentClass = {
    paper: "bg-[#f1dfc3] text-[#5b4426]",
    mint: "bg-[#b7dbc6] text-[#28543b]",
    lavender: "bg-[#c9b8f4] text-[#453879]",
  }[accent]

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='theme-card relative p-6 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d99d42] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf1]'
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md text-xl font-bold ${accentClass}`}>
          {icon}
        </div>
        <h3 className="theme-title text-xl font-semibold mb-2">{title}</h3>
        <p className="theme-muted text-sm leading-relaxed">{des}</p>
      </div>
    </motion.button>
  )
}

export default Home
