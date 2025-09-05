import React, { useState } from 'react'
import { Copy, Volume2 } from 'lucide-react'

export default function ScriptDisplay({ scripts, variant = 'plain' }) {
  const [language, setLanguage] = useState('en')
  const [selectedScript, setSelectedScript] = useState('traffic_stop')

  const scriptTypes = [
    { key: 'traffic_stop', label: 'Traffic Stop' },
    { key: 'search_request', label: 'Search Request' },
    { key: 'detention', label: 'Detention' }
  ]

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const currentScript = scripts[language]?.[selectedScript] || ''

  return (
    <div className="space-y-4">
      {/* Language Toggle */}
      <div className="flex bg-white/10 rounded-lg p-1">
        <button
          onClick={() => setLanguage('en')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            language === 'en' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            language === 'es' 
              ? 'bg-white/20 text-white' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          Español
        </button>
      </div>

      {/* Script Type Selector */}
      <div className="space-y-2">
        {scriptTypes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedScript(key)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedScript === key
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15'
            }`}
          >
            <div className="font-medium text-sm">{label}</div>
            <div className="text-xs mt-1 opacity-75">
              {scripts[language]?.[key]?.substring(0, 50)}...
            </div>
          </button>
        ))}
      </div>

      {/* Selected Script Display */}
      {currentScript && (
        <div className={`p-4 rounded-lg border ${
          variant === 'highlight' 
            ? 'bg-accent/20 border-accent/30 text-textPrimary' 
            : 'bg-white/10 border-white/20 text-white'
        }`}>
          <div className="mb-3">
            <h4 className="font-medium text-sm opacity-75">
              {scriptTypes.find(s => s.key === selectedScript)?.label}
            </h4>
          </div>
          
          <p className="leading-relaxed mb-4">
            {currentScript}
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopy(currentScript)}
              className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              <Copy size={14} />
              <span>Copy</span>
            </button>
            
            <button
              onClick={() => handleSpeak(currentScript)}
              className="flex items-center space-x-1 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              <Volume2 size={14} />
              <span>Listen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}