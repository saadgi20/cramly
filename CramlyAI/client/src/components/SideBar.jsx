import React from 'react'

function Sidebar({ result }) {
    const data = result?.data ?? result
    const subTopics = data?.subTopics ?? {}
    const questions = data?.questions ?? {}
    const importance = data?.importance ?? ''
    const subTopicEntries = Object.entries(subTopics).filter(([, topics]) => Array.isArray(topics))

    if (!data || subTopicEntries.length === 0) {
        return null
    }

    return (
        <aside className='theme-panel min-w-0 px-4 py-5 space-y-5 overflow-hidden'>
            <div className='flex min-w-0 items-center gap-2'>
                <span className='text-sm text-[#d99d42]'>&#128204;</span>
                <h3 className='theme-title break-words text-base font-semibold'>
                    Quick Exam View
                </h3>
            </div>

            <section>
                <p className='text-xs font-semibold text-[#4b3a2b] mb-3'>
                    &#11088; Sub Topics (Priority Wise)
                </p>

                <div className='space-y-2'>
                    {subTopicEntries.map(([star, topics]) => (
                        <div key={star} className='min-w-0 rounded-md bg-[#fffaf1] border border-[#e4d3b8] px-3 py-2'>
                            <p className='break-words text-xs font-semibold text-[#b97927]'>
                                {formatPriority(star)} Priority
                            </p>
                            <ul className='theme-muted mt-2 list-disc ml-4 break-words text-xs space-y-1'>
                                {topics.map((topic, index) => (
                                    <li className='break-words' key={index}>{topic}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {(importance || questions.short || questions.long || questions.diagram) && (
                <section className='min-w-0 rounded-md bg-[#fdf1d8] border border-[#efd096] p-3'>
                    {importance && (
                        <>
                            <p className='text-xs font-semibold text-[#4b3a2b] mb-1'>
                                &#128293; Exam Importance
                            </p>
                            <span className='break-words text-[#9b681f] font-bold text-xs'>
                                {importance}
                            </span>
                        </>
                    )}

                    {(questions.short || questions.long || questions.diagram) && (
                    <p className='text-xs mt-3 font-semibold text-[#4b3a2b] mb-3'>
                            &#10067; Important Questions
                        </p>
                    )}

                    {Array.isArray(questions.short) && questions.short.length > 0 && (
                        <QuestionList title='Short Questions' questions={questions.short} className='bg-[#edf7f0] border-[#b7dbc6] text-[#28543b]' />
                    )}

                    {Array.isArray(questions.long) && questions.long.length > 0 && (
                        <QuestionList title='Long Questions' questions={questions.long} className='bg-[#f1edff] border-[#c9b8f4] text-[#453879]' />
                    )}

                    {questions.diagram && (
                        <QuestionList title='Diagram Question' questions={[questions.diagram]} className='bg-[#fffaf1] border-[#e4d3b8] text-[#5b4426]' />
                    )}
                </section>
            )}
        </aside>
    )
}

function QuestionList({ title, questions, className }) {
    return (
        <div className={`mb-3 min-w-0 rounded-md border p-3 ${className}`}>
            <p className='break-words text-xs font-medium mb-2'>
                {title}
            </p>
            <ul className='theme-muted list-disc ml-4 break-words text-xs space-y-1'>
                {questions.map((question, index) => (
                    <li className='break-words' key={index}>{question}</li>
                ))}
            </ul>
        </div>
    )
}

function formatPriority(star) {
    if (/^\d+$/.test(String(star))) {
        return String.fromCodePoint(11088).repeat(Number(star))
    }

    return star
}

export default Sidebar
