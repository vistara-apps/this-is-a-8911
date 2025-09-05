import React, { useState } from 'react'
import { ArrowLeft, Crown, User, MapPin, Trash2, Download, Mail, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { US_STATES } from '../data/stateRights'
import StateSelector from '../components/StateSelector'
import { StripeService } from '../services/api'

export default function Settings() {
  const { 
    user, 
    selectedState, 
    setSelectedState, 
    subscriptionStatus, 
    setSubscriptionStatus,
    encounters,
    updateUser 
  } = useUser()
  
  const [activeTab, setActiveTab] = useState('account')
  const [email, setEmail] = useState(user?.email || '')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  const stateName = US_STATES.find(s => s.code === selectedState)?.name || selectedState

  const handleUpgrade = async () => {
    if (!user) {
      alert('Please create an account first')
      return
    }

    setIsProcessingPayment(true)
    try {
      // Create customer if needed
      const customerResponse = await fetch('/api/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email || email,
          name: user.name || 'Shield Rights User',
          userId: user.userId
        })
      })

      if (!customerResponse.ok) {
        throw new Error('Failed to create customer')
      }

      const { customerId } = await customerResponse.json()

      // Create payment intent for $3.99/month
      const paymentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 3.99,
          metadata: { userId: user.userId, type: 'subscription' }
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await paymentResponse.json()

      // Initialize Stripe and confirm payment
      const stripe = await StripeService.initialize()
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real implementation, you'd collect card details from user
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123'
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      setSubscriptionStatus('active')
      alert('Upgrade successful!')
    } catch (error) {
      console.error('Payment failed:', error)
      alert(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: user.subscriptionId, // You'd need to store this
          userId: user.userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      setSubscriptionStatus('cancelled')
      alert('Subscription cancelled successfully')
    } catch (error) {
      console.error('Cancellation failed:', error)
      alert(`Failed to cancel subscription: ${error.message}`)
    }
  }

  const handleUpdateEmail = () => {
    if (email && user) {
      updateUser({ email })
      alert('Email updated successfully')
    }
  }

  const handleExportData = () => {
    const data = {
      user,
      selectedState,
      encounters,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shield-rights-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAllData = () => {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
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
        
        <h1 className="text-white font-semibold">Settings</h1>
        
        <div className="w-10" />
      </div>

      <div className="px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'account' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscription' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'data' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Data
          </button>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="text-white" size={20} />
                <h3 className="text-white font-semibold">Account Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <button
                      onClick={handleUpdateEmail}
                      className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors text-sm"
                    >
                      Update
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    User ID
                  </label>
                  <div className="text-white/60 text-sm font-mono bg-white/5 px-3 py-2 rounded-lg">
                    {user?.userId || 'Not logged in'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-white" size={20} />
                <h3 className="text-white font-semibold">Location Settings</h3>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Primary State
                </label>
                <StateSelector
                  selectedState={selectedState}
                  onStateChange={setSelectedState}
                />
                <p className="text-white/60 text-xs mt-2">
                  Legal rights information will be customized for {stateName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="text-white" size={20} />
                <h3 className="text-white font-semibold">Subscription Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">
                      {subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                    </div>
                    <div className="text-white/60 text-sm">
                      {subscriptionStatus === 'active' 
                        ? 'Access to all premium features' 
                        : 'Basic features only'
                      }
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscriptionStatus === 'active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {subscriptionStatus === 'active' ? 'Active' : 'Free'}
                  </div>
                </div>
                
                {subscriptionStatus === 'free' && (
                  <div>
                    <button
                      onClick={handleUpgrade}
                      className="w-full bg-accent hover:bg-accent/90 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Upgrade to Premium - $3.99/month
                    </button>
                  </div>
                )}
                
                {subscriptionStatus === 'active' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-6 rounded-lg transition-colors border border-red-500/30"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h4 className="text-white font-medium mb-4">Premium Features</h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subscriptionStatus === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span>Unlimited audio recording</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subscriptionStatus === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span>Advanced state-specific insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subscriptionStatus === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span>Community alerts and updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    subscriptionStatus === 'active' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                  <span>Priority customer support</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Your Data</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Encounter Records</div>
                    <div className="text-white/60 text-sm">
                      {encounters.length} recorded encounters
                    </div>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Download size={16} className="text-white" />
                    <span className="text-white text-sm">Export</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
              <h4 className="text-red-100 font-medium mb-2">Danger Zone</h4>
              <p className="text-red-100/80 text-sm mb-4">
                Permanently delete all your data. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAllData}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete All Data</span>
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h4 className="text-white font-medium mb-4">Support & Contact</h4>
              <div className="space-y-3">
                <a
                  href="mailto:support@shieldrights.app"
                  className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <Mail size={16} />
                  <span>support@shieldrights.app</span>
                </a>
                <p className="text-white/60 text-sm">
                  For questions, feedback, or technical support
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
