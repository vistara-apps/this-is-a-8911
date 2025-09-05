import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Mic, Clock, Crown, ChevronRight } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { stateRights, US_STATES } from '../data/stateRights'

export default function Dashboard() {
  const { user, selectedState, subscriptionStatus, encounters } = useUser()
  
  const stateData = stateRights[selectedState]
  const stateName = US_STATES.find(s => s.code === selectedState)?.name || selectedState
  const recentEncounters = encounters.slice(0, 3)

  return (
    <div className="min-h-screen pb-20">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome{user ? `, ${user.email?.split('@')[0]}` : ''}
            </h1>
            <p className="text-white/70">
              Your rights for {stateName}
            </p>
          </div>
          
          {subscriptionStatus === 'free' && (
            <Link
              to="/settings"
              className="flex items-center space-x-1 bg-accent/20 text-accent px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/30 transition-colors"
            >
              <Crown size={16} />
              <span>Upgrade</span>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/rights"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors group"
          >
            <Shield className="text-white mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-white font-semibold mb-1">My Rights</h3>
            <p className="text-white/70 text-sm">View state-specific legal rights</p>
          </Link>
          
          <Link
            to="/encounter"
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors group"
          >
            <Mic className="text-white mb-3 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-white font-semibold mb-1">Record</h3>
            <p className="text-white/70 text-sm">Start recording an encounter</p>
          </Link>
        </div>

        {/* Quick Rights Preview */}
        {stateData && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Quick Rights Card</h3>
              <Link
                to="/rights"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                <ChevronRight size={20} />
              </Link>
            </div>
            
            <div className="text-white/90 text-sm leading-relaxed">
              {stateData.keyRights.split('\n').slice(0, 3).map((right, index) => (
                <div key={index} className="mb-1">{right}</div>
              ))}
            </div>
            
            <Link
              to="/rights"
              className="inline-flex items-center space-x-1 text-accent hover:text-accent/80 text-sm font-medium mt-3 transition-colors"
            >
              <span>View full rights card</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {/* Recent Encounters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Encounters</h3>
            {encounters.length > 3 && (
              <Link
                to="/settings"
                className="text-accent hover:text-accent/80 text-sm transition-colors"
              >
                View all
              </Link>
            )}
          </div>
          
          {encounters.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="text-white/50 mx-auto mb-3" size={32} />
              <p className="text-white/70 text-sm">No encounters recorded yet</p>
              <Link
                to="/encounter"
                className="inline-block mt-3 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
              >
                Start your first recording
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEncounters.map((encounter) => (
                <div
                  key={encounter.recordId}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 font-medium text-sm">
                      {new Date(encounter.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-white/60 text-xs">
                      {encounter.stateId}
                    </span>
                  </div>
                  
                  {encounter.notes && (
                    <p className="text-white/70 text-sm line-clamp-2">
                      {encounter.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Prompt */}
        {subscriptionStatus === 'free' && (
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-lg p-6 mt-6">
            <div className="flex items-start space-x-3">
              <Crown className="text-accent flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1">Upgrade to Premium</h4>
                <p className="text-white/80 text-sm mb-3">
                  Get unlimited recording, advanced state insights, and community alerts
                </p>
                <Link
                  to="/settings"
                  className="inline-block bg-accent text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}