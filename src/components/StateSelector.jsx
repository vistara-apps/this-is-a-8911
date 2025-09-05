import React, { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { US_STATES } from '../data/stateRights'

export default function StateSelector({ 
  selectedState, 
  onStateChange, 
  variant = 'dropdown' 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStates = US_STATES.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedStateName = US_STATES.find(state => state.code === selectedState)?.name || 'Select State'

  const handleStateSelect = (stateCode) => {
    onStateChange(stateCode)
    setIsOpen(false)
    setSearchTerm('')
  }

  if (variant === 'searchable') {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-h-60 overflow-y-auto z-50">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                onClick={() => handleStateSelect(state.code)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-white border-b border-white/10 last:border-b-0"
              >
                <div className="font-medium">{state.name}</div>
                <div className="text-sm text-white/60">{state.code}</div>
              </button>
            ))}
            {filteredStates.length === 0 && (
              <div className="px-4 py-3 text-white/60 text-center">
                No states found
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <span>{selectedStateName}</span>
        <ChevronDown 
          size={18} 
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-h-60 overflow-y-auto z-50">
          {US_STATES.map((state) => (
            <button
              key={state.code}
              onClick={() => handleStateSelect(state.code)}
              className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                state.code === selectedState 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80'
              }`}
            >
              <div className="font-medium">{state.name}</div>
              <div className="text-sm text-white/60">{state.code}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}