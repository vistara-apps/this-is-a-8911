import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shieldRights_user')
    return saved ? JSON.parse(saved) : null
  })

  const [selectedState, setSelectedState] = useState(() => {
    const saved = localStorage.getItem('shieldRights_state')
    return saved || 'CA'
  })

  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    const saved = localStorage.getItem('shieldRights_subscription')
    return saved || 'free'
  })

  const [encounters, setEncounters] = useState(() => {
    const saved = localStorage.getItem('shieldRights_encounters')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('shieldRights_user', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('shieldRights_state', selectedState)
  }, [selectedState])

  useEffect(() => {
    localStorage.setItem('shieldRights_subscription', subscriptionStatus)
  }, [subscriptionStatus])

  useEffect(() => {
    localStorage.setItem('shieldRights_encounters', JSON.stringify(encounters))
  }, [encounters])

  const createUser = (userData) => {
    const newUser = {
      userId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    }
    setUser(newUser)
    return newUser
  }

  const updateUser = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }))
  }

  const addEncounter = (encounterData) => {
    const newEncounter = {
      recordId: crypto.randomUUID(),
      userId: user?.userId,
      stateId: selectedState,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...encounterData
    }
    setEncounters(prev => [newEncounter, ...prev])
    return newEncounter
  }

  const value = {
    user,
    selectedState,
    setSelectedState,
    subscriptionStatus,
    setSubscriptionStatus,
    encounters,
    createUser,
    updateUser,
    addEncounter,
    isPremium: subscriptionStatus === 'active'
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}