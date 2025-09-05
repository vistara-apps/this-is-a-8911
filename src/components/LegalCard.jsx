import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Share2, Copy } from 'lucide-react'

export default function LegalCard({ stateData, variant = 'default' }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [language, setLanguage] = useState('en')

  const sections = [
    { key: 'keyRights', title: 'Your Rights', content: stateData.keyRights },
    { key: 'doNotSay', title: 'What NOT to Say', content: stateData.doNotSay },
    { key: 'specificLaws', title: 'State Laws', content: stateData.specificLaws }
  ]

  const handleShare = async () => {
    const content = `Shield Rights - ${stateData.stateName}\n\n${sections[currentSection].title}:\n${sections[currentSection].content}\n\nGet the app: shieldrights.app`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shield Rights - ${stateData.stateName}`,
          text: content
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(content)
      }
    } else {
      navigator.clipboard.writeText(content)
    }
  }

  const cardClasses = variant === 'condensed' 
    ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4' 
    : 'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6'

  return (
    <div className={`${cardClasses} animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {stateData.stateName}
        </h2>
        <button
          onClick={handleShare}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Share2 size={18} className="text-white" />
        </button>
      </div>

      <div className="flex space-x-1 mb-6">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`flex-1 h-1 rounded-full transition-colors ${
              index === currentSection ? 'bg-accent' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">
          {sections[currentSection].title}
        </h3>
        <div className="text-white/90 whitespace-pre-line leading-relaxed">
          {sections[currentSection].content}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">Previous</span>
        </button>

        <span className="text-white/70 text-sm">
          {currentSection + 1} of {sections.length}
        </span>

        <button
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
          className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          <span className="text-sm">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}