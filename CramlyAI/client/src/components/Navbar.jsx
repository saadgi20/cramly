import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import logo from "../assets/cramlyMark.svg"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { setUserData } from '../redux/userSlice'
import axios from "axios"
import { serverUrl } from "../services/api"
import ThemeToggle from './ThemeToggle'

function Navbar() {
    const { userData } = useSelector((state) => state.user)
    const [showProfile, setShowProfile] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/auth")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className='theme-header relative z-20 mx-6 mt-6 flex items-center justify-between px-8 py-4 pt-5'>

            <div className='relative z-10 flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center'>
                    <img src={logo} alt="Cramly AI" className='h-9 w-9 object-contain' />
                </div>
                <div>
                    <span className='theme-title text-2xl hidden md:block font-semibold'>
                        Cramly AI
                    </span>
                    <span className='hidden md:inline-flex mt-1 theme-pill rounded-full px-3 py-1 text-xs font-medium'>
                        Notes + Questions + Diagrams
                    </span>
                </div>
            </div>

            <div className='relative z-10 flex items-center gap-3 sm:gap-6'>
                <ThemeToggle />
                <div className='relative'>
                    <motion.div
                        onClick={() => setShowProfile(!showProfile)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.97 }}
                        className='flex items-center justify-center gap-1
                px-4 py-2 rounded-full
                theme-pill text-sm
                shadow-sm
                cursor-pointer'>
                        <span className='text-lg'>{userData?.name?.slice(0, 1).toUpperCase()}</span>
                    </motion.div>

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className='absolute right-[-50px] mt-4 w-52
                    theme-panel
                    p-4'>

                                <MenuItem text="History" onClick={() => {
                                    setShowProfile(false)
                                    navigate("/history")
                                }} />
                                <div className="h-px bg-[#e5d4b8] mx-3" />
                                <MenuItem text="Sign out" red onClick={handleSignOut} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

function MenuItem({ onClick, text, red }) {
    return (
        <div
            onClick={onClick}
            className={`
        w-full text-left px-5 py-3 text-sm
        transition-colors rounded-lg cursor-pointer
        ${red
                    ? "text-red-600 hover:bg-red-50"
                    : "text-[#4b3a2b] hover:bg-[#f7dfb1]/40"
                }
      `}>
            {text}
        </div>
    )
}

export default Navbar
