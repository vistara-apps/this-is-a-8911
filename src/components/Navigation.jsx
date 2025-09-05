import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Shield, Mic, Settings } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/rights', icon: Shield, label: 'Rights' },
    { path: '/encounter', icon: Mic, label: 'Record' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}