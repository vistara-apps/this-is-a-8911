import React from 'react'
import { useLocation } from 'react-router-dom'
import Navigation from './Navigation'

export default function AppShell({ children }) {
  const location = useLocation()
  const isOnboarding = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 relative">
        {children}
      </main>
      {!isOnboarding && <Navigation />}
    </div>
  )
}