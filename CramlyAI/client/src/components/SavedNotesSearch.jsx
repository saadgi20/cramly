import React, { useEffect, useRef, useState } from 'react'
import { FiFileText, FiLoader, FiSearch } from 'react-icons/fi'
import { searchNotes } from '../services/api'

function SavedNotesSearch({ onSelect, placeholder = 'Search saved notes...' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [open, setOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const closeOnPointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    return () => document.removeEventListener('pointerdown', closeOnPointerDown)
  }, [open])

  const runSearch = async (nextQuery = query) => {
    setLoading(true)
    setOpen(true)
    setSearched(true)

    try {
      const notes = await searchNotes(nextQuery.trim())
      setResults(Array.isArray(notes) ? notes : [])
    } catch (error) {
      console.log(error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    runSearch()
  }

  const handleFocus = () => {
    setOpen(true)
    if (!searched) {
      runSearch('')
    }
  }

  const handleSelect = (note) => {
    setOpen(false)
    setQuery(note.topic || '')
    onSelect(note)
  }

  return (
    <div ref={searchRef} className='relative z-20 min-w-0 flex-1'>
      <form
        onSubmit={handleSubmit}
        className='relative z-10 flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#e4d3b8] bg-[#fffaf1]/75 px-3 py-2'
      >
        <FiSearch className='text-[#8b7b68]' aria-hidden='true' />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={handleFocus}
          className='min-w-0 flex-1 bg-transparent text-sm text-[#33261d] outline-none placeholder:text-[#8b7b68]'
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <button type='submit' className='ml-auto rounded-md border border-[#e4d3b8] px-2 py-0.5 text-xs text-[#8b7b68] transition hover:bg-[#fff3d8]'>
          Search
        </button>
      </form>

      {open && (
        <div className='theme-panel absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-auto p-2'>
          {loading && (
            <div className='flex items-center gap-2 px-3 py-3 text-sm text-[#6f6254]'>
              <FiLoader className='animate-spin' aria-hidden='true' />
              Searching saved notes...
            </div>
          )}

          {!loading && searched && results.length === 0 && query.trim() && (
            <div className='px-3 py-4 text-sm'>
              <p className='theme-title font-semibold'>No results found</p>
              <p className='theme-muted mt-1'>Try a different topic, level, or note type.</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && !query.trim() && (
            <div className='px-3 py-4 text-sm'>
              <p className='theme-title font-semibold'>No saved notes yet</p>
              <p className='theme-muted mt-1'>Generate a study set and it will appear here.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className='space-y-1'>
              {results.map((note) => (
                <li key={note._id}>
                  <button
                    type='button'
                    onClick={() => handleSelect(note)}
                    className='flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#fff3d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d99d42]'
                  >
                    <span className='mt-0.5 rounded-md border border-[#e4d3b8] bg-[#fffaf1] p-2 text-[#6d4d1f]'>
                      <FiFileText size={16} aria-hidden='true' />
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className='block truncate text-sm font-semibold text-[#33261d]'>{note.topic}</span>
                      <span className='theme-muted mt-1 flex flex-wrap gap-2 text-xs'>
                        {note.classLevel && <span>{note.classLevel}</span>}
                        {note.examType && <span>{note.examType}</span>}
                        {note.includeDiagram && <span>Diagram</span>}
                        {note.includeChart && <span>Chart</span>}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedNotesSearch
