import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#fffaf1',
    primaryBorderColor: '#d99d42',
    primaryTextColor: '#33261d',
    lineColor: '#8b7b68',
    secondaryColor: '#edf7f0',
    tertiaryColor: '#f1edff',
  },
})

const cleanMermaidChart = (diagram) => {
  if (!diagram) return ''

  let clean = String(diagram)
    .replace(/\r\n/g, '\n')
    .replace(/^```mermaid/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim()

  clean = clean.replace(/^(graph|flowchart)\s*(TD|TB|BT|RL|LR)(?=\S)/i, '$1 $2\n')

  if (!/^(graph|flowchart)\s+(TD|TB|BT|RL|LR)/i.test(clean)) {
    clean = `graph TD\n${clean}`
  }

  return clean
}
const autoFixNodes = (diagram) => {
  let index = 0;

  return diagram.replace(/(^|[\s>|-])([A-Za-z][\w-]*)?\[(.*?)\]/g, (match, prefix, nodeId, label) => {
    if (nodeId) {
      return match;
    }

    index++;
    return `${prefix}N${index}["${label.trim()}"]`;
  });
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!diagram || !containerRef.current) return

    let isMounted = true

    const renderDiagram = async () => {
      containerRef.current.innerHTML = ''

      try {
        const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 9)}`
        const safeChart = autoFixNodes(cleanMermaidChart(diagram))
        const { svg } = await mermaid.render(uniqueId, safeChart)

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg
          const svgElement = containerRef.current.querySelector('svg')

          if (svgElement) {
            svgElement.style.maxWidth = 'none'
            svgElement.style.width = '100%'
            svgElement.style.minWidth = '720px'
          }
        }
      } catch (error) {
        console.error('Mermaid render failed:', error)

        if (isMounted && containerRef.current) {
          containerRef.current.textContent = 'Diagram could not be rendered.'
        }
      }
    }

    renderDiagram()

    return () => {
      isMounted = false
    }
  }, [diagram])

  return (
    <div className='theme-panel px-4 py-3 overflow-x-auto'>
      <div ref={containerRef} className='min-h-20 flex items-center' />
    </div>
  )
}

export default MermaidSetup
