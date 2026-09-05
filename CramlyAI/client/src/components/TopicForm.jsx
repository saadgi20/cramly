import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { generateNotes } from '../services/api';

function TopicForm({ setResult, setLoading, loading, setError, initialTopic = "", initialValues = {} }) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic)
    }
  }, [initialTopic])

  useEffect(() => {
    setClassLevel(initialValues.classLevel || "")
    setExamType(initialValues.examType || "")
    setRevisionMode(Boolean(initialValues.revisionMode))
    setIncludeDiagram(Boolean(initialValues.includeDiagram))
    setIncludeChart(Boolean(initialValues.includeChart))
  }, [initialValues])

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter the topic")
      return;
    }
    setError("")
    setLoading(true)
    setResult(null)
    try {

      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart
      })
      console.log("GENERATED NOTES:", result)

      setResult(result)
      setClassLevel("")
      setTopic("")
      setExamType("")
      setIncludeChart(false)
      setRevisionMode(false)
      setIncludeDiagram(false)

      setLoading(false)

    } catch (error) {
      console.log(error)
      setError("Failed to fetch notes from server");
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("")
      return;
    }
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 8

      if (value >= 95) {
        value = 95;
        setProgressText("Almost done...");
        clearInterval(interval);
      } else if (value > 70) {
        setProgressText("Finalizing notes...");
      } else if (value > 40) {
        setProgressText("Processing content...");
      } else {
        setProgressText("Generating notes...");
      }

      setProgress(Math.floor(value))

    }, 700)

    return () => clearInterval(interval);


  }, [loading])





  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="theme-shell p-8 space-y-6">

      <input type="text" className='theme-input w-full p-4 rounded-lg' placeholder='Topic: Web Development'
        onChange={(e) => setTopic(e.target.value)}
        value={topic}
      />
      <input type="text" className='theme-input w-full p-4 rounded-lg'
        placeholder='Level: Class 10'
        onChange={(e) => setClassLevel(e.target.value)}
        value={classLevel}
      />
      <input type="text" className='theme-input w-full p-4 rounded-lg'
        placeholder='Exam Type: CBSE, JEE, NEET'
        onChange={(e) => setExamType(e.target.value)}
        value={examType}
      />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />
        <Toggle
          label="Include Diagram"
          checked={includeDiagram}
          onChange={() => setIncludeDiagram(!includeDiagram)}
        />
        <Toggle
          label="Include Charts"
          checked={includeChart}
          onChange={() => setIncludeChart(!includeChart)}
        />
      </div>

      <motion.button
        onClick={handleSubmit}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        disabled={loading}
        className={`
    w-full mt-4
    py-3 rounded-lg
    font-semibold
    flex items-center justify-center gap-3
    transition
    ${loading
            ? "theme-button cursor-not-allowed"
            : "theme-button"
          }
  `}>
        {loading ? "Generating Notes..." : "Generate Notes ->"}

      </motion.button>


      {loading &&
        <div className='mt-4 space-y-2'>

          <div className='w-full h-2 rounded-full bg-[#ead9bf] overflow-hidden'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.6 }}
              className='h-full bg-gradient-to-r from-[#8fc9a8] via-[#f0b24c] to-[#a895e8]'>

            </motion.div>

          </div>

          <div className='theme-muted flex justify-between text-xs'>
            <span>{progressText}</span>
            <span>{progress}%</span>
          </div>
          <p className='text-xs text-[#8b7b68] text-center'>
            This may take up to 2-5 minutes. Please don't close or refresh the page.
          </p>


        </div>}





    </motion.div>
  )
}


function Toggle({ label, checked, onChange }) {
  return (
    <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
      <motion.div
        animate={{
          backgroundColor: checked
            ? "rgba(127,199,159,0.75)"
            : "rgba(241,223,195,0.9)"
        }}
        transition={{ duration: 0.25 }}
        className='relative w-12 h-6 rounded-full
          border border-[#dfcfb5]'

      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className=' absolute top-0.5
            h-5 w-5 rounded-full
            bg-[#fffaf1]
            shadow-[0_3px_8px_rgba(91,68,38,0.2)]'
          style={{
            left: checked ? "1.6rem" : "0.25rem",
          }}

        >


        </motion.div>
      </motion.div>

      <span className={`text-sm transition-colors ${checked ? "text-[#28543b]" : "text-[#6f6254]"
        }`}>{label}</span>

    </div>
  )
}




export default TopicForm
