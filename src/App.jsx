import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import RightsCard from './pages/RightsCard'
import Encounter from './pages/Encounter'
import Settings from './pages/Settings'
import { UserProvider } from './context/UserContext'

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
        <AppShell>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rights" element={<RightsCard />} />
            <Route path="/encounter" element={<Encounter />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppShell>
      </div>
    </UserProvider>
  )
}

export default App