import React, { useState } from 'react'
import { ArrowLeft, Download, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { stateRights, US_STATES } from '../data/stateRights'
import LegalCard from '../components/LegalCard'
import ScriptDisplay from '../components/ScriptDisplay'
import StateSelector from '../components/StateSelector'
import ShareButton from '../components/ShareButton'

export default function RightsCard() {
  const { selectedState, setSelectedState } = useUser()
  const [activeTab, setActiveTab] = useState('rights')
  const [showStateSelector, setShowStateSelector] = useState(false)
  
  const stateData = stateRights[selectedState]
  const stateName = US_STATES.find(s => s.code === selectedState)?.name || selectedState

  if (!stateData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-4">
            Rights data not available for {stateName}
          </h2>
          <p className="text-white/70 mb-6">
            Please select a different state or check back later.
          </p>
          <StateSelector
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <Link
          to="/dashboard"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="text-white" size={24} />
        </Link>
        
        <h1 className="text-white font-semibold">Legal Rights</h1>
        
        <button
          onClick={() => setShowStateSelector(!showStateSelector)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Settings className="text-white" size={24} />
        </button>
      </div>

      <div className="px-4 py-6">
        {/* State Selector */}
        {showStateSelector && (
          <div className="mb-6 animate-slide-up">
            <h3 className="text-white font-medium mb-3">Change State</h3>
            <StateSelector
              selectedState={selectedState}
              onStateChange={(state) => {
                setSelectedState(state)
                setShowStateSelector(false)
              }}
              variant="searchable"
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('rights')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rights' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Rights Card
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'scripts' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            What to Say
          </button>
        </div>

        {/* Content */}
        {activeTab === 'rights' ? (
          <div className="space-y-6">
            <LegalCard stateData={stateData} />
            
            <ShareButton
              content={`${stateData.keyRights}\n\n${stateData.doNotSay}`}
              title={`Shield Rights - ${stateName}`}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h2 className="text-white font-semibold mb-4">Emergency Scripts</h2>
              <p className="text-white/80 text-sm mb-6">
                Pre-written phrases to help you communicate clearly and protect your rights during encounters.
              </p>
              
              <ScriptDisplay scripts={stateData.scripts} variant="highlight" />
            </div>
            
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-100 font-medium text-sm mb-2">
                ⚠️ Important Reminder
              </h4>
              <p className="text-amber-100/80 text-sm">
                Stay calm, speak clearly, and remember that you have the right to remain silent. 
                These scripts are suggestions - adapt them to your specific situation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}