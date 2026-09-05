import React from 'react'
import { motion } from "motion/react"
import logo from "../assets/cramlyMark.svg"
import { useNavigate } from "react-router-dom"

function Footer() {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='theme-footer z-10 mx-6 mb-6 mt-24 px-8 py-8 pt-10'
        >
            <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
                <motion.div
                    whileHover={{ rotateX: 4, rotateY: -4 }}
                    className="flex flex-col gap-4 transform-gpu"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        style={{ transform: "translateZ(20px)" }}
                        onClick={() => navigate("/")}
                    >
                        <img src={logo} alt="Cramly AI" className='h-9 w-9 object-contain' />
                        <span className="theme-title text-2xl font-semibold">
                            Cramly AI
                        </span>
                    </div>
                    <p className="theme-muted text-sm max-w-sm">
                        Smarter notes, faster revisions, clear diagrams, and clean PDFs powered by AI.
                    </p>
                    <div className='flex flex-wrap gap-2'>
                        <span className='rounded-full bg-[#fff3d8] border border-[#efd096] px-3 py-1 text-xs font-medium text-[#6d4d1f]'>Bold notes</span>
                        <span className='rounded-full bg-[#edf7f0] border border-[#b7dbc6] px-3 py-1 text-xs font-medium text-[#28543b]'>Fast revision</span>
                    </div>
                </motion.div>

                <div className='theme-panel p-5 text-center'>
                    <h1 className='text-sm font-semibold text-[#33261d] mb-4'>Quick Links</h1>
                    <ul className='space-y-2 text-sm'>
                        <li onClick={() => navigate("/notes")} className='theme-muted hover:text-[#33261d] transition-colors cursor-pointer'>
                            Notes
                        </li>
                        <li onClick={() => navigate("/history")} className='theme-muted hover:text-[#33261d] transition-colors cursor-pointer'>
                            History
                        </li>
                    </ul>
                </div>

                <div className='rounded-xl border border-[#c9b8f4] bg-[#f1edff]/70 p-5'>
                    <h2 className='theme-title text-lg font-semibold'>Ready for the next topic?</h2>
                    <p className='theme-muted mt-2 text-sm'>Open the generator and build a fresh study set.</p>
                    <button
                        onClick={() => navigate("/notes")}
                        className='theme-button-lavender mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-[#2f251c]'
                    >
                        Generate -&gt;
                    </button>
                </div>
            </div>

            <div className="relative z-10 my-6 h-px bg-[#e5d4b8]" />
            <p className='relative z-10 text-center text-xs text-[#8b7b68]'>
                (c) {new Date().getFullYear()} Cramly AI. All rights reserved.
            </p>
        </motion.div>
    )
}

export default Footer
