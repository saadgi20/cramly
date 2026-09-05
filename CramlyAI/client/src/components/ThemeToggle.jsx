import React, { useEffect, useRef, useState } from 'react'
import { FiCheck, FiMonitor, FiMoon, FiSun } from 'react-icons/fi'

const THEME_KEY = 'cramly-theme-mode'
const modes = [
  { id: 'light', label: 'Light', icon: FiSun },
  { id: 'dark', label: 'Dark', icon: FiMoon },
  { id: 'system', label: 'System', icon: FiMonitor },
]

const getStoredMode = () => {
  if (typeof window === 'undefined') return 'system'

  try {
    const savedMode = window.localStorage.getItem(THEME_KEY)
    return modes.some((mode) => mode.id === savedMode) ? savedMode : 'system'
  } catch (error) {
    console.log(error)
    return 'system'
  }
}

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (mode) => {
  const resolvedTheme = mode === 'system' ? getSystemTheme() : mode

  document.documentElement.dataset.themeMode = mode
  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.style.colorScheme = resolvedTheme
}

function ThemeToggle({ className = '' }) {
  const [mode, setMode] = useState(getStoredMode)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const activeMode = modes.find((item) => item.id === mode) ?? modes[2]
  const ActiveIcon = activeMode.icon

  useEffect(() => {
    applyTheme(mode)

    try {
      window.localStorage.setItem(THEME_KEY, mode)
    } catch (error) {
      console.log(error)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') return undefined

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mediaQuery) return undefined

    const syncSystemTheme = () => applyTheme('system')
    mediaQuery.addEventListener?.('change', syncSystemTheme)
    mediaQuery.addListener?.(syncSystemTheme)

    return () => {
      mediaQuery.removeEventListener?.('change', syncSystemTheme)
      mediaQuery.removeListener?.(syncSystemTheme)
    }
  }, [mode])

  useEffect(() => {
    if (!open) return undefined

    const closeOnPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    return () => document.removeEventListener('pointerdown', closeOnPointerDown)
  }, [open])

  const selectMode = (nextMode) => {
    setMode(nextMode)
    setOpen(false)
  }

  return (
    <div ref={menuRef} className={`theme-toggle ${className}`}>
      <button
        type='button'
        aria-label={`Theme: ${activeMode.label}. Open theme menu`}
        title={`Theme: ${activeMode.label}`}
        aria-haspopup='menu'
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
          }
        }}
        className='theme-toggle-button'
      >
        <ActiveIcon size={16} aria-hidden='true' />
      </button>

      {open && (
        <div role='menu' aria-label='Theme options' className='theme-mode-menu'>
          {modes.map((item) => {
            const Icon = item.icon
            const selected = item.id === mode

            return (
              <button
                key={item.id}
                type='button'
                role='menuitemradio'
                aria-checked={selected}
                data-active={selected}
                className='theme-mode-option'
                onClick={() => selectMode(item.id)}
              >
                <Icon size={14} aria-hidden='true' />
                <span>{item.label}</span>
                {selected && <FiCheck className='ml-auto' size={14} aria-hidden='true' />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ThemeToggle
