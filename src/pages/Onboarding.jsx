import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, MapPin, Mic, Share2 } from 'lucide-react'
import { useUser } from '../context/UserContext'
import StateSelector from '../components/StateSelector'

export default function Onboarding() {
  const navigate = useNavigate()
  const { createUser, setSelectedState, selectedState } = useUser()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: Shield,
      title: 'Know Your Rights',
      description: 'Access state-specific legal rights and guidance instantly when you need it most.'
    },
    {
      icon: Mic,
      title: 'Record Encounters',
      description: 'One-tap recording to document interactions and protect yourself with evidence.'
    },
    {
      icon: Share2,
      title: 'Share & Educate',
      description: 'Generate shareable content to educate your community and raise awareness.'
    }
  ]

  const handleGetStarted = () => {
    setStep(1)
  }

  const handleStateSelection = () => {
    setStep(2)
  }

  const handleComplete = () => {
    if (email) {
      createUser({ email })
    }
    navigate('/dashboard')
  }

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <div className="animate-fade-in">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8 mx-auto">
            <Shield size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Shield Rights
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-md">
            Your rights, at your fingertips, instantly.
          </p>
          
          <div className="space-y-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 text-left">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleGetStarted}
            className="w-full bg-accent hover:bg-accent/90 text-black font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <MapPin size={40} className="text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Select Your State
            </h2>
            <p className="text-white/80">
              We'll customize the legal information for your location
            </p>
          </div>
          
          <div className="mb-8">
            <StateSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
              variant="searchable"
            />
          </div>
          
          <button
            onClick={handleStateSelection}
            disabled={!selectedState}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              You're All Set!
            </h2>
            <p className="text-white/80 mb-6">
              Optional: Save your progress and get premium features
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <input
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Free Features:</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Basic rights cards for your state</li>
                <li>• Essential "what to say" scripts</li>
                <li>• Limited recording functionality</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            className="w-full bg-accent hover:bg-accent/90 text-black font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Enter Shield Rights
          </button>
          
          <p className="text-white/60 text-xs text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    )
  }
}