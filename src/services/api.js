/**
 * API Service Layer for Shield Rights
 * Handles all external API integrations as specified in the PRD
 */

// API Configuration
const API_CONFIG = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  pinata: {
    baseUrl: 'https://api.pinata.cloud',
    apiKey: import.meta.env.VITE_PINATA_API_KEY,
    secretKey: import.meta.env.VITE_PINATA_SECRET_KEY
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  }
}

/**
 * OpenAI Service for content generation and translation
 */
export class OpenAIService {
  static async generateShareableContent(encounterData, userState) {
    try {
      const response = await fetch(`${API_CONFIG.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a legal rights educator. Generate concise, shareable summaries of legal encounters that educate others about their rights. Keep it factual, non-inflammatory, and educational.'
            },
            {
              role: 'user',
              content: `Generate a shareable summary for a legal encounter in ${userState}. Include key rights information and what was learned. Encounter details: ${JSON.stringify(encounterData)}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Unable to generate content'
    } catch (error) {
      console.error('OpenAI content generation failed:', error)
      return 'Content generation temporarily unavailable'
    }
  }

  static async translateScript(text, targetLanguage = 'es') {
    try {
      const response = await fetch(`${API_CONFIG.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator specializing in legal terminology. Translate the following legal script to ${targetLanguage === 'es' ? 'Spanish' : targetLanguage} while maintaining legal accuracy and formality.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 150,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || text
    } catch (error) {
      console.error('Translation failed:', error)
      return text
    }
  }
}

/**
 * Supabase Service for backend data management
 */
export class SupabaseService {
  static supabase = null

  static async initialize() {
    if (!this.supabase && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      const { createClient } = await import('@supabase/supabase-js')
      this.supabase = createClient(API_CONFIG.supabase.url, API_CONFIG.supabase.anonKey)
    }
    return this.supabase
  }

  static async createUser(userData) {
    const supabase = await this.initialize()
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userData.userId,
          selected_state: userData.selectedState,
          subscription_status: userData.subscriptionStatus || 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase user creation failed:', error)
      throw error
    }
  }

  static async updateUser(userId, updates) {
    const supabase = await this.initialize()
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase user update failed:', error)
      throw error
    }
  }

  static async saveEncounter(encounterData) {
    const supabase = await this.initialize()
    try {
      const { data, error } = await supabase
        .from('encounter_records')
        .insert([{
          record_id: encounterData.recordId,
          user_id: encounterData.userId,
          state_id: encounterData.stateId,
          timestamp: encounterData.timestamp,
          audio_file_path: encounterData.audioFilePath,
          notes: encounterData.notes,
          shared_content: encounterData.sharedContent,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Supabase encounter save failed:', error)
      throw error
    }
  }

  static async getUserEncounters(userId) {
    const supabase = await this.initialize()
    try {
      const { data, error } = await supabase
        .from('encounter_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Supabase encounters fetch failed:', error)
      return []
    }
  }

  static async getStateRights(stateId) {
    const supabase = await this.initialize()
    try {
      const { data, error } = await supabase
        .from('state_rights')
        .select('*')
        .eq('state_id', stateId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Supabase state rights fetch failed:', error)
      return null
    }
  }
}

/**
 * Pinata Service for IPFS storage
 */
export class PinataService {
  static async uploadAudioFile(audioBlob, fileName) {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, fileName)
      
      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          app: 'shield-rights',
          type: 'audio-recording',
          timestamp: new Date().toISOString()
        }
      })
      formData.append('pinataMetadata', metadata)

      const options = JSON.stringify({
        cidVersion: 0
      })
      formData.append('pinataOptions', options)

      const response = await fetch(`${API_CONFIG.pinata.baseUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': API_CONFIG.pinata.apiKey,
          'pinata_secret_api_key': API_CONFIG.pinata.secretKey
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.status}`)
      }

      const data = await response.json()
      return {
        ipfsHash: data.IpfsHash,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        size: data.PinSize
      }
    } catch (error) {
      console.error('Pinata upload failed:', error)
      throw error
    }
  }

  static async getFileInfo(ipfsHash) {
    try {
      const response = await fetch(`${API_CONFIG.pinata.baseUrl}/data/pinList?hashContains=${ipfsHash}`, {
        headers: {
          'pinata_api_key': API_CONFIG.pinata.apiKey,
          'pinata_secret_api_key': API_CONFIG.pinata.secretKey
        }
      })

      if (!response.ok) {
        throw new Error(`Pinata info fetch failed: ${response.status}`)
      }

      const data = await response.json()
      return data.rows[0] || null
    } catch (error) {
      console.error('Pinata file info fetch failed:', error)
      return null
    }
  }
}

/**
 * Stripe Service for payment processing
 */
export class StripeService {
  static stripe = null

  static async initialize() {
    if (!this.stripe && typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      const { loadStripe } = await import('@stripe/stripe-js')
      this.stripe = await loadStripe(API_CONFIG.stripe.publishableKey)
    }
    return this.stripe
  }

  static async createPaymentIntent(amount, currency = 'usd') {
    try {
      // This would typically call your backend endpoint
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency
        })
      })

      if (!response.ok) {
        throw new Error(`Payment intent creation failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error)
      throw error
    }
  }

  static async confirmPayment(clientSecret, paymentMethod) {
    const stripe = await this.initialize()
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.paymentIntent
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error)
      throw error
    }
  }

  static async createSubscription(priceId, customerId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          customerId
        })
      })

      if (!response.ok) {
        throw new Error(`Subscription creation failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stripe subscription creation failed:', error)
      throw error
    }
  }
}

/**
 * Utility function to check if all required environment variables are set
 */
export function validateApiConfig() {
  const missing = []
  
  if (!API_CONFIG.openai.apiKey) missing.push('VITE_OPENAI_API_KEY')
  if (!API_CONFIG.supabase.url) missing.push('VITE_SUPABASE_URL')
  if (!API_CONFIG.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  if (!API_CONFIG.pinata.apiKey) missing.push('VITE_PINATA_API_KEY')
  if (!API_CONFIG.pinata.secretKey) missing.push('VITE_PINATA_SECRET_KEY')
  if (!API_CONFIG.stripe.publishableKey) missing.push('VITE_STRIPE_PUBLISHABLE_KEY')

  if (missing.length > 0) {
    console.warn('Missing API configuration:', missing)
    return false
  }

  return true
}
