import React from 'react'
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import axios from "axios"
import { serverUrl } from '../services/api'
import { useDispatch } from "react-redux"
import { setUserData } from '../redux/userSlice'
import ThemeToggle from '../components/ThemeToggle'

const MotionHeader = motion.header
const MotionDiv = motion.div
const MotionButton = motion.button

function Auth() {
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      const name = user.displayName
      const email = user.email
      const result = await axios.post(serverUrl + "/api/auth/google", { name, email }, {
        withCredentials: true
      })
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='theme-page overflow-hidden px-8'>
      <MotionHeader
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="theme-header max-w-7xl mx-auto mt-8 px-8 py-6 pt-7"
      >
        <div className='relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3'>
          <div>
            <h1 className='theme-title text-3xl font-bold'>Cramly AI</h1>
            <p className='theme-muted text-sm mt-1'>AI-powered exam-oriented notes and revision</p>
          </div>
          <span className='theme-pill w-fit rounded-full px-4 py-2 text-sm font-medium'>
            Free study workspace
          </span>
          <ThemeToggle />
        </div>
      </MotionHeader>

      <main className='max-w-7xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
        <MotionDiv
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className='theme-title text-5xl lg:text-6xl font-bold leading-tight'>
            Unlock Smart <br /> Study Notes
          </h1>

          <MotionButton
            onClick={handleGoogleAuth}
            whileHover={{
              y: -10,
              rotateX: 8,
              rotateY: -8,
              scale: 1.07
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className='theme-button mt-10 px-10 py-3 rounded-lg
              flex items-center gap-3
              font-semibold text-lg'>
            <FcGoogle size={22} />
            Continue with Google
          </MotionButton>

          <p className='theme-muted mt-6 max-w-xl text-lg leading-8'>
            Create exam notes, project notes, charts, diagrams, and clean PDFs for free.
          </p>
          <p className='mt-4 text-sm text-[#8b7b68]'>Free access with no payment flow.</p>
        </MotionDiv>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <Feature title="Free to Use" des="Generate notes without payments or usage counters." />
          <Feature title="Exam Notes" des="High-yield, revision-ready exam-oriented notes." />
          <Feature title="Project Notes" des="Well-structured documentation for assignments and projects." />
          <Feature title="Charts & Graphs" des="Auto-generated diagrams, charts and flow graphs." />
          <Feature title="PDF Download" des="Download clean, printable PDFs instantly." />
        </div>
      </main>
    </div>
  )
}

function Feature({ title, des }) {
  return (
    <MotionDiv
      whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='theme-card relative p-6'
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
        <h3 className="theme-title text-xl font-semibold mb-2">{title}</h3>
        <p className="theme-muted text-sm leading-relaxed">{des}</p>
      </div>
    </MotionDiv>
  )
}

export default Auth
